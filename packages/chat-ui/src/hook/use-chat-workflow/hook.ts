'use client'

import { useState } from 'react'
import { ChatHandler, JSONValue, Message } from '../../chat/chat.interface'
import { useWorkflow } from '../use-workflow'
import { transformEventToMessageParts } from './helper'
import { ChatEvent, ChatWorkflowHookParams } from './types'

export function useChatWorkflow({
  deployment,
  workflow,
  baseUrl,
  onError,
}: ChatWorkflowHookParams): ChatHandler {
  const [input, setInput] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])

  const updateLastMessage = ({
    delta = '',
    annotations = [],
  }: {
    delta?: string // render events inline in markdown
    annotations?: JSONValue[] // render events in annotations components
  }) => {
    setMessages(prev => {
      const lastMessage = prev[prev.length - 1]

      // if last message is assistant message, update its content
      if (lastMessage?.role === 'assistant') {
        return [
          ...prev.slice(0, -1),
          {
            ...lastMessage,
            content: (lastMessage.content || '') + delta,
            annotations: [...(lastMessage.annotations || []), ...annotations],
          },
        ]
      }

      // if last message is user message, add a new assistant message
      return [...prev, { content: delta, role: 'assistant', annotations }]
    })
  }

  const { start, stop, status } = useWorkflow<ChatEvent>({
    deployment,
    workflow,
    baseUrl,
    onData: event => {
      const { delta, annotations } = transformEventToMessageParts(event)
      updateLastMessage({ delta, annotations })
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
