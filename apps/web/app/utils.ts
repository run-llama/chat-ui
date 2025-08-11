import { faker } from '@faker-js/faker'

const DATA_PREFIX = 'data: ' // SSE format prefix
const TOKEN_DELAY = 30 // 30ms delay between tokens

interface TextChunk {
  type: 'text-delta' | 'text-start' | 'text-end'
  id: string
  delta?: string
}

interface DataChunk {
  type: `data-${string}` // requires `data-` prefix when sending data parts
  data: Record<string, any>
}

export const fakeStreamText = ({
  chunkCount = 10,
}: {
  chunkCount?: number
} = {}) => {
  // Generate sample text blocks
  const blocks = [
    Array.from({ length: chunkCount }, () => ({
      delay: faker.number.int({ max: 100, min: 30 }),
      texts: `${faker.lorem.words({ max: 3, min: 1 })} `,
    })),
    Array.from({ length: chunkCount + 2 }, () => ({
      delay: faker.number.int({ max: 100, min: 30 }),
      texts: `${faker.lorem.words({ max: 3, min: 1 })} `,
    })),
  ]

  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      // New SSE format with text chunks
      function writeStream(chunk: TextChunk | DataChunk) {
        controller.enqueue(
          encoder.encode(`${DATA_PREFIX}${JSON.stringify(chunk)}\n\n`)
        )
      }

      async function writeTextMessage(content: string) {
        // Generate a unique message id
        const messageId = crypto.randomUUID()

        // Start the text chunk
        const startChunk: TextChunk = { id: messageId, type: 'text-start' }
        writeStream(startChunk)

        // Stream tokens one by one
        for (const token of content.split(' ')) {
          if (token.trim()) {
            const deltaChunk: TextChunk = {
              id: messageId,
              type: 'text-delta',
              delta: `${token} `,
            }
            writeStream(deltaChunk)
            await new Promise(resolve => setTimeout(resolve, TOKEN_DELAY))
          }
        }

        // End the text chunk
        const endChunk: TextChunk = { id: messageId, type: 'text-end' }
        writeStream(endChunk)
      }

      // Stream each block as a separate message
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i]

        // Combine all texts in the block into one message
        const blockText = block.map(chunk => chunk.texts).join('')

        await writeTextMessage(blockText)

        // Add paragraph break between blocks
        if (i < blocks.length - 1) {
          await writeTextMessage('\n\n')
        }
      }
    },
  })
}
