import {
  Artifact,
  MessageAnnotation,
  MessageAnnotationType,
} from './annotation'
import { ArtifactCard } from './canvas/card.js'

export const INLINE_ANNOTATION_KEY = 'inline_annotation' // the language key to detect inline annotation code in markdown

export interface AnnotationRendererProps {
  annotation: MessageAnnotation
}

// the default renderer for pre-defined chat-ui annotations
export const InlineAnnotationRenderer: React.FC<AnnotationRendererProps> = ({
  annotation,
}) => {
  if (annotation.type === MessageAnnotationType.ARTIFACT) {
    // TODO: can use zod to make sure the artifact is valid
    return (
      <div className="my-2">
        <ArtifactCard artifact={annotation.data as Artifact} />
      </div>
    )
  }

  // TODO: add other annotation types here

  return null
}
