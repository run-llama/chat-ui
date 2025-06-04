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
    />
  )
}
