import { ChatHandler } from '../chat/chat.interface'

export type SuggestedQuestionsData = string[]

export function SuggestedQuestions({
  questions,
  append,
  requestData,
}: {
  questions: SuggestedQuestionsData
  append: ChatHandler['append']
  requestData?: any
}) {
  const showQuestions = questions.length > 0
  return (
    showQuestions && (
      <div className="flex flex-col space-y-2">
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
