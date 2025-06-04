'use client'

import dynamic from 'next/dynamic'
import { markdown } from './data'

const DocumentEditor = dynamic(
  () => import('@llamaindex/chat-ui/widgets').then(mod => mod.DocumentEditor),
  {
    ssr: false,
  }
)

export default function Home() {
  return (
    <div className="mx-auto h-screen w-1/2 py-4">
      <DocumentEditor content={markdown} onChange={console.log} />
    </div>
  )
}
