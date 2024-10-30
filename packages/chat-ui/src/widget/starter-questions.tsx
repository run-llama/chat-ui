'use client'

import { useChatUI } from '../chat/chat.context'
import { Button } from '../ui/button'

interface StarterQuestionsProps {
  questions: string[]
}

export function StarterQuestions(props: StarterQuestionsProps) {
  const { append } = useChatUI()

  return (
    <div className="absolute bottom-6 left-0 w-full">
      <div className="mx-20 grid grid-cols-2 gap-2">
        {props.questions.map((question, i) => (
          <Button
            key={i}
            variant="outline"
            onClick={() => append({ role: 'user', content: question })}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  )
}
