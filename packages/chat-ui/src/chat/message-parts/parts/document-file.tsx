import { ChatFiles, DocumentFileData } from '../../../widgets/chat-files.js'
import { useCurrentPart } from '../context.js'
import { useChatMessage } from '../../chat-message.context.js'
import { cn } from '../../../lib/utils'

export const DocumentFilePartType = 'data-document-file' as const

/**
 * Render a document file part inside a ChatMessage, return null if current part is not document file type
 * @param props.className - custom styles for the document file
 */
export function DocumentFilePart({ className }: { className?: string }) {
  const { message } = useChatMessage()
  const documentFile = useCurrentPart<DocumentFileData>(DocumentFilePartType)
  if (!documentFile) return null

  const alignmentClass = message.role === 'user' ? 'ml-auto' : 'mr-auto'
  return (
    <ChatFiles data={documentFile} className={cn(alignmentClass, className)} />
  )
}
