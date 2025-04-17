import { Loader2, PauseCircle, RefreshCw } from 'lucide-react'
import { createContext, useContext, useEffect, useRef } from 'react'
import { cn } from '../lib/utils'
import { Button } from '../ui/button'
import ChatMessage from './chat-message'
import { useChatUI } from './chat.context'
import type { Message } from './chat.interface'

interface ChatMessagesProps extends React.PropsWithChildren {
  className?: string
}

interface ChatMessagesListProps extends React.PropsWithChildren {
  className?: string
}

interface ChatMessagesLoadingProps extends React.PropsWithChildren {
  className?: string
}

interface ChatMessagesEmptyProps extends React.PropsWithChildren {
  className?: string
  heading?: string
  subheading?: string
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
  const { messages, reload, stop, isLoading } = useChatUI()

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

  const children = props.children ?? <ChatMessagesList />

  return (
    <ChatMessagesProvider
      value={{ isPending, showReload, showStop, lastMessage, messageLength }}
    >
      <div
        className={cn(
          'bg-background relative flex min-h-0 flex-1 flex-col space-y-6 p-4 pb-0',
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
  const { messages, isLoading, append } = useChatUI()
  const { lastMessage, messageLength } = useChatMessages()

  const scrollToBottom = () => {
    if (scrollableChatContainerRef.current) {
      scrollableChatContainerRef.current.scrollTop =
        scrollableChatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messageLength, lastMessage])

  const children = props.children ?? (
    <>
      {messages.map((message, index) => {
        return (
          <ChatMessage
            key={index}
            message={message}
            isLast={index === messageLength - 1}
            isLoading={isLoading}
            append={append}
          />
        )
      })}
      <ChatMessagesEmpty />
      <ChatMessagesLoading />
    </>
  )

  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-5 overflow-auto',
        props.className
      )}
      ref={scrollableChatContainerRef}
    >
      {children}
    </div>
  )
}

function ChatMessagesEmpty(props: ChatMessagesEmptyProps) {
  const { messages } = useChatUI()
  if (messages.length > 0) return null

  if (props.children) {
    return (
      <div
        className={cn(
          'flex h-full flex-col justify-center pt-4',
          props.className
        )}
      >
        {props.children}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex h-full flex-col justify-center pt-4',
        props.className
      )}
    >
      <p className="mb-2 animate-[slide-up_0.5s_ease-out] text-3xl font-bold opacity-0 [animation-delay:100ms] [animation-fill-mode:forwards]">
        {props.heading ?? 'Hello there!'}
      </p>
      <p className="text-muted-foreground animate-[slide-up_0.5s_ease-out] text-xl opacity-0 [animation-delay:300ms] [animation-fill-mode:forwards]">
        {props.subheading ?? "I'm here to help you with your questions."}
      </p>
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

function ChatMessagesLoading(props: ChatMessagesLoadingProps) {
  const { isPending } = useChatMessages()
  if (!isPending) return null

  const children = props.children ?? (
    <Loader2 className="h-4 w-4 animate-spin" />
  )

  return (
    <div
      className={cn('flex items-center justify-center pt-4', props.className)}
    >
      {children}
    </div>
  )
}

function ChatActions(props: ChatActionsProps) {
  const { reload, stop, requestData } = useChatUI()
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => reload?.({ data: requestData })}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Regenerate
        </Button>
      )}
    </>
  )

  return (
    <div className={cn('flex justify-end gap-4', props.className)}>
      {children}
    </div>
  )
}

ChatMessages.List = ChatMessagesList
ChatMessages.Loading = ChatMessagesLoading
ChatMessages.Empty = ChatMessagesEmpty
ChatMessages.Actions = ChatActions

export default ChatMessages
