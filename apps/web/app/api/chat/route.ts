import { type ChatMessage, Settings, SimpleChatEngine } from 'llamaindex'
import { NextResponse, type NextRequest } from 'next/server'
import { fakeStreamText } from '@/app/utils'
import { OpenAI } from '@llamaindex/openai'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

Settings.llm = new OpenAI({ model: 'gpt-4o-mini' })

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { messages: ChatMessage[] }
    const messages = body.messages
    const lastMessage = messages[messages.length - 1]

    if (!process.env.OPENAI_API_KEY) {
      // Return fake stream if API key is not set
      return new Response(fakeStreamText(), {
        headers: {
          'Content-Type': 'text/plain',
          Connection: 'keep-alive',
        },
      })
    }

    const chatEngine = new SimpleChatEngine()

    const response = await chatEngine.chat({
      message: lastMessage.content,
      chatHistory: messages,
      stream: true,
    })

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        for await (const chunk of response) {
          controller.enqueue(
            encoder.encode(`0:${JSON.stringify(chunk.delta)}\n`)
          )
        }
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    const detail = (error as Error).message
    return NextResponse.json({ detail }, { status: 500 })
  }
}
