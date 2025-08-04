import { ChatEvents, EventData } from '../../../widgets/index.js'
import { useChatMessage } from '../../chat-message.context.js'
import { useAllParts } from '../context.js'
import { MessagePartType } from '../types.js'

/**
 * Aggregates all `events` parts for a message and renders them as a ChatEvents component.
 */
export function EventsPart() {
  const events = useAllParts<EventData>(MessagePartType.EVENTS)
  const { isLast, isLoading } = useChatMessage()
  const showLoading = (isLast && isLoading) ?? false

  if (events.length === 0) return null
  return <ChatEvents data={events} showLoading={showLoading} />
}
