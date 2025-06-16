import { useState, useEffect, useCallback, useMemo } from 'react'
import { WorkflowSDK } from './sdk'

export interface WorkflowEvent {
  name: string
}

export interface AnyWorkflowEvent extends WorkflowEvent {
  [key: string]: any
}

export type TaskStatus = 'idle' | 'running' | 'complete' | 'error'

export interface WorkflowHookParams<
  O extends WorkflowEvent = AnyWorkflowEvent,
> {
  baseUrl?: string // Optional base URL for the workflow API
  workflow: string // Name of the registered deployment
  sessionId?: string // Optional session ID for resuming a workflow session
  taskId?: string // Optional task ID for resuming a workflow task
  onStop?: (event: O[], taskId: string) => void // Callback when finished streaming events
  onError?: (error: any, taskId: string) => void // Callback for errors
}

/** Return value from the hook */
export interface WorkflowHookHandler<
  I extends WorkflowEvent = AnyWorkflowEvent,
  O extends WorkflowEvent = AnyWorkflowEvent,
> {
  taskId?: string // Current Task ID (initiated by sendEvent)
  sessionId?: string // Session ID once the workflow session starts
  events: (I | O)[] // List of all events (input and output) for the current task
  eventsByTaskId: Record<string, (I | O)[]>
  taskStatuses: Record<string, TaskStatus> // Status of the workflow by task
  sendEvent: (event: I, taskId?: string) => Promise<string> // Function to send an event, returns the task id - if taskId is provided, it will will send the event to the task, otherwise it will create a new task
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
  const [eventsByTaskId, setEventsByTaskId] = useState<
    Record<string, (I | O)[]>
  >({})
  const [taskStatuses, setTaskStatuses] = useState<Record<string, TaskStatus>>(
    {}
  )

  // stream events from the task
  const streamTaskEvents = useCallback(
    async (taskId: string, sessionId: string) => {
      setTaskStatuses(prev => ({ ...prev, [taskId]: 'running' }))

      // stream events from the task
      const allEvents = await sdk.streamTaskEvents(taskId, sessionId, {
        onData: (data: string) => {
          const event = JSON.parse(data)
          setEvents(prev => [...prev, event])
          setEventsByTaskId(prev => ({
            ...prev,
            [taskId]: [...(prev[taskId] || []), event],
          }))
        },
        onError: (error: Error) => {
          setTaskStatuses(prev => ({ ...prev, [taskId]: 'error' }))
          onError?.(error, taskId)
        },
        onStop: (result: string[]) => {
          onStop?.(result.map(item => JSON.parse(item)) as O[], taskId)
        },
      })

      setTaskStatuses(prev => ({ ...prev, [taskId]: 'complete' }))

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
    async (event: I, targetTaskId?: string): Promise<string> => {
      if (!sessionId) {
        throw new Error('Cannot send event: No active session')
      }

      let runTaskId = targetTaskId
      try {
        if (runTaskId) {
          const taskIdForStatus = runTaskId
          setTaskStatuses(prev => ({ ...prev, [taskIdForStatus]: 'running' }))
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
          const taskIdForStatus = runTaskId
          setTaskStatuses(prev => ({ ...prev, [taskIdForStatus]: 'running' }))
        }
        setTaskId(runTaskId)

        // stream events from the task
        await streamTaskEvents(runTaskId, sessionId)
        return runTaskId
      } catch (error) {
        if (runTaskId) {
          const taskIdForStatus = runTaskId
          setTaskStatuses(prev => ({ ...prev, [taskIdForStatus]: 'error' }))
        }
        onError?.(error, runTaskId || '')
        throw error
      }
    },
    [sessionId, sdk, deploymentName, streamTaskEvents, onError]
  )

  return {
    sessionId,
    taskId,
    events,
    eventsByTaskId,
    taskStatuses,
    sendEvent,
  }
}
