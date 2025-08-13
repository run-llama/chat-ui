import { type UIMessage } from '@ai-sdk/react'
import { stopAgentEvent } from '@llamaindex/workflow'
import { IncomingMessage, ServerResponse } from 'http'
import type { ChatMessage } from 'llamaindex'
import { type WorkflowFactory } from '../types'
import { runWorkflow, ServerMessage } from '../utils'
import {
  parseRequestBody,
  pipeStreamToResponse,
  sendJSONResponse,
} from '../utils/request'
import { AgentWorkflowAdapter, ServerAdapter } from '../utils/stream'
import { QueryEngineToolResultParser } from '../utils/tool'

export const handleChat = async (
  req: IncomingMessage,
  res: ServerResponse,
  workflowFactory: WorkflowFactory,
  enableSuggestion: boolean,
  llamaCloudOutputDir?: string
) => {
  const abortController = new AbortController()
  res.on('close', () => abortController.abort('Connection closed'))

  try {
    const body = await parseRequestBody(req)
    const { messages, id: requestId } = body as {
      messages: UIMessage[]
      id?: string
    }

    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role !== 'user' || !lastMessage.parts.length) {
      return sendJSONResponse(res, 400, {
        error: 'Messages cannot be empty and last message must be from user',
      })
    }

    const serverMessage = new ServerMessage(lastMessage)

    const userInput = serverMessage.llamaindexMessage.content
    const chatHistory: ChatMessage[] = messages.map(
      message => new ServerMessage(message).llamaindexMessage
    )

    // run workflow
    const context = await runWorkflow({
      workflow: await workflowFactory(body),
      input: { userInput, chatHistory },
      human: {
        snapshotId: requestId, // use requestId to restore snapshot
        responses: serverMessage.humanResponse,
      },
    })

    // get workflow stream from workflow context
    const workflowStream = context.stream.until(
      event => abortController.signal.aborted || stopAgentEvent.include(event)
    )

    // define parsers to transform tool call result to events
    const parsers = [
      new QueryEngineToolResultParser(llamaCloudOutputDir), // transform query engine tool result to source event
    ]

    // transform workflow stream to SSE format
    const stream = workflowStream
      .pipeThrough(AgentWorkflowAdapter.processStreamEvents()) // convert agentStreamEvent to textDeltaEvent
      .pipeThrough(AgentWorkflowAdapter.processToolCallEvents()) // convert agentToolCallEvent to runEvent with loading
      .pipeThrough(AgentWorkflowAdapter.processToolCallResultEvents(parsers)) // parse agentToolCallResultEvent to events
      .pipeThrough(ServerAdapter.processDownloadResources()) // download resources in background if detected
      .pipeThrough(ServerAdapter.processHumanEvents({ context, requestId })) // handle human input event
      .pipeThrough(ServerAdapter.postActions({ chatHistory, enableSuggestion })) // actions on stream finished
      .pipeThrough(ServerAdapter.transformToSSE()) // transform all events to SSE format

    // pipe stream to response
    pipeStreamToResponse(res, stream)
  } catch (error) {
    console.error('Chat handler error:', error)
    return sendJSONResponse(res, 500, {
      detail: (error as Error).message || 'Internal server error',
    })
  }
}
