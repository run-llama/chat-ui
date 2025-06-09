'use server'
import { createStreamableUI } from 'ai/rsc'
import { ReactNode } from 'react'

const TOKEN_DELAY = 30

export async function chatAction(question: string): Promise<ReactNode> {
  const uiStream = createStreamableUI()

  uiStream.update(<div style={{ color: 'gray' }}>Loading...</div>)

  const responseStream = fakeChatStream()
  responseStream
    .pipeTo(
      new WritableStream({
        start: () => {
          uiStream.update(<div key="user">User question: {question}</div>)
        },
        write: (message: string) => {
          uiStream.append(message)
        },
        close: () => {
          uiStream.done(<div>Done</div>)
        },
      })
    )
    .catch(uiStream.error)

  return uiStream.value
}

const SAMPLE_TEXT =
  'Hello! I am an AI assistant ready to help you today. I can provide information, answer questions, and engage in conversations about various topics. I aim to be helpful while being direct and concise in my responses. Please feel free to ask me anything you would like to know more about.'

const fakeChatStream = (): ReadableStream => {
  return new ReadableStream({
    async start(controller) {
      for (const token of SAMPLE_TEXT.split(' ')) {
        await new Promise(resolve => setTimeout(resolve, TOKEN_DELAY))
        controller.enqueue(`${token} `)
      }

      controller.close()
    },
  })
}
