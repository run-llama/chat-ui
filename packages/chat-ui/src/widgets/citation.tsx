import { SourceNode } from '../chat/annotation'
import { SourceNumberButton } from './source-number-button'

export interface CitationComponentProps {
  index: number
  node: SourceNode
}

export function Citation({ index }: CitationComponentProps) {
  return <SourceNumberButton index={index} />
}
