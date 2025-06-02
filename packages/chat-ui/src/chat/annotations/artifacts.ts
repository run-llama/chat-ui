import { Message } from '../chat.interface'
import { MessageAnnotationType } from './data'
import { getAnnotationData } from './annotations'

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
  const artifacts = getAnnotationData<Artifact>(
    message,
    MessageAnnotationType.ARTIFACT
  )
  return artifacts ?? []
}

export type CodeArtifactError = {
  artifact: CodeArtifact
  errors: string[]
}
export type Artifact<T = unknown> = {
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
