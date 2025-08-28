import { cn } from '../../../lib/utils.js'
import {
  Markdown,
  preprocessSourceNodes,
  type MarkdownProps,
} from '../../../widgets/index.js'
import { useChatMessage } from '../../chat-message.context.js'
import { usePart } from '../context.js'
import { SourcesPartType, TextPartType } from '../types.js'
import { getParts } from '../utils.js'

interface ChatMarkdownProps extends React.PropsWithChildren {
  components?: MarkdownProps['components']
  citationComponent?: MarkdownProps['citationComponent']
  className?: string
  languageRenderers?: MarkdownProps['languageRenderers']
}

/**
 * Render TextPart as a Markdown component.
 */
export function MarkdownPartUI(props: ChatMarkdownProps) {
  const { message } = useChatMessage()
  const markdown = usePart(TextPartType)?.text

  const sourceParts = getParts(message, SourcesPartType)
  const sources = sourceParts.map(part => part.data)

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
      components={props.components}
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
