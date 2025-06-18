import { createClient, createConfig } from '@llamaindex/llama-deploy'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createTask,
  fetchTaskEvents,
  getExistingTask,
  sendEventToTask,
} from './helper'
import {
  WorkflowEvent,
  WorkflowEventType,
  WorkflowHookHandler,
  WorkflowHookParams,
  WorkflowStatus,
  WorkflowTask,
} from './types'

export function useWorkflow<E extends WorkflowEvent = WorkflowEvent>(
  params: WorkflowHookParams<E>
): WorkflowHookHandler<E> {
  const {
    baseUrl,
    workflow: deploymentName,
    taskId: initialTaskId,
    onStopEvent,
    onError,
  } = params

  const [isInitialized, setIsInitialized] = useState(false)
  const [task, setTask] = useState<WorkflowTask>()
  const [events, setEvents] = useState<E[]>([])
  const [status, setStatus] = useState<WorkflowStatus>()

  const client = useMemo(() => {
    return createClient(createConfig({ baseUrl }))
  }, [baseUrl])

  const streamTaskEvents = useCallback(
    async (inputTask: WorkflowTask) => {
      await fetchTaskEvents<E>(
        { client, deploymentName, task: inputTask },
        {
          onStart: () => {
            setStatus('running')
          },
          onData: event => {
            setEvents(prev => [...prev, event])
          },
          onError: (error: Error) => {
            setStatus('error')
            onError?.(error)
          },
          onStopEvent: event => {
            onStopEvent?.(event)
          },
          onFinish: () => {
            setStatus('complete')
          },
        }
      )
    },
    [client, deploymentName, onError, onStopEvent]
  )

  // if task id is provided, get existing task and restore its events
  useEffect(() => {
    const initWorkflow = async () => {
      if (!initialTaskId || isInitialized) return

      const existingTask = await getExistingTask({
        client,
        deploymentName,
        taskId: initialTaskId,
      })

      setTask(existingTask)
      setIsInitialized(true)
      await streamTaskEvents(existingTask)
    }

    initWorkflow()
  }, [client, deploymentName, initialTaskId, isInitialized, streamTaskEvents])

  const sendEvent = useCallback(
    async (event: E) => {
      if (!task) {
        throw new Error('Task is not initialized')
      }
      await sendEventToTask<E>({ client, deploymentName, task, event })
    },
    [client, deploymentName, task]
  )

  const start = useCallback(
    async (eventData: E['data']) => {
      setEvents([]) // reset events when start a new task
      const newTask = await createTask({ client, deploymentName, eventData })
      setTask(newTask) // update new task with new session when trigger start event
      await streamTaskEvents(newTask)
    },
    [client, deploymentName, streamTaskEvents]
  )

  const stop = useCallback(
    async (data?: E['data']): Promise<void> => {
      const stopEvent = { type: WorkflowEventType.StopEvent, data } as E
      await sendEvent(stopEvent)
    },
    [sendEvent]
  )

  return {
    sessionId: task?.session_id,
    taskId: task?.task_id,
    sendEvent,
    start,
    stop,
    events,
    status,
  }
}
