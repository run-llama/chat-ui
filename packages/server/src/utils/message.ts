import type { UIMessage } from '@ai-sdk/react'
import type { TextPart } from 'ai'
import type {
  ChatMessage,
  JSONValue,
  MessageContentDetail,
  MessageContentTextDetail,
} from 'llamaindex'
import type { Artifact } from './events'
import type { HumanResponseEventData } from './hitl'

export const ARTIFACT_PART_TYPE = 'data-artifact' as const
export const FILE_PART_TYPE = 'data-file' as const
export const HUMAN_PART_TYPE = 'data-human' as const

export type ArtifactPart = {
  type: typeof ARTIFACT_PART_TYPE
  data: Artifact
}

export type HumanResponsePart = {
  type: typeof HUMAN_PART_TYPE
  data: JSONValue
}

export type FileData = {
  mediaType: string
  filename: string
  url: string
}

export type FilePart = {
  type: typeof FILE_PART_TYPE
  data: FileData
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

  get attachments(): FilePart[] {
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

    // for other part types, no need to convert to LlamaIndex message part
    return null
  }

  isTextPart(part: UIMessagePart): part is TextPart {
    return part.type === 'text' && 'text' in part
  }

  isFilePart(part: UIMessagePart): part is FilePart {
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
