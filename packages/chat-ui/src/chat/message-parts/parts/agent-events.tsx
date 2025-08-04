import { useAllParts } from '../context.js'
import { MessagePartType } from '../types.js'
import { AgentEventData, ChatAgentEvents } from '../../../widgets/index.js'
import { useChatMessage } from '../../chat-message.context.js'

/**
 * Aggregates all `agent` parts for a message and renders them as a ChatAgentEvents component.
 */
export function AgentEventsPart({ className }: { className?: string }) {
  const agentEvents = useAllParts<AgentEventData>(MessagePartType.AGENT_EVENTS)
  const { isLast, textParts } = useChatMessage()

  if (agentEvents.length === 0) return null
  return (
    <ChatAgentEvents
      data={agentEvents}
      isFinished={textParts.length > 0}
      isLast={isLast}
      className={className}
    />
  )
}
