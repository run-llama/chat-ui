'use client'

import { CodeEditor } from '@llamaindex/chat-ui/widgets'
import { cssCode, htmlCode, javascriptCode, pythonCode, tsxCode } from './data'

export default function Page() {
  return (
    <div className="flex w-screen flex-col items-center space-y-10 divide-y-2 overflow-hidden p-20">
      <div className="w-1/2 space-y-10 overflow-hidden">
        <h2 className="text-2xl font-bold">Python Code Editor</h2>
        <CodeEditor
          className="h-screen overflow-auto"
          code={pythonCode}
          language="python"
        />
      </div>
      <div className="w-1/2 space-y-10 overflow-hidden">
        <h2 className="text-2xl font-bold">JavaScript Code Editor</h2>
        <CodeEditor
          className="h-screen overflow-auto"
          code={javascriptCode}
          language="javascript"
        />
      </div>
      <div className="w-1/2 space-y-10 overflow-hidden">
        <h2 className="text-2xl font-bold">TSX Code Editor</h2>
        <CodeEditor
          className="h-screen overflow-auto"
          code={tsxCode}
          language="javascript"
        />
      </div>
      <div className="w-1/2 space-y-10 overflow-hidden">
        <h2 className="text-2xl font-bold">HTML Code Editor</h2>
        <CodeEditor
          className="h-screen overflow-auto"
          code={htmlCode}
          language="html"
        />
      </div>
      <div className="w-1/2 space-y-10 overflow-hidden">
        <h2 className="text-2xl font-bold">CSS Code Editor</h2>
        <CodeEditor
          className="h-screen overflow-auto"
          code={cssCode}
          language="css"
        />
      </div>
    </div>
  )
}
