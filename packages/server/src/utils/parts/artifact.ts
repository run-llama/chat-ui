import { workflowEvent } from '@llamaindex/workflow'

export const ARTIFACT_PART_TYPE = `data-artifact` as const

export type ArtifactType = 'code' | 'document'

export type Artifact<T = unknown> = {
  created_at: number
  type: ArtifactType
  data: T
}

export type ArtifactPart = {
  id?: string
  type: typeof ARTIFACT_PART_TYPE
  data: Artifact
}

export const artifactEvent = workflowEvent<ArtifactPart>()

// code artifact
export type CodeArtifactData = {
  file_name: string
  code: string
  language: string
}
export type CodeArtifact = Artifact<CodeArtifactData> & {
  type: 'code'
}

// document artifact
export type DocumentArtifact = Artifact<DocumentArtifactData> & {
  type: 'document'
}
export type DocumentArtifactData = {
  title: string
  content: string
  type: string // markdown, html,...
  sources?: { id: string }[] // sources that are used to render citation numbers in the document
}
