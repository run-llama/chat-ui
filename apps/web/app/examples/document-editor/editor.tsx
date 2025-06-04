'use client'

import { DocumentEditor } from '@llamaindex/chat-ui/widgets'

export function Editor({
  content,
  onChange,
}: {
  content: string
  onChange: (content: string) => void
}) {
  return <DocumentEditor content={content} onChange={onChange} />
}
