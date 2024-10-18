import { Card } from '@llamaindex/chat-ui'

export default function Page(): JSX.Element {
  return (
    <main className="bg-glow-conic flex h-screen flex-col items-center justify-center space-y-4">
      <h1 className="text-primary text-6xl font-bold">LlamaIndex ChatUI</h1>
      <p className="text-2xl">Build powerful AI chat interfaces with ease</p>
      <Card />
    </main>
  )
}
