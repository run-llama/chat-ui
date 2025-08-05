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

export interface MessagePart {
  id?: string
  type: string
  data?: any
}

export async function chatHandler(
  request: NextRequest,
  parts: (string | MessagePart)[]
) {
  try {
    // extract query from last message
    const { messages } = await request.json()
    const query = messages[messages.length - 1]?.parts[0]?.text ?? ''

    // create a stream
    const stream = fakeChatStream(`User query: "${query}".\n`, parts)

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

const fakeChatStream = (
  query: string,
  parts: (string | MessagePart)[]
): ReadableStream => {
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

      for (const item of parts) {
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
