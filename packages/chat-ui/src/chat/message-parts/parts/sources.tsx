import {
  ChatSources,
  preprocessSourceNodes,
  SourceData,
} from '../../../widgets/index.js'
import { useAllParts } from '../context.js'
import { MessagePartType } from '../types.js'

/**
 * Aggregates all `sources` parts for a message and renders them as a ChatSources component.
 * Displayed at the bottom of the message with `order-last` style.
 */
export function SourcesPart() {
  const sources = useAllParts<SourceData>(MessagePartType.SOURCES)

  const nodes = sources
    .map(item => ({
      ...item,
      nodes: item.nodes ? preprocessSourceNodes(item.nodes) : [],
    }))
    .flatMap(item => item.nodes)

  if (nodes.length === 0) return null
  return (
    <div className="order-last">
      <ChatSources data={{ nodes }} />
    </div>
  )
}
