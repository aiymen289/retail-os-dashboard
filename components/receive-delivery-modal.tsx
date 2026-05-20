'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface ReceiveItem {
  id: string;
  sku: string;
  productName: string;
  quantity: number;
  cost: number;
  expiryDate: string;
}

interface ReceiveDeliveryModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReceiveDeliveryModal({ onClose, onSuccess }: ReceiveDeliveryModalProps) {
  const [supplier, setSupplier] = useState('');
  const [items, setItems] = useState<ReceiveItem[]>([
    { id: '1', sku: '', productName: '', quantity: 0, cost: 0, expiryDate: '' }
  ]);

  const suppliers = ['Fresh Foods Ltd', 'Dairy Direct', 'Beverage Co', 'Bakery Supplies'];

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), sku: '', productName: '', quantity: 0, cost: 0, expiryDate: '' }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ReceiveItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSubmit = async () => {
    // Here you would send to backend
    console.log('Receiving delivery:', { supplier, items });
    alert(`Delivery received from ${supplier} with ${items.length} items`);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Receive Delivery</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Supplier Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Supplier</option>
              {suppliers.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Items */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">Items</label>
              <button
                onClick={addItem}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus size={16} /> Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-gray-700">Item {parseInt(item.id) + 1}</span>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">SKU/Product</label>
                      <input
                        type="text"
                        value={item.productName}
                        onChange={(e) => updateItem(item.id, 'productName', e.target.value)}
                        placeholder="Select SKU"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={item.quantity || ''}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value))}
                        placeholder="Qty"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Cost ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.cost || ''}
                        onChange={(e) => updateItem(item.id, 'cost', parseFloat(e.target.value))}
                        placeholder="Cost"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Expiry Date</label>
                      <input
                        type="date"
                        value={item.expiryDate}
                        onChange={(e) => updateItem(item.id, 'expiryDate', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
            disabled={!supplier || items.some(i => !i.productName || !i.quantity)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Receiving
          </button>
        </div>
      </div>
    </div>
  );
}