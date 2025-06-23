import { JSONValue, Message } from '../../chat/chat.interface'
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
        metadata: Record<string, any>
        text: string
      }
      score: number
    }[]
  }
}

export interface UIEvent extends WorkflowEvent {
  type: string // the qualified name of the UI event can be found in the workflow definition
  data: {
    ui_type: string // annotation type to identify the type of the annotation and render corresponding component
    data: JSONValue // props of that UI component
  }
}

export type ChatWorkflowHookParams = Pick<
  WorkflowHookParams,
  'deployment' | 'workflow' | 'baseUrl' | 'onError'
>
