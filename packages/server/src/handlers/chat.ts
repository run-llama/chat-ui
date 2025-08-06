import { type UIMessage } from '@ai-sdk/react'
import { stopAgentEvent } from '@llamaindex/workflow'
import { IncomingMessage, ServerResponse } from 'http'
import type { ChatMessage, MessageType } from 'llamaindex'
import { type WorkflowFactory } from '../types'
import {
  processWorkflowStream,
  runWorkflow,
  sendSuggestedQuestionsEvent,
  ServerMessage,
  toDataStream,
} from '../utils'
import { pauseForHumanInput } from '../utils/hitl'
import {
  parseRequestBody,
  pipeStreamToResponse,
  sendJSONResponse,
} from '../utils/request'

export const handleChat = async (
  req: IncomingMessage,
  res: ServerResponse,
  workflowFactory: WorkflowFactory,
  suggestNextQuestions: boolean,
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

    const context = await runWorkflow({
      workflow: await workflowFactory(body),
      input: { userInput, chatHistory },
      human: {
        snapshotId: requestId, // use requestId to restore snapshot
        responses: serverMessage.humanResponse,
      },
    })

    const stream = processWorkflowStream(
      context.stream,
      llamaCloudOutputDir
    ).until(
      event => abortController.signal.aborted || stopAgentEvent.include(event)
    )

    const dataStream = toDataStream(stream, {
      callbacks: {
        onPauseForHumanInput: async responseEvent => {
          await pauseForHumanInput(context, responseEvent, requestId) // use requestId to save snapshot
        },
        onFinal: async (completion, dataStreamWriter) => {
          chatHistory.push({
            role: 'assistant' as MessageType,
            content: completion,
          })
          if (suggestNextQuestions) {
            await sendSuggestedQuestionsEvent(dataStreamWriter, chatHistory)
          }
        },
      },
    })
    pipeStreamToResponse(res, dataStream)
  } catch (error) {
    console.error('Chat handler error:', error)
    return sendJSONResponse(res, 500, {
      detail: (error as Error).message || 'Internal server error',
    })
  }
}
