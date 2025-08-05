import { usePartData } from '../context.js'
import { AgentEventData, ChatAgentEvents } from '../../../widgets/index.js'
import { useChatMessage } from '../../chat-message.context.js'

export const AgentEventsPartType = 'data-agent-events' as const

/**
 * Render a list of agent events inside a ChatMessage, return null if current part is not agent events type
 * @param props.className - custom styles for the agent events
 */
export function AgentEventsPart({ className }: { className?: string }) {
  const agentEvents = usePartData<AgentEventData[]>(AgentEventsPartType)

  // TODO: this status should be from backend
  const { isLast, textParts } = useChatMessage()

  if (!agentEvents) return null

  return (
    <ChatAgentEvents
      data={agentEvents}
      isFinished={textParts.length > 0}
      isLast={isLast}
      className={className}
    />
  )
}
