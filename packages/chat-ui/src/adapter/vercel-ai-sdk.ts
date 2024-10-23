import { useChat, type UseChatOptions } from 'ai/react'
import { useState } from 'react'
import type { ChatHandler } from '../chat/chat.interface'

export interface VercelAiSdkOptions extends UseChatOptions {
  data?: any
}

export function useVercelAiSdk(options?: VercelAiSdkOptions): ChatHandler {
  const [data, setData] = useState<any>(options?.data)

  const { messages, input, isLoading, reload, stop, append, setInput } =
    useChat({
      body: { data },
      api: options?.api ?? '/api/chat',
      headers: {
        'Content-Type': 'application/json', // using JSON because of vercel/ai 2.2.26
      },
      onError:
        options?.onError ??
        ((error: unknown) => {
          if (!(error instanceof Error)) throw error
          const message = JSON.parse(error.message)
          alert(message.detail)
        }),
      sendExtraMessageFields: true,
    })

  const chat = async (content: string, additionalData?: any) => {
    await append({ content, role: 'user' }, { data: additionalData })
  }

  return {
    input,
    setInput,
    data,
    setData,
    isLoading,
    messages,
    chat,
    reload,
    stop,
  }
}
