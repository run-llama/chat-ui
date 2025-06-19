import { TaskDefinition } from '@llamaindex/llama-deploy'
import { JSONValue } from '../../chat/chat.interface'

export interface WorkflowEvent {
  type: string
  data?: JSONValue | undefined
}

export type RunStatus = 'idle' | 'running' | 'complete' | 'error'

export interface WorkflowHookParams<E extends WorkflowEvent = WorkflowEvent> {
  baseUrl?: string // Optional base URL for the workflow API
  deployment: string // Name of the registered deployment
  runId?: string // Optional task ID for resuming a workflow task
  workflow?: string // Set the default service to run
  onStopEvent?: (event: E) => void
  onError?: (error: any) => void
}

export interface WorkflowHookHandler<E extends WorkflowEvent = WorkflowEvent> {
  runId?: string // Task ID used internally, will be the same for the whole session
  start: (eventData: E['data']) => Promise<void> // Create new task with start event data, updates sessionId
  stop: (data?: E['data']) => Promise<void> // Send stop event to stop current task
  sendEvent: (event: E) => Promise<void> // Function to send a new event to the current session, throws error if session is not created yet
  events: E[] // events of the current run
  status?: RunStatus // status of the current run
}

// extend TaskDefinition with sessionId, taskId, serviceId are required
export type WorkflowTask = TaskDefinition & {
  session_id: string
  task_id: string
  service_id: string
}

// available events map to qualified name
export enum WorkflowEventType {
  StartEvent = 'llama_index.core.workflow.events.StartEvent',
  StopEvent = 'llama_index.core.workflow.events.StopEvent',
}

export interface StreamingEventCallback<
  E extends WorkflowEvent = WorkflowEvent,
> {
  onStart?: () => void
  onData?: (event: E) => void
  onError?: (error: Error) => void
  onStopEvent?: (event: E) => void
  onFinish?: (allEvents: E[]) => void
}

export type RawEvent = {
  __is_pydantic: boolean
  value: JSONValue
  qualified_name: string
}
