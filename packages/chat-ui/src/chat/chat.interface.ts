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

export type MessagePart = {
  type: string
  [key: string]: unknown
}

// User can have various parts, so we need to allow any parts when updating or sending messages
// See many specific MessagePart types from Vercel AI SDK here:
// https://github.com/vercel/ai/blob/7948ec215d21675c1100edf58af8bb03a1f1dbe4/packages/ai/src/ui/ui-messages.ts#L75-L272
export type MessageInput = Omit<Message, 'parts'> & { parts: any[] }

export type ChatRequestOptions = {
  headers?: Record<string, string> | Headers
  body?: object
}

export type ChatHandler = {
  messages: Message[]
  status: 'submitted' | 'streaming' | 'ready' | 'error'
  sendMessage: (msg: MessageInput, opts?: ChatRequestOptions) => Promise<void>
  stop?: () => Promise<void>
  regenerate?: (opts?: { messageId?: string } & ChatRequestOptions) => void
  setMessages?: (messages: MessageInput[]) => void
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
} & {
  /**
   * @deprecated Use `regenerate` instead
   */
  reload?: (chatRequestOptions?: { data?: any }) => void

  /**
   * @deprecated Use `sendMessage` instead
   */
  append?: (
    message: Message,
    chatRequestOptions?: { data?: any }
  ) => Promise<string | null | undefined>
}
