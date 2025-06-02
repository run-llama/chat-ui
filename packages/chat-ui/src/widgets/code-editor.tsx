import CodeMirror, { Extension } from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { githubLight } from '@uiw/codemirror-theme-github'
import { cn } from '../lib/utils'

type CodeEditorLanguage = 'javascript' | 'python' | 'html' | 'css'

const languageExtensions: Record<CodeEditorLanguage, Extension> = {
  javascript: javascript({ jsx: true }),
  python: python(),
  html: html(),
  css: css(),
}

const getLanguageExtension = (language: CodeEditorLanguage) => {
  const extension = languageExtensions[language]
  if (!extension) {
    console.warn(
      `Unsupported language: ${language}, using javascript editor as fallback`
    )
    return languageExtensions.javascript
  }
  return extension
}

export function CodeEditor({
  code,
  onChange,
  className,
  language = 'javascript',
}: {
  code: string
  onChange?: (code: string) => void
  className?: string
  language?: 'javascript' | 'python' | 'html' | 'css'
}) {
  return (
    <CodeMirror
      className={cn('h-full text-[14px]', className)}
      value={code}
      extensions={[getLanguageExtension(language)]}
      onChange={onChange}
      theme={githubLight}
    />
  )
}

export function fileExtensionToEditorLang(
  extension: string
): CodeEditorLanguage | undefined {
  if (['js', 'jsx', 'ts', 'tsx'].includes(extension)) return 'javascript'
  if (extension === 'py') return 'python'
  if (extension === 'html') return 'html'
  if (extension === 'css') return 'css'

  console.warn(`Unsupported file extension: ${extension}`)
  return undefined
}
