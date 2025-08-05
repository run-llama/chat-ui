/**
 * Basic Chat API Route Example
 *
 * This is a simple example demonstrating:
 * - Text streaming with token-by-token delivery
 * - Basic markdown content with code blocks
 * - Standard parts (sources) sent after text completion
 * - Custom parts (weather) sent after text completion
 *
 */
import { NextResponse, type NextRequest } from 'next/server'

const TOKEN_DELAY = 30 // 30ms delay between tokens
const PART_DELAY = 1000 // 1s delay between parts
const DATA_PREFIX = 'data: ' // use data: prefix for SSE format

interface TextChunk {
  type: 'text-delta' | 'text-start' | 'text-end'
  id: string
  delta?: string
}

interface DataChunk {
  id?: string // optional id for data parts. Only the last data part with that id will be shown
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

### Parts

`
const SAMPLE_PARTS = [
  `
  Welcome to the demo of @llamaindex/chat-ui. Let me show you the different types of components that can be triggered from the server.

### Markdown with code block

\`\`\`js
const a = 1
const b = 2
const c = a + b
console.log(c)
\`\`\`

### Parts with files, events, weather, sources, and suggestions

First, let analyze the uploaded file:
  `,
  {
    type: 'file',
    data: { name: 'upload.pdf', url: '/upload.pdf' },
  },
  'Then, let me call a tool to get the weather in San Francisco:',
  {
    id: 'demo_sample_event_id',
    type: 'event',
    data: {
      title: 'Calling tool `get_weather` with input `San Francisco, CA`',
      status: 'pending',
    },
  },
  'Get the result from the tool:',
  {
    id: 'demo_sample_event_id', // use the same id to override the previous part
    type: 'event',
    data: {
      title:
        'Got response from tool `get_weather` with input `San Francisco, CA`',
      status: 'success',
      data: {
        location: 'San Francisco, CA',
        temperature: 22,
        condition: 'sunny',
        humidity: 65,
        windSpeed: 12,
      },
    },
  },
  'Let me show a weather card:',
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
  'Let me generate a code artifact:',
  {
    type: 'artifact',
    data: {
      type: 'code',
      data: {
        file_name: 'code.py',
        code: 'print("Hello, world!")',
        language: 'python',
      },
    },
  },
  'Let me show the sources:',
  {
    type: 'sources',
    data: {
      nodes: [
        { id: '1', url: '/sample.pdf' },
        { id: '2', url: '/sample.pdf' },
      ],
    },
  },
  'Let me show a suggestion:',
  {
    type: 'suggested-questions',
    data: [
      'I think you should go to the beach',
      'I think you should go to the mountains',
      'I think you should go to the city',
    ],
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

      async function writeText(content: string) {
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

      async function writeData(data: {
        type: string
        data?: any
        id?: string
      }) {
        const chunk: DataChunk = {
          id: data.id,
          type: `data-${data.type}`,
          data: data.data,
        }
        writeStream(chunk)
        await new Promise(resolve => setTimeout(resolve, PART_DELAY))
      }

      // show the query message
      await writeText(query)

      // show the sample text message
      await writeText(SAMPLE_TEXT)

      for (const item of SAMPLE_PARTS) {
        if (typeof item === 'string') {
          await writeText(item)
        } else {
          await writeData(item)
        }
      }

      controller.close()
    },
  })
}
