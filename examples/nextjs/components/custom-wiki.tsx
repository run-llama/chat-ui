'use client'

import { useChatMessage, getCustomAnnotations } from '@llamaindex/chat-ui'

interface WikiData {
  title: string
  summary: string
  url: string
  category: string
  lastUpdated: string
}

export function CustomWikiCard() {
  const { message } = useChatMessage()

  const wikiData = getCustomAnnotations<WikiData>(message.annotations, 'wiki')

  if (!wikiData[0]) return null

  const data = wikiData[0]

  return (
    <div className="my-4 rounded-lg border border-green-200 bg-green-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <WikiIcon category={data.category} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-green-900">{data.title}</h3>
          <div className="text-sm text-green-700">
            <p className="mt-1">{data.summary}</p>
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-green-600">
        <div className="flex items-center gap-2">
          <span>📂 Category:</span>
          <span className="font-medium">{data.category}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>📅 Updated:</span>
          <span className="font-medium">{data.lastUpdated}</span>
        </div>
      </div>
      <div className="mt-3">
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-green-700 underline hover:text-green-900"
        >
          📖 Read full article
          <span>↗</span>
        </a>
      </div>
    </div>
  )
}

function WikiIcon({ category }: { category: string }) {
  const iconMap: Record<string, string> = {
    science: '🧪',
    history: '📜',
    technology: '💻',
    biology: '🧬',
    geography: '🌍',
    literature: '📚',
    art: '🎨',
    music: '🎵',
  }

  return (
    <span className="text-2xl">{iconMap[category.toLowerCase()] || '📖'}</span>
  )
}
