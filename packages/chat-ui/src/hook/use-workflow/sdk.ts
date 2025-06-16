export interface WorkflowConfig {
  baseUrl: string
  deploymentName: string
}

export interface TaskResponse {
  task_id?: string
  session_id?: string
  [key: string]: any
}

export interface CreateTaskRequest {
  input: string
}

export interface SendEventRequest {
  service_id: string
  event_obj_str: string
}

export interface StreamingEventCallback {
  onData: (data: string) => void
  onError: (error: Error) => void
  onComplete: () => void
}

export class WorkflowSDK {
  private baseUrl: string
  private deploymentName: string
  private defaultServiceId = 'echo_workflow'

  constructor(config: WorkflowConfig) {
    this.baseUrl = config.baseUrl
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
  async createSession(): Promise<TaskResponse> {
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
  ): Promise<TaskResponse> {
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
   * Create a deployment task without waiting for completion
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
    eventData: string,
    serviceId?: string
  ): Promise<any> {
    const event: SendEventRequest = {
      service_id: serviceId || this.defaultServiceId,
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
   * Get task events with streaming support
   */
  async getTaskEvents(
    taskId: string,
    sessionId: string,
    callback?: StreamingEventCallback
  ): Promise<string> {
    const url = `${this.baseUrl}/deployments/${this.deploymentName}/tasks/${taskId}/events?session_id=${sessionId}`

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`)
      callback?.onError(error)
      throw error
    }

    const reader = response.body?.getReader()
    if (!reader) {
      const error = new Error('No reader available')
      callback?.onError(error)
      throw error
    }

    const decoder = new TextDecoder()
    let accumulatedData = ''

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        accumulatedData += chunk

        // Call the callback with new data if provided
        callback?.onData(accumulatedData)
      }

      callback?.onComplete()
      return accumulatedData
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      callback?.onError(err)
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

  /**
   * Update configuration
   */
  updateConfig(config: Partial<WorkflowConfig>) {
    if (config.baseUrl !== undefined) {
      this.baseUrl = config.baseUrl
    }
    if (config.deploymentName !== undefined) {
      this.deploymentName = config.deploymentName
    }
  }

  /**
   * Set default service ID for events
   */
  setDefaultServiceId(serviceId: string) {
    this.defaultServiceId = serviceId
  }
}

// Helper function to create SDK instance
export function createWorkflowSDK(config: WorkflowConfig): WorkflowSDK {
  return new WorkflowSDK(config)
}

// Default configuration constants
export const DEFAULT_CONFIG = {
  BASE_URL: 'http://127.0.0.1:4501',
  DEPLOYMENT_NAME: 'LlamaIndexServer',
  SERVICE_ID: 'echo_workflow',
} as const
