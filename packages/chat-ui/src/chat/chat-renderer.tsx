import { LanguageRendererProps } from '../widgets/index.js' // this import needs the file extension as it's importing the widget bundle
import { AnyAnnotation, Artifact } from './annotation'
import { ArtifactCard } from './canvas/card.js'

export const INLINE_ANNOTATION_KEY = 'inline_annotation'

// the default renderer for pre-defined chat-ui annotations
export const InlineAnnotationRenderer: React.FC<LanguageRendererProps> = ({
  code,
}) => {
  const annotationValue = JSON.parse(code) as AnyAnnotation

  if (annotationValue.type === 'artifact') {
    // TODO: can use zod to make sure the artifact is valid
    return <ArtifactCard artifact={annotationValue.data as Artifact} />
  }

  // TODO: add other annotation types here

  return null
}

// the default renderer for markdown component
export const InlineMarkdownRenderer: Record<
  string,
  React.FC<LanguageRendererProps>
> = {
  [INLINE_ANNOTATION_KEY]: InlineAnnotationRenderer,
}
