import { createContext, useContext } from 'react'
import { Message } from './chat.interface'

export interface ChatMessageContext {
  message: Message
  isLast: boolean
}

export const chatMessageContext = createContext<ChatMessageContext | null>(null)

export const ChatMessageProvider = chatMessageContext.Provider

export const useChatMessage = () => {
  const context = useContext(chatMessageContext)
  if (!context)
    throw new Error('useChatMessage must be used within a ChatMessageProvider')
  return context
}
