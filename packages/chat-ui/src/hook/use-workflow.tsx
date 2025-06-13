import { useState, useEffect, useCallback } from 'react'

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
  taskId?: string | null // Optional task ID for resuming a workflow
  sessionId?: string | null // Optional session ID for resuming a session
  onError?: (error: any) => void // Callback for errors
  onStopEvent?: (event: O) => void // Callback for StopEvent
}

/** Return value from the hook */
export interface WorkflowHookHandler<
  I extends WorkflowEvent = AnyWorkflowEvent,
  O extends WorkflowEvent = AnyWorkflowEvent,
> {
  taskId?: string | null // Task ID once the workflow session starts
  sessionId?: string | null // Session ID once the workflow session starts
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
    workflow,
    taskId: initialTaskId,
    sessionId: initialSessionId,
    onStopEvent: _onStopEvent, // TODO: fix this
    onError,
    baseUrl = 'http://localhost:8000',
  } = params

  // State management
  const [taskId, setTaskId] = useState<string | null | undefined>(initialTaskId)
  const [sessionId, setSessionId] = useState<string | null | undefined>(
    initialSessionId
  )
  const [events, setEvents] = useState<(I | O)[]>([])
  const [isComplete, setIsComplete] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  // TODO: maybe have refresh events or auto poll for events

  // Start or resume a workflow session
  useEffect(() => {
    let isMounted = true

    const startWorkflow = async () => {
      try {
        if (initialTaskId && initialSessionId) {
          // Resume existing workflow
          const response = await fetch(
            `${baseUrl}/deployments/${workflow}/tasks/${initialTaskId}/events?session_id=${initialSessionId}`
          )
          if (!response.ok) {
            throw new Error('Failed to fetch events')
          }
          const allEvents: (I | O)[] = await response.json()
          if (isMounted) {
            setEvents(allEvents)
            setTaskId(initialTaskId)
            setSessionId(initialSessionId)
          }
        } else {
          // Create new session first
          const sessionResponse = await fetch(
            `${baseUrl}/deployments/${workflow}/sessions/create`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            }
          )
          if (!sessionResponse.ok) {
            throw new Error('Failed to create session')
          }
          const sessionData = (await sessionResponse.json()) as {
            session_id: string
          }
          const newSessionId = sessionData.session_id

          // Create new task
          const taskResponse = await fetch(
            `${baseUrl}/deployments/${workflow}/tasks/create?session_id=${newSessionId}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                input: JSON.stringify({ message: '' }), // Empty input to start the workflow
              }),
            }
          )
          if (!taskResponse.ok) {
            throw new Error('Failed to create task')
          }
          const taskData = (await taskResponse.json()) as { task_id: string }

          if (isMounted) {
            setTaskId(taskData.task_id)
            setSessionId(newSessionId)
          }
        }
      } catch (error) {
        if (isMounted) {
          setIsError(true)
          onError?.(error)
        }
      }
    }

    startWorkflow()

    return () => {
      isMounted = false
    }
  }, [])

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
    [taskId, sessionId, workflow, baseUrl, onError, isError]
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
