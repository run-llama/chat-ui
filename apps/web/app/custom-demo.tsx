'use client'

import {
  ChatInput,
  ChatMessage,
  ChatMessages,
  ChatSection,
  useChatUI,
  useFile,
} from '@llamaindex/chat-ui'
import { Markdown } from '@llamaindex/chat-ui/widgets'
import { Message, useChat } from 'ai/react'
import { User2 } from 'lucide-react'
import { Code } from './ui/code'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

const code = `
import {
  ChatInput,
  ChatMessage,
  ChatMessages,
  ChatSection,
  Markdown,
  useChatUI,
} from '@llamaindex/chat-ui'
import { useChat } from 'ai/react'
import { User2 } from 'lucide-react'

export function CustomChat() {
  const handler = useChat({ initialMessages })
  return (
    <ChatSection handler={handler}>
      <ChatMessages className="rounded-xl shadow-xl">
        <CustomChatMessagesList />
        <ChatMessages.Actions />
      </ChatMessages>
      <ChatInput className="rounded-xl shadow-xl" />
    </ChatSection>
  )
}

function CustomChatMessagesList() {
  const { messages } = useChatUI()
  return (
    <ChatMessages.List>
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} className="items-start">
          <ChatMessage.Avatar>
            {message.role === 'user' ? (
              <User2 className="h-4 w-4" />
            ) : (
              <img alt="LlamaIndex" src="/llama.png" />
            )}
          </ChatMessage.Avatar>
          <ChatMessage.Content>
            <Markdown content={message.content} />
            <Annotation annotations={message.annotations} />
          </ChatMessage.Content>
          <ChatMessage.Actions />
        </ChatMessage>
      ))}
    </ChatMessages.List>
  )
}

function Annotation({ annotations }: { annotations: any }) {
  if (annotations && Array.isArray(annotations)) {
    return annotations.map((annotation: any) => {
      if (annotation.type === 'image' && annotation.url) {
        return (
          <img
            alt="annotation"
            className="h-[200px] object-contain"
            key={annotation.url}
            src={annotation.url}
          />
        )
      }
      return null
    })
  }
  return null
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
    content: 'Got it! Here is the logo for LlamaIndex',
    annotations: [
      {
        type: 'image',
        url: '/llama.png',
      },
    ],
  },
]

function Annotation({ annotations }: { annotations: any }) {
  if (annotations && Array.isArray(annotations)) {
    return annotations.map((annotation: any) => {
      if (annotation.type === 'image' && annotation.url) {
        return (
          <img
            alt="annotation"
            className="h-[200px] object-contain"
            key={annotation.url}
            src={annotation.url}
          />
        )
      }
      return null
    })
  }
  return null
}

function CustomChatMessagesList() {
  const { messages } = useChatUI()
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
          <ChatMessage.Content className="items-start">
            <Markdown content={message.content} />
            <Annotation annotations={message.annotations} />
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
    <ChatSection handler={handler}>
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
  )
}

export function CustomChatSection() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Custom Chat Section</h2>
      <Tabs defaultValue="preview" className="w-[800px]">
        <TabsList>
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
