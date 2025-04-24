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
}

export default function ChatSection(props: ChatSectionProps) {
  const { handler, className } = props
  const [requestData, setRequestData] = useState<any>()

  const children = props.children ?? (
    <>
      <ChatMessages />
      <ChatInput />
    </>
  )

  return (
    <ChatProvider value={{ ...handler, requestData, setRequestData }}>
      <div className={cn('flex h-full w-full flex-col gap-4 p-5', className)}>
        <ChatCanvasProvider>{children}</ChatCanvasProvider>
      </div>
    </ChatProvider>
  )
}
