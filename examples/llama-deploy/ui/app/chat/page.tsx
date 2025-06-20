'use client'

import {
  ChatInput,
  ChatMessage,
  ChatMessages,
  ChatSection,
  useChatUI,
  useChatWorkflow,
} from '@llamaindex/chat-ui'
import { WeatherAnnotation } from '../components/custom-weather'

const DEPLOYMENT_NAME = 'QuickStart'
const DEFAULT_WORKFLOW = 'chat_workflow'

export default function Page(): JSX.Element {
  const handler = useChatWorkflow({
    baseUrl: 'http://localhost:4501',
    deployment: DEPLOYMENT_NAME,
    workflow: DEFAULT_WORKFLOW,
    onError: error => {
      console.error(error)
    },
  })

  return (
    <div className="mx-auto h-screen w-2/3 flex-1">
      <ChatSection handler={handler}>
        <CustomChatMessages />
        <ChatInput />
      </ChatSection>
    </div>
  )
}

function CustomChatMessages() {
  const { messages, isLoading, append } = useChatUI()
  return (
    <ChatMessages>
      <ChatMessages.List className="px-4 py-6">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isLast={index === messages.length - 1}
            className="mb-4"
          >
            <ChatMessage.Avatar />
            <ChatMessage.Content isLoading={isLoading} append={append}>
              <ChatMessage.Content.Markdown />
              <WeatherAnnotation />
              <ChatMessage.Content.Source />
            </ChatMessage.Content>
            <ChatMessage.Actions />
          </ChatMessage>
        ))}
        <ChatMessages.Empty
          heading="LlamaDeploy with Chat UI Example"
          subheading="Demo using useChatWorkflow hook"
        />
        <ChatMessages.Loading />
      </ChatMessages.List>
    </ChatMessages>
  )
}
