import { baseKeymap, toggleMark } from 'prosemirror-commands'
import { history, redo, undo } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import {
  defaultMarkdownParser,
  MarkdownParser,
  defaultMarkdownSerializer as markdownSerializer,
  schema as defaultSchema,
} from 'prosemirror-markdown'
import { tableNodes } from 'prosemirror-tables'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/utils'
import { Button } from '../ui/button'
import { Bold, Italic, Code, Link, Undo, Redo } from 'lucide-react'
import { markdownItTable } from 'markdown-it-table'

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
    <div className="flex shrink-0 gap-2">
      <Button
        onClick={handleUndo}
        variant="outline"
        size="icon"
        title="Undo (Ctrl+Z)"
        className="size-7"
      >
        <Undo className="size-4" />
      </Button>
      <Button
        onClick={handleRedo}
        variant="outline"
        size="icon"
        title="Redo (Ctrl+Y)"
        className="size-7"
      >
        <Redo className="size-4" />
      </Button>
      <Button
        onClick={handleBold}
        variant="outline"
        size="icon"
        title="Bold (Ctrl+B)"
        className="size-7"
      >
        <Bold className="size-4" />
      </Button>
      <Button
        onClick={handleItalic}
        variant="outline"
        size="icon"
        title="Italic (Ctrl+I)"
        className="size-7"
      >
        <Italic className="size-4" />
      </Button>
      <Button
        onClick={handleCode}
        variant="outline"
        size="icon"
        title="Code (Ctrl+Shift+C)"
        className="size-7"
      >
        <Code className="size-4" />
      </Button>
      <Button
        onClick={handleLink}
        variant="outline"
        size="icon"
        title="Link"
        className="size-7"
      >
        <Link className="size-4" />
      </Button>
    </div>
  )
}

const basicSchema: typeof defaultSchema = {
  ...defaultSchema,
  nodes: {
    ...defaultSchema.nodes,
    ...tableNodes({
      tableGroup: 'block',
      cellContent: 'block+',
      cellAttributes: {
        alignment: {
          default: null,
          getFromDOM(dom) {
            return dom.style.textAlign || null
          },
          setDOMAttr(value, attrs) {
            // if (value) attrs.style = `${attrs.style || ''}text-align: ${value};`
          },
        },
      },
    }),
  },
}

const customTokenizer = defaultMarkdownParser.tokenizer.configure('default')

const markdownParser = new MarkdownParser(
  basicSchema,
  customTokenizer.use(markdownItTable),
  defaultMarkdownParser.tokens
)

export function DocumentEditor({
  content,
  onChange,
  className,
  showToolbar = true,
}: {
  content: string
  onChange?: (markdown: string) => void
  className?: string
  showToolbar?: boolean
}) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const [initialized, setInitialized] = useState(false)

  console.log(customTokenizer.configure('default').parse(content, {}))

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
    <div
      className={cn('custom-markdown flex h-full flex-col gap-3', className)}
    >
      {showToolbar && <Toolbar view={viewRef.current} />}
      <div ref={editorRef} className="min-h-0 flex-1 overflow-auto" />
    </div>
  )
}
