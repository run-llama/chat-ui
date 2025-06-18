import { http, HttpResponse } from 'msw'

const BASE_URL = 'http://127.0.0.1:4501'

// Mock task data
const mockTask = {
  task_id: 'test-task-id',
  session_id: 'test-session-id',
  service_id: 'echo_workflow',
  input: '{"message": "Please run task"}',
}

const mockExistingTask = {
  task_id: 'test-existing-task-id',
  session_id: 'test-existing-session-id',
  service_id: 'echo_workflow',
  input: '{"message": "Please run existing task"}',
}

const mockTasks = [mockExistingTask, mockTask]

// Mock event data
const mockEvents = [
  // Mock an UIEvent after task is created
  {
    __is_pydantic: true,
    value: { data: { request: 'Please run task' } },
    qualified_name: 'workflow.UIEvent',
  },

  // Mock some events for counter
  ...Array.from({ length: 5 }, (_, index) => ({
    __is_pydantic: true,
    value: { data: { counter: index } },
    qualified_name: 'workflow.UIEvent',
  })),

  // Mock an event for AdHocEvent
  {
    __is_pydantic: true,
    value: {
      data: { request: 'User want to retrieve counter. Current value: 4' },
    },
    qualified_name: 'workflow.UIEvent',
  },

  // Mock more events for counter
  ...Array.from({ length: 5 }, (_, index) => ({
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

export const mockLlamaDeployServer = [
  // GET /deployments/{deployment_name}/tasks - Get existing tasks
  http.get(`${BASE_URL}/deployments/:deploymentName/tasks`, () => {
    return HttpResponse.json(mockTasks)
  }),

  // POST /deployments/{deployment_name}/tasks/create - Create new task
  http.post(`${BASE_URL}/deployments/:deploymentName/tasks/create`, () => {
    return HttpResponse.json(mockTask)
  }),

  // GET /deployments/{deployment_name}/tasks/{task_id}/events - Stream events
  http.get(
    `${BASE_URL}/deployments/:deploymentName/tasks/:taskId/events`,
    () => {
      // Return a readable stream of events
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          mockEvents.forEach((event, index) => {
            setTimeout(() => {
              controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`))
              if (index === mockEvents.length - 1) {
                controller.close()
              }
            }, index * 10) // Simulate streaming with delays
          })
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
    () => {
      return HttpResponse.json({ data: { success: true } })
    }
  ),
]
