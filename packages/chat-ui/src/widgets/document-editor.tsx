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
import { Button } from '../ui/button'
import { Bold, Italic, Code, Link, Undo, Redo } from 'lucide-react'

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
      <Button
        type="button"
        onClick={handleBold}
        variant="outline"
        size="icon"
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        onClick={handleItalic}
        variant="outline"
        size="icon"
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        onClick={handleCode}
        variant="outline"
        size="icon"
        title="Code (Ctrl+Shift+C)"
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        onClick={handleLink}
        variant="outline"
        size="icon"
        title="Link"
      >
        <Link className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        onClick={handleUndo}
        variant="outline"
        size="icon"
        title="Undo (Ctrl+Z)"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        onClick={handleRedo}
        variant="outline"
        size="icon"
        title="Redo (Ctrl+Y)"
      >
        <Redo className="h-4 w-4" />
      </Button>
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
