import { createContext, useContext } from 'react'
import { ChatHandler, Message, type ChatContext } from './chat.interface'

export const chatContext = createContext<ChatContext | null>(null)

export const ChatProvider = chatContext.Provider

export const useChatUI = () => {
  const context = useContext(chatContext)
  if (!context) {
    throw new Error('useChatUI must be used within a ChatProvider')
  }
  return context
}

export interface ChatMessageContext {
  message: Message
  isLast: boolean
  isLoading?: boolean
  append?: ChatHandler['append']
}

export const chatMessageContext = createContext<ChatMessageContext | null>(null)

export const ChatMessageProvider = chatMessageContext.Provider

export const useChatMessage = () => {
  const context = useContext(chatMessageContext)
  if (!context)
    throw new Error('useChatMessage must be used within a ChatMessageProvider')
  return context
}
