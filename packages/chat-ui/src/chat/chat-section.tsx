import { cn } from '../lib/utils'
import ChatInput from './chat-input'
import ChatMessages from './chat-messages'
import { ChatProvider } from './chat.context'
import { type ChatHandler } from './chat.interface'

export interface ChatSectionProps extends React.PropsWithChildren {
  handler: ChatHandler
  className?: string
}

export default function ChatSection(props: ChatSectionProps) {
  const { handler, className } = props

  const children = props.children ?? (
    <>
      <ChatMessages />
      <ChatInput />
    </>
  )

  return (
    <ChatProvider value={handler}>
      <div className={cn('llamaindex-chat-ui flex flex-col gap-4', className)}>{children}</div>
    </ChatProvider>
  )
}
