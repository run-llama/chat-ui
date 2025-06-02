import { Message } from '../chat.interface'
import { MessageAnnotationType } from './data'
import { getAnnotationData } from './annotations'

export function preprocessSourceNodes(nodes: SourceNode[]): SourceNode[] {
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
export function getSourceAnnotationData(message: Message): SourceData[] {
  const data = getAnnotationData<SourceData>(
    message,
    MessageAnnotationType.SOURCES
  )
  if (!data?.length) return []
  return data.map(item => ({
    ...item,
    nodes: item.nodes ? preprocessSourceNodes(item.nodes) : [],
  }))
}
export type SourceNode = {
  id: string
  metadata: Record<string, unknown>
  score?: number
  text: string
  url?: string
}

export type SourceData = {
  nodes: SourceNode[]
}
