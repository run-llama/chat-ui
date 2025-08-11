import {
  ChatEvent,
  SourceData,
  SuggestedQuestionsData,
  FileData,
} from '../../widgets'
import { Artifact } from '../canvas/artifacts'

export type MessagePart = TextPart | DataPart | FilePart | AnyPart

// All ChatUI supported part types
export const TextPartType = 'text' as const
export const FilePartType = 'data-file' as const
export const ArtifactPartType = 'data-artifact' as const
export const EventPartType = 'data-event' as const
export const SourcesPartType = 'data-sources' as const
export const SuggestionPartType = 'data-suggested_questions' as const

// Text Part: the text content of the message
// It will be rendered in Markdown component
export type TextPart = {
  type: typeof TextPartType
  text: string
}

// Data Parts: data parts are other blocks that we want to display in the message
// It can be artifact, event, sources, etc.
export type DataPart<T extends `data-${string}` = `data-${string}`, D = any> = {
  id?: string // if id is provided, only last data part with the same id will be existed in message.parts
  type: T // `data-` prefix is required for data parts
  data: D
}

export type FilePart = DataPart<typeof FilePartType, FileData>
export type ArtifactPart = DataPart<typeof ArtifactPartType, Artifact>
export type EventPart = DataPart<typeof EventPartType, ChatEvent>
export type SourcesPart = DataPart<typeof SourcesPartType, SourceData>
export type SuggestionPart = DataPart<
  typeof SuggestionPartType,
  SuggestedQuestionsData
>

// Any Part: other parts that are not supported by ChatUI
// You can still use `usePart` hook to get data and create your own display from these parts
// Example: dynamic events (type = 'ui_event') or specific parts from Vercel AI SDK. See more details here:
// https://github.com/vercel/ai/blob/7948ec215d21675c1100edf58af8bb03a1f1dbe4/packages/ai/src/ui/ui-messages.ts#L75-L272
export type AnyPart<T extends string = any> = {
  id?: string
  type: T
  data?: any
}
