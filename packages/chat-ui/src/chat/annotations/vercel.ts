import { Message, TextPartType } from '../chat.interface'

/**
 * Gets all annotations from a message (data parts)
 * Annotations are all parts that are not text parts.
 * @param message - The message to extract annotations from
 * @returns Array of data from annotations
 */
export function getVercelAnnotations(message: Message): unknown[] {
  return message.parts.filter(part => part.type !== TextPartType) ?? []
}
