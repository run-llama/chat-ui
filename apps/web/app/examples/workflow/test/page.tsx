/* eslint-disable no-constant-condition -- disable */
/* eslint-disable @typescript-eslint/no-unnecessary-condition -- disable */
/* eslint-disable jsx-a11y/label-has-associated-control -- disable */
/* eslint-disable @typescript-eslint/no-confusing-void-expression -- disable */
/* eslint-disable @typescript-eslint/no-misused-promises -- disable */

'use client'

import { useState } from 'react'

const BASE_URL = 'http://127.0.0.1:4501'
const DEPLOYMENT_NAME = 'LlamaIndexServer'
const SERVICE_ID = 'echo_workflow'

export default function Home() {
  const [baseUrl, setBaseUrl] = useState(BASE_URL)
  const [deploymentName, setDeploymentName] = useState(DEPLOYMENT_NAME)
  const [taskId, setTaskId] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [taskInput, setTaskInput] = useState('')
  const [eventData, setEventData] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const makeApiCall = async (url: string, options?: RequestInit) => {
    setLoading(true)
    try {
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))

      // Auto-populate fields from response
      if (data.task_id) setTaskId(data.task_id as string)
      if (data.session_id) setSessionId(data.session_id as string)
    } catch (error) {
      setResponse(`Error: ${error as string}`)
    } finally {
      setLoading(false)
    }
  }

  const getAllTasks = async () => {
    if (!deploymentName) {
      setResponse('Please enter deployment name')
      return
    }
    await makeApiCall(`${baseUrl}/deployments/${deploymentName}/tasks`)
  }

  const createDeploymentTask = async () => {
    if (!deploymentName || !taskInput) {
      setResponse('Please enter deployment name and task input')
      return
    }
    await makeApiCall(
      `${baseUrl}/deployments/${deploymentName}/tasks/run${sessionId ? `?session_id=${sessionId}` : ''}`,
      {
        method: 'POST',
        body: JSON.stringify({
          input: taskInput,
        }),
      }
    )
  }

  const createDeploymentTaskNoWait = async () => {
    if (!deploymentName || !taskInput) {
      setResponse('Please enter deployment name and task input')
      return
    }
    await makeApiCall(
      `${baseUrl}/deployments/${deploymentName}/tasks/create${sessionId ? `?session_id=${sessionId}` : ''}`,
      {
        method: 'POST',
        body: JSON.stringify({
          input: taskInput,
        }),
      }
    )
  }

  const sendEventToTask = async () => {
    if (!deploymentName || !taskId || !sessionId || !eventData) {
      setResponse(
        'Please enter deployment name, task ID, session ID, and event data'
      )
      return
    }
    await makeApiCall(
      `${baseUrl}/deployments/${deploymentName}/tasks/${taskId}/events?session_id=${sessionId}`,
      {
        method: 'POST',
        body: JSON.stringify({
          service_id: SERVICE_ID,
          event_obj_str: eventData,
        }),
      }
    )
  }

  const getTaskEvents = async () => {
    if (!deploymentName || !taskId || !sessionId) {
      setResponse('Please enter deployment name, task ID, and session ID')
      return
    }

    setLoading(true)
    setResponse('') // Clear previous response

    try {
      const res = await fetch(
        `${baseUrl}/deployments/${deploymentName}/tasks/${taskId}/events?session_id=${sessionId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const reader = res.body?.getReader()
      if (!reader) {
        throw new Error('No reader available')
      }

      const decoder = new TextDecoder()
      let accumulatedData = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        accumulatedData += chunk

        // Update the response with accumulated data
        setResponse(accumulatedData)
      }
    } catch (error) {
      setResponse(`Error: ${error as string}`)
    } finally {
      setLoading(false)
    }
  }

  const getTaskResult = async () => {
    if (!deploymentName || !taskId || !sessionId) {
      setResponse('Please enter deployment name, task ID, and session ID')
      return
    }
    await makeApiCall(
      `${baseUrl}/deployments/${deploymentName}/tasks/${taskId}/results?session_id=${sessionId}`
    )
  }

  const createSession = async () => {
    if (!deploymentName) {
      setResponse('Please enter deployment name')
      return
    }
    await makeApiCall(
      `${baseUrl}/deployments/${deploymentName}/sessions/create`,
      {
        method: 'POST',
      }
    )
  }

  const getDeployments = async () => {
    await makeApiCall(`${baseUrl}/deployments/`)
  }

  return (
    <div className="mx-auto h-screen w-full max-w-6xl px-4 py-4">
      <h1 className="mb-6 text-2xl font-bold">
        Deployment Workflow API Tester
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Panel - Configuration */}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Base URL:</label>
            <input
              type="text"
              value={baseUrl}
              onChange={e => setBaseUrl(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              placeholder="http://127.0.0.1:4501"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Deployment Name:
            </label>
            <input
              type="text"
              value={deploymentName}
              onChange={e => setDeploymentName(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              placeholder="Enter deployment name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Task ID:</label>
            <input
              type="text"
              value={taskId}
              onChange={e => setTaskId(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              placeholder="Auto-populated or enter manually"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Session ID:
            </label>
            <input
              type="text"
              value={sessionId}
              onChange={e => setSessionId(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              placeholder="Auto-populated or enter manually"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Task Input:
            </label>
            <textarea
              value={taskInput}
              onChange={e => setTaskInput(e.target.value)}
              className="h-20 w-full rounded border border-gray-300 p-2"
              placeholder="Enter task input (e.g., Hello, how are you?)"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Event Data (JSON):
            </label>
            <textarea
              value={eventData}
              onChange={e => setEventData(e.target.value)}
              className="h-20 w-full rounded border border-gray-300 p-2"
              placeholder='{"name": "HumanResponseEvent", "response": "Hello"}'
            />
          </div>
        </div>

        {/* Right Panel - API Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">API Actions</h2>

          <div className="space-y-2">
            <button
              type="button"
              onClick={getDeployments}
              disabled={loading}
              className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              Get All Deployments
            </button>

            <button
              type="button"
              onClick={createSession}
              disabled={loading}
              className="w-full rounded bg-green-500 p-2 text-white hover:bg-green-600 disabled:opacity-50"
            >
              Create Session
            </button>

            <button
              type="button"
              onClick={getAllTasks}
              disabled={loading}
              className="w-full rounded bg-purple-500 p-2 text-white hover:bg-purple-600 disabled:opacity-50"
            >
              Get All Tasks
            </button>

            <button
              type="button"
              onClick={createDeploymentTask}
              disabled={loading}
              className="w-full rounded bg-orange-500 p-2 text-white hover:bg-orange-600 disabled:opacity-50"
            >
              Create Deployment Task (Wait)
            </button>

            <button
              type="button"
              onClick={createDeploymentTaskNoWait}
              disabled={loading}
              className="w-full rounded bg-yellow-500 p-2 text-white hover:bg-yellow-600 disabled:opacity-50"
            >
              Create Deployment Task (No Wait)
            </button>

            <button
              type="button"
              onClick={sendEventToTask}
              disabled={loading}
              className="w-full rounded bg-red-500 p-2 text-white hover:bg-red-600 disabled:opacity-50"
            >
              Send Event to Task
            </button>

            <button
              type="button"
              onClick={getTaskEvents}
              disabled={loading}
              className="w-full rounded bg-indigo-500 p-2 text-white hover:bg-indigo-600 disabled:opacity-50"
            >
              Get Task Events
            </button>

            <button
              type="button"
              onClick={getTaskResult}
              disabled={loading}
              className="w-full rounded bg-pink-500 p-2 text-white hover:bg-pink-600 disabled:opacity-50"
            >
              Get Task Result
            </button>
          </div>

          {loading ? (
            <div className="text-center text-blue-500">Loading...</div>
          ) : null}
        </div>
      </div>

      {/* Response Panel */}
      <div className="mt-6">
        <h2 className="mb-2 text-lg font-semibold">API Response:</h2>
        <pre className="max-h-96 overflow-auto rounded-lg bg-gray-100 p-4 text-sm">
          {response ||
            'No response yet. Click a button to test an API endpoint.'}
        </pre>
      </div>
    </div>
  )
}
