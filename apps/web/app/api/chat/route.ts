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

    const stream = await chatEngine.chat({
      message: messageContent,
      chatHistory: messages.map(message => ({
        role: message.role,
        content: message.parts as MessageContentDetail[],
      })),
      stream: true,
    })

    return toUIMessageStream(stream)
  } catch (error) {
    const detail = (error as Error).message
    return NextResponse.json({ detail }, { status: 500 })
  }
}
