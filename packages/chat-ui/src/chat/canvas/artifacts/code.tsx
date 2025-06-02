'use client'

import { useState } from 'react'
import { cn } from '../../../lib/utils'
import { Button } from '../../../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs'
import { CodeEditor, fileExtensionToEditorLang } from '../../../widgets'
import { CodeArtifact } from '../artifacts'
import { ChatCanvasActions } from '../actions'
import { useChatCanvas } from '../context'

interface CodeArtifactViewerProps {
  className?: string
  tabs?: Record<string, React.ReactNode>
}

export function CodeArtifactViewer({
  className,
  tabs,
}: CodeArtifactViewerProps) {
  const { displayedArtifact, updateArtifact } = useChatCanvas()
  const [updatedCode, setUpdatedCode] = useState<string | undefined>()

  if (displayedArtifact?.type !== 'code') return null

  const codeArtifact = displayedArtifact as CodeArtifact

  const handleCodeChange = (newValue: string) => {
    setUpdatedCode(newValue)
  }

  const handleSaveChanges = () => {
    if (!updatedCode) return
    setUpdatedCode(undefined)
    updateArtifact(codeArtifact, updatedCode)
  }

  const codeEditorLanguage = fileExtensionToEditorLang(
    codeArtifact.data.file_name.split('.').pop() ?? ''
  )

  return (
    <Tabs
      defaultValue="code"
      className={cn('flex h-full min-h-0 flex-1 flex-col gap-4 p-4', className)}
    >
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="code">Code</TabsTrigger>
          {tabs &&
            Object.entries(tabs).map(([key]) => (
              <TabsTrigger key={key} value={key} className="capitalize">
                {key}
              </TabsTrigger>
            ))}
        </TabsList>
        <ChatCanvasActions />
      </div>

      <div className="min-h-0 flex-1 overflow-auto pr-2">
        <TabsContent value="code" className="relative h-full">
          <CodeEditor
            code={updatedCode ?? codeArtifact.data.code}
            onChange={handleCodeChange}
            language={codeEditorLanguage}
          />
          {updatedCode && (
            <div className="bg-background absolute right-0 top-0 flex gap-2 pr-2 text-sm">
              <Button
                size="sm"
                className="h-7 bg-blue-500 hover:bg-blue-600"
                onClick={handleSaveChanges}
              >
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7"
                onClick={() => setUpdatedCode(undefined)}
              >
                Revert
              </Button>
            </div>
          )}
        </TabsContent>
        {tabs &&
          Object.entries(tabs).map(([key, value]) => (
            <TabsContent key={key} value={key} className="h-full">
              {value}
            </TabsContent>
          ))}
      </div>
    </Tabs>
  )
}
