/**
 * Advanced Chat API Route Example
 *
 * This example demonstrates advanced streaming features:
 * - Text streaming with token-by-token delivery
 * - Both standard annotations (sent after text) and inline annotations (embedded in text)
 * - Inline annotations are embedded as special code blocks within the markdown stream
 * - Multiple annotation types: sources, artifacts, and custom components (wiki)
 *
 * Use this example to understand how to mix regular content with interactive
 * components that appear at specific positions in the chat stream.
 */

import { NextResponse, type NextRequest } from 'next/server'

const TOKEN_DELAY = 30 // 30ms delay between tokens
const TEXT_PREFIX = '0:' // vercel ai text prefix
const ANNOTATION_PREFIX = '8:' // vercel ai annotation prefix
const INLINE_ANNOTATION_KEY = 'annotation' // the language key to detect inline annotation code in markdown
const ANNOTATION_DELAY = 1000 // 1 second delay between annotations

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
]

const INLINE_ITEMS = [
  '\n ### Demo inline annotations \n',
  'Here are some steps to create a simple wiki app: \n',
  '1. Create package.json file:',
  {
    type: 'artifact',
    data: {
      type: 'code',
      created_at: 1717334400000,
      inline: true, // this artifact will be only displayed inline in the message
      data: {
        file_name: 'package.json',
        language: 'json',
        code: `{
  "name": "wiki-app",
  "version": "1.0.0",
  "description": "Wiki application",
  "main": "wiki.js",
  "dependencies": {
    "axios": "^1.0.0",
    "wiki-api": "^2.1.0"
  }
}`,
      },
    },
  },
  '2. Check the wiki fetching script:',
  {
    type: 'artifact',
    data: {
      created_at: 1717334500000,
      inline: true, // this artifact will be only displayed inline in the message
      type: 'code',
      data: {
        file_name: 'wiki.js',
        language: 'javascript',
        code: `async function getWiki(search) {
  const response = await fetch("/api/wiki?search=" + search);
  const data = await response.json();
  return data;
}
getWiki("What is LlamaIndex?");`,
      },
    },
  },
  '3. Check the current wiki:',
  {
    type: 'wiki',
    data: {
      title: 'LlamaIndex',
      summary: 'LlamaIndex is a framework for building AI applications.',
      url: 'https://www.llamaindex.ai',
      category: 'AI',
      lastUpdated: '2025-06-02',
    },
  },
  '#### 🎯 Demo generating a document artifact',
  {
    type: 'artifact',
    data: {
      inline: true, // this artifact will be only displayed inline in the message
      type: 'document',
      data: {
        title: 'Sample document',
        content: `# Getting Started Guide
  
  ## Introduction
  This comprehensive guide will walk you through everything you need to know to get started with our platform. Whether you're a beginner or an experienced user, you'll find valuable information here.
  
  ## Key Features
  - **Easy Setup**: Get running in minutes
  - **Powerful Tools**: Access advanced capabilities
  - **Great Documentation**: Find answers quickly
  - **Active Community**: Get help when needed
  
  ## Setup Process
  1. Install Dependencies
     First, ensure you have all required dependencies installed on your system.
  
  2. Configuration
     Update your configuration files with the necessary settings:
     - API keys
     - Environment variables
     - User preferences
  
  3. First Steps
     Begin with basic operations to familiarize yourself with the platform.
  
  ## Best Practices
  - Always backup your data
  - Follow security guidelines
  - Keep your dependencies updated
  - Document your changes
  
  ## Troubleshooting
  If you encounter issues, try these steps:
  1. Check logs for errors
  2. Verify configurations
  3. Update to latest version
  4. Contact support if needed
  
  ## Additional Resources
  - [Documentation](https://docs.example.com)
  - [API Reference](https://api.example.com)
  - [Community Forums](https://community.example.com)
  
  Feel free to explore and reach out if you need assistance!`,
        type: 'markdown',
      },
    },
  },
  '\n\n Please feel free to open the document in the canvas and edit it. The document will be saved as a new version',
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

      // insert annotations in fixed positions
      for (const item of SAMPLE_ANNOTATIONS) {
        controller.enqueue(
          encoder.encode(`${ANNOTATION_PREFIX}${JSON.stringify([item])}\n`)
        )
      }

      // insert inline annotations
      for (const item of INLINE_ITEMS) {
        if (typeof item === 'string') {
          controller.enqueue(
            encoder.encode(`${TEXT_PREFIX}${JSON.stringify(item)}\n`)
          )
        } else {
          await new Promise(resolve => setTimeout(resolve, ANNOTATION_DELAY))
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

/**
 * To append inline annotations to the stream, we need to wrap the annotation in a code block with the language key.
 * The language key is `inline_annotation` and the code block is wrapped in backticks.
 * The prefix `0:` ensures it will be treated as inline markdown. Example:
 *
 * 0:\`\`\`inline_annotation
 * \{
 *   "type": "artifact",
 *   "data": \{...\}
 * \}
 * \`\`\`
 */
function toInlineAnnotationCode(item: any) {
  return `\n\`\`\`${INLINE_ANNOTATION_KEY}\n${JSON.stringify(item)}\n\`\`\`\n`
}
