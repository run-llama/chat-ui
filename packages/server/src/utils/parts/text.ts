import { randomUUID } from '@llamaindex/env'
import { workflowEvent, type WorkflowEventData } from '@llamaindex/workflow'
import type {
  ChatMessage,
  ChatResponseChunk,
  MessageContent,
  MessageContentTextDetail,
} from 'llamaindex'

export const TEXT_START_PART_TYPE = 'text-start'
export const TEXT_DELTA_PART_TYPE = 'text-delta'
export const TEXT_END_PART_TYPE = 'text-end'

export type TextStartPart = {
  type: typeof TEXT_START_PART_TYPE
  id: string
}

export type TextDeltaPart = {
  type: typeof TEXT_DELTA_PART_TYPE
  id: string
  delta: string
}

export type TextEndPart = {
  type: typeof TEXT_END_PART_TYPE
  id: string
}

export const textStartEvent = workflowEvent<TextStartPart>() // this event must be triggered before streaming text
export const textDeltaEvent = workflowEvent<TextDeltaPart>() // equal to agentStreamEvent but using TextDeltaPart format
export const textEndEvent = workflowEvent<TextEndPart>() // this event must be triggered after streaming text

/**
 * Send text events to stream, finish when generator is done
 * @param generator - AsyncIterable<ChatResponseChunk<object>>
 * @param sendEvent - (event: WorkflowEventData<unknown>) => void
 * @returns the final response text
 */
export async function streamText(
  generator: AsyncIterable<ChatResponseChunk<object>>,
  sendEvent: (event: WorkflowEventData<unknown>) => void
) {
  let response = ''

  if (generator) {
    // each message can have multiple text parts, so we need to use a unique id for each text part
    const textPartId = randomUUID()

    // send a start event for this text part
    sendEvent(
      textStartEvent.with({ id: textPartId, type: TEXT_START_PART_TYPE })
    )

    // consume generator and send delta events
    for await (const chunk of generator) {
      response += chunk.delta
      sendEvent(
        textDeltaEvent.with({
          id: textPartId,
          type: TEXT_DELTA_PART_TYPE,
          delta: chunk.delta,
        })
      )
    }

    // send an end event for this text part
    sendEvent(textEndEvent.with({ id: textPartId, type: TEXT_END_PART_TYPE }))
  }

  return response
}

/**
 * Extract the text content from LlamaIndex message content
 * @param message - The LlamaIndex message
 * @returns The text content of the message
 */
export function getMessageTextContent(message: MessageContent) {
  if (typeof message === 'string') {
    return message
  }
  return message
    .filter((part): part is MessageContentTextDetail => part.type === 'text')
    .map(part => part.text)
    .join('\n\n')
}
