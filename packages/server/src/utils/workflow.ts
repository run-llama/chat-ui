import {
  agentStreamEvent,
  agentToolCallEvent,
  agentToolCallResultEvent,
  startAgentEvent,
  WorkflowStream,
  type AgentInputData,
  type Workflow,
  type WorkflowContext,
  type WorkflowEvent,
  type WorkflowEventData,
} from '@llamaindex/workflow'
import {
  LLamaCloudFileService,
  type Metadata,
  type NodeWithScore,
} from 'llamaindex'
import {
  runEvent,
  sourceEvent,
  toSourceEvent,
  type EventPart,
  type SourceEventNode,
  type TextDeltaPart,
} from './parts'
import { downloadFile } from './file'
import {
  resumeWorkflowFromHumanResponses,
  type HumanResponseEventData,
} from './hitl/index'
import type { UIMessageStreamWriter } from 'ai'

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

export interface WorkflowStreamCallbacks {
  onStart?: (writer: UIMessageStreamWriter) => Promise<void> | void
  onFinal?: (
    completion: string,
    writer: UIMessageStreamWriter
  ) => Promise<void> | void
  onText?: (text: string, writer: UIMessageStreamWriter) => Promise<void> | void
  onPauseForHumanInput?:
    | ((event: WorkflowEvent<HumanResponseEventData>) => Promise<void> | void)
    | undefined
}

const encoder = new TextEncoder()

function toSSE(chunk: any) {
  return encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`)
}

export function llamaindexWorkflowEventsToSSE(
  // TODO: handle callbacks
  callbacks?: WorkflowStreamCallbacks
) {
  return new TransformStream({
    start(controller) {
      // onStart
    },
    async transform(event, controller) {
      // agentStreamEvent -> send a text-delta to stream
      // TODO: need agentStreamStartEvent, agentStreamEndEvent
      // TODO: need id to group agentStreamEvent, agentStreamStartEvent, agentStreamEndEvent
      // TODO: make a TextPartTransformer pipe?
      if (agentStreamEvent.include(event)) {
        const { delta, currentAgentName } = event.data
        const textDeltaPart: TextDeltaPart = {
          id: currentAgentName,
          type: 'text-delta',
          delta,
        }
        controller.enqueue(toSSE(textDeltaPart))
      }

      // agentToolCallEvent -> send a running event to stream
      // TODO: make a RunningEventTransformer pipe?
      if (agentToolCallEvent.include(event)) {
        const { agentName, toolName, toolKwargs, toolId } = event.data
        const runEventPart: EventPart = {
          // TODO: maybe toolCallId is better, because 1 tool can be called multiple times
          id: toolName, // use toolName as id to reconciliation with agentToolCallResultEvent
          type: 'data-event',
          data: {
            title: `Agent Tool Call: ${agentName}`,
            description: `Using tool: '${toolName}' with inputs: '${JSON.stringify(toolKwargs)}'`,
            status: 'pending',
            data: event.data,
          },
        }
        controller.enqueue(toSSE(runEventPart))
      }

      // agentToolCallResultEvent -> send a running event with data to stream
      if (agentToolCallResultEvent.include(event)) {
        const { raw, toolName, toolKwargs, toolOutput, toolId } = event.data
        const dataEventPart: EventPart = {
          id: toolName, // use toolName as id to reconciliation with agentToolCallEvent
          type: 'data-event',
          data: {
            title: `Agent Tool Call Result: ${toolName}`,
            description: `Using tool: '${toolName}' with inputs: '${JSON.stringify(toolKwargs)}'`,
            status: 'success',
            data: raw,
          },
        }
        controller.enqueue(toSSE(dataEventPart))
      }

      // if detect source nodes, send source event at the end of stream, also download files in background
    },
    flush(controller) {
      // onFinal
    },
  })
}

async function downloadLlamaCloudFilesFromNodes(nodes: SourceEventNode[]) {
  const downloadedFiles: string[] = []

  for (const node of nodes) {
    if (!node.url || !node.filePath) continue // skip if url or filePath is not available
    if (downloadedFiles.includes(node.filePath)) continue // skip if file already downloaded
    if (!node.metadata.pipeline_id) continue // only download files from LlamaCloud

    const downloadUrl = await LLamaCloudFileService.getFileUrl(
      node.metadata.pipeline_id,
      node.fileName
    )
    if (!downloadUrl) continue

    await downloadFile(downloadUrl, node.filePath)

    downloadedFiles.push(node.filePath)
  }
}
