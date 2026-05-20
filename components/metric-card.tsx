'use client'

import { AlertTriangle, Package } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  subtext?: string
  status?: 'critical' | 'medium' | 'good'
  type: 'expiring' | 'stockout'
  onClick?: () => void
}

export default function MetricCard({ title, value, subtext, status, type, onClick }: MetricCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'critical':
        return 'text-red-500 border-red-500'
      case 'medium':
        return 'text-amber-500 border-amber-500'
      default:
        return 'text-gray-500 border-gray-200'
    }
  }

  const getBadgeColor = () => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-700'
      case 'medium':
        return 'bg-amber-100 text-amber-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const Icon = type === 'expiring' ? AlertTriangle : Package

  return (
    <div 
      onClick={onClick}
      className="flex-1 rounded-lg border border-gray-200 bg-white p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Icon className={`mt-1 ${getStatusColor()}`} size={20} />
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">items</p>
            {subtext && (
              <p className="mt-1 text-sm font-semibold text-red-500">{subtext} at risk</p>
            )}
          </div>
        </div>
        {status && (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getBadgeColor()}`}>
            {status}
          </span>
        )}
      </div>
    </div>
  )
}