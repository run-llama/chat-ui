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
 * with \@llamaindex/chat-ui components.
 */
import { NextResponse, type NextRequest } from 'next/server'

const TOKEN_DELAY = 30 // 30ms delay between tokens
const DATA_PREFIX = 'data: ' // use data: prefix for SSE format

interface TextChunk {
  type: 'text-delta' | 'text-start' | 'text-end'
  id: string
  delta?: string
}

interface DataChunk {
  type: `data-${string}` // requires `data-` prefix when sending data parts
  data: Record<string, any>
}

export async function POST(request: NextRequest) {
  try {
    // extract query from last message
    const { messages } = await request.json()
    const query = messages[messages.length - 1]?.parts[0]?.text ?? ''

    // create a stream
    const stream = fakeChatStream(`User query: "${query}".\n`)

    // return the stream
    return new Response(stream, {
      // Set headers for Server-Sent Events (SSE)
      headers: {
        'Content-Type': 'text/event-stream',
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

      function writeStream(chunk: TextChunk | DataChunk) {
        controller.enqueue(
          encoder.encode(`${DATA_PREFIX}${JSON.stringify(chunk)}\n\n`)
        )
      }

      async function writeTextMessage(content: string) {
        // init a unique message id
        const messageId = crypto.randomUUID()

        // important: we need to write the start chunk first
        const startChunk: TextChunk = { id: messageId, type: 'text-start' }
        writeStream(startChunk)

        // simulate token-by-token streaming
        for (const token of content.split(' ')) {
          const deltaChunk: TextChunk = {
            id: messageId,
            type: 'text-delta',
            delta: token + ' ',
          }
          writeStream(deltaChunk)
          await new Promise(resolve => setTimeout(resolve, TOKEN_DELAY))
        }

        // important: we need to write the end chunk last
        const endChunk: TextChunk = { id: messageId, type: 'text-end' }

        writeStream(endChunk)
      }

      async function writeAnnotation(anno: { type: string; data: any }) {
        const chunk: DataChunk = {
          type: `data-${anno.type}`,
          data: anno.data,
        }
        writeStream(chunk)
      }

      // show the query message
      await writeTextMessage(query)

      // show the sample text message
      await writeTextMessage(SAMPLE_TEXT)

      // show the sample annotations
      for (const item of SAMPLE_ANNOTATIONS) {
        await writeAnnotation(item)
      }

      controller.close()
    },
  })
}
