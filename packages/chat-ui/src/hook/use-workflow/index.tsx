import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { WorkflowSDK } from './sdk'

export interface WorkflowEvent {
  name: string
  [key: string]: any
}

export type TaskStatus = 'idle' | 'running' | 'complete' | 'error'

export interface WorkflowHookParams<O extends WorkflowEvent> {
  baseUrl?: string // Optional base URL for the workflow API
  workflow: string // Name of the registered deployment
  sessionId?: string // Optional session ID for resuming a workflow session
  taskId?: string // Optional task ID for resuming a workflow task
  onStopEvents?: (event: O, taskId: string) => void // Callback when finished streaming events
  onError?: (error: any, taskId: string) => void // Callback for errors
}

/** Return value from the hook */
export interface WorkflowHookHandler<
  I extends WorkflowEvent,
  O extends WorkflowEvent,
> {
  sessionId?: string // Session ID once the workflow session starts
  currentTask?: Task<I, O>
  createTask: (event: I, callbacks?: TaskCallbacks<O>) => Promise<string> // Function to create a new task with an event, returns the task id
  tasks: Record<string, Task<I, O>>
}

/**
 * useWorkflow hook for consuming llama-deploy workflows
 */
export function useWorkflow<
  I extends WorkflowEvent = WorkflowEvent,
  O extends WorkflowEvent = WorkflowEvent,
>(params: WorkflowHookParams<O>): WorkflowHookHandler<I, O> {
  const {
    baseUrl,
    workflow: deploymentName,
    taskId: initialTaskId,
    sessionId: initialSessionId,
    onStopEvents,
    onError,
  } = params

  const sdk = useMemo(
    () => new WorkflowSDK({ baseUrl, deploymentName }),
    [baseUrl, deploymentName]
  )

  const [isInitialized, setIsInitialized] = useState(false)
  const [sessionId, setSessionId] = useState<string>()
  const [taskId, setTaskId] = useState<string>()
  const [eventsByTaskId, setEventsByTaskId] = useState<
    Record<string, (I | O)[]>
  >({})
  const [taskStatuses, setTaskStatuses] = useState<Record<string, TaskStatus>>(
    {}
  )
  const taskCallbacksRef = useRef<Record<string, TaskCallbacks<O>>>({})

  const events = useMemo(() => {
    if (!taskId) return []
    return eventsByTaskId[taskId] ?? []
  }, [eventsByTaskId, taskId])

  // stream events from the task
  const streamTaskEvents = useCallback(
    async (taskId: string, sessionId: string) => {
      // stream events from the task
      const allEvents = await sdk.streamTaskEvents(taskId, sessionId, {
        onData: (data: string) => {
          const event = JSON.parse(data)
          setEventsByTaskId(prev => ({
            ...prev,
            [taskId]: [...(prev[taskId] || []), event],
          }))
        },
        onError: (error: Error) => {
          setTaskStatuses(prev => ({ ...prev, [taskId]: 'error' }))
          taskCallbacksRef.current[taskId]?.onError?.(error)
        },
        onFinish: (events: string[]) => {
          const stopEventStr = events[events.length - 1] // TODO: better check by type StopEvent
          if (stopEventStr && onStopEvents) {
            onStopEvents(JSON.parse(stopEventStr) as O, taskId)
          }
        },
      })

      setEventsByTaskId(prev => ({
        ...prev,
        [taskId]: allEvents.map(item => JSON.parse(item)),
      }))
    },
    [sdk, onError, onStopEvents]
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
        if (initialTaskCallbacks) {
          taskCallbacksRef.current[initialTaskId] = initialTaskCallbacks
        }
        setCurrentTaskId(initialTaskId)
        setTaskStatuses(prev => ({ ...prev, [initialTaskId]: 'running' }))
        await streamTaskEvents(initialTaskId, startSessionId)
        setTaskStatuses(prev => ({ ...prev, [initialTaskId]: 'complete' }))
      }

      setIsInitialized(true)
    }

    if (!isInitialized) {
      initWorkflow()
    }
  }, [
    initialSessionId,
    initialTaskId,
    sdk,
    isInitialized,
    streamTaskEvents,
    initialTaskCallbacks,
  ])

  const sendEventToTask = useCallback(
    async (event: I, taskId: string, callbacks?: TaskCallbacks<O>) => {
      if (!sessionId) {
        throw new Error('Cannot send event: No active session')
      }

      if (callbacks) {
        taskCallbacksRef.current[taskId] = callbacks
      }

      setTaskStatuses(prev => ({ ...prev, [taskId]: 'running' }))
      try {
        // if task id is provided, resume the workflow
        await sdk.sendEventToTask(
          taskId,
          sessionId,
          JSON.stringify({
            service_id: deploymentName,
            event_obj_str: JSON.stringify(event),
          })
        )

        // stream events from the task
        await streamTaskEvents(taskId, sessionId)
        setTaskStatuses(prev => ({ ...prev, [taskId]: 'complete' }))
      } catch (error) {
        setTaskStatuses(prev => ({ ...prev, [taskId]: 'error' }))
        taskCallbacksRef.current[taskId]?.onError?.(error)
        throw error
      }
    },
    [deploymentName, sdk, sessionId, streamTaskEvents]
  )

  const createTask = useCallback(
    async (event: I, callbacks?: TaskCallbacks<O>): Promise<string> => {
      if (!sessionId) {
        throw new Error('Cannot send event: No active session')
      }

      let runTaskId: string | undefined
      try {
        // if not task id, create a new task with input event to start the workflow
        const taskData = await sdk.createDeploymentTaskNoWait(
          { input: JSON.stringify(event) },
          sessionId
        )
        runTaskId = taskData.task_id
        if (callbacks) {
          taskCallbacksRef.current[runTaskId] = callbacks
        }
        const taskIdForStatus = runTaskId
        setCurrentTaskId(taskIdForStatus)
        setTaskStatuses(prev => ({ ...prev, [taskIdForStatus]: 'running' }))
        setEventsByTaskId(prev => ({ ...prev, [taskIdForStatus]: [] }))

        // stream events from the task
        await streamTaskEvents(runTaskId, sessionId)
        setTaskStatuses(prev => ({ ...prev, [taskIdForStatus]: 'complete' }))

        return runTaskId
      } catch (error) {
        if (runTaskId) {
          const taskIdForStatus = runTaskId
          setTaskStatuses(prev => ({ ...prev, [taskIdForStatus]: 'error' }))
          taskCallbacksRef.current[taskIdForStatus]?.onError?.(error)
        }
        throw error
      }
    },
    [sessionId, sdk, streamTaskEvents]
  )

  const tasks = useMemo(() => {
    const taskIds = Object.keys(eventsByTaskId)
    return taskIds.reduce<Record<string, Task<I, O>>>((acc, taskId) => {
      acc[taskId] = {
        id: taskId,
        events: eventsByTaskId[taskId],
        status: taskStatuses[taskId] || 'idle',
        sendEvent: (e: I, c) => sendEventToTask(e, taskId, c),
      }
      return acc
    }, {})
  }, [eventsByTaskId, taskStatuses, sendEventToTask])

  return {
    sessionId,
    currentTask: currentTaskId ? tasks[currentTaskId] : undefined,
    createTask,
    tasks,
  }
}
