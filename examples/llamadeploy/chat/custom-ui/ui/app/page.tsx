'use client'

import {
  ChatCanvas,
  ChatInput,
  ChatMessage,
  ChatMessages,
  ChatSection,
  ChatWorkflowResume,
  useChatUI,
  useChatWorkflow,
} from '@llamaindex/chat-ui'
import { WeatherPart } from '@/components/custom/custom-weather'
import { CLIHumanInput } from '@/components/custom/human-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { StarterQuestions } from '@llamaindex/chat-ui/widgets'

const DEPLOYMENT_NAME = 'chat'
const DEFAULT_WORKFLOW = 'chat_workflow'

const chatStarterQuestions = [
  'What can you do?',
  'Write a poem about the weather',
]

const hitlStarterQuestions = [
  'List all files in the current directory',
  'Check status of the git repository',
]

export default function Page(): JSX.Element {
  const [workflow, setWorkflow] = useState(DEFAULT_WORKFLOW)

  const handler = useChatWorkflow({
    deployment: DEPLOYMENT_NAME,
    workflow,
    onError: error => {
      console.error(error)
    },
  })

  return (
    <div className="relative h-screen">
      <div className="absolute left-6 top-6 z-10">
        <Select
          value={workflow}
          onValueChange={setWorkflow}
          disabled={handler.isLoading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select workflow" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chat_workflow">Chat Workflow</SelectItem>
            <SelectItem value="agent_workflow">Agent Workflow</SelectItem>
            <SelectItem value="cli_workflow">CLI HITL Workflow</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ChatSection
        handler={handler}
        className="block h-screen flex-row gap-4 p-0 md:flex md:p-5"
      >
        <div className="md:max-w-1/2 mx-auto flex h-full min-w-0 max-w-full flex-1 flex-col gap-4">
          <CustomChatMessages
            resumeWorkflow={handler.resume}
            workflow={workflow}
          />
          <ChatInput />
        </div>
        <ChatCanvas className="w-full md:w-2/3" />
      </ChatSection>
    </div>
  )
}

function CustomChatMessages({
  resumeWorkflow,
  workflow,
}: {
  resumeWorkflow: ChatWorkflowResume
  workflow: string
}) {
  const { messages, isLoading, append } = useChatUI()
  const starterQuestions =
    workflow === 'cli_workflow' ? hitlStarterQuestions : chatStarterQuestions
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
              <CLIHumanInput resumeWorkflow={resumeWorkflow} />
              <ChatMessage.Part.Markdown />
              <WeatherPart />
              <ChatMessage.Part.Source />
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
      {messages.length === 0 && (
        <StarterQuestions questions={starterQuestions} append={append} />
      )}
    </ChatMessages>
  )
}
