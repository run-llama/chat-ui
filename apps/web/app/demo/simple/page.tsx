'use client'

import { useChat } from 'ai/react'
import { ChatSection } from '@llamaindex/chat-ui'
import { Code } from '@/components/code'

const code = `
import { ChatSection } from '@llamaindex/chat-ui'
import { useChat } from 'ai/react'

function SimpleChat() {
  const handler = useChat()
  return <ChatSection handler={handler} />
}
`

export default function Page(): JSX.Element {
  const handler = useChat()
  return (
    <div className="flex gap-10">
      <div className="w-1/3 justify-center space-y-10 self-center p-10">
        <h1 className="bg-gradient-to-r from-[#e711dd] to-[#b5f2fd] bg-clip-text text-6xl font-bold text-transparent">
          LlamaIndex ChatUI
        </h1>
        <h1 className="mb-4 text-2xl font-bold">Simple Chat Demo</h1>
        <Code content={code} language="jsx" />
      </div>
      <div className="w-2/3 border-l">
        <ChatSection
          handler={handler}
          className="mx-auto h-screen max-w-3xl overflow-hidden"
        />
      </div>
    </div>
  )
}
