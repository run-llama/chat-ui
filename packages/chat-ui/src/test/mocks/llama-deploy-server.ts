import { http, HttpResponse } from 'msw'
import { RawEvent } from '../../hook/use-workflow/types'

const BASE_URL = 'http://127.0.0.1:4501'

// Mock task data
const mockTask = {
  task_id: 'test-run-id',
  session_id: 'test-session-id',
  service_id: 'echo_workflow',
  input: '{"message": "Please run task"}',
}

const mockExistingTask = {
  task_id: 'test-existing-run-id',
  session_id: 'test-existing-session-id',
  service_id: 'echo_workflow',
  input: '{"message": "Please run existing task"}',
}

const mockTasks = [mockExistingTask, mockTask]

const welcomeEvent = {
  __is_pydantic: true,
  value: { data: { request: 'Welcome to the workflow' } },
  qualified_name: 'workflow.UIEvent',
}

// Mock event data
const mockEvents = [
  // Mock an UIEvent after task is created
  {
    __is_pydantic: true,
    value: { data: { request: 'Please run task' } },
    qualified_name: 'workflow.UIEvent',
  },

  // Mock some events for counter
  ...Array.from({ length: 9 }, (_, index) => ({
    __is_pydantic: true,
    value: { data: { counter: index } },
    qualified_name: 'workflow.UIEvent',
  })),

  // Mock StopEvent
  {
    __is_pydantic: true,
    value: {},
    qualified_name: 'llama_index.core.workflow.events.StopEvent',
  },
]

// Global state to simulate events queue
const eventsQueue: RawEvent[] = []
let delayAfterStart = 10 // delay in ms

export const mockLlamaDeployServer = [
  // GET /deployments/{deployment_name}/tasks - Get existing tasks
  http.get(`${BASE_URL}/deployments/:deploymentName/tasks`, () => {
    return HttpResponse.json(mockTasks)
  }),

  // POST /deployments/{deployment_name}/tasks/create - Create new task
  http.post(
    `${BASE_URL}/deployments/:deploymentName/tasks/create`,
    async ({ request }) => {
      const { input } = (await request.json()) as { input: string }
      const delay = JSON.parse(input).delay
      if (delay) {
        delayAfterStart = 100
      }
      return HttpResponse.json(mockTask)
    }
  ),

  // GET /deployments/{deployment_name}/tasks/{task_id}/events - Stream events
  http.get(
    `${BASE_URL}/deployments/:deploymentName/tasks/:taskId/events`,
    () => {
      // Return a readable stream of events
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode(`${JSON.stringify(welcomeEvent)}\n`)
          )

          let eventIndex = 0

          const sendNextEvent = () => {
            if (eventIndex >= mockEvents.length) {
              controller.close()
              return
            }

            const event = mockEvents[eventIndex]
            controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`))
            eventIndex++

            if (eventsQueue.length > 0) {
              // continuously consume events from the queue
              const nextEvent = eventsQueue.shift()
              controller.enqueue(
                encoder.encode(`${JSON.stringify(nextEvent)}\n`)
              )
              if (
                nextEvent?.qualified_name ===
                'llama_index.core.workflow.events.StopEvent'
              ) {
                controller.close()
                return
              }
            }

            if (
              event.qualified_name ===
              'llama_index.core.workflow.events.StopEvent'
            ) {
              controller.close()
              return
            }

            setTimeout(sendNextEvent, delayAfterStart)
          }

          // Start sending events
          sendNextEvent()
        },
      })

      return new HttpResponse(stream, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  ),

  // POST /deployments/{deployment_name}/tasks/{task_id}/events - Send event
  http.post(
    `${BASE_URL}/deployments/:deploymentName/tasks/:taskId/events`,
    async ({ request }) => {
      const event = (await request.json()) as { event_obj_str: string }
      if (event) {
        // simulate an event queue
        eventsQueue.push(JSON.parse(event.event_obj_str) as RawEvent)
      }
      return HttpResponse.json({ data: { success: true } })
    }
  ),
]
