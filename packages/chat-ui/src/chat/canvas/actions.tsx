'use client'

import { Check, Copy, Download, History, X } from 'lucide-react'
import { useState } from 'react'
import { useCopyToClipboard } from '../../hook/use-copy-to-clipboard'
import { cn } from '../../lib/utils'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import { useChatCanvas } from './context'
import {
  Artifact,
  DocumentArtifact,
  CodeArtifact,
  isEqualArtifact,
} from './artifacts'

interface ChatCanvasActionsProps {
  children?: React.ReactNode
  className?: string
}

function ChatCanvasActions(props: ChatCanvasActionsProps) {
  const children = props.children ?? (
    <>
      <ArtifactVersionHistory />
      <ArtifactContentCopy />
      <ArtifactDownloadButton />
      <CanvasCloseButton />
    </>
  )

  return (
    <div className={cn('flex items-center gap-1', props.className)}>
      {children}
    </div>
  )
}

function ArtifactVersionHistory() {
  const {
    getArtifactsByType,
    openArtifactInCanvas,
    displayedArtifact,
    getArtifactVersion,
    restoreArtifact,
  } = useChatCanvas()

  const [isOpen, setIsOpen] = useState(false)

  if (!displayedArtifact) return null

  const allArtifactsByCurrentType = getArtifactsByType(displayedArtifact.type)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="h-8 cursor-pointer rounded-full text-xs"
        >
          <History className="mr-1 size-4" />
          Version {getArtifactVersion(displayedArtifact).versionNumber}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0 text-xs" align="end">
        <h4 className="border-b p-2 px-3 font-semibold">Version History</h4>
        <div className="max-h-80 overflow-y-auto">
          {allArtifactsByCurrentType.map((artifact, index) => {
            const isCurrent = isEqualArtifact(artifact, displayedArtifact)
            const { versionNumber, isLatest } = getArtifactVersion(artifact)
            return (
              <div
                key={index}
                className="text-muted-foreground flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-100"
                onClick={() => {
                  openArtifactInCanvas(artifact)
                  setIsOpen(false)
                }}
              >
                <span className={cn(isCurrent && 'text-blue-500')}>
                  Version {versionNumber}
                </span>
                {isLatest ? (
                  <Badge className="h-6 w-[70px] justify-center bg-blue-500 text-center hover:bg-blue-600">
                    Latest
                  </Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-[70px] shrink-0 cursor-pointer rounded-full text-xs"
                    onClick={e => {
                      e.stopPropagation()
                      restoreArtifact(artifact)
                      setIsOpen(false)
                    }}
                  >
                    Restore
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function ArtifactContentCopy() {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 1000 })

  const { displayedArtifact } = useChatCanvas()
  if (!displayedArtifact) return null

  const content = getArtifactContent(displayedArtifact)
  if (!content) return null

  const handleCopy = () => {
    if (isCopied) return
    copyToClipboard(content)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer rounded-full"
      onClick={handleCopy}
    >
      {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </Button>
  )
}

function getArtifactContent(artifact: Artifact) {
  if (artifact.type === 'code') {
    return (artifact as CodeArtifact).data.code
  }

  if (artifact.type === 'document') {
    return (artifact as DocumentArtifact).data.content
  }

  return null
}

function ArtifactDownloadButton() {
  const { displayedArtifact } = useChatCanvas()

  if (!displayedArtifact) return null

  const content = getArtifactContent(displayedArtifact)
  const fileName = getArtifactDownloadFileName(displayedArtifact)

  if (!content || !fileName) return null

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' })

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = fileName

    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer rounded-full"
      onClick={handleDownload}
    >
      <Download className="size-4" />
    </Button>
  )
}

function getArtifactDownloadFileName(artifact: Artifact) {
  if (artifact.type === 'code') {
    return (artifact as CodeArtifact).data.file_name
  }

  if (artifact.type === 'document') {
    return (artifact as DocumentArtifact).data.title
  }

  return null
}

function CanvasCloseButton() {
  const { closeCanvas } = useChatCanvas()
  return (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer rounded-full"
      onClick={closeCanvas}
    >
      <X className="size-4" />
    </Button>
  )
}

ChatCanvasActions.History = ArtifactVersionHistory
ChatCanvasActions.Copy = ArtifactContentCopy
ChatCanvasActions.Download = ArtifactDownloadButton
ChatCanvasActions.Close = CanvasCloseButton

export { ChatCanvasActions }
