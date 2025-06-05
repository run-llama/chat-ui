# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for `@llamaindex/chat-ui`, a React component library for building chat interfaces in LLM applications. The repository contains:

- **Root**: Monorepo configuration with Turbo, pnpm workspace, and shared tooling
- **packages/**: Core chat-ui library package
- **apps/web/**: Next.js example application demonstrating the library

## Development Commands

### Root Level (uses Turbo for orchestration)

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all packages and apps
- `pnpm lint` - Lint all packages and apps
- `pnpm type-check` - TypeScript checking across workspace
- `pnpm format` - Check code formatting with Prettier
- `pnpm format:write` - Format all code with Prettier

### Web App (apps/web/)

- `pnpm dev` - Start Next.js development server
- `pnpm build` - Build Next.js application
- `pnpm start` - Start production server
- `pnpm lint` - ESLint for Next.js app
- `pnpm type-check` - TypeScript checking
- `pnpm registry:build` - Build Shadcn registry components

## Architecture

### Monorepo Structure

- **Turbo**: Orchestrates builds, caching, and task dependencies
- **pnpm workspace**: Package management with workspace dependencies
- **Changesets**: Version management and publishing

### Chat UI Library Architecture

- **Component-based**: Composable React components using shadcn/ui patterns
- **Tailwind CSS**: Styling system with CSS variables for theming
- **TypeScript**: Full type safety throughout
- **Vercel AI SDK Integration**: Built for `useChat` hook patterns

### Example App Architecture

- **Next.js 15**: App router with API routes
- **LlamaIndex**: SimpleChatEngine for chat functionality
- **OpenAI Integration**: GPT-4o-mini model with text-embedding-3-large
- **Fallback System**: Fake streaming when no API key provided

### Key Dependencies

- `llamaindex` (0.9.3) - Core LLM framework
- `ai` (4.0.0) - Vercel AI SDK for React integration
- `@radix-ui/react-*` - Accessible UI primitives
- `highlight.js` - Code syntax highlighting
- `tailwindcss` (v4.x) - CSS framework

## Environment Setup

Required for full functionality:

```bash
OPENAI_API_KEY=sk-...
```

The example app includes graceful fallback to fake streaming when the API key is missing.

## Component Usage Patterns

The library supports both simple and advanced usage:

**Simple**: Direct component usage with useChat hook
**Advanced**: Composition with custom components using `useChatUI` hook for additional request data

## Registry System

The project includes a Shadcn registry system that allows easy installation via:

```bash
npx shadcn@latest add https://ui.llamaindex.ai/r/chat.json
```

## Testing and Quality

- ESLint configuration shared via `@llamaindex/eslint-config`
- TypeScript configuration via `@llamaindex/typescript-config`
- Prettier for code formatting with Tailwind plugin
- Husky + lint-staged for pre-commit hooks
