import { createContext, useContext } from 'react'
import { cn } from '../lib/utils'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { FileUploader } from '../widget/file-uploader'
import { useChatUI } from './chat.context'
import { Message } from './chat.interface'

const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'csv', 'pdf', 'txt', 'docx']

interface ChatInputProps extends React.PropsWithChildren {
  className?: string
  resetUploadedFiles?: () => void
  annotations?: any
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
  onUpload?: (file: File) => Promise<void> | undefined
  allowedExtensions?: string[]
  multiple?: boolean
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

  const children = props.children ?? <ChatInputForm />

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

function ChatInputForm(props: ChatInputFormProps) {
  const { handleSubmit } = useChatInput()
  const children = props.children ?? (
    <>
      <ChatInputField />
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

  const onFileUpload = async (file: File) => {
    if (props.onUpload) {
      await props.onUpload(file)
    } else {
      setRequestData({ ...(requestData || {}), file })
    }
  }

  return (
    <FileUploader
      onFileUpload={onFileUpload}
      config={{
        disabled: isLoading,
        allowedExtensions: props.allowedExtensions ?? ALLOWED_EXTENSIONS,
        multiple: props.multiple ?? true,
      }}
    />
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

ChatInput.Form = ChatInputForm
ChatInput.Field = ChatInputField
ChatInput.Upload = ChatInputUpload
ChatInput.Submit = ChatInputSubmit

export default ChatInput
