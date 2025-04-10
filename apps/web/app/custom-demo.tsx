'use client'

import { Code } from '@/components/code'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChatInput,
  ChatMessage,
  ChatMessages,
  ChatSection,
  useChatUI,
  useFile,
} from '@llamaindex/chat-ui'
import { Message, useChat } from 'ai/react'
import { User2 } from 'lucide-react'

const code = `
import {
  ChatInput,
  ChatMessage,
  ChatMessages,
  ChatSection,
  useChatUI,
  useFile,
} from '@llamaindex/chat-ui'
import { useChat } from 'ai/react'
import { User2 } from 'lucide-react'

export function CustomChat() {
  const handler = useChat()
  const { imageUrl, getAnnotations, uploadFile, reset } = useFile({
    uploadAPI: '/chat/upload',
  })
  const annotations = getAnnotations()
  const handleUpload = async (file: File) => {
    try {
      await uploadFile(file)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="overflow-hidden rounded-xl shadow-xl">
      <ChatSection handler={handler} className="max-h-[72vh]">
        <ChatMessages className="rounded-xl shadow-xl">
          <CustomChatMessagesList />
          <ChatMessages.Actions />
        </ChatMessages>
        <ChatInput
          className="rounded-xl shadow-xl"
          annotations={annotations}
          resetUploadedFiles={reset}
        >
          <div>
            {imageUrl ? (
              <img
                className="max-h-[100px] object-contain"
                src={imageUrl}
                alt="uploaded"
              />
            ) : null}
          </div>
          <ChatInput.Form>
            <ChatInput.Field />
            <ChatInput.Upload onUpload={handleUpload} />
            <ChatInput.Submit />
          </ChatInput.Form>
        </ChatInput>
      </ChatSection>
    </div>
  )
}

function CustomChatMessagesList() {
  const { messages, isLoading, append } = useChatUI()
  return (
    <ChatMessages.List>
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          message={message}
          isLast={index === messages.length - 1}
          className="items-start"
        >
          <ChatMessage.Avatar>
            {message.role === 'user' ? (
              <User2 className="h-4 w-4" />
            ) : (
              <img alt="LlamaIndex" src="/llama.png" />
            )}
          </ChatMessage.Avatar>
          <ChatMessage.Content
            className="items-start"
            isLoading={isLoading}
            append={append}
          >
            <ChatMessage.Content.Image />
            <ChatMessage.Content.Markdown />
            <ChatMessage.Content.DocumentFile />
          </ChatMessage.Content>
          <ChatMessage.Actions />
        </ChatMessage>
      ))}
    </ChatMessages.List>
  )
}
`

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Generate a logo for LlamaIndex',
    role: 'user',
  },
  {
    id: '2',
    role: 'assistant',
    content:
      'Got it! Here is the logo for LlamaIndex. The logo features a friendly llama mascot that represents our AI-powered document indexing and chat capabilities.',
    annotations: [
      {
        type: 'image',
        data: {
          url: '/llama.png',
        },
      },
    ],
  },
  {
    id: '3',
    role: 'user',
    content: 'Show me a pdf file',
  },
  {
    id: '4',
    role: 'assistant',
    content:
      'Got it! Here is a sample PDF file that demonstrates PDF handling capabilities. This PDF contains some basic text and formatting examples that you can use to test PDF viewing functionality.',
    annotations: [
      {
        type: 'document_file',
        data: {
          files: [
            {
              id: '1',
              name: 'sample.pdf',
              url: 'https://pdfobject.com/pdf/sample.pdf',
            },
          ],
        },
      },
    ],
  },
]

function CustomChatMessagesList() {
  const { messages, isLoading, append } = useChatUI()
  return (
    <ChatMessages.List>
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          message={message}
          isLast={index === messages.length - 1}
          className="items-start"
        >
          <ChatMessage.Avatar>
            {message.role === 'user' ? (
              <User2 className="h-4 w-4" />
            ) : (
              <img alt="LlamaIndex" src="/llama.png" />
            )}
          </ChatMessage.Avatar>
          <ChatMessage.Content
            className="items-start"
            isLoading={isLoading}
            append={append}
          >
            <ChatMessage.Content.Image />
            <ChatMessage.Content.Markdown />
            <ChatMessage.Content.DocumentFile />
          </ChatMessage.Content>
          <ChatMessage.Actions />
        </ChatMessage>
      ))}
    </ChatMessages.List>
  )
}

export function CustomChat() {
  const handler = useChat({ initialMessages })
  const { imageUrl, getAnnotations, uploadFile, reset } = useFile({
    uploadAPI: '/chat/upload',
  })
  const annotations = getAnnotations()
  const handleUpload = async (file: File) => {
    try {
      await uploadFile(file)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="overflow-hidden rounded-xl shadow-xl">
      <ChatSection handler={handler} className="max-h-[72vh]">
        <ChatMessages className="rounded-xl shadow-xl">
          <CustomChatMessagesList />
          <ChatMessages.Actions />
        </ChatMessages>
        <ChatInput
          className="rounded-xl shadow-xl"
          annotations={annotations}
          resetUploadedFiles={reset}
        >
          <div>
            {imageUrl ? (
              <img
                className="max-h-[100px] object-contain"
                src={imageUrl}
                alt="uploaded"
              />
            ) : null}
          </div>
          <ChatInput.Form>
            <ChatInput.Field />
            <ChatInput.Upload
              allowedExtensions={['jpg', 'png', 'jpeg']}
              onUpload={handleUpload}
            />
            <ChatInput.Submit />
          </ChatInput.Form>
        </ChatInput>
      </ChatSection>
    </div>
  )
}

export function CustomChatSection() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Custom Chat Demo</h2>
        <p className="text-zinc-400">
          A more advanced implementation with custom components and file uploads
        </p>
      </div>
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <CustomChat />
        </TabsContent>
        <TabsContent value="code">
          <Code content={code} language="jsx" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
