import { describe, it, expect, vi, beforeEach } from 'vitest'
import { transformEventToMessageParts } from '../../hook/use-chat-workflow/helper'
import { WorkflowEventType, WorkflowEvent } from '../../hook/use-workflow/types'
import { MessageAnnotationType } from '../../chat/annotations/types'

describe('useChatWorkflow - transformEventToMessageParts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('AgentStreamEvent handling', () => {
    it('should return delta for agent stream events', () => {
      const event: WorkflowEvent = {
        type: WorkflowEventType.AgentStream.toString(),
        data: {
          delta: 'Hello, world!',
        },
      }

      const result = transformEventToMessageParts(event)

      expect(result).toEqual({
        delta: 'Hello, world!',
        annotations: [],
      })
    })

    it('should handle empty delta in agent stream events', () => {
      const event: WorkflowEvent = {
        type: WorkflowEventType.AgentStream.toString(),
        data: {
          delta: '',
        },
      }

      const result = transformEventToMessageParts(event)

      expect(result).toEqual({
        delta: '',
        annotations: [],
      })
    })
  })

  describe('ArtifactEvent handling (inline events)', () => {
    it('should convert artifact events to inline annotations', () => {
      const artifactData = {
        type: MessageAnnotationType.ARTIFACT,
        data: {
          title: 'Test Artifact',
          content: 'Some artifact content',
        },
      }

      const event: WorkflowEvent = {
        type: WorkflowEventType.ArtifactEvent.toString(),
        data: artifactData,
      }

      const result = transformEventToMessageParts(event)

      expect(result.delta).toContain('```annotation')
      expect(result.delta).toContain(JSON.stringify(artifactData))
      expect(result.annotations).toEqual([])
    })

    it('should handle artifact events with complex data', () => {
      const complexArtifactData = {
        type: MessageAnnotationType.ARTIFACT,
        data: {
          title: 'Complex Artifact',
          content: {
            code: 'console.log("hello")',
            language: 'javascript',
            metadata: {
              author: 'test',
              created: new Date().toISOString(),
            },
          },
        },
      }

      const event: WorkflowEvent = {
        type: WorkflowEventType.ArtifactEvent.toString(),
        data: complexArtifactData,
      }

      const result = transformEventToMessageParts(event)

      expect(result.delta).toContain('```annotation')
      expect(result.delta).toContain(JSON.stringify(complexArtifactData))
      expect(result.annotations).toEqual([])
    })
  })

  describe('SourceNodesEvent handling', () => {
    it('should convert source nodes events to vercel annotations', () => {
      const event: WorkflowEvent = {
        type: WorkflowEventType.SourceNodesEvent.toString(),
        data: {
          nodes: [
            {
              node: {
                id_: 'node-1',
                metadata: {
                  title: 'Test Document',
                  URL: 'https://example.com/doc1',
                },
                text: 'This is the content of node 1',
              },
              score: 0.95,
            },
            {
              node: {
                id_: 'node-2',
                metadata: {
                  title: 'Another Document',
                  URL: 'https://example.com/doc2',
                },
                text: 'This is the content of node 2',
              },
              score: 0.87,
            },
          ],
        },
      }

      const result = transformEventToMessageParts(event)

      expect(result.delta).toBe('')
      expect(result.annotations).toHaveLength(1)
      expect(result.annotations[0]).toEqual({
        type: MessageAnnotationType.SOURCES,
        data: {
          nodes: [
            {
              id: 'node-1',
              metadata: {
                title: 'Test Document',
                URL: 'https://example.com/doc1',
              },
              score: 0.95,
              text: 'This is the content of node 1',
              url: 'https://example.com/doc1',
            },
            {
              id: 'node-2',
              metadata: {
                title: 'Another Document',
                URL: 'https://example.com/doc2',
              },
              score: 0.87,
              text: 'This is the content of node 2',
              url: 'https://example.com/doc2',
            },
          ],
        },
      })
    })

    it('should handle source nodes events with empty nodes array', () => {
      const consoleSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined)

      const event: WorkflowEvent = {
        type: WorkflowEventType.SourceNodesEvent.toString(),
        data: {
          nodes: [],
        },
      }

      const result = transformEventToMessageParts(event)

      expect(result.delta).toBe('')
      expect(result.annotations).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('No nodes found in source nodes event')
      )

      consoleSpy.mockRestore()
    })

    it('should handle source nodes without URL metadata', () => {
      const event: WorkflowEvent = {
        type: WorkflowEventType.SourceNodesEvent.toString(),
        data: {
          nodes: [
            {
              node: {
                id_: 'node-without-url',
                metadata: {
                  title: 'Document without URL',
                },
                text: 'Content without URL',
              },
              score: 0.8,
            },
          ],
        },
      }

      const result = transformEventToMessageParts(event)

      expect(result.annotations[0].data).toHaveProperty('nodes')
      expect((result.annotations[0].data as any).nodes[0]).toEqual({
        id: 'node-without-url',
        metadata: {
          title: 'Document without URL',
        },
        score: 0.8,
        text: 'Content without URL',
        url: "",
      })
    })
  })

  describe('UIEvent handling', () => {
    it('should convert UI events to vercel annotations', () => {
      const event: WorkflowEvent = {
        type: WorkflowEventType.UIEvent.toString(),
        data: {
          type: 'weather',
          data: {
            location: 'San Francisco',
            temperature: 22,
            condition: 'sunny',
            humidity: 50,
            windSpeed: 10,
          },
        },
      }

      const result = transformEventToMessageParts(event)

      expect(result.delta).toBe('')
      expect(result.annotations).toHaveLength(1)
      expect(result.annotations[0]).toEqual({
        type: 'weather',
        data: {
          location: 'San Francisco',
          temperature: 22,
          condition: 'sunny',
          humidity: 50,
          windSpeed: 10,
        },
      })
    })
  })
})
