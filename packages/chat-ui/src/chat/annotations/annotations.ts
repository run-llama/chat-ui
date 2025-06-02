import { Message } from '../chat.interface'

// TODO: add different methods to retrieve annotations from a message - e.g. by parsing its content for inline annotations

export type MessageAnnotation<T = unknown> = {
  type: string
  data: T
}

/**
 * Gets annotation data directly from a message by type
 * @param message - The message to extract annotations from
 * @param type - The annotation type to filter by (can be standard or custom)
 * @returns Array of data from annotations of the specified type, or null if none found
 */

export function getAnnotationData<T = unknown>(
  message: Message,
  type: string
): T[] {
  const annotations = message.annotations
  if (!annotations) return []

  const matchingAnnotations = annotations
    .filter(
      a =>
        a &&
        typeof a === 'object' &&
        a !== null &&
        'type' in a &&
        a.type === type &&
        'data' in a
    )
    .map(a => (a as { data: T }).data)

  return matchingAnnotations
}
