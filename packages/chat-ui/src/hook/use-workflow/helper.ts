import {
  Client,
  createDeploymentTaskNowaitDeploymentsDeploymentNameTasksCreatePost,
  getTasksDeploymentsDeploymentNameTasksGet,
  sendEventDeploymentsDeploymentNameTasksTaskIdEventsPost,
} from '@llamaindex/llama-deploy'
import { WorkflowEvent, WorkflowTask } from './types'

interface StreamingEventCallback<E extends WorkflowEvent = WorkflowEvent> {
  onStart?: () => void
  onData?: (event: E) => void
  onError?: (error: Error) => void
  onStopEvent?: (event: E) => void
  onFinish?: (allEvents: E[]) => void
}

export async function getExistingTask(params: {
  client: Client
  deploymentName: string
  taskId: string
}): Promise<WorkflowTask> {
  const data = await getTasksDeploymentsDeploymentNameTasksGet({
    client: params.client,
    path: { deployment_name: params.deploymentName },
  })
  const allTasks = data.data ?? []
  const task = allTasks.find(task => task.task_id === params.taskId)

  if (!task) {
    throw new Error(`Task ${params.taskId} not found`)
  }

  const { task_id, session_id, service_id, input } = task ?? {}
  if (!task_id || !session_id || !service_id || !input) {
    throw new Error(
      `Task is found but missing one of the required fields: task_id, session_id, service_id, input`
    )
  }

  return { task_id, session_id, service_id, input }
}

export async function createTask<E extends WorkflowEvent>(params: {
  client: Client
  deploymentName: string
  event: E
}): Promise<WorkflowTask> {
  const data =
    await createDeploymentTaskNowaitDeploymentsDeploymentNameTasksCreatePost({
      client: params.client,
      path: { deployment_name: params.deploymentName },
      body: { input: JSON.stringify(params.event) },
    })

  const { task_id, session_id, service_id, input } = data.data ?? {}
  if (!task_id || !session_id || !service_id || !input) {
    throw new Error(
      `Task is created but missing one of the required fields: task_id, session_id, service_id, input`
    )
  }

  return { task_id, session_id, service_id, input }
}

export async function fetchTaskEvents<E extends WorkflowEvent>(
  params: {
    client: Client
    deploymentName: string
    task: WorkflowTask
  },
  callback?: StreamingEventCallback<E>
): Promise<E[]> {
  const baseUrl = params.client.getConfig().baseUrl
  if (!baseUrl) {
    throw new Error('Base URL is missing in client config')
  }

  const { task_id, session_id } = params.task
  const url = `${baseUrl}/deployments/${params.deploymentName}/tasks/${task_id}/events?session_id=${session_id}&raw_event=true`
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`)
    callback?.onError?.(error)
    throw error
  }

  const reader = response.body?.getReader()
  if (!reader) {
    const error = new Error('No reader available')
    callback?.onError?.(error)
    throw error
  }

  const decoder = new TextDecoder()
  const accumulatedEvents: E[] = []

  try {
    callback?.onStart?.()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const event = parseChunk<E>(chunk)
      if (!event) continue

      accumulatedEvents.push(event)
      callback?.onData?.(event)

      if (isStopEvent(event)) {
        callback?.onStopEvent?.(event)
      }
    }

    callback?.onFinish?.(accumulatedEvents)
    return accumulatedEvents
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    callback?.onError?.(err)
    throw err
  }
}

export async function sendEventToTask<E extends WorkflowEvent>(params: {
  client: Client
  deploymentName: string
  task: WorkflowTask
  event: E
}) {
  const { task_id, session_id, service_id } = params.task

  const data = await sendEventDeploymentsDeploymentNameTasksTaskIdEventsPost({
    client: params.client,
    path: { deployment_name: params.deploymentName, task_id },
    query: { session_id },
    body: {
      service_id,
      event_obj_str: JSON.stringify(params.event),
    },
  })

  return data.data
}

function isRawEvent(event: any): event is RawEvent {
  return (
    event &&
    typeof event === 'object' &&
    '__is_pydantic' in event &&
    'value' in event &&
    'qualified_name' in event &&
    typeof event.qualified_name === 'string'
  )
}

function isStopEvent(event: WorkflowEvent): boolean {
  return event.type === 'StopEvent'
}

type RawEvent = {
  __is_pydantic: boolean
  value: any
  qualified_name: string
}

// TODO: parse chunk can return multiple events
function parseChunk<E extends WorkflowEvent>(chunk: string): E | null {
  if (typeof chunk !== 'string') return chunk

  try {
    const event = JSON.parse(chunk) as RawEvent
    if (!isRawEvent(event)) {
      console.warn('Received non-workflow event:', event)
      return null
    }
    return {
      type: event.qualified_name,
      value: event.value,
    } as unknown as E
  } catch (error) {
    console.warn('Failed to parse chunk:', error)
    return null
  }
}
