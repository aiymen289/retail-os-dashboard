'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Batch {
  batch_code: string;
  product_name: string;
  quantity: number;
}

interface WasteEventModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function WasteEventModal({ onClose, onSuccess }: WasteEventModalProps) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [maxQuantity, setMaxQuantity] = useState(0);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/inventory/all');
      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const handleBatchSelect = (batchCode: string) => {
    setSelectedBatch(batchCode);
    const batch = batches.find(b => b.batch_code === batchCode);
    setMaxQuantity(batch?.quantity || 0);
    setQuantity(0);
  };

  const reasons = ['Expired', 'Damaged', 'Spillage', 'Past Sell By Date', 'Quality Issue'];

  const handleSubmit = async () => {
    const selected = batches.find(b => b.batch_code === selectedBatch);
    console.log('Waste event:', { batch: selectedBatch, product: selected?.product_name, quantity, reason, notes });
    alert(`Logged waste: ${quantity} units of ${selected?.product_name} - Reason: ${reason}`);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Log Waste Event</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Select Batch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => handleBatchSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Batch</option>
              {batches.map(batch => (
                <option key={batch.batch_code} value={batch.batch_code}>
                  {batch.product_name} - {batch.batch_code} (Qty: {batch.quantity})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input
              type="number"
              value={quantity || ''}
              onChange={(e) => setQuantity(Math.min(parseInt(e.target.value) || 0, maxQuantity))}
              max={maxQuantity}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quantity"
            />
            {maxQuantity > 0 && (
              <p className="text-xs text-gray-500 mt-1">Max available: {maxQuantity} units</p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Reason</option>
              {reasons.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes..."
            />
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
            disabled={!selectedBatch || !quantity || !reason}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Log Waste
          </button>
        </div>
      </div>
    </div>
  );
}