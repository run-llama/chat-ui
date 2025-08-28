'use client'

import { Markdown } from '@llamaindex/chat-ui/widgets'

const sampleMarkdown = `# Custom Markdown Components Example

This example demonstrates how to customize the **Markdown** component using the new \`components\` prop.

## Custom Headings
### This is a custom H3 heading
#### And this is a custom H4 heading

## Custom Paragraphs
This paragraph will be rendered with custom styling. The new components prop allows you to override any markdown element with your own React components.

You can customize:
- **Headings** (h1, h2, h3, h4, h5, h6)
- **Paragraphs** and text formatting
- **Links** and navigation
- **Lists** (both ordered and unordered)
- **Code blocks** and inline code
- **Images** and media
- **Tables** and data display
- **Blockquotes** and emphasis

## Custom Links
Check out this [custom styled link](https://llamaindex.ai) that opens with special behavior.

## Custom Code Examples
Here's some inline \`custom code\` and a code block:

\`\`\`javascript
// This code block uses the default renderer
function defaultRenderer() {
  return "Default code rendering";
}
\`\`\`

\`\`\`mermaid
graph TD
    A[Custom Components] --> B[Better UX]
    A --> C[Consistent Design]
    B --> D[Happy Users]
    C --> D
\`\`\`

## Custom Lists
- First custom list item
- Second custom list item with **bold text**
- Third item with [a link](https://example.com)

1. Numbered custom item
2. Another numbered item
3. Final numbered item

## Custom Blockquotes
> This is a custom blockquote that can have special styling and behavior.
> 
> It can span multiple lines and include **formatting**.

---

*This entire markdown content is rendered with custom components!*

## Custom Language Renderer
This example also shows custom language renderers - notice how the mermaid diagram above gets special treatment!
`

// Custom component implementations
const customComponents = {
  // Custom heading components with special styling
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="mb-4 border-b-2 border-blue-200 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text pb-2 text-4xl font-bold text-transparent">
      🚀 {children}
    </h1>
  ),

  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-3 mt-6 flex items-center gap-2 text-3xl font-semibold text-blue-700">
      <span className="h-6 w-2 rounded bg-blue-500" />
      {children}
    </h2>
  ),

  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="mb-3 mt-5 flex items-center gap-2 text-2xl font-medium text-purple-600">
      <span className="h-5 w-1.5 rounded bg-purple-400" />
      {children}
    </h3>
  ),

  h4: ({ children }: { children: React.ReactNode }) => (
    <h4 className="mb-2 mt-4 flex items-center gap-2 text-xl font-medium text-green-600">
      <span className="h-4 w-1 rounded bg-green-400" />
      {children}
    </h4>
  ),

  // Custom paragraph with special styling
  p: ({ children }: { children: React.ReactNode }) => (
    <div className="mb-4 rounded-lg border-l-4 border-blue-200 bg-gray-50 p-4 leading-relaxed text-gray-700 dark:border-blue-700 dark:bg-gray-800/50 dark:text-gray-300">
      {children}
    </div>
  ),

  // Custom link component with hover effects
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded px-1 py-0.5 font-medium text-blue-600 underline decoration-blue-300 decoration-2 transition-all duration-200 hover:bg-blue-50 hover:text-blue-800 hover:decoration-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
      onClick={() => {
        console.log('Custom link clicked:', href)
      }}
    >
      {children}
      <span className="text-xs">🔗</span>
    </a>
  ),

  // Custom list components
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="mb-4 space-y-2 rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-4 dark:border-green-700 dark:from-green-900/10 dark:to-blue-900/10">
      {children}
    </ul>
  ),

  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="mb-4 space-y-2 rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4 dark:border-purple-700 dark:from-purple-900/10 dark:to-pink-900/10">
      {children}
    </ol>
  ),

  li: ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-2">
      <span className="mt-1 font-bold text-blue-500">→</span>
      <span className="text-gray-700 dark:text-gray-300">{children}</span>
    </li>
  ),

  // Custom blockquote
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="mb-4 rounded-r-lg border-l-4 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 italic dark:from-yellow-900/10 dark:to-orange-900/10">
      <div className="flex items-start gap-3">
        <span className="text-2xl text-yellow-500">💡</span>
        <div className="text-gray-700 dark:text-gray-300">{children}</div>
      </div>
    </blockquote>
  ),

  // Custom code block (inline)
  code: ({
    inline,
    children,
  }: {
    inline?: boolean
    children: React.ReactNode
  }) => {
    if (inline) {
      return (
        <code className="rounded border border-purple-200 bg-purple-100 px-2 py-1 font-mono text-sm text-purple-800 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
          {children}
        </code>
      )
    }
    // For block code, let the default handler take over
    return <code>{children}</code>
  },

  // Custom horizontal rule
  hr: () => (
    <div className="my-8 flex items-center gap-4">
      <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
      <span className="text-xl text-blue-500">✨</span>
      <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
    </div>
  ),

  // Custom strong/bold text
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="rounded bg-blue-50 px-1 py-0.5 font-bold text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
      {children}
    </strong>
  ),

  // Custom emphasis/italic text
  em: ({ children }: { children: React.ReactNode }) => (
    <em className="rounded bg-purple-50 px-1 py-0.5 italic text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
      {children}
    </em>
  ),
}

export default function CustomMarkdownPage() {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <Markdown content={sampleMarkdown} components={customComponents} />
      </div>
    </div>
  )
}
