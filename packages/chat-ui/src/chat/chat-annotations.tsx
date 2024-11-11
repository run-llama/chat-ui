import {
  ChatAgentEvents,
  ChatEvents,
  ChatFiles,
  ChatImage,
  ChatSources,
  SuggestedQuestions,
} from '../widgets/index.js' // this import needs the file extension as it's importing the widget bundle
import {
  AgentEventData,
  DocumentFileData,
  EventData,
  getAnnotationData,
  getSourceAnnotationData,
  ImageData,
  MessageAnnotation,
  MessageAnnotationType,
  SuggestedQuestionsData,
} from './annotation'
import { useChatUI } from './chat.context'
import { Message } from './chat.interface'

export function EventAnnotations({
  message,
  isLast,
}: {
  message: Message
  isLast: boolean
}) {
  const { isLoading } = useChatUI()
  const annotations = message.annotations as MessageAnnotation[] | undefined
  const eventData =
    annotations && annotations.length > 0
      ? getAnnotationData<EventData>(annotations, MessageAnnotationType.EVENTS)
      : null
  if (!eventData?.length) return null
  return <ChatEvents data={eventData} isLast={isLast} isLoading={isLoading} />
}

export function AgentEventAnnotations({ message }: { message: Message }) {
  const annotations = message.annotations as MessageAnnotation[] | undefined
  const agentEventData =
    annotations && annotations.length > 0
      ? getAnnotationData<AgentEventData>(
          annotations,
          MessageAnnotationType.AGENT_EVENTS
        )
      : null
  if (!agentEventData?.length) return null
  return (
    <ChatAgentEvents
      data={agentEventData}
      isFinished={Boolean(message.content)}
    />
  )
}

export function ImageAnnotations({ message }: { message: Message }) {
  const annotations = message.annotations as MessageAnnotation[] | undefined
  const imageData =
    annotations && annotations.length > 0
      ? getAnnotationData<ImageData>(annotations, 'image')
      : null
  if (!imageData) return null
  return imageData[0] ? <ChatImage data={imageData[0]} /> : null
}

export function DocumentFileAnnotations({ message }: { message: Message }) {
  const annotations = message.annotations as MessageAnnotation[] | undefined
  const contentFileData =
    annotations && annotations.length > 0
      ? getAnnotationData<DocumentFileData>(
          annotations,
          MessageAnnotationType.DOCUMENT_FILE
        )
      : null
  if (!contentFileData) return null
  return contentFileData[0] ? <ChatFiles data={contentFileData[0]} /> : null
}

export function SourceAnnotations({ message }: { message: Message }) {
  const annotations = message.annotations as MessageAnnotation[] | undefined
  const sourceData =
    annotations && annotations.length > 0
      ? getSourceAnnotationData(annotations)
      : null
  if (!sourceData) return null
  return sourceData[0] ? <ChatSources data={sourceData[0]} /> : null
}

export function SuggestedQuestionsAnnotations({
  message,
  isLast,
}: {
  message: Message
  isLast: boolean
}) {
  const { append } = useChatUI()
  const annotations = message.annotations as MessageAnnotation[] | undefined
  const suggestedQuestionsData =
    annotations && annotations.length > 0
      ? getAnnotationData<SuggestedQuestionsData>(
          annotations,
          MessageAnnotationType.SUGGESTED_QUESTIONS
        )
      : null
  if (!suggestedQuestionsData) return null
  return suggestedQuestionsData[0] ? (
    <SuggestedQuestions
      questions={suggestedQuestionsData[0]}
      append={append}
      isLastMessage={isLast}
    />
  ) : null
}
