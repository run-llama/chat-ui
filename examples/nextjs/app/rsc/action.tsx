'use server'

import { createStreamableUI } from 'ai/rsc'
import { ReactNode } from 'react'

const TOKEN_DELAY = 30

const SAMPLE_TEXT =
  'Hello! I am an AI assistant ready to help you today. I can provide information, answer questions, and engage in conversations about various topics. I aim to be helpful while being direct and concise in my responses. Please feel free to ask me anything you would like to know more about.'

const fakeChatStream = (question: string): ReadableStream => {
  return new ReadableStream({
    async start(controller) {
      controller.enqueue(`User question: ${question}. \n `)

      for (const token of SAMPLE_TEXT.split(' ')) {
        await new Promise(resolve => setTimeout(resolve, TOKEN_DELAY))
        controller.enqueue(`${token} `)
      }

      controller.close()
    },
  })
}

export async function chatAction(question: string) {
  const uiStream = createStreamableUI()

  const responseStream = fakeChatStream(question)
  responseStream
    .pipeTo(
      new WritableStream({
        write: (delta: string) => {
          uiStream.append(delta)
        },
        close: () => {
          uiStream.done()
        },
      })
    )
    .catch(uiStream.error)

  return uiStream.value as Promise<ReactNode>
}
