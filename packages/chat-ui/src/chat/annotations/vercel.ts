import { DataPart, Message, MessagePart, TextPartType } from '../chat.interface'

/**
 * Gets all annotations from a message from data parts
 * @param message - The message to extract annotations from
 * @returns Array of data from annotations
 */
export function getVercelAnnotations(message: Message): unknown[] {
  // get all data parts from message
  const dataParts = message.parts.filter(
    (part: MessagePart): part is DataPart => part.type !== TextPartType
  )

  // data parts must have data- prefix
  const validDataParts = dataParts.filter(part => part.type.startsWith('data-'))

  // if data parts has the same id, only keep the last one
  const uniqueDataParts = validDataParts.reduce((acc, part) => {
    if (acc.find(p => p.id === part.id)) {
      return acc
    }
    return [...acc, part]
  }, [] as DataPart[])

  // convert data parts to annotation
  const annotations = uniqueDataParts.map(part => ({
    type: part.type.replace('data-', ''),
    data: part.data,
  }))

  return annotations
}
