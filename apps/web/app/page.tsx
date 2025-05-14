import Link from 'next/link'

export default function Page(): JSX.Element {
  return (
    <main className="h-screen overflow-hidden bg-gradient-to-b from-zinc-900 to-black">
      <div className="container mx-auto px-4 py-10 md:py-24">
        <div className="mb-16 flex flex-col items-center justify-center space-y-6 text-center">
          <div className="rounded-full bg-gradient-to-r from-[#fad6f8] to-[#b5f2fd] p-1">
            <div className="rounded-full bg-black p-2">
              <img
                src="/llama.png"
                alt="LlamaIndex Logo"
                className="h-12 w-12 rounded-full sm:h-16 sm:w-16"
              />
            </div>
          </div>
          <h1 className="bg-gradient-to-r from-[#fad6f8] to-[#b5f2fd] bg-clip-text text-4xl font-bold text-transparent sm:text-6xl">
            LlamaIndex ChatUI
          </h1>
          <p className="max-w-2xl text-lg text-zinc-300 sm:text-xl">
            A powerful React component library for building chat interfaces in
            LLM applications
          </p>
          <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center">
            <a
              href="https://github.com/run-llama/chat-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-zinc-800 px-6 py-2 font-medium text-white transition hover:bg-zinc-700"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/@llamaindex/chat-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gradient-to-r from-[#fad6f8] to-[#b5f2fd] px-6 py-2 font-medium text-gray-900 transition hover:opacity-90"
            >
              npm install @llamaindex/chat-ui
            </a>
          </div>
          <div className="flex gap-4">
            <Link
              href="/demo/simple"
              className="rounded-full bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] px-6 py-2 font-medium text-white transition hover:opacity-90"
            >
              Simple Chat
            </Link>
            <Link
              href="/demo/custom"
              className="rounded-full bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] px-6 py-2 font-medium text-white transition hover:opacity-90"
            >
              Custom Chat
            </Link>
            <Link
              href="/demo/canvas"
              className="rounded-full bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] px-6 py-2 font-medium text-white transition hover:opacity-90"
            >
              Chat with Canvas
            </Link>
            <Link
              href="/demo/mermaid"
              className="rounded-full bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] px-6 py-2 font-medium text-white transition hover:opacity-90"
            >
              Mermaid Diagram Demo
            </Link>
          </div>
        </div>

        <div className="mx-auto mb-16 max-w-full rounded-xl bg-zinc-800/50 p-6 backdrop-blur sm:max-w-4xl">
          <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
            Quick Start
          </h2>
          <div className="space-y-4">
            <p className="text-zinc-300">
              Add a chatbot to your project with Shadcn CLI:
            </p>
            <div className="overflow-x-auto rounded-lg bg-zinc-900 p-4">
              <code className="text-sm font-medium text-purple-400">
                npx shadcn@latest add https://ui.llamaindex.ai/r/chat.json
              </code>
            </div>
            <p className="text-zinc-300">Or install manually:</p>
            <div className="overflow-x-auto rounded-lg bg-zinc-900 p-4">
              <code className="text-sm font-medium text-purple-400">
                npm install @llamaindex/chat-ui
              </code>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
