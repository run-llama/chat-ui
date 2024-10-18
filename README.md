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
- Customizable styles using Tailwind CSS
- TypeScript support for type safety
- Easy integration with LLM backends

## Usage

1. Import the styles in your root layout (e.g. `layout.tsx` for Next.js or `index.tsx` for React)

```tsx
import '@llamaindex/chat-ui/styles.css'
```

2. Import the components and use them

```tsx
import React from 'react'
import { ChatSection, ChatMessages, ChatInput } from '@llamaindex/chat-ui'

const ChatExample = () => {
  return (
    <ChatSection>
      <ChatMessages />
      <ChatInput />
    </ChatSection>
  )
}

export default ChatExample
```

## Custom theme

You can customize the theme by overriding the default styles.

```tsx
import '@llamaindex/chat-ui/styles.css'
import './globals.css' // your custom theme
```

Inside `globals.css`, you can override the default styles by defining your own CSS variables. Eg:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}
```

For a list of all available CSS variables, please refer to the [Shadcn Theme Config](https://ui.shadcn.com/themes).

## Documentation

For detailed documentation on all available components and their props, please visit our [documentation site](https://docs.llamaindex.ai/chat-ui).

## License

@llamaindex/chat-ui is released under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please file an issue on our [GitHub repository](https://github.com/run-llama/chat-ui/issues).
