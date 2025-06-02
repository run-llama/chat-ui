import { ComponentType, useMemo } from 'react'
import {
  ChatAgentEvents,
  ChatEvents,
  ChatFiles,
  ChatImage,
  ChatSources,
  EventData,
  ImageData,
  DocumentFileData,
  AgentEventData,
  SuggestedQuestionsData,
  SuggestedQuestions,
  SourceData,
  SourceNode,
} from '../widgets/index.js' // this import needs the file extension as it's importing the widget bundle
import { MessageAnnotationType } from './annotations/types.js'
import { getAnnotationData } from './annotations/annotations.js'
import { extractArtifactsFromMessage } from './canvas/artifacts.js'
import { useChatMessage } from './chat-message.context.js'
import { useChatUI } from './chat.context.js'
import { ArtifactCard } from './canvas/artifact-card.js'
import { Message } from './chat.interface.js'
import ChatCanvas from './canvas/index.js'

export function EventAnnotations() {
  const { message, isLast, isLoading } = useChatMessage()
  const showLoading = (isLast && isLoading) ?? false

  const eventData = getAnnotationData<EventData>(
    message,
    MessageAnnotationType.EVENTS
  )
  if (eventData.length === 0) return null
  return <ChatEvents data={eventData} showLoading={showLoading} />
}

export function AgentEventAnnotations() {
  const { message, isLast } = useChatMessage()

  const agentEventData = getAnnotationData<AgentEventData>(
    message,
    MessageAnnotationType.AGENT_EVENTS
  )
  if (agentEventData.length === 0) return null
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
  if (imageData.length === 0) return null
  return <ChatImage data={imageData[0]} />
}

export function DocumentFileAnnotations() {
  const { message } = useChatMessage()

  const contentFileData = getAnnotationData<DocumentFileData>(
    message,
    MessageAnnotationType.DOCUMENT_FILE
  )
  if (contentFileData.length === 0) return null
  return <ChatFiles data={contentFileData[0]} />
}

function preprocessSourceNodes(nodes: SourceNode[]): SourceNode[] {
  // Filter source nodes has lower score
  const processedNodes = nodes.map(node => {
    // remove trailing slash for node url if exists
    if (node.url) {
      node.url = node.url.replace(/\/$/, '')
    }
    return node
  })
  return processedNodes
}

export function getSourceNodes(message: Message): SourceNode[] {
  const data = getAnnotationData<SourceData>(
    message,
    MessageAnnotationType.SOURCES
  )
  return data
    .map(item => ({
      ...item,
      nodes: item.nodes ? preprocessSourceNodes(item.nodes) : [],
    }))
    .flatMap(item => item.nodes)
}

export function SourceAnnotations() {
  const { message } = useChatMessage()

  const nodes = getSourceNodes(message)
  if (nodes.length === 0) return null
  return <ChatSources data={{ nodes }} />
}

export function SuggestedQuestionsAnnotations() {
  const { append, requestData } = useChatUI()
  const { message, isLast } = useChatMessage()
  if (!isLast || !append) return null

  const suggestedQuestionsData = getAnnotationData<SuggestedQuestionsData>(
    message,
    MessageAnnotationType.SUGGESTED_QUESTIONS
  )
  if (suggestedQuestionsData.length === 0) return null
  return (
    <SuggestedQuestions
      questions={suggestedQuestionsData[0]}
      append={append}
      requestData={requestData}
    />
  )
}

export interface ArtifactAnnotationsProps {
  showInline?: boolean
}

export function ArtifactAnnotations({
  // by default, inline artifact has been shown in the markdown
  // so we don't need to show it again in the annotation list
  showInline = false,
}: ArtifactAnnotationsProps) {
  const { message } = useChatMessage()
  const artifacts = useMemo(
    () => extractArtifactsFromMessage(message),
    [message]
  )
  if (!artifacts?.length) return null

  return (
    <div className="flex items-center gap-2">
      {artifacts
        .filter(a => !a.inline || showInline)
        .map((artifact, index) => (
          <ArtifactCard key={index} data={artifact} />
        ))}
    </div>
  )
}

export const defaultAnnotationRenderers: Record<
  string,
  ComponentType<{ data: any }>
> = {
  artifact: ChatCanvas.Artifact,
}
