'use client'

import { SuggestedQuestionsData } from '../chat/annotation'
import { ChatHandler } from '../chat/chat.interface'

export function SuggestedQuestions({
  questions,
  append,
  isLastMessage,
}: {
  questions: SuggestedQuestionsData
  append?: Pick<ChatHandler, 'append'>['append']
  isLastMessage: boolean
}) {
  const showQuestions = isLastMessage && questions.length > 0
  return (
    showQuestions &&
    append !== undefined && (
      <div className="flex flex-col space-y-2">
        {questions.map((question, index) => (
          <a
            key={index}
            onClick={() => {
              append({ role: 'user', content: question })
            }}
            className="cursor-pointer text-sm italic hover:underline"
          >
            {'->'} {question}
          </a>
        ))}
      </div>
    )
  )
}
