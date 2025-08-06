import { createContext, useContext } from 'react'
import {
  DataPart,
  Message,
  MessagePart,
  TextPart,
  TextPartType,
} from '../chat.interface'

export interface ChatPartContext {
  part: MessagePart
}

export const chatPartContext = createContext<ChatPartContext | null>(null)

export const ChatPartProvider = chatPartContext.Provider

/**
 * Get the current part. Return null if the input type is not matched with current part type.
 */
export const useCurrentPart = <T>(
  type: 'text' | `data-${string}` | string
): T | null => {
  const context = useContext(chatPartContext)
  if (!context) {
    throw new Error('usePart must be used within a ChatPartProvider')
  }

  if (context.part.type !== type) return null // part type not matched
  return context.part as T // return current part
}

/**
 * Get the current part data by the given type.
 * Return null if the input type is not matched with current part type.
 * By default, it will extract text or data part data only.
 * You can provide a custom extract function to extract other part data.
 */
export const usePartData = <T>(
  type: string,
  extractData: (
    part: MessagePart
  ) => T | null = extractDataFromTextPartOrDataPart
): T | null => {
  const context = useContext(chatPartContext)

  if (!context) {
    throw new Error('usePartData must be used within a ChatPartProvider')
  }

  if (context.part.type !== type) return null // part type not matched

  return extractData(context.part)
}

/**
 * Extract all part data from a message by part type.
 * This is useful when you want to accumulate data from all parts.
 * By default, it will extract text or data part data only.
 * You can provide a custom extract function to extract other part data.
 * Eg: get all artifacts to display history, get all sources to display markdown citations.
 */
export function extractAllPartData<T>(
  message: Message,
  partType: 'text' | `data-${string}` | string,
  extractData: (
    part: MessagePart
  ) => T | null = extractDataFromTextPartOrDataPart
): T[] {
  return message.parts
    .filter(part => part.type === partType)
    .map(extractData)
    .filter(Boolean) as T[]
}

/**
 * Extract data from text or data part.
 * Return text content if the part type is text.
 * Return data content if the part type is data.
 * Return null if the part type is not text or data.
 */
export function extractDataFromTextPartOrDataPart<T>(
  part: MessagePart
): T | null {
  if (isTextPart(part)) return part.text as T
  if (isDataPart(part)) return part.data as T
  return null
}

/**
 * Data part must have type starts with `data-` and have data property.
 */
export function isDataPart(part: MessagePart): part is DataPart {
  return part.type.startsWith('data-') && 'data' in part
}

/**
 * Text part must have type `text` and have text property.
 */
export function isTextPart(part: MessagePart): part is TextPart {
  return part.type === TextPartType && 'text' in part
}
