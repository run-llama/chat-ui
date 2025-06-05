'use client'

interface WikiData {
  title: string
  summary: string
  url: string
  category: string
  lastUpdated: string
}

// A UI widget that displays wiki information, it can be used inline with markdown text
export function WikiCard({ data }: { data: WikiData }) {
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      science: 'from-blue-50 to-blue-100 border-blue-200 text-blue-900',
      history: 'from-amber-50 to-amber-100 border-amber-200 text-amber-900',
      technology:
        'from-purple-50 to-purple-100 border-purple-200 text-purple-900',
      biology: 'from-green-50 to-green-100 border-green-200 text-green-900',
      geography: 'from-teal-50 to-teal-100 border-teal-200 text-teal-900',
      literature:
        'from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-900',
      art: 'from-pink-50 to-pink-100 border-pink-200 text-pink-900',
      music: 'from-violet-50 to-violet-100 border-violet-200 text-violet-900',
    }
    return (
      colors[category.toLowerCase()] ||
      'from-gray-50 to-gray-100 border-gray-200 text-gray-900'
    )
  }

  const categoryColorClass = getCategoryColor(data.category)

  return (
    <div
      className={`my-6 rounded-xl border bg-gradient-to-br p-6 shadow-sm transition-all duration-200 hover:shadow-md ${categoryColorClass}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-white/50 shadow-sm backdrop-blur-sm">
          <span className="text-3xl">
            {iconMap[data.category.toLowerCase()] || '📖'}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-2 text-xl font-bold leading-tight">{data.title}</h3>
          <p className="mb-4 text-base leading-relaxed opacity-80">
            {data.summary}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm opacity-70">
        <div className="flex items-center gap-2">
          <span className="font-medium">📂</span>
          <span className="capitalize">{data.category}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">📅</span>
          <span>{data.lastUpdated}</span>
        </div>
      </div>

      <div className="border-current/10 mt-4 border-t pt-4">
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-white/30 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/50 hover:shadow-sm"
        >
          📖 Read full article
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  )
}
