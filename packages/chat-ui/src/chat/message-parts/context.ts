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
 * Get the current part data.
 * Return text if the part type is text.
 * Return data if the part type is data.
 * Return null if the input type is not matched with current part type.
 */
export const usePartData = <T>(
  partType: 'text' | `data-${string}`
): T | null => {
  const context = useContext(chatPartContext)

  if (!context) {
    throw new Error('usePartData must be used within a ChatPartProvider')
  }

  if (context.part.type !== partType) {
    return null
  }

  if (partType === TextPartType) {
    return (context.part as TextPart).text as T
  }

  if ('data' in context.part) {
    return (context.part as DataPart).data as T
  }

  return null
}

/**
 * Extract all part data from a message by part type.
 * This is useful when you want to accumulate data from all parts.
 * Eg: get all artifacts to display history, get all sources to display markdown citations.
 */
export function extractAllPartData<T>(
  message: Message,
  partType: 'text' | `data-${string}`
): T[] {
  return message.parts
    .filter(part => part.type === partType)
    .map(part => {
      if (part.type === TextPartType) {
        return (part as TextPart).text
      }

      if ('data' in part) {
        return (part as DataPart).data
      }

      return null
    })
    .filter(Boolean) as T[]
}
