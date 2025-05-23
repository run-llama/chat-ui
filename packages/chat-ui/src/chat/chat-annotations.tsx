import { useMemo } from 'react'
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
  extractArtifactsFromMessage,
  getChatUIAnnotation,
  getSourceAnnotationData,
  ImageData,
  MessageAnnotation,
  MessageAnnotationType,
  SuggestedQuestionsData,
} from './annotation'
import { useChatMessage } from './chat-message.context.js'
import { useChatUI } from './chat.context.js'
import { ArtifactCard } from './canvas/card.js'

export function EventAnnotations() {
  const { message, isLast, isLoading } = useChatMessage()
  const showLoading = (isLast && isLoading) ?? false

  const annotations = message.annotations as MessageAnnotation[] | undefined
  const eventData =
    annotations && annotations.length > 0
      ? getChatUIAnnotation<EventData>(
          annotations,
          MessageAnnotationType.EVENTS
        )
      : null
  if (!eventData?.length) return null
  return <ChatEvents data={eventData} showLoading={showLoading} />
}

export function AgentEventAnnotations() {
  const { message } = useChatMessage()

  const annotations = message.annotations as MessageAnnotation[] | undefined
  const agentEventData =
    annotations && annotations.length > 0
      ? getChatUIAnnotation<AgentEventData>(
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

export function ImageAnnotations() {
  const { message } = useChatMessage()

  const annotations = message.annotations as MessageAnnotation[] | undefined
  const imageData =
    annotations && annotations.length > 0
      ? getChatUIAnnotation<ImageData>(annotations, 'image')
      : null
  if (!imageData) return null
  return imageData[0] ? <ChatImage data={imageData[0]} /> : null
}

export function DocumentFileAnnotations() {
  const { message } = useChatMessage()

  const annotations = message.annotations as MessageAnnotation[] | undefined
  const contentFileData =
    annotations && annotations.length > 0
      ? getChatUIAnnotation<DocumentFileData>(
          annotations,
          MessageAnnotationType.DOCUMENT_FILE
        )
      : null
  if (!contentFileData) return null
  return contentFileData[0] ? <ChatFiles data={contentFileData[0]} /> : null
}

export function SourceAnnotations() {
  const { message } = useChatMessage()

  const annotations = (message.annotations ?? []) as MessageAnnotation[]
  const sourceData = getSourceAnnotationData(annotations)

  if (!sourceData?.length) return null
  const allNodes = sourceData.flatMap(item => item.nodes)
  return <ChatSources data={{ nodes: allNodes }} />
}

export function SuggestedQuestionsAnnotations() {
  const { append, requestData } = useChatUI()
  const { message, isLast } = useChatMessage()
  if (!isLast || !append) return null

  const annotations = message.annotations as MessageAnnotation[] | undefined
  const suggestedQuestionsData =
    annotations && annotations.length > 0
      ? getChatUIAnnotation<SuggestedQuestionsData>(
          annotations,
          MessageAnnotationType.SUGGESTED_QUESTIONS
        )
      : null
  if (!suggestedQuestionsData?.[0]) return null
  return (
    <SuggestedQuestions
      questions={suggestedQuestionsData[0]}
      append={append}
      requestData={requestData}
    />
  )
}

export function ArtifactAnnotations() {
  const { message } = useChatMessage()
  const artifacts = useMemo(
    () => extractArtifactsFromMessage(message),
    [message]
  )
  if (!artifacts?.length) return null

  return (
    <div className="flex items-center gap-2">
      {artifacts.map((artifact, index) => (
        <ArtifactCard key={index} artifact={artifact} />
      ))}
    </div>
  )
}
