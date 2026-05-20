'use client'

import { ShoppingCart, Truck, Trash2, DollarSign, FileText } from 'lucide-react'
import { useBatchData } from '@/hooks/useBatchData'
import { useState } from 'react'
import ReceiveDeliveryModal from './receive-delivery-modal'
import WasteEventModal from './waste-event-modal'
import PriceRuleModal from './price-rule-modal'
import ReportsModal from './reports-modal'

export default function InventoryView() {
  const { batches, isLoading } = useBatchData()
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [showWasteModal, setShowWasteModal] = useState(false)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [showReportsModal, setShowReportsModal] = useState(false)

  const refreshData = () => {
    window.location.reload()
  }

  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden bg-white">
        {/* Title */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Inventory by Expiry</h2>
        </div>

        {/* Inventory Table */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 animate-pulse">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : batches.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">No inventory items found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {batches.map((item) => (
                <div key={item.batch_code} className="rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <h3 className="font-semibold text-gray-900">{item.product_name}</h3>
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">📋</span>
                          <span>Batch: {item.batch_code}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">📦</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">📅</span>
                          <span>Expires: {item.expiry_date}</span>
                        </div>
                      </div>
                      {item.suggested_markdown_percent > 0 && (
                        <div className="mt-2">
                          <span className="text-xs font-medium text-orange-700 bg-orange-50 px-2 py-1 rounded">
                            Suggested Markdown: {item.suggested_markdown_percent}%
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className={`text-sm font-bold ${item.days_until_expiry < 0 ? 'text-red-600' : item.days_until_expiry <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                          {item.days_until_expiry < 0 ? 'Expired' : `${item.days_until_expiry} days`}
                        </p>
                        <p className="text-xs text-gray-500">until expiry</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-red-600">{item.quantity_at_risk} units</p>
                        <p className="text-xs text-gray-500">at risk</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Action Buttons */}
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex gap-3">
            <button
              onClick={() => alert('POS feature coming soon')}
              className="flex items-center justify-center gap-2 flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <ShoppingCart size={18} />
              POS
            </button>
            <button
              onClick={() => setShowReceiveModal(true)}
              className="flex items-center justify-center gap-2 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Truck size={18} />
              Receive
            </button>
            <button
              onClick={() => setShowWasteModal(true)}
              className="flex items-center justify-center gap-2 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Trash2 size={18} />
              Waste
            </button>
            <button
              onClick={() => setShowPriceModal(true)}
              className="flex items-center justify-center gap-2 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <DollarSign size={18} />
              Price
            </button>
            <button
              onClick={() => setShowReportsModal(true)}
              className="flex items-center justify-center gap-2 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <FileText size={18} />
              Reports
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showReceiveModal && (
        <ReceiveDeliveryModal
          onClose={() => setShowReceiveModal(false)}
          onSuccess={refreshData}
        />
      )}
      {showWasteModal && (
        <WasteEventModal
          onClose={() => setShowWasteModal(false)}
          onSuccess={refreshData}
        />
      )}
      {showPriceModal && (
        <PriceRuleModal
          onClose={() => setShowPriceModal(false)}
          onSuccess={refreshData}
        />
      )}
      {showReportsModal && (
        <ReportsModal onClose={() => setShowReportsModal(false)} />
      )}
    </>
  )
}