import { Loader2, Paperclip } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { createContext, useContext, useState } from 'react'
import { cn } from '../lib/utils'
import { Button, buttonVariants } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { useChatUI } from './chat.context'
import { Message } from './chat.interface'

interface ChatInputProps extends React.PropsWithChildren {
  className?: string
  resetUploadedFiles?: () => void
  annotations?: any
}

interface ChatInputPreviewProps extends React.PropsWithChildren {
  className?: string
}

interface ChatInputFormProps extends React.PropsWithChildren {
  className?: string
}

interface ChatInputFieldProps {
  className?: string
  type?: 'input' | 'textarea'
}

interface ChatInputUploadProps {
  className?: string
  inputId?: string
  onUpload?: (file: File) => Promise<void>
}

interface ChatInputSubmitProps extends React.PropsWithChildren {
  className?: string
}

interface ChatInputContext {
  isDisabled: boolean
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const chatInputContext = createContext<ChatInputContext | null>(null)

const ChatInputProvider = chatInputContext.Provider

export const useChatInput = () => {
  const context = useContext(chatInputContext)
  if (!context) {
    throw new Error('useChatInput must be used within a ChatInputProvider')
  }
  return context
}

function ChatInput(props: ChatInputProps) {
  const { input, setInput, append, isLoading, requestData } = useChatUI()
  const isDisabled = isLoading || !input.trim()

  const submit = async () => {
    const newMessage: Omit<Message, 'id'> = {
      role: 'user',
      content: input,
      annotations: props.annotations,
    }

    setInput('') // Clear the input
    props.resetUploadedFiles?.() // Reset the uploaded files

    await append(newMessage, { data: requestData })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await submit()
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isDisabled) return
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      await submit()
    }
  }

  const children = props.children ?? (
    <>
      <ChatInputPreview />
      <ChatInputForm />
    </>
  )

  return (
    <ChatInputProvider value={{ isDisabled, handleKeyDown, handleSubmit }}>
      <div
        className={cn(
          'flex shrink-0 flex-col gap-4 bg-white p-4',
          props.className
        )}
      >
        {children}
      </div>
    </ChatInputProvider>
  )
}

function ChatInputPreview(props: ChatInputPreviewProps) {
  const { requestData } = useChatUI()
  if (!requestData) return null
  // TODO: render file preview from data
  return (
    <div className={cn(props.className, 'flex gap-2')}>ChatInputPreview</div>
  )
}

function ChatInputForm(props: ChatInputFormProps) {
  const { handleSubmit } = useChatInput()
  const children = props.children ?? (
    <>
      <ChatInputField />
      <ChatInputUpload />
      <ChatInputSubmit />
    </>
  )

  return (
    <form onSubmit={handleSubmit} className={cn(props.className, 'flex gap-2')}>
      {children}
    </form>
  )
}

function ChatInputField(props: ChatInputFieldProps) {
  const { input, setInput } = useChatUI()
  const { handleKeyDown } = useChatInput()
  const type = props.type ?? 'textarea'

  if (type === 'input') {
    return (
      <Input
        name="input"
        placeholder="Type a message"
        className={cn(props.className, 'min-h-0')}
        value={input}
        onChange={e => setInput(e.target.value)}
      />
    )
  }

  return (
    <Textarea
      name="input"
      placeholder="Type a message"
      className={cn(props.className, 'h-[40px] min-h-0 flex-1')}
      value={input}
      onChange={e => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  )
}

function ChatInputUpload(props: ChatInputUploadProps) {
  const { requestData, setRequestData, isLoading } = useChatUI()
  const [uploading, setUploading] = useState(false)
  const inputId = props.inputId || 'fileInput'

  const resetInput = () => {
    const fileInput = document.getElementById(inputId) as HTMLInputElement
    fileInput.value = ''
  }

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    if (props.onUpload) {
      await props.onUpload(file)
    } else {
      setRequestData({ ...(requestData || {}), file })
    }
    resetInput()
    setUploading(false)
  }

  return (
    <div className="self-stretch">
      <input
        id={inputId}
        type="file"
        className="hidden"
        onChange={onFileChange}
        disabled={isLoading}
      />
      <label
        htmlFor={inputId}
        className={cn(
          buttonVariants({ variant: 'secondary', size: 'icon' }),
          'cursor-pointer',
          uploading && 'opacity-50',
          props.className
        )}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Paperclip className="h-4 w-4 -rotate-45" />
        )}
      </label>
    </div>
  )
}

function ChatInputSubmit(props: ChatInputSubmitProps) {
  const { isDisabled } = useChatInput()
  return (
    <Button type="submit" disabled={isDisabled} className={cn(props.className)}>
      {props.children ?? 'Send message'}
    </Button>
  )
}

ChatInput.Preview = ChatInputPreview
ChatInput.Form = ChatInputForm
ChatInput.Field = ChatInputField
ChatInput.Upload = ChatInputUpload
ChatInput.Submit = ChatInputSubmit

export default ChatInput
