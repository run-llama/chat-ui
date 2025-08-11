import { cn } from '../../../lib/utils'
import { ChatFile } from '../../../widgets/chat-file'
import { useChatMessage } from '../../chat-message.context.js'
import { usePart } from '../context.js'
import { FilePartType } from '../types.js'

/**
 * Render a file part inside a ChatMessage, return null if current part is not file type
 * This component is useful to show an uploaded file from the user or generated file from the assistant
 * @param className - custom styles for the file
 */
export function FilePartUI({ className }: { className?: string }) {
  const { message } = useChatMessage()
  const file = usePart(FilePartType)
  if (!file) return null

  const alignmentClass = message.role === 'user' ? 'ml-auto' : 'mr-auto'
  return <ChatFile file={file.data} className={cn(alignmentClass, className)} />
}
