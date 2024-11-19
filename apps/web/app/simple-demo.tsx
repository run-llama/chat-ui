'use client'

import { ChatSection } from '@llamaindex/chat-ui'
import { Message, useChat } from 'ai/react'
import { Code } from './ui/code'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

const code = `
import { ChatSection } from '@llamaindex/chat-ui'
import { useChat } from 'ai/react'

function SimpleChat() {
  const handler = useChat()
  return <ChatSection handler={handler} />
}
`

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Write simple Javascript hello world code',
    role: 'user',
  },
  {
    id: '1',
    role: 'assistant',
    content:
      'Got it! Here\'s the simplest JavaScript code to print "Hello, World!" to the console:\n\n```javascript\nconsole.log("Hello, World!");\n```\n\nYou can run this code in any JavaScript environment, such as a web browser\'s console or a Node.js environment. Just paste the code and execute it to see the output.',
  },
]

function SimpleChat() {
  const handler = useChat({ initialMessages })
  return <ChatSection handler={handler} />
}

export function SimpleChatSection() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Primitive Chat Section</h2>
      <Tabs defaultValue="preview" className="w-[800px]">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <SimpleChat />
        </TabsContent>
        <TabsContent value="code">
          <Code content={code} language="jsx" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
