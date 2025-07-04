import { act, renderHook, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useWorkflow } from '../../hook/use-workflow'
import { WorkflowEvent } from '../../hook/use-workflow/types'
import { server } from '../setup'
import { http, HttpResponse } from 'msw'

interface TestEvent extends WorkflowEvent {
  type: string
  data?: any
}

const mockWorkflowParams = {
  baseUrl: 'http://127.0.0.1:4501',
  deployment: 'test-workflow',
}

describe('useWorkflow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic functionality', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() =>
        useWorkflow<TestEvent>(mockWorkflowParams)
      )

      expect(result.current.runId).toBeUndefined()
      expect(result.current.events).toEqual([])
      expect(result.current.status).toBeUndefined()
      expect(typeof result.current.start).toBe('function')
      expect(typeof result.current.stop).toBe('function')
      expect(typeof result.current.sendEvent).toBe('function')
    })

    it('should provide a stable API interface', () => {
      const { result, rerender } = renderHook(() =>
        useWorkflow<TestEvent>(mockWorkflowParams)
      )

      const firstRender = result.current
      rerender()
      const secondRender = result.current

      // Functions should be referentially stable
      expect(firstRender.start).toBe(secondRender.start)
      expect(firstRender.stop).toBe(secondRender.stop)
      expect(firstRender.sendEvent).toBe(secondRender.sendEvent)
    })
  })

  describe('Starting workflow', () => {
    it('should set status to running after task created', async () => {
      const originalHandlers = [...server.listHandlers()]
      let streamController: ReadableStreamDefaultController<Uint8Array>

      try {
        server.use(
          http.get(
            'http://127.0.0.1:4501/deployments/test-workflow/tasks/test-run-id/events',
            () => {
              // Create a proper SSE stream with headers
              const stream = new ReadableStream({
                start(controller) {
                  streamController = controller
                  // Don't send any data initially - simulating long running task
                },
              })

              return new Response(stream, {
                status: 200,
                headers: {
                  'Content-Type': 'text/event-stream',
                  'Cache-Control': 'no-cache',
                  Connection: 'keep-alive',
                },
              })
            }
          )
        )

        const { result } = renderHook(() =>
          useWorkflow<TestEvent>(mockWorkflowParams)
        )
        expect(result.current.status).toBeUndefined()

        act(() => {
          result.current.start({ message: 'test start' })
        })

        await waitFor(() => {
          expect(result.current.runId).toBe('test-run-id')
          // should set to running despite no events received
          expect(result.current.status).toBe('running')
        })

        // Close the stream to complete the workflow
        act(() => {
          streamController.close()
        })

        await waitFor(() => {
          expect(result.current.status).toBe('complete')
        })
      } finally {
        server.resetHandlers(...originalHandlers)
      }
    })

    it('should create a new task and start streaming events', async () => {
      const { result } = renderHook(() =>
        useWorkflow<TestEvent>(mockWorkflowParams)
      )

      await act(async () => {
        await result.current.start({ message: 'test start' })
      })

      // Should have received all mock events
      await waitFor(() => {
        expect(result.current.runId).toBe('test-run-id')
        expect(result.current.events).toHaveLength(12)
        expect(result.current.status).toBe('complete')
      })

      // First event should be a UIEvent
      const firstEvent = result.current.events[0]
      expect(firstEvent.type).toBe('workflow.UIEvent')

      // Last event should be a StopEvent
      const lastEvent = result.current.events[result.current.events.length - 1]
      expect(lastEvent.type).toBe('llama_index.core.workflow.events.StopEvent')
    })

    it('should reset events when starting a new task', async () => {
      const { result } = renderHook(() =>
        useWorkflow<TestEvent>(mockWorkflowParams)
      )

      // Start first task
      await act(async () => {
        await result.current.start({ message: 'first task' })
      })
      await waitFor(() => {
        expect(result.current.events).toHaveLength(12)
        expect(result.current.status).toBe('complete')
      })

      // Start second task - should reset events
      await act(async () => {
        await result.current.start({ message: 'second task' })
      })
      await waitFor(() => {
        expect(result.current.events).toHaveLength(12) // New set of events
        expect(result.current.status).toBe('complete')
      })
    })
  })

  describe('Existing task initialization', () => {
    it('should initialize with existing task ID', async () => {
      const paramsWithRunId = {
        ...mockWorkflowParams,
        runId: 'test-existing-run-id',
      }

      const { result } = renderHook(() =>
        useWorkflow<TestEvent>(paramsWithRunId)
      )

      // Then check for the full expected state
      await waitFor(() => {
        expect(result.current.events).toHaveLength(12)
        expect(result.current.runId).toBe('test-existing-run-id')
        expect(result.current.status).toBe('complete')
      })
    })

    it('should set status to running immediately when reconnecting to existing task', async () => {
      const originalHandlers = [...server.listHandlers()]
      let streamController: ReadableStreamDefaultController<Uint8Array>

      try {
        server.use(
          http.get(
            'http://127.0.0.1:4501/deployments/test-workflow/tasks/test-existing-run-id/events',
            () => {
              // Create a proper SSE stream with headers
              const stream = new ReadableStream({
                start(controller) {
                  streamController = controller
                  // Don't send any data initially - simulating long running task
                },
              })

              return new Response(stream, {
                status: 200,
                headers: {
                  'Content-Type': 'text/event-stream',
                  'Cache-Control': 'no-cache',
                  Connection: 'keep-alive',
                },
              })
            }
          )
        )

        const paramsWithRunId = {
          ...mockWorkflowParams,
          runId: 'test-existing-run-id',
        }

        const { result } = renderHook(() =>
          useWorkflow<TestEvent>(paramsWithRunId)
        )

        // Should set status to running immediately when reconnecting to existing task
        await waitFor(() => {
          expect(result.current.runId).toBe('test-existing-run-id')
          // should set to running after headers received but before events
          expect(result.current.status).toBe('running')
        })

        // Close the stream to complete the workflow
        act(() => {
          streamController.close()
        })

        await waitFor(() => {
          expect(result.current.status).toBe('complete')
        })
      } finally {
        server.resetHandlers(...originalHandlers)
      }
    })
  })

  describe('Error handling', () => {
    it('should handle streaming errors', async () => {
      const onError = vi.fn()
      const paramsWithErrorHandler = {
        ...mockWorkflowParams,
        onError,
      }

      // Mock streaming error
      server.use(
        http.get(
          'http://127.0.0.1:4501/deployments/test-workflow/tasks/test-run-id/events',
          () => {
            return HttpResponse.json(
              { error: 'Streaming failed' },
              { status: 500 }
            )
          }
        )
      )

      const { result } = renderHook(() =>
        useWorkflow<TestEvent>(paramsWithErrorHandler)
      )

      await act(async () => {
        await result.current.start({ message: 'test start' }).catch(error => {
          expect(error).toBeDefined()
        })
      })

      await waitFor(() => {
        expect(onError).toHaveBeenCalled()
        expect(result.current.status).toBe('error')
      })
    })
  })

  describe('Event handling', () => {
    it('should throw error when sending event without task', async () => {
      const { result } = renderHook(() =>
        useWorkflow<TestEvent>(mockWorkflowParams)
      )

      const customEvent: TestEvent = { type: 'custom.AdHocEvent' }

      await expect(
        act(async () => {
          await result.current.sendEvent(customEvent)
        })
      ).rejects.toThrow('Task is not initialized')
    })

    it('should send events to existing task', async () => {
      const { result } = renderHook(() =>
        useWorkflow<TestEvent>(mockWorkflowParams)
      )

      // Start a task first
      // eslint-disable-next-line @typescript-eslint/require-await -- no wait to test long running task
      await act(async () => {
        result.current.start({
          message: 'test long running task',
          delay: true, // flag to make task long running
        })
      })

      // Send a custom event
      await act(async () => {
        await result.current.sendEvent({ type: 'custom.AdHocEvent1' })
      })

      // wait for 3 seconds to make sure stream is complete
      await act(async () => {
        await new Promise(resolve => {
          setTimeout(resolve, 3000)
        })
      })

      await waitFor(() => expect(result.current.events).toHaveLength(13))
    })

    it('should send stop event', async () => {
      const { result } = renderHook(() =>
        useWorkflow<TestEvent>(mockWorkflowParams)
      )

      // Start a task first
      // eslint-disable-next-line @typescript-eslint/require-await -- no wait to test long running task
      await act(async () => {
        result.current.start({
          message: 'test long running task',
          delay: true, // flag to make task long running
        })
      })

      // wait for 100ms to have some events in the stream
      await act(async () => {
        await new Promise(resolve => {
          setTimeout(resolve, 100)
        })
      })

      // Send a stop event
      await act(async () => {
        await result.current.stop()
      })

      // wait for 3 seconds to make sure stream is complete
      await act(async () => {
        await new Promise(resolve => {
          setTimeout(resolve, 2000)
        })
      })

      // events list should not be completed
      await waitFor(() => expect(result.current.events.length).toBeLessThan(13))
    })
  })

  describe('Chunk parsing', () => {
    it('should handle incomplete JSON chunks and retry parsing', async () => {
      const originalHandlers = [...server.listHandlers()]

      try {
        const incompleteChunk1 = `{"__is_pydantic": true, "value": {"type": "ui_event", "data": {"id": null, "event": "analyze", "state": "inpro`
        const incompleteChunk2 = `gress", "question": null, "answer": null}}, "qualified_name": "llama_index.core.chat_ui.events.UIEvent"}
{"__is_pydantic": true, "value": {}, "qualified_name": "llama_index.core.workflow.events.StopEvent"}`

        server.use(
          http.get(
            'http://127.0.0.1:4501/deployments/test-workflow/tasks/test-run-id/events',
            () => {
              const encoder = new TextEncoder()
              const stream = new ReadableStream({
                start(controller) {
                  // Send incomplete chunk first
                  controller.enqueue(encoder.encode(incompleteChunk1))

                  // Wait a bit, then send the completion
                  setTimeout(() => {
                    controller.enqueue(encoder.encode(incompleteChunk2))
                    controller.close()
                  }, 10)
                },
              })

              return new HttpResponse(stream, {
                headers: { 'Content-Type': 'application/json' },
              })
            }
          )
        )

        const { result } = renderHook(() =>
          useWorkflow<TestEvent>(mockWorkflowParams)
        )

        await act(async () => {
          await result.current.start({ message: 'test incomplete chunks' })
        })

        await waitFor(() => {
          expect(result.current.events).toHaveLength(2)
          expect(result.current.status).toBe('complete')
        })

        // First event should be the reconstructed incomplete chunk
        const firstEvent = result.current.events[0]
        expect(firstEvent.type).toBe('llama_index.core.chat_ui.events.UIEvent')
        expect(firstEvent.data.type).toBe('ui_event')
        expect(firstEvent.data.data.event).toBe('analyze')
        expect(firstEvent.data.data.state).toBe('inprogress')
        expect(firstEvent.data.data.id).toBeNull()

        // Second event should be the stop event
        const lastEvent = result.current.events[1]
        expect(lastEvent.type).toBe(
          'llama_index.core.workflow.events.StopEvent'
        )
      } finally {
        server.resetHandlers(...originalHandlers)
      }
    })
  })
})
