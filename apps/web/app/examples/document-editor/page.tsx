'use client'

import { DocumentEditor } from '@llamaindex/chat-ui/widgets'
import { sampleMarkdown } from './data'

export default function Page() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="py-10 w-1/2 mx-auto space-y-6 flex flex-col h-full">
        <h2 className="text-2xl font-bold text-blue-500">
          Sample Document Editor
        </h2>
        <DocumentEditor
          className="overflow-auto border p-4 rounded-lg flex-1 min-h-0"
          content={sampleMarkdown}
        />
      </div>
    </div>
  )
}
