'use client'

import { useChat } from "@ai-sdk/react";
import { ChatSection } from '@llamaindex/chat-ui'
import { Code } from '@/components/code'
import { useState } from 'react'

const code = `
import { ChatSection } from '@llamaindex/chat-ui'
import { useChat } from "@ai-sdk/react";

function SimpleChat() {
  const handler = useChat()
  return <ChatSection handler={handler} />
}
`

export default function Page(): JSX.Element {
  const [input, setInput] = useState('')
  const {
    regenerate,
    sendMessage,
    status,
    stop,
    messages,
    setMessages
  } = useChat()
  return (
    <div className="flex gap-10">
      <div className="hidden w-1/3 justify-center space-y-10 self-center p-10 md:block">
        <h1 className="bg-gradient-to-r from-[#e711dd] to-[#b5f2fd] bg-clip-text text-6xl font-bold text-transparent">
          LlamaIndex ChatUI
        </h1>
        <h1 className="mb-4 text-2xl font-bold">Simple Chat Demo</h1>
        <Code content={code} language="jsx" />
      </div>
      <div className="w-full md:w-2/3 md:border-l">
        <ChatSection
          handler={{
            input,
            setInput,
            isLoading: status === 'streaming',
            reload: regenerate,
            stop,
            append: sendMessage,
            messages,
            setMessages: (msgList) => {
              setMessages(msgList)
            },
          }}
          className="mx-auto h-screen max-w-3xl overflow-hidden p-0 md:p-5"
        />
      </div>
    </div>
  )
}
