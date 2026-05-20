'use client'

import MetricCard from './metric-card'
import { useMetrics } from '@/hooks/useMetrics'
import { useState } from 'react'
import MetricDetailModal from './metric-detail-modal'

export default function AlertCards() {
  const { metrics, isLoading } = useMetrics()
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex gap-4">
        <div className="flex-1 rounded-lg border border-gray-200 bg-white p-4 animate-pulse">
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
        <div className="flex-1 rounded-lg border border-gray-200 bg-white p-4 animate-pulse">
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
        <div className="flex-1"></div>
      </div>
    )
  }

  return (
    <>
      <div className="flex gap-4">
        {metrics?.expiring_soon && (
          <MetricCard
            {...metrics.expiring_soon}
            onClick={() => setSelectedMetric('expiring_soon')}
          />
        )}
        {metrics?.stockout_risk && (
          <MetricCard
            {...metrics.stockout_risk}
            onClick={() => setSelectedMetric('stockout_risk')}
          />
        )}
        <div className="flex-1"></div>
      </div>

      {selectedMetric && (
        <MetricDetailModal
          metricType={selectedMetric}
          onClose={() => setSelectedMetric(null)}
        />
      )}
    </>
  )
}
