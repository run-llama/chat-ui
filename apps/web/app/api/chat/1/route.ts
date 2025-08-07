import { fakeStreamText } from '@/app/utils'
import { toUIMessageStream } from '@ai-sdk/llamaindex'
import { UIMessage as Message } from '@ai-sdk/react'
import {
  MessageContentDetail,
  OpenAI,
  OpenAIEmbedding,
  Settings,
  SimpleChatEngine,
} from 'llamaindex'
import { NextResponse, type NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DATA_PREFIX = 'data: '
const TOKEN_DELAY = 100

Settings.llm = new OpenAI({ model: 'gpt-4o-mini' })
Settings.embedModel = new OpenAIEmbedding({
  model: 'text-embedding-3-large',
  dimensions: 1024,
})

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { messages: Message[] }
    const messages = body.messages
    const lastMessage = messages[messages.length - 1]

    if (!process.env.OPENAI_API_KEY) {
      // Return fake stream if API key is not set
      return new Response(fakeStreamText(), {
        headers: {
          'Content-Type': 'text/event-stream',
          Connection: 'keep-alive',
        },
      })
    }

    const chatEngine = new SimpleChatEngine()

    const messageContent = (lastMessage.parts[0] as { text: string }).text ?? ''

    const response = await chatEngine.chat({
      message: messageContent,
      chatHistory: messages.map(message => ({
        role: message.role,
        content: message.parts as MessageContentDetail[],
      })),
      stream: true,
    })

    // TODO: `toUIMessageStream` not working as expected now
    // const sseStream = toUIMessageStream(response)

    const sseStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        // New SSE format with text chunks
        function writeStream(chunk: {
          id: string
          type: string
          delta?: string
        }) {
          controller.enqueue(
            encoder.encode(`${DATA_PREFIX}${JSON.stringify(chunk)}\n\n`)
          )
        }

        // Generate a unique message id
        const messageId = crypto.randomUUID()

        // Start the text chunk
        const startChunk = { id: messageId, type: 'text-start' }
        writeStream(startChunk)

        // Consume the response and write the chunks to the controller
        for await (const chunk of response) {
          writeStream({
            id: messageId,
            type: 'text-delta',
            delta: chunk.delta,
          })
        }

        // End the text chunk
        const endChunk = { id: messageId, type: 'text-end' }
        writeStream(endChunk)

        controller.close()
      },
    })

    return new Response(sseStream, {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'text/event-stream',
        connection: 'keep-alive',
      },
    })
  } catch (error) {
    const detail = (error as Error).message
    return NextResponse.json({ detail }, { status: 500 })
  }
}
