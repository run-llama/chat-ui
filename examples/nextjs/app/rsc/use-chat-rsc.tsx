'use client'

import { generateId, TextPart, UIMessage } from 'ai'
import { useActions, useUIState } from '@ai-sdk/rsc'
import { useState } from 'react'
import { AIProvider } from './ai'
import { ChatHandler } from '@llamaindex/chat-ui'

// simple hook to create chat handler from RSC actions
// then we can easily use it with @llamaindex/chat-ui
export function useChatRSC(): ChatHandler {
  const [status, setStatus] = useState<
    'submitted' | 'streaming' | 'ready' | 'error'
  >('ready')
  const [messages, setMessages] = useUIState<AIProvider>()
  const { chatAction } = useActions<AIProvider>()

  // similar append function as useChat hook
  const append = async (message: Omit<UIMessage, 'id'>) => {
    const newMsg: UIMessage = { ...message, id: generateId() }

    setStatus('streaming')
    try {
      setMessages(prev => [
        ...prev,
        {
          ...newMsg,
          display: (
            <>
              {message.parts.map((part, index) => {
                if (part.type === 'text') {
                  return (
                    <div
                      key={index}
                      className="bg-primary text-primary-foreground ml-auto w-fit max-w-[80%] rounded-xl px-3 py-2"
                    >
                      {part.text}
                    </div>
                  )
                }
                return null
              })}
            </>
          ),
        },
      ])

      const messageContent = newMsg.parts
        .filter((part): part is TextPart => part.type === 'text')
        .map(part => part.text)
        .join('\n\n')

      const assistantMsg = await chatAction(messageContent)
      setMessages(prev => [
        ...prev,
        {
          id: generateId(),
          role: 'assistant',
          parts: [],
          display: assistantMsg,
        },
      ])
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
    setStatus('ready')

    return message
  }

  return {
    sendMessage: async message => {
      append(message)
    },
    status,
    messages,
    setMessages: setMessages as ChatHandler['setMessages'],
  }
}
