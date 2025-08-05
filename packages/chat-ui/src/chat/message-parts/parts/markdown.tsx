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
import { TextPartType } from '../../chat.interface.js'
import { extractAllPartData, usePartData } from '../context.js'
import { SourcesPartType } from './sources.js'

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
  const markdown = usePartData<string>(TextPartType)

  const sources = extractAllPartData<SourceData>(message, SourcesPartType)

  const nodes =
    sources
      ?.map(item => ({
        ...item,
        nodes: item.nodes ? preprocessSourceNodes(item.nodes) : [],
      }))
      .flatMap(item => item.nodes) ?? []

  if (!markdown) return null

  return (
    <Markdown
      content={markdown}
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
