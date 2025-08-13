import { createContext, useContext } from 'react'
import {
  ArtifactPart,
  ArtifactPartType,
  EventPart,
  EventPartType,
  FilePart,
  FilePartType,
  MessagePart,
  SourcesPart,
  SourcesPartType,
  SuggestionPart,
  SuggestionPartType,
  TextPart,
  TextPartType,
} from './types'

export interface ChatPartContext {
  part: MessagePart
}

export const chatPartContext = createContext<ChatPartContext | null>(null)

export const ChatPartProvider = chatPartContext.Provider

// Function overloads for automatic type inference
export function usePart(type: typeof TextPartType): TextPart | null
export function usePart(type: typeof FilePartType): FilePart | null
export function usePart(type: typeof ArtifactPartType): ArtifactPart | null
export function usePart(type: typeof EventPartType): EventPart | null
export function usePart(type: typeof SourcesPartType): SourcesPart | null
export function usePart(type: typeof SuggestionPartType): SuggestionPart | null
export function usePart<T = MessagePart>(type: string): T | null

/**
 * Get the current part. Return null if the input type is not matched with current part type.
 *
 * @param type - The part type to match against
 * @returns The typed part if the type matches, null otherwise
 *
 * @example
 * // Automatically inferred as TextPart | null
 * const textPart = usePart('text')
 *
 * // Automatically inferred as ArtifactPart | null
 * const artifactPart = usePart('data-artifact')
 *
 * // For custom types, specify the generic
 * const customPart = usePart<CustomPart>('custom-type')
 */
export function usePart<T = MessagePart>(type: string): T | null {
  const context = useContext(chatPartContext)
  if (!context) {
    throw new Error('usePart must be used within a ChatPartProvider')
  }

  if (context.part.type !== type) return null // part type not matched
  return context.part as T // return current part
}
