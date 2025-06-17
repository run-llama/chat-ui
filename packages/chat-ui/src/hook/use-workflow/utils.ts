import { WorkflowEvent } from './types'

const EVENT_QUALIFIED_NAMES = {
  START: 'llama_index.core.workflow.events.StartEvent',
  STOP: 'llama_index.core.workflow.events.StopEvent',
}

export const isWorkflowEvent = (event: any): event is WorkflowEvent => {
  return (
    event &&
    typeof event === 'object' &&
    '__is_pydantic' in event &&
    'value' in event &&
    'qualified_name' in event &&
    typeof event.qualified_name === 'string'
  )
}

export const isStopEvent = (event: WorkflowEvent): boolean => {
  return event.qualified_name === EVENT_QUALIFIED_NAMES.STOP
}
