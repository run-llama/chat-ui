'use client'

import { ChatSection, useVercelAiSdk } from '@llamaindex/chat-ui'

export function SimpleChatSection() {
  const handler = useVercelAiSdk()
  return <ChatSection handler={handler} />
}
