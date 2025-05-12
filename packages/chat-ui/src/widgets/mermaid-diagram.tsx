import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
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

    useEffect(() => {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
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
      />
    )
  }
)

MermaidDiagram.displayName = 'MermaidDiagram'

export default MermaidDiagram
