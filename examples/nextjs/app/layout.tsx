import './globals.css'
import '@llamaindex/chat-ui/styles/markdown.css'
import '@llamaindex/chat-ui/styles/pdf.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LlamaIndex Chat UI - Next.js Example',
  description: 'A simple Next.js application using @llamaindex/chat-ui',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
