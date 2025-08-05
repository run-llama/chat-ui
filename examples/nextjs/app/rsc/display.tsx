'use client'

import {
  ArtifactPart,
  ChatPartProvider,
  MarkdownPart,
  MessagePart,
} from '@llamaindex/chat-ui'

export function MessageDisplay({ parts }: { parts: MessagePart[] }) {
  console.log({ parts })
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      {parts.map((part, index) => (
        <ChatPartProvider key={index} value={{ part }}>
          <ArtifactPart />
          <MarkdownPart />
        </ChatPartProvider>
      ))}
    </div>
  )
}
