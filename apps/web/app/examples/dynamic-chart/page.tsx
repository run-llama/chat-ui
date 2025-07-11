'use client'

import { DynamicComponent } from '@llamaindex/dynamic-ui'
import { simpleChart } from './data/simple-chart'
import { chartAreaInteractive } from './data/chart-area-interactive'
import { chartBarInteractive } from './data/chart-bar-interactive'
import { chartRadarDots } from './data/chart-radar-dots'

const charts = [
  {
    code: simpleChart,
    fileName: 'simple-chart.tsx',
  },
  {
    code: chartAreaInteractive,
    fileName: 'chart-area-interactive.tsx',
  },
  {
    code: chartBarInteractive,
    fileName: 'chart-bar-interactive.tsx',
  },
  {
    code: chartRadarDots,
    fileName: 'chart-radar-dots.tsx',
  },
]

export default function Home() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col divide-y-8">
      {charts.map(chart => (
        <div key={chart.fileName} className="py-10">
          <h3 className="mb-4 text-2xl font-bold">{chart.fileName}</h3>
          <DynamicComponent code={chart.code} fileName={chart.fileName} />
        </div>
      ))}
    </div>
  )
}
