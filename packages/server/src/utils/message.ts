import type { UIMessage } from '@ai-sdk/react'
import type { TextPart } from 'ai'
import type {
  ChatMessage,
  MessageContentDetail,
  MessageContentTextDetail,
} from 'llamaindex'
import {
  HUMAN_RESPONSE_PART_TYPE,
  type HumanResponseEventData,
  type HumanResponsePart,
} from './hitl'
import {
  ARTIFACT_PART_TYPE,
  FILE_PART_TYPE,
  type Artifact,
  type ArtifactPart,
  type ArtifactType,
  type CodeArtifact,
  type DocumentArtifact,
  type FilePart,
} from './parts'

type UIMessagePart = UIMessage['parts'][number] // inter from Vercel Message type

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
      .filter(part => this.isArtifactPart(part))
      .map(part => part.data)
  }

  getLastArtifact(type: 'code'): CodeArtifact | undefined
  getLastArtifact(type: 'document'): DocumentArtifact | undefined
  getLastArtifact(type: ArtifactType): Artifact | undefined {
    return this.artifacts.reverse().find(artifact => artifact.type === type)
  }

  get attachments(): FilePart[] {
    return this.uiMessage.parts.filter(part => this.isFilePart(part))
  }

  get humanResponse(): HumanResponseEventData[] {
    return this.uiMessage.parts.filter(part => this.isHumanResponsePart(part))
  }

  get llamaindexMessage(): ChatMessage {
    return {
      role: this.uiMessage.role,
      content: this.uiMessage.parts
        .map(part => this.toLlamaIndexMessagePart(part))
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
    return part.type === FILE_PART_TYPE && this.hasFields(part, ['data'])
  }

  isArtifactPart(part: UIMessagePart): part is ArtifactPart {
    return part.type === ARTIFACT_PART_TYPE && this.hasFields(part, ['data'])
  }

  isHumanResponsePart(part: UIMessagePart): part is HumanResponsePart {
    return (
      part.type === HUMAN_RESPONSE_PART_TYPE && this.hasFields(part, ['data'])
    )
  }

  hasFields(part: UIMessagePart, fields: string[]): boolean {
    return fields.every(field => field in part)
  }
}

export function toServerMessage(message: UIMessage): ServerMessage {
  return new ServerMessage(message)
}
