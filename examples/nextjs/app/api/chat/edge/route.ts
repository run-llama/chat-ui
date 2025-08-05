/**
 * This is an example to demo chat-ui with edge runtime, same functionality as chat/route.ts
 *
 * This is a simple example demonstrating:
 * - Text streaming with token-by-token delivery
 * - Basic markdown content with code blocks
 * - Standard parts (sources) sent after text completion
 * - Custom parts (weather) sent after text completion
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
]

export const runtime = 'edge' // This is the key difference from chat/route.ts

export async function POST(request: NextRequest) {
  return chatHandler(request, SAMPLE_PARTS)
}
