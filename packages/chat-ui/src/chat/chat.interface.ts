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

type ChatHandlerAppend = {
  append: (
    message: { content: string; role: MessageRole },
    chatRequestOptions?: { data?: any }
  ) => Promise<string | null | undefined>
}

type ChatHandlerChat = {
  chat: (input: string, data?: any) => Promise<void>
}

type ChatHandlerBase = {
  input: string
  setInput: (input: string) => void
  isLoading: boolean
  messages: Message[]
  reload?: () => void
  stop?: () => void
}

export type ChatHandler = {
  input: string
  setInput: (input: string) => void
  isLoading: boolean
  messages: Message[]
  reload?: () => void
  stop?: () => void
} & (ChatHandlerAppend | ChatHandlerChat)

export type ChatContext = ChatHandlerBase & {
  requestData: any
  setRequestData: (data: any) => void
} & ChatHandlerChat
