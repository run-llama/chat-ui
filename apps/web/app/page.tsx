import { SimpleChatSection, StyledChatSection } from './demo'

export default function Page(): JSX.Element {
  return (
    <main className="bg-glow-conic min-h-screen w-screen p-20">
      <div className="mb-10 flex flex-col items-center justify-center space-y-4">
        <h1 className="text-6xl font-bold">LlamaIndex ChatUI</h1>
        <p className="text-2xl">Build powerful AI chat interfaces with ease</p>
      </div>
      <div className="mx-auto w-[800px] space-y-8">
        <SimpleChatSection />
        <StyledChatSection />
      </div>
    </main>
  )
}
