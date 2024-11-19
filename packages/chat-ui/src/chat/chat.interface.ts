type MessageRole = 'system' | 'user' | 'assistant' | 'data'

export interface Message {
  content: string
  role: MessageRole
  annotations?: any
}

export type ChatHandler = {
  input: string
  setInput: (input: string) => void
  isLoading: boolean
  messages: Message[]
  reload?: () => void
  stop?: () => void
  append: (
    message: Message,
    chatRequestOptions?: { data?: any }
  ) => Promise<string | null | undefined>
}

export type ChatContext = ChatHandler & {
  requestData: any
  setRequestData: (data: any) => void
}
