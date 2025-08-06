import { ChatMemoryBuffer, MessageContent, Settings } from 'llamaindex'

import { UIMessage } from '@ai-sdk/react'
import { FileData, ServerMessage } from '@llamaindex/server'
import {
  agentStreamEvent,
  createStatefulMiddleware,
  createWorkflow,
  startAgentEvent,
  stopAgentEvent,
  workflowEvent,
} from '@llamaindex/workflow'

const fileHelperEvent = workflowEvent<{
  userInput: MessageContent
  uploadedFile: FileData
}>()

/**
 * This is an simple workflow to demonstrate how to use uploaded files in the workflow.
 */
export function workflowFactory(reqBody: { messages: UIMessage[] }) {
  const llm = Settings.llm

  // First, extract the last attachment from the last message
  const lastMessage = reqBody.messages[reqBody.messages.length - 1]
  const serverMessage = new ServerMessage(lastMessage)
  const uploadedFile = serverMessage.attachments[0]?.data

  if (!uploadedFile) {
    throw new Error('Please upload a file to start')
  }

  const { withState, getContext } = createStatefulMiddleware(() => {
    return {
      memory: new ChatMemoryBuffer({ llm }),
      uploadedFile,
    }
  })
  const workflow = withState(createWorkflow())

  // Handle the start of the workflow: read the file content
  workflow.handle([startAgentEvent], async ({ data }) => {
    const { userInput } = data
    // Prepare chat history
    const { state } = getContext()
    if (!userInput) {
      throw new Error('Missing user input to start the workflow')
    }
    state.memory.put({ role: 'user', content: userInput })

    return fileHelperEvent.with({
      userInput,
      uploadedFile,
    })
  })

  // Use LLM to help the user with the file content
  workflow.handle([fileHelperEvent], async ({ data }) => {
    const { sendEvent } = getContext()

    const prompt = `
You are a helpful assistant that can help the user with their file.

Now, let help the user with this request:
${data.userInput}
`

    const response = await llm.chat({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'file',
              mimeType: data.uploadedFile.mediaType,
              data: data.uploadedFile.url,
            },
          ],
        },
      ],
      stream: true,
    })

    // Stream the response
    for await (const chunk of response) {
      sendEvent(
        agentStreamEvent.with({
          delta: chunk.delta,
          response: chunk.delta,
          currentAgentName: 'agent',
          raw: chunk.raw,
        })
      )
    }
    sendEvent(stopAgentEvent.with({ result: '' }))
  })

  return workflow
}
