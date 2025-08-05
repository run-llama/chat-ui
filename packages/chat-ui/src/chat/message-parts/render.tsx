import { ComponentType } from 'react'
import { MessagePart } from '../chat.interface'
import { EventsPart, EventsPartProps } from './parts/events'
import { ImagePart, ImagePartProps } from './parts/image'

/**
 * Configuration for rendering a part inside a message
 * @param type - The type of the part, can be `text` or `data-${string}`
 * @param component - The React component to render the part
 * @param props - The initial props of the part, will be passed to the component when rendering
 * @param position - The position of the part, can be `auto`, `top` or `bottom` (default: `auto` which means default position of the part)
 * @param group - Whether the part is grouped, if true, the part will be grouped with other parts of the same type
 */
export interface PartUI<P = any> {
  type: 'text' | `data-${string}`
  props?: P
  component: ComponentType<P>
  position?: 'auto' | 'top' | 'bottom'
  group?: boolean
}

export type PartFactory<P = any> = (props?: P) => PartUI<P>

export const image: PartFactory<ImagePartProps> = props => {
  return {
    type: 'data-image',
    props,
    component: ImagePart,
  }
}

export const events: PartFactory<EventsPartProps> = props => {
  return {
    group: true,
    type: 'data-events',
    props,
    component: EventsPart,
  }
}

export const configs: PartUI[] = [image(), events()]

const map = Object.fromEntries(configs.map(config => [config.type, config]))

const classNameMap: Record<string, string> = {
  top: 'order-first', // tailwind class to make the part at the top in flexbox
  bottom: 'order-last', // tailwind class to make the part at the bottom in flexbox
}

export function renderParts(parts: MessagePart[]): React.ReactNode[] {
  const supportedParts = parts.filter(part => map[part.type])
  const groupedParts = groupParts(supportedParts)

  return groupedParts.map((group, index) => {
    if (group.length === 1) {
      // Single part, render as a component with part prop
      // Eg: <TextPart part={part} />
      const part = group[0]
      const config = map[part.type]
      if (!config) return null // not supported part, skip

      const { position, props, component: Component } = config

      const componentProps = {
        ...props,
        className: position ? classNameMap[position] : undefined,
        part, // passing `part` for a single part
      }

      return <Component key={index} {...componentProps} />
    } else {
      // Multiple parts of the same type, render as a component with parts prop
      // Eg: <SourcesPart parts={parts} />
      const partType = group[0].type
      const config = map[partType]
      if (!config) return null // not supported part, skip

      const { position, props, component: Component } = config

      const componentProps = {
        ...props,
        className: position ? classNameMap[position] : undefined,
        parts: group, // passing `parts` for multiple parts
      }

      return <Component key={index} {...componentProps} />
    }
  })
}

// Group parts by type, if the type is marked as grouped
// This is useful for parts that need to be grouped together, like sources
// Input: [text 1, source 1, image 1, source 2, text 2], sources is marked as grouped
// Output: [[text 1], [source 1, source 2], [image 1], [text 2]]
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
