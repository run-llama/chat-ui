'use client'

import { useState } from 'react'
import { ChatHandler, Message } from '../../chat/chat.interface'
import { useWorkflow } from './hook'
import { WorkflowEvent, WorkflowEventType, WorkflowHookParams } from './types'
import { extractStreamEventDelta } from './helper'

type ChatWorkflowHookParams = Pick<
  WorkflowHookParams,
  'deployment' | 'workflow'
>

interface ChatEvent extends WorkflowEvent {
  type: WorkflowEventType.StartEvent
  data: {
    messages: Omit<Message, 'annotations'>[]
  }
}

export function useChatWorkflow(params: ChatWorkflowHookParams): ChatHandler {
  const [input, setInput] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])

  const { start, stop, status } = useWorkflow<ChatEvent>({
    ...params,
    onStopEvent: event => {
      console.log('onStopEvent', event)
    },
    onError: error => {
      console.error('onError', error)
    },
    onData: event => {
      const delta = extractStreamEventDelta(event)
      if (delta) {
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
    },
  })

  const append = async (message: Message) => {
    const newMessage: Message = { content: input, role: 'user' }
    const inputMessages: Message[] = [...(messages ?? []), newMessage]

    try {
      setMessages(prev => [...prev, newMessage])
      await start({ messages: inputMessages })
    } catch (error) {
      console.error('onError', error)
    }

    // reset input
    setInput('')

    return message.content
  }

  return {
    input,
    setInput,
    isLoading: status === 'running',
    append,
    messages,
    setMessages,
    stop,
    reload: undefined, // TODO
  }
}
