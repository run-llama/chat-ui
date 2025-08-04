import { ImageData, ChatImage } from '../../../widgets/index.js'
import { usePart } from '../context.js'
import { MessagePartType } from '../types.js'

/**
 * Render an image part as a ChatImage component.
 */
export function ImagePart({ className }: { className?: string }) {
  const image = usePart<ImageData>(MessagePartType.IMAGE)
  if (!image) return null
  return <ChatImage data={image} className={className} />
}
