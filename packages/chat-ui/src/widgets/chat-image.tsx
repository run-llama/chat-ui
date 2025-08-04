import { cn } from '../lib/utils'

export type ImageData = {
  url: string
}

export function ChatImage({
  data,
  className,
}: {
  data: ImageData
  className?: string
}) {
  return (
    <div className={cn('max-w-[200px] rounded-md shadow-md', className)}>
      <img src={data.url} alt="chat_image" className="h-auto w-full" />
    </div>
  )
}
