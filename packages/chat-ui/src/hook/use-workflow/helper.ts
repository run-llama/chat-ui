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
  const task = allTasks.find(t => t.task_id === params.taskId)

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
  workflow?: string // create task in default service if not provided
}): Promise<WorkflowTask> {
  const data =
    await createDeploymentTaskNowaitDeploymentsDeploymentNameTasksCreatePost({
      client: params.client,
      path: { deployment_name: params.deploymentName },
      body: {
        input: JSON.stringify(params.eventData ?? {}),
        service_id: params.workflow,
      },
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
  const baseUrl = params.client.getConfig().baseUrl || ''
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

    let retryParsedLines: string[] = []

    // eslint-disable-next-line no-constant-condition -- needed
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      let chunk = decoder.decode(value, { stream: true })

      if (retryParsedLines.length > 0) {
        // if there are lines that failed to parse, append them to the current chunk
        chunk = `${retryParsedLines.join('')}${chunk}`
        console.info('Retry parsing with chunk:', { retryParsedLines, chunk })
        retryParsedLines = [] // reset for next iteration
      }

      const { events, failedLines } = toWorkflowEvents<E>(chunk)

      retryParsedLines.push(...failedLines)

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

function toWorkflowEvents<E extends WorkflowEvent>(
  chunk: string
): {
  events: E[]
  failedLines: string[]
} {
  if (typeof chunk !== 'string') {
    console.warn('Skipping non-string chunk:', chunk)
    return { events: [], failedLines: [] }
  }

  // One chunk can contain multiple events, so we need to parse each line
  const lines = chunk
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '')

  const parsedLines = lines.map(line => parseChunkLine<E>(line)).filter(Boolean)

  // successfully parsed events
  const events = parsedLines.map(line => line?.event).filter(Boolean) as E[]

  // failed lines that could not be parsed into events
  // will be merged into next chunk to re-try parsing
  const failedLines = parsedLines
    .filter(l => !l?.event)
    .map(line => line?.line || '')
    .filter(Boolean)

  return {
    events,
    failedLines,
  }
}

function parseChunkLine<E extends WorkflowEvent>(
  line: string
): {
  line: string
  event?: E | null
} | null {
  try {
    const event = JSON.parse(line) as RawEvent
    if (!isRawEvent(event)) {
      console.warn('Skipping invalid raw event:', event)
      return null
    }
    return {
      line,
      event: { type: event.qualified_name, data: event.value } as E,
    }
  } catch (error) {
    console.warn(`Failed to parse chunk in line: ${line}`, error)
    return {
      line,
      event: null,
    }
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
