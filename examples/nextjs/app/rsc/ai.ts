'use server'

import { createAI } from '@ai-sdk/rsc'
import { chatAction } from './action'
import { UIMessage as Message } from 'ai'
import { ReactNode } from 'react'

// define AI state and AI provider for RSC app
export const AI = createAI<
  Message[], // server state
  (Message & { display: ReactNode })[], // frontend state
  { chatAction: (question: string) => Promise<ReactNode> } // actions
>({
  actions: { chatAction },
  initialAIState: [],
  initialUIState: [],
})

export type AIProvider = typeof AI
