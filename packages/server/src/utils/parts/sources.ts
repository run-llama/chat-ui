import { workflowEvent } from '@llamaindex/workflow'
import { MetadataMode, type Metadata, type NodeWithScore } from 'llamaindex'

export const SOURCE_EVENT_TYPE = `data-sources` as const

export type SourceEventNode = {
  id: string
  metadata: Metadata
  score: number | null
  url: string
  text: string
  fileName: string
  filePath: string
}

export type SourceEvent = {
  nodes: SourceEventNode[]
}

export const sourceEvent = workflowEvent<{
  type: typeof SOURCE_EVENT_TYPE
  data: SourceEvent
}>()

export function toSourceEvent(
  sourceNodes: NodeWithScore<Metadata>[] = [],
  llamaCloudOutputDir: string = 'output/llamacloud'
) {
  const nodes: SourceEventNode[] = sourceNodes.map(node =>
    toSourceEventNode(node, llamaCloudOutputDir)
  )
  return sourceEvent.with({
    type: SOURCE_EVENT_TYPE,
    data: { nodes },
  })
}

export function toSourceEventNode(
  node: NodeWithScore<Metadata>,
  llamaCloudOutputDir: string = 'output/llamacloud'
) {
  const { file_name, pipeline_id } = node.node.metadata

  const filePath = pipeline_id
    ? `${llamaCloudOutputDir}/${pipeline_id}$${file_name}`
    : `data/${file_name}`

  return {
    id: node.node.id_,
    fileName: file_name,
    filePath,
    url: `/api/files/${filePath}`,
    metadata: node.node.metadata,
    score: node.score ?? null,
    text: node.node.getContent(MetadataMode.NONE),
  }
}
