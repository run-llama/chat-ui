import { TaskDefinition } from '@llamaindex/llama-deploy'

export interface WorkflowEvent {
  type: string
}

export type WorkflowStatus = 'idle' | 'running' | 'complete' | 'error'

export interface WorkflowHookParams<E extends WorkflowEvent = WorkflowEvent> {
  baseUrl?: string // Optional base URL for the workflow API
  workflow: string // Name of the registered deployment
  taskId?: string // Optional task ID for resuming a workflow task
  onStopEvent?: (event: E) => void
  onError?: (error: any) => void
}

export interface WorkflowHookHandler<E extends WorkflowEvent = WorkflowEvent> {
  sessionId?: string // Session ID once the workflow session starts
  taskId?: string // Task ID used internally, will be the same for the whole session
  sendEvent: (event: E) => Promise<void> // Function to send a new event to the current session, throws error if session is not created yet
  sendStartEvent: (event: E) => Promise<void> // Function to create a new session by sending a new event, updates sessionId
  events: E[]
  status: WorkflowStatus
}

// extend TaskDefinition with sessionId, taskId, serviceId are required
export type WorkflowTask = TaskDefinition & {
  session_id: string
  task_id: string
  service_id: string
}
