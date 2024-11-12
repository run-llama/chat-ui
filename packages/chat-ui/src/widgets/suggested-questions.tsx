import { SuggestedQuestionsData } from '../chat/annotation'
import { ChatHandler } from '../chat/chat.interface'

export function SuggestedQuestions({
  questions,
  append,
}: {
  questions: SuggestedQuestionsData
  append: ChatHandler['append']
}) {
  const showQuestions = questions.length > 0
  return (
    showQuestions && (
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
