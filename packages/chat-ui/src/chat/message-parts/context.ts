import { createContext, useContext } from 'react'
import { Message, MessagePart } from '../chat.interface'
import { useChatMessage } from '../chat-message.context'

export interface ChatPartContext {
  part: MessagePart
}

export const chatPartContext = createContext<ChatPartContext | null>(null)

export const ChatPartProvider = chatPartContext.Provider

/**
 * Get the current part. Return null if the part type is not matched.
 */
export const useCurrentPart = <T>(partType: string): T | null => {
  const context = useContext(chatPartContext)

  if (!context) {
    throw new Error('useCurrentPart must be used within a ChatPartProvider')
  }

  if (context.part.type !== partType) {
    return null
  }

  return context.part as T
}

export function getAllParts<T>(message: Message, partType: string): T[] {
  return message.parts.filter(part => part.type === partType) as T[]
}
