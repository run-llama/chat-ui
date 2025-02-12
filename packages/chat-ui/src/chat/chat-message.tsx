import { Bot, Check, Copy, MessageCircle, User2 } from 'lucide-react'
import { createContext, Fragment, memo, useContext } from 'react'
import { useCopyToClipboard } from '../hook/use-copy-to-clipboard'
import { cn } from '../lib/utils'
import { Button } from '../ui/button'
import { Markdown } from '../widgets/index.js' // this import needs the file extension as it's importing the widget bundle
import { getSourceAnnotationData, MessageAnnotation } from './annotation'
import {
  AgentEventAnnotations,
  DocumentFileAnnotations,
  EventAnnotations,
  ImageAnnotations,
  SourceAnnotations,
  SuggestedQuestionsAnnotations,
} from './chat-annotations'
import { ChatHandler, Message } from './chat.interface'

interface ChatMessageProps extends React.PropsWithChildren {
  message: Message
  isLast: boolean
  className?: string
  isLoading?: boolean
  append?: ChatHandler['append']
}

interface ChatMessageAvatarProps extends React.PropsWithChildren {
  className?: string
}

export enum ContentPosition {
  TOP = -9999,
  CHAT_EVENTS = 0,
  AFTER_EVENTS = 1,
  CHAT_AGENT_EVENTS = 2,
  AFTER_AGENT_EVENTS = 3,
  CHAT_IMAGE = 4,
  AFTER_IMAGE = 5,
  BEFORE_MARKDOWN = 6,
  MARKDOWN = 7,
  AFTER_MARKDOWN = 8,
  CHAT_DOCUMENT_FILES = 9,
  AFTER_DOCUMENT_FILES = 10,
  CHAT_SOURCES = 11,
  AFTER_SOURCES = 12,
  SUGGESTED_QUESTIONS = 13,
  AFTER_SUGGESTED_QUESTIONS = 14,
  BOTTOM = 9999,
}

interface ChatMessageContentProps extends React.PropsWithChildren {
  className?: string
  isLoading?: boolean
  append?: ChatHandler['append']
  message?: Message // in case you want to customize the message
}

interface ChatMessageActionsProps extends React.PropsWithChildren {
  className?: string
}

interface ChatMessageContext {
  message: Message
  isLast: boolean
}

const chatMessageContext = createContext<ChatMessageContext | null>(null)

const ChatMessageProvider = chatMessageContext.Provider

export const useChatMessage = () => {
  const context = useContext(chatMessageContext)
  if (!context)
    throw new Error('useChatMessage must be used within a ChatMessageProvider')
  return context
}

function ChatMessage(props: ChatMessageProps) {
  const children = props.children ?? (
    <>
      <ChatMessageAvatar />
      <ChatMessageContent isLoading={props.isLoading} append={props.append} />
      <ChatMessageActions />
    </>
  )

  return (
    <ChatMessageProvider
      value={{ message: props.message, isLast: props.isLast }}
    >
      <div className={cn('group flex gap-4 p-3', props.className)}>
        {children}
      </div>
    </ChatMessageProvider>
  )
}

function ChatMessageAvatar(props: ChatMessageAvatarProps) {
  const { message } = useChatMessage()

  const roleIconMap: Record<string, React.ReactNode> = {
    user: <User2 className="h-4 w-4" />,
    assistant: <Bot className="h-4 w-4" />,
  }

  const children = props.children ?? roleIconMap[message.role] ?? (
    <MessageCircle className="h-4 w-4" />
  )

  return (
    <div className="bg-background flex h-8 w-8 shrink-0 select-none items-center justify-center border">
      {children}
    </div>
  )
}

function ChatMessageContent(props: ChatMessageContentProps) {
  const { message: defaultMessage, isLast } = useChatMessage()
  const message = props.message ?? defaultMessage
  const annotations = message.annotations as MessageAnnotation[] | undefined

  const children = props.children ?? (
    <>
      <EventAnnotations
        message={message}
        showLoading={(isLast && props.isLoading) ?? false}
      />
      <AgentEventAnnotations message={message} />
      <ImageAnnotations message={message} />
      <Markdown
        content={message.content}
        sources={
          annotations ? getSourceAnnotationData(annotations)[0] : undefined
        }
      />
      <DocumentFileAnnotations message={message} />
      <SourceAnnotations message={message} />
      {isLast && props.append && (
        <SuggestedQuestionsAnnotations
          message={message}
          append={props.append}
        />
      )}
    </>
  )

  return (
    <div className={cn('flex min-w-0 flex-1 flex-col gap-4', props.className)}>
      {children}
    </div>
  )
}

function ChatMessageActions(props: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
  const { message } = useChatMessage()

  const children = props.children ?? (
    <Button
      onClick={() => copyToClipboard(message.content)}
      size="icon"
      variant="ghost"
      className="h-8 w-8"
    >
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
  return (
    <div
      className={cn(
        'flex shrink-0 flex-col gap-2 opacity-0 group-hover:opacity-100',
        props.className
      )}
    >
      {children}
    </div>
  )
}

type ComposibleChatMessage = typeof ChatMessage & {
  Avatar: typeof ChatMessageAvatar
  Content: typeof ChatMessageContent
  Actions: typeof ChatMessageActions
}

const PrimiviteChatMessage = memo(ChatMessage, (prevProps, nextProps) => {
  return (
    !nextProps.isLast &&
    prevProps.isLast === nextProps.isLast &&
    prevProps.message === nextProps.message
  )
}) as unknown as ComposibleChatMessage

PrimiviteChatMessage.Avatar = ChatMessageAvatar
PrimiviteChatMessage.Content = ChatMessageContent
PrimiviteChatMessage.Actions = ChatMessageActions

export default PrimiviteChatMessage
