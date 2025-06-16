export interface WorkflowConfig {
  baseUrl?: string
  deploymentName: string
}

export interface CreateTaskRequest {
  input: string
}

export interface TaskResponse {
  input: string
  task_id: string
  session_id: string
  service_id: string
}

export interface SendEventRequest {
  event_obj_str: string
}

export interface StreamingEventCallback {
  onData?: (data: string) => void
  onError?: (error: Error) => void
  onFinish?: (data: string[]) => void
}

export class WorkflowSDK {
  private baseUrl: string
  private deploymentName: string

  constructor(config: WorkflowConfig) {
    this.baseUrl = config.baseUrl || ''
    this.deploymentName = config.deploymentName
  }

  private async makeRequest<T = any>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  /**
   * Get all deployments
   */
  async getDeployments(): Promise<any> {
    return this.makeRequest('/deployments/')
  }

  /**
   * Get all tasks for the deployment
   */
  async getAllTasks(): Promise<any> {
    return this.makeRequest(`/deployments/${this.deploymentName}/tasks`)
  }

  /**
   * Create a new session
   */
  async createSession(): Promise<{ session_id: string }> {
    return this.makeRequest(
      `/deployments/${this.deploymentName}/sessions/create`,
      {
        method: 'POST',
      }
    )
  }

  /**
   * Create and run a deployment task (waits for completion)
   */
  async createDeploymentTask(
    request: CreateTaskRequest,
    sessionId?: string
  ): Promise<string> {
    const queryParams = sessionId ? `?session_id=${sessionId}` : ''
    return this.makeRequest(
      `/deployments/${this.deploymentName}/tasks/run${queryParams}`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    )
  }

  /**
   * Create a deployment task without waiting for completion (stream events)
   */
  async createDeploymentTaskNoWait(
    request: CreateTaskRequest,
    sessionId?: string
  ): Promise<TaskResponse> {
    const queryParams = sessionId ? `?session_id=${sessionId}` : ''
    return this.makeRequest(
      `/deployments/${this.deploymentName}/tasks/create${queryParams}`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    )
  }

  /**
   * Send an event to a specific task
   */
  async sendEventToTask(
    taskId: string,
    sessionId: string,
    eventData: string
  ): Promise<{
    service_id: string
    event_obj_str: string
  }> {
    const event: SendEventRequest = {
      event_obj_str: eventData,
    }

    return this.makeRequest(
      `/deployments/${this.deploymentName}/tasks/${taskId}/events?session_id=${sessionId}`,
      {
        method: 'POST',
        body: JSON.stringify(event),
      }
    )
  }

  /**
   * Stream task events
   */
  async streamTaskEvents(
    taskId: string,
    sessionId: string,
    callback?: StreamingEventCallback
  ): Promise<string[]> {
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
    const accumulatedData: string[] = []

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        accumulatedData.push(chunk)

        // Call the callback with new data if provided
        callback?.onData?.(chunk)
      }

      callback?.onFinish?.(accumulatedData)
      return accumulatedData
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      callback?.onError?.(err)
      throw err
    }
  }

  /**
   * Get task result
   */
  async getTaskResult(taskId: string, sessionId: string): Promise<any> {
    return this.makeRequest(
      `/deployments/${this.deploymentName}/tasks/${taskId}/results?session_id=${sessionId}`
    )
  }
}
