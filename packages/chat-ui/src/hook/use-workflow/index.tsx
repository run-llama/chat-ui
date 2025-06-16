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
      if (!sessionId) {
        throw new Error('Cannot send event: No active session')
      }

      let eventTaskId = taskId

      // if not task id, create a new task with event as input to start the workflow
      if (!eventTaskId) {
        const taskData = await sdk.createDeploymentTaskNoWait(
          { input: JSON.stringify(event) },
          sessionId
        )
        eventTaskId = taskData.task_id
        setTaskId(eventTaskId)
      }

      // if task id is provided, resume the workflow
      await sdk.sendEventToTask(
        eventTaskId,
        sessionId,
        JSON.stringify({
          service_id: deploymentName,
          event_obj_str: JSON.stringify(event),
        })
      )

      // get events from the task
      const allEvents = await sdk.getTaskEvents(eventTaskId, sessionId)
      setEvents(allEvents.map(item => JSON.parse(item)))
      setIsComplete(true)
    },
    [sessionId, taskId, sdk, deploymentName]
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
