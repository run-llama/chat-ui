import {
  ChatSources,
  preprocessSourceNodes,
  SourceData,
} from '../../../widgets/index.js'
import { useCurrentPart } from '../context.js'

export const SourcesPartType = 'data-sources' as const

/**
 * Render a list of sources inside a ChatMessage, return null if current part is not sources type
 * @param props.className - custom styles for the sources
 */
export function SourcesPart({ className }: { className?: string }) {
  const sources = useCurrentPart<SourceData[]>(SourcesPartType)
  const nodes =
    sources
      ?.map(item => ({
        ...item,
        nodes: item.nodes ? preprocessSourceNodes(item.nodes) : [],
      }))
      .flatMap(item => item.nodes) ?? []

  if (nodes.length === 0) return null
  return <ChatSources data={{ nodes }} className={className} />
}
