import { DocumentInfo, DocumentFile } from './document-info'
import { cn } from '../lib/utils'

export type DocumentFileData = {
  files: DocumentFile[]
}

export function ChatFiles({
  data,
  className,
}: {
  data: DocumentFileData
  className?: string
}) {
  if (!data.files.length) return null
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {data.files.map(file => (
        <DocumentInfo
          key={file.id}
          document={{ url: file.url, sources: [] }}
          className="mb-2 mt-2"
        />
      ))}
    </div>
  )
}
