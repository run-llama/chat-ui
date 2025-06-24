'use client'

import {
  ChatWorkflowResume,
  getAnnotationData,
  useChatMessage,
} from '@llamaindex/chat-ui'

interface CLIHumanInputData {
  command: string
}

interface CLIHumanResponseData {
  execute: boolean
  command: string
}

// qualified name of the event from workflow definition
const CLI_HUMAN_INPUT_EVENT_TYPE = 'cli_workflow.CLIHumanInputEvent'
const CLI_HUMAN_RESPONSE_EVENT_TYPE = 'cli_workflow.CLIHumanResponseEvent'

export function CLIHumanInput({ resume }: { resume: ChatWorkflowResume }) {
  const { message } = useChatMessage()
  const humanInputData = getAnnotationData<CLIHumanInputData>(
    message,
    CLI_HUMAN_INPUT_EVENT_TYPE
  )
  if (humanInputData.length === 0) return null
  return <CLIHumanInputCard data={humanInputData[0]} resume={resume} />
}

function CLIHumanInputCard({
  data,
  resume,
}: {
  data: CLIHumanInputData
  resume: ChatWorkflowResume
}) {
  if (!data.command) return null

  const handleConfirm = async () => {
    const responseData: CLIHumanResponseData = {
      execute: true,
      command: data.command,
    }
    await resume(CLI_HUMAN_RESPONSE_EVENT_TYPE, responseData)
  }

  const handleReject = async () => {
    const responseData: CLIHumanResponseData = {
      execute: false,
      command: data.command,
    }
    await resume(CLI_HUMAN_RESPONSE_EVENT_TYPE, responseData)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <p className="mb-4 text-base font-medium text-gray-700">
        Do you want to execute the following command?
      </p>
      <code className="mb-6 block rounded-md border border-gray-100 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-800">
        {data.command}
      </code>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleConfirm}
          className="rounded-md bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Execute
        </button>
        <button
          type="button"
          onClick={handleReject}
          className="rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
