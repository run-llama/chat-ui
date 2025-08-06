import { Send, Square } from 'lucide-react'
import { createContext, useContext, useRef, useState } from 'react'
import { cn } from '../lib/utils'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { FileUploader } from '../widgets/index.js' // this import needs the file extension as it's importing the widget bundle
import { useChatUI } from './chat.context'
import { Message, MessagePart } from './chat.interface'
import { v4 as uuidv4 } from 'uuid'

interface ChatInputProps extends React.PropsWithChildren {
  className?: string
  resetUploadedFiles?: () => void
  attachments?: MessagePart[]
}

interface ChatInputFormProps extends React.PropsWithChildren {
  className?: string
}

interface ChatInputFieldProps {
  className?: string
  placeholder?: string
}

interface ChatInputUploadProps {
  className?: string
  onUpload?: (file: File) => Promise<void> | undefined
  allowedExtensions?: string[]
  multiple?: boolean
}

interface ChatInputSubmitProps extends React.PropsWithChildren {
  className?: string
  disabled?: boolean
}

interface ChatInputContext {
  isDisabled: boolean
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isComposing: boolean
  setIsComposing: (value: boolean) => void
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
  const { input, setInput, sendMessage, isLoading, requestData } = useChatUI()
  const isDisabled = isLoading || !input.trim()
  const [isComposing, setIsComposing] = useState(false)

  const submit = async () => {
    const newMessage: Message = {
      id: uuidv4(),
      role: 'user',
      parts: [{ type: 'text', text: input }, ...(props.attachments ?? [])],
    }

    setInput('') // Clear the input
    props.resetUploadedFiles?.() // Reset the uploaded files

    await sendMessage(newMessage, { body: requestData })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await submit()
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isDisabled) return
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      await submit()
    }
  }

  const children = props.children ?? <ChatInputForm />

  return (
    <ChatInputProvider
      value={{
        isDisabled,
        handleKeyDown,
        handleSubmit,
        isComposing,
        setIsComposing,
      }}
    >
      <div
        className={cn(
          'bg-background flex shrink-0 flex-col gap-4 p-4 pt-0',
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
    <form
      onSubmit={handleSubmit}
      className={cn('relative flex gap-2', props.className)}
    >
      {children}
    </form>
  )
}

function ChatInputField(props: ChatInputFieldProps) {
  const { input, setInput } = useChatUI()
  const { handleKeyDown, setIsComposing } = useChatInput()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // auto resize the textarea based on the content
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      let newHeight = Math.max(textareaRef.current.scrollHeight, 100)
      if (textareaRef.current.scrollHeight > 80) {
        newHeight += 40 // offset for the textarea padding
      }
      textareaRef.current.style.height = `${newHeight}px`
    }
  }

  return (
    <Textarea
      ref={textareaRef}
      name="input"
      placeholder={props.placeholder ?? 'Type a message...'}
      className={cn(
        'bg-secondary h-[100px] max-h-[400px] min-h-0 flex-1 resize-none overflow-y-auto rounded-2xl p-4',
        props.className
      )}
      value={input}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={() => {
        setTimeout(() => setIsComposing(false), 100)
      }}
      spellCheck={false}
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
        multiple: props.multiple ?? true,
        allowedExtensions: props.allowedExtensions,
      }}
      className={cn(
        'hover:bg-primary absolute bottom-2 left-2 rounded-full',
        props.className
      )}
    />
  )
}

function ChatInputSubmit(props: ChatInputSubmitProps) {
  const { stop, isLoading } = useChatUI()
  const { isDisabled } = useChatInput()

  if (stop && isLoading) {
    return (
      <Button
        type="button"
        size="icon"
        onClick={stop}
        className="absolute bottom-2 right-2 rounded-full"
      >
        <Square className="size-3" fill="white" stroke="white" />
      </Button>
    )
  }

  return (
    <Button
      type="submit"
      size="icon"
      disabled={props.disabled ?? isDisabled}
      className={cn('absolute bottom-2 right-2 rounded-full', props.className)}
    >
      {props.children ?? <Send className="size-4" />}
    </Button>
  )
}

ChatInput.Form = ChatInputForm
ChatInput.Field = ChatInputField
ChatInput.Upload = ChatInputUpload
ChatInput.Submit = ChatInputSubmit

export default ChatInput
