'use client'

import {
  ChatInput,
  ChatMessage,
  ChatMessages,
  ChatSection,
  useChatUI,
} from '@llamaindex/chat-ui'
import { Message, useChat } from 'ai/react'

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    role: 'assistant',
  },
]

export default function Page(): JSX.Element {
  return (
    <div className="flex h-screen flex-col">
      <header className="border-b p-4">
        <h1 className="text-2xl font-bold">
          LlamaIndex Chat UI - Next.js Example
        </h1>
        <p className="text-gray-600">
          A simple chat interface using @llamaindex/chat-ui
        </p>
      </header>
      <div className="flex-1">
        <ChatExample />
      </div>
    </div>
  )
}

function ChatExample() {
  const handler = useChat({
    api: '/api/chat',
    initialMessages,
  })

  return (
    <ChatSection handler={handler} className="h-full overflow-hidden">
      <ChatMessages>
        <ChatMessages.List className="px-4 py-6">
          <CustomChatMessages />
        </ChatMessages.List>
      </ChatMessages>
      <div className="border-t p-4">
        <ChatInput>
          <ChatInput.Form>
            <ChatInput.Field placeholder="Type your message..." />
            <ChatInput.Submit />
          </ChatInput.Form>
        </ChatInput>
      </div>
    </ChatSection>
  )
}

function CustomChatMessages() {
  const { messages, isLoading, append } = useChatUI()

  return (
    <>
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          message={message}
          isLast={index === messages.length - 1}
          className="mb-4"
        >
          <ChatMessage.Avatar>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
              {message.role === 'user' ? 'U' : 'AI'}
            </div>
          </ChatMessage.Avatar>
          <ChatMessage.Content isLoading={isLoading} append={append}>
            <ChatMessage.Content.Markdown />
          </ChatMessage.Content>
          <ChatMessage.Actions />
        </ChatMessage>
      ))}
    </>
  )
}
