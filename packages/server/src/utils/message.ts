import type { UIMessage } from '@ai-sdk/react'
import type { FileUIPart, TextPart } from 'ai'
import type {
  ChatMessage,
  JSONValue,
  MessageContentDetail,
  MessageContentFileDetail,
  MessageContentTextDetail,
} from 'llamaindex'
import type { Artifact } from './events'
import type { HumanResponseEventData } from './hitl'

export const ARTIFACT_PART_TYPE = 'data-artifact' as const
export const FILE_PART_TYPE = 'file' as const
export const HUMAN_PART_TYPE = 'data-human' as const

export type ArtifactPart = {
  type: typeof ARTIFACT_PART_TYPE
  data: Artifact
}

export type HumanResponsePart = {
  type: typeof HUMAN_PART_TYPE
  data: JSONValue
}

type UIMessagePart = UIMessage['parts'][number]

/**
 * The central class for handling messages in the LlamaIndex Server.
 * - Extract necessary information from Vercel AI SDK message
 * - Convert Vercel AI SDK message to LLamaIndex message
 */
export class ServerMessage {
  uiMessage: UIMessage

  constructor(uiMessage: UIMessage) {
    this.uiMessage = uiMessage
  }

  get artifacts(): Artifact[] {
    return this.uiMessage.parts
      .filter(this.isArtifactPart)
      .map(part => part.data)
  }

  get lastArtifact(): Artifact | undefined {
    return this.artifacts[this.artifacts.length - 1]
  }

  get attachments(): FileUIPart[] {
    return this.uiMessage.parts.filter(this.isFilePart)
  }

  get humanResponse(): HumanResponseEventData[] {
    return this.uiMessage.parts.filter(this.isHumanResponsePart).map(part => ({
      type: 'human_response',
      data: part.data,
    }))
  }

  get llamaindexMessage(): ChatMessage {
    return {
      role: this.uiMessage.role,
      content: this.uiMessage.parts
        .map(this.toLlamaIndexMessagePart)
        .filter(Boolean) as MessageContentDetail[],
    }
  }

  toLlamaIndexMessagePart(part: UIMessagePart): MessageContentDetail | null {
    // convert vercel ai text part to LlamaIndex text part
    if (this.isTextPart(part)) {
      return {
        type: 'text',
        text: part.text,
      } satisfies MessageContentTextDetail
    }

    // convert vercel ai file part to LlamaIndex file part
    if (this.isFilePart(part)) {
      return {
        type: 'file',
        mimeType: part.mediaType,
        data: part.url,
      } satisfies MessageContentFileDetail
    }

    // for other part types, no need to convert to LlamaIndex message part
    return null
  }

  isTextPart(part: UIMessagePart): part is TextPart {
    return part.type === 'text' && 'text' in part
  }

  isFilePart(part: UIMessagePart): part is FileUIPart {
    return (
      part.type === FILE_PART_TYPE && this.hasFields(part, ['mediaType', 'url'])
    )
  }

  isArtifactPart(part: UIMessagePart): part is ArtifactPart {
    return part.type === ARTIFACT_PART_TYPE && this.hasFields(part, ['data'])
  }

  isHumanResponsePart(part: UIMessagePart): part is HumanResponsePart {
    return part.type === HUMAN_PART_TYPE && this.hasFields(part, ['data'])
  }

  hasFields(part: UIMessagePart, fields: string[]): boolean {
    return fields.every(field => field in part)
  }
}
