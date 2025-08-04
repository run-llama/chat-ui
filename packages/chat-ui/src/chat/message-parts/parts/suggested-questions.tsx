import {
  SuggestedQuestions,
  SuggestedQuestionsData,
} from '../../../widgets/index.js'
import { useChatMessage } from '../../chat-message.context.js'
import { useChatUI } from '../../chat.context.js'
import { usePart } from '../context.js'
import { MessagePartType } from '../types.js'

/**
 * Render a suggested questions part as a SuggestedQuestions component.
 * Displayed at the bottom of the message with `order-last` style.
 */
export function SuggestedQuestionsPart() {
  const { append, requestData } = useChatUI()
  const { isLast } = useChatMessage()
  if (!isLast || !append) return null

  const suggestedQuestions = usePart<SuggestedQuestionsData>(
    MessagePartType.SUGGESTED_QUESTIONS
  )

  if (!suggestedQuestions) return null
  return (
    <div className="order-last">
      <SuggestedQuestions
        questions={suggestedQuestions}
        append={append}
        requestData={requestData}
      />
    </div>
  )
}
