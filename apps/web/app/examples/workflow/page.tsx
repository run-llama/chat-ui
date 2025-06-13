/* eslint-disable no-nested-ternary -- disable */
/* eslint-disable @typescript-eslint/no-unsafe-call -- disable */
/* eslint-disable @typescript-eslint/no-confusing-void-expression -- disable */
/* eslint-disable @typescript-eslint/no-misused-promises -- disable */

'use client'

import { useState } from 'react'
import { useWorkflow } from '@llamaindex/chat-ui'

const BASE_URL = 'http://127.0.0.1:4501'
const DEPLOYMENT_NAME = 'QuickStart'

interface HumanResponseEvent {
  name: 'HumanResponseEvent'
  response: string
}

interface StopEvent {
  name: 'StopEvent'
  [key: string]: any
}

export default function Home() {
  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  const workflow = useWorkflow<HumanResponseEvent, StopEvent>({
    workflow: DEPLOYMENT_NAME,
    baseUrl: BASE_URL,
    onStopEvent: event => {
      setMessages(prev => [
        ...prev,
        `Workflow completed: ${JSON.stringify(event)}`,
      ])
    },
    onError: error => {
      setMessages(prev => [...prev, `Error: ${error}`])
    },
  })

  const handleSendMessage = async () => {
    if (!userInput.trim()) return

    try {
      await workflow.sendEvent({
        name: 'HumanResponseEvent',
        response: userInput,
      })
      setMessages(prev => [...prev, `You: ${userInput}`])
      setUserInput('')
    } catch (error) {
      setMessages(prev => [...prev, `Failed to send: ${error as string}`])
    }
  }

  return (
    <div className="mx-auto h-screen w-full max-w-4xl px-4 py-4">
      <h1 className="mb-6 text-2xl font-bold">
        Workflow Chat Example - {DEPLOYMENT_NAME}
      </h1>

      {/* Status Panel */}
      <div className="mb-6 rounded-lg bg-gray-100 p-4">
        <h2 className="mb-2 text-lg font-semibold">Workflow Status</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Task ID:</strong> {workflow.taskId || 'Not started'}
          </div>
          <div>
            <strong>Session ID:</strong> {workflow.sessionId || 'Not started'}
          </div>
          <div>
            <strong>Events Count:</strong> {workflow.events.length}
          </div>
          <div>
            <strong>Status:</strong>{' '}
            {workflow.isError
              ? 'Error'
              : workflow.isComplete
                ? 'Complete'
                : 'Running'}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="mb-4 h-96 overflow-auto rounded border bg-white p-4">
        <h3 className="mb-2 font-semibold">Messages & Events</h3>
        {messages.map((message, index) => (
          <div key={index} className="mb-2 text-sm">
            {message}
          </div>
        ))}
        {workflow.events.map((event, index) => (
          <div key={index} className="mb-2 text-sm text-blue-600">
            Event {index + 1}: {JSON.stringify(event)}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 rounded border border-gray-300 p-2"
          placeholder="Type your message..."
          disabled={workflow.isComplete || workflow.isError}
        />
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={
            workflow.isComplete || workflow.isError || !userInput.trim()
          }
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </div>

      {/* Debug Panel */}
      <div className="mt-6">
        <details>
          <summary className="cursor-pointer font-semibold">Debug Info</summary>
          <pre className="mt-2 max-h-48 overflow-auto rounded bg-gray-100 p-2 text-xs">
            {JSON.stringify(
              {
                taskId: workflow.taskId,
                sessionId: workflow.sessionId,
                events: workflow.events,
                backfillIndex: workflow.backfillIndex,
                isComplete: workflow.isComplete,
                isError: workflow.isError,
              },
              null,
              2
            )}
          </pre>
        </details>
      </div>
    </div>
  )
}
