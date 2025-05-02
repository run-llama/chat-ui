import {
  defaultMarkdownParser as markdownParser,
  defaultMarkdownSerializer as markdownSerializer,
} from 'prosemirror-markdown'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
import { history, undo, redo } from 'prosemirror-history'
import { schema as basicSchema } from 'prosemirror-schema-basic'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/utils'

export function DocumentEditor({
  content,
  onChange,
  className,
}: {
  content: string
  onChange?: (markdown: string) => void
  className?: string
}) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!editorRef.current || initialized) return

    const state = EditorState.create({
      doc:
        markdownParser.parse(content) ||
        basicSchema.topNodeType.createAndFill(),
      schema: basicSchema,
      plugins: [
        history(),
        keymap({
          'Mod-z': undo,
          'Mod-y': redo,
        }),
        keymap(baseKeymap),
      ],
    })

    const view = new EditorView(editorRef.current, {
      state,
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction)
        view.updateState(newState)
        if (onChange && transaction.docChanged) {
          const markdown = markdownSerializer.serialize(newState.doc)
          onChange(markdown)
        }
      },
    })

    viewRef.current = view

    setInitialized(true)

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [])

  return (
    <div className={cn('custom-markdown h-full', className)}>
      <div ref={editorRef} />
    </div>
  )
}
