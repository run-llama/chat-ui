import { FileIcon } from 'lucide-react'
import { cn } from '../lib/utils'
import { DocxIcon } from '../ui/icons/docx'
import { PDFIcon } from '../ui/icons/pdf'
import { SheetIcon } from '../ui/icons/sheet'
import { TxtIcon } from '../ui/icons/txt'

export type FileData = {
  filename: string
  mediaType: string // https://www.iana.org/assignments/media-types/media-types.xhtml
  url: string // can be a URL to a hosted file or a [Data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs).
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
  const isImage = isImageFile(file)
  const fileExtension = getFileExtension(file.filename)

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
            alt="image"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center">
            {FileIconMap[fileExtension] ?? <FileIcon />}
          </div>
        )}
      </div>
      <div className="truncate font-medium">{file.filename}</div>
    </div>
  )
}

// Helper function to check if file is an image
function isImageFile(file: FileData): boolean {
  return file.mediaType.startsWith('image/')
}

// Helper function to get file extension
function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() ?? ''
}
