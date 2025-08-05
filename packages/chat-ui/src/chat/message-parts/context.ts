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
 * Get the current part data. Return null if the part type is not matched.
 */
export const usePartData = <T>(partType: string): T | null => {
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

export function getAllParts<T>(message: Message, partType: string): T[] {
  return message.parts.filter(part => part.type === partType) as T[]
}
