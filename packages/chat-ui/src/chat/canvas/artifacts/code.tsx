'use client'

import { cn } from '../../../lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs'
import { CodeBlock } from '../../../widgets'
import { CodeArtifact } from '../../annotation'
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
  const { displayedArtifact } = useChatCanvas()

  if (displayedArtifact?.type !== 'code') return null

  const {
    created_at,
    data: { language, code },
  } = displayedArtifact as CodeArtifact

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
        <TabsContent value="code" className="h-full">
          <CodeBlock
            key={created_at} // make the code block re-highlight when changing artifact
            language={language}
            value={code}
            showHeader={false}
          />
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
