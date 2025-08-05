import { ComponentType } from 'react'
import { MessagePart } from '../chat.interface'
import { EventsPart, EventsPartProps } from './parts/events'
import { ImagePart, ImagePartProps } from './parts/image'

export interface IMessagePartUI<P = any> {
  type: 'text' | `data-${string}`
  props?: P
  component: ComponentType<P>
  position?: 'auto' | 'top' | 'bottom'
  group?: boolean
}

export type MessagePartFactory<P = any> = (props?: P) => IMessagePartUI<P>

export const image: MessagePartFactory<ImagePartProps> = props => {
  return {
    type: 'data-image',
    props,
    component: ImagePart,
  }
}

export const events: MessagePartFactory<EventsPartProps> = props => {
  return {
    group: true,
    type: 'data-events',
    props,
    component: EventsPart,
  }
}

export const configs: IMessagePartUI[] = [image(), events()]

const map = Object.fromEntries(configs.map(config => [config.type, config]))

// eg: [text, event 1, image, event 2, text 2] and events is grouped
// -> [[text 1], [event 1, event 2], [image], [text 2]]
function groupParts(parts: MessagePart[]): MessagePart[][] {
  const groups: MessagePart[][] = []
  const existedGroupTypes = new Set<string>()

  for (const part of parts) {
    const type = part.type

    if (map[type]?.group) {
      if (!existedGroupTypes.has(type)) {
        // if the type is grouped, we need to push the all parts by type
        const partsByType = parts.filter(p => p.type === type)
        groups.push(partsByType)
        existedGroupTypes.add(type)
      }
    } else {
      // if the type is not grouped, just add 1 part
      groups.push([part])
    }
  }

  return groups
}

const classNameMap: Record<string, string> = {
  top: 'order-first',
  bottom: 'order-last',
}

export function render(parts: MessagePart[]): React.ReactNode[] {
  const supportedParts = parts.filter(part => map[part.type])
  const groupedParts = groupParts(supportedParts)

  return groupedParts.map((group, index) => {
    if (group.length === 1) {
      const part = group[0]
      const config = map[part.type]
      if (!config) return null

      const { position, props, component: Component } = config
      const className = position ? classNameMap[position] : undefined

      return (
        <Component key={index} {...props} className={className} part={part} />
      )
    } else {
      // Multiple parts of the same type, render as a group
      const partType = group[0].type
      const config = map[partType]
      if (!config) return null

      const { position, props, component: Component } = config
      const className = position ? classNameMap[position] : undefined

      return (
        <Component key={index} {...props} className={className} parts={group} />
      )
    }
  })
}
