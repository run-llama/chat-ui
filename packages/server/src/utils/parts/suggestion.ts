import { getEnv } from '@llamaindex/env'
import { workflowEvent } from '@llamaindex/workflow'
import { type ChatMessage, Settings } from 'llamaindex'
import { getMessageTextContent } from './text'

export const SUGGESTION_PART_TYPE = `data-suggested_questions` as const

export type SuggestionData = string[]

export type SuggestionPart = {
  id?: string
  type: typeof SUGGESTION_PART_TYPE
  data: SuggestionData
}

export const suggestionEvent = workflowEvent<SuggestionPart>()

const NEXT_QUESTION_PROMPT = `You're a helpful assistant! 
Your task is to suggest the next question that user might ask. 
Here is the conversation history
---------------------
{conversation}
---------------------
Given the conversation history, please give me 3 questions that user might ask next!
Your answer should be wrapped in three sticks which follows the following format:
\`\`\`
<question 1>
<question 2>
<question 3>
\`\`\`
`

export async function generateNextQuestions(conversation: ChatMessage[]) {
  const conversationText = conversation
    .map(
      message => `${message.role}: ${getMessageTextContent(message.content)}`
    )
    .join('\n')
  const promptTemplate = getEnv('NEXT_QUESTION_PROMPT') || NEXT_QUESTION_PROMPT
  const message = promptTemplate.replace('{conversation}', conversationText)

  try {
    const response = await Settings.llm.complete({ prompt: message })
    const questions = extractQuestions(response.text)
    return questions
  } catch (error) {
    console.error('Error when generating the next questions: ', error)
    return []
  }
}

function extractQuestions(text: string): string[] {
  // Extract the text inside the triple backticks
  const contentMatch = text.match(/```(.*?)```/s)
  const content = contentMatch?.[1] ?? ''

  // Split the content by newlines to get each question
  const questions = content
    .split('\n')
    .map(question => question.trim())
    .filter(question => question !== '')

  return questions
}
