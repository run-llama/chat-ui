import {
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from 'prosemirror-markdown'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { useEffect, useRef } from 'react'
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

  useEffect(() => {
    if (!editorRef.current) return

    const state = EditorState.create({
      doc: defaultMarkdownParser.parse(content),
      plugins: [],
    })

    const view = new EditorView(editorRef.current, {
      state,
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction)
        view.updateState(newState)
        if (onChange) {
          const markdown = defaultMarkdownSerializer.serialize(newState.doc)
          onChange(markdown)
        }
      },
    })

    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [content, onChange])

  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const newDoc = defaultMarkdownParser.parse(content)
    const tr = view.state.tr.replaceWith(
      0,
      view.state.doc.content.size,
      newDoc.content
    )
    view.dispatch(tr)
  }, [content])

  return (
    <div className={cn('prose-mirror-editor h-full', className)}>
      <div ref={editorRef} />
    </div>
  )
}
