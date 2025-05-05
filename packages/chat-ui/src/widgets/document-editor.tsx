import { baseKeymap, toggleMark } from 'prosemirror-commands'
import { history, redo, undo } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import {
  defaultMarkdownParser as markdownParser,
  defaultMarkdownSerializer as markdownSerializer,
} from 'prosemirror-markdown'
import { schema as basicSchema } from 'prosemirror-schema-basic'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/utils'

interface ToolbarProps {
  view: EditorView | null
}

const Toolbar: React.FC<ToolbarProps> = ({ view }) => {
  const handleBold = () => {
    if (view) {
      toggleMark(basicSchema.marks.strong)(view.state, view.dispatch)
      view.focus()
    }
  }

  const handleItalic = () => {
    if (view) {
      toggleMark(basicSchema.marks.em)(view.state, view.dispatch)
      view.focus()
    }
  }

  const handleCode = () => {
    if (view) {
      toggleMark(basicSchema.marks.code)(view.state, view.dispatch)
      view.focus()
    }
  }

  const handleLink = () => {
    if (view) {
      const { state, dispatch } = view
      if (state.selection.empty) return
      const href = prompt('Enter the URL', 'https://')
      if (href) {
        toggleMark(basicSchema.marks.link, { href })(state, dispatch)
        view.focus()
      }
    }
  }

  const handleUndo = () => {
    if (view) {
      undo(view.state, view.dispatch)
      view.focus()
    }
  }

  const handleRedo = () => {
    if (view) {
      redo(view.state, view.dispatch)
      view.focus()
    }
  }

  return (
    <div className="flex gap-2 border-b border-gray-200 bg-gray-100 p-2">
      <button
        type="button"
        onClick={handleBold}
        className="rounded border border-gray-300 bg-white px-3 py-1 hover:bg-gray-50"
        title="Bold (Ctrl+B)"
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        onClick={handleItalic}
        className="rounded border border-gray-300 bg-white px-3 py-1 hover:bg-gray-50"
        title="Italic (Ctrl+I)"
      >
        <em>I</em>
      </button>
      <button
        type="button"
        onClick={handleCode}
        className="rounded border border-gray-300 bg-white px-3 py-1 hover:bg-gray-50"
        title="Code (Ctrl+Shift+C)"
      >
        <code>⌗</code>
      </button>
      <button
        type="button"
        onClick={handleLink}
        className="rounded border border-gray-300 bg-white px-3 py-1 hover:bg-gray-50"
        title="Link"
      >
        🔗
      </button>
      <button
        type="button"
        onClick={handleUndo}
        className="rounded border border-gray-300 bg-white px-3 py-1 hover:bg-gray-50"
        title="Undo (Ctrl+Z)"
      >
        ↺
      </button>
      <button
        type="button"
        onClick={handleRedo}
        className="rounded border border-gray-300 bg-white px-3 py-1 hover:bg-gray-50"
        title="Redo (Ctrl+Y)"
      >
        ↻
      </button>
    </div>
  )
}

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
          'Mod-b': toggleMark(basicSchema.marks.strong),
          'Mod-i': toggleMark(basicSchema.marks.em),
          'Mod-Shift-s': toggleMark(basicSchema.marks.strike),
          'Mod-Shift-c': toggleMark(basicSchema.marks.code),
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
      <Toolbar view={viewRef.current} />
      <div ref={editorRef} className="p-4" />
    </div>
  )
}
