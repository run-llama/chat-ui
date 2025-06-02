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
  ImageData,
  MessageAnnotationType,
  SuggestedQuestionsData,
} from './annotations/data.js'
import { getAnnotationData } from './annotations/annotations.js'
import { getSourceAnnotationData } from './annotations/sources.js'
import { extractArtifactsFromMessage } from './annotations/artifacts.js'
import { useChatMessage } from './chat-message.context.js'
import { useChatUI } from './chat.context.js'
import { ArtifactCard } from './canvas/card.js'

export function EventAnnotations() {
  const { message, isLast, isLoading } = useChatMessage()
  const showLoading = (isLast && isLoading) ?? false

  const eventData = getAnnotationData<EventData>(
    message,
    MessageAnnotationType.EVENTS
  )
  if (!eventData?.length) return null
  return <ChatEvents data={eventData} showLoading={showLoading} />
}

export function AgentEventAnnotations() {
  const { message, isLast } = useChatMessage()

  const agentEventData = getAnnotationData<AgentEventData>(
    message,
    MessageAnnotationType.AGENT_EVENTS
  )
  if (!agentEventData?.length) return null
  return (
    <ChatAgentEvents
      data={agentEventData}
      isFinished={Boolean(message.content)}
      isLast={isLast}
    />
  )
}

export function ImageAnnotations() {
  const { message } = useChatMessage()

  const imageData = getAnnotationData<ImageData>(message, 'image')
  if (!imageData) return null
  return imageData[0] ? <ChatImage data={imageData[0]} /> : null
}

export function DocumentFileAnnotations() {
  const { message } = useChatMessage()

  const contentFileData = getAnnotationData<DocumentFileData>(
    message,
    MessageAnnotationType.DOCUMENT_FILE
  )
  if (!contentFileData) return null
  return contentFileData[0] ? <ChatFiles data={contentFileData[0]} /> : null
}

export function SourceAnnotations() {
  const { message } = useChatMessage()

  const sourceData = getSourceAnnotationData(message)

  if (!sourceData?.length) return null
  const allNodes = sourceData.flatMap(item => item.nodes)
  return <ChatSources data={{ nodes: allNodes }} />
}

export function SuggestedQuestionsAnnotations() {
  const { append, requestData } = useChatUI()
  const { message, isLast } = useChatMessage()
  if (!isLast || !append) return null

  const suggestedQuestionsData = getAnnotationData<SuggestedQuestionsData>(
    message,
    MessageAnnotationType.SUGGESTED_QUESTIONS
  )
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
