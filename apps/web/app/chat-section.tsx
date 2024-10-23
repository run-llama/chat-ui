'use client'

import '@llamaindex/chat-ui/styles.css'
import './theme.css'
import { ChatSection, useVercelAiSdk } from '@llamaindex/chat-ui'

export function SimpleChatSection() {
  const handler = useVercelAiSdk()
  return <ChatSection handler={handler} />
}
