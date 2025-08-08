import {
  startAgentEvent,
  type AgentInputData,
  type Workflow,
  type WorkflowContext,
} from '@llamaindex/workflow'
import {
  resumeWorkflowFromHumanResponses,
  type HumanResponseEventData,
} from './hitl/index'

/**
 * Run a workflow with user input and return a workflow context
 */
export async function runWorkflow({
  workflow,
  input,
  human,
}: {
  workflow: Workflow
  input: AgentInputData
  human?: {
    snapshotId?: string | undefined // the snapshot id to restore workflow
    responses?: HumanResponseEventData[] // the data from human to trigger events after restoring
  }
}): Promise<WorkflowContext> {
  let context: WorkflowContext

  if (human?.responses?.length && human?.snapshotId) {
    // resume the workflow if there is human response
    context = await resumeWorkflowFromHumanResponses(
      workflow,
      human.responses,
      human.snapshotId
    )
  } else {
    // otherwise, create a new empty context and run the workflow with startAgentEvent
    context = workflow.createContext()
    context.sendEvent(
      startAgentEvent.with({
        userInput: input.userInput,
        chatHistory: input.chatHistory,
      })
    )
  }

  return context
}
