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

// CSS for the editor
const styles = `
.prose-mirror-editor .ProseMirror {
  font-size: 16px; /* Increased font size */
  padding: 8px;
  border: 1px solid #e5e7eb; /* Light border similar to CodeMirror */
  border-radius: 4px;
  min-height: 100%;
  background: #fff;
  color: #333;
}

.prose-mirror-editor .ProseMirror:focus {
  outline: none;
  border-color: #3b82f6; /* Blue focus border */
}

.prose-mirror-editor .ProseMirror p {
  margin: 0.5em 0;
}

.prose-mirror-editor .ProseMirror h1, 
.prose-mirror-editor .ProseMirror h2, 
.prose-mirror-editor .ProseMirror h3 {
  font-weight: bold;
}

.prose-mirror-editor .ProseMirror ul,
.prose-mirror-editor .ProseMirror ol {
  padding-left: 1.5em;
}

.prose-mirror-editor .ProseMirror code {
  background: #f4f4f4;
  padding: 0.1em 0.4em;
  border-radius: 3px;
}

.prose-mirror-editor .ProseMirror pre {
  background: #f4f4f4;
  padding: 1em;
  border-radius: 4px;
}
`

// Inject styles
const styleSheet = document.createElement('style')
styleSheet.textContent = styles
document.head.appendChild(styleSheet)
