'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="mx-auto h-screen w-full max-w-4xl px-4 py-8">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Llama Deploy with Chat UI
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          A demonstration of LlamaIndex Chat UI components integrated with Llama
          Deploy workflows
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Link
          href="/chat"
          className="group rounded-lg border border-gray-200 p-6 transition-all hover:border-blue-500 hover:shadow-lg"
        >
          <div className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
            💬 Chat Demo
          </div>
          <p className="text-gray-600">
            Interactive chat interface using the LlamaIndex Chat UI components
          </p>
        </Link>

        <Link
          href="/workflow"
          className="group rounded-lg border border-gray-200 p-6 transition-all hover:border-blue-500 hover:shadow-lg"
        >
          <div className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
            ⚙️ Workflow Management
          </div>
          <p className="text-gray-600">
            Manage and interact with Llama Deploy workflows directly
          </p>
        </Link>
      </div>

      {/* Documentation & Resources */}
      <div className="rounded-lg bg-gray-50 p-6">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
          Documentation & Resources
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold text-gray-800">
              📚 Chat UI Documentation
            </h3>
            <a
              href="https://ui.llamaindex.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              https://ui.llamaindex.ai/ →
            </a>
            <p className="mt-1 text-sm text-gray-600">
              Complete documentation for LlamaIndex Chat UI components, hooks,
              and examples
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-gray-800">💻 Source Code</h3>
            <a
              href="https://github.com/run-llama/chat-ui/tree/main/examples/llama-deploy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              https://github.com/run-llama/chat-ui/tree/main/examples/llama-deploy
              →
            </a>
            <p className="mt-1 text-sm text-gray-600">
              Full source code for this Llama Deploy + Chat UI integration
              example
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-md bg-blue-50 p-4">
          <h3 className="mb-2 font-semibold text-blue-900">🚀 Quick Start</h3>
          <p className="text-sm text-blue-800">
            Install the Chat UI components in your own project:
          </p>
          <code className="mt-2 block rounded bg-blue-100 p-2 text-sm text-blue-900">
            npm install @llamaindex/chat-ui
          </code>
        </div>
      </div>
    </div>
  )
}
