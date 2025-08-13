import { JSONValue } from '../../chat/chat.interface'
import {
  ArtifactPartType,
  EventPartType,
  SourcesPartType,
  MessagePart,
} from '../../chat/message-parts'
import { ChatEvent, SourceNode } from '../../widgets'
import { WorkflowEvent, WorkflowEventType } from '../use-workflow'
import {
  AgentStreamEvent,
  RawNodeWithScore,
  SourceNodesEvent,
  ToolCallEvent,
  ToolCallResultEvent,
  UIEvent,
} from './types'

/**
 * Transform a workflow event to message parts
 * - if event is an agent stream event, return the delta
 * - if event is an inline event, convert the data to inline annotation and return the delta
 * - otherwise, return input event as Vercel annotation
 * @param event - The event to transform
 * @returns The message parts (delta and annotations)
 */
export function transformEventToMessageParts(
  event: WorkflowEvent,
  fileServerUrl?: string
): MessagePart[] {
  if (isAgentStreamEvent(event)) {
    return [{ type: 'text', text: event.data.delta }]
  }

  return toMessageParts(event, fileServerUrl)
}

function isAgentStreamEvent(event: WorkflowEvent): event is AgentStreamEvent {
  const hasDelta =
    typeof event.data === 'object' &&
    event.data !== null &&
    'delta' in event.data

  return event.type === WorkflowEventType.AgentStream.toString() && hasDelta
}

function toMessageParts(
  event: WorkflowEvent,
  fileServerUrl?: string
): MessagePart[] {
  switch (event.type) {
    case WorkflowEventType.ArtifactEvent.toString(): {
      return [
        {
          type: ArtifactPartType,
          data: event.data,
        },
      ]
    }

    // convert source nodes event to source nodes annotation
    case WorkflowEventType.SourceNodesEvent.toString(): {
      const nodes = (event as SourceNodesEvent).data?.nodes || []

      if (nodes.length === 0) {
        console.warn(
          `No nodes found in source nodes event. Event type: ${event.type}. Data: ${JSON.stringify(event.data)}`
        )
        return []
      }

      return [
        {
          type: SourcesPartType,
          data: {
            nodes: nodes.map(rawNode =>
              convertRawNodeToSourceNode(rawNode, fileServerUrl)
            ),
          },
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
            type: EventPartType,
            data: {
              title: 'Agent',
              description: `Calling tool: ${tool_name} with: ${JSON.stringify(tool_kwargs)}`,
            } as ChatEvent,
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
        typeof tool_output.raw_output === 'object' &&
        tool_output.raw_output !== null
      ) {
        const { raw_output } = tool_output

        // to source nodes annotation
        if (
          'source_nodes' in raw_output &&
          Array.isArray(raw_output.source_nodes)
        ) {
          const rawNodes = raw_output.source_nodes as RawNodeWithScore[]
          return [
            {
              type: SourcesPartType,
              data: {
                nodes: rawNodes.map(rawNode =>
                  convertRawNodeToSourceNode(rawNode, fileServerUrl)
                ),
              },
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
          type: `data-${event.type}`,
          data: event.data as JSONValue,
        },
      ]
    }
  }
}

function convertRawNodeToSourceNode(
  rawNode: RawNodeWithScore,
  fileServerUrl?: string
): SourceNode {
  const { node, score } = rawNode

  return {
    id: node.id_,
    metadata: node.metadata,
    score,
    text: node.text,
    url: getDocumentUrlFromRawNode(rawNode, fileServerUrl),
  }
}

function getDocumentUrlFromRawNode(
  rawNode: RawNodeWithScore,
  fileServerUrl?: string
): string {
  const { metadata } = rawNode.node
  const { URL: fileURL, pipeline_id } = metadata

  // if the file URL is provided in the metadata, use it
  if (fileURL) return fileURL

  // if `fileServerUrl` is not provided, return empty string
  if (!fileServerUrl) {
    console.warn(
      `No 'fileServerUrl' provided. Nodes won't be displayed in ChatSources UI.`
    )
    return ''
  }

  let fileName = metadata?.file_name

  // check if file_name is provided in the metadata
  if (!fileName) {
    console.warn(
      `No file name found in this raw node: ${JSON.stringify(rawNode)}. It won't be displayed in ChatSources UI.`
    )
    return ''
  }

  if (pipeline_id) {
    // pipeline_id is provided, the file is stored in LlamaCloud, make sure to cache it at the `fileServerUrl`
    fileName = `${pipeline_id}$${fileName}`
  }

  return `${fileServerUrl}/${fileName}`
}
