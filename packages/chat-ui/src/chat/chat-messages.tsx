import { Loader2, PauseCircle, RefreshCw } from 'lucide-react'
import { createContext, useContext, useEffect, useRef } from 'react'
import { cn } from '../lib/utils'
import { Button } from '../ui/button'
import ChatMessage from './chat-message'
import { useChat } from './chat.context'
import type { Message } from './chat.interface'

interface ChatMessagesProps extends React.PropsWithChildren {
  className?: string
}

interface ChatMessagesListProps extends React.PropsWithChildren {
  className?: string
}

interface ChatActionsProps extends React.PropsWithChildren {
  className?: string
}

interface ChatMessagesContext {
  isPending: boolean
  showReload?: boolean
  showStop?: boolean
  messageLength: number
  lastMessage: Message
}

const chatMessagesContext = createContext<ChatMessagesContext | null>(null)

const ChatMessagesProvider = chatMessagesContext.Provider

export const useChatMessages = () => {
  const context = useContext(chatMessagesContext)
  if (!context) {
    throw new Error(
      'useChatMessages must be used within a ChatMessagesProvider'
    )
  }
  return context
}

function ChatMessages(props: ChatMessagesProps) {
  const { messages, reload, stop, isLoading } = useChat()

  const messageLength = messages.length
  const lastMessage = messages[messageLength - 1]
  const isLastMessageFromAssistant =
    messageLength > 0 && lastMessage?.role !== 'user'
  const showReload = reload && !isLoading && isLastMessageFromAssistant
  const showStop = stop && isLoading

  // `isPending` indicate
  // that stream response is not yet received from the server,
  // so we show a loading indicator to give a better UX.
  const isPending = isLoading && !isLastMessageFromAssistant

  const children = props.children ?? (
    <>
      <ChatMessagesList />
      <ChatActions />
    </>
  )

  return (
    <ChatMessagesProvider
      value={{ isPending, showReload, showStop, lastMessage, messageLength }}
    >
      <div
        className={cn(
          'relative flex-1 overflow-y-auto rounded-xl bg-white p-4 shadow-xl',
          props.className
        )}
      >
        {children}
      </div>
    </ChatMessagesProvider>
  )
}

function ChatMessagesList(props: ChatMessagesListProps) {
  const scrollableChatContainerRef = useRef<HTMLDivElement>(null)
  const { messages } = useChat()
  const { isPending, lastMessage, messageLength } = useChatMessages()

  const children =
    props.children ??
    messages.map((message, index) => {
      return <ChatMessage key={index} message={message} />
    })

  const scrollToBottom = () => {
    if (scrollableChatContainerRef.current) {
      scrollableChatContainerRef.current.scrollTop =
        scrollableChatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messageLength, lastMessage])

  return (
    <div
      className={cn('flex flex-col gap-5 divide-y', props.className)}
      ref={scrollableChatContainerRef}
    >
      {children}
      {isPending && (
        <div className="flex items-center justify-center pt-10">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
    </div>
  )
}

function ChatActions(props: ChatActionsProps) {
  const { reload, stop } = useChat()
  const { showReload, showStop } = useChatMessages()
  if (!showStop && !showReload) return null

  const children = props.children ?? (
    <>
      {showStop && (
        <Button variant="outline" size="sm" onClick={stop}>
          <PauseCircle className="mr-2 h-4 w-4" />
          Stop generating
        </Button>
      )}
      {showReload && (
        <Button variant="outline" size="sm" onClick={reload}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Regenerate
        </Button>
      )}
    </>
  )

  return (
    <div className={cn('flex justify-end gap-4 py-4', props.className)}>
      {children}
    </div>
  )
}

ChatMessages.List = ChatMessagesList
ChatMessages.Actions = ChatActions

export default ChatMessages