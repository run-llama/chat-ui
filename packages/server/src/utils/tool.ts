import {
  type AgentToolCallResult,
  type WorkflowEventData,
} from '@llamaindex/workflow'
import { type Metadata, type NodeWithScore } from 'llamaindex'
import { toSourceEvent } from './parts'

export interface AgentToolCallResultParser {
  toWorkflowEvent(
    toolCallResult: AgentToolCallResult
  ): WorkflowEventData<any, string> | null
}

export class QueryEngineToolResultParser implements AgentToolCallResultParser {
  constructor(private readonly llamaCloudOutputDir?: string | undefined) {}

  toWorkflowEvent(toolCallResult: AgentToolCallResult) {
    const toolOutput = toolCallResult.raw
    if (
      toolOutput != null &&
      typeof toolOutput === 'object' &&
      'sourceNodes' in toolOutput &&
      Array.isArray(toolOutput.sourceNodes)
    ) {
      const sourceNodes =
        toolOutput.sourceNodes as unknown as NodeWithScore<Metadata>[]
      return toSourceEvent(sourceNodes, this.llamaCloudOutputDir)
    }
    return null
  }
}
