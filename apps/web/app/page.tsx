import { SimpleChatSection, StyledChatSection } from './chat-section'

export default function Page(): JSX.Element {
  return (
    <main className="bg-glow-conic w-screen min-h-screen p-20">
      <div className="flex flex-col items-center justify-center space-y-4 mb-10">
        <h1 className="text-6xl font-bold">LlamaIndex ChatUI</h1>
        <p className="text-2xl">Build powerful AI chat interfaces with ease</p>
      </div>
      <div className="w-[800px] space-y-8 mx-auto">
        <SimpleChatSection />
        <StyledChatSection />
      </div>
    </main>
  )
}
