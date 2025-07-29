import { useState } from 'react'
import { cn } from '../lib/utils'
import ChatInput from './chat-input'
import ChatMessages from './chat-messages'
import { ChatProvider } from './chat.context'
import { type ChatHandler } from './chat.interface'
import { ChatCanvasProvider } from './canvas/context'

export interface ChatSectionProps extends React.PropsWithChildren {
  handler: ChatHandler
  className?: string

  // whether to open the canvas automatically when there is an artifact in the assistant's response
  // default to true
  autoOpenCanvas?: boolean
}

export default function ChatSection(props: ChatSectionProps) {
  const { handler, className, autoOpenCanvas = true } = props
  const [input, setInput] = useState('')
  const [requestData, setRequestData] = useState<any>()

  const isLoading = handler.status === 'streaming'

  const children = props.children ?? (
    <>
      <ChatMessages />
      <ChatInput />
    </>
  )

  return (
    <ChatProvider
      value={{
        ...handler,
        input,
        setInput,
        requestData,
        setRequestData,
        isLoading,
      }}
    >
      <div className={cn('flex h-full w-full flex-col gap-4 p-5', className)}>
        <ChatCanvasProvider autoOpenCanvas={autoOpenCanvas}>
          {children}
        </ChatCanvasProvider>
      </div>
    </ChatProvider>
  )
}
