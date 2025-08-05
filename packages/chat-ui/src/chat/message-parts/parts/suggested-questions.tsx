import { cn } from '../../../lib/utils'
import {
  SuggestedQuestions,
  SuggestedQuestionsData,
} from '../../../widgets/index.js'
import { useChatMessage } from '../../chat-message.context.js'
import { useChatUI } from '../../chat.context.js'
import { usePartData } from '../context.js'

export const SuggestedQuestionsPartType = 'data-suggested-questions' as const

/**
 * Render a suggested questions part as a SuggestedQuestions component.
 * Displayed at the bottom of the message with `order-last` style.
 */
export function SuggestedQuestionsPart({ className }: { className?: string }) {
  const { append, requestData } = useChatUI()
  const { isLast } = useChatMessage()
  if (!isLast || !append) return null

  const suggestedQuestions = usePartData<SuggestedQuestionsData>(
    SuggestedQuestionsPartType
  )

  if (!suggestedQuestions) return null
  return (
    <SuggestedQuestions
      questions={suggestedQuestions}
      append={append}
      requestData={requestData}
      className={cn('order-last', className)}
    />
  )
}
