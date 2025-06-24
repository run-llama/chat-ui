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

export interface SourceNodesEvent extends WorkflowEvent {
  type: WorkflowEventType.SourceNodesEvent
  data: {
    nodes: {
      node: {
        id_: string
        metadata: Record<string, JSONValue>
        text: string
      }
      score: number
    }[]
  }
}

export interface UIEvent extends WorkflowEvent {
  type: WorkflowEventType.UIEvent
  data: {
    type: string
    data: JSONValue
  }
}

export type ChatWorkflowHookParams = Pick<
  WorkflowHookParams,
  'deployment' | 'workflow' | 'baseUrl' | 'onError'
>

export type ChatWorkflowHookHandler = ChatHandler & {
  resume: ChatWorkflowResume
}

export type ChatWorkflowResume = (
  eventType: string,
  eventData: JSONValue
) => Promise<void>
