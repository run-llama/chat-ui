import { ChatFiles, DocumentFileData } from '../../../widgets/chat-files.js'
import { usePart } from '../context.js'
import { MessagePartType } from '../types.js'
import { useChatMessage } from '../../chat-message.context.js'

/**
 * Render a document file part as a ChatFiles component.
 */
export function DocumentFilePart() {
  const { message } = useChatMessage()
  const documentFile = usePart<DocumentFileData>(MessagePartType.DOCUMENT_FILE)
  if (!documentFile) return null

  const alignmentClass = message.role === 'user' ? 'ml-auto' : 'mr-auto'
  return <ChatFiles data={documentFile} className={alignmentClass} />
}
