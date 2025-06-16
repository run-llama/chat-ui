'use client'

import { useState } from 'react'
import { useWorkflow } from '@llamaindex/chat-ui'

const BASE_URL = 'http://127.0.0.1:4501'
const DEPLOYMENT_NAME = 'LlamaIndexServer'

interface ChatStartEvent {
  name: 'ChatStartEvent'
  chat_request: {
    id: string
    messages: { role: string; content: string }[]
  }
}

export default function Home() {
  const [userInput, setUserInput] = useState('')

  const workflow = useWorkflow<ChatStartEvent>({
    baseUrl: BASE_URL,
    workflow: DEPLOYMENT_NAME,
    onStopEvent: event => {
      console.log('Workflow completed:', event)
    },
    onError: error => {
      console.error('Workflow error:', error)
    },
  })

  const handleSendMessage = async () => {
    await workflow.sendEvent({
      name: 'ChatStartEvent',
      chat_request: {
        id: new Date().getTime().toString(),
        messages: [{ role: 'user', content: userInput }],
      },
    })
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
            <strong>Session ID:</strong> {workflow.sessionId || 'Not created'}
          </div>
          <div>
            <strong>Task ID:</strong> {workflow.taskId || 'Not created'}
          </div>

          <div>
            <strong>Events Count:</strong> {workflow.events.length}
          </div>
          <div>
            <strong>Status:</strong> {workflow.status}
          </div>
        </div>
      </div>

      {/* Events Interface */}
      <div className="mb-4 h-96 overflow-auto rounded border bg-white p-4">
        <h3 className="mb-2 font-semibold">Events</h3>
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
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 rounded border border-gray-300 p-2"
          placeholder="Type your message..."
          disabled={workflow.status === 'running'}
        />
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={workflow.status === 'running'}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}
