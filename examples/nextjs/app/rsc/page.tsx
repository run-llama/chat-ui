'use client'

import {
  ChatCanvas,
  ChatInput,
  ChatMessage,
  ChatMessages,
  ChatSection,
  Message,
  useChatUI,
} from '@llamaindex/chat-ui'
import { useChatRSC } from './use-chat-rsc'
import { ReactNode } from 'react'

export default function Page(): JSX.Element {
  return (
    <div className="flex h-screen flex-col">
      <header className="w-full border-b p-4 text-center">
        <h1 className="text-2xl font-bold">
          LlamaIndex Chat UI - RSC Next.js Example
        </h1>
        <p className="text-gray-600">
          A simple chat interface using @llamaindex/chat-ui and RSC
        </p>
      </header>
      <div className="min-h-0 flex-1">
        <ChatExample />
      </div>
    </div>
  )
}

function ChatExample() {
  const handler = useChatRSC() // use the RSC hook to create the chat handler

  return (
    <ChatSection
      handler={handler}
      className="block h-full flex-row gap-4 p-0 md:flex md:p-5"
    >
      <div className="md:max-w-1/2 mx-auto flex h-full min-w-0 max-w-full flex-1 flex-col gap-4">
        <CustomChatMessages />
        <ChatInput />
      </div>
      <ChatCanvas className="w-full md:w-2/3" />
    </ChatSection>
  )
}

// custom chat messages to display the UI from the RSC actions
function CustomChatMessages() {
  const { messages } = useChatUI()

  const frontendMessages = messages.map(message => ({
    ...message,
    display: (
      <ChatMessage.Content>
        {(message as Message & { display: ReactNode }).display}
      </ChatMessage.Content>
    ),
  }))

  return (
    <ChatMessages>
      <ChatMessages.List className="px-4 py-6">
        {frontendMessages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isLast={index === messages.length - 1}
          >
            <ChatMessage.Avatar />
            <ChatMessage.Content>{message.display}</ChatMessage.Content>
            <ChatMessage.Actions />
          </ChatMessage>
        ))}
        <ChatMessages.Loading />
      </ChatMessages.List>
    </ChatMessages>
  )
}
