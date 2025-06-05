# Next.js Chat UI Example

This is a simple Next.js application demonstrating how to use the `@llamaindex/chat-ui` library to build a chat interface.

## Features

- Basic chat interface using `@llamaindex/chat-ui` components
- API route that integrates with LlamaIndex and OpenAI
- Fallback to fake streaming when API key is not available
- TypeScript support

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set your OpenAI API key:

   ```bash
   export OPENAI_API_KEY=your-api-key-here
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/page.tsx` - Main chat interface
- `app/layout.tsx` - Root layout
- `app/api/chat/route.ts` - Chat API endpoint using LlamaIndex
- `package.json` - Dependencies and scripts
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration

## How It Works

The example uses:

- **@llamaindex/chat-ui** components for the UI
- **LlamaIndex SimpleChatEngine** for AI chat functionality
- **Vercel AI SDK** for streaming responses
- **OpenAI GPT-4o-mini** as the language model

An OpenAI API key is required for the chat functionality to work.

## Learn More

- [LlamaIndex Chat UI Documentation](https://ui.llamaindex.ai/)
- [LlamaIndex Documentation](https://docs.llamaindex.ai/)
- [Next.js Documentation](https://nextjs.org/docs)
