import { createContext, useContext } from 'react'
import { MessagePart } from '../chat.interface'
import { useChatMessage } from '../chat-message.context'

export interface ChatPartContext {
  part: MessagePart
}

export const chatPartContext = createContext<ChatPartContext | null>(null)

export const ChatPartProvider = chatPartContext.Provider

/**
 * Get a single part by type from the context. This is useful when you want to render a single part of a specific type. Eg: a image part.
 * @param partType - The type of the part to get.
 * @returns The part, or null if the part type is not found.
 */
export const usePart = <T>(partType: string): T | null => {
  const context = useContext(chatPartContext)

  if (!context) {
    throw new Error('usePart must be used within a ChatPartProvider')
  }

  if (context.part.type !== partType) {
    return null
  }

  return context.part as T
}

/**
 * Get all parts by type from the context. This is useful when you want to aggregate parts of a specific type. Eg: all sources parts.
 * @param partType - The type of the parts to get.
 * @returns The parts, or an empty array if the part type is not found.
 */
export const useAllParts = <T>(partType: string): T[] => {
  const context = useContext(chatPartContext)
  const { message } = useChatMessage()

  if (!context) {
    throw new Error('useAllParts must be used within a ChatPartProvider')
  }

  return message.parts.filter(part => part.type === partType) as T[]
}
