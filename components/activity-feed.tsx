'use client'

import { TrendingUp, Truck, AlertCircle, AlertTriangle } from 'lucide-react'
import { useActivityFeed } from '@/hooks/useActivityFeed'

const iconMap: Record<string, any> = {
  sale: TrendingUp,
  delivery: Truck,
  waste: AlertTriangle,
  alert: AlertCircle,
}

const colorMap: Record<string, { bg: string; icon: string }> = {
  green: { bg: 'bg-green-100', icon: 'text-green-600' },
  blue: { bg: 'bg-blue-100', icon: 'text-blue-600' },
  red: { bg: 'bg-red-100', icon: 'text-red-600' },
  yellow: { bg: 'bg-yellow-100', icon: 'text-yellow-600' },
}

export default function ActivityFeed() {
  const { activities, isLoading } = useActivityFeed()
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-4">
        <h2 className="font-semibold text-gray-900">Activity Feed</h2>
      </div>

      {/* Feed Items */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-lg border border-gray-200 p-3 animate-pulse">
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500 text-sm">No activity yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => {
              const Icon = iconMap[activity.event_type] || AlertCircle
              const colors = colorMap[activity.icon_color] || colorMap.blue
              
              return (
                <div
                  key={activity.transaction_id}
                  className="rounded-lg border border-gray-200 p-3 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex gap-3">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${colors.bg}`}>
                      <Icon size={18} className={colors.icon} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm">{activity.title}</h4>
                      <p className="text-xs text-gray-600 truncate mt-0.5">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    {activity.amount && (
                      <div className="ml-2 flex-shrink-0 text-right">
                        <p className={`font-semibold text-sm ${activity.event_type === 'sale' ? 'text-green-600' : 'text-red-600'}`}>
                          {activity.amount}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
