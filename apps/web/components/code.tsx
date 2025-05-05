import hljs from 'highlight.js'
import { useEffect, useRef } from 'react'
import { useCopyToClipboard } from '@/app/use-copy-to-clipboard'

export function Code({
  content,
  language,
}: {
  content: string
  language: string
}) {
  const codeRef = useRef<HTMLElement>(null)
  const { copyToClipboard, isCopied } = useCopyToClipboard({
    timeout: 2000,
  })

  useEffect(() => {
    if (codeRef.current && codeRef.current.dataset.highlighted !== 'yes') {
      hljs.highlightElement(codeRef.current)
    }
  }, [language, content])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          copyToClipboard(content)
        }}
        className="absolute right-2 top-2 rounded-md bg-zinc-700 px-3 py-1 text-sm text-white hover:bg-zinc-600"
      >
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
      <pre className="overflow-hidden rounded-lg border border-zinc-700 shadow-lg">
        <code
          className={`language-${language} block p-4 font-mono`}
          ref={codeRef}
        >
          {content}
        </code>
      </pre>
    </div>
  )
}
