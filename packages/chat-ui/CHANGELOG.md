# @llamaindex/chat-ui

## 0.5.9

### Patch Changes

- fe679c4: fix: baseUrl should be optional for llama deploy

## 0.5.8

### Patch Changes

- d544d57: feat: specify workflow to run of the given deployment

## 0.5.7

### Patch Changes

- 23093ed: docs: add more chatui examples
- 0c929c4: feat: useWorkflow
- Updated dependencies [0c929c4]
  - @llamaindex/llama-deploy@0.0.2

## 0.5.6

### Patch Changes

- 3c477d5: fix: source nodes should from document artifact
- c782810: Remove default allowed extensions and checkExtension from FileUploader
- dad784b: fix: document citation regex

## 0.5.5

### Patch Changes

- 4973f3a: fix: document editor overflow

## 0.5.4

### Patch Changes

- 77620ee: feat: document editor with citations

## 0.5.3

### Patch Changes

- a34688a: feat: use mdxeditor for document editor

## 0.5.2

### Patch Changes

- f0ec280: Fix: css for markdown shouldn't affect inline components

## 0.5.1

### Patch Changes

- 4c3834f: fix: dollar sign in code make json parse fail

## 0.5.0

### Minor Changes

- bdae046: feat: support inline rendering of annotations and use it for artifacts

## 0.4.9

### Patch Changes

- effc6f5: Use isLast from useChatMessage hook in AgentEventAnnotations
- 8e60c05: Cleaned up internal annotation retrieval

## 0.4.8

### Patch Changes

- 09d6ec6: Improve type-safety of custom annotations

## 0.4.7

### Patch Changes

- 180cc1f: Add language specific renderer to markdown (with mermaid example)

## 0.4.6

### Patch Changes

- ef66c13: fix: use multiple sources per message

## 0.4.5

### Patch Changes

- 2332fa6: fix: send request data when submit suggested questions

## 0.4.4

### Patch Changes

- 623a855: fix: using language props to add editor extensions

## 0.4.3

### Patch Changes

- 892d792: fix: latest tailwindcss postcss caused absolute paths for fontface

## 0.4.2

### Patch Changes

- 06e085e: feat: code editor

## 0.4.1

### Patch Changes

- 3d4fbae: feat: support canvas

## 0.4.0

### Minor Changes

- f128454: feat: enhance style for chat-ui

## 0.3.2

### Patch Changes

- bf21327: fix: prevent message send during text composition
- 2ddf223: fix: display all sources from annotations

## 0.3.1

### Patch Changes

- bd353f2: Remove citation text if there is no sources in chat message data

## 0.3.0

### Minor Changes

- 4129574: Fix not showing citation issue

## 0.2.0

### Minor Changes

- cb705ce: chore: bump tailwind v4

## 0.1.0

### Minor Changes

- d7e63e7: Update citation processor format

## 0.0.15

### Patch Changes

- 1976f9a: fix: able to get custom annotation data

## 0.0.14

### Patch Changes

- f2e7014: feat(chat-input): add support for custom placeholder in ChatInput.Field
- c11143d: fix: chat height and citation

## 0.0.13

### Patch Changes

- 8214bcd: fix: send request data when reload
- 0445125: fix: private markdown css style

## 0.0.12

### Patch Changes

- 944bdbd: Add feature to customize markdown style, optionally can pass message as parameter to message content

## 0.0.11

### Patch Changes

- 22e25b0: fix: support releative URLs in document viewer

## 0.0.10

### Patch Changes

- 4f27d57: Add support for Vercel ai 4.0.0

## 0.0.9

### Patch Changes

- bb63a54: bump: react19 rc

## 0.0.8

### Patch Changes

- 1d89841: fix: support dark theme

## 0.0.7

### Patch Changes

- fa3537b: make chat message component stand alone without provider
- ace0c06: chore: remove use-client decorator
- 7988fbe: feat: use DocumentInfo for displaying uploaded file

## 0.0.6

### Patch Changes

- dbdaed0: Allow import of sub-dirs, remove unused ID

## 0.0.5

### Patch Changes

- 6934a2b: feat: export pdf css

## 0.0.4

### Patch Changes

- 07a0d27: Add progress bar for agent events

## 0.0.3

### Patch Changes

- 50089b0: feat: chat annotations

## 0.0.2

### Patch Changes

- db7c1d4: release first version
