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

/**
 * Chat-UI MessagePart contract, have 3 types of parts:
 * - text parts: will be rendered as one or multiple markdown blocks
 * - data parts: additional data blocks
 * - other parts: the remaining parts that are not text or data
 *
 * Note that user can have various types of parts. In ChatUI, by default we only support display text and data parts, other parts will be ignored.
 */
export type MessagePart = TextPart | DataPart | AnyPart

export const TextPartType = 'text' as const

export type TextPart = {
  type: typeof TextPartType
  text: string
}

export type DataPart = {
  id?: string // if id is provided, only last data part with the same id will be existed in message.parts
  type: `data-${string}` // `data-` prefix is required for data parts
  data: any
}

// User can have various parts, so we need to allow any parts
// See many specific MessagePart types from Vercel AI SDK here:
// https://github.com/vercel/ai/blob/7948ec215d21675c1100edf58af8bb03a1f1dbe4/packages/ai/src/ui/ui-messages.ts#L75-L272
export type AnyPart<T extends string = any> = {
  id?: string
  type: T
  data?: any
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
