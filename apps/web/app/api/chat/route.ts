import { Message, LlamaIndexAdapter, StreamData } from 'ai'
import {
  ChatMessage,
  OpenAI,
  OpenAIEmbedding,
  Settings,
  SimpleChatEngine,
} from 'llamaindex'
import { NextResponse, type NextRequest } from 'next/server'
import { fakeStreamText } from '@/app/utils'

export const runtime = 'node'
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

    const vercelStreamData = new StreamData()

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
      chatHistory: messages as ChatMessage[],
      stream: true,
    })

    return LlamaIndexAdapter.toDataStreamResponse(response, {
      data: vercelStreamData,
      callbacks: {
        onCompletion: async () => {
          await vercelStreamData.close()
        },
      },
    })
  } catch (error) {
    const detail = (error as Error).message
    return NextResponse.json({ detail }, { status: 500 })
  }
}
