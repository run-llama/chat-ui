import {
  Client,
  createDeploymentTaskNowaitDeploymentsDeploymentNameTasksCreatePost,
  createSessionDeploymentsDeploymentNameSessionsCreatePost,
  sendEventDeploymentsDeploymentNameTasksTaskIdEventsPost,
  createClient,
  createConfig,
} from '@llamaindex/llama-deploy'
import { WorkflowEvent } from './types'

export interface StreamingEventCallback {
  onStart?: () => void
  onData?: (event: WorkflowEvent) => void
  onError?: (error: Error) => void
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

  // we can create a task with or without a session id
  // case 1: if we don't provide a session id, a new session will be created
  // case 2: if we provide a session id, the task will be created in the existing session
  // for case 2, task events will be streamed from the existing session and have the same result as other tasks in the same session.
  // this can be useful for multi-task workflows where we want to keep the same session for all tasks.
  async createTask(input: string, sessionId?: string) {
    const data =
      await createDeploymentTaskNowaitDeploymentsDeploymentNameTasksCreatePost({
        client: this.client,
        path: { deployment_name: this.deploymentName },
        query: { session_id: sessionId },
        body: { input },
      })

    const { task_id, session_id } = data.data ?? {}
    if (!task_id || !session_id) {
      throw new Error('Failed to create task')
    }

    this.sessionId = session_id
    return task_id
  }

  async streamTaskEvents(
    taskId: string,
    callback?: StreamingEventCallback
  ): Promise<WorkflowEvent[]> {
    const sessionId = await this.getSession()
    const url = `${this.baseUrl}/deployments/${this.deploymentName}/tasks/${taskId}/events?session_id=${sessionId}`

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
        accumulatedEvents.push(event as WorkflowEvent)
        callback?.onData?.(event as WorkflowEvent)
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
        event_obj_str: JSON.stringify(event),
        agent_id: this.deploymentName,
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
    return this.sessionId ? this.sessionId : this.createSession()
  }
}
