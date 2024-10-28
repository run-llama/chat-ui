import { File } from 'lucide-react'
import { cn } from '../lib/utils'

export function ImageFile({
  url,
  className,
}: {
  url: string
  className?: string
}) {
  return (
    <img
      alt="uploaded_image"
      src={url}
      className={cn(
        'h-20 w-20 rounded-xl object-cover hover:brightness-75',
        className
      )}
    />
  )
}

export function DocumentFile({
  name,
  extension,
  size,
  className,
}: {
  name: string
  extension: string
  size?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        'bg-secondary flex w-60 max-w-60 flex-row items-center gap-2 rounded-lg p-2 text-sm',
        className
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
        {/* TODO: Add document icons here */}
        <File className="h-4 w-4" />
      </div>
      <div className="overflow-hidden">
        <div className="truncate font-semibold">
          {name} {size ? `(${inKB(size)} KB)` : ''}
        </div>
        {extension && (
          <div className="text-token-text-tertiary flex items-center gap-2 truncate">
            <span>{extension.toUpperCase()} File</span>
          </div>
        )}
      </div>
    </div>
  )
}

export function inKB(size: number) {
  return Math.round((size / 1024) * 10) / 10
}
