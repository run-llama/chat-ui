import { useState, useEffect, useCallback, useMemo } from 'react'
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

  const streamTaskEvents = useCallback(
    async (taskId: string, callbacks?: TaskCallbacks<O>) => {
      const allEvents = await sdk.streamTaskEvents(taskId, {
        onStart: () => {
          setTaskStatuses(prev => ({ ...prev, [taskId]: 'running' }))
        },
        onData: event => {
          setEventsByTaskId(prev => ({
            ...prev,
            [taskId]: [...(prev[taskId] || []), event as O],
          }))
        },
        onError: (error: Error) => {
          setTaskStatuses(prev => ({ ...prev, [taskId]: 'error' }))
          callbacks?.onError?.(error)
        },
        onFinish: events => {
          setTaskStatuses(prev => ({ ...prev, [taskId]: 'complete' }))
          const stopEvent = events.find(event => event.name === 'StopEvent')
          if (stopEvent && callbacks?.onStopEvent) {
            callbacks.onStopEvent(stopEvent as O)
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
      if (isInitialized || !initialTaskId) return
      setCurrentTaskId(initialTaskId)
      await streamTaskEvents(initialTaskId, initialTaskCallbacks)
      setIsInitialized(true)
    }

    initWorkflow()
  }, [initialTaskCallbacks, initialTaskId, isInitialized, streamTaskEvents])

  const sendEventToTask = useCallback(
    async (event: I, taskId: string, callbacks?: TaskCallbacks<O>) => {
      await sdk.sendEventToTask(taskId, event)
      await streamTaskEvents(taskId, callbacks)
    },
    [sdk, streamTaskEvents]
  )

  const createTask = useCallback(
    async (event: I, callbacks?: TaskCallbacks<O>): Promise<string> => {
      const newTaskId = await sdk.createTask(JSON.stringify(event))
      await streamTaskEvents(newTaskId, callbacks)
      setCurrentTaskId(newTaskId)
      return newTaskId
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
