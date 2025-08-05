import { ImageData, ChatImage } from '../../../widgets'
import { usePart } from '../context.js'

export interface ImagePartProps {
  className?: string
}

export const ImagePartType = 'data-image' as const

/**
 * Render an image part as a ChatImage component.
 * @param props.className - custom styles for the image
 */
export function ImagePart({ className }: ImagePartProps) {
  const image = usePart<ImageData>(ImagePartType)

  if (!image) return null
  return <ChatImage data={image} className={className} />
}
