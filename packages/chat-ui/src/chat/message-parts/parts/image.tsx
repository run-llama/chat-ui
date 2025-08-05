import { ImageData, ChatImage } from '../../../widgets'
import { useCurrentPart } from '../context.js'

export interface ImagePartProps {
  className?: string
}

export const ImagePartType = 'data-image' as const

/**
 * Render an ImagePart inside a ChatMessage, return null if current part is not image type
 * @param props.className - custom styles for the image
 */
export function ImagePart({ className }: ImagePartProps) {
  const image = useCurrentPart<ImageData>(ImagePartType)

  if (!image) return null
  return <ChatImage data={image} className={className} />
}
