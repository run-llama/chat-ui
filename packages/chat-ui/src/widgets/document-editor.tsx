import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  MDXEditor,
  UndoRedo,
  headingsPlugin,
  linkPlugin,
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
            <CreateLink />
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
    />
  )
}
