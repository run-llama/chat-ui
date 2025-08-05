import {
  ChatSources,
  preprocessSourceNodes,
  SourceData,
} from '../../../widgets/index.js'
import { usePartData } from '../context.js'

export const SourcesPartType = 'data-sources' as const

/**
 * Render a list of sources inside a ChatMessage, return null if current part is not sources type
 * This component is useful to show a list of sources from the assistant.
 * @param props.className - custom styles for the sources
 */
export function SourcesPart({ className }: { className?: string }) {
  const sources = usePartData<SourceData>(SourcesPartType)
  const nodes = preprocessSourceNodes(sources?.nodes ?? [])

  if (nodes.length === 0) return null
  return <ChatSources data={{ nodes }} className={className} />
}
