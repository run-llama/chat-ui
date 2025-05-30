import { FileCode, FileText, LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import {
  Artifact,
  CodeArtifact,
  DocumentArtifact,
  extractArtifactsFromMessage,
  isEqualArtifact,
} from '../annotation'
import { Message } from '../chat.interface'
import { useChatCanvas } from './context'
import { memo, useEffect } from 'react'
import { useChatUI } from '../chat.context'
import { useChatMessage } from '../chat-message.context'

const IconMap: Record<Artifact['type'], LucideIcon> = {
  code: FileCode,
  document: FileText,
}

export const ArtifactCard = memo(ArtifactCardComp)

function ArtifactCardComp({ data }: { data: Artifact }) {
  const {
    openArtifactInCanvas,
    getArtifactVersion,
    restoreArtifact,
    displayedArtifact,
  } = useChatCanvas()
  const { setMessages, messages } = useChatUI()
  const { message, isLast } = useChatMessage()
  const { versionNumber, isLatest } = getArtifactVersion(data)

  const Icon = IconMap[data.type]
  const title = getCardTitle(data)
  const isDisplayed =
    displayedArtifact && isEqualArtifact(data, displayedArtifact)

  useEffect(() => {
    const artifacts = extractArtifactsFromMessage(message) ?? []
    // if current last message hasn't contain this inline artifact, add it to annotations of the message
    const artifact = artifacts.find(a => isEqualArtifact(a, data))
    if (!artifact && isLast && setMessages) {
      setMessages([
        ...messages.slice(0, -1),
        {
          role: 'assistant',
          content: message.content,
          annotations: [{ type: 'artifact', data }],
        },
      ] as (Message & { id: string })[])
    }
  }, [])

  return (
    <div
      className={cn(
        'border-border flex w-full max-w-72 cursor-pointer items-center justify-between gap-2 rounded-lg border-2 p-2 hover:border-blue-500',
        isDisplayed && 'border-blue-500'
      )}
      onClick={() => openArtifactInCanvas(data)}
    >
      <div className="flex flex-1 items-center gap-2">
        <Icon className="size-7 shrink-0 text-blue-500" />
        <div className="flex flex-col">
          {!data.readonly && (
            <div className="text-sm font-semibold">Version {versionNumber}</div>
          )}
          {title && <div className="text-xs text-gray-600">{title}</div>}
        </div>
      </div>
      {isLatest ? (
        <Badge className="ml-2 bg-blue-500 hover:bg-blue-600">Latest</Badge>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 shrink-0 cursor-pointer text-xs"
          onClick={e => {
            e.stopPropagation()
            restoreArtifact(data)
          }}
        >
          Restore
        </Button>
      )}
    </div>
  )
}

const getCardTitle = (artifact: Artifact) => {
  if (artifact.type === 'code') {
    const { file_name } = artifact.data as CodeArtifact['data']
    return file_name
  }
  if (artifact.type === 'document') {
    const { title } = artifact.data as DocumentArtifact['data']
    return title
  }
  return ''
}
