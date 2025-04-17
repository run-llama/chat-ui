'use client'

import { Message, useChat } from 'ai/react'
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

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Write simple Javascript hello world code',
    role: 'user',
  },
  {
    id: '2',
    role: 'assistant',
    content:
      'Got it! Here\'s the simplest JavaScript code to print "Hello, World!" to the console:\n\n```javascript\nconsole.log("Hello, World!");\n```\n\nYou can run this code in any JavaScript environment, such as a web browser\'s console or a Node.js environment. Just paste the code and execute it to see the output.',
  },
  {
    id: '3',
    content:
      'Write a simple math equation that solves for x. It should be a quadratic equation. Please use LaTeX to write the equation.',
    role: 'user',
  },
  {
    id: '4',
    role: 'assistant',
    content:
      "Let's explore a simple mathematical equation using LaTeX:\n\n The quadratic formula is: $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\nThis formula helps us solve quadratic equations in the form $ax^2 + bx + c = 0$. The solution gives us the x-values where the parabola intersects the x-axis.",
  },
]

export default function Page(): JSX.Element {
  const handler = useChat({ initialMessages })
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
