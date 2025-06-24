'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useWorkflow } from '@llamaindex/chat-ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const DEPLOYMENT_NAME = 'QuickStart'
const DEFAULT_WORKFLOW = 'adhoc_workflow'

export default function Home() {
  const [userInput, setUserInput] = useState('Please run task')
  const [workflow, setWorkflow] = useState(DEFAULT_WORKFLOW)

  const { runId, start, stop, sendEvent, events, status } = useWorkflow({
    deployment: DEPLOYMENT_NAME,
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
    await sendEvent({ type: 'adhoc_workflow.AdhocEvent' })
  }

  const handleContinue = async () => {
    // ContinueEvent is defined in workflow definition
    await sendEvent({
      type: 'hitl_workflow.ContinueEvent',
      data: { user_response: 'Please continue' },
    })
  }

  const handleStop = async () => {
    await stop()
  }

  const handleWorkflowSwitch = (value: string) => {
    setWorkflow(value)
  }

  return (
    <div className="mx-auto h-screen w-full max-w-4xl px-4 py-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Llama Deploy with Chat UI</h1>
        <Link
          href="/chat"
          className="rounded bg-blue-500 px-4 py-1 text-white hover:bg-blue-600"
        >
          Go to Chat Demo
        </Link>
      </div>

      {/* Workflow Switcher */}
      <div className="mb-4 flex items-center gap-4">
        <label htmlFor="workflow-select" className="font-medium">
          Workflow:
        </label>
        <div className="ml-auto">
          <Select
            value={workflow}
            onValueChange={handleWorkflowSwitch}
            disabled={status === 'running'}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select workflow" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="adhoc_workflow">Adhoc Workflow</SelectItem>
              <SelectItem value="echo_workflow">Echo Workflow</SelectItem>
              <SelectItem value="hitl_workflow">HITL Workflow</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status Panel */}
      <div className="mb-6 rounded-lg bg-gray-100 p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Workflow:</strong> {workflow}
          </div>

          <div>
            <strong>Run ID:</strong> {runId || 'Not created'}
          </div>

          <div>
            <strong>Event Count:</strong> {events.length}
          </div>
          <div>
            <strong>Run Status:</strong>{' '}
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
          onChange={e => {
            setUserInput(e.target.value)
          }}
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
        {workflow === 'adhoc_workflow' && (
          <button
            type="button"
            onClick={handleRetrieve}
            disabled={status !== 'running'}
            className="rounded-full bg-yellow-500 px-6 py-2 text-white shadow-2xl hover:bg-yellow-600 disabled:opacity-50"
          >
            Retrieve
          </button>
        )}
        {workflow === 'hitl_workflow' && (
          <button
            type="button"
            onClick={handleContinue}
            disabled={status !== 'running'}
            className="rounded-full bg-yellow-500 px-6 py-2 text-white shadow-2xl hover:bg-yellow-600 disabled:opacity-50"
          >
            Continue
          </button>
        )}
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
