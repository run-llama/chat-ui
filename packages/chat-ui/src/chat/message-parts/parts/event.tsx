import { ChatEvent } from '../../../widgets'
import { usePartData } from '../context.js'

export interface EventPartProps {
  className?: string
  renderData?: (data: ChatEvent['data']) => React.ReactNode
}

export const EventPartType = 'data-event' as const

/**
 * Render an event inside a ChatMessage, return null if current part is not event type
 * This component is useful to show an event from the assistant.
 * Normally, it will start with "Loading" status and then change to "Success" with a result
 * @param props.className - custom styles for the event
 */
export function EventPart({ className, renderData }: EventPartProps) {
  const event = usePartData<ChatEvent>(EventPartType)
  if (!event) return null
  return (
    <ChatEvent event={event} className={className} renderData={renderData} />
  )
}
