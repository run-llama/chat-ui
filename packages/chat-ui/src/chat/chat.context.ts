import { createContext, useContext } from 'react'
import { type ChatContext } from './chat.interface'

export const chatContext = createContext<ChatContext | null>(null)

export const ChatProvider = chatContext.Provider

export const useChatUI = () => {
  const context = useContext(chatContext)
  if (!context) {
    throw new Error('useChatUI must be used within a ChatProvider')
  }
  return context
}
