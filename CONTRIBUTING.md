### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) documentation site with [Tailwind CSS](https://tailwindcss.com/)
- `web`: a [Next.js](https://nextjs.org/) create-llama demo with [Tailwind CSS](https://tailwindcss.com/)
- `ui`: a stub React component library with [Tailwind CSS](https://tailwindcss.com/) shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

### Development Guide:

This project uses [pnpm](https://pnpm.io/) as the package manager and [Turbo](https://turbo.build/) for managing the monorepo. Make sure you have Node.js version 18 or higher installed.

1. **Setup:**

   - Install dependencies: `pnpm install`

2. **Development:**

   - Start the development server: `pnpm dev`
   - This will run the dev script for all packages in the monorepo

3. **Building:**

   - Build all packages: `pnpm build`

4. **Linting:**

   - Run linter on all packages: `pnpm lint`

5. **Type Checking:**

   - Run type checks on all packages: `pnpm type-check`

6. **Cleaning:**

   - Clean build artifacts: `pnpm clean`

7. **Formatting:**
   - Format all TypeScript, TSX, and Markdown files: `pnpm format`

Remember to run these commands from the root of the monorepo. Turbo will handle running the commands across all relevant packages.
