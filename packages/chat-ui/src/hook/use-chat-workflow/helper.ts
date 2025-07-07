import {
  MessageAnnotation,
  MessageAnnotationType,
  toInlineAnnotation,
} from '../../chat/annotations'
import { JSONValue } from '../../chat/chat.interface'
import { WorkflowEvent, WorkflowEventType } from '../use-workflow'
import {
  AgentStreamEvent,
  SourceNodesEvent,
  ToolCallEvent,
  ToolCallResultEvent,
  UIEvent,
} from './types'
import { AgentEventData, SourceNode } from '../../widgets'

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
    // convert source nodes event to source nodes annotation
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
        url: (node.metadata?.URL as string) || '',
      })) satisfies SourceNode[]

      return [
        {
          type: MessageAnnotationType.SOURCES,
          data: { nodes: sources },
        },
      ]
    }

    // convert ui events to annotations
    case WorkflowEventType.UIEvent.toString(): {
      const uiEvent = event as UIEvent
      return [
        {
          type: uiEvent.data.type,
          data: uiEvent.data.data,
        },
      ]
    }

    // transfrom ToolCallEvent to AgentEvent
    case WorkflowEventType.ToolCall.toString(): {
      const { data } = event as ToolCallEvent

      if (
        'tool_name' in data &&
        'tool_kwargs' in data &&
        typeof data.tool_kwargs === 'object'
      ) {
        const { tool_name, tool_kwargs } = data

        return [
          {
            type: MessageAnnotationType.AGENT_EVENTS,
            data: {
              agent: 'Agent',
              text: `Calling tool: ${tool_name} with: ${JSON.stringify(tool_kwargs)}`,
            } as AgentEventData,
          },
        ]
      }

      console.warn(
        `Not supported this tool call event: ${JSON.stringify(event)}`
      )

      return []
    }

    // transform ToolCallResultEvent to suitable annotations
    case WorkflowEventType.ToolCallResult.toString(): {
      const { data } = event as ToolCallResultEvent
      const { tool_output } = data

      if (
        'raw_output' in tool_output &&
        typeof tool_output.raw_output === 'object'
      ) {
        const { raw_output } = tool_output

        if (raw_output === null || typeof raw_output !== 'object') {
          console.warn(
            `Invalid raw output in tool call result event: ${JSON.stringify(event)}`
          )
          return []
        }

        // to source nodes annotation
        if (
          'source_nodes' in raw_output &&
          Array.isArray(raw_output.source_nodes)
        ) {
          const sourceNodes =
            raw_output.source_nodes as SourceNodesEvent['data']['nodes']

          const sources = sourceNodes.map(({ node, score }) => ({
            id: node.id_,
            metadata: node.metadata,
            score,
            text: node.text,
            url: (node.metadata?.URL as string) || '', // TODO
          })) satisfies SourceNode[]

          return [
            {
              type: MessageAnnotationType.SOURCES,
              data: { nodes: sources },
            },
          ]
        }
      }

      console.warn(
        `Not supported this tool call result event: ${JSON.stringify(event)}`
      )
      return []
    }

    // for other events which are not defined, convert them to vercel annotations with type is the qualified name of the event
    // eg: {"__is_pydantic": true, "value": {"item": "sample"}, "qualified_name": "myworkflow.MyEvent"}
    // will be converted to this annotation: {"type": "myworkflow.MyEvent", "data": {"item": "sample"}}
    // this is useful for customizing UI for events that are not defined in the chat-ui
    default: {
      return [
        {
          type: event.type,
          data: event.data as JSONValue,
        },
      ]
    }
  }
}
