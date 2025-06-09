'use client'

import { useCopyToClipboard } from '@/app/use-copy-to-clipboard'
import {
  Artifact,
  ChatCanvas,
  ChatInput,
  ChatMessage,
  ChatMessages,
  ChatSection,
  useChatCanvas,
  useChatUI,
} from '@llamaindex/chat-ui'
import { Message, useChat } from 'ai/react'
import { Image } from 'lucide-react'

const code = `
import {
  Artifact,
  ChatCanvas,
  ChatInput,
  ChatMessage,
  ChatMessages,
  ChatSection,
  useChatCanvas,
  useChatUI,
} from '@llamaindex/chat-ui'
import { useChat } from 'ai/react'
import { Image } from 'lucide-react'

export function CustomChat() {
  const handler = useChat({ initialMessages: [] })

  return (
    <ChatSection
      handler={handler}
      className="block h-screen flex-row gap-4 p-0 md:flex md:p-5"
    >
      <div className="md:max-w-1/2 mx-auto flex h-full min-w-0 max-w-full flex-1 flex-col gap-4">
        <CustomChatMessages />
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

type ImageArtifact = Artifact<
  {
    imageUrl: string
    caption: string
  },
  'image'
>

function ImageArtifactViewer() {
  const { displayedArtifact } = useChatCanvas()

  if (displayedArtifact?.type !== 'image') return null

  const {
    data: { imageUrl, caption },
  } = displayedArtifact as ImageArtifact

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="flex items-center gap-3 text-gray-600">
          <Image className="size-8 text-blue-500" />
          <div className="text font-semibold">{caption}</div>
        </h3>
        <ChatCanvas.Actions>
          <ChatCanvas.Actions.History />
          <ChatCanvas.Actions.Close />
        </ChatCanvas.Actions>
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <img
          src={imageUrl}
          alt={caption}
          className="h-[70%] rounded-2xl shadow-2xl"
        />
      </div>
    </div>
  )
}

function CustomChatMessages() {
  const { messages } = useChatUI()
  return (
    <ChatMessages>
      <ChatMessages.List className="px-0 md:px-16">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isLast={index === messages.length - 1}
            className="items-start"
          >
            <ChatMessage.Avatar />
            <ChatMessage.Content>
              <ChatMessage.Content.Markdown
                annotationRenderers={{
                  artifact: CustomArtifactCard,
                }}
              />
            </ChatMessage.Content>
            <ChatMessage.Actions />
          </ChatMessage>
        ))}
      </ChatMessages.List>
    </ChatMessages>
  )
}

function CustomArtifactCard({ data }: { data: Artifact }) {
  return (
    <ChatCanvas.Artifact
      data={data}
      getTitle={artifact => {
        const { caption } = (artifact as ImageArtifact).data
        return caption as string
      }}
      iconMap={{
        image: Image,
      }}
    />
  )
}
`

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Generate an image of a cat',
  },
  {
    id: '2',
    role: 'assistant',
    content:
      'Here is a cat image named Millie.' +
      `\n\`\`\`annotation\n${JSON.stringify({
        type: 'artifact',
        data: {
          type: 'image',
          data: {
            imageUrl: 'https://placecats.com/millie/700/500',
            caption: 'A cute cat image named Millie',
          },
          created_at: 1745480281756,
        },
      })}
      \n\`\`\`\n`,
  },
  {
    id: '3',
    role: 'user',
    content: 'Please generate a black cat image',
  },
  {
    id: '4',
    role: 'assistant',
    content:
      'Here is a black cat image named Poppy.' +
      `\n\`\`\`annotation\n${JSON.stringify({
        type: 'artifact',
        data: {
          type: 'image',
          data: {
            imageUrl: 'https://placecats.com/poppy/700/500',
            caption: 'A black cat image named Poppy',
          },
          created_at: 1745480281999,
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
        <CustomChatMessages />
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

type ImageArtifact = Artifact<
  {
    imageUrl: string
    caption: string
  },
  'image'
>

function ImageArtifactViewer() {
  const { displayedArtifact } = useChatCanvas()

  if (displayedArtifact?.type !== 'image') return null

  const {
    data: { imageUrl, caption },
  } = displayedArtifact as ImageArtifact

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="flex items-center gap-3 text-gray-600">
          <Image className="size-8 text-blue-500" />
          <div className="text font-semibold">{caption}</div>
        </h3>
        <ChatCanvas.Actions>
          <ChatCanvas.Actions.History />
          <ChatCanvas.Actions.Close />
        </ChatCanvas.Actions>
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <img
          src={imageUrl}
          alt={caption}
          className="h-[70%] rounded-2xl shadow-2xl"
        />
      </div>
    </div>
  )
}

function CustomChatMessages() {
  const { messages } = useChatUI()
  return (
    <ChatMessages>
      <ChatMessages.List className="px-0 md:px-16">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isLast={index === messages.length - 1}
            className="items-start"
          >
            <ChatMessage.Avatar />
            <ChatMessage.Content>
              <ChatMessage.Content.Markdown
                annotationRenderers={{
                  artifact: CustomArtifactCard,
                }}
              />
            </ChatMessage.Content>
            <ChatMessage.Actions />
          </ChatMessage>
        ))}
      </ChatMessages.List>
    </ChatMessages>
  )
}

// custom artifact card for image artifacts
function CustomArtifactCard({ data }: { data: Artifact }) {
  return (
    <ChatCanvas.Artifact
      data={data}
      getTitle={artifact => (artifact as ImageArtifact).data.caption}
      iconMap={{ image: Image }}
    />
  )
}
