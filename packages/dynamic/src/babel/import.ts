'use client'

import { parse } from '@babel/parser'
import babelTraverse from '@babel/traverse'
import React from 'react'

// Fix webpack error: _babel_traverse__WEBPACK_IMPORTED_MODULE_1__ is not a function
const traverse = (babelTraverse as any).default as typeof babelTraverse

export const SHADCN_IMPORT_PREFIX = '@/components/ui' // all 46 Shadcn components

// Maps import paths in component code to Shadcn components and ChatUI widgets
export const SOURCE_MAP: Record<string, () => Promise<any>> = {
  ///// REACT /////
  [`react`]: () => import('react'),
  [`react-dom`]: () => import('react-dom'),

  ///// SHADCN COMPONENTS /////
  [`${SHADCN_IMPORT_PREFIX}/accordion`]: () =>
    import('../components/ui/accordion'),
  [`${SHADCN_IMPORT_PREFIX}/alert`]: () => import('../components/ui/alert'),
  [`${SHADCN_IMPORT_PREFIX}/alert-dialog`]: () =>
    import('../components/ui/alert-dialog'),
  [`${SHADCN_IMPORT_PREFIX}/aspect-ratio`]: () =>
    import('../components/ui/aspect-ratio'),
  [`${SHADCN_IMPORT_PREFIX}/avatar`]: () => import('../components/ui/avatar'),
  [`${SHADCN_IMPORT_PREFIX}/badge`]: () => import('../components/ui/badge'),
  [`${SHADCN_IMPORT_PREFIX}/breadcrumb`]: () =>
    import('../components/ui/breadcrumb'),
  [`${SHADCN_IMPORT_PREFIX}/button`]: () => import('../components/ui/button'),
  [`${SHADCN_IMPORT_PREFIX}/calendar`]: () =>
    import('../components/ui/calendar'),
  [`${SHADCN_IMPORT_PREFIX}/card`]: () => import('../components/ui/card'),
  [`${SHADCN_IMPORT_PREFIX}/carousel`]: () =>
    import('../components/ui/carousel'),
  [`${SHADCN_IMPORT_PREFIX}/chart`]: () => import('../components/ui/chart'),
  [`${SHADCN_IMPORT_PREFIX}/checkbox`]: () =>
    import('../components/ui/checkbox'),
  [`${SHADCN_IMPORT_PREFIX}/collapsible`]: () =>
    import('../components/ui/collapsible'),
  [`${SHADCN_IMPORT_PREFIX}/command`]: () => import('../components/ui/command'),
  [`${SHADCN_IMPORT_PREFIX}/context-menu`]: () =>
    import('../components/ui/context-menu'),
  [`${SHADCN_IMPORT_PREFIX}/dialog`]: () => import('../components/ui/dialog'),
  [`${SHADCN_IMPORT_PREFIX}/drawer`]: () => import('../components/ui/drawer'),
  [`${SHADCN_IMPORT_PREFIX}/dropdown-menu`]: () =>
    import('../components/ui/dropdown-menu'),
  [`${SHADCN_IMPORT_PREFIX}/form`]: () => import('../components/ui/form'),
  [`${SHADCN_IMPORT_PREFIX}/hover-card`]: () =>
    import('../components/ui/hover-card'),
  [`${SHADCN_IMPORT_PREFIX}/input`]: () => import('../components/ui/input'),
  [`${SHADCN_IMPORT_PREFIX}/input-otp`]: () =>
    import('../components/ui/input-otp'),
  [`${SHADCN_IMPORT_PREFIX}/label`]: () => import('../components/ui/label'),
  [`${SHADCN_IMPORT_PREFIX}/menubar`]: () => import('../components/ui/menubar'),
  [`${SHADCN_IMPORT_PREFIX}/navigation-menu`]: () =>
    import('../components/ui/navigation-menu'),
  [`${SHADCN_IMPORT_PREFIX}/pagination`]: () =>
    import('../components/ui/pagination'),
  [`${SHADCN_IMPORT_PREFIX}/popover`]: () => import('../components/ui/popover'),
  [`${SHADCN_IMPORT_PREFIX}/progress`]: () =>
    import('../components/ui/progress'),
  [`${SHADCN_IMPORT_PREFIX}/radio-group`]: () =>
    import('../components/ui/radio-group'),
  [`${SHADCN_IMPORT_PREFIX}/resizable`]: () =>
    import('../components/ui/resizable'),
  [`${SHADCN_IMPORT_PREFIX}/scroll-area`]: () =>
    import('../components/ui/scroll-area'),
  [`${SHADCN_IMPORT_PREFIX}/select`]: () => import('../components/ui/select'),
  [`${SHADCN_IMPORT_PREFIX}/separator`]: () =>
    import('../components/ui/separator'),
  [`${SHADCN_IMPORT_PREFIX}/sheet`]: () => import('../components/ui/sheet'),
  [`${SHADCN_IMPORT_PREFIX}/sidebar`]: () => import('../components/ui/sidebar'),
  [`${SHADCN_IMPORT_PREFIX}/skeleton`]: () =>
    import('../components/ui/skeleton'),
  [`${SHADCN_IMPORT_PREFIX}/slider`]: () => import('../components/ui/slider'),
  [`${SHADCN_IMPORT_PREFIX}/sonner`]: () => import('../components/ui/sonner'),
  [`${SHADCN_IMPORT_PREFIX}/switch`]: () => import('../components/ui/switch'),
  [`${SHADCN_IMPORT_PREFIX}/table`]: () => import('../components/ui/table'),
  [`${SHADCN_IMPORT_PREFIX}/tabs`]: () => import('../components/ui/tabs'),
  [`${SHADCN_IMPORT_PREFIX}/textarea`]: () =>
    import('../components/ui/textarea'),
  [`${SHADCN_IMPORT_PREFIX}/toggle`]: () => import('../components/ui/toggle'),
  [`${SHADCN_IMPORT_PREFIX}/toggle-group`]: () =>
    import('../components/ui/toggle-group'),
  [`${SHADCN_IMPORT_PREFIX}/tooltip`]: () => import('../components/ui/tooltip'),

  ///// CHAT_UI GENERAL  /////
  [`@llamaindex/chat-ui`]: () => import('@llamaindex/chat-ui'),

  ///// WIDGETS FROM CHAT_UI /////
  [`@llamaindex/chat-ui/widgets`]: () => import('@llamaindex/chat-ui/widgets'),

  ///// ICONS /////
  [`lucide-react`]: () => import('lucide-react'),

  ///// UTILS /////
  [`@/components/lib/utils`]: () => import('../components/ui/lib/utils'),
  [`@/lib/utils`]: () => import('../components/ui/lib/utils'), // for v0 compatibility

  ///// ZOD /////
  [`zod`]: () => import('zod'),

  ///// RECHARTS /////
  [`recharts`]: () => import('recharts'),
}

