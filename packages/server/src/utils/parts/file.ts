import { workflowEvent } from '@llamaindex/workflow'

export const FILE_PART_TYPE = 'data-file' as const

export type FileData = {
  mediaType: string
  filename: string
  url: string
}

export type FilePart = {
  id?: string
  type: typeof FILE_PART_TYPE
  data: FileData
}

export const fileEvent = workflowEvent<FilePart>()
