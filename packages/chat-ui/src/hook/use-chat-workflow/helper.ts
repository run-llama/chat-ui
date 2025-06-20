import { WorkflowEvent, WorkflowEventType } from '../use-workflow'
import { AgentStreamEvent, UIEvent } from './types'

export function isAgentStreamEvent(
  event: WorkflowEvent
): event is AgentStreamEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    'data' in event &&
    event.type === WorkflowEventType.AgentStream.toString() &&
    typeof event.data === 'object' &&
    event.data !== null &&
    'delta' in event.data
  )
}

export function isUIEvent(event: WorkflowEvent): event is UIEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    'data' in event &&
    typeof event.data === 'object' &&
    event.data !== null &&
    'ui_type' in event.data &&
    typeof event.data.ui_type === 'string'
  )
}
