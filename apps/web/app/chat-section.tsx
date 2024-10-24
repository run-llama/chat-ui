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
      <ChatMessages className="rounded-xl shadow-xl" />
      <ChatInput className="rounded-xl shadow-xl" />
    </ChatSection>
  )
}
