import {
  agentStreamEvent,
  agentToolCallEvent,
  agentToolCallResultEvent,
  type WorkflowContext,
  type WorkflowEventData,
} from '@llamaindex/workflow'
import { type ChatMessage, type MessageContentTextDetail } from 'llamaindex'
import { downloadLlamaCloudFilesFromNodes } from './file'
import { humanInputEvent, pauseForHumanInput } from './hitl/index'
import {
  EVENT_PART_TYPE,
  generateNextQuestions,
  runEvent,
  sourceEvent,
  SUGGESTION_PART_TYPE,
  suggestionEvent,
  TEXT_DELTA_PART_TYPE,
  TEXT_END_PART_TYPE,
  TEXT_START_PART_TYPE,
  textDeltaEvent,
  textEndEvent,
  textStartEvent,
} from './parts'
import type { AgentToolCallResultParser } from './tool'

/**
 * Adapter to transform specific LlamaIndex AgentWorkflow events to standard LlamaIndexServer events
 */
export class AgentWorkflowAdapter {
  /**
   * Transform agent stream events to a text start event, multiple text delta events, and a text end event
   */
  static processStreamEvents() {
    // LlamaIndex AgentWorkflow only produces 1 message content (1 text part) each running.
    // If we support multiple text parts per agent workflow in the future, we should have an unique id for each text part.
    const agentStreamId = 'agent-workflow-stream' // id for text start event, delta events, and end event
    let hasStarted = false // this flag is used to send a start event only once
    let hasEnded = false // this flag is used to send an end event only once

    return new TransformStream({
      async transform(event, controller) {
        if (agentStreamEvent.include(event) && event.data.delta) {
          if (!hasStarted) {
            // send text start event if not sent
            hasStarted = true
            controller.enqueue(
              textStartEvent.with({
                id: agentStreamId,
                type: TEXT_START_PART_TYPE,
              })
            )
          }

          // send text delta event
          controller.enqueue(
            textDeltaEvent.with({
              id: agentStreamId,
              type: TEXT_DELTA_PART_TYPE,
              delta: event.data.delta,
            })
          )

          return
        }

        // if stream has started and this event is not agentStreamEvent, means stream has ended
        // send a text end event if it's not sent
        if (!hasEnded && hasEnded) {
          hasEnded = true
          controller.enqueue(
            textEndEvent.with({ id: agentStreamId, type: TEXT_END_PART_TYPE })
          )
        }

        // enqueue the event (not agentStreamEvent) to process by other stream pipelines
        controller.enqueue(event)
      },
    })
  }

  /**
   * Transform agent tool call events to a running event with loading status
   */
  static processToolCallEvents() {
    return new TransformStream({
      async transform(event, controller) {
        // agentToolCallEvent -> send a running event to stream
        if (agentToolCallEvent.include(event)) {
          const { agentName, toolName, toolKwargs, toolId } = event.data
          controller.enqueue(
            runEvent.with({
              id: toolId, // use toolId as id to reconciliation with agentToolCallResultEvent
              type: EVENT_PART_TYPE,
              data: {
                title: `Agent Tool Call: ${agentName}`,
                description: `Using tool: '${toolName}' with inputs: '${JSON.stringify(toolKwargs)}'`,
                status: 'pending',
              },
            })
          )
          return
        }

        controller.enqueue(event)
      },
    })
  }

  /**
   * Transform agent tool call result events to a running event with result
   * If the tool result contains source nodes, send a source event to stream
   */
  static processToolCallResultEvents(
    parsers: AgentToolCallResultParser[] = []
  ) {
    return new TransformStream({
      async transform(event, controller) {
        if (agentToolCallResultEvent.include(event)) {
          // send a running event with result to stream
          const toolCallResult = event.data
          const { toolName, toolKwargs, toolOutput, toolId } = toolCallResult
          controller.enqueue(
            runEvent.with({
              id: toolId, // use toolId as id to reconciliation with agentToolCallEvent
              type: EVENT_PART_TYPE,
              data: {
                title: `Agent Tool Call: ${toolName}`,
                description: `Using tool: '${toolName}' with inputs: '${JSON.stringify(toolKwargs)}'`,
                status: 'success',
                data: toolOutput,
              },
            })
          )

          parsers.forEach(resultParser => {
            const workflowEvent = resultParser.toWorkflowEvent(toolCallResult)
            if (workflowEvent) {
              controller.enqueue(workflowEvent)
            }
          })

          return
        }

        controller.enqueue(event)
      },
    })
  }
}

