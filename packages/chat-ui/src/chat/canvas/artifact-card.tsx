import { FileCode, FileText, LucideIcon, Paperclip } from 'lucide-react'
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

export function ArtifactCard({
  data,
  getTitle = getCardTitle,
  iconMap = IconMap,
}: {
  data: Artifact
  getTitle?: (data: Artifact) => string
  iconMap?: Record<Artifact['type'], LucideIcon>
}) {
  const {
    openArtifactInCanvas,
    getArtifactVersion,
    restoreArtifact,
    displayedArtifact,
  } = useChatCanvas()
  const { versionNumber, isLatest } = getArtifactVersion(data)

  const Icon = iconMap[data.type] || Paperclip
  const title = getTitle(data)
  const isDisplayed =
    displayedArtifact && isEqualArtifact(data, displayedArtifact)

  return (
    <div
      className={cn(
        'border-border hover:border-primary flex w-full max-w-72 cursor-pointer items-center justify-between gap-2 rounded-lg border-2 p-2',
        isDisplayed && 'border-primary'
      )}
      onClick={() => openArtifactInCanvas(data)}
    >
      <div className="flex flex-1 items-center gap-2">
        <Icon className="text-primary size-7 shrink-0" />
        <div className="flex flex-col">
          <div className="text-sm font-semibold">Version {versionNumber}</div>
          <div className="text-xs text-gray-600">{title}</div>
        </div>
      </div>
      {isLatest ? (
        <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 ml-2">
          Latest
        </Badge>
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
  return 'Generated Artifact'
}
