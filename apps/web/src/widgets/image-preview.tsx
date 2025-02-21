import { XCircleIcon } from 'lucide-react'
import { cn } from '../lib/utils'

export function ImagePreview({
  url,
  onRemove,
}: {
  url: string
  onRemove: () => void
}) {
  return (
    <div className="group relative h-20 w-20">
      <img
        src={url}
        alt="uploaded_image"
        className="h-full w-full rounded-xl object-cover hover:brightness-75"
      />
      <div
        className={cn(
          'absolute -right-2 -top-2 z-10 hidden h-6 w-6 rounded-full bg-gray-500 text-white group-hover:block'
        )}
      >
        <XCircleIcon
          className="h-6 w-6 rounded-full bg-gray-500 text-white"
          onClick={onRemove}
        />
      </div>
    </div>
  )
}
