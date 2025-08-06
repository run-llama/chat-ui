import type { UIMessage as Message } from '@ai-sdk/react'
import { randomUUID } from '@llamaindex/env'
import { workflowEvent } from '@llamaindex/workflow'
import {
  MetadataMode,
  type ChatMessage,
  type Metadata,
  type NodeWithScore,
} from 'llamaindex'
import { z } from 'zod'
import { getStoredFilePath } from './file'
import { getInlineAnnotations } from './inline'

// Events that appended to stream as annotations
export type SourceEventNode = {
  id: string
  metadata: Metadata
  score: number | null
  url: string
  text: string
  fileName: string
  filePath: string
}

export type SourceEventData = {
  type: 'sources'
  data: {
    nodes: SourceEventNode[]
  }
}
export const sourceEvent = workflowEvent<SourceEventData>()

export type AgentRunEventData = {
  type: 'agent'
  data: {
    agent: string
    text: string
    type: 'text' | 'progress'
    data?: { id: string; total: number; current: number } | undefined
  }
}
export const agentRunEvent = workflowEvent<AgentRunEventData>()

export function toSourceEventNode(
  node: NodeWithScore<Metadata>,
  llamaCloudOutputDir: string = 'output/llamacloud'
) {
  const { file_name, pipeline_id } = node.node.metadata

  const filePath = pipeline_id
    ? `${llamaCloudOutputDir}/${pipeline_id}$${file_name}`
    : `data/${file_name}`

  return {
    id: node.node.id_,
    fileName: file_name,
    filePath,
    url: `/api/files/${filePath}`,
    metadata: node.node.metadata,
    score: node.score ?? null,
    text: node.node.getContent(MetadataMode.NONE),
  }
}

export function toSourceEvent(
  sourceNodes: NodeWithScore<Metadata>[] = [],
  llamaCloudOutputDir: string = 'output/llamacloud'
) {
  const nodes: SourceEventNode[] = sourceNodes.map(node =>
    toSourceEventNode(node, llamaCloudOutputDir)
  )
  return sourceEvent.with({
    data: { nodes },
    type: 'sources',
  })
}

export function toAgentRunEvent(input: {
  agent: string
  text: string
  type: 'text' | 'progress'
  current?: number
  total?: number
}) {
  return agentRunEvent.with({
    data: {
      ...input,
      data:
        input.total && input.total > 1
          ? {
              id: randomUUID(),
              current: input.current ?? 1,
              total: input.total,
            }
          : undefined,
    },
    type: 'agent',
  })
}

export type ArtifactType = 'code' | 'document'

export type Artifact<T = unknown> = {
  created_at: number
  type: ArtifactType
  data: T
}

export type CodeArtifactData = {
  file_name: string
  code: string
  language: string
}

export type DocumentArtifactData = {
  title: string
  content: string
  type: string // markdown, html,...
  sources?: { id: string }[] // sources that are used to render citation numbers in the document
}

export type CodeArtifact = Artifact<CodeArtifactData> & {
  type: 'code'
}

export type DocumentArtifact = Artifact<DocumentArtifactData> & {
  type: 'document'
}

export const artifactEvent = workflowEvent<{
  type: 'artifact'
  data: Artifact
}>()

export const codeArtifactSchema = z.object({
  type: z.literal('code'),
  data: z.object({
    file_name: z.string(),
    code: z.string(),
    language: z.string(),
  }),
  created_at: z.number(),
})

export const documentArtifactSchema = z.object({
  type: z.literal('document'),
  data: z.object({
    title: z.string(),
    content: z.string(),
    type: z.string(),
  }),
  created_at: z.number(),
})

export const artifactSchema = z.union([
  codeArtifactSchema,
  documentArtifactSchema,
])

export const artifactAnnotationSchema = z.object({
  type: z.literal('artifact'),
  data: artifactSchema,
})

export function extractArtifactsFromMessage(message: ChatMessage): Artifact[] {
  const inlineAnnotations = getInlineAnnotations(message)
  const artifacts = inlineAnnotations.filter(
    (annotation): annotation is z.infer<typeof artifactAnnotationSchema> => {
      return artifactAnnotationSchema.safeParse(annotation).success
    }
  )
  return artifacts.map(artifact => artifact.data)
}

export function extractArtifactsFromAllMessages(
  messages: ChatMessage[]
): Artifact[] {
  return messages
    .flatMap(message => extractArtifactsFromMessage(message))
    .sort((a, b) => a.created_at - b.created_at)
}

export function extractLastArtifact(
  requestBody: unknown,
  type: 'code'
): CodeArtifact | undefined

export function extractLastArtifact(
  requestBody: unknown,
  type: 'document'
): DocumentArtifact | undefined

export function extractLastArtifact(
  requestBody: unknown,
  type?: ArtifactType
): Artifact | undefined

export function extractLastArtifact(
  requestBody: unknown,
  type?: ArtifactType
): CodeArtifact | DocumentArtifact | Artifact | undefined {
  const { messages } = (requestBody as { messages?: ChatMessage[] }) ?? {}
  if (!messages) return undefined

  const artifacts = extractArtifactsFromAllMessages(messages)
  if (!artifacts.length) return undefined

  if (type) {
    const lastArtifact = artifacts
      .reverse()
      .find(artifact => artifact.type === type)

    if (!lastArtifact) return undefined

    if (type === 'code') {
      return lastArtifact as CodeArtifact
    }

    if (type === 'document') {
      return lastArtifact as DocumentArtifact
    }
  }

  return artifacts[artifacts.length - 1]
}

export type ServerFile = {
  path: string
  id: string
  size: number
  type: string
  url: string
}

const FilePartType = 'data-file'

/**
 * Extract file attachments from an user message.
 * @param message - The message to extract file attachments from.
 * @returns The file attachments.
 */
export function extractFileAttachmentsFromMessage(
  message: Message
): ServerFile[] {
  const fileAttachments: ServerFile[] = []
  if (message.role === 'user' && message.parts.length) {
    for (const part of message.parts) {
      if (part.type === FilePartType) {
        const file = part.data as ServerFile
        fileAttachments.push({
          id: file.id,
          size: file.size,
          type: file.type,
          url: file.url,
          path: getStoredFilePath({ id: file.id }),
        })
      }
    }
  }
  return fileAttachments
}

/**
 * Extract file attachments from all user messages.
 * @param messages - The messages to extract file attachments from.
 * @returns The file attachments.
 */
export function extractFileAttachments(messages: Message[]): ServerFile[] {
  const fileAttachments: ServerFile[] = []

  for (const message of messages) {
    fileAttachments.push(...extractFileAttachmentsFromMessage(message))
  }

  return fileAttachments
}
