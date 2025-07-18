'use server'

import { defaultAnnotationRenderers } from '@llamaindex/chat-ui'
import { Markdown } from '@llamaindex/chat-ui/widgets'
import { createStreamableUI } from 'ai/rsc'
import { ReactNode } from 'react'

const TOKEN_DELAY = 30
const ANNOTATION_DELAY = 300
const INLINE_ANNOTATION_KEY = 'annotation'

export async function chatAction(question: string) {
  const uiStream = createStreamableUI()

  let assistantMsg = ''

  const responseStream = fakeChatStream(question)
  responseStream
    .pipeTo(
      new WritableStream({
        write: (data: any) => {
          if (typeof data === 'string') {
            assistantMsg += data
          } else {
            assistantMsg += toInlineAnnotationCode(data)
          }

          uiStream.update(
            <Markdown
              content={assistantMsg}
              annotationRenderers={defaultAnnotationRenderers}
            />
          )
        },
        close: () => {
          uiStream.done()
        },
      })
    )
    .catch(uiStream.error)

  return uiStream.value as Promise<ReactNode>
}

const SAMPLE_TEXT = [
  `
Welcome to the demo of @llamaindex/chat-ui. Let me show you the different types of components that can be triggered from the server.

### Markdown with code block

\`\`\`js
const a = 1
const b = 2
const c = a + b
console.log(c)
\`\`\`

`,
  '\n ### Demo inline annotations \n',
  'Here are some steps to create a simple wiki app: \n',
  '1. Create package.json file:',
  {
    type: 'artifact',
    data: {
      type: 'code',
      created_at: 1717334400000,
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
      type: 'code',
      data: {
        file_name: 'wiki.js',
        language: 'javascript',
        code: `async function getWiki(search) {
    const response = await fetch("/api/wiki?search=" + search);
    const data = await response.json();
    return data;
  }`,
      },
    },
  },
  '3. Run getWiki with the search term:',
  {
    type: 'artifact',
    data: {
      created_at: 1717334600000,
      type: 'code',
      data: {
        file_name: 'wiki.js',
        language: 'javascript',
        code: `getWiki(\`What is \${search}?\`);`,
      },
    },
  },
  '#### 🎯 Demo generating a document artifact',
  {
    type: 'artifact',
    data: {
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

function fakeChatStream(question: string): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      controller.enqueue(`User question: ${question}. \n `)

      for (const item of SAMPLE_TEXT) {
        if (typeof item === 'string') {
          for (const token of item.split(' ')) {
            await new Promise(resolve => setTimeout(resolve, TOKEN_DELAY))
            controller.enqueue(`${token} `)
          }
        } else {
          await new Promise(resolve => setTimeout(resolve, ANNOTATION_DELAY))
          controller.enqueue(item)
        }
      }

      controller.close()
    },
  })
}

function toInlineAnnotationCode(item: any) {
  return `\n\`\`\`${INLINE_ANNOTATION_KEY}\n${JSON.stringify(item)}\n\`\`\`\n`
}
