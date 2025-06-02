import { Message } from '../chat.interface'
import { MessageAnnotationType } from './data'
import {
  extractInlineAnnotations,
  getAnnotationData,
  INLINE_ANNOTATION_KEY,
} from './annotations'

// check if two artifacts are equal by comparing their type and created time
export function isEqualArtifact(a: Artifact, b: Artifact) {
  return a.type === b.type && a.created_at === b.created_at
}

// extract artifacts from all messages (sort ascending by created_at)
export function extractArtifactsFromAllMessages(messages: Message[]) {
  return messages
    .flatMap(extractArtifactsFromMessage)
    .sort((a, b) => a.created_at - b.created_at)
}

export function extractArtifactsFromMessage(message: Message): Artifact[] {
  const inlineArtifacts = extractInlineArtifacts(message.content)
  const normalArtifacts =
    getAnnotationData<Artifact>(message, MessageAnnotationType.ARTIFACT) ?? []
  return [...inlineArtifacts, ...normalArtifacts].sort(
    (a, b) => a.created_at - b.created_at
  )
}

// extract all inline artifacts from markdown
export function extractInlineArtifacts(markdown: string): Artifact[] {
  const inlineAnnotations = extractInlineAnnotations(markdown)
  return inlineAnnotations
    .filter(a => a.type === MessageAnnotationType.ARTIFACT.toString())
    .map(a => a.data) as Artifact[]
}

// convert artifact to inline markdown
export function toInlineMarkdownArtifact(artifact: Artifact) {
  const artifactInlineAnnotation = {
    type: MessageAnnotationType.ARTIFACT,
    data: artifact,
  }
  return `\`\`\`${INLINE_ANNOTATION_KEY}\n${JSON.stringify(artifactInlineAnnotation)}\n\`\`\``
}

export type CodeArtifactError = {
  artifact: CodeArtifact
  errors: string[]
}
export type Artifact<T = unknown> = {
  inline?: boolean
  created_at: number
  type: 'code' | 'document'
  data: T
}
export type CodeArtifact = Artifact<{
  file_name: string
  code: string
  language: string
}>
export type DocumentArtifact = Artifact<{
  title: string
  content: string
  type: string
}>
