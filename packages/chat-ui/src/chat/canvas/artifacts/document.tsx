'use client'

import { FileText } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { DocumentEditor } from '../../../widgets'
import { DocumentArtifact } from '../artifacts'
import { ChatCanvasActions } from '../actions'
import { useChatCanvas } from '../context'
import { useState } from 'react'
import { Button } from '../../../ui/button'

interface DocumentArtifactViewerProps {
  className?: string
  children?: React.ReactNode
}

// Convert citation with node_id to citation number in markdown
function processDocument(content: string, nodeIds: string[]) {
  if (nodeIds.length === 0) return content

  const citationRegex =
    /\[citation:([a-fA-F0-9\\-]+)\](?:\(javascript:void\(0\)\))?/g

  let processedContent = content.replace(citationRegex, (match, citationId) => {
    const nodeIndex = nodeIds.findIndex(nodeId => nodeId === citationId)
    if (nodeIndex !== -1) return ` \`${nodeIndex + 1}\` `
    return match // return original citation if not found
  })

  // MdxEditor does not support <br> tags
  processedContent = processedContent.replace(/<br\s*\/?>/gi, ' ')

  return processedContent
}

export function DocumentArtifactViewer({
  className,
  children,
}: DocumentArtifactViewerProps) {
  const { displayedArtifact, updateArtifact } = useChatCanvas()

  const [updatedContent, setUpdatedContent] = useState<string | undefined>()

  if (displayedArtifact?.type !== 'document') return null

  const documentArtifact = displayedArtifact as DocumentArtifact
  const {
    data: { content, title, type },
  } = documentArtifact

  const transformedContent = processDocument(
    content,
    documentArtifact.data.sources?.map(source => source.id) ?? []
  )

  const handleDocumentChange = (markdown: string) => {
    setUpdatedContent(markdown)
  }

  const handleSaveChanges = () => {
    if (!updatedContent) return
    updateArtifact(documentArtifact, updatedContent)
    setUpdatedContent(undefined)
  }

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col', className)}>
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="flex items-center gap-3 text-gray-600">
          <FileText className="size-8 text-blue-500" />
          <div className="flex flex-col">
            <div className="text font-semibold">{title}</div>
            <div className="text-xs text-gray-500">{type}</div>
          </div>
        </h3>
        <ChatCanvasActions />
      </div>
      <div className="relative mx-20 flex min-h-0 flex-1 flex-col items-stretch gap-4 py-2">
        {updatedContent && (
          <div className="absolute right-[30px] top-[14px] z-20 flex gap-2 text-sm">
            <Button
              size="sm"
              className="h-7 bg-blue-500 hover:bg-blue-600"
              onClick={handleSaveChanges}
            >
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7"
              onClick={() => setUpdatedContent(undefined)}
            >
              Revert
            </Button>
          </div>
        )}
        {children ?? (
          <DocumentEditor
            key={documentArtifact.created_at}
            content={transformedContent}
            onChange={handleDocumentChange}
            className="overflow-y-auto"
          />
        )}
      </div>
    </div>
  )
}
