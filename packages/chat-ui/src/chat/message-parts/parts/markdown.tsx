import { ComponentType } from 'react'
import { cn } from '../../../lib/utils.js'
import {
  CitationComponentProps,
  LanguageRendererProps,
  Markdown,
  preprocessSourceNodes,
  SourceData,
} from '../../../widgets/index.js'
import { useChatMessage } from '../../chat-message.context.js'
import { TextPart } from '../../chat.interface.js'
import { MessagePartType } from '../types.js'
import { useAllParts, usePart } from '../context.js'

interface ChatMarkdownProps extends React.PropsWithChildren {
  citationComponent?: ComponentType<CitationComponentProps>
  className?: string
  languageRenderers?: Record<string, ComponentType<LanguageRendererProps>>
}

/**
 * Render a markdown part as a Markdown component.
 */
export function MarkdownPart(props: ChatMarkdownProps) {
  const { message } = useChatMessage()
  const sources = useAllParts<SourceData>(MessagePartType.SOURCES)

  const nodes = sources
    .map(item => ({
      ...item,
      nodes: item.nodes ? preprocessSourceNodes(item.nodes) : [],
    }))
    .flatMap(item => item.nodes)

  const markdown = usePart<TextPart>(MessagePartType.TEXT)

  if (!markdown) return null
  return (
    <Markdown
      content={markdown.text}
      sources={{ nodes }}
      citationComponent={props.citationComponent}
      languageRenderers={props.languageRenderers}
      className={cn(
        {
          'bg-primary text-primary-foreground ml-auto w-fit max-w-[80%] rounded-xl px-3 py-2':
            message.role === 'user',
        },
        props.className
      )}
    />
  )
}
