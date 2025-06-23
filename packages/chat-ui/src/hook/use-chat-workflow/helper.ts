import {
  MessageAnnotation,
  MessageAnnotationType,
  toInlineAnnotation,
} from '../../chat/annotations'
import { JSONValue } from '../../chat/chat.interface'
import { SourceNode } from '../../widgets'
import { WorkflowEvent, WorkflowEventType } from '../use-workflow'
import { AgentStreamEvent, SourceNodesEvent, UIEvent } from './types'

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
  if (isAgentStreamEvent(event)) {
    return { delta: event.data.delta, annotations: [] }
  }

  if (isInlineEvent(event)) {
    return {
      delta: toInlineAnnotation(event.data as MessageAnnotation),
      annotations: [],
    }
  }

  const annotations = toVercelAnnotations(event)
  return { delta: '', annotations }
}

function isAgentStreamEvent(event: WorkflowEvent): event is AgentStreamEvent {
  const hasDelta =
    typeof event.data === 'object' &&
    event.data !== null &&
    'delta' in event.data

  return event.type === WorkflowEventType.AgentStream.toString() && hasDelta
}

function isInlineEvent(event: WorkflowEvent) {
  const inlineEventTypes = [WorkflowEventType.ArtifactEvent.toString()]
  const hasInlineData = typeof event.data === 'object' && event.data !== null

  return inlineEventTypes.includes(event.type) && hasInlineData
}

function toVercelAnnotations(event: WorkflowEvent) {
  switch (event.type) {
    case WorkflowEventType.SourceNodesEvent.toString(): {
      const nodes = (event as SourceNodesEvent).data?.nodes || []

      if (nodes.length === 0) {
        console.warn(
          `No nodes found in source nodes event. Event type: ${event.type}. Data: ${JSON.stringify(event.data)}`
        )
        return []
      }

      const sources = nodes.map(({ node, score }) => ({
        id: node.id_,
        metadata: node.metadata,
        score,
        text: node.text,
        url: node.metadata?.URL,
      })) satisfies SourceNode[]

      return [
        {
          type: MessageAnnotationType.SOURCES,
          data: { nodes: sources },
        },
      ]
    }
    case WorkflowEventType.UIEvent.toString(): {
      const uiEvent = event as UIEvent
      return [
        {
          type: uiEvent.data.type,
          data: uiEvent.data.data,
        },
      ]
    }
  }

  return []
}
