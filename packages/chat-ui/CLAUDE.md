# @llamaindex/chat-ui - React Component Library

This is a React component library that provides pre-built chat UI components for building conversational AI interfaces with LlamaIndex and other LLM frameworks.

## Project Overview

`@llamaindex/chat-ui` is a TypeScript/React library that exports reusable chat components and hooks for creating sophisticated chat experiences. It's designed to work seamlessly with the Vercel AI SDK and LlamaIndex but is flexible enough to integrate with other chat backends.

## Package Structure

### Core Exports

#### Chat Components

- `ChatSection` - Main container component that provides chat context and layout
- `ChatCanvas` - Canvas component for interactive chat experiences
- `ChatInput` - Input component for user messages
- `ChatMessages` - Container for displaying message history
- `ChatMessage` - Individual message component with content positioning

#### Context Providers & Hooks

- `useChatUI` - Main chat context hook
- `useChatCanvas` - Canvas-specific context hook
- `useChatMessage` - Message-level context hook
- `useChatInput` - Input component hook
- `useChatMessages` - Messages container hook

#### Utility Hooks

- `useFile` - File handling utilities

### Widget Components (Secondary Export)

Located in `src/widgets/` and exported via `/widgets` entry point:

- `ChatAgentEvents` - Agent event handling
- `ChatEvents` - General chat events
- `ChatFiles` - File attachment handling
- `ChatImage` - Image display and preview
- `ChatSources` - Source attribution and citations
- `Markdown` - Markdown rendering with math support
- `CodeBlock` - Syntax highlighted code blocks
- `PdfDialog` - PDF viewer integration
- `SuggestedQuestions` - Question suggestions
- `StarterQuestions` - Conversation starters
- `DocumentInfo` - Document metadata display
- `ImagePreview` - Image preview functionality
- `FileUploader` - File upload component
- `Citation` - Citation display component
- `CodeEditor` - Code editing with multiple language support
- `DocumentEditor` - Rich text document editing

## Key Dependencies

### Core UI Framework

- React 18+ (peer dependency)
- Radix UI components for accessible primitives
- Tailwind CSS for styling (via CSS exports)

### Rich Content Support

- **Markdown**: `react-markdown` with math support (`katex`, `remark-math`, `rehype-katex`)
- **Code Editing**: CodeMirror 6 with language support (JavaScript, Python, CSS, HTML)
- **Syntax Highlighting**: `highlight.js`
- **Document Editing**: Mdxeditor with markdown support
- **PDF Viewing**: `@llamaindex/pdf-viewer`

### Styling & UI

- `class-variance-authority` and `clsx` for conditional styling
- `lucide-react` for icons
- `vaul` for drawer components

## Architecture

### Component Hierarchy

```
ChatSection (Provider)
├── ChatCanvasProvider
│   ├── ChatMessages
│   │   └── ChatMessage[]
│   └── ChatInput
└── Widgets (optional)
    ├── ChatFiles
    ├── ChatSources
    ├── SuggestedQuestions
    └── ...
```

### Type System

- `Message` - Core message interface with role and content
- `ChatHandler` - Chat interaction interface compatible with Vercel AI SDK
- `ChatContext` - Extended context with request data handling
- `JSONValue` - Type-safe JSON data structure

### Integration Pattern

The library is designed to work with any chat backend that implements the `ChatHandler` interface:

```typescript
type ChatHandler = {
  input: string
  setInput: (input: string) => void
  isLoading: boolean
  messages: Message[]
  reload?: (chatRequestOptions?: { data?: any }) => void
  stop?: () => void
  append: (
    message: Message,
    chatRequestOptions?: { data?: any }
  ) => Promise<string | null | undefined>
  setMessages?: (messages: (Message & { id: string })[]) => void
}
```

## Build System

### Scripts

- `pnpm build` - Full build (clean + JS + styles)
- `pnpm build:js` - TypeScript compilation via tsup
- `pnpm build:css` - PostCSS processing of styles
- `pnpm prepare:style` - CSS build + font copying
- `pnpm dev` - Watch mode for development
- `pnpm lint` - ESLint validation
- `pnpm type-check` - TypeScript validation

### Output Structure

- `dist/chat/` - Main chat components
- `dist/widgets/` - Widget components
- `dist/styles/` - CSS files and fonts
- Supports ESM, CommonJS, and TypeScript definitions

## Integration Examples

### Basic Usage

```typescript
import { ChatSection } from '@llamaindex/chat-ui'
import { useChat } from '@ai-sdk/react'

function MyChat() {
  const handler = useChat({ 
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })
  return <ChatSection handler={chatHandler} />
}
```

### With Custom Widgets

```typescript
import { ChatSection, ChatInput, ChatMessages } from '@llamaindex/chat-ui'
import { SuggestedQuestions, ChatFiles } from '@llamaindex/chat-ui/widgets'

function CustomChat({ handler }) {
  return (
    <ChatSection handler={handler}>
      <ChatMessages />
      <SuggestedQuestions />
      <ChatFiles />
      <ChatInput />
    </ChatSection>
  )
}
```

## Development Notes

### Testing Commands

- `pnpm lint` - Run ESLint
- `pnpm type-check` - TypeScript validation

### Code Style

- Uses ESLint with `@llamaindex/eslint-config`
- TypeScript strict mode enabled
- Tailwind CSS for styling

### Publishing

- Published to npm as `@llamaindex/chat-ui`
- Version 0.4.6 (as of current package.json)
- MIT licensed
- Public access configured
