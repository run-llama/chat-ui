'use client'

import * as Babel from '@babel/standalone'
import { FunctionComponent } from 'react'
import { parseImports } from './import'

export type SourceComponentDef = {
  type: string
  code: string
  filename: string
}

// create React component from code
export async function parseComponent(
  code: string,
  filename: string
): Promise<{ component: FunctionComponent<any> | null; error?: string }> {
  try {
    const [transpiledCode, resolvedImports] = await Promise.all([
      transpileCode(code, filename),
      parseImports(code),
    ])

    const component = await createComponentFromCode(
      transpiledCode,
      resolvedImports.importMap,
      resolvedImports.componentName
    )

    return { component }
  } catch (error) {
    console.warn(`Failed to parse component from ${filename}`, error)
    return {
      component: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// convert TSX code to JS code using Babel, also remove all import declarations in the top of code
function transpileCode(code: string, filename: string) {
  const transpilationCustomPlugin = () => ({
    visitor: {
      ImportDeclaration(path: any) {
        // remove all import declarations in the top of code (already passed imports to Function constructor)
        // eg: import { Button } from "@/components/ui/button" -> remove
        path.remove()
      },
      ExportDefaultDeclaration(path: any) {
        // remove export default declaration (already passed component name to Function constructor)
        // eg: export default function EventTimeline() { ... } -> function EventTimeline() { ... }
        path.replaceWith(path.node.declaration)
      },
    },
  })

  const transpiledCode = Babel.transform(code, {
    presets: ['react', 'typescript'],
    plugins: [transpilationCustomPlugin],
    filename,
  }).code

  if (!transpiledCode) {
    throw new Error(`Transpiled code is empty for ${filename}`)
  }

  return transpiledCode
}

function createComponentFromCode(
  transpiledCode: string,
  importMap: Record<string, any>,
  componentName: string | null = 'Component'
): Promise<FunctionComponent<any> | null> {
  const argNames = Object.keys(importMap) // e.g., ["React", "Button", "Badge"]
  const argValues = Object.values(importMap) // list of corresponding modules

  // Create the component function
  const componentFn = new Function(
    ...argNames,
    `${transpiledCode}; return ${componentName};`
  )

  // Call the component function with the imported modules
  return componentFn(...argValues)
}
