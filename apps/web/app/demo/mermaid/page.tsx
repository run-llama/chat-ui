'use client'

import {
  ChatInput,
  ChatMessage,
  ChatMessages,
  ChatSection,
  useChatUI,
} from '@llamaindex/chat-ui'
import { Message, useChat } from 'ai/react'
import { Code } from '@/components/code'
import MermaidDiagram from './mermaid-diagram'

const code = `
import { ChatSection, ChatInput, ChatMessage, ChatMessages, useChatUI } from '@llamaindex/chat-ui'
import {  useChat } from 'ai/react'

// This demo requires mermaid to be installed in your project:
// pnpm add mermaid

function MermaidChat() {
  const handler = useChat()
  return (
    <ChatSection handler={handler} className="h-full">
      <MermaidChatMessages />
      <ChatInput />
    </ChatSection>
  )
}
function MermaidChatMessages() {
  const { messages, isLoading, append } = useChatUI()
  return (
    <ChatMessages>
      <ChatMessages.List>
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isLast={index === messages.length - 1}
            className="items-start"
          >
            <ChatMessage.Avatar />
            <ChatMessage.Content isLoading={isLoading} append={append} />
            <ChatMessage.Actions />
          </ChatMessage>
        ))}
      </ChatMessages.List>
    </ChatMessages>
  )
}
`
const initialMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Show me a system architecture diagram',
  },
  {
    id: '2',
    role: 'assistant',
    content: [
      'Here is a system architecture diagram showing how LlamaIndex ChatUI components interact:',
      '',
      '```mermaid',
      'graph TD',
      '  A[User] -->|Input| B[ChatInput]',
      '  B -->|Process| C[ChatSection]',
      '  C -->|Render| D[ChatMessages]',
      '  D -->|Display| E[ChatMessage]',
      '  E -->|Show| F[Content]',
      '  F -->|Render| G[Markdown]',
      '  F -->|Render| H[Images]',
      '  F -->|Render| I[Documents]',
      '  F -->|Render| J[Mermaid]',
      '  style A fill:#f9f,stroke:#333,stroke-width:2px',
      '  style B fill:#bbf,stroke:#333,stroke-width:2px',
      '  style C fill:#dfd,stroke:#333,stroke-width:2px',
      '```',
      '',
    ].join('\n'),
  },
]

export default function MermaidDemoPage(): JSX.Element {
  return (
    <div className="flex gap-10">
      <div className="hidden max-h-screen w-1/2 overflow-y-auto p-10 md:block">
        <h1 className="mb-4 text-2xl font-bold">Mermaid Diagram Demo</h1>
        <Code content={code} language="markdown" />
      </div>
      <div className="w-full md:w-1/2 md:border-l">
        <MermaidChat />
      </div>
    </div>
  )
}

function MermaidChat() {
  const handler = useChat({ initialMessages })
  return (
    <ChatSection handler={handler} className="h-full">
      <MermaidChatMessages />
      <ChatInput />
    </ChatSection>
  )
}

function MermaidChatMessages() {
  const { messages, isLoading, append } = useChatUI()
  return (
    <ChatMessages>
      <ChatMessages.List>
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isLast={index === messages.length - 1}
            className="items-start"
          >
            <ChatMessage.Avatar />
            <ChatMessage.Content isLoading={isLoading} append={append}>
              <ChatMessage.Content.Markdown
                languageRenderers={{ mermaid: MermaidDiagram }}
              />
            </ChatMessage.Content>
            <ChatMessage.Actions />
          </ChatMessage>
        ))}
      </ChatMessages.List>
    </ChatMessages>
  )
}
