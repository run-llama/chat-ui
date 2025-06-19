'use client'

import { useState } from 'react'
import { ChatHandler, Message } from '../../chat/chat.interface'
import { useWorkflow } from './hook'
import { WorkflowEvent, WorkflowEventType, WorkflowHookParams } from './types'

interface ChatWorkflowHookParams extends WorkflowHookParams {}

interface ChatEvent extends WorkflowEvent {
  type: WorkflowEventType.StartEvent
  data: {
    user_msg: string
    chat_history: Omit<Message, 'annotations'>[]
  }
}

function toAssistantMessage(
  events: WorkflowEvent[]
): Omit<Message, 'annotations'> {
  let messageContent = ''
  for (const event of events) {
    if (isStreamEvent(event)) {
      messageContent += event.data.delta
    }
  }
  // TODO: convert other types of events to annotations (except start and stop events)
  return { content: messageContent, role: 'assistant' }
}

interface StreamEvent extends WorkflowEvent {
  type: WorkflowEventType.StreamEvent
  data: {
    delta: string
  }
}

function isStreamEvent(event: WorkflowEvent): event is StreamEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    'data' in event &&
    event.type === WorkflowEventType.StreamEvent.toString() &&
    typeof event.data === 'object' &&
    event.data !== null &&
    'delta' in event.data
  )
}

export function useChatWorkflow(params: ChatWorkflowHookParams): ChatHandler {
  const [input, setInput] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])

  const { start, events, stop, status } = useWorkflow<ChatEvent>({
    ...params,
    onStopEvent: event => {
      console.log('onStopEvent', event)
    },
    onError: error => {
      console.error('onError', error)
    },
  })

  const append = async (message: Message) => {
    const startEventData = {
      user_msg: input,
      chat_history: messages,
    }

    try {
      // add user message
      setMessages(prev => [...prev, message])

      // create new task, new session and stream events
      await start(startEventData)

      // convert received events to assistant message
      const assistantMessage = toAssistantMessage(events)
      setMessages(prev => [...prev, assistantMessage])
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
    setMessages: setMessages as ChatHandler['setMessages'],
    stop,
    reload: undefined, // TODO
  }
}
