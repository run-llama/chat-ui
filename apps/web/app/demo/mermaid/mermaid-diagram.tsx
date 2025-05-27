import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Copy, Download, FileDown } from 'lucide-react'
import { useCopyToClipboard } from '@/app/use-copy-to-clipboard'
import { cn } from '@/lib/utils'
import mermaid from 'mermaid'
import { LanguageRendererProps } from '@llamaindex/chat-ui/widgets'

// Using the shared LanguageRendererProps interface

const MermaidDiagram: React.FC<LanguageRendererProps> = ({
  code,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'strict',
      suppressErrorRendering: true,
    })
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (!isInitialized) return
    setError(null)

    if (containerRef.current) {
      containerRef.current.innerHTML = ''
      mermaid
        .render(`mermaid-${Math.random().toString(36).substring(7)}`, code)
        .then(({ svg }: { svg: string }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg
            svgRef.current = svg
          }
        })
        .catch((err: Error) => {
          setError(err.message || 'Failed to render Mermaid diagram.')
        })
    }
  }, [code, isInitialized])

  // Download SVG
  const downloadMermaidSVG = () => {
    if (typeof window === 'undefined') return
    const svg = svgRef.current
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const fileName = window.prompt(
      'Enter SVG file name',
      `diagram-${Math.random().toString(36).substring(7)}.svg`
    )
    if (!fileName) return
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = fileName
    link.href = url
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Download code as .mmd
  const downloadAsFile = () => {
    if (typeof window === 'undefined') return
    const fileName = window.prompt(
      'Enter file name',
      `diagram-${Math.random().toString(36).substring(7)}.mmd`
    )
    if (!fileName) return
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = fileName
    link.href = url
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(code)
  }

  return (
    <div
      className={cn(
        'codeblock border-border relative w-full rounded-lg border bg-[#fafafa] py-2',
        className
      )}
    >
      {/* Header with language, download, copy */}
      <div className="flex w-full items-center justify-between px-4">
        <span className="text-xs lowercase">mermaid</span>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            onClick={downloadMermaidSVG}
            size="icon"
            className="size-8"
          >
            <FileDown className="size-4" />
            <span className="sr-only">Download SVG</span>
          </Button>
          <Button
            variant="ghost"
            onClick={downloadAsFile}
            size="icon"
            className="size-8"
          >
            <Download className="size-4" />
            <span className="sr-only">Download</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCopy}
            className="size-8"
          >
            {isCopied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
      </div>
      {/* Diagram or error */}
      <div
        ref={containerRef}
        className="flex justify-center p-4"
        style={{ minHeight: '2.5rem' }}
      >
        {error && (
          <div
            style={{
              color: 'red',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
            }}
            className="rounded border border-red-200 bg-red-50 p-2 text-xs"
          >
            Mermaid render error: {error}
          </div>
        )}
      </div>
    </div>
  )
}

MermaidDiagram.displayName = 'MermaidDiagram'

export default MermaidDiagram
