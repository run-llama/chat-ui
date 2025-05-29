type MessageRole = 'system' | 'user' | 'assistant' | 'data'

export type JSONValue =
  | null
  | string
  | number
  | boolean
  | {
      [value: string]: JSONValue
    }
  | JSONValue[]

export interface Message {
  content: string
  role: MessageRole
  annotations?: JSONValue[]
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

  // TODO: (Message & { id: string }) is a quick fix for compatibility with Message from ai/react
  // We should make Message type in ChatHandler more flexible. Eg: ChatHandler<T extends Message = Message>
  setMessages?: (messages: (Message & { id: string })[]) => void
}

export type ChatContext = ChatHandler & {
  requestData: any
  setRequestData: (data: any) => void
}
