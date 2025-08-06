'use client'

import { ChatMessage } from '@llamaindex/chat-ui'
import { DynamicEvents } from './custom/events/dynamic-events'
import { ComponentDef } from './custom/events/types'

export function ChatMessageContent({
  componentDefs,
  appendError,
}: {
  componentDefs: ComponentDef[]
  appendError: (error: string) => void
}) {
  return (
    <ChatMessage.Content>
      <DynamicEvents componentDefs={componentDefs} appendError={appendError} />
      <ChatMessage.Part.Event />
      <ChatMessage.Part.File />
      <ChatMessage.Part.Markdown />
      <ChatMessage.Part.Artifact />
      <ChatMessage.Part.Source />
      <ChatMessage.Part.Suggestion />
    </ChatMessage.Content>
  )
}
