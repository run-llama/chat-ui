import { z } from 'zod'
import { JSONValue, Message } from './chat.interface'
import { remark } from 'remark'
import remarkParse from 'remark-parse'
import { visit } from 'unist-util-visit'

export const INLINE_ANNOTATION_KEY = 'annotation'

export enum MessageAnnotationType {
  IMAGE = 'image',
  DOCUMENT_FILE = 'document_file',
  SOURCES = 'sources',
  EVENTS = 'events',
  SUGGESTED_QUESTIONS = 'suggested_questions',
  AGENT_EVENTS = 'agent',
  ARTIFACT = 'artifact',
}

export type ImageData = {
  url: string
}

export type DocumentFileType = 'csv' | 'pdf' | 'txt' | 'docx'
export const DOCUMENT_FILE_TYPES: DocumentFileType[] = [
  'csv',
  'pdf',
  'txt',
  'docx',
]

export type DocumentFile = {
  id: string
  name: string // The uploaded file name in the backend
  size: number // The file size in bytes
  type: DocumentFileType
  url: string // The URL of the uploaded file in the backend
  refs?: string[] // DocumentIDs of the uploaded file in the vector index
}

export type DocumentFileData = {
  files: DocumentFile[]
}

export type SourceNode = {
  id: string
  metadata: Record<string, unknown>
  score?: number
  text: string
  url?: string
}

export type SourceData = {
  nodes: SourceNode[]
}

export type EventData = {
  title: string
}

export type ProgressData = {
  id: string
  total: number
  current: number
}

export type AgentEventData = {
  agent: string
  text: string
  type: 'text' | 'progress'
  data?: ProgressData
}

export type SuggestedQuestionsData = string[]

export type Artifact<T = unknown> = {
  readonly?: boolean // if enabled, artifact won't show version and cannot be edited
  inline?: boolean // mark artifact as inline, it only displayed in the markdown without showing in artifact annotations section
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

export type AnnotationData =
  | ImageData
  | DocumentFileData
  | SourceData
  | EventData
  | AgentEventData
  | SuggestedQuestionsData
  | Artifact

export type MessageAnnotation = {
  type: MessageAnnotationType
  data: AnnotationData
}

export type CustomAnnotation<T = unknown> = {
  type: string
  data: T
}

export type AnyAnnotation<T = unknown> = MessageAnnotation | CustomAnnotation<T>

export const AnyAnnotationSchema = z.object({ type: z.string(), data: z.any() })

/**
 * Gets custom message annotations that don't match any standard MessageAnnotationType
 * @param annotations - Array of message annotations to filter
 * @param filter - Optional custom filter function to apply after filtering out standard annotations
 * @returns Filtered array of custom message annotations
 *
 * First filters out any annotations that match MessageAnnotationType values,
 * then applies the optional custom filter if provided.
 * @deprecated Use getCustomAnnotations instead
 */
export function getCustomAnnotation<T = JSONValue>(
  annotations: JSONValue[] | undefined,
  filterFn?: (a: T) => boolean
): T[] {
  if (!Array.isArray(annotations) || !annotations.length) return [] as T[]
  const customAnnotations = annotations.filter(
    a => !isSupportedAnnotation(a)
  ) as T[]
  return filterFn ? customAnnotations.filter(filterFn) : customAnnotations
}

function isSupportedAnnotation(a: JSONValue): boolean {
  return (
    typeof a === 'object' &&
    a !== null &&
    a !== undefined &&
    'type' in a &&
    'data' in a &&
    Object.values(MessageAnnotationType).includes(
      a.type as MessageAnnotationType
    )
  )
}

export function getChatUIAnnotation<T extends AnnotationData>(
  annotations: MessageAnnotation[],
  type: string
): T[] {
  if (!annotations?.length) return []
  return annotations
    .filter(a => a && 'type' in a && a.type.toString() === type)
    .map(a => a.data as T)
}

/**
 * Gets custom annotations by type from message annotations
 * @param annotations - Array of message annotations (can be undefined)
 * @param type - The annotation type to filter by
 * @returns Array of data from custom annotations of the specified type
 */
export function getCustomAnnotations<T = unknown>(
  annotations: JSONValue[] | undefined,
  type: string
): T[] {
  if (!annotations?.length) return []
  return annotations
    .filter(
      a =>
        a &&
        typeof a === 'object' &&
        a !== null &&
        'type' in a &&
        a.type === type &&
        'data' in a
    )
    .map(a => (a as CustomAnnotation<T>).data)
}

export function getSourceAnnotationData(
  annotations: MessageAnnotation[]
): SourceData[] {
  const data = getChatUIAnnotation<SourceData>(
    annotations,
    MessageAnnotationType.SOURCES
  )
  if (!data.length) return []
  return data.map(item => ({
    ...item,
    nodes: item.nodes ? preprocessSourceNodes(item.nodes) : [],
  }))
}

function preprocessSourceNodes(nodes: SourceNode[]): SourceNode[] {
  // Filter source nodes has lower score
  const processedNodes = nodes.map(node => {
    // remove trailing slash for node url if exists
    if (node.url) {
      node.url = node.url.replace(/\/$/, '')
    }
    return node
  })
  return processedNodes
}

export type CodeArtifactError = {
  artifact: CodeArtifact
  errors: string[]
}

// Function to parse Markdown and extract code blocks
export function parseMarkdownCodeBlocks(markdown: string) {
  const markdownCodeBlocks: {
    language: string | null
    code: string
  }[] = []

  // Parse Markdown to AST using remark
  const processor = remark().use(remarkParse)
  const ast = processor.parse(markdown)

  // Visit all code nodes in the AST
  visit(ast, 'code', (node: any) => {
    markdownCodeBlocks.push({
      language: node.lang || null, // Language is stored in node.lang
      code: node.value, // Code content is stored in node.value
    })
  })

  return markdownCodeBlocks
}

// extract all inline annotations from markdown
export function extractInlineAnnotations(markdown: string): AnyAnnotation[] {
  const codeBlocks = parseMarkdownCodeBlocks(markdown)
  const inlineAnnotations = codeBlocks
    .filter(block => block.language === INLINE_ANNOTATION_KEY)
    .map(block => JSON.parse(block.code))

  return inlineAnnotations.filter(a => AnyAnnotationSchema.safeParse(a).success)
}

// extract all inline artifacts from markdown
export function extractInlineArtifacts(markdown: string): Artifact[] {
  const inlineAnnotations = extractInlineAnnotations(markdown)
  return inlineAnnotations
    .filter(a => a.type === MessageAnnotationType.ARTIFACT.toString())
    .map(a => a.data) as Artifact[]
}

export function extractArtifactsFromMessage(message: Message): Artifact[] {
  const inlineArtifacts = extractInlineArtifacts(message.content)
  const normalArtifacts = getChatUIAnnotation<Artifact>(
    message.annotations as MessageAnnotation[],
    MessageAnnotationType.ARTIFACT
  )
  return [...inlineArtifacts, ...normalArtifacts].sort(
    (a, b) => a.created_at - b.created_at
  )
}

// extract artifacts from all messages (sort ascending by created_at)
export function extractArtifactsFromAllMessages(messages: Message[]) {
  return messages
    .flatMap(extractArtifactsFromMessage)
    .sort((a, b) => a.created_at - b.created_at)
}

// check if two artifacts are equal by comparing their type and created time
export function isEqualArtifact(a: Artifact, b: Artifact) {
  return a.type === b.type && a.created_at === b.created_at
}
