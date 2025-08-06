import {
  type WorkflowEvent,
  type WorkflowEventData,
  workflowEvent,
} from '@llamaindex/workflow'
import type { JSONValue } from 'llamaindex'

export const HUMAN_RESPONSE_PART_TYPE = 'data-human_response' as const

export type HumanInputEventData = {
  type: string
  data?: JSONValue
  response: WorkflowEvent<HumanResponseEventData>
}

export const humanInputEvent = workflowBaseEvent<HumanInputEventData>()

export type HumanResponseEventData = {
  type: typeof HUMAN_RESPONSE_PART_TYPE
  data: JSONValue
}

export type HumanResponsePart = HumanResponseEventData & {
  id?: string
}

export const humanResponseEvent = workflowBaseEvent<HumanResponseEventData>()

// TODO: move to llama-flow package
export type BaseEvent<K> = (<T extends K>() => WorkflowEvent<T>) &
  WorkflowEvent<K>

export function workflowBaseEvent<K = unknown>(): BaseEvent<K> {
  const baseEvent = workflowEvent<K>()
  const derivedEvents = new Set<WorkflowEvent<unknown>>()

  function eventFn<T>(): WorkflowEvent<T> {
    const event = workflowEvent<T>()
    derivedEvents.add(event)
    return event
  }

  const originalInclude = baseEvent.include
  const enhancedBaseEvent = Object.assign(baseEvent, {
    include: (
      instance: WorkflowEventData<unknown>
    ): instance is WorkflowEventData<void> => {
      // Base event accepts its own instances OR instances from any derived events
      return (
        originalInclude(instance) ||
        Array.from(derivedEvents).some(e => e.include(instance))
      )
    },
  })

  return Object.assign(eventFn, enhancedBaseEvent) as typeof eventFn &
    typeof baseEvent
}
