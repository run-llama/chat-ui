'use client'

import {
  ArtifactPartUI,
  ChatPartProvider,
  MarkdownPartUI,
  MessagePart,
} from '@llamaindex/chat-ui'

export function MessageDisplay({ parts }: { parts: MessagePart[] }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      {parts.map((part, index) => (
        <ChatPartProvider key={index} value={{ part }}>
          <ArtifactPartUI />
          <MarkdownPartUI />
        </ChatPartProvider>
      ))}
    </div>
  )
}
