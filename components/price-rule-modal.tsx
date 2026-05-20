'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface PriceRuleModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function PriceRuleModal({ onClose, onSuccess }: PriceRuleModalProps) {
  const [ruleName, setRuleName] = useState('');
  const [daysThreshold, setDaysThreshold] = useState(3);
  const [discountPercent, setDiscountPercent] = useState(20);

  const calculateRecommendedDiscount = (days: number) => {
    if (days <= 1) return 50;
    if (days <= 3) return 30;
    if (days <= 5) return 20;
    if (days <= 7) return 10;
    return 5;
  };

  const handleDaysChange = (days: number) => {
    setDaysThreshold(days);
    setDiscountPercent(calculateRecommendedDiscount(days));
  };

  const handleSubmit = async () => {
    // Here you would save to backend
    console.log('Price rule created:', { ruleName, daysThreshold, discountPercent });
    alert(`Price rule "${ruleName}" created! ${discountPercent}% off for items expiring in ${daysThreshold} days`);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Create Price Rule</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Rule Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
            <input
              type="text"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              placeholder="e.g., Near Expiry - 20% Off"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Days to Expiry Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Days to Expiry Threshold</label>
            <input
              type="number"
              value={daysThreshold}
              onChange={(e) => handleDaysChange(parseInt(e.target.value) || 0)}
              min="1"
              max="30"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-green-600 mt-1">
              Recommended discount for {daysThreshold} days: {calculateRecommendedDiscount(daysThreshold)}%
            </p>
          </div>

          {/* Discount Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage</label>
            <input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(parseInt(e.target.value) || 0)}
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Preview */}
          <div className="bg-blue-50 rounded-lg p-4 mt-4">
            <p className="text-sm font-medium text-blue-900 mb-2">Preview</p>
            <p className="text-sm text-blue-800">
              Apply <span className="font-bold">{discountPercent}%</span> discount when items have 
              <span className="font-bold"> {daysThreshold}</span> days or less until expiry.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!ruleName || !discountPercent}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Rule
          </button>
        </div>
      </div>
    </div>
  );
}