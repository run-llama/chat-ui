'use client'

import { useCopyToClipboard } from '@/app/use-copy-to-clipboard'
import {
  Artifact,
  ChatCanvas,
  ChatInput,
  ChatMessages,
  ChatSection,
  useChatCanvas,
} from '@llamaindex/chat-ui'
import { Message, useChat } from 'ai/react'
import { Image } from 'lucide-react'

const code = `
import {
  ChatCanvas,
  ChatInput,
  ChatMessages,
  ChatSection,
} from '@llamaindex/chat-ui'
import { useChat } from 'ai/react'

export function CustomChat() {
  const handler = useChat({ initialMessages: [] })

  return (
    <ChatSection
      handler={handler}
      className="block h-screen flex-row gap-4 p-0 md:flex md:p-5"
    >
      <div className="md:max-w-1/2 mx-auto flex h-full min-w-0 max-w-full flex-1 flex-col gap-4">
        <ChatMessages />
        <ChatInput />
      </div>
      <ChatCanvas className="w-full md:w-2/3" />
    </ChatSection>
  )
}
`

const initialMessages: Message[] = [
  {
    role: 'user',
    content: 'Generate an image of a cat',
    id: 'aeJ4ZOWlhUA2R4vg',
  },
  {
    id: 'Yqc9VoIR3ANyzTj3',
    role: 'assistant',
    content:
      'The artifact is a cat image.' +
      `\n\`\`\`annotation\n${JSON.stringify({
        type: 'artifact',
        data: {
          type: 'image',
          data: {
            imageUrl: 'https://placecats.com/300/200',
            caption: 'A cat',
          },
          created_at: 1745480281756,
        },
      })}
      \n\`\`\`\n`,
  },
]

export default function Page(): JSX.Element {
  return <CustomChat />
}

function CustomChat() {
  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 2000 })
  const handler = useChat({ initialMessages })

  return (
    <ChatSection
      handler={handler}
      className="block h-screen flex-row gap-4 p-0 md:flex md:p-5"
    >
      <div className="md:max-w-1/2 mx-auto flex h-full min-w-0 max-w-full flex-1 flex-col gap-4">
        <div className="flex justify-between gap-2 border-b p-4">
          <div>
            <h1 className="bg-gradient-to-r from-[#e711dd] to-[#0fc1e0] bg-clip-text text-lg font-bold text-transparent">
              LlamaIndex ChatUI - Custom Canvas Demo
            </h1>
            <p className="text-sm text-zinc-400">
              Try click to a version to see how it works
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              copyToClipboard(code)
            }}
            className={`flex h-10 items-center gap-2 rounded-lg bg-zinc-700 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-600 ${
              isCopied ? 'bg-green-600 hover:bg-green-500' : ''
            }`}
          >
            {isCopied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
        <ChatMessages />
        <ChatInput />
      </div>
      <ChatCanvas>
        <ChatCanvas.CodeArtifact />
        <ChatCanvas.DocumentArtifact />
        <ImageArtifactViewer />
      </ChatCanvas>
    </ChatSection>
  )
}

interface ImageArtifactData {
  imageUrl: string
  caption: string
}
type ImageArtifact = Artifact<ImageArtifactData>

function ImageArtifactViewer() {
  const { displayedArtifact } = useChatCanvas()

  if (displayedArtifact?.type.toString() !== 'image') return null // TODO: type string for easily custom

  const imageArtifact = displayedArtifact as ImageArtifact
  const {
    data: { imageUrl, caption },
  } = imageArtifact

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="flex items-center gap-3 text-gray-600">
          <Image className="size-8 text-red-400" />
          <div className="text font-semibold">{caption}</div>
        </h3>
        <ChatCanvas.Actions>
          <ChatCanvas.Actions.Close />
          <ChatCanvas.Actions.History />
          <ChatCanvas.Actions.Copy />
          <ChatCanvas.Actions.Download />
        </ChatCanvas.Actions>
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <img src={imageUrl} alt={caption} className="w-full" />
      </div>
    </div>
  )
}
