import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { cn } from '../lib/utils'
import { githubLight } from '@uiw/codemirror-theme-github'

export function CodeEditor({
  code,
  onChange,
  className,
}: {
  code: string
  onChange?: (code: string) => void
  className?: string
}) {
  return (
    <CodeMirror
      className={cn('h-full text-[14px]', className)}
      value={code}
      extensions={[javascript({ jsx: true }), python(), html(), css()]}
      onChange={onChange}
      theme={githubLight}
    />
  )
}
