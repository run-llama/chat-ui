export type MessageRole =
  | 'system'
  | 'user'
  | 'assistant'
  | 'function'
  | 'data'
  | 'tool'

export interface Message {
  content: string
  role: MessageRole
  annotations?: any
}

export interface ChatHandler {
  input: string
  setInput: (input: string) => void
  requestData: any
  setRequestData: (data: any) => void
  isLoading: boolean
  messages: Message[]
  chat: (input: string, data?: any) => Promise<void>
  append?: (
    message: { content: string; role: MessageRole },
    chatRequestOptions?: { data?: any }
  ) => Promise<string | null | undefined>
  reload?: () => void
  stop?: () => void
}
