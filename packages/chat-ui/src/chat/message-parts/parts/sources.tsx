import { ChatSources, preprocessSourceNodes } from '../../../widgets/index.js'
import { usePart } from '../context.js'
import { SourcesPartType } from '../types.js'

/**
 * Render a list of sources inside a ChatMessage, return null if current part is not sources type
 * This component is useful to show a list of sources from the assistant.
 * @param className - custom styles for the sources
 */
export function SourcesPartUI({ className }: { className?: string }) {
  const sources = usePart(SourcesPartType)?.data
  const nodes = preprocessSourceNodes(sources?.nodes ?? [])

  if (nodes.length === 0) return null
  return <ChatSources data={{ nodes }} className={className} />
}
