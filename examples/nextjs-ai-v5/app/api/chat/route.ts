import { NextResponse } from 'next/server'

const steps = [
  {
    type: 'data-notification',
    data: { message: 'Processing your request...', level: 'info' },
    transient: true,
  },
  {
    type: 'data-weather',
    data: { city: 'San Francisco', status: 'loading' },
  },

  { type: 'start' },
  { type: 'start-step' },
  {
    type: 'text-start',
    id: 'msg_68872a096c2081928460e97110e9171c082cccbd3f563917',
    providerMetadata: {
      openai: {
        itemId: 'msg_68872a096c2081928460e97110e9171c082cccbd3f563917',
      },
    },
  },
  ...['Hello', '!', ' How', ' can', ' I', ' assist', ' you', ' today', '?'].map(
    word => ({
      type: 'text-delta',
      id: 'msg_68872a096c2081928460e97110e9171c082cccbd3f563917',
      delta: word,
    })
  ),
  {
    type: 'text-end',
    id: 'msg_68872a096c2081928460e97110e9171c082cccbd3f563917',
  },
  { type: 'finish-step' },
  { type: 'finish' },
  {
    type: 'data-weather',
    id: 'weather-1',
    data: { city: 'San Francisco', weather: 'sunny', status: 'success' },
  },

  { type: 'start' },
  { type: 'start-step' },
  {
    type: 'text-start',
    id: 'msg_2',
    providerMetadata: {
      openai: {
        itemId: 'msg_2',
      },
    },
  },
  ...['I', ' am ', 'a bot'].map(word => ({
    type: 'text-delta',
    id: 'msg_2',
    delta: word,
  })),
  {
    type: 'text-end',
    id: 'msg_2',
  },
  { type: 'finish-step' },
  { type: 'finish' },
]

export async function POST() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      for (const step of steps) {
        // Use data: prefix for SSE format
        const chunk = `data: ${JSON.stringify(step)}\n\n`
        controller.enqueue(encoder.encode(chunk))
        await new Promise(resolve => setTimeout(resolve, 50))
      }

      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })

  return new NextResponse(stream, {
    status: 200,
    headers: {
      // Set headers for Server-Sent Events (SSE)
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
