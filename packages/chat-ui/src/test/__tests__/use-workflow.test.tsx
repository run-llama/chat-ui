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
      let resolve: () => void = () => {} // eslint-disable-line @typescript-eslint/no-empty-function -- empty until set by Promise
      try {
        server.use(
          http.get(
            'http://127.0.0.1:4501/deployments/test-workflow/tasks/test-run-id/events',
            () => {
              return new Promise(resolver => {
                // simulating a long running task with no events
                resolve = resolver
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
        resolve()
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
      let resolve: () => void = () => {} // eslint-disable-line @typescript-eslint/no-empty-function -- empty until set by Promise

      try {
        server.use(
          http.get(
            'http://127.0.0.1:4501/deployments/test-workflow/tasks/test-existing-run-id/events',
            () => {
              return new Promise(resolver => {
                // simulating a long running task with no events
                resolve = resolver
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
          // should set to running despite no events received yet
          expect(result.current.status).toBe('running')
        })

        resolve()
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
})
