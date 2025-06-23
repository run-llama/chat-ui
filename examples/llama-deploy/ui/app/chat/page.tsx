'use client'

import {
  ChatCanvas,
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
    deployment: DEPLOYMENT_NAME,
    workflow: DEFAULT_WORKFLOW,
    onError: error => {
      console.error(error)
    },
  })

  return (
    <ChatSection
      handler={handler}
      className="block h-screen flex-row gap-4 p-0 md:flex md:p-5"
    >
      <div className="md:max-w-1/2 mx-auto flex h-full min-w-0 max-w-full flex-1 flex-col gap-4">
        <CustomChatMessages />
        <ChatInput />
      </div>
      <ChatCanvas className="w-full md:w-2/3" />
    </ChatSection>
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
