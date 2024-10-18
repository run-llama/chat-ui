# @llamaindex/chat-ui

Chat UI components for LLM apps

## Overview

@llamaindex/chat-ui is a React component library that provides ready-to-use UI elements for building chat interfaces in LLM (Large Language Model) applications. This package is designed to streamline the development of chat-based user interfaces for AI-powered applications.

## Installation

To install the package, run the following command in your project directory:

```sh
npm install @llamaindex/chat-ui
```

or if you're using yarn:

```sh
yarn add @llamaindex/chat-ui
```

or if you're using pnpm:

```sh
pnpm add @llamaindex/chat-ui
```

## Features

- Pre-built chat components (e.g., message bubbles, input fields)
- Customizable styles using Tailwind CSS
- TypeScript support for type safety
- Easy integration with LLM backends

## Usage

Here's a basic example of how to use the chat components:

```jsx
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
