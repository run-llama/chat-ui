import { Message } from '../chat.interface'

/**
 * Gets annotation data directly from a message by type
 * @param message - The message to extract annotations from
 * @param type - The annotation type to filter by (can be standard or custom)
 * @returns Array of data from annotations of the specified type, or null if none found
 */
export function getVercelAnnotations(message: Message): unknown[] {
  return message.annotations ?? []
}
