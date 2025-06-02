import { FileCode, FileText, LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import {
  DocumentArtifact,
  CodeArtifact,
  isEqualArtifact,
  Artifact,
} from './artifacts'
import { useChatCanvas } from './context'

const IconMap: Record<Artifact['type'], LucideIcon> = {
  code: FileCode,
  document: FileText,
}

export function ArtifactCard({ data }: { data: Artifact }) {
  const {
    openArtifactInCanvas,
    getArtifactVersion,
    restoreArtifact,
    displayedArtifact,
  } = useChatCanvas()
  const { versionNumber, isLatest } = getArtifactVersion(data)

  const Icon = IconMap[data.type]
  const title = getCardTitle(data)
  const isDisplayed =
    displayedArtifact && isEqualArtifact(data, displayedArtifact)

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
          <div className="text-sm font-semibold">Version {versionNumber}</div>
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
