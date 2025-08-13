import { MessagePart } from './message-parts/types'

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
  id: string
  role: 'system' | 'user' | 'assistant'
  parts: MessagePart[]
}

export type ChatRequestOptions = {
  headers?: Record<string, string> | Headers
  body?: object
}

export type ChatHandler = {
  messages: Message[]
  status: 'submitted' | 'streaming' | 'ready' | 'error'
  sendMessage: (msg: Message, opts?: ChatRequestOptions) => Promise<void>
  stop?: () => Promise<void>
  regenerate?: (opts?: { messageId?: string } & ChatRequestOptions) => void
  setMessages?: (messages: Message[]) => void
}

export type ChatContext = ChatHandler & {
  // user input state
  input: string
  setInput: (input: string) => void

  // additional data including in the body
  requestData: any
  setRequestData: (data: any) => void

  // computed state from status
  isLoading: boolean
}
