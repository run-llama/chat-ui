import { faker } from '@faker-js/faker'

export const fakeStreamText = ({
  chunkCount = 10,
  streamProtocol = 'data',
}: {
  chunkCount?: number
  streamProtocol?: 'data' | 'text'
} = {}) => {
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
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i]

        for (const chunk of block) {
          await new Promise(resolve => setTimeout(resolve, chunk.delay))

          if (streamProtocol === 'text') {
            controller.enqueue(encoder.encode(chunk.texts))
          } else {
            controller.enqueue(
              encoder.encode(`0:${JSON.stringify(chunk.texts)}\n`)
            )
          }
        }

        if (i < blocks.length - 1) {
          if (streamProtocol === 'text') {
            controller.enqueue(encoder.encode('\n\n'))
          } else {
            controller.enqueue(encoder.encode(`0:${JSON.stringify('\n\n')}\n`))
          }
        }
      }

      if (streamProtocol === 'data') {
        controller.enqueue(
          encoder.encode(
            `d:${JSON.stringify({
              finishReason: 'stop',
              usage: {
                promptTokens: 0,
                completionTokens: blocks.reduce(
                  (sum, block) => sum + block.length,
                  0
                ),
              },
            })}\n`
          )
        )
      }

      controller.close()
    },
  })
}
