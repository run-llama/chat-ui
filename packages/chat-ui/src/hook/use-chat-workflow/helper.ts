import {
  MessageAnnotation,
  MessageAnnotationType,
  toInlineAnnotation,
} from '../../chat/annotations'
import { JSONValue } from '../../chat/chat.interface'
import { WorkflowEvent, WorkflowEventType } from '../use-workflow'
import { AgentStreamEvent } from './types'

/**
 * Transform a workflow event to message parts
 * - if event is an agent stream event, return the delta
 * - if event is an inline event, convert the data to inline annotation and return the delta
 * - otherwise, return input event as Vercel annotation
 * @param event - The event to transform
 * @returns The message parts (delta and annotations)
 */
export function transformEventToMessageParts(event: WorkflowEvent): {
  delta: string
  annotations: MessageAnnotation<JSONValue>[]
} {
  // TODO: add unit tests

  if (isAgentStreamEvent(event)) {
    return { delta: event.data.delta, annotations: [] }
  }

  if (isInlineEvent(event)) {
    return {
      delta: toInlineAnnotation(event.data as MessageAnnotation),
      annotations: [],
    }
  }

  return { delta: '', annotations: toVercelAnnotations(event) }
}

function isAgentStreamEvent(event: WorkflowEvent): event is AgentStreamEvent {
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

function isInlineEvent(event: WorkflowEvent) {
  const inlineEventTypes = [WorkflowEventType.ArtifactEvent.toString()]

  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    inlineEventTypes.includes(event.type) &&
    typeof event.data === 'object' &&
    event.data !== null
  )
}

function toVercelAnnotations(
  event: WorkflowEvent
): MessageAnnotation<JSONValue>[] {
  switch (event.type) {
    case WorkflowEventType.SourceNodesEvent.toString():
      return [
        {
          type: MessageAnnotationType.SOURCES,
          data: event.data as JSONValue,
        },
      ]
  }

  return []
}
