import { type UIMessage } from '@ai-sdk/react'
import { NextRequest, NextResponse } from 'next/server'

// import chat utils
import {
  AgentWorkflowAdapter,
  QueryEngineToolResultParser,
  runWorkflow,
  ServerAdapter,
  ServerMessage,
} from './utils'

// import workflow factory and settings from local file
import { stopAgentEvent } from '@llamaindex/workflow'
import { initSettings } from './app/settings'
import { workflowFactory } from './app/workflow'
import { ChatMessage } from 'llamaindex'

initSettings()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const enableSuggestion = process.env.SUGGEST_NEXT_QUESTIONS === 'true'
    const llamaCloudOutputDir =
      process.env.LLAMA_CLOUD_OUTPUT_DIR ?? 'output/llamacloud'

    const { messages, id: requestId } = body as {
      messages: UIMessage[]
      id?: string
    }

    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role !== 'user' || !lastMessage.parts.length) {
      return NextResponse.json(
        {
          detail: 'Messages cannot be empty and last message must be from user',
        },
        { status: 400 }
      )
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

    // abort controller
    const abortController = new AbortController()
    req.signal.addEventListener('abort', () =>
      abortController.abort('Connection closed')
    )

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

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Chat handler error:', error)
    return NextResponse.json(
      {
        detail: (error as Error).message || 'Internal server error',
      },
      { status: 500 }
    )
  }
}
