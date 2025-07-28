type MessageRole = 'system' | 'user' | 'assistant'

export type JSONValue =
  | null
  | string
  | number
  | boolean
  | {
      [value: string]: JSONValue
    }
  | JSONValue[]

export type Message = {
  id: string
  role: MessageRole
  parts: MessagePart[]
}

export type MessagePart = {
  type: string
  [key: string]: unknown
}

export type ChatHandler = {
  input: string
  setInput: (input: string) => void
  isLoading: boolean
  messages: Message[]
  reload?: (chatRequestOptions?: { data?: any }) => void
  stop?: () => void
  append: (
    message: Message,
    chatRequestOptions?: { data?: any }
  ) => Promise<string | null | undefined>
  setMessages?: (messages: Message[]) => void
}

export type ChatContext = ChatHandler & {
  requestData: any
  setRequestData: (data: any) => void
}
