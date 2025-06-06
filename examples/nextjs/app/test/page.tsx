'use client'

import { chatAction } from './action'
import { useState } from 'react'

export default function Home() {
  const [ui, setUI] = useState<React.ReactNode | null>(null)

  const submitAction = async (formData: FormData) => {
    const question = formData.get('question') as string
    console.log({ question })
    const uiStream = await chatAction(question)
    setUI(uiStream)
  }

  return (
    <div>
      <form action={submitAction}>
        <input type="text" name="question" />
        <button
          type="submit"
          onClick={async () => {
            const uiStream = await chatAction('Hello, how are you?')
            setUI(uiStream)
          }}
        >
          Chat
        </button>
      </form>
      <div>{ui}</div>
    </div>
  )
}
