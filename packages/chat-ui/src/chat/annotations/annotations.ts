import { Message } from '../chat.interface'
import { getInlineAnnotations } from './inline'
import { isMessageAnnotation, MessageAnnotation } from './types'
import { getVercelAnnotations } from './vercel'

/**
 * Type for annotation parser functions
 */
type AnnotationParser = (message: Message) => unknown[]

/**
 * Gets all annotation data from a message by type, combining results from multiple parsers
 * @param message - The message to extract annotations from
 * @param type - The annotation type to filter by (can be standard or custom)
 * @param parsers - Array of parser functions to use (defaults to Vercel and inline parsers)
 * @returns Array of data from annotations of the specified type from all parsers
 */
export function getAnnotationData<T = unknown>(
  message: Message,
  type: string,
  parsers: AnnotationParser[] = [getVercelAnnotations, getInlineAnnotations]
): T[] {
  const allAnnotations = parsers
    .flatMap(parser => parser(message))
    .filter(a => isMessageAnnotation(a)) as MessageAnnotation<T>[]

  return allAnnotations.filter(a => a.type === type).map(a => a.data) as T[]
}
