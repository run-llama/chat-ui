'use client'

import '@llamaindex/chat-ui/styles.css'
import './theme.css'
import {
  ChatInput,
  ChatMessages,
  ChatSection,
  useVercelAiSdk,
} from '@llamaindex/chat-ui'

export function SimpleChatSection() {
  const handler = useVercelAiSdk()
  return <ChatSection handler={handler} />
}

export function StyledChatSection() {
  const handler = useVercelAiSdk()

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
