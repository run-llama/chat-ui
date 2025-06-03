'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Page(): JSX.Element {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="bg-gradient-conic absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            className="mb-20 flex flex-col items-center justify-center space-y-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="group relative">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-75 blur-lg transition duration-1000 group-hover:opacity-100" />
              <div className="relative rounded-full bg-gradient-to-r from-[#fad6f8] to-[#b5f2fd] p-1">
                <div className="rounded-full bg-black p-3">
                  <motion.img
                    src="/llama.png"
                    alt="LlamaIndex Logo"
                    className="h-16 w-16 rounded-full sm:h-20 sm:w-20"
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-gradient-rainbow text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl">
                LlamaIndex ChatUI
              </h1>
              <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            </div>

            <motion.p
              className="max-w-3xl text-xl leading-relaxed text-slate-300 sm:text-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            >
              A powerful React component library for building{' '}
              <span className="text-gradient-purple font-semibold">
                state-of-the-art
              </span>{' '}
              chat interfaces in LLM applications
            </motion.p>

            <motion.div
              className="flex flex-col gap-6 pt-8 sm:flex-row sm:items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            >
              <a
                href="https://github.com/run-llama/chat-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-full bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </span>
                <div className="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              </a>

              <a
                href="https://ts.llamaindex.ai/docs/chat-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Documentation
                </span>
                <div className="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              </a>

              <a
                href="https://www.npmjs.com/package/@llamaindex/chat-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
              >
                <span className="relative z-10">
                  npm install @llamaindex/chat-ui
                </span>
                <div className="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              </a>
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-4 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
            >
              {[
                {
                  href: '/demo/simple',
                  label: 'Simple Chat',
                  gradient: 'from-emerald-500 to-blue-500',
                },
                {
                  href: '/demo/custom',
                  label: 'Custom Chat',
                  gradient: 'from-pink-500 to-violet-500',
                },
                {
                  href: '/demo/latex',
                  label: 'Latex Chat',
                  gradient: 'from-yellow-500 to-orange-500',
                },
                {
                  href: '/demo/canvas',
                  label: 'Chat with Canvas',
                  gradient: 'from-orange-500 to-red-500',
                },
                {
                  href: '/demo/mermaid',
                  label: 'Mermaid Diagram',
                  gradient: 'from-green-500 to-blue-500',
                },
              ].map((demo, index) => (
                <motion.div
                  key={demo.href}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.8 + index * 0.1,
                    ease: 'easeOut',
                  }}
                >
                  <Link
                    href={demo.href}
                    className={`group relative overflow-hidden rounded-full bg-gradient-to-r ${demo.gradient} block px-6 py-2 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                  >
                    <span className="relative z-10">{demo.label}</span>
                    <div className="absolute inset-0 -translate-y-full transform bg-gradient-to-b from-white/20 to-transparent transition-transform duration-300 group-hover:translate-y-0" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="mx-auto mb-16 max-w-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1, ease: 'easeOut' }}
          >
            <div className="glass rounded-2xl p-8 shadow-2xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Quick Start
                </h2>
              </div>

              <div className="space-y-6">
                <div className="group">
                  <p className="mb-3 text-lg text-slate-300">
                    Add a chatbot to your project with Shadcn CLI:
                  </p>
                  <div className="relative overflow-hidden rounded-xl bg-black/40 p-6 backdrop-blur-sm">
                    <code className="font-mono text-lg text-emerald-400">
                      npx shadcn@latest add https://ui.llamaindex.ai/r/chat.json
                    </code>
                    <div className="absolute right-4 top-4">
                      <button className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-500 to-transparent" />
                  <span className="text-slate-400">or</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-500 to-transparent" />
                </div>

                <div className="group">
                  <p className="mb-3 text-lg text-slate-300">
                    Install manually:
                  </p>
                  <div className="relative overflow-hidden rounded-xl bg-black/40 p-6 backdrop-blur-sm">
                    <code className="font-mono text-lg text-blue-400">
                      npm install @llamaindex/chat-ui
                    </code>
                    <div className="absolute right-4 top-4">
                      <button className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
