import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { WorkflowSDK } from './sdk'
import {
  WorkflowEvent,
  Task,
  TaskCallbacks,
  WorkflowHookParams,
  TaskStatus,
  WorkflowHookHandler,
} from './types'

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
    sessionId: initialSessionId,
    taskId: initialTaskId,
    initialTaskCallbacks,
  } = params

  const sdk = useMemo(
    () =>
      new WorkflowSDK({ baseUrl, deploymentName, sessionId: initialSessionId }),
    [baseUrl, deploymentName, initialSessionId]
  )

  const [isInitialized, setIsInitialized] = useState(false)
  const [currentTaskId, setCurrentTaskId] = useState<string>()
  const [eventsByTaskId, setEventsByTaskId] = useState<
    Record<string, (I | O)[]>
  >({})
  const [taskStatuses, setTaskStatuses] = useState<Record<string, TaskStatus>>(
    {}
  )
  const taskCallbacksRef = useRef<Record<string, TaskCallbacks<O>>>({})

  // stream events from the task
  const streamTaskEvents = useCallback(
    async (taskId: string) => {
      const allEvents = await sdk.streamTaskEvents(taskId, {
        onData: event => {
          setEventsByTaskId(prev => ({
            ...prev,
            [taskId]: [...(prev[taskId] || []), event as O],
          }))
        },
        onError: (error: Error) => {
          setTaskStatuses(prev => ({ ...prev, [taskId]: 'error' }))
          taskCallbacksRef.current[taskId]?.onError?.(error)
        },
        onFinish: events => {
          const stopEventStr = events[events.length - 1] // TODO: better check by type StopEvent
          if (stopEventStr && taskCallbacksRef.current[taskId]?.onStop) {
            taskCallbacksRef.current[taskId]?.onStop(events as O[])
          }
        },
      })

      setEventsByTaskId(prev => ({
        ...prev,
        [taskId]: allEvents as O[],
      }))
    },
    [sdk]
  )

  // initialize workflow, create session and stream events if task id is provided
  useEffect(() => {
    const initWorkflow = async () => {
      // if task id is provided, initialize events
      if (initialTaskId) {
        if (initialTaskCallbacks) {
          taskCallbacksRef.current[initialTaskId] = initialTaskCallbacks
        }
        setCurrentTaskId(initialTaskId)
        setTaskStatuses(prev => ({ ...prev, [initialTaskId]: 'running' }))
        await streamTaskEvents(initialTaskId)
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
      if (callbacks) {
        taskCallbacksRef.current[taskId] = callbacks
      }

      setTaskStatuses(prev => ({ ...prev, [taskId]: 'running' }))
      try {
        // if task id is provided, resume the workflow
        await sdk.sendEventToTask(
          taskId,
          JSON.stringify({
            service_id: deploymentName,
            event_obj_str: JSON.stringify(event),
          })
        )

        // stream events from the task
        await streamTaskEvents(taskId)
        setTaskStatuses(prev => ({ ...prev, [taskId]: 'complete' }))
      } catch (error) {
        setTaskStatuses(prev => ({ ...prev, [taskId]: 'error' }))
        taskCallbacksRef.current[taskId]?.onError?.(error)
        throw error
      }
    },
    [deploymentName, sdk, streamTaskEvents]
  )

  const createTask = useCallback(
    async (event: I, callbacks?: TaskCallbacks<O>): Promise<string> => {
      let runTaskId: string | undefined
      try {
        // if not task id, create a new task with input event to start the workflow
        const taskData = await sdk.createTask(JSON.stringify(event))
        runTaskId = taskData.data?.task_id

        if (!runTaskId) {
          throw new Error('Failed to create task')
        }

        if (callbacks) {
          taskCallbacksRef.current[runTaskId] = callbacks
        }
        const taskIdForStatus = runTaskId
        setCurrentTaskId(taskIdForStatus)
        setTaskStatuses(prev => ({ ...prev, [taskIdForStatus]: 'running' }))
        setEventsByTaskId(prev => ({ ...prev, [taskIdForStatus]: [] }))

        // stream events from the task
        await streamTaskEvents(runTaskId)
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
    [sdk, streamTaskEvents]
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
    sessionId: sdk.sessionId,
    currentTask: currentTaskId ? tasks[currentTaskId] : undefined,
    createTask,
    tasks,
  }
}
