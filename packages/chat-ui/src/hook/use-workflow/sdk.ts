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
  onData?: (event: WorkflowEvent) => void
  onError?: (error: Error) => void
  onFinish?: (allEvents: WorkflowEvent[]) => void
}

export class WorkflowSDK {
  client: Client
  deploymentName: string
  sessionId?: string

  constructor(input: {
    baseUrl?: string
    deploymentName: string
    sessionId?: string
  }) {
    this.client = createClient(createConfig({ baseUrl: input.baseUrl }))
    this.deploymentName = input.deploymentName
    this.sessionId = input.sessionId
  }

  async createTask(input: string) {
    const sessionId = await this.ensureSession()
    return createDeploymentTaskNowaitDeploymentsDeploymentNameTasksCreatePost({
      client: this.client,
      path: { deployment_name: this.deploymentName },
      query: { session_id: sessionId },
      body: { input },
    })
  }

  async sendEventToTask(taskId: string, eventData: string) {
    const sessionId = await this.ensureSession()
    return sendEventDeploymentsDeploymentNameTasksTaskIdEventsPost({
      client: this.client,
      path: { deployment_name: this.deploymentName, task_id: taskId },
      query: { session_id: sessionId },
      body: { event_obj_str: eventData, agent_id: this.deploymentName },
    })
  }

  async streamTaskEvents(
    taskId: string,
    callback?: StreamingEventCallback
  ): Promise<WorkflowEvent[]> {
    const sessionId = await this.ensureSession()
    const url = `/deployments/${this.deploymentName}/tasks/${taskId}/events?session_id=${sessionId}`

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

  private async ensureSession(): Promise<string> {
    if (!this.sessionId) {
      const session =
        await createSessionDeploymentsDeploymentNameSessionsCreatePost({
          client: this.client,
          path: { deployment_name: this.deploymentName },
        })
      const sessionId = session.data?.session_id
      if (!sessionId) {
        throw new Error('Failed to create session')
      }
      this.sessionId = sessionId
    }
    return this.sessionId
  }
}
