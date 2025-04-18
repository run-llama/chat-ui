import { ChatHandler } from '../chat/chat.interface'
import { cn } from '../lib/utils'
import { Button } from '../ui/button'

interface StarterQuestionsProps {
  questions: string[]
  append: ChatHandler['append']
  className?: string
}

export function StarterQuestions(props: StarterQuestionsProps) {
  return (
    <div className={cn('w-full', props.className)}>
      <div className="grid grid-cols-2 gap-3">
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
