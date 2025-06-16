import { useState, useEffect, useCallback, useMemo } from 'react'
import { WorkflowSDK } from './sdk'

export interface WorkflowEvent {
  name: string
}

export interface AnyWorkflowEvent extends WorkflowEvent {
  [key: string]: any
}

export interface WorkflowHookParams<
  O extends WorkflowEvent = AnyWorkflowEvent,
> {
  baseUrl?: string // Optional base URL for the workflow API
  workflow: string // Name of the registered deployment
  taskId?: string // Optional task ID for resuming a workflow
  sessionId?: string // Optional session ID for resuming a session
  onError?: (error: any) => void // Callback for errors
  onStopEvent?: (event: O) => void // Callback for StopEvent
}

/** Return value from the hook */
export interface WorkflowHookHandler<
  I extends WorkflowEvent = AnyWorkflowEvent,
  O extends WorkflowEvent = AnyWorkflowEvent,
> {
  taskId?: string // Task ID once the workflow session starts
  sessionId?: string // Session ID once the workflow session starts
  events: (I | O)[] // List of all events (input and output)
  backfillIndex: number // Index separating backfilled events
  isComplete: boolean // Whether the workflow is complete
  isError: boolean // Whether the workflow has errored
  sendEvent: (event: I) => Promise<void> // Function to send an event
}

/**
 * useWorkflow hook for consuming llama-deploy workflows
 */
export function useWorkflow<
  I extends WorkflowEvent = AnyWorkflowEvent,
  O extends WorkflowEvent = AnyWorkflowEvent,
>(params: WorkflowHookParams<O>): WorkflowHookHandler<I, O> {
  const {
    workflow: deploymentName,
    taskId: initialTaskId,
    sessionId: initialSessionId,
    onStopEvent: _onStopEvent, // TODO: fix this
    onError,
    baseUrl = '',
  } = params

  const sdk = useMemo(
    () => new WorkflowSDK({ baseUrl, deploymentName }),
    [baseUrl, deploymentName]
  )

  const [taskId, setTaskId] = useState<string>()
  const [sessionId, setSessionId] = useState<string>()
  const [events, setEvents] = useState<(I | O)[]>([])
  const [isComplete, setIsComplete] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    const startWorkflow = async () => {
      try {
        let startSessionId = initialSessionId

        // create session if not provided
        if (!startSessionId) {
          const sessionData = await sdk.createSession()
          startSessionId = sessionData.session_id
        }

        // if task id is provided, initialize events
        if (initialTaskId) {
          const allEvents = await sdk.getTaskEvents(
            initialTaskId,
            startSessionId
          )
          setEvents(allEvents.map(event => JSON.parse(event)))
        }

        setSessionId(startSessionId)
        setTaskId(initialTaskId)
      } catch (error) {
        setIsError(true)
        onError?.(error)
      }
    }

    startWorkflow()
  }, [initialSessionId, initialTaskId, onError, sdk])

  // Function to send an event to the server
  const sendEvent = useCallback(
    async (event: I): Promise<void> => {
      if (!taskId || !sessionId || isError) {
        throw new Error(
          'Cannot send event: No active task/session or workflow in error state'
        )
      }

      try {
        const eventDefinition = {
          // TODO: should get service_id when creating the task
          service_id: workflow,
          event_obj_str: JSON.stringify(event),
        }

        const response = await fetch(
          `${baseUrl}/deployments/${workflow}/tasks/${taskId}/events?session_id=${sessionId}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventDefinition),
          }
        )

        if (!response.ok) {
          throw new Error('Failed to send event')
        }

        setEvents(prev => [...prev, event])
        setIsComplete(false) // Reset isComplete on new event
      } catch (error) {
        setIsError(true)
        onError?.(error)
        throw error
      }
    },
    [taskId, sessionId, baseUrl, onError, isError]
  )

  return {
    taskId,
    sessionId,
    events,
    isComplete,
    isError,
    sendEvent,
    backfillIndex: 0, // TODO: handle later
  }
}
