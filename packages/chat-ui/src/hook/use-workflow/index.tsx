import { useState, useEffect, useCallback, useMemo } from 'react'
import { WorkflowSDK } from './sdk'

export interface WorkflowEvent {
  name: string
}

export interface AnyWorkflowEvent extends WorkflowEvent {
  [key: string]: any
}

export type WorkflowStatus = 'idle' | 'running' | 'complete' | 'error'

export interface WorkflowHookParams<
  O extends WorkflowEvent = AnyWorkflowEvent,
> {
  baseUrl?: string // Optional base URL for the workflow API
  workflow: string // Name of the registered deployment
  sessionId?: string // Optional session ID for resuming a session
  taskId?: string // Optional task ID for resuming a workflow
  onStop?: (event: O[]) => void // Callback when finished streaming events
  onError?: (error: any) => void // Callback for errors
}

/** Return value from the hook */
export interface WorkflowHookHandler<
  I extends WorkflowEvent = AnyWorkflowEvent,
  O extends WorkflowEvent = AnyWorkflowEvent,
> {
  taskId?: string // Task ID once the workflow session starts
  sessionId?: string // Session ID once the workflow session starts
  events: (I | O)[] // List of all events (input and output)
  status: WorkflowStatus // Status of the workflow
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
    baseUrl,
    workflow: deploymentName,
    taskId: initialTaskId,
    sessionId: initialSessionId,
    onStop,
    onError,
  } = params

  const sdk = useMemo(
    () => new WorkflowSDK({ baseUrl, deploymentName }),
    [baseUrl, deploymentName]
  )

  const [isInitialized, setIsInitialized] = useState(false)
  const [sessionId, setSessionId] = useState<string>()
  const [taskId, setTaskId] = useState<string>()
  const [events, setEvents] = useState<(I | O)[]>([])
  const [status, setStatus] = useState<WorkflowStatus>('idle')

  // stream events from the task
  const streamTaskEvents = useCallback(
    async (taskId: string, sessionId: string) => {
      setStatus('running')

      // stream events from the task
      const allEvents = await sdk.streamTaskEvents(taskId, sessionId, {
        onData: (data: string) => {
          setEvents(prev => [...prev, JSON.parse(data)])
        },
        onError: (error: Error) => {
          setStatus('error')
          onError?.(error)
        },
        onStop: (result: string[]) => {
          onStop?.(result.map(item => JSON.parse(item)) as O[])
        },
      })

      setStatus('complete')

      return allEvents.map(item => JSON.parse(item))
    },
    [sdk, onError, onStop]
  )

  // initialize workflow, create session and stream events if task id is provided
  useEffect(() => {
    const initWorkflow = async () => {
      let startSessionId = initialSessionId

      // create session if not provided
      if (!startSessionId) {
        const sessionData = await sdk.createSession()
        startSessionId = sessionData.session_id
      }
      setSessionId(startSessionId)

      // if task id is provided, initialize events
      if (initialTaskId) {
        setTaskId(initialTaskId)
        await streamTaskEvents(initialTaskId, startSessionId)
      }

      setIsInitialized(true)
    }

    if (!isInitialized) {
      initWorkflow()
    }
  }, [initialSessionId, initialTaskId, sdk, isInitialized, streamTaskEvents])

  // Send an event to create new task or resume existing task
  const sendEvent = useCallback(
    async (event: I): Promise<void> => {
      if (!sessionId) {
        throw new Error('Cannot send event: No active session')
      }

      setStatus('running')

      try {
        let runTaskId = taskId
        if (runTaskId) {
          // if task id is provided, resume the workflow
          await sdk.sendEventToTask(
            runTaskId,
            sessionId,
            JSON.stringify({
              service_id: deploymentName,
              event_obj_str: JSON.stringify(event),
            })
          )
        } else {
          // if not task id, create a new task with input event to start the workflow
          const taskData = await sdk.createDeploymentTaskNoWait(
            { input: JSON.stringify(event) },
            sessionId
          )
          runTaskId = taskData.task_id
          setTaskId(taskData.task_id)
        }

        // stream events from the task
        await streamTaskEvents(runTaskId, sessionId)
      } catch (error) {
        setStatus('error')
      }
    },
    [sessionId, taskId, sdk, deploymentName, streamTaskEvents]
  )

  return {
    sessionId,
    taskId,
    events,
    status,
    sendEvent,
  }
}
