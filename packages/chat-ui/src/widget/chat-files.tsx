'use client'

import { DocumentFileData } from '../chat/annotation'
import { DocumentPreview } from './document-preview'

export function ChatFiles({ data }: { data: DocumentFileData }) {
  if (!data.files.length) return null
  return (
    <div className="flex items-center gap-2">
      {data.files.map(file => (
        <DocumentPreview key={file.id} file={file} />
      ))}
    </div>
  )
}
