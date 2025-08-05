import {
  ChatSources,
  preprocessSourceNodes,
  SourceData,
} from '../../../widgets/index.js'
import { usePart } from '../context.js'

export const SourcesPartType = 'data-sources' as const

/**
 * Render a list of sources as a ChatSources component.
 * @param props.className - custom styles for the sources
 */
export function SourcesPart({ className }: { className?: string }) {
  const sources = usePart<SourceData[]>(SourcesPartType)
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
