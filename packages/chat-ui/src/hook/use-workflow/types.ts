export interface WorkflowEvent {
  name: string
}

export interface WorkflowHookParams<O extends WorkflowEvent = WorkflowEvent> {
  baseUrl?: string // Optional base URL for the workflow API
  workflow: string // Name of the registered deployment
  sessionId?: string // Optional session ID for resuming a workflow session
  taskId?: string // Optional task ID for resuming a workflow task
  initialTaskCallbacks?: TaskCallbacks<O> // Optional callbacks for the initial task if taskId is provided
}

/** Return value from the hook */
export interface WorkflowHookHandler<
  I extends WorkflowEvent = WorkflowEvent,
  O extends WorkflowEvent = WorkflowEvent,
> {
  sessionId?: string // Session ID once the workflow session starts
  currentTask?: Task<I, O>
  createTask: (event: I, callbacks?: TaskCallbacks<O>) => Promise<string> // Function to create a new task with an event, returns the task id
  tasks: Record<string, Task<I, O>>
}

export interface TaskCallbacks<O extends WorkflowEvent = WorkflowEvent> {
  onStopEvent?: (event: O) => void
  onError?: (error: any) => void
}

export type TaskStatus = 'idle' | 'running' | 'complete' | 'error'

export interface Task<
  I extends WorkflowEvent = WorkflowEvent,
  O extends WorkflowEvent = WorkflowEvent,
> {
  id: string
  events: (I | O)[]
  status: TaskStatus
  sendEvent: (event: I, callbacks?: TaskCallbacks<O>) => Promise<void>
}
