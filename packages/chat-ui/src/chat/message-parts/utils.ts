import { Message } from '../chat.interface'
import {
  AnyPart,
  ArtifactPart,
  ArtifactPartType,
  DataPart,
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

export class PartValidator {
  static isTextPart(part: MessagePart): part is TextPart {
    return part.type === TextPartType && 'text' in part
  }

  static isFilePart(part: MessagePart): part is FilePart {
    return part.type === FilePartType && 'mediaType' in part && 'url' in part
  }

  static isDataPart(part: MessagePart): part is DataPart {
    return part.type.startsWith('data-') && 'data' in part
  }

  static isArtifactPart(part: MessagePart): part is ArtifactPart {
    return this.isDataPart(part) && part.type === ArtifactPartType
  }

  static isEventPart(part: MessagePart): part is EventPart {
    return this.isDataPart(part) && part.type === EventPartType
  }

  static isSourcesPart(part: MessagePart): part is SourcesPart {
    return this.isDataPart(part) && part.type === SourcesPartType
  }

  static isSuggestionPart(part: MessagePart): part is SuggestionPart {
    return this.isDataPart(part) && part.type === SuggestionPartType
  }

  static isAnyPart(part: MessagePart): part is AnyPart {
    return (
      !this.isTextPart(part) && !this.isFilePart(part) && !this.isDataPart(part)
    )
  }
}

// Function overloads for automatic type inference
export function getParts(
  message: Message,
  type: typeof TextPartType
): TextPart[]
export function getParts(
  message: Message,
  type: typeof FilePartType
): FilePart[]
export function getParts(
  message: Message,
  type: typeof ArtifactPartType
): ArtifactPart[]
export function getParts(
  message: Message,
  type: typeof EventPartType
): EventPart[]
export function getParts(
  message: Message,
  type: typeof SourcesPartType
): SourcesPart[]
export function getParts(
  message: Message,
  type: typeof SuggestionPartType
): SuggestionPart[]
export function getParts<T extends MessagePart>(
  message: Message,
  type: string
): T[]

/**
 * Get all parts of a specific type from a message.
 *
 * @param message - The message to search in
 * @param type - The part type to filter by
 * @returns Array of typed parts matching the specified type
 *
 * @example
 * // Automatically inferred as TextPart[]
 * const textParts = getParts(message, 'text')
 *
 * // Automatically inferred as ArtifactPart[]
 * const artifactParts = getParts(message, 'data-artifact')
 *
 * // For custom types, specify the generic
 * const customParts = getParts<CustomPart>(message, 'custom-type')
 */
export function getParts<T = MessagePart>(message: Message, type: string): T[] {
  return message.parts.filter(part => part.type === type) as T[]
}
