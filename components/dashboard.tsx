'use client'

import { useState } from 'react'
import ActivityFeed from './activity-feed'
import InventoryView from './inventory-view'
import PriceRules from './price-rules'
import ProfitAnalysis from './profit-analysis'
import POSSystem from './pos-system'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('inventory')
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)
  const [modalData, setModalData] = useState<any>(null)

  // Mock data for the 6 panels
  const metrics = {
    todaySales: { value: 0, label: "Today's Sales", icon: "💰", color: "blue" },
    grossProfit: { value: 353.93, label: "Gross Profit", icon: "📈", color: "green" },
    wasteToday: { value: 0, label: "Waste Today", icon: "🗑️", color: "red" },
    expiringSoon: { count: 11, atRisk: 486.90, status: "critical", label: "Expiring Soon" },
    stockoutRisk: { count: 4, status: "medium", label: "Stockout Risk" },
    highStock: { count: 0, status: "good", label: "High Stock" }
  }

  const handleMetricClick = (metricName: string, data: any) => {
    setSelectedMetric(metricName)
    setModalData(data)
  }

  const closeModal = () => {
    setSelectedMetric(null)
    setModalData(null)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      
      {/* ============================================================ */}
      {/* ROW 1: FIRST 3 METRIC PANELS (Small & Compact) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-3 gap-3 p-3 bg-white border-b border-gray-200">
        {/* Panel 1: Today's Sales */}
        <div 
          onClick={() => handleMetricClick("Today's Sales", { type: 'sales', items: [] })}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 text-white shadow-md cursor-pointer hover:opacity-90 transition-all flex justify-between items-center"
        >
          <div>
            <p className="text-blue-100 text-xs">Today's Sales</p>
            <p className="text-xl font-bold">${metrics.todaySales.value.toFixed(2)}</p>
          </div>
          <span className="text-2xl">{metrics.todaySales.icon}</span>
        </div>

        {/* Panel 2: Gross Profit */}
        <div 
          onClick={() => handleMetricClick("Gross Profit", { type: 'profit', items: [] })}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-3 text-white shadow-md cursor-pointer hover:opacity-90 transition-all flex justify-between items-center"
        >
          <div>
            <p className="text-green-100 text-xs">Gross Profit</p>
            <p className="text-xl font-bold">${metrics.grossProfit.value.toFixed(2)}</p>
          </div>
          <span className="text-2xl">{metrics.grossProfit.icon}</span>
        </div>

        {/* Panel 3: Waste Today */}
        <div 
          onClick={() => handleMetricClick("Waste Today", { type: 'waste', items: [] })}
          className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-3 text-white shadow-md cursor-pointer hover:opacity-90 transition-all flex justify-between items-center"
        >
          <div>
            <p className="text-red-100 text-xs">Waste Today</p>
            <p className="text-xl font-bold">${metrics.wasteToday.value.toFixed(2)}</p>
          </div>
          <span className="text-2xl">{metrics.wasteToday.icon}</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ROW 2: NEXT 3 METRIC PANELS (Small & Compact) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50">
        {/* Panel 4: Expiring Soon */}
        <div 
          onClick={() => handleMetricClick("Expiring Soon", { type: 'expiring', items: [], count: metrics.expiringSoon.count, atRisk: metrics.expiringSoon.atRisk })}
          className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-red-500 cursor-pointer hover:shadow-md transition-all flex justify-between items-center"
        >
          <div>
            <div className="flex items-center gap-1">
              <p className="font-semibold text-gray-800 text-sm">Expiring Soon</p>
              <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">!</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{metrics.expiringSoon.count}</p>
            <p className="text-red-600 text-xs font-semibold">${metrics.expiringSoon.atRisk.toFixed(2)} at risk</p>
          </div>
          <span className="text-2xl">⚠️</span>
        </div>

        {/* Panel 5: Stockout Risk */}
        <div 
          onClick={() => handleMetricClick("Stockout Risk", { type: 'stockout', items: [], count: metrics.stockoutRisk.count })}
          className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-yellow-500 cursor-pointer hover:shadow-md transition-all flex justify-between items-center"
        >
          <div>
            <div className="flex items-center gap-1">
              <p className="font-semibold text-gray-800 text-sm">Stockout Risk</p>
              <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded">!</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{metrics.stockoutRisk.count}</p>
            <p className="text-gray-500 text-xs">items at risk</p>
          </div>
          <span className="text-2xl">📦</span>
        </div>

        {/* Panel 6: High Stock */}
        <div 
          onClick={() => handleMetricClick("High Stock", { type: 'highstock', items: [], count: metrics.highStock.count })}
          className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-green-500 cursor-pointer hover:shadow-md transition-all flex justify-between items-center"
        >
          <div>
            <div className="flex items-center gap-1">
              <p className="font-semibold text-gray-800 text-sm">High Stock</p>
              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">✓</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{metrics.highStock.count}</p>
            <p className="text-gray-500 text-xs">overstocked</p>
          </div>
          <span className="text-2xl">📊</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN CONTENT AREA */}
      {/* ============================================================ */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Activity Feed */}
        <div className="w-72 border-r border-gray-200 bg-white flex-shrink-0 overflow-y-auto">
          <ActivityFeed />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 bg-white px-4 py-0 flex-shrink-0">
            <div className="flex gap-0">
              {[
                { id: 'inventory', label: 'Inventory', icon: '📦' },
                { id: 'pricing', label: 'Pricing', icon: '$' },
                { id: 'profit', label: 'Profit', icon: '📈' },
                { id: 'pos', label: 'POS', icon: '🛒' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 border-b-2 px-3 py-2 text-xs font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'inventory' && <InventoryView />}
            {activeTab === 'pricing' && <PriceRules />}
            {activeTab === 'profit' && <ProfitAnalysis />}
            {activeTab === 'pos' && <POSSystem />}
          </div>
        </div>
      </div>

      {/* Modal for Metric Details */}
      {selectedMetric && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-lg max-w-md w-full p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">{selectedMetric}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="space-y-2">
              {selectedMetric === "Expiring Soon" && modalData && (
                <>
                  <p className="text-gray-600">{modalData.count} items expiring soon</p>
                  <p className="text-red-600 font-bold">${modalData.atRisk.toFixed(2)} at risk</p>
                  <div className="mt-3 space-y-2">
                    <div className="p-2 bg-red-50 rounded">
                      <p className="font-medium">Apple Juice 1L</p>
                      <p className="text-sm text-gray-600">Expires in 3 days • 4 units at risk</p>
                    </div>
                    <div className="p-2 bg-red-50 rounded">
                      <p className="font-medium">Orange Juice 1L</p>
                      <p className="text-sm text-gray-600">Expires in 4 days • 8 units at risk</p>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded">
                      <p className="font-medium">Whole Milk 1L</p>
                      <p className="text-sm text-gray-600">Expires in 6 days • 12 units at risk</p>
                    </div>
                  </div>
                </>
              )}
              {selectedMetric === "Stockout Risk" && (
                <>
                  <p className="text-gray-600">4 items at risk of stockout</p>
                  <div className="mt-3 space-y-2">
                    <div className="p-2 bg-yellow-50 rounded">
                      <p className="font-medium">Croissant Pack 4ct</p>
                      <p className="text-sm text-gray-600">Only 6 units left • Selling 2/day</p>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded">
                      <p className="font-medium">Sourdough Bread</p>
                      <p className="text-sm text-gray-600">Only 3 units left • Selling 1/day</p>
                    </div>
                  </div>
                </>
              )}
              {selectedMetric === "High Stock" && (
                <p className="text-gray-600">No overstocked items at this time.</p>
              )}
              {(selectedMetric === "Today's Sales" || selectedMetric === "Gross Profit" || selectedMetric === "Waste Today") && (
                <p className="text-gray-600">No recent {selectedMetric.toLowerCase()} data available.</p>
              )}
            </div>
            <button onClick={closeModal} className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}