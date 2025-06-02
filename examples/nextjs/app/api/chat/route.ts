/**
 * Basic Chat API Route Example
 *
 * This is a simple example demonstrating:
 * - Text streaming with token-by-token delivery
 * - Basic markdown content with code blocks
 * - Custom annotations (weather) sent after text completion
 * - Standard annotations (sources) sent after text completion
 *
 * Use this example as a starting point for implementing basic chat functionality
 * with @llamaindex/chat-ui components.
 */
import { NextResponse, type NextRequest } from 'next/server'

const TOKEN_DELAY = 30 // 30ms delay between tokens
const TEXT_PREFIX = '0:' // vercel ai text prefix
const ANNOTATION_PREFIX = '8:' // vercel ai annotation prefix

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()
    const lastMessage = messages[messages.length - 1]

    const stream = fakeChatStream(`User query: "${lastMessage.content}".\n`)

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

const SAMPLE_TEXT = `
Welcome to the demo of @llamaindex/chat-ui. Let me show you the different types of components that can be triggered from the server.

### Markdown with code block

\`\`\`js
const a = 1
const b = 2
const c = a + b
console.log(c)
\`\`\`

### Annotations

`
const SAMPLE_ANNOTATIONS = [
  {
    type: 'weather',
    data: {
      location: 'San Francisco, CA',
      temperature: 22,
      condition: 'sunny',
      humidity: 65,
      windSpeed: 12,
    },
  },
  {
    type: 'sources',
    data: {
      nodes: [
        { id: '1', url: '/sample.pdf' },
        { id: '2', url: '/sample.pdf' },
      ],
    },
  },
]

const fakeChatStream = (query: string): ReadableStream => {
  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      controller.enqueue(
        encoder.encode(`${TEXT_PREFIX}${JSON.stringify(query)}\n`)
      )

      for (const token of SAMPLE_TEXT.split(' ')) {
        await new Promise(resolve => setTimeout(resolve, TOKEN_DELAY))
        controller.enqueue(
          encoder.encode(`${TEXT_PREFIX}${JSON.stringify(`${token} `)}\n`)
        )
      }

      for (const item of SAMPLE_ANNOTATIONS) {
        controller.enqueue(
          encoder.encode(`${ANNOTATION_PREFIX}${JSON.stringify([item])}\n`)
        )
      }

      controller.close()
    },
  })
}
