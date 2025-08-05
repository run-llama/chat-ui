import { FileIcon } from 'lucide-react'
import { cn } from '../lib/utils'
import { DocxIcon } from '../ui/icons/docx'
import { PDFIcon } from '../ui/icons/pdf'
import { SheetIcon } from '../ui/icons/sheet'
import { TxtIcon } from '../ui/icons/txt'

export type FileData = {
  name: string // e.g. 'cat.png'
  url?: string // e.g. 'https://example.com/cat.png'
  size?: number // in bytes
}

const FileIconMap: Record<string, React.ReactNode> = {
  csv: <SheetIcon />,
  pdf: <PDFIcon />,
  docx: <DocxIcon />,
  txt: <TxtIcon />,
}

export function ChatFile({
  file,
  className,
}: {
  file: FileData
  className?: string
}) {
  const isImage = isImageFile(file.name)
  const fileSize = file.size ? formatFileSize(file.size) : null
  const fileExtension = getFileExtension(file.name)

  const handleClick = () => {
    if (file.url) {
      window.open(file.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      className={cn(
        'bg-secondary flex max-w-96 items-center gap-2 rounded-lg px-3 py-2 text-sm',
        file.url && 'hover:bg-secondary/80 cursor-pointer transition-colors',
        className
      )}
      onClick={handleClick}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg">
        {file.url && isImage ? (
          <img
            src={file.url}
            alt={file.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center">
            {FileIconMap[fileExtension] ?? <FileIcon />}
          </div>
        )}
      </div>
      <div className="truncate font-medium">
        {file.name}
        {fileSize && (
          <span className="text-muted-foreground ml-1"> ({fileSize}) </span>
        )}
      </div>
    </div>
  )
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  const kb = Math.round((bytes / 1024) * 10) / 10
  return `${kb} KB`
}

// Helper function to check if file is an image
function isImageFile(fileName: string): boolean {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp']
  return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext))
}

// Helper function to get file extension
function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() ?? ''
}
