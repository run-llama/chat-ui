'use client'

import { useState } from 'react'
import { ChatHandler, Message } from '../../chat/chat.interface'
import { RunStatus, useWorkflow } from '../use-workflow'
import { transformEventToMessageParts } from './helper'
import {
  ChatEvent,
  ChatWorkflowHookHandler,
  ChatWorkflowHookParams,
} from './types'
import { MessagePart, TextPart, TextPartType } from '../../chat/message-parts'

const runStatusToChatStatus: Record<RunStatus, ChatHandler['status']> = {
  idle: 'ready',
  running: 'streaming',
  complete: 'submitted',
  error: 'error',
}

export function useChatWorkflow({
  deployment,
  workflow,
  baseUrl,
  onError,
  fileServerUrl,
}: ChatWorkflowHookParams): ChatWorkflowHookHandler {
  const [messages, setMessages] = useState<Message[]>([])

  const updateLastMessage = (parts: MessagePart[]) => {
    setMessages(prev => {
      const lastMessage = prev[prev.length - 1]

      // if last message is assistant message, update its content
      if (lastMessage?.role === 'assistant') {
        const updatedParts = [...lastMessage.parts, ...parts]

        // Merge adjacent text parts while preserving order
        const mergedParts = mergeAdjacentTextParts(updatedParts)

        return [
          ...prev.slice(0, -1),
          {
            ...lastMessage,
            parts: mergedParts,
          },
        ]
      }

      // if last message is user message, add a new assistant message
      return [...prev, { role: 'assistant', parts } as Message]
    })
  }

  const { start, stop, status, sendEvent } = useWorkflow<ChatEvent>({
    deployment,
    workflow,
    baseUrl,
    onData: event => {
      const parts = transformEventToMessageParts(event, fileServerUrl)
      updateLastMessage(parts)
    },
  })

  const append = async (newMessage: Message) => {
    setMessages(prev => [...prev, newMessage])

    const newMessageContent = getTextMessageContent(newMessage)
    if (!newMessageContent) return

    try {
      await start({ user_msg: newMessageContent, chat_history: messages })
    } catch (error) {
      onError?.(error)
    }

    return newMessageContent
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
      const lastUserMessageContent = lastUserMessage.parts.find(
        (part): part is TextPart => part.type === TextPartType
      )?.text

      if (!lastUserMessageContent) return

      await start({
        user_msg: lastUserMessageContent,
        chat_history: chatHistory,
      })
    } catch (error) {
      onError?.(error)
    }
  }

  // resume is used to send events to the current workflow run without creating a new task
  const handleResume = async (eventType: string, eventData: any) => {
    try {
      await sendEvent({ type: eventType as ChatEvent['type'], data: eventData })
    } catch (error) {
      onError?.(error)
    }
  }

  return {
    status: runStatusToChatStatus[status || 'idle'],
    messages,
    setMessages,
    stop: handleStop,
    sendMessage: async (message: Message) => {
      await append(message)
    },
    regenerate: async () => {
      await handleReload()
    },
    resume: handleResume,
  }
}

function getTextMessageContent(message: Message): string {
  return message.parts
    .filter((part): part is TextPart => part.type === TextPartType)
    .map(part => part.text)
    .join('\n\n')
}

function mergeAdjacentTextParts(parts: MessagePart[]): MessagePart[] {
  const result: MessagePart[] = []

  for (let i = 0; i < parts.length; i++) {
    const currentPart = parts[i]

    if (currentPart.type === TextPartType) {
      // Collect all consecutive text parts
      let mergedText = (currentPart as TextPart).text
      let j = i + 1

      while (j < parts.length && parts[j].type === TextPartType) {
        mergedText += (parts[j] as TextPart).text
        j++
      }

      // Add the merged text part
      result.push({ type: TextPartType, text: mergedText })

      // Skip the parts we've already processed
      i = j - 1
    } else {
      // Non-text part, add as-is
      result.push(currentPart)
    }
  }

  return result
}
