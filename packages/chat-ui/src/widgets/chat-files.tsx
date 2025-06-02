import { DocumentInfo } from './document-info'

export type DocumentFileType = 'csv' | 'pdf' | 'txt' | 'docx'
export const DOCUMENT_FILE_TYPES: DocumentFileType[] = [
  'csv',
  'pdf',
  'txt',
  'docx',
]

export type DocumentFile = {
  id: string
  name: string // The uploaded file name in the backend
  size: number // The file size in bytes
  type: DocumentFileType
  url: string // The URL of the uploaded file in the backend
  refs?: string[] // DocumentIDs of the uploaded file in the vector index
}

export type DocumentFileData = {
  files: DocumentFile[]
}

export function ChatFiles({ data }: { data: DocumentFileData }) {
  if (!data.files.length) return null
  return (
    <div className="flex items-center gap-2">
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
