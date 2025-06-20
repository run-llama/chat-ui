import {
  MessageAnnotation,
  MessageAnnotationType,
} from '../../chat/annotations'
import { JSONValue } from '../../chat/chat.interface'
import { WorkflowEvent, WorkflowEventType } from '../use-workflow'
import { AgentStreamEvent } from './types'

export function isAgentStreamEvent(
  event: WorkflowEvent
): event is AgentStreamEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    'data' in event &&
    event.type === WorkflowEventType.AgentStream.toString() &&
    typeof event.data === 'object' &&
    event.data !== null &&
    'delta' in event.data
  )
}

export function toAnnotation(
  event: WorkflowEvent
): MessageAnnotation<JSONValue> | null {
  switch (event.type) {
    case WorkflowEventType.SourceNodesEvent.toString():
      return {
        type: MessageAnnotationType.SOURCES,
        data: event.data as JSONValue,
      }
  }

  return null
}
