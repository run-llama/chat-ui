import { ChatContext } from '../chat/chat.interface'
import { cn } from '../lib/utils'
import { v4 as uuidv4 } from 'uuid'

export type SuggestedQuestionsData = string[]

export function SuggestedQuestions({
  questions,
  sendMessage,
  requestData,
  className,
}: {
  questions: SuggestedQuestionsData
  sendMessage: ChatContext['sendMessage']
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
              sendMessage(
                {
                  id: uuidv4(),
                  role: 'user',
                  parts: [{ type: 'text', text: question }],
                },
                { body: requestData }
              )
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
