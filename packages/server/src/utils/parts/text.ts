import { agentStreamEvent, type WorkflowEventData } from '@llamaindex/workflow'
import type { ChatResponseChunk } from 'llamaindex'

export async function writeResponseToStream(
  generator: AsyncIterable<ChatResponseChunk<object>>,
  sendEvent: (event: WorkflowEventData<unknown>) => void
) {
  let response = ''
  if (generator) {
    for await (const chunk of generator) {
      response += chunk.delta
      sendEvent(
        agentStreamEvent.with({
          delta: chunk.delta,
          response,
          currentAgentName: 'LLM',
          raw: chunk.raw,
        })
      )
    }
  }
  return response
}
