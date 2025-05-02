import {
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from 'prosemirror-markdown'
import { Schema } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { useEffect, useRef } from 'react'
import { cn } from '../lib/utils'

// Extend the basic schema to include list nodes for Markdown
const markdownSchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks,
})

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

    // Initialize ProseMirror editor
    const state = EditorState.create({
      doc: defaultMarkdownParser.parse(content, markdownSchema),
      plugins: [],
    })

    const view = new EditorView(editorRef.current, {
      state,
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction)
        view.updateState(newState)

        // Serialize to Markdown on change
        if (onChange) {
          const markdown = defaultMarkdownSerializer.serialize(newState.doc)
          onChange(markdown)
        }
      },
    })

    viewRef.current = view

    // Cleanup on unmount
    return () => {
      view.destroy()
    }
  }, [content, onChange])

  return (
    <div className={cn('prose-mirror-editor h-full', className)}>
      <div ref={editorRef} />
    </div>
  )
}
