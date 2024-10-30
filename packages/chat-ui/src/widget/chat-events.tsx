'use client'

import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible'
import { EventData } from '../chat/annotation'
import { useChatUI } from '../chat/chat.context'
import { useChatMessage } from '../chat/chat-message'

export function ChatEvents({ data }: { data: EventData[] }) {
  const { isLoading } = useChatUI()
  const { isLast } = useChatMessage()
  const [isOpen, setIsOpen] = useState(false)

  const showLoading = isLast && isLoading
  const buttonLabel = isOpen ? 'Hide events' : 'Show events'

  const EventIcon = isOpen ? (
    <ChevronDown className="h-4 w-4" />
  ) : (
    <ChevronRight className="h-4 w-4" />
  )

  return (
    <div className="border-l-2 border-indigo-400 pl-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="secondary" className="space-x-2">
            {showLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <span>{buttonLabel}</span>
            {EventIcon}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent asChild>
          <div className="mt-4 space-y-2 text-sm">
            {data.map((eventItem, index) => (
              <div className="whitespace-break-spaces" key={index}>
                {eventItem.title}
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