/**
 * Responsible for handling specific LlamaIndexServer events in the workflow stream
 */
export class ServerAdapter {
  static readonly encoder = new TextEncoder()

  /**
   * download resources in background if detected
   */
  static processDownloadResources() {
    return new TransformStream({
      async transform(event, controller) {
        if (sourceEvent.include(event)) {
          // if source event is detected and having llamaCloud files, download them in background
          controller.enqueue(sourceEvent)
          downloadLlamaCloudFilesFromNodes(event.data.data.nodes)
          return
        }

        controller.enqueue(event)
      },
    })
  }

  /**
   * When human input is detected:
   * - send a human input event to stream (to display human input in UI)
   * - pause the workflow and save the snapshot
   * - stop the stream
   */
  static processHumanEvents(options: {
    context: WorkflowContext
    requestId?: string | undefined
  }) {
    const { requestId, context } = options

    return new TransformStream({
      async transform(event, controller) {
        if (humanInputEvent.include(event)) {
          controller.enqueue(humanInputEvent.with(event.data))
          await pauseForHumanInput(context, event.data.response, requestId)
          controller.terminate()
          return
        }

        controller.enqueue(event)
      },
    })
  }

  /**
   * Accumulate text parts from stream and do post processing such as suggest next questions
   */
  static postActions(options?: {
    chatHistory?: ChatMessage[]
    enableSuggestion?: boolean
  }) {
    const { enableSuggestion, chatHistory } = options ?? {}

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
        controller.enqueue(event)
      },
      async flush(controller) {
        if (Object.keys(accumulatedTextParts).length === 0) return

        const newMessage: ChatMessage = {
          role: 'assistant',
          content: Object.values(accumulatedTextParts),
        }
        const conversation: ChatMessage[] = [...(chatHistory ?? []), newMessage]

        if (enableSuggestion) {
          const nextQuestions = await generateNextQuestions(conversation)
          controller.enqueue(
            suggestionEvent.with({
              type: SUGGESTION_PART_TYPE,
              data: nextQuestions,
            })
          )
        }
      },
    })
  }

  /**
   * Transform LlamaIndexServer events to Server-Sent Events (SSE)
   * This is useful when we want to send events to client in SSE format to work with Vercel v5
   */
  static transformToSSE() {
    return new TransformStream<WorkflowEventData<unknown>>({
      async transform(event, controller) {
        if (ServerAdapter.isValidUIEvent(event)) {
          controller.enqueue(ServerAdapter.toSSE(event.data))
        }
      },
    })
  }

  /**
   * useChat will stop stream immediately if it's not valid (only support text parts or data-* parts)
   * Therefore, we need to filter out the events that are not valid with Vercel AI SDK contract
   * See how Vercel AI SDK useChat validate the parts here:
   * https://github.com/vercel/ai/blob/d583b8487450f0c0f12508cc2a8309c676653357/packages/ai/src/ui/process-ui-message-stream.ts#L630-L636
   */
  private static isValidUIEvent(event: WorkflowEventData<unknown>) {
    if (
      typeof event.data === 'object' &&
      event.data !== null &&
      'type' in event.data &&
      typeof event.data.type === 'string'
    ) {
      const { type } = event.data

      if (
        [
          TEXT_DELTA_PART_TYPE,
          TEXT_START_PART_TYPE,
          TEXT_END_PART_TYPE,
        ].includes(type)
      ) {
        return true
      }

      if (type.startsWith('data-') && 'data' in event.data) {
        return true
      }
    }

    return false
  }

  private static toSSE<T>(data: T) {
    return ServerAdapter.encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
  }
}
