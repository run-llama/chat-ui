'use client'

import React, { FunctionComponent, useEffect, useState } from 'react'
import { parseComponent } from '../../babel'
import { DynamicComponentErrorBoundary } from './error-boundary'
import { TailwindInjection } from './tailwind-injection'

export function DynamicComponent({
  code,
  fileName,
}: {
  code: string
  fileName: string
}) {
  const [errors, setErrors] = useState<string[]>([])
  const [isRendering, setIsRendering] = useState(true)
  const [component, setComponent] = useState<FunctionComponent | null>(null)

  const appendError = (error: string) => {
    setErrors(prev => Array.from(new Set([...prev, error])))
  }

  useEffect(() => {
    const renderComponent = async () => {
      setIsRendering(true)
      const { component: parsedComponent, error } = await parseComponent(
        code,
        fileName
      )

      if (error) {
        setComponent(null)
        appendError(error)
      } else {
        setComponent(() => parsedComponent)
      }

      setIsRendering(false)
    }

    renderComponent()
  }, [code, fileName])

  if (isRendering) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-500">
        Rendering component...
      </div>
    )
  }

  if (!component) {
    return (
      <div className="flex h-full w-full p-10">
        <div className="max-w-3xl space-y-4">
          <div className="text-gray-500">
            Failed to render component. Please check the following errors:
          </div>
          <ul className="list-disc pl-4 text-sm">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <>
      <DynamicComponentErrorBoundary onError={appendError}>
        {React.createElement(component)}
      </DynamicComponentErrorBoundary>
      <TailwindInjection />
    </>
  )
}
