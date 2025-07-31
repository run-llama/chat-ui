export enum MessageAnnotationType {
  IMAGE = 'image',
  DOCUMENT_FILE = 'document_file',
  SOURCES = 'sources',
  EVENTS = 'events',
  SUGGESTED_QUESTIONS = 'suggested_questions',
  AGENT_EVENTS = 'agent',
  ARTIFACT = 'artifact',
}

/**
 * @deprecated Use DataPart instead
 */
export type MessageAnnotation<T = unknown> = {
  type: string
  data?: T
  id?: string // TODO: support handling optional id, only last data event with the same id will be used.
}

// data parts is the same as message annotations
export type DataPart<T = unknown> = MessageAnnotation<T>

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
