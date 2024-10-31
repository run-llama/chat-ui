# @llamaindex/chat-ui

Chat UI components for LLM apps

## Overview

@llamaindex/chat-ui is a React component library that provides ready-to-use UI elements for building chat interfaces in LLM (Large Language Model) applications. This package is designed to streamline the development of chat-based user interfaces for AI-powered applications.

## Installation

To install the package, run the following command in your project directory:

```sh
npm install @llamaindex/chat-ui
```

## Features

- Pre-built chat components (e.g., message bubbles, input fields)
- Minimal styling, fully customizable with Tailwind CSS
- Custom widgets to extend components (e.g., for rendering generated or retrieved documents)
- TypeScript support for type safety
- Easy integration with LLM backends
- Code and Latex styling with highlight.js and katex

## Usage

1. Install the package

```sh
npm install @llamaindex/chat-ui
```

2. Configure your `tailwind.config.ts` to include the chat-ui components

```ts
module.exports = {
  content: [
    'app/**/*.{ts,tsx}',
    'node_modules/@llamaindex/chat-ui/**/*.{ts,tsx}',
  ],
  // ...
}
```

3. Import the components and use them

The easiest way to get started is to connect the whole `ChatSection` component with `useChat` hook from [vercel/ai](https://github.com/vercel/ai):

```tsx
import { ChatSection } from '@llamaindex/chat-ui'
import { useChat } from 'ai/react'

const ChatExample = () => {
  const handler = useChat()
  return <ChatSection handler={handler} />
}
```

## Component Composition

Components are designed to be composable. You can use them as is:

```tsx
import { ChatSection } from '@llamaindex/chat-ui'
import { useChat } from 'ai/react'

const ChatExample = () => {
  const handler = useChat()
  return <ChatSection handler={handler} />
}
```

Or you can extend them with your own children components:

```tsx
import { ChatSection, ChatMessages, ChatInput } from '@llamaindex/chat-ui'
import LlamaCloudSelector from './components/LlamaCloudSelector' // your custom component
import { useChat } from 'ai/react'

const ChatExample = () => {
  const handler = useChat()
  return (
    <ChatSection handler={handler}>
      <ChatMessages />
      <ChatInput>
        <ChatInput.Preview />
        <ChatInput.Form className="bg-lime-500">
          <ChatInput.Field type="textarea" />
          <ChatInput.Upload />
          <LlamaCloudSelector /> {/* custom component */}
          <ChatInput.Submit />
        </ChatInput.Form>
      </ChatInput>
    </ChatSection>
  )
}
```

Your custom component can use the `useChatUI` hook to send additional data to the chat API endpoint:

```tsx
import { useChatInput } from '@llamaindex/chat-ui'

const LlamaCloudSelector = () => {
  const { requestData, setRequestData } = useChatUI()
  return (
    <div>
      <select
        value={requestData?.model}
        onChange={e => setRequestData({ model: e.target.value })}
      >
        <option value="llama-3.1-70b-instruct">Pipeline 1</option>
        <option value="llama-3.1-8b-instruct">Pipeline 2</option>
      </select>
    </div>
  )
}
```

## Styling

### Components

`chat-ui` components are based on [shadcn](https://ui.shadcn.com/) components using Tailwind CSS.

You can override the default styles by changing CSS variables in the `globals.css` file of your Tailwind CSS configuration. For example, to change the background and foreground colors:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}
```

For a list of all available CSS variables, please refer to the [Shadcn Theme Config](https://ui.shadcn.com/themes).

Additionally, you can also override each component's styles by setting custom classes in the `className` prop. For example, setting the background color of the `ChatInput.Form` component:

```tsx
import { ChatSection, ChatMessages, ChatInput } from '@llamaindex/chat-ui'
import { useChat } from 'ai/react'

const ChatExample = () => {
  const handler = useChat()
  return (
    <ChatSection handler={handler}>
      <ChatMessages />
      <ChatInput>
        <ChatInput.Preview />
        <ChatInput.Form className="bg-lime-500">
          <ChatInput.Field type="textarea" />
          <ChatInput.Upload />
          <ChatInput.Submit />
        </ChatInput.Form>
      </ChatInput>
    </ChatSection>
  )
}
```

### Code and Latex styling

Inside the markdown component, we use [highlight.js](https://highlightjs.org/) for code blocks and [katex](https://katex.org/) for latex.
If your app is using code or latex blocks, you'll need to import their CSS files:

```tsx
import '@llamaindex/chat-ui/styles/code.css'
import '@llamaindex/chat-ui/styles/katex.css'
```

The `code.css` file uses the `atom-one-dark` theme from highlight.js by default. There are a lot of others to choose from: https://highlightjs.org/demo
You can use any of them by copying [their CSS](https://github.com/highlightjs/highlight.js/tree/main/src/styles/) to your project and importing it.

## Example

See the [example app](./apps/web/README.md) for a complete example.

## License

@llamaindex/chat-ui is released under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please file an issue on our [GitHub repository](https://github.com/run-llama/chat-ui/issues).