// parse imports from code to get Function constructor arguments and component name
export async function parseImports(code: string) {
  const imports: { name: string; source: string }[] = [] // e.g., [{ name: "Button", source: "@/components/ui/button" }]
  let componentName: string | null = null

  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  // Traverse the AST to find import declarations
  traverse(ast, {
    // Find import declarations
    ImportDeclaration(path) {
      path.node.specifiers.forEach(specifier => {
        if (
          specifier.type === 'ImportSpecifier' ||
          specifier.type === 'ImportDefaultSpecifier'
        ) {
          imports.push({
            name: specifier.local.name, // e.g., "Button"
            source: path.node.source.value, // e.g., "@/components/ui/button"
          })
        }
      })
    },
    // Find export default declaration
    ExportDefaultDeclaration(path) {
      const declaration = path.node.declaration
      if (declaration.type === 'FunctionDeclaration' && declaration.id) {
        componentName = declaration.id.name // e.g., "EventTimeline"
      } else if (
        declaration.type === 'Identifier' &&
        path.scope.hasBinding(declaration.name)
      ) {
        componentName = declaration.name // e.g., named function assigned to export
      }
    },
  })

  // Dynamically import the modules
  const importPromises = imports.map(async ({ name, source }) => {
    if (!(source in SOURCE_MAP)) {
      throw new Error(
        `Fail to import ${name} from ${source}. Reason: Module not found. \nCurrently we only support importing UI components from Shadcn components, widgets and hooks from "llamaindex/chat-ui", icons from "lucide-react" and zod for data validation.`
      )
    }
    try {
      const module = await SOURCE_MAP[source]()
      return { name, module: module[name] }
    } catch (error) {
      throw new Error(
        `Failed to resolve import ${name}. Please check the code and try again.`
      )
    }
  })

  const resolvedImports = await Promise.all(importPromises)

  // Create a map of import names to their resolved modules (always include React)
  const importMap: Record<string, any> = { React }
  resolvedImports.forEach(({ name, module }) => {
    if (module) {
      importMap[name] = module
    }
  })

  return { componentName, importMap }
}
