import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react'
import mermaid from 'mermaid'

export interface MermaidDiagramHandle {
  getSVG: () => string
}

interface MermaidDiagramProps {
  code: string
  className?: string
}

const MermaidDiagram = forwardRef<MermaidDiagramHandle, MermaidDiagramProps>(
  ({ code, className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<string>('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
      setError(null)
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'strict',
        suppressErrorRendering: true,
      })
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
        mermaid
          .render(`mermaid-${Math.random().toString(36).substring(7)}`, code)
          .then(({ svg }) => {
            if (containerRef.current) {
              containerRef.current.innerHTML = svg
              svgRef.current = svg
            }
          })
          .catch((err: Error) => {
            setError(err.message || 'Failed to render Mermaid diagram.')
          })
      }
    }, [code])

    useImperativeHandle(
      ref,
      () => ({
        getSVG: () => svgRef.current,
      }),
      []
    )

    return (
      <div
        ref={containerRef}
        className={className || 'flex justify-center p-4'}
        style={{ minHeight: '2.5rem' }}
      >
        {error && (
          <div
            style={{ color: 'red', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}
            className="p-2 text-xs bg-red-50 border border-red-200 rounded"
          >
            Mermaid render error: {error}
          </div>
        )}
      </div>
    )
  }
)

MermaidDiagram.displayName = 'MermaidDiagram'

export default MermaidDiagram
