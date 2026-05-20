'use client'

import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  fetchExpiringItems,
  fetchStockoutRiskItems,
  InventoryItemDetail,
} from '@/lib/api'

interface MetricDetailModalProps {
  metricType: string
  onClose: () => void
}

export default function MetricDetailModal({
  metricType,
  onClose,
}: MetricDetailModalProps) {
  const [items, setItems] = useState<InventoryItemDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true)
        if (metricType === 'expiring_soon') {
          const data = await fetchExpiringItems()
          setItems(data)
        } else if (metricType === 'stockout_risk') {
          const data = await fetchStockoutRiskItems()
          setItems(data)
        }
      } catch (error) {
        console.error('Failed to load items:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadItems()
  }, [metricType])

  const getTitle = () => {
    if (metricType === 'expiring_soon') return 'Items Expiring Soon'
    if (metricType === 'stockout_risk') return 'Items at Stockout Risk'
    return 'Metric Details'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl rounded-lg bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading items...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No items found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.batch_code}
                  className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <h4 className="font-semibold text-gray-900">
                          {item.product_name}
                        </h4>
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {item.category}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p className="text-xs text-gray-500">Batch Code</p>
                          <p className="font-medium">{item.batch_code}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Quantity</p>
                          <p className="font-medium">{item.quantity} units</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Expiry Date</p>
                          <p className="font-medium">{item.expiry_date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Days Until Expiry</p>
                          <p
                            className={`font-medium ${
                              item.days_until_expiry < 0
                                ? 'text-red-600'
                                : item.days_until_expiry <= 5
                                ? 'text-orange-600'
                                : 'text-green-600'
                            }`}
                          >
                            {item.days_until_expiry} days
                          </p>
                        </div>
                        {metricType === 'stockout_risk' && (
                          <>
                            <div>
                              <p className="text-xs text-gray-500">Days of Coverage</p>
                              <p className="font-medium">
                                {item.days_of_coverage.toFixed(1)} days
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Avg Daily Sales</p>
                              <p className="font-medium">
                                {item.average_daily_sales.toFixed(1)} units
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Retail Price</p>
                      <p className="text-lg font-bold text-gray-900">
                        ${item.retail_price.toFixed(2)}
                      </p>
                      <p className="mt-2 text-sm text-gray-500">Gross Profit</p>
                      <p className="text-lg font-bold text-green-600">
                        ${item.gross_profit_total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-4 text-right">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-900 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
