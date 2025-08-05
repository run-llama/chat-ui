import { ChatEvents, EventData } from '../../../widgets'
import { useChatMessage } from '../../chat-message.context.js'
import { usePart } from '../context.js'

export interface EventsPartProps {
  className?: string
}

export const EventsPartType = 'data-events' as const

/**
 * Render a list of events as a ChatEvents component.
 * @param props.className - custom styles for the events
 */
export function EventsPart({ className }: EventsPartProps) {
  const events = usePart<EventData[]>(EventsPartType)

  // TODO: this loading should be from backend
  const { isLast, isLoading } = useChatMessage()
  const showLoading = (isLast && isLoading) ?? false

  if (!events) return null

  return (
    <ChatEvents data={events} showLoading={showLoading} className={className} />
  )
}
