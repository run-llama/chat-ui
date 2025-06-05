import { ComponentType } from 'react'
import ChatCanvas from './canvas/index.js'

export const defaultAnnotationRenderers: Record<
  string,
  ComponentType<{ data: any }>
> = {
  artifact: ChatCanvas.Artifact,
}
