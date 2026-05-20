'use client'

import { Bell, Settings, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMetrics } from '@/hooks/useMetrics'

export default function Header() {
  const { metrics, isLoading } = useMetrics()
  
  const formatCurrency = (value: number | string) => {
    // If value is a string that already has $, return it as is
    if (typeof value === 'string' && value.startsWith('$')) {
      return value
    }
    // Convert to number and format
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) {
      return '$0.00'
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numValue)
  }

  const getMetricValue = (metric: any, defaultValue: string = '$0.00') => {
    if (isLoading) return '...'
    if (!metric) return defaultValue
    return metric.value || defaultValue
  }

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between gap-6">
        {/* Left section: Logo and controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <span className="text-lg font-bold text-blue-600">📦</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">Retail OS (Bakalas)</span>
              <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">DEV</span>
            </div>
          </div>
        </div>

        {/* Center section: Store selector and date picker */}
        <div className="flex items-center gap-3">
          <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>Downtown Corner Store</option>
          </select>
          <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2">
            <input
              type="date"
              defaultValue="2026-05-19"
              className="text-sm text-gray-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Right section: Metrics and user controls */}
        <div className="flex items-center gap-6">
          {/* Metrics */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500">Today Sales</span>
              <span className="text-lg font-bold text-gray-900">
                {getMetricValue(metrics?.sales_today)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500">Gross Margin</span>
              <span className="text-lg font-bold text-gray-900">
                {isLoading ? '...' : formatCurrency(metrics?.gross_profit?.value || 0)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500">Waste Today</span>
              <span className="text-lg font-bold text-gray-900">
                {getMetricValue(metrics?.waste_today)}
              </span>
            </div>
          </div>

          {/* Search and controls */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search SKU, Supplier..."
                className="w-64 rounded-lg border border-gray-300 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button className="relative rounded-lg p-2 hover:bg-gray-100">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                5
              </span>
            </button>
            <button className="rounded-lg p-2 hover:bg-gray-100">
              <User size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}