import { Message } from '../chat.interface'
import { remark } from 'remark'
import remarkParse from 'remark-parse'
import { visit } from 'unist-util-visit'
import { z } from 'zod'

export const INLINE_ANNOTATION_KEY = 'annotation'

export const AnnotationSchema = z.object({ type: z.string(), data: z.any() })

// parse Markdown and extract code blocks
export function parseMarkdownCodeBlocks(markdown: string) {
  const markdownCodeBlocks: {
    language: string | null
    code: string
  }[] = []

  // Parse Markdown to AST using remark
  const processor = remark().use(remarkParse)
  const ast = processor.parse(markdown)

  // Visit all code nodes in the AST
  visit(ast, 'code', (node: any) => {
    markdownCodeBlocks.push({
      language: node.lang || null, // Language is stored in node.lang
      code: node.value, // Code content is stored in node.value
    })
  })

  return markdownCodeBlocks
}

// extract all inline annotations from markdown
export function extractInlineAnnotations(
  markdown: string
): z.infer<typeof AnnotationSchema>[] {
  const codeBlocks = parseMarkdownCodeBlocks(markdown)
  const inlineAnnotations = codeBlocks
    .filter(block => block.language === INLINE_ANNOTATION_KEY)
    .map(block => JSON.parse(block.code))

  return inlineAnnotations.filter(a => AnnotationSchema.safeParse(a).success)
}

export type MessageAnnotation<T = unknown> = {
  type: string
  data: T
}

/**
 * Gets annotation data directly from a message by type
 * @param message - The message to extract annotations from
 * @param type - The annotation type to filter by (can be standard or custom)
 * @returns Array of data from annotations of the specified type, or null if none found
 */

export function getAnnotationData<T = unknown>(
  message: Message,
  type: string
): T[] {
  const annotations = message.annotations
  if (!annotations) return []

  const matchingAnnotations = annotations
    .filter(
      a =>
        a &&
        typeof a === 'object' &&
        a !== null &&
        'type' in a &&
        a.type === type &&
        'data' in a
    )
    .map(a => (a as { data: T }).data)

  return matchingAnnotations
}
