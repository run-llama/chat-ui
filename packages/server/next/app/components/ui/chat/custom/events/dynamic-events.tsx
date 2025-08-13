'use client'

import { getParts, JSONValue, useChatMessage } from '@llamaindex/chat-ui'
import React, { useState } from 'react'
import { DynamicComponentErrorBoundary } from './error-boundary'
import { ComponentDef } from './types'

type EventComponent = ComponentDef & {
  events: JSONValue[]
}

const DYNAMIC_EVENT_TYPE_PREFIX = 'data-'

type DynamicEventPart = {
  type: `data-${string}`
  data: JSONValue
}

export const DynamicEvents = ({
  componentDefs,
  appendError,
}: {
  componentDefs: ComponentDef[]
  appendError: (error: string) => void
}) => {
  const { message } = useChatMessage()

  const [hasErrors, setHasErrors] = useState(false)

  const handleError = (error: string) => {
    setHasErrors(true)
    appendError(error)
  }

  const components: EventComponent[] = componentDefs
    .map(comp => ({
      ...comp,
      type: `${DYNAMIC_EVENT_TYPE_PREFIX}${comp.type}`, // adding data- prefix to make it a data part
    }))
    .map(comp => {
      const dynamicEventParts = getParts<DynamicEventPart>(message, comp.type)
      if (!dynamicEventParts?.length) return null
      return { ...comp, events: dynamicEventParts.map(part => part.data) }
    })
    .filter(comp => comp !== null)

  if (components.length === 0) return null
  if (hasErrors) return null

  return (
    <div className="components-container">
      {components.map((component, index) => {
        return (
          <React.Fragment key={`${component.type}-${index}`}>
            {renderEventComponent(component, handleError)}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function renderEventComponent(
  component: EventComponent,
  appendError: (error: string) => void
) {
  return (
    <DynamicComponentErrorBoundary
      onError={appendError}
      eventType={component.type}
    >
      {React.createElement(component.comp, { events: component.events })}
    </DynamicComponentErrorBoundary>
  )
}
