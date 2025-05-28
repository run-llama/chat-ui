import { Message } from 'ai'
import { faker } from '@faker-js/faker'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { messages } = (await request.json()) as { messages: Message[] }
    const lastMessage = messages[messages.length - 1]

    const stream = fakeChatStream(lastMessage.content)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    const detail = (error as Error).message
    return NextResponse.json({ detail }, { status: 500 })
  }
}

const TOKEN_DELAY = 30 // 30ms delay between tokens

const fakeChatStream = (query: string): ReadableStream => {
  const markdown = `
  Hello, this is the same response for your query: "${query}"
  #### Markdown Response
  ${faker.lorem.paragraphs({ min: 1, max: 3 })}
  `
  const markdownTokens = markdown.split(' ')

  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      for (const token of markdownTokens) {
        await new Promise(resolve => setTimeout(resolve, TOKEN_DELAY))
        controller.enqueue(encoder.encode(`0:${JSON.stringify(token + ' ')}\n`))
      }

      controller.close()
    },
  })
}
