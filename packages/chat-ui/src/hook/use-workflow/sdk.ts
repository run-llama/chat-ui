import {
  Client,
  createDeploymentTaskNowaitDeploymentsDeploymentNameTasksCreatePost,
  createSessionDeploymentsDeploymentNameSessionsCreatePost,
  sendEventDeploymentsDeploymentNameTasksTaskIdEventsPost,
  createClient,
  createConfig,
} from '@llamaindex/llama-deploy'
import { WorkflowEvent } from './types'
import { isStopEvent, isWorkflowEvent } from './utils'

export interface StreamingEventCallback {
  onStart?: () => void
  onData?: (event: WorkflowEvent) => void
  onError?: (error: Error) => void
  onStopEvent?: (event: WorkflowEvent) => void
  onFinish?: (allEvents: WorkflowEvent[]) => void
}

// extend llama-deploy client with custom hook logic
export class WorkflowSDK {
  client: Client
  baseUrl: string
  deploymentName: string
  sessionId?: string

  constructor(input: {
    baseUrl?: string
    deploymentName: string
    sessionId?: string
  }) {
    this.client = createClient(createConfig({ baseUrl: input.baseUrl }))
    this.baseUrl = input.baseUrl || ''
    this.deploymentName = input.deploymentName
    this.sessionId = input.sessionId
  }

  async createTask(eventData: any) {
    const sessionId = await this.getSession()
    const data =
      await createDeploymentTaskNowaitDeploymentsDeploymentNameTasksCreatePost({
        client: this.client,
        path: { deployment_name: this.deploymentName },
        query: { session_id: sessionId },
        body: { input: JSON.stringify(eventData) },
      })

    const { task_id } = data.data ?? {}
    if (!task_id) {
      throw new Error('Failed to create task')
    }
    return task_id
  }

  async streamTaskEvents(
    taskId: string,
    callback?: StreamingEventCallback
  ): Promise<WorkflowEvent[]> {
    const sessionId = await this.getSession()
    const url = `${this.baseUrl}/deployments/${this.deploymentName}/tasks/${taskId}/events?session_id=${sessionId}&raw_event=true`

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
    const accumulatedEvents: WorkflowEvent[] = []

    try {
      callback?.onStart?.()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const event = typeof chunk === 'string' ? JSON.parse(chunk) : chunk

        if (!isWorkflowEvent(event)) {
          console.warn('Received non-workflow event:', event)
          continue
        }

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

  async sendEventToTask(taskId: string, event: WorkflowEvent) {
    const sessionId = await this.getSession()
    return sendEventDeploymentsDeploymentNameTasksTaskIdEventsPost({
      client: this.client,
      path: { deployment_name: this.deploymentName, task_id: taskId },
      query: { session_id: sessionId },
      body: {
        service_id: this.deploymentName, // TODO: check this
        event_obj_str: JSON.stringify(event),
      },
    })
  }

  async createSession() {
    const session =
      await createSessionDeploymentsDeploymentNameSessionsCreatePost({
        client: this.client,
        path: { deployment_name: this.deploymentName },
      })
    const sessionId = session.data?.session_id
    if (!sessionId) {
      throw new Error('Failed to create session')
    }
    return sessionId
  }

  private async getSession(): Promise<string> {
    if (this.sessionId) return this.sessionId
    this.sessionId = await this.createSession()
    return this.sessionId
  }
}
