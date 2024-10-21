import type { Message } from './chat.interface'

function ChatMessage({ message }: { message: Message }) {
  console.log(message)
  return <div>ChatMessage</div>
}

export default ChatMessage
