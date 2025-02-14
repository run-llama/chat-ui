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
  annotations?: JSONValue[] | undefined
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
}

export type ChatContext = ChatHandler & {
  requestData: any
  setRequestData: (data: any) => void
}
