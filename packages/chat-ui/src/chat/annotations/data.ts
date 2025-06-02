export enum MessageAnnotationType {
  IMAGE = 'image',
  DOCUMENT_FILE = 'document_file',
  SOURCES = 'sources',
  EVENTS = 'events',
  SUGGESTED_QUESTIONS = 'suggested_questions',
  AGENT_EVENTS = 'agent',
  ARTIFACT = 'artifact',
}

// TODO: move data to the component where the data is used

export type ImageData = {
  url: string
}

export type DocumentFileType = 'csv' | 'pdf' | 'txt' | 'docx'
export const DOCUMENT_FILE_TYPES: DocumentFileType[] = [
  'csv',
  'pdf',
  'txt',
  'docx',
]

export type DocumentFile = {
  id: string
  name: string // The uploaded file name in the backend
  size: number // The file size in bytes
  type: DocumentFileType
  url: string // The URL of the uploaded file in the backend
  refs?: string[] // DocumentIDs of the uploaded file in the vector index
}

export type DocumentFileData = {
  files: DocumentFile[]
}

export type EventData = {
  title: string
}

export type ProgressData = {
  id: string
  total: number
  current: number
}

export type AgentEventData = {
  agent: string
  text: string
  type: 'text' | 'progress'
  data?: ProgressData
}

export type SuggestedQuestionsData = string[]
