import { SimpleChatSection } from './simple-demo'
import { CustomChatSection } from './custom-demo'
import Guide from './guide'

export default function Page(): JSX.Element {
  return (
    <main className="min-h-screen p-20">
      <div className="mb-10 flex flex-col items-center justify-center space-y-4">
        <h1 className="text-6xl font-bold">LlamaIndex ChatUI</h1>
        <p className="text-2xl">Build powerful AI chat interfaces with ease</p>
      </div>

      <div className="mx-auto w-[72%] space-y-16 divide-y-4">
        <div className="mx-auto w-fit rounded-lg bg-zinc-800 p-3">
          <Guide />
        </div>
        <SimpleChatSection />
        <CustomChatSection />
      </div>
    </main>
  )
}
