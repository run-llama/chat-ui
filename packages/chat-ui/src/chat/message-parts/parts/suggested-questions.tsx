import {
  SuggestedQuestions,
  SuggestedQuestionsData,
} from '../../../widgets/index.js'
import { useChatMessage } from '../../chat-message.context.js'
import { useChatUI } from '../../chat.context.js'
import { usePartData } from '../context.js'

export const SuggestedQuestionsPartType = 'data-suggested-questions' as const

/**
 * Render a suggested questions part inside a ChatMessage, return null if current part is not suggested questions type
 * @param props.className - custom styles for the suggested questions
 */
export function SuggestedQuestionsPart({ className }: { className?: string }) {
  const { append, requestData } = useChatUI()
  const { isLast } = useChatMessage()
  const suggestedQuestions = usePartData<SuggestedQuestionsData>(
    SuggestedQuestionsPartType
  )

  if (!isLast || !append || !suggestedQuestions) return null

  return (
    <SuggestedQuestions
      questions={suggestedQuestions}
      append={append}
      requestData={requestData}
      className={className}
    />
  )
}
