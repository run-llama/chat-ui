'use client'

import { FileText } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { DocumentEditor } from '../../../widgets'
import { DocumentArtifact } from '../../annotation'
import { ChatCanvasActions } from '../actions'
import { useChatCanvas } from '../context'
import { useState } from 'react'
import { Button } from '../../../ui/button'

interface DocumentArtifactViewerProps {
  className?: string
  children?: React.ReactNode
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
      <div className="relative flex min-h-0 flex-1 flex-col items-stretch gap-4 overflow-auto px-20 py-4">
        {updatedContent && (
          <div className="bg-background absolute right-0 top-0 flex gap-2 py-2 pr-2 text-sm">
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
            content={content}
            onChange={handleDocumentChange}
          />
        )}
      </div>
    </div>
  )
}
