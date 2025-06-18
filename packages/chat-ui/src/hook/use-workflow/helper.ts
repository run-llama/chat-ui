import {
  Client,
  createDeploymentTaskNowaitDeploymentsDeploymentNameTasksCreatePost,
  getTasksDeploymentsDeploymentNameTasksGet,
  sendEventDeploymentsDeploymentNameTasksTaskIdEventsPost,
} from '@llamaindex/llama-deploy'
import {
  RawEvent,
  StreamingEventCallback,
  WorkflowEvent,
  WorkflowEventType,
  WorkflowTask,
} from './types'

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
  eventData: E['data']
}): Promise<WorkflowTask> {
  const data =
    await createDeploymentTaskNowaitDeploymentsDeploymentNameTasksCreatePost({
      client: params.client,
      path: { deployment_name: params.deploymentName },
      body: { input: JSON.stringify(params.eventData ?? {}) },
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
      const events = toWorkflowEvents<E>(chunk)
      if (!events.length) continue

      accumulatedEvents.push(...events)
      events.forEach(event => callback?.onData?.(event))

      const stopEvent = events.find(
        event => event.type === WorkflowEventType.StopEvent.toString()
      )
      if (stopEvent) {
        callback?.onStopEvent?.(stopEvent)
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

  const rawEvent = toRawEvent(params.event) // convert to raw event before sending

  const data = await sendEventDeploymentsDeploymentNameTasksTaskIdEventsPost({
    client: params.client,
    path: { deployment_name: params.deploymentName, task_id },
    query: { session_id },
    body: {
      service_id,
      event_obj_str: JSON.stringify(rawEvent),
    },
  })

  return data.data
}

function toWorkflowEvents<E extends WorkflowEvent>(chunk: string): E[] {
  if (typeof chunk !== 'string') {
    console.warn('Skipping non-string chunk:', chunk)
    return []
  }

  // One chunk can contain multiple events, so we need to parse each line
  const lines = chunk
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '')
  return lines.map(parseChunkLine<E>).filter(Boolean) as E[]
}

function parseChunkLine<E extends WorkflowEvent>(line: string): E | null {
  try {
    const event = JSON.parse(line) as RawEvent
    if (!isRawEvent(event)) {
      console.warn('Skipping invalid raw event:', event)
      return null
    }
    return { type: event.qualified_name, data: event.value } as E
  } catch (error) {
    console.warn(`Failed to parse chunk in line: ${line}`, error)
    return null
  }
}

function toRawEvent(event: WorkflowEvent): RawEvent {
  return {
    __is_pydantic: true,
    value: event.data ?? {},
    qualified_name: event.type,
  }
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
