'use client'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@radix-ui/react-hover-card'
import { Check, Copy } from 'lucide-react'
import { DocumentFileType, SourceNode } from '../chat/annotation'
import { useCopyToClipboard } from '../hook/use-copy-to-clipboard'
import { Button } from '../ui/button'
import { DocumentPreviewCard } from './document-preview'
import { PdfDialog } from './pdf-dialog'
import { SourceNumberButton } from './source-number-button'

type Document = {
  url: string
  sources: SourceNode[]
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
      <HoverCardContent className="w-[400px] bg-white p-4">
        <NodeInfo nodeInfo={node} />
      </HoverCardContent>
    </HoverCard>
  )
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
