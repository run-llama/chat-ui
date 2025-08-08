import {
  agentStreamEvent,
  agentToolCallEvent,
  agentToolCallResultEvent,
  type WorkflowEvent,
} from '@llamaindex/workflow'
import { type MessageContentTextDetail } from 'llamaindex'
import { humanInputEvent, type HumanResponseEventData } from './hitl/index'
import {
  getSourceNodesFromToolOutput,
  runEvent,
  textDeltaEvent,
  textEndEvent,
  textStartEvent,
  toSourceEvent,
  type SourceEventNode,
} from './parts'

/**
 * Adapter to transform specific LlamaIndex AgentWorkflow events to standard LlamaIndexServer events
 */
export class AgentWorkflowAdapter {
  /**
   * Transform agent stream events to a text start event, multiple text delta events, and a text end event
   */
  static processAgentStreamEvents() {
    // LlamaIndex AgentWorkflow only produces 1 message content (1 text part) each running.
    // If we support multiple text parts per agent workflow in the future, we should have an unique id for each text part.
    const agentStreamId = 'agent-workflow-stream' // id for text start event, delta events, and end event
    let hasStarted = false // this flag is used to send a start event only once
    let hasEnded = false // this flag is used to send an end event only once

    return new TransformStream({
      async transform(event, controller) {
        if (agentStreamEvent.include(event)) {
          if (!hasStarted) {
            // send text start event if not sent
            hasStarted = true
            controller.enqueue(
              textStartEvent.with({ id: agentStreamId, type: 'text-start' })
            )
          }

          // send text delta event
          controller.enqueue(
            textDeltaEvent.with({
              id: agentStreamId,
              type: 'text-delta',
              delta: event.data.delta,
            })
          )
        } else {
          // if stream has started and this event is not agentStreamEvent, means stream has ended
          // send a text end event if it's not sent
          if (!hasEnded) {
            hasEnded = true
            controller.enqueue(
              textEndEvent.with({ id: agentStreamId, type: 'text-end' })
            )
          }
        }
      },
    })
  }
  /**
   * Transform agent tool call events and agent tool call result events to a running event with result and loading status
   */
  static processAgentToolCallEvents() {
    return new TransformStream({
      async transform(event, controller) {
        // agentToolCallEvent -> send a running event to stream
        if (agentToolCallEvent.include(event)) {
          const { agentName, toolName, toolKwargs, toolId } = event.data
          controller.enqueue(
            runEvent.with({
              id: toolId, // use toolId as id to reconciliation with agentToolCallResultEvent
              type: 'data-event',
              data: {
                title: `Agent Tool Call: ${agentName}`,
                description: `Using tool: '${toolName}' with inputs: '${JSON.stringify(toolKwargs)}'`,
                status: 'pending',
              },
            })
          )
        }

        // agentToolCallResultEvent -> send a running event with result to stream
        if (agentToolCallResultEvent.include(event)) {
          const { toolName, toolKwargs, toolOutput, toolId } = event.data
          controller.enqueue(
            runEvent.with({
              id: toolId, // use toolId as id to reconciliation with agentToolCallEvent
              type: 'data-event',
              data: {
                title: `Agent Tool Call: ${toolName}`,
                description: `Using tool: '${toolName}' with inputs: '${JSON.stringify(toolKwargs)}'`,
                status: 'success',
                data: toolOutput,
              },
            })
          )
        }
      },
    })
  }

  /**
   * Extract source nodes from tool result and send a source event to stream
   * This is useful when AgentWorkflow was using queryEngineTool and the tool result contains source nodes
   */
  static processSourceNodesFromToolResult(options?: {
    llamaCloudOutputDir?: string
    onDetectSourceNodes?: (sourceNodes: SourceEventNode[]) => void
  }) {
    const { llamaCloudOutputDir, onDetectSourceNodes } = options ?? {}
    return new TransformStream({
      async transform(event, controller) {
        if (agentToolCallResultEvent.include(event)) {
          const rawOutput = event.data.raw
          const sourceNodes = getSourceNodesFromToolOutput(rawOutput)

          if (sourceNodes.length > 0) {
            const sourceEvent = toSourceEvent(sourceNodes, llamaCloudOutputDir)
            controller.enqueue(sourceEvent)
            onDetectSourceNodes?.(sourceEvent.data.data.nodes)
          }
        }
      },
    })
  }
}

/**
 * Responsible for handling specific LlamaIndexServer events in the workflow stream
 */
export class LlamaIndexServerAdapter {
  static readonly encoder = new TextEncoder()

  /**
   * When human input is detected:
   * - send a human input event to stream (to display human input in UI)
   * - trigger the onPause callback to pause the workflow and save the snapshot
   * - stop the stream
   */
  static processHumanEvents(options: {
    onPause: (
      responseEvent: WorkflowEvent<HumanResponseEventData>
    ) => Promise<void>
  }) {
    const { onPause } = options

    return new TransformStream({
      async transform(event, controller) {
        if (humanInputEvent.include(event)) {
          controller.enqueue(humanInputEvent.with(event.data))
          await onPause(event.data.response)
          controller.terminate() // stop the stream
        }
      },
    })
  }

  /**
   * Transform LlamaIndexServer events to SSE events
   * This is useful when we want to send events to client in SSE format to work with Vercel v5
   */
  static toSSE(options?: {
    onDone?: (textParts: MessageContentTextDetail[]) => void
  }) {
    const { onDone } = options ?? {}

    // get the text parts from stream
    const accumulatedTextParts: Record<string, MessageContentTextDetail> = {}

    return new TransformStream({
      async transform(event, controller) {
        if (textDeltaEvent.include(event)) {
          const textPart = accumulatedTextParts[event.data.id]
          if (textPart) {
            // if text part already exists, append the delta to the text
            textPart.text += event.data.delta
          } else {
            // if text part does not exist, add a new text part
            accumulatedTextParts[event.data.id] = {
              type: 'text',
              text: event.data.delta,
            }
          }
        }

        // send the event to stream in SSE format
        controller.enqueue(
          LlamaIndexServerAdapter.encoder.encode(
            `data: ${JSON.stringify(event)}\n\n`
          )
        )
      },
      flush() {
        const textParts = Object.values(accumulatedTextParts)
        onDone?.(textParts)
      },
    })
  }
}
