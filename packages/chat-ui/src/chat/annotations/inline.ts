import { remark } from 'remark'
import remarkParse from 'remark-parse'
import { visit } from 'unist-util-visit'
import { Message } from '../chat.interface'
import { isMessageAnnotation, MessageAnnotation } from './types'

const INLINE_ANNOTATION_KEY = 'annotation'

// parse Markdown and extract code blocks
function parseMarkdownCodeBlocks(markdown: string) {
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
export function getInlineAnnotations(message: Message): unknown[] {
  const codeBlocks = parseMarkdownCodeBlocks(message.content)
  return codeBlocks
    .filter(block => block.language === INLINE_ANNOTATION_KEY)
    .map(block => tryParse(block.code))
    .filter(Boolean) // filter out null values
}

// convert annotation to inline markdown
export function toInlineAnnotation(annotation: MessageAnnotation) {
  return `\`\`\`${INLINE_ANNOTATION_KEY}\n${JSON.stringify(annotation)}\n\`\`\``
}

/**
 * Parses and validates an inline annotation from a code block
 * @param language - The language identifier from the markdown code block
 * @param codeValue - The raw code content from a markdown code block
 * @returns The parsed annotation if valid, null if not an annotation or invalid
 */
export function parseInlineAnnotation(
  language: string,
  codeValue: string
): MessageAnnotation | null {
  // Check if this is an inline annotation code block
  if (language !== INLINE_ANNOTATION_KEY) {
    return null
  }

  try {
    const annotation = tryParse(codeValue)

    if (annotation === null || !isMessageAnnotation(annotation)) {
      console.warn(
        `Invalid inline annotation: ${codeValue}, expected an object`
      )
      return null
    }

    return annotation
  } catch (error) {
    console.warn(`Failed to parse inline annotation: ${codeValue}`, error)
    return null
  }
}

// try to parse the code value as a JSON object and return null if it fails
function tryParse(codeValue: string) {
  try {
    return JSON.parse(codeValue)
  } catch (error) {
    return null
  }
}
