'use client'

import { FileText } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { DocumentEditor } from '../../../widgets'
import { DocumentArtifact } from '../../annotation'
import { ChatCanvasActions } from '../actions'
import { useChatCanvas } from '../context'

interface DocumentArtifactViewerProps {
  className?: string
  children?: React.ReactNode
}

export function DocumentArtifactViewer({
  className,
  children,
}: DocumentArtifactViewerProps) {
  const { displayedArtifact } = useChatCanvas()

  if (displayedArtifact?.type !== 'document') return null

  const {
    data: { content, title, type },
  } = displayedArtifact as DocumentArtifact

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
      <div className="flex min-h-0 flex-1 flex-col items-stretch gap-4 overflow-auto px-20 py-4">
        {children ?? <DocumentEditor content={content} />}
      </div>
    </div>
  )
}
