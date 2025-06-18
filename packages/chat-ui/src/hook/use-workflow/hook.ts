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
  const [status, setStatus] = useState<WorkflowStatus>('idle')

  const client = useMemo(() => {
    return createClient(createConfig({ baseUrl }))
  }, [baseUrl])

  const streamTaskEvents = useCallback(
    async (task: WorkflowTask) => {
      await fetchTaskEvents<E>(
        { client, deploymentName, task },
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

      const task = await getExistingTask({
        client,
        deploymentName,
        taskId: initialTaskId,
      })

      setTask(task)
      setIsInitialized(true)
      await streamTaskEvents(task)
    }

    initWorkflow()
  }, [client, deploymentName, initialTaskId, isInitialized, streamTaskEvents])

  const sendStartEvent = useCallback(
    async (event: E): Promise<void> => {
      const newTask = await createTask({ client, deploymentName, event })
      setTask(newTask) // update new task with new session when trigger start event
      await streamTaskEvents(newTask)
    },
    [client, deploymentName, streamTaskEvents]
  )

  const sendEvent = useCallback(
    async (event: E) => {
      if (!task) {
        throw new Error('Task is not initialized')
      }
      await sendEventToTask<E>({ client, deploymentName, task, event })
      await streamTaskEvents(task)
    },
    [client, deploymentName, streamTaskEvents, task]
  )

  return {
    sessionId: task?.session_id,
    taskId: task?.task_id,
    sendEvent,
    sendStartEvent,
    events,
    status,
  }
}
