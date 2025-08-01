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

export function isMessageAnnotation(
  annotation: unknown
): annotation is MessageAnnotation {
  return (
    annotation !== null &&
    typeof annotation === 'object' &&
    'type' in annotation &&
    'data' in annotation &&
    typeof (annotation as any).type === 'string'
  )
}
