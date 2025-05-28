import {
  Artifact,
  CodeArtifact,
  ImageData,
  SourceData,
} from '@llamaindex/chat-ui'
import { Message } from 'ai'
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
const TEXT_PREFIX = '0:' // vercel ai text prefix
const ANNOTATION_PREFIX = '8:' // vercel ai annotation prefix

const fakeChatStream = (query: string): ReadableStream => {
  const markdown = `
  Hello, this is the same markdown response for your query: "${query}"
  #### Markdown Response
  Here is a sample response with different Markdown elements:

  - Bullet point 1
  - Bullet point 2 
  - Bullet point 3

  **Bold text** and *italic text*

  > This is a blockquote

  \`\`\`javascript
  // Code block example
  function hello() {
    console.log("Hello world!");
  }
  \`\`\`

  1. Numbered list item 1
  2. Numbered list item 2
  3. Numbered list item 3

  [Example Link](https://example.com)

  | Table Header 1 | Table Header 2 |
  |---------------|----------------|
  | Row 1 Cell 1  | Row 1 Cell 2  |
  | Row 2 Cell 1  | Row 2 Cell 2  |
  `

  const annotations = [
    // {
    //   type: 'image',
    //   data: {
    //     url: '/llama.png',
    //   },
    // },
    {
      type: 'sources',
      data: {
        nodes: [
          { id: '1', url: '/sample.pdf' },
          { id: '2', url: '/sample.pdf' },
        ],
      } as SourceData,
    },
    {
      type: 'artifact',
      data: {
        type: 'code',
        data: {
          file_name: 'sample.ts',
          language: 'typescript',
          code: 'function greetUser(name: string) {\n  console.log("Hello " + name + "!");\n  const message = "Welcome to LlamaIndex Chat UI";\n  console.log(message);\n}',
        },
      } as CodeArtifact,
    },
  ]

  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      // utils function to append sample text to the stream
      const appendText = async (text: string) => {
        for (const token of text.split(' ')) {
          await new Promise(resolve => setTimeout(resolve, TOKEN_DELAY))
          controller.enqueue(
            encoder.encode(`${TEXT_PREFIX}${JSON.stringify(token + ' ')}\n`)
          )
        }
      }

      await appendText(
        "Welcome to @llamaindex/chat-ui. Here's the demo of how to the different components are triggered from the server"
      )

      for (const item of annotations) {
        controller.enqueue(
          encoder.encode(`${ANNOTATION_PREFIX}${JSON.stringify([item])}\n`)
        )
      }

      controller.close()
    },
  })
}
