import { Bot, Check, Copy, MessageCircle, RefreshCw, User2 } from 'lucide-react'
import { ComponentType, memo } from 'react'
import { useCopyToClipboard } from '../hook/use-copy-to-clipboard'
import { cn } from '../lib/utils'
import { Button } from '../ui/button'
import { CitationComponentProps, Markdown } from '../widgets/index.js'
import { getSourceAnnotationData, MessageAnnotation } from './annotation'
import {
  AgentEventAnnotations,
  DocumentFileAnnotations,
  EventAnnotations,
  ImageAnnotations,
  SourceAnnotations,
  SuggestedQuestionsAnnotations,
} from './chat-annotations'
import { ChatMessageProvider, useChatMessage } from './chat-message.context.js'
import { ChatHandler, Message } from './chat.interface'
import { useChatUI } from './chat.context.js'

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

interface ChatMarkdownProps extends React.PropsWithChildren {
  citationComponent?: ComponentType<CitationComponentProps>
  className?: string
}

function ChatMessage(props: ChatMessageProps) {
  const isAssistantMessage = props.message.role === 'assistant'

  const children = props.children ?? (
    <>
      <ChatMessageAvatar />
      <ChatMessageContent isLoading={props.isLoading} append={props.append} />
      {isAssistantMessage && <ChatMessageActions />}
    </>
  )

  return (
    <ChatMessageProvider
      value={{
        message: props.message,
        isLast: props.isLast,
        isLoading: props.isLoading,
        append: props.append,
      }}
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
    <div
      className={cn(
        'bg-background flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border',
        props.className
      )}
    >
      {children}
    </div>
  )
}

function ChatMessageContent(props: ChatMessageContentProps) {
  const { message } = useChatMessage()

  const children = props.children ?? (
    <>
      <EventAnnotations />
      <AgentEventAnnotations />
      <ImageAnnotations />
      <ChatMarkdown />
      <DocumentFileAnnotations />
      <SourceAnnotations />
      <SuggestedQuestionsAnnotations />
    </>
  )

  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 flex-col gap-4',
        {
          'w-fit max-w-[80%]': message.role === 'user',
        },
        props.className
      )}
    >
      {children}
    </div>
  )
}

function ChatMarkdown(props: ChatMarkdownProps) {
  const { message } = useChatMessage()
  const annotations = message.annotations as MessageAnnotation[] | undefined

  return (
    <Markdown
      content={message.content}
      sources={
        annotations ? getSourceAnnotationData(annotations)[0] : undefined
      }
      citationComponent={props.citationComponent}
      className={cn(
        {
          'bg-primary text-primary-foreground w-fit rounded-xl px-3 py-2':
            message.role === 'user',
        },
        props.className
      )}
    />
  )
}

function ChatMessageActions(props: ChatMessageActionsProps) {
  const { reload, requestData, isLoading } = useChatUI()
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
  const { message, isLast } = useChatMessage()

  const isLastMessageFromAssistant = message.role === 'assistant' && isLast
  const showReload = reload && !isLoading && isLastMessageFromAssistant

  const children = props.children ?? (
    <>
      <Button
        title="Copy"
        onClick={() => copyToClipboard(message.content)}
        size="icon"
        variant="outline"
        className="h-8 w-8"
      >
        {isCopied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
      {showReload && (
        <Button
          title="Regenerate"
          variant="outline"
          size="icon"
          onClick={() => reload?.({ data: requestData })}
          className="h-8 w-8"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      )}
    </>
  )
  return (
    <div className={cn('flex shrink-0 flex-col gap-2', props.className)}>
      {children}
    </div>
  )
}

type ComposibleChatMessageContent = typeof ChatMessageContent & {
  Event: typeof EventAnnotations
  AgentEvent: typeof AgentEventAnnotations
  Image: typeof ImageAnnotations
  Markdown: typeof ChatMarkdown
  DocumentFile: typeof DocumentFileAnnotations
  Source: typeof SourceAnnotations
  SuggestedQuestions: typeof SuggestedQuestionsAnnotations
}

type ComposibleChatMessage = typeof ChatMessage & {
  Avatar: typeof ChatMessageAvatar
  Content: ComposibleChatMessageContent
  Actions: typeof ChatMessageActions
}

const PrimiviteChatMessage = memo(ChatMessage, (prevProps, nextProps) => {
  return (
    !nextProps.isLast &&
    prevProps.isLast === nextProps.isLast &&
    prevProps.message === nextProps.message
  )
}) as unknown as ComposibleChatMessage

PrimiviteChatMessage.Content =
  ChatMessageContent as ComposibleChatMessageContent

PrimiviteChatMessage.Content.Event = EventAnnotations
PrimiviteChatMessage.Content.AgentEvent = AgentEventAnnotations
PrimiviteChatMessage.Content.Image = ImageAnnotations
PrimiviteChatMessage.Content.Markdown = ChatMarkdown
PrimiviteChatMessage.Content.DocumentFile = DocumentFileAnnotations
PrimiviteChatMessage.Content.Source = SourceAnnotations
PrimiviteChatMessage.Content.SuggestedQuestions = SuggestedQuestionsAnnotations

PrimiviteChatMessage.Avatar = ChatMessageAvatar
PrimiviteChatMessage.Actions = ChatMessageActions

export default PrimiviteChatMessage
