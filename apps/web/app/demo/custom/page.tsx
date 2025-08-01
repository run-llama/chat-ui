'use client'

import { Code } from '@/components/code'
import {
  ChatInput,
  ChatMessage,
  ChatMessages,
  ChatSection,
  useChatUI,
  useFile,
} from '@llamaindex/chat-ui'
import { UIMessage as Message, useChat } from '@ai-sdk/react'
import { motion, AnimatePresence } from 'framer-motion'

const code = `
import {
  ChatInput,
  ChatMessage,
  ChatMessages,
  ChatSection,
  useChatUI,
  useFile,
} from '@llamaindex/chat-ui'
import { useChat } from '@ai-sdk/react'
import { motion, AnimatePresence } from 'framer-motion'

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
    <ChatSection
      handler={handler}
      className="mx-auto h-screen max-w-3xl overflow-hidden"
    >
      <CustomChatMessages />
      <ChatInput annotations={annotations} resetUploadedFiles={reset}>
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
            onUpload={handleUpload}
          />
          <ChatInput.Submit />
        </ChatInput.Form>
      </ChatInput>
    </ChatSection>
  )
}

function CustomChatMessages() {
  const { messages, isLoading, append } = useChatUI()
  return (
    <ChatMessages>
      <ChatMessages.List className="px-0 md:px-16">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ChatMessage
                message={message}
                isLast={index === messages.length - 1}
                className="items-start"
              >
                <ChatMessage.Avatar>
                  <img
                    className="border-1 rounded-full border-[#e711dd]"
                    alt="LlamaIndex"
                    src="/llama.png"
                  />
                </ChatMessage.Avatar>
                <ChatMessage.Content isLoading={isLoading} append={append}>
                  <ChatMessage.Content.Image />
                  <ChatMessage.Content.Markdown />
                  <ChatMessage.Content.DocumentFile />
                </ChatMessage.Content>
                <ChatMessage.Actions />
              </ChatMessage>
            </motion.div>
          ))}
        </AnimatePresence>
      </ChatMessages.List>
    </ChatMessages>
  )
}
`

const initialMessages: Message[] = [
  {
    id: '1',
    parts: [{ type: 'text', text: 'Generate a logo for LlamaIndex' }],
    role: 'user',
  },
  {
    id: '2',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: 'Got it! Here is the logo for LlamaIndex. The logo features a friendly llama mascot that represents our AI-powered document indexing and chat capabilities.',
      },
      {
        type: 'data-image',
        data: {
          url: '/llama.png',
        },
      },
    ],
  },
  {
    id: '3',
    role: 'user',
    parts: [{ type: 'text', text: 'Show me a pdf file' }],
  },
  {
    id: '4',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: 'Got it! Here is a sample PDF file that demonstrates PDF handling capabilities. This PDF contains some basic text and formatting examples that you can use to test PDF viewing functionality.',
      },
      {
        type: 'data-document-file',
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

export default function Page(): JSX.Element {
  return (
    <div className="flex gap-10">
      <div className="hidden max-h-screen w-1/2 justify-center space-y-10 self-center overflow-y-auto p-10 md:block">
        <h1 className="bg-gradient-to-r from-[#e711dd] to-[#b5f2fd] bg-clip-text text-6xl font-bold text-transparent">
          LlamaIndex ChatUI
        </h1>
        <h1 className="mb-4 text-2xl font-bold">Custom Chat Demo</h1>
        <Code content={code} language="jsx" />
      </div>
      <div className="w-full md:w-1/2 md:border-l">
        <CustomChat />
      </div>
    </div>
  )
}

function CustomChat() {
  const handler = useChat({ messages: initialMessages })
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
    <ChatSection
      handler={handler}
      className="h-screen overflow-hidden p-0 md:p-5"
    >
      <CustomChatMessages />
      <ChatInput resetUploadedFiles={reset}>
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
  )
}

function CustomChatMessages() {
  const { messages, isLoading, append } = useChatUI()
  return (
    <ChatMessages>
      <ChatMessages.List className="px-0 md:px-16">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ChatMessage
                message={message}
                isLast={index === messages.length - 1}
                className="items-start"
              >
                <ChatMessage.Avatar>
                  <img
                    className="border-1 rounded-full border-[#e711dd]"
                    alt="LlamaIndex"
                    src="/llama.png"
                  />
                </ChatMessage.Avatar>
                <ChatMessage.Content isLoading={isLoading} append={append}>
                  <ChatMessage.Content.Image />
                  <ChatMessage.Content.Markdown />
                  <ChatMessage.Content.DocumentFile />
                </ChatMessage.Content>
                <ChatMessage.Actions />
              </ChatMessage>
            </motion.div>
          ))}
        </AnimatePresence>
      </ChatMessages.List>
    </ChatMessages>
  )
}
