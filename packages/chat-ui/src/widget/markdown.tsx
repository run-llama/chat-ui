import 'katex/dist/katex.min.css'
import { FC, memo } from 'react'
import ReactMarkdown, { Options } from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { CodeBlock } from './codeblock'

const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
)

const preprocessLaTeX = (content: string) => {
  // Replace block-level LaTeX delimiters \[ \] with $$ $$
  const blockProcessedContent = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, equation) => `$$${equation}$$`
  )
  // Replace inline LaTeX delimiters \( \) with $ $
  const inlineProcessedContent = blockProcessedContent.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, equation) => `$${equation}$`
  )
  return inlineProcessedContent
}

const preprocessContent = (
  content: string,
  transformers?: ((content: string) => string)[]
) => {
  let processedContent = preprocessLaTeX(content)
  for (const transformer of transformers || []) {
    processedContent = transformer(processedContent)
  }
  return processedContent
}

export function Markdown({
  content,
  transformers = [],
  components = {},
}: {
  content: string
  transformers?: ((content: string) => string)[]
  components?: Options['components']
}) {
  const processedContent = preprocessContent(content, transformers)

  return (
    <div>
      <style>{`
        .custom-markdown ul {
          list-style-type: disc;
          margin-left: 20px;
          margin-top: 20px;
          margin-bottom: 20px;
        }

        .custom-markdown ol {
          list-style-type: decimal;
          margin-left: 20px;
          margin-top: 20px;
          margin-bottom: 20px;
        }

        .custom-markdown li {
          margin-bottom: 5px;
        }

        .custom-markdown ol ol {
          list-style: lower-alpha;
        }

        .custom-markdown ul ul,
        .custom-markdown ol ol {
          margin-left: 20px;
        }

        .custom-markdown img {
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          margin: 10px 0;
        }

        .custom-markdown a {
          text-decoration: underline;
          color: #007bff;
        }

        .custom-markdown h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-weight: bold;
          margin-bottom: 20px;
          margin-top: 20px;
        }

        .custom-markdown h6 {
          font-size: 16px;
        }

        .custom-markdown h5 {
          font-size: 18px;
        }

        .custom-markdown h4 {
          font-size: 20px;
        }

        .custom-markdown h3 {
          font-size: 22px;
        }

        .custom-markdown h2 {
          font-size: 24px;
        }

        .custom-markdown h1 {
          font-size: 26px;
        }

        .custom-markdown hr {
          border: 0;
          border-top: 1px solid #e1e4e8;
          margin: 20px 0;
        }
      `}</style>
      <MemoizedReactMarkdown
        className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 custom-markdown break-words"
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex as any]}
        components={{
          p({ children }) {
            return <div className="mb-2 last:mb-0">{children}</div>
          },
          code({ node, inline, className, children, ...props }) {
            if (children.length) {
              if (children[0] == '▍') {
                return (
                  <span className="mt-1 animate-pulse cursor-default">▍</span>
                )
              }

              children[0] = (children[0] as string).replace('`▍`', '▍')
            }

            const match = /language-(\w+)/.exec(className || '')

            if (inline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }

            return (
              <CodeBlock
                key={Math.random()}
                language={(match && match[1]) || ''}
                value={String(children).replace(/\n$/, '')}
                className="mb-2"
                {...props}
              />
            )
          },
          ...components,
        }}
      >
        {processedContent}
      </MemoizedReactMarkdown>
    </div>
  )
}
