'use client'

import { ChatSection, useChatWorkflow } from '@llamaindex/chat-ui'

const DEPLOYMENT_NAME = 'QuickStart'
const DEFAULT_WORKFLOW = 'chat_workflow'

export default function Home() {
  const handler = useChatWorkflow({
    deployment: DEPLOYMENT_NAME,
    workflow: DEFAULT_WORKFLOW,
  })

  return (
    <main className="h-screen w-1/2 mx-auto">
      <ChatSection handler={handler} />
    </main>
  )
}
