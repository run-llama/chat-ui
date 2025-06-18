'use client'

import { useState } from 'react'
import { useWorkflow } from '@llamaindex/chat-ui'

const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const workflow = process.env.NEXT_PUBLIC_DEPLOYMENT_NAME || 'QuickStart'

export default function Home() {
  const [userInput, setUserInput] = useState('Please run task')

  const { sessionId, taskId, start, stop, sendEvent, events, status } =
    useWorkflow({
      baseUrl,
      workflow,
      onStopEvent: event => {
        console.log('Stop event:', event)
      },
      onError: error => {
        console.error('Error:', error)
      },
    })

  const handleStart = async () => {
    await start({ message: userInput })
  }

  const handleRetrieve = async () => {
    // AdhocEvent is defined in workflow definition
    await sendEvent({ type: 'workflow.AdhocEvent' })
  }

  const handleStop = async () => {
    await stop()
  }

  return (
    <div className="mx-auto h-screen w-full max-w-4xl px-4 py-4">
      <h1 className="mb-6 text-2xl font-bold">Llama Deploy with Chat UI</h1>

      {/* Status Panel */}
      <div className="mb-6 rounded-lg bg-gray-100 p-4">
        <h2 className="mb-2 text-lg font-semibold">Workflow Status</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Session ID:</strong> {sessionId || 'Not created'}
          </div>
          <div>
            <strong>Task ID:</strong> {taskId || 'Not created'}
          </div>

          <div>
            <strong>Task Events:</strong> {events.length}
          </div>
          <div>
            <strong>Task Status:</strong>{' '}
            <span
              className={`text-sm ${
                status === 'idle' || !status
                  ? 'text-gray-500'
                  : status === 'complete'
                    ? 'text-green-500'
                    : status === 'error'
                      ? 'text-red-500'
                      : status === 'running'
                        ? 'text-yellow-500'
                        : ''
              }`}
            >
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Events Interface */}
      <div className="mb-4 h-96 overflow-auto rounded border bg-white p-4">
        <h3 className="mb-2 font-semibold">Events</h3>
        {events.map((event, index) => (
          <div key={index} className="mb-2 ml-4 text-sm text-blue-600">
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
          className="flex-1 rounded border border-gray-300 p-2"
          placeholder="Type your message..."
          disabled={status === 'running'}
        />
        <button
          type="button"
          onClick={handleStart}
          disabled={status === 'running'}
          className="rounded-full bg-green-500 px-6 py-2 text-white shadow-2xl hover:bg-green-600 disabled:opacity-50"
        >
          Start
        </button>
        <button
          type="button"
          onClick={handleRetrieve}
          disabled={status !== 'running'}
          className="rounded-full bg-yellow-500 px-6 py-2 text-white shadow-2xl hover:bg-yellow-600 disabled:opacity-50"
        >
          Retrieve
        </button>
        <button
          type="button"
          onClick={handleStop}
          disabled={status !== 'running'}
          className="rounded-full bg-red-500 px-6 py-2 text-white shadow-2xl hover:bg-red-600 disabled:opacity-50"
        >
          Stop
        </button>
      </div>
    </div>
  )
}
