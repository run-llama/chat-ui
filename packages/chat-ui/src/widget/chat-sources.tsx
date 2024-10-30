'use client'

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@radix-ui/react-hover-card'
import { Check, Copy } from 'lucide-react'
import { useMemo } from 'react'
import { SourceNode, SourceData, DocumentFileType } from '../chat/annotation'
import { useCopyToClipboard } from '../hook/use-copy-to-clipboard'
import { cn } from '../lib/utils'
import { PdfDialog } from './pdf-dialog'
import { Button } from '../ui/button'
import { DocumentPreviewCard } from './document-preview'

type Document = {
  url: string
  sources: SourceNode[]
}

export function ChatSources({ data }: { data: SourceData }) {
  const documents: Document[] = useMemo(() => {
    // group nodes by document (a document must have a URL)
    const nodesByUrl: Record<string, SourceNode[]> = {}
    data.nodes.forEach(node => {
      const key = node.url
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
    <div className="space-y-2 text-sm">
      <div className="text-lg font-semibold">Sources:</div>
      <div className="flex flex-wrap gap-3">
        {documents.map(document => {
          return <DocumentInfo key={document.url} document={document} />
        })}
      </div>
    </div>
  )
}

function SourceInfo({ node, index }: { node?: SourceNode; index: number }) {
  if (!node) return <SourceNumberButton index={index} />
  return (
    <HoverCard>
      <HoverCardTrigger
        className="cursor-default"
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <SourceNumberButton
          index={index}
          className="hover:bg-primary hover:text-white"
        />
      </HoverCardTrigger>
      <HoverCardContent className="w-[400px]">
        <NodeInfo nodeInfo={node} />
      </HoverCardContent>
    </HoverCard>
  )
}

export function SourceNumberButton({
  index,
  className,
}: {
  index: number
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs',
        className
      )}
    >
      {index + 1}
    </span>
  )
}

export function DocumentInfo({
  document,
  className,
}: {
  document: Document
  className?: string
}) {
  const { url, sources } = document
  // Extract filename from URL
  const urlParts = url.split('/')
  const fileName = urlParts.length > 0 ? urlParts[urlParts.length - 1] : url
  const fileExt = fileName?.split('.').pop() as DocumentFileType | undefined

  const previewFile = {
    name: fileName,
    type: fileExt as DocumentFileType,
  }

  const DocumentDetail = (
    <div className={`relative ${className}`}>
      <DocumentPreviewCard className="cursor-pointer" file={previewFile} />
      <div className="absolute bottom-2 right-2 flex space-x-2">
        {sources.map((node: SourceNode, index: number) => (
          <div key={node.id}>
            <SourceInfo node={node} index={index} />
          </div>
        ))}
      </div>
    </div>
  )

  if (url.endsWith('.pdf')) {
    // open internal pdf dialog for pdf files when click document card
    return <PdfDialog documentId={url} url={url} trigger={DocumentDetail} />
  }
  // open external link when click document card for other file types
  return <div onClick={() => window.open(url, '_blank')}>{DocumentDetail}</div>
}

function NodeInfo({ nodeInfo }: { nodeInfo: SourceNode }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 1000 })

  const pageNumber =
    // XXX: page_label is used in Python, but page_number is used by Typescript
    (nodeInfo.metadata?.page_number as number) ??
    (nodeInfo.metadata?.page_label as number) ??
    null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold">
          {pageNumber ? `On page ${pageNumber}:` : 'Node content:'}
        </span>
        {nodeInfo.text && (
          <Button
            onClick={e => {
              e.stopPropagation()
              copyToClipboard(nodeInfo.text)
            }}
            size="icon"
            variant="ghost"
            className="h-12 w-12 shrink-0"
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {nodeInfo.text && (
        <pre className="max-h-[200px] overflow-auto whitespace-pre-line">
          &ldquo;{nodeInfo.text}&rdquo;
        </pre>
      )}
    </div>
  )
}
