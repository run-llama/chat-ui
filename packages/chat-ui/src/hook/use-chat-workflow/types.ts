import { ChatHandler, JSONValue, Message } from '../../chat/chat.interface'
import {
  WorkflowEvent,
  WorkflowEventType,
  WorkflowHookParams,
} from '../use-workflow'

export interface ChatEvent extends WorkflowEvent {
  type: WorkflowEventType.StartEvent
  data: {
    user_msg: string
    chat_history: Omit<Message, 'annotations'>[]
  }
}

export interface AgentStreamEvent extends WorkflowEvent {
  type: WorkflowEventType.AgentStream
  data: {
    delta: string
  }
}

// represent the raw node in the source nodes event
export type RawNode = {
  node: {
    id_: string
    metadata: {
      file_name: string | null
      pipeline_id: string | null
      page_label: string | null
      file_path: string | null
      file_type: string | null
      file_size: number | null
      creation_date: string | null
      last_modified_date: string | null
      URL: string | null
    }
    text: string
  }
  score: number
}

export interface SourceNodesEvent extends WorkflowEvent {
  type: WorkflowEventType.SourceNodesEvent
  data: { nodes: RawNode[] }
}

export interface UIEvent extends WorkflowEvent {
  type: WorkflowEventType.UIEvent
  data: {
    type: string
    data: JSONValue
  }
}

export interface ToolCallEvent extends WorkflowEvent {
  type: WorkflowEventType.ToolCall
  data: {
    tool_id: string
    tool_name: string
    tool_kwargs: JSONValue
  }
}

export interface ToolCallResultEvent extends WorkflowEvent {
  type: WorkflowEventType.ToolCallResult
  data: {
    tool_id: string
    tool_name: string
    tool_kwargs: JSONValue
    tool_output: {
      raw_output: JSONValue
    }
  }
}

export type ChatWorkflowHookParams = Pick<
  WorkflowHookParams,
  'deployment' | 'workflow' | 'baseUrl' | 'onError'
> & {
  // the endpoint to serve local files and llamacloud files
  fileServerUrl?: string
}

export type ChatWorkflowHookHandler = ChatHandler & {
  resume: ChatWorkflowResume
}

export type ChatWorkflowResume = (
  eventType: string,
  eventData: JSONValue
) => Promise<void>
