import { ChatEvent } from '../../../widgets'
import { usePartData } from '../context.js'

export interface EventPartProps {
  className?: string
}

export const EventPartType = 'data-event' as const

/**
 * Render an event inside a ChatMessage, return null if current part is not event type
 * @param props.className - custom styles for the event
 */
export function EventPart({ className }: EventPartProps) {
  const event = usePartData<ChatEvent>(EventPartType)
  if (!event) return null
  return <ChatEvent event={event} className={className} />
}
