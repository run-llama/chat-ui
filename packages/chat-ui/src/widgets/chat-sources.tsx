import { useMemo } from 'react'
import { Document, DocumentInfo, SourceNode } from './document-info'
import { cn } from '../lib/utils'

export type SourceData = {
  nodes: SourceNode[]
}

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

export function ChatSources({
  data,
  className,
}: {
  data: SourceData
  className?: string
}) {
  const documents: Document[] = useMemo(() => {
    // group nodes by document (a document must have a URL)
    const nodesByUrl: Record<string, SourceNode[]> = {}
    data.nodes
      .filter(node => node.url)
      .forEach(node => {
        const key = node.url ?? ''
        nodesByUrl[key] ??= []
        nodesByUrl[key].push(node)
      })

    // convert to array of documents
    return Object.entries(nodesByUrl).map(([url, sources]) => ({
      url,
      sources,
    }))
  }, [data.nodes])

  if (documents.length === 0) return null

  return (
    <div className={cn('space-y-2 text-sm', className)}>
      <div className="text-lg font-semibold">Sources:</div>
      <div className="flex flex-wrap gap-3">
        {documents.map((document, index) => {
          const startIndex = documents
            .slice(0, index)
            .reduce((acc, doc) => acc + doc.sources.length, 0)
          return (
            <DocumentInfo
              key={document.url}
              document={document}
              startIndex={startIndex}
            />
          )
        })}
      </div>
    </div>
  )
}
