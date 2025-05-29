import { NextResponse, type NextRequest } from 'next/server'

const TOKEN_DELAY = 30 // 30ms delay between tokens
const TEXT_PREFIX = '0:' // vercel ai text prefix
const ANNOTATION_PREFIX = '8:' // vercel ai annotation prefix
const INLINE_ANNOTATION_KEY = 'inline_annotation'

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

`
const SAMPLE_ANNOTATIONS = [
  {
    type: 'sources',
    data: {
      nodes: [
        { id: '1', url: '/sample.pdf' },
        { id: '2', url: '/sample.pdf' },
      ],
    },
  },
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
]

const INLINE_ITEMS = [
  '\n ### Demo inline annotations \n',
  'To set up the project, follow these steps: \n',
  '1. Create a package.json file',
  {
    type: 'artifact',
    data: {
      type: 'code',
      data: {
        file_name: 'package.json',
        language: 'json',
        code: `
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "My project",
  "main": "index.js"
}
        `,
      },
    },
  },
  '2. Create a sample.js file',
  {
    type: 'artifact',
    data: {
      type: 'code',
      data: {
        file_name: 'sample.js',
        language: 'javascript',
        code: 'console.log("Hello, world!");',
      },
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

      // const appendText = async (text: string) => {
      //   for (const token of text.split(' ')) {
      //     await new Promise(resolve => setTimeout(resolve, TOKEN_DELAY))
      //     controller.enqueue(
      //       encoder.encode(`${TEXT_PREFIX}${JSON.stringify(`${token} `)}\n`)
      //     )
      //   }
      // }

      for (const token of SAMPLE_TEXT.split(' ')) {
        await new Promise(resolve => setTimeout(resolve, TOKEN_DELAY))
        controller.enqueue(
          encoder.encode(`${TEXT_PREFIX}${JSON.stringify(`${token} `)}\n`)
        )
      }

      // insert annotations in fixed positions
      for (const item of SAMPLE_ANNOTATIONS) {
        controller.enqueue(
          encoder.encode(`${ANNOTATION_PREFIX}${JSON.stringify([item])}\n`)
        )
      }

      for (const item of INLINE_ITEMS) {
        if (typeof item === 'string') {
          controller.enqueue(
            encoder.encode(`${TEXT_PREFIX}${JSON.stringify(item)}\n`)
          )
        } else {
          // append inline annotation with 0: prefix
          const annotationCode = toInlineAnnotationCode(item)
          controller.enqueue(
            encoder.encode(`${TEXT_PREFIX}${JSON.stringify(annotationCode)}\n`)
          )
        }
      }

      controller.close()
    },
  })
}

function toInlineAnnotationCode(item: any) {
  return `\n\`\`\`${INLINE_ANNOTATION_KEY}\n${JSON.stringify(item)}\n\`\`\`\n`
}
