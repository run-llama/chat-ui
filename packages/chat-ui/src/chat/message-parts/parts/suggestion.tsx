import {
  SuggestedQuestions,
  SuggestedQuestionsData,
} from '../../../widgets/index.js'
import { useChatMessage } from '../../chat-message.context.js'
import { useChatUI } from '../../chat.context.js'
import { usePartData } from '../context.js'

export const SuggestionPartType = 'data-suggested-questions' as const

/**
 * Render a suggested questions part inside a ChatMessage, return null if current part is not suggested questions type
 * This component is useful to show a list of suggested questions from the assistant.
 * @param props.className - custom styles for the suggested questions
 */
export function SuggestionPart({ className }: { className?: string }) {
  const { sendMessage, requestData } = useChatUI()
  const { isLast } = useChatMessage()
  const suggestedQuestions =
    usePartData<SuggestedQuestionsData>(SuggestionPartType)

  if (!isLast || !sendMessage || !suggestedQuestions) return null

  return (
    <SuggestedQuestions
      questions={suggestedQuestions}
      sendMessage={sendMessage}
      requestData={requestData}
      className={className}
    />
  )
}
