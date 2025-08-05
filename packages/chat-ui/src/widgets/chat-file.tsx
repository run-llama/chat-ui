import { cn } from '../lib/utils'

export type FileData = {
  name: string // e.g. 'cat.png'
  url?: string // e.g. 'https://example.com/cat.png'
  size?: number // in bytes
  mimeType?: string // e.g. 'image/png'
  data?: string // base64 encoded data
}

export function ChatFile({
  file,
  className,
}: {
  file: FileData
  className?: string
}) {
  const isImage = isImageFile(file.mimeType)
  const fileSize = file.size ? formatFileSize(file.size) : null

  if (isImage) {
    // For images: show image preview with filename and size
    const imageUrl = file.url

    return (
      <div className={cn('flex max-w-xs flex-col gap-2', className)}>
        {file.url && (
          <div className="bg-secondary overflow-hidden rounded-lg shadow-md">
            <img
              src={imageUrl}
              alt={file.name}
              className="h-auto max-h-64 w-full object-contain"
            />
          </div>
        )}
        <div className="text-sm">
          <div className="text-muted-foreground truncate">
            {file.name}
            {fileSize && (
              <span className="text-muted-foreground ml-1"> ({fileSize}) </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  // For non-images: show just name with size
  return (
    <div
      className={cn('bg-secondary max-w-60 rounded-lg p-3 text-sm', className)}
    >
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
function isImageFile(mimeType?: string): boolean {
  return mimeType?.startsWith('image/') ?? false
}
