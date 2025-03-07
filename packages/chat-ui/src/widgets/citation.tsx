import { SourceData } from '../chat/annotation'
import { SourceNumberButton } from './source-number-button'

// Simple citation component that renders a source number button
export function Citation({
  nodeId,
  sources,
}: {
  nodeId: string
  sources?: SourceData
}) {
  if (!sources) return null

  const sourceNode = sources.nodes.find(node => node.id === nodeId)
  if (!sourceNode) return null

  // Find the index of the node within the sources array
  const index = sources.nodes.indexOf(sourceNode)

  return <SourceNumberButton index={index} />
}
