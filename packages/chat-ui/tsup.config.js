import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.tsx'],
    outDir: 'dist/chat',
    format: ['cjs', 'esm'],
    external: ['react', /\/widgets\/index\.js/],
    dts: true,
    sourcemap: true,
  },
  // Widgets
  {
    entry: ['src/widgets/index.tsx'],
    outDir: 'dist/widgets',
    // TBD: might be useful for RSC (widgets are client components)
    banner: {
      js: "'use client'",
    },
    format: ['cjs', 'esm'],
    external: ['react'],
    dts: true,
    sourcemap: true,
  },
])
