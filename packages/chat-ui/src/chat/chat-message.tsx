import { createContext, Fragment, memo, useContext, useMemo } from 'react'
import { cn } from '../lib/utils'
import { Message } from './chat.interface'
import { Bot, Check, Copy, MessageCircle, User2 } from 'lucide-react'
import { Button } from '../ui/button'
import { useCopyToClipboard } from '../hook/use-copy-to-clipboard'
import { Markdown } from '../widget/markdown'
import {
  getSourceAnnotationData,
  ImageData,
  SuggestedQuestionsData,
  AgentEventData,
  DocumentFileData,
  EventData,
  getAnnotationData,
  MessageAnnotation,
  MessageAnnotationType,
} from './annotation'
import { useChatUI } from './chat.context'
import { ChatAgentEvents } from '../widget/chat-agent-events'
import { ChatEvents } from '../widget/chat-events'
import { ChatImage } from '../widget/chat-image'
import { ChatFiles } from '../widget/chat-files'
import { ChatSources } from '../widget/chat-sources'
import { SuggestedQuestions } from '../widget/suggested-questions'

interface ChatMessageProps extends React.PropsWithChildren {
  message: Message
  isLast: boolean
  className?: string
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
  MARKDOWN = 6,
  AFTER_MARKDOWN = 7,
  CHAT_SOURCES = 8,
  AFTER_SOURCES = 9,
  SUGGESTED_QUESTIONS = 10,
  AFTER_SUGGESTED_QUESTIONS = 11,
  BOTTOM = 9999,
}

type ContentDisplayConfig = {
  position: ContentPosition
  component: React.ReactNode | null
}

interface ChatMessageContentProps extends React.PropsWithChildren {
  className?: string
  content?: ContentDisplayConfig[]
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
      <ChatMessageContent />
      <ChatMessageActions />
    </>
  )

  return (
    <ChatMessageProvider
      value={{ message: props.message, isLast: props.isLast }}
    >
      <div className={cn('group flex gap-4 pr-2 pt-4', props.className)}>
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
  const { append, isLoading } = useChatUI()
  const { message, isLast } = useChatMessage()
  const annotations = message.annotations as MessageAnnotation[] | undefined

  const contents = useMemo(() => {
    if (!annotations?.length) {
      return [
        {
          position: ContentPosition.MARKDOWN,
          component: <Markdown content={message.content} />,
        },
        ...(props.content ?? []),
      ]
    }

    const imageData = getAnnotationData<ImageData>(annotations, 'image')
    const contentFileData = getAnnotationData<DocumentFileData>(
      annotations,
      MessageAnnotationType.DOCUMENT_FILE
    )
    const eventData = getAnnotationData<EventData>(
      annotations,
      MessageAnnotationType.EVENTS
    )
    const agentEventData = getAnnotationData<AgentEventData>(
      annotations,
      MessageAnnotationType.AGENT_EVENTS
    )
    const sourceData = getSourceAnnotationData(annotations)
    const suggestedQuestionsData = getAnnotationData<SuggestedQuestionsData>(
      annotations,
      MessageAnnotationType.SUGGESTED_QUESTIONS
    )

    return [
      {
        position: ContentPosition.CHAT_EVENTS,
        component:
          eventData.length > 0 ? (
            <ChatEvents
              data={eventData}
              isLast={isLast}
              isLoading={isLoading}
            />
          ) : null,
      },
      {
        position: ContentPosition.CHAT_AGENT_EVENTS,
        component:
          agentEventData.length > 0 ? (
            <ChatAgentEvents
              data={agentEventData}
              isFinished={Boolean(message.content)}
            />
          ) : null,
      },
      {
        position: ContentPosition.CHAT_IMAGE,
        component: imageData[0] ? <ChatImage data={imageData[0]} /> : null,
      },
      {
        position: ContentPosition.AFTER_IMAGE,
        component: contentFileData[0] ? (
          <ChatFiles data={contentFileData[0]} />
        ) : null,
      },
      {
        position: ContentPosition.MARKDOWN,
        component: (
          <Markdown content={message.content} sources={sourceData[0]} />
        ),
      },
      {
        position: ContentPosition.CHAT_SOURCES,
        component: sourceData[0] ? <ChatSources data={sourceData[0]} /> : null,
      },
      {
        position: ContentPosition.SUGGESTED_QUESTIONS,
        component: suggestedQuestionsData[0] ? (
          <SuggestedQuestions
            questions={suggestedQuestionsData[0]}
            append={append}
            isLastMessage={isLast}
          />
        ) : null,
      },
      ...(props.content ?? []),
    ] as ContentDisplayConfig[]
  }, [annotations, append, isLast, isLoading, message.content, props.content])

  const children = props.children ?? (
    <>
      {contents
        .sort((a, b) => a.position - b.position)
        .map((content, index) => (
          <Fragment key={index}>{content.component}</Fragment>
        ))}
    </>
  )

  return (
    <div className={cn('flex flex-1 flex-col gap-4', props.className)}>
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
