'use client'

import { useChatMessage, getAnnotationData } from '@llamaindex/chat-ui'

interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
}

export function CustomWeatherAnnotation() {
  const { message } = useChatMessage()

  const weatherData = getAnnotationData<WeatherData>(message, 'weather')

  if (weatherData.length === 0) return null

  const data = weatherData[0]

  return (
    <div className="my-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <WeatherIcon condition={data.condition} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900">{data.location}</h3>
          <div className="flex items-center gap-4 text-sm text-blue-700">
            <span className="text-2xl font-bold">{data.temperature}°C</span>
            <span>{data.condition}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-blue-600">
        <div className="flex items-center gap-2">
          <span>💧 Humidity:</span>
          <span className="font-medium">{data.humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🌬️ Wind:</span>
          <span className="font-medium">{data.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  )
}

function WeatherIcon({ condition }: { condition: string }) {
  const iconMap: Record<string, string> = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '❄️',
    stormy: '⛈️',
  }

  return (
    <span className="text-2xl">{iconMap[condition.toLowerCase()] || '🌤️'}</span>
  )
}
