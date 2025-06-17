'use client'

import { useState } from 'react'
import {
  EVENT_QUALIFIED_NAMES,
  useWorkflow,
  WorkflowEvent,
} from '@llamaindex/chat-ui'
import { cn } from '@/lib/utils'

interface StartEvent extends WorkflowEvent {
  value: {
    userInput: string
  }
}

export default function Home() {
  const [userInput, setUserInput] = useState('')

  const { createTask, sessionId, tasks, currentTask } = useWorkflow<StartEvent>(
    {
      baseUrl: 'http://127.0.0.1:4501',
      workflow: 'QuickStart',
    }
  )

  const handleSendMessage = async () => {
    const taskId = await createTask(
      { userInput },
      {
        onStopEvent: event => {
          console.log('Stop event:', event)
        },
      }
    )
    console.log('Task created:', taskId)
  }

  const handleSendEvent = async () => {
    await currentTask?.sendEvent(
      {
        value: { userInput },
        _is_pydantic: true,
        qualified_name: EVENT_QUALIFIED_NAMES.STOP,
      },
      {
        onStopEvent: event => {
          console.log('Stop event:', event)
        },
      }
    )
  }

  return (
    <div className="mx-auto h-screen w-full max-w-4xl px-4 py-4">
      <h1 className="mb-6 text-2xl font-bold">Workflow Chat Example</h1>

      {/* Status Panel */}
      <div className="mb-6 rounded-lg bg-gray-100 p-4">
        <h2 className="mb-2 text-lg font-semibold">Workflow Status</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Session ID:</strong> {sessionId || 'Not created'}
          </div>
          <div>
            <strong>Current Task ID:</strong> {currentTask?.id || 'Not created'}
          </div>

          <div>
            <strong>Task Events:</strong> {currentTask?.events.length}
          </div>
          <div>
            <strong>Task Status:</strong>{' '}
            <span
              className={cn('text-sm', {
                'text-gray-500':
                  currentTask?.status === 'idle' || !currentTask?.status,
                'text-green-500': currentTask?.status === 'complete',
                'text-red-500': currentTask?.status === 'error',
                'text-yellow-500': currentTask?.status === 'running',
              })}
            >
              {currentTask?.status}
            </span>
          </div>
        </div>
      </div>

      {/* Events Interface */}
      <div className="mb-4 h-96 overflow-auto rounded border bg-white p-4">
        <h3 className="mb-2 font-semibold">Events</h3>
        {Object.entries(tasks).map(([taskId, task]) => (
          <div key={taskId} className="mb-4">
            <h4 className="mb-2 text-sm font-medium">Task: {taskId}</h4>
            {task.events.map((event, index) => (
              <div key={index} className="mb-2 ml-4 text-sm text-blue-600">
                Event {index + 1}: {JSON.stringify(event)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 rounded border border-gray-300 p-2"
          placeholder="Type your message..."
          disabled={currentTask?.status === 'running'}
        />
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={currentTask?.status === 'running'}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          Create Task
        </button>
        <button
          type="button"
          onClick={handleSendEvent}
          disabled={!currentTask}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          Stop Event
        </button>
      </div>
    </div>
  )
}
