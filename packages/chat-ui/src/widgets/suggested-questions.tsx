import { ChatContext } from '../chat/chat.interface'
import { cn } from "../lib/utils"

export type SuggestedQuestionsData = string[]

export function SuggestedQuestions({
  questions,
  append,
  requestData,
  className,
}: {
  questions: SuggestedQuestionsData
  append: ChatContext['append']
  requestData?: any
  className?: string
}) {
  const showQuestions = questions.length > 0
  return (
    showQuestions && (
      <div className={cn('flex flex-col space-y-2', className)}>
        {questions.map((question, index) => (
          <a
            key={index}
            onClick={() => {
              append({ role: 'user', content: question }, { data: requestData })
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
