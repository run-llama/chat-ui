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
- `app/rsc/` - React Server Components example with server actions
- `package.json` - Dependencies and scripts
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration

## Examples

This project includes multiple examples to demonstrate different approaches:

### 1. Default Chat Interface

**URL:** [http://localhost:3000](http://localhost:3000)

The standard implementation using client-side components with the `useChat` hook from Vercel AI SDK

### 2. Rendering Inline Annotations Example

**Enable:** Uncomment the advanced API route in `app/page.tsx`

Demonstrates inline annotations in the chat interface.

### 3. Edge Runtime Example

**Enable:** Uncomment the edge API route in `app/page.tsx`

Showcases running the chat API on Vercel's Edge Runtime for global distribution

### 4. RSC (React Server Components) Example

**URL:** [http://localhost:3000/rsc](http://localhost:3000/rsc)

Demonstrates React Server Components with server actions for chat functionality.

1. **AI Provider Setup** (`ai.ts`):

   - Creates an AI provider using `createAI` from Vercel AI SDK
   - Defines server state (Message[]) and UI state (Message with ReactNode display)
   - Exposes `chatAction` as a server action

2. **Server Actions** (`action.tsx`):

   - `chatAction` runs entirely on the server with `'use server'` directive
   - Uses `createStreamableUI()` to stream React components to the client
   - Processes chat messages and returns React components as responses
   - Demonstrates streaming with fake chat data including inline annotations

3. **RSC Chat Hook** (`use-chat-rsc.tsx`):

   - Bridges server actions with @llamaindex/chat-ui components
   - Uses `useUIState` and `useActions` to manage RSC state
   - Provides the same interface as the standard `useChat` hook
   - Handles message appending and UI updates seamlessly

4. **Page Component** (`page.tsx`):

   - Uses the custom `useChatRSC()` hook instead of `useChat`
   - Renders messages with server-generated React components
   - Integrates with ChatCanvas for advanced UI features

## Learn More

- [LlamaIndex Chat UI Documentation](https://ui.llamaindex.ai/)
- [LlamaIndex Documentation](https://docs.llamaindex.ai/)
- [Next.js Documentation](https://nextjs.org/docs)
