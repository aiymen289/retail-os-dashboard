'use client'

import { useState } from 'react'
import { Config, updateConfig } from '@/lib/api'
import { useConfig } from '@/hooks/useConfig'
import { Check, AlertCircle } from 'lucide-react'

interface ConfigFormProps {
  onSuccess?: () => void
}

export default function ConfigForm({ onSuccess }: ConfigFormProps) {
  const { config, isLoading } = useConfig()
  const [formData, setFormData] = useState<Config | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Initialize form data when config loads
  if (config && !formData) {
    setFormData(config)
  }

  const handleChange = (path: string, value: number | string) => {
    if (!formData) return

    const newFormData = { ...formData }
    const parts = path.split('.')

    if (parts.length === 2) {
      const [section, key] = parts
      if (section === 'thresholds' || section === 'formulas') {
        ;(newFormData[section as keyof Config][key as any] as any) = isNaN(Number(value))
          ? value
          : Number(value)
      }
    }

    setFormData(newFormData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setSaving(true)
    setMessage(null)

    try {
      const response = await updateConfig(formData)
      if (response.success) {
        setMessage({ type: 'success', text: 'Configuration updated successfully!' })
        onSuccess?.()
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update configuration',
      })
    } finally {
      setSaving(false)
    }
  }

  if (isLoading || !formData) {
    return <div className="text-center py-8">Loading configuration...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alert/Success Message */}
      {message && (
        <div
          className={`rounded-lg border p-4 flex items-center gap-3 ${
            message.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <Check size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Thresholds Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-bold text-gray-900">Inventory Thresholds</h3>

        <div className="space-y-4">
          {/* Expiring Soon Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Expiring Soon Threshold (days)
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Items will be marked as expiring soon if they expire within this many days
            </p>
            <input
              type="number"
              min="1"
              max="365"
              value={formData.thresholds.expiring_soon_days}
              onChange={(e) => handleChange('thresholds.expiring_soon_days', e.target.value)}
              className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Stockout Risk DOC */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stockout Risk Threshold (Days of Coverage)
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Items with fewer days of inventory will be marked at risk
            </p>
            <input
              type="number"
              min="1"
              max="365"
              value={formData.thresholds.stockout_risk_doc}
              onChange={(e) => handleChange('thresholds.stockout_risk_doc', e.target.value)}
              className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* High Stock DOC */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              High Stock Threshold (Days of Coverage)
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Items with more days of inventory than this will be marked as overstocked
            </p>
            <input
              type="number"
              min="1"
              max="365"
              value={formData.thresholds.high_stock_doc}
              onChange={(e) => handleChange('thresholds.high_stock_doc', e.target.value)}
              className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* Formulas Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-bold text-gray-900">Pricing Formulas</h3>

        <div className="space-y-4">
          {/* Markdown Formula Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Markdown Calculation Method
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Choose how aggressive pricing discounts should be for items at risk
            </p>
            <select
              value={formData.formulas.markdown}
              onChange={(e) => handleChange('formulas.markdown', e.target.value)}
              className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="simple">Simple (Standard)</option>
              <option value="advanced">Advanced (Aggressive)</option>
            </select>
          </div>

          {/* Markdown Elasticity */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Markdown Elasticity Factor
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Multiplier for markdown calculation (1.0 = standard, 1.5 = 50% more aggressive)
            </p>
            <input
              type="number"
              min="0.5"
              max="3.0"
              step="0.1"
              value={formData.formulas.markdown_elasticity}
              onChange={(e) => handleChange('formulas.markdown_elasticity', e.target.value)}
              className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
        <button
          type="button"
          onClick={() => setFormData(config)}
          disabled={saving}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  )
}
