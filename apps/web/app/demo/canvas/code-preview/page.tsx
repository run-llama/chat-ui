'use client'

import {
  ChatCanvas,
  ChatInput,
  ChatMessages,
  ChatSection,
  CodeArtifact,
  useChatCanvas,
} from '@llamaindex/chat-ui'
import { DynamicComponent } from '@llamaindex/dynamic-ui'
import { UIMessage as Message, useChat } from '@ai-sdk/react'

const initialMessages: Message[] = [
  {
    id: 'code-gen1',
    role: 'user',
    parts: [{ type: 'text', text: 'Generate a simple calculator' }],
  },
  {
    id: 'code-gen2',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: "Here's the simple calculator:",
      },
      {
        type: 'data-artifact',
        data: {
          type: 'code',
          created_at: 1752124365106,
          data: {
            language: 'typescript',
            file_name: 'calculator.tsx',
            code: 'import React, { useState } from "react"\nimport { Button } from "@/components/ui/button"\nimport { Card } from "@/components/ui/card"\nimport { cn } from "@/lib/utils"\n\nconst buttons = [\n  ["7", "8", "9", "/"],\n  ["4", "5", "6", "*"],\n  ["1", "2", "3", "-"],\n  ["0", "C", "=", "+"],\n]\n\nexport default function Calculator() {\n  const [input, setInput] = useState<string>("")\n  const [result, setResult] = useState<string | null>(null)\n\n  const handleButtonClick = (value: string) => {\n    if (value === "C") {\n      setInput("")\n      setResult(null)\n      return\n    }\n    if (value === "=") {\n      try {\n        // eslint-disable-next-line no-eval\n        const evalResult = eval(input)\n        setResult(evalResult.toString())\n      } catch {\n        setResult("Error")\n      }\n      return\n    }\n    if (result !== null) {\n      setInput(value.match(/[0-9.]/) ? value : result + value)\n      setResult(null)\n    } else {\n      setInput((prev) => prev + value)\n    }\n  }\n\n  return (\n    <div className="flex items-center justify-center min-h-screen bg-muted">\n      <Card className="w-[320px] p-6 shadow-lg">\n        <div className={cn("mb-4 h-16 bg-background rounded flex items-end justify-end px-4 text-2xl font-mono border", result && "text-muted-foreground")}>\n          {result !== null ? result : input || "0"}\n        </div>\n        <div className="grid grid-cols-4 gap-3">\n          {buttons.flat().map((btn, idx) => (\n            <Button\n              key={idx}\n              variant={btn === "C" ? "destructive" : btn === "=" ? "default" : "outline"}\n              className={cn(\n                "h-12 text-xl",\n                btn === "=" && "col-span-1 bg-primary text-primary-foreground",\n                btn === "C" && "col-span-1"\n              )}\n              onClick={() => handleButtonClick(btn)}\n            >\n              {btn}\n            </Button>\n          ))}\n        </div>\n      </Card>\n    </div>\n  )\n}',
          },
        },
      },
    ],
  },
]

export default function Page(): JSX.Element {
  return <CustomChat />
}

function CustomChat() {
  const handler = useChat({ messages: initialMessages })

  return (
    <ChatSection
      handler={handler}
      className="block h-screen flex-row gap-4 p-0 md:flex md:p-5"
    >
      <div className="md:max-w-1/2 mx-auto flex h-full min-w-0 max-w-full flex-1 flex-col gap-4">
        <div className="flex justify-between gap-2 border-b p-4">
          <div>
            <h1 className="bg-gradient-to-r from-[#e711dd] to-[#0fc1e0] bg-clip-text text-lg font-bold text-transparent">
              LlamaIndex ChatUI - Canvas Demo
            </h1>
            <p className="text-sm text-zinc-400">
              Try click to artifact card to see how it works
            </p>
          </div>
        </div>
        <ChatMessages />
        <ChatInput />
      </div>
      <ChatCanvas className="w-full md:w-2/3">
        <ChatCanvas.CodeArtifact tabs={{ preview: <CodePreview /> }} />
      </ChatCanvas>
    </ChatSection>
  )
}

function CodePreview() {
  const { displayedArtifact } = useChatCanvas()
  if (displayedArtifact?.type !== 'code') return null

  const {
    data: { language, code, file_name: fileName },
  } = displayedArtifact as CodeArtifact

  if (
    !['js', 'ts', 'jsx', 'tsx', 'javascript', 'typescript'].includes(language)
  ) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-sm text-gray-500">
        Preview is not supported for this language
      </div>
    )
  }

  return <DynamicComponent code={code} fileName={fileName} />
}
