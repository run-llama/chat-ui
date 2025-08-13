import { workflowEvent } from '@llamaindex/workflow'

export const EVENT_PART_TYPE = `data-event` as const

export type EventData = {
  title: string
  description?: string
  status: 'pending' | 'success' | 'error'
  data?: any
}

export type EventPart = {
  id?: string
  type: typeof EVENT_PART_TYPE
  data: EventData
}

export const runEvent = workflowEvent<EventPart>()
