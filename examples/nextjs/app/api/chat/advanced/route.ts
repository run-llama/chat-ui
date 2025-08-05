/**
 * Advanced Chat API Route Example
 *
 * This example demonstrates advanced streaming features:
 * - Text streaming with token-by-token delivery
 * - Both standard annotations (sent after text) and artifacts inlined in the markdown stream
 * - Multiple annotation types: sources, artifacts, and custom components (wiki)
 *
 */

import { NextRequest } from 'next/server'
import { chatHandler, MessagePart } from '../handler'

const SAMPLE_PARTS: (string | MessagePart)[] = [
  `
  Welcome to the demo of @llamaindex/chat-ui. Let me show you the different types of components that can be triggered from the server.

### Markdown with code block

\`\`\`js
const a = 1
const b = 2
const c = a + b
console.log(c)
\`\`\`

### Parts:
  `,

  'First, let show the uploaded file (type=file):',
  {
    type: 'file',
    data: { name: 'upload.pdf', url: 'https://pdfobject.com/pdf/sample.pdf' },
  },

  'Then, let me call a tool to get the weather in San Francisco (type=event):',
  {
    id: 'demo_sample_event_id',
    type: 'event',
    data: {
      title: 'Calling tool `get_weather` with input `San Francisco, CA`',
      status: 'pending',
    },
  },

  'Get the result from the tool (type=event):',
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

  'Let me show a weather card (type=weather):',
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

  'Let me generate a code artifact (type=artifact):',
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

  'Let me show the sources (type=sources):',
  {
    type: 'sources',
    data: {
      nodes: [
        { id: '1', url: '/sample.pdf' },
        { id: '2', url: '/sample.pdf' },
      ],
    },
  },

  'Let me show a suggestion (type=suggested-questions):',
  {
    type: 'suggested-questions',
    data: [
      'I think you should go to the beach',
      'I think you should go to the mountains',
      'I think you should go to the city',
    ],
  },
]

export async function POST(request: NextRequest) {
  return chatHandler(request, SAMPLE_PARTS)
}
