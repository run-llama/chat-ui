'use client'

import '@llamaindex/chat-ui/styles.css'
import './theme.css'
import { ChatInput, ChatMessages, ChatSection } from '@llamaindex/chat-ui'
import { useChat } from 'ai/react'

export function SimpleChatSection() {
  const handler = useChat({ api: '/api/chat' })
  return <ChatSection handler={handler} />
}

export function StyledChatSection() {
  const handler = useChat({ api: '/api/chat' })
  return (
    <ChatSection handler={handler}>
      <ChatMessages className="rounded-xl shadow-xl">
        <ChatMessages.List />
        <ChatMessages.Actions />
      </ChatMessages>
      <ChatInput className="rounded-xl shadow-xl">
        <ChatInput.Preview />
        <ChatInput.Form>
          <ChatInput.Field />
          <ChatInput.Upload />
          <ChatInput.Submit />
        </ChatInput.Form>
      </ChatInput>
    </ChatSection>
  )
}
