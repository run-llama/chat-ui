export interface Message {
  content: string
  role: string
}

export interface ChatHandler {
  input: string
  setInput: (input: string) => void
  data?: unknown
  setData: (data: unknown) => void
  isLoading: boolean
  messages: Message[]
  chat: (input: string, data?: unknown) => Promise<void>
  reload?: () => void
  stop?: () => void
}
