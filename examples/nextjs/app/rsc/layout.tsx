import '../globals.css'
import '@llamaindex/chat-ui/styles/markdown.css'
import '@llamaindex/chat-ui/styles/pdf.css'
import '@llamaindex/chat-ui/styles/editor.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AI as AIProvider } from './ai'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LlamaIndex Chat UI - RSC Next.js Example',
  description: 'A simple RSC Next.js application using @llamaindex/chat-ui',
}

// for RSC example, we need to wrap the children with the AIProvider
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AIProvider>{children}</AIProvider>
      </body>
    </html>
  )
}
