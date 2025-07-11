'use client'

import { DynamicComponent } from '@llamaindex/dynamic-ui'
import { simpleChart } from './data/simple-chart'

const charts = [
  {
    code: simpleChart,
    fileName: 'simple-chart.tsx',
  },
]

export default function Home() {
  return (
    <div>
      {charts.map(chart => (
        <DynamicComponent
          key={chart.fileName}
          code={chart.code}
          fileName={chart.fileName}
        />
      ))}
    </div>
  )
}
