import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  MDXEditor,
  UndoRedo,
  headingsPlugin,
  linkPlugin,
  linkDialogPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  tablePlugin,
  toolbarPlugin,
  thematicBreakPlugin,
  quotePlugin,
} from '@mdxeditor/editor'

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
  const plugins = [
    headingsPlugin(),
    listsPlugin(),
    linkPlugin(),
    linkDialogPlugin(),
    tablePlugin(),
    markdownShortcutPlugin(),
    thematicBreakPlugin(),
    quotePlugin(),
  ]

  if (showToolbar) {
    plugins.push(
      toolbarPlugin({
        toolbarContents: () => (
          <>
            <UndoRedo />
            <BoldItalicUnderlineToggles />
            <BlockTypeSelect />
          </>
        ),
      })
    )
  }

  return (
    <MDXEditor
      className={className}
      onChange={onChange}
      markdown={content}
      plugins={plugins}
      contentEditableClassName="custom-markdown"
      suppressHtmlProcessing
      onError={error => {
        console.warn(
          '[Chat-UI] Error while parsing markdown in DocumentEditor',
          error
        )
      }}
    />
  )
}
