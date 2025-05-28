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
