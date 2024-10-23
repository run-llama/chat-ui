import type { Message } from './chat.interface'

function ChatMessage({ message }: { message: Message }) {
  return (
    <div>
      <div>{message.role}</div>
      <div>{message.content}</div>
    </div>
  )
}

export default ChatMessage
