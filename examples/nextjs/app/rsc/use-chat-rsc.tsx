'use client'

import { generateId, Message } from 'ai'
import { useActions, useUIState } from 'ai/rsc'
import { useState } from 'react'
import { AIProvider } from './ai'
import { ChatHandler } from '@llamaindex/chat-ui'

// simple hook to create chat handler from RSC actions
// then we can easily use it with @llamaindex/chat-ui
export function useChatRSC(): ChatHandler {
  const [input, setInput] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [messages, setMessages] = useUIState<AIProvider>()
  const { chatAction } = useActions<AIProvider>()

  // similar append function as useChat hook
  const append = async (message: Omit<Message, 'id'>) => {
    const newMsg: Message = { ...message, id: generateId() }

    setIsLoading(true)
    try {
      setMessages(prev => [
        ...prev,
        {
          ...newMsg,
          display: <div>{message.content}</div>,
        },
      ])
      const assistantMsg = await chatAction(newMsg.content)
      setMessages(prev => [
        ...prev,
        {
          ...newMsg,
          display: assistantMsg,
        },
      ])
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
    setInput('')

    return message.content
  }

  return {
    input,
    setInput,
    isLoading,
    append,
    messages,
    setMessages: setMessages as ChatHandler['setMessages'],
  }
}
