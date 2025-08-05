import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible'
import { cn } from '../lib/utils'

export type ChatEvent = {
  title: string
  description?: string
  status: 'pending' | 'success' | 'error'
  data?: any
}

export function ChatEvent({
  event,
  className,
}: {
  event: ChatEvent
  className?: string
}) {
  const [isDataOpen, setIsDataOpen] = useState(false)

  const getStatusIcon = () => {
    switch (event.status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = () => {
    switch (event.status) {
      case 'pending':
        return 'border-yellow-400'
      case 'success':
        return 'border-green-400'
      case 'error':
        return 'border-red-400'
    }
  }

  return (
    <div className={cn('border-l-2 py-2 pl-4', getStatusColor(), className)}>
      {/* Header with title and status */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium">{event.title}</h3>
          {event.description && (
            <p className="text-muted-foreground mt-1 text-xs">
              {event.description}
            </p>
          )}
        </div>
        <div className="ml-2 flex items-center space-x-1">
          {getStatusIcon()}
          <span className="text-xs capitalize">{event.status}</span>
        </div>
      </div>

      {/* Data section if data exists */}
      {event.data && (
        <div className="mt-3">
          <Collapsible open={isDataOpen} onOpenChange={setIsDataOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                {isDataOpen ? (
                  <ChevronDown className="mr-1 h-3 w-3" />
                ) : (
                  <ChevronRight className="mr-1 h-3 w-3" />
                )}
                {isDataOpen ? 'Hide data' : 'Show data'}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <pre className="bg-muted mt-2 max-h-40 overflow-auto rounded p-2 text-xs">
                {JSON.stringify(event.data, null, 2)}
              </pre>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  )
}
