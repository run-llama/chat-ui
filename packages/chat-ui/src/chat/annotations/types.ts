import { z } from 'zod'

export enum MessageAnnotationType {
  IMAGE = 'image',
  DOCUMENT_FILE = 'document_file',
  SOURCES = 'sources',
  EVENTS = 'events',
  SUGGESTED_QUESTIONS = 'suggested_questions',
  AGENT_EVENTS = 'agent',
  ARTIFACT = 'artifact',
}

export type MessageAnnotation<T = unknown> = {
  type: string
  data: T
}

export const MessageAnnotationSchema = z.object({
  type: z.string(),
  data: z.any(),
})
