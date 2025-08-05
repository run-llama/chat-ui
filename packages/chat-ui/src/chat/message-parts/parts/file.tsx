import { cn } from '../../../lib/utils'
import { ChatFile, FileData } from '../../../widgets/chat-file'
import { useChatMessage } from '../../chat-message.context.js'
import { usePartData } from '../context.js'

export const FilePartType = 'data-file' as const

/**
 * Render a file part inside a ChatMessage, return null if current part is not file type
 * This component is useful to show an uploaded file from the user or generated file from the assistant
 * @param props.className - custom styles for the file
 */
export function FilePart({ className }: { className?: string }) {
  const { message } = useChatMessage()
  const file = usePartData<FileData>(FilePartType)
  if (!file) return null

  const alignmentClass = message.role === 'user' ? 'ml-auto' : 'mr-auto'
  return <ChatFile file={file} className={cn(alignmentClass, className)} />
}
