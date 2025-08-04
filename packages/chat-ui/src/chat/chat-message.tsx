import { Bot, Check, Copy, RefreshCw } from 'lucide-react'
import { ComponentType, memo } from 'react'
import { useCopyToClipboard } from '../hook/use-copy-to-clipboard'
import { cn } from '../lib/utils'
import { Button } from '../ui/button'
import {
  CitationComponentProps,
  LanguageRendererProps,
} from '../widgets/index.js'
import { ChatMessageProvider, useChatMessage } from './chat-message.context.js'
import { useChatUI } from './chat.context.js'
import {
  ChatContext,
  DataPart,
  Message,
  TextPart,
  TextPartType,
} from './chat.interface'
import {
  AgentEventsPart,
  DocumentFilePart,
  EventsPart,
  ImagePart,
  MarkdownPart,
  SourcesPart,
  SuggestedQuestionsPart,
} from './message-parts/index.js'
import { ChatPartProvider } from './message-parts/context.js'

interface ChatMessageProps extends React.PropsWithChildren {
  message: Message
  isLast: boolean
  className?: string
  isLoading?: boolean
  append?: ChatContext['append']
}

interface ChatMessageAvatarProps extends React.PropsWithChildren {
  className?: string
}

interface ChatMessageContentProps extends React.PropsWithChildren {
  className?: string
  isLoading?: boolean
  append?: ChatContext['append']
  message?: Message // in case you want to customize the message
}

interface ChatMessageActionsProps extends React.PropsWithChildren {
  className?: string
}

interface ChatMarkdownProps extends React.PropsWithChildren {
  citationComponent?: ComponentType<CitationComponentProps>
  className?: string
  languageRenderers?: Record<string, ComponentType<LanguageRendererProps>>
  annotationRenderers?: Record<string, ComponentType<{ data: any }>>
}

function ChatMessage(props: ChatMessageProps) {
  const textParts = props.message.parts.filter(
    (part): part is TextPart => part.type === TextPartType
  )
  const dataParts = props.message.parts.filter(
    (part): part is DataPart => part.type !== TextPartType
  )

  const children = props.children ?? (
    <>
      <ChatMessageAvatar />
      <ChatMessageContent isLoading={props.isLoading} append={props.append} />
      <ChatMessageActions />
    </>
  )

  return (
    <ChatMessageProvider
      value={{
        message: props.message,
        isLast: props.isLast,
        isLoading: props.isLoading,
        append: props.append,
        parts: props.message.parts,
        textParts,
        dataParts,
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

  if (message.role !== 'assistant') return null

  const children = props.children ?? <Bot className="h-4 w-4" />

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
  const children = props.children ?? (
    <>
      <EventsPart />
      <AgentEventsPart />
      <ImagePart />
      <MarkdownPart />
      <DocumentFilePart />
      <SourcesPart />
      <SuggestedQuestionsPart />
    </>
  )

  return (
    <div className={cn('flex min-w-0 flex-1 flex-col gap-4', props.className)}>
      {props.message?.parts.map((part, index) => (
        <ChatPartProvider key={index} value={{ part }}>
          {children}
        </ChatPartProvider>
      ))}
    </div>
  )
}

function ChatMessageActions(props: ChatMessageActionsProps) {
  const { reload, requestData, isLoading } = useChatUI()
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
  const { message, isLast } = useChatMessage()

  if (message.role !== 'assistant') return null

  const isLastMessageFromAssistant = message.role === 'assistant' && isLast
  const showReload = reload && !isLoading && isLastMessageFromAssistant

  // content to copy is all text parts joined by newlines
  const messageTextContent = message.parts
    .filter((part): part is TextPart => part.type === TextPartType)
    .map(part => part.text)
    .join('\n\n')

  const children = props.children ?? (
    <>
      <Button
        title="Copy"
        onClick={() => copyToClipboard(messageTextContent)}
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
  Event: typeof EventsPart
  AgentEvent: typeof AgentEventsPart
  Image: typeof ImagePart
  Markdown: typeof MarkdownPart
  DocumentFile: typeof DocumentFilePart
  Source: typeof SourcesPart
  SuggestedQuestions: typeof SuggestedQuestionsPart
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

PrimiviteChatMessage.Content.Event = EventsPart
PrimiviteChatMessage.Content.AgentEvent = AgentEventsPart
PrimiviteChatMessage.Content.Image = ImagePart
PrimiviteChatMessage.Content.Markdown = MarkdownPart
PrimiviteChatMessage.Content.DocumentFile = DocumentFilePart
PrimiviteChatMessage.Content.Source = SourcesPart
PrimiviteChatMessage.Content.SuggestedQuestions = SuggestedQuestionsPart

PrimiviteChatMessage.Avatar = ChatMessageAvatar
PrimiviteChatMessage.Actions = ChatMessageActions

export default PrimiviteChatMessage
