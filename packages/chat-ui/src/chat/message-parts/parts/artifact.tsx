import { ArtifactCard } from '../../canvas/artifact-card.js'
import { Artifact, ArtifactPartType } from '../../canvas/artifacts.js'
import { usePartData } from '../context.js'

/**
 * Display an artifact card in the chat message when artifact part is available
 * @param props.className - custom styles for the artifact
 */
export function ArtifactPart({ className }: { className?: string }) {
  const artifact = usePartData<Artifact>(ArtifactPartType)
  if (!artifact) return null
  return <ArtifactCard data={artifact} className={className} />
}
