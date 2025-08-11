import { ChatEvent } from '../../../widgets'
import { usePart } from '../context.js'
import { EventPartType } from '../types.js'

export interface EventPartProps {
  className?: string
  renderData?: (data: ChatEvent['data']) => React.ReactNode
}

/**
 * Render an event inside a ChatMessage, return null if current part is not event type
 * This component is useful to show an event from the assistant.
 * Normally, it will start with "Loading" status and then change to "Success" with a result
 * @param className - custom styles for the event
 */
export function EventPartUI({ className, renderData }: EventPartProps) {
  const part = usePart(EventPartType)
  if (!part) return null
  return (
    <ChatEvent
      event={part.data}
      className={className}
      renderData={renderData}
    />
  )
}
