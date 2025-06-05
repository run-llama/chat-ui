# LlamaIndex Chat UI - Website (https://ui.llamaindex.ai/)

This is the official website for the `@llamaindex/chat-ui` React component library. It's a Next.js application hosted at https://ui.llamaindex.ai/ that contains examples and demos to help users get started with building chat interfaces in LLM applications.

## Project Structure

This is a Next.js 15 application with the following key components:

- **Frontend**: React components showcasing different chat UI implementations
- **Backend**: API route for handling chat requests using LlamaIndex and OpenAI
- **Demo Pages**: Multiple examples showing different use cases

## Key Files and Directories

### Core Application

- `app/page.tsx` - Landing page with demo links and quick start guide
- `app/layout.tsx` - Root layout with global styles and fonts
- `app/api/chat/route.ts` - Chat API endpoint using LlamaIndex SimpleChatEngine

### Demo Pages

- `app/demo/simple/page.tsx` - Basic chat implementation using `useChat` hook
- `app/demo/custom/page.tsx` - Custom chat demo (referenced but not in current structure)
- `app/demo/canvas/page.tsx` - Chat with canvas demo (referenced but not in current structure)

### Registry and Components

- `registry/chat/chat.tsx` - Reusable chat component with mock data for demos
- `components/code.tsx` - Code syntax highlighting component
- `components/ui/` - UI components (Radix UI based)

### Utilities

- `app/utils.ts` - Fake streaming utilities for demos when API key is not available

## Dependencies

### Core Dependencies

- `@llamaindex/chat-ui` - Main chat UI component library (workspace dependency)
- `llamaindex` (0.9.3) - LlamaIndex JavaScript SDK
- `ai` (4.0.0) - Vercel AI SDK for chat handling
- `next` (15.1.7) - Next.js framework
- `react` & `react-dom` - React framework

### UI and Styling

- `@radix-ui/react-tabs` - Tab components
- `tailwindcss` - CSS framework
- `lucide-react` - Icon library
- `highlight.js` - Code syntax highlighting

### Development Tools

- `typescript` - Type checking
- `@llamaindex/eslint-config` - Shared ESLint configuration
- `@faker-js/faker` - Fake data generation for demos

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run registry:build` - Build Shadcn registry components

## Environment Setup

Required environment variable:

- `OPENAI_API_KEY` - OpenAI API key for chat functionality

If the API key is not provided, the application falls back to fake streaming responses for demonstration purposes.

## Chat Implementation

The chat functionality is implemented using:

1. **LlamaIndex SimpleChatEngine** - Handles the AI chat logic
2. **OpenAI GPT-4o-mini** - Default language model
3. **OpenAI Text Embedding 3 Large** - For embeddings (1024 dimensions)
4. **Vercel AI SDK** - Provides React hooks and streaming utilities

## Demo Features

- **Simple Chat**: Basic implementation using `@llamaindex/chat-ui` ChatSection component
- **Mock Chat**: Demonstrates the component with fake streaming responses
- **Code Examples**: Shows implementation code alongside working demos
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Integration Points

This application serves as both:

1. A demonstration of the `@llamaindex/chat-ui` library capabilities
2. A Shadcn UI registry for easy component installation via `npx shadcn@latest add https://ui.llamaindex.ai/r/chat.json`

The registry system allows other projects to easily install and use the chat components.
