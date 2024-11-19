import hljs from 'highlight.js'
import { useEffect, useRef } from 'react'
import 'highlight.js/styles/atom-one-dark-reasonable.css'

export function Code({
  content,
  language,
}: {
  content: string
  language: string
}) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current && codeRef.current.dataset.highlighted !== 'yes') {
      hljs.highlightElement(codeRef.current)
    }
  }, [language, content])

  return (
    <pre className="border border-zinc-700">
      <code className={`language-${language} font-mono`} ref={codeRef}>
        {content}
      </code>
    </pre>
  )
}
