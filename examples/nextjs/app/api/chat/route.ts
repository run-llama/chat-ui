import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const stream = fakeChatStream()

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
const TEXT_PREFIX = '0:' // vercel ai text prefix
const ANNOTATION_PREFIX = '8:' // vercel ai annotation prefix

const SAMPLE_TEXT = `
Welcome to the demo of @llamaindex/chat-ui. Let me show you the different types of components that can be triggered from the server

### Example Sources

\`\`\`js
{
  type: 'sources',
  data: { 
    nodes: [
      { id: '1', url: '/sample.pdf' }, 
      { id: '2', url: '/sample.pdf' }
    ] 
  }
}
\`\`\`

### Example Artifacts 

\`\`\`js
{
  type: 'artifact',
  data: {
    type: 'code',
    data: { 
      file_name: 'sample.ts', 
      language: 'typescript', 
      code: 'console.log("Hello, world!");' 
    }
  }
}
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
    type: 'artifact',
    data: {
      type: 'code',
      data: {
        file_name: 'sample.ts',
        language: 'typescript',
        code: 'console.log("Hello, world!");',
      },
    },
  },
]

const fakeChatStream = (): ReadableStream => {
  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      for (const token of SAMPLE_TEXT.split(' ')) {
        await new Promise(resolve => setTimeout(resolve, TOKEN_DELAY))
        controller.enqueue(
          encoder.encode(`${TEXT_PREFIX}${JSON.stringify(token + ' ')}\n`)
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
