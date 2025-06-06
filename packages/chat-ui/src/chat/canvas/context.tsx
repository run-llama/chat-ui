'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  Artifact,
  CodeArtifact,
  extractArtifactsFromMessage,
  CodeArtifactError,
  extractArtifactsFromAllMessages,
  isEqualArtifact,
  DocumentArtifact,
} from './artifacts'
import { Message } from '../chat.interface'
import { useChatUI } from '../chat.context'
import { toInlineAnnotation } from '../annotations'

interface ChatCanvasContextType {
  allArtifacts: Artifact[]
  getArtifactsByType: (type: Artifact['type']) => Artifact[]
  displayedArtifact: Artifact | undefined
  isCanvasOpen: boolean
  openArtifactInCanvas: (artifact: Artifact) => void
  closeCanvas: () => void
  appendErrors: (artifact: CodeArtifact, errors: string[]) => void
  clearCodeErrors: (artifact: CodeArtifact) => void
  getCodeErrors: (artifact: CodeArtifact) => string[]
  fixCodeErrors: (artifact: CodeArtifact) => void
  getArtifactVersion: (artifact: Artifact) => {
    versionNumber: number
    isLatest: boolean
  }
  restoreArtifact: (artifact: Artifact) => void
  updateArtifact: (artifact: Artifact, content: string) => void
}

const ChatCanvasContext = createContext<ChatCanvasContextType | undefined>(
  undefined
)

export function ChatCanvasProvider({ children }: { children: ReactNode }) {
  const { messages, isLoading, append, requestData, setMessages } = useChatUI()

  const [isCanvasOpen, setIsCanvasOpen] = useState(false) // whether the canvas is open
  const [displayedArtifact, setDisplayedArtifact] = useState<Artifact>() // the artifact currently displayed in the canvas
  const [codeErrors, setCodeErrors] = useState<CodeArtifactError[]>([]) // contain all errors when compiling with Babel and runtime

  const allArtifacts = useMemo(
    () => extractArtifactsFromAllMessages(messages),
    [messages]
  )

  // get all artifacts from the last message, this may not be the latest artifact in case last message doesn't have any artifact
  const artifactsFromLastMessage = useMemo(() => {
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage) return []
    const artifacts = extractArtifactsFromMessage(lastMessage)
    return artifacts
  }, [messages])

  useEffect(() => {
    // when stream is loading and last message has a artifact, open the canvas with that artifact
    if (artifactsFromLastMessage.length > 0 && isLoading) {
      setIsCanvasOpen(true)
      setDisplayedArtifact(
        artifactsFromLastMessage[artifactsFromLastMessage.length - 1]
      )
    }
  }, [artifactsFromLastMessage, isCanvasOpen, isLoading])

  const openArtifactInCanvas = (artifact: Artifact) => {
    setDisplayedArtifact(artifact)
    setIsCanvasOpen(true)
  }

  const getArtifactsByType = (type: Artifact['type']) => {
    return allArtifacts.filter(a => a.type === type)
  }

  const getArtifactVersion = (artifact: Artifact) => {
    const allArtifactsByCurrentType = getArtifactsByType(artifact.type)
    const versionNumber =
      allArtifactsByCurrentType.findIndex(a => isEqualArtifact(a, artifact)) + 1
    return {
      versionNumber,
      isLatest: versionNumber === allArtifactsByCurrentType.length,
    }
  }

  const restoreArtifact = (artifact: Artifact) => {
    if (!setMessages) return

    const newArtifact = {
      ...artifact,
      created_at: Date.now(),
    }

    const newMessages = [
      ...messages,
      {
        id: `restore-msg-${Date.now()}`,
        role: 'user',
        content: `Restore to ${artifact.type} version ${getArtifactVersion(artifact).versionNumber}`,
      },
      {
        id: `restore-success-${Date.now()}`,
        role: 'assistant',
        content: `Successfully restored to ${artifact.type} version ${getArtifactVersion(artifact).versionNumber}\n${toInlineAnnotation({ type: 'artifact', data: newArtifact })}`,
      },
    ] as (Message & { id: string })[]

    setMessages(newMessages)

    openArtifactInCanvas(newArtifact)
  }

  const updateArtifact = (artifact: Artifact, content: string) => {
    if (!setMessages) return

    let newArtifact: Artifact | undefined

    if (artifact.type === 'code') {
      const codeArtifact = artifact as CodeArtifact
      newArtifact = {
        created_at: Date.now(),
        type: 'code',
        data: {
          code: content,
          file_name: codeArtifact.data.file_name,
          language: codeArtifact.data.language,
        },
      }
    } else if (artifact.type === 'document') {
      const documentArtifact = artifact as DocumentArtifact
      newArtifact = {
        created_at: Date.now(),
        type: 'document',
        data: {
          content,
          title: documentArtifact.data.title,
          type: documentArtifact.data.type,
          sources: documentArtifact.data.sources,
        },
      }
    }

    if (!newArtifact) return

    const newMessages = [
      ...messages,
      {
        role: 'user',
        content: `Update content for ${artifact.type} artifact version ${getArtifactVersion(artifact).versionNumber}`,
      },
      {
        role: 'assistant',
        content: `Updated content for ${artifact.type} artifact version ${getArtifactVersion(artifact).versionNumber}\n${toInlineAnnotation({ type: 'artifact', data: newArtifact })}`,
      },
    ] as (Message & { id: string })[]

    setMessages(newMessages)
    openArtifactInCanvas(newArtifact)
  }

  const closeCanvas = () => {
    setIsCanvasOpen(false)
    setDisplayedArtifact(undefined)
  }

  const appendErrors = (artifact: CodeArtifact, errors: string[]) => {
    setIsCanvasOpen(true)
    setCodeErrors(prev => [...prev, { artifact, errors }])
  }

  const clearCodeErrors = (artifact: CodeArtifact) => {
    setCodeErrors(prev =>
      prev.filter(error => !isEqualArtifact(error.artifact, artifact))
    )
  }

  const getCodeErrors = (artifact: CodeArtifact): string[] => {
    const artifactErrors = codeErrors.find(error =>
      isEqualArtifact(error.artifact, artifact)
    )
    const uniqueErrors = Array.from(new Set(artifactErrors?.errors ?? []))
    return uniqueErrors
  }

  const fixCodeErrors = (artifact: CodeArtifact) => {
    const errors = getCodeErrors(artifact)
    if (errors.length === 0) return
    append(
      {
        role: 'user',
        content: `Please fix the following errors: ${errors.join('\n')} happened when running the code.`,
      },
      { data: requestData }
    )
  }

  return (
    <ChatCanvasContext.Provider
      value={{
        allArtifacts,
        getArtifactsByType,
        displayedArtifact,
        isCanvasOpen,
        openArtifactInCanvas,
        closeCanvas,
        appendErrors,
        clearCodeErrors,
        getCodeErrors,
        fixCodeErrors,
        getArtifactVersion,
        restoreArtifact,
        updateArtifact,
      }}
    >
      {children}
    </ChatCanvasContext.Provider>
  )
}

export function useChatCanvas(): ChatCanvasContextType {
  const context = useContext(ChatCanvasContext)
  if (context === undefined) {
    throw new Error('useChatCanvas must be used within a ChatCanvasProvider')
  }
  return context
}
