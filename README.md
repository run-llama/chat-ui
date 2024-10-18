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

Here's a basic example of how to use the chat components:

```tsx
import '@llamaindex/chat-ui/styles.css' // import style in root layout
import './globals.css' // your custom theme

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

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

## Documentation

For detailed documentation on all available components and their props, please visit our [documentation site](https://docs.llamaindex.ai/chat-ui).

## License

@llamaindex/chat-ui is released under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please file an issue on our [GitHub repository](https://github.com/run-llama/chat-ui/issues).
