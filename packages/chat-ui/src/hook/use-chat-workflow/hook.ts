'use client'

import { useState } from 'react'
import { ChatHandler, Message } from '../../chat/chat.interface'
import { useWorkflow } from '../use-workflow'
import { isAgentStreamEvent, isUIEvent } from './helper'
import {
  AgentStreamEvent,
  ChatEvent,
  ChatWorkflowHookParams,
  UIEvent,
} from './types'

export function useChatWorkflow({
  deployment,
  workflow,
  baseUrl,
  onError,
}: ChatWorkflowHookParams): ChatHandler {
  const [input, setInput] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])

  const { start, stop, status } = useWorkflow<ChatEvent>({
    deployment,
    workflow,
    baseUrl,
    onData: event => {
      if (isAgentStreamEvent(event)) {
        const delta = (event as AgentStreamEvent).data.delta
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1]
          // if last message is assistant message, update its content
          if (lastMessage?.role === 'assistant') {
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, content: lastMessage.content + delta },
            ]
          }
          // if last message is user message, add a new assistant message
          return [...prev, { content: delta, role: 'assistant' }]
        })
      }

      if (isUIEvent(event)) {
        const { ui_type, data } = (event as UIEvent).data
        const annotation = { type: ui_type, data }

        setMessages(prev => {
          const lastMessage = prev[prev.length - 1]
          // if last message is assistant message, add annotation to it
          if (lastMessage?.role === 'assistant') {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMessage,
                annotations: [...(lastMessage.annotations || []), annotation],
              },
            ]
          }
          // if last message is user message, add a new assistant message with annotation
          return [
            ...prev,
            {
              content: '',
              role: 'assistant',
              annotations: [annotation],
            },
          ]
        })
      }
    },
  })

  const append = async (newMessage: Message) => {
    setMessages(prev => [...prev, newMessage])

    try {
      await start({ user_msg: newMessage.content, chat_history: messages })
    } catch (error) {
      onError?.(error)
    }

    return newMessage.content
  }

  const handleStop = async () => {
    await stop()
  }

  const handleReload = async () => {
    const lastUserMessage = [...messages]
      .reverse()
      .find(message => message.role === 'user')

    if (!lastUserMessage) return

    const chatHistory = messages.slice(0, -2)
    setMessages([...chatHistory, lastUserMessage])

    try {
      await start({
        user_msg: lastUserMessage.content,
        chat_history: chatHistory,
      })
    } catch (error) {
      onError?.(error)
    }
  }

  const isLoading = status === 'running'

  return {
    input,
    setInput,
    isLoading,
    append,
    messages,
    setMessages,
    stop: handleStop,
    reload: handleReload,
  }
}
