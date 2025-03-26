import { ChatHandler } from '../chat/chat.interface'
import { Button } from '../ui/button'

interface StarterQuestionsProps {
  questions: string[]
  append: ChatHandler['append']
}

export function StarterQuestions(props: StarterQuestionsProps) {
  return (
    <div className="absolute bottom-6 left-0 w-full">
      <div className="mx-10 grid grid-cols-2 gap-2">
        {props.questions.map((question, i) => (
          <Button
            key={i}
            variant="outline"
            onClick={() => props.append({ role: 'user', content: question })}
            className="h-auto whitespace-break-spaces"
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  )
}
