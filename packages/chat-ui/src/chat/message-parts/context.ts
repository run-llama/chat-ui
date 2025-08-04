import { createContext, useContext } from 'react'
import { MessagePart } from '../chat.interface'
import { useChatMessage } from '../chat-message.context'

export interface ChatPartContext {
  part: MessagePart
}

export const chatPartContext = createContext<ChatPartContext | null>(null)

export const ChatPartProvider = chatPartContext.Provider

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

export const useAllParts = <T>(partType: string): T[] => {
  const context = useContext(chatPartContext)
  const { message } = useChatMessage()

  if (!context) {
    throw new Error('useAllParts must be used within a ChatPartProvider')
  }

  return message.parts.filter(part => part.type === partType) as T[]
}
