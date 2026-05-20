'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface PriceRule {
  id: string;
  name: string;
  type: string;
  active: boolean;
  priority: number;
  days_threshold: number;
  discount_percent: number;
  description: string;
}

export default function PriceRules() {
  const [rules, setRules] = useState<PriceRule[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<PriceRule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/price-rules');
      const data = await response.json();
      
      // Handle both array and object responses
      let rulesArray: PriceRule[] = [];
      if (Array.isArray(data)) {
        rulesArray = data;
      } else if (data && typeof data === 'object') {
        // If it's an object with a rules property
        if (Array.isArray(data.rules)) {
          rulesArray = data.rules;
        } else if (Array.isArray(data.data)) {
          rulesArray = data.data;
        } else {
          // Use mock data if response is invalid
          rulesArray = getMockRules();
        }
      } else {
        rulesArray = getMockRules();
      }
      
      setRules(rulesArray);
    } catch (error) {
      console.error('Error fetching rules:', error);
      // Use mock data when API fails
      setRules(getMockRules());
    } finally {
      setLoading(false);
    }
  };

  const getMockRules = (): PriceRule[] => {
    return [
      {
        id: "RULE-001",
        name: "Near Expiry - 20% Off",
        type: "near-expiry",
        active: true,
        priority: 1,
        days_threshold: 3,
        discount_percent: 20,
        description: "20% discount when 3 days to expiry"
      },
      {
        id: "RULE-002",
        name: "Near Expiry - 50% Off",
        type: "near-expiry",
        active: true,
        priority: 2,
        days_threshold: 1,
        discount_percent: 50,
        description: "50% discount when 1 days to expiry"
      },
      {
        id: "RULE-003",
        name: "Weekend Special",
        type: "weekend",
        active: false,
        priority: 3,
        days_threshold: 0,
        discount_percent: 15,
        description: "15% off on weekends"
      }
    ];
  };

  const toggleRule = async (rule: PriceRule) => {
    const updated = { ...rule, active: !rule.active };
    try {
      await fetch(`http://localhost:8000/api/price-rules/${rule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      fetchRules();
    } catch (error) {
      // Update locally if API fails
      setRules(rules.map(r => r.id === rule.id ? updated : r));
    }
  };

  const deleteRule = async (id: string) => {
    if (confirm('Delete this price rule?')) {
      try {
        await fetch(`http://localhost:8000/api/price-rules/${id}`, { method: 'DELETE' });
        fetchRules();
      } catch (error) {
        setRules(rules.filter(r => r.id !== id));
      }
    }
  };

  const saveRule = async (ruleData: Partial<PriceRule>, isEdit: boolean, ruleId?: string) => {
    try {
      const url = isEdit 
        ? `http://localhost:8000/api/price-rules/${ruleId}`
        : 'http://localhost:8000/api/price-rules';
      
      await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ruleData)
      });
      fetchRules();
    } catch (error) {
      // Save locally if API fails
      if (isEdit && ruleId) {
        setRules(rules.map(r => r.id === ruleId ? { ...r, ...ruleData } as PriceRule : r));
      } else {
        const newRule: PriceRule = {
          id: `RULE-${Date.now()}`,
          name: ruleData.name || 'New Rule',
          type: ruleData.type || 'near-expiry',
          active: ruleData.active ?? true,
          priority: ruleData.priority || 1,
          days_threshold: ruleData.days_threshold || 3,
          discount_percent: ruleData.discount_percent || 20,
          description: ruleData.description || ''
        };
        setRules([...rules, newRule]);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Price Rules & Overrides</h2>
        <button
          onClick={() => { setEditingRule(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} /> Add Rule
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {rules.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
            No price rules yet. Click "Add Rule" to create one.
          </div>
        ) : (
          rules.map((rule) => (
            <div key={rule.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${rule.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {rule.active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">{rule.type}</span>
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">Priority: {rule.priority}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {rule.description || `${rule.discount_percent}% discount when ${rule.days_threshold} days to expiry`}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button onClick={() => toggleRule(rule)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                    {rule.active ? <ToggleRight className="text-green-600" size={22} /> : <ToggleLeft className="text-gray-400" size={22} />}
                  </button>
                  <button onClick={() => { setEditingRule(rule); setShowModal(true); }} className="p-1 hover:bg-gray-100 rounded text-blue-600 transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => deleteRule(rule.id)} className="p-1 hover:bg-gray-100 rounded text-red-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <PriceRuleModal
          rule={editingRule}
          onClose={() => setShowModal(false)}
          onSave={(data, isEdit, id) => {
            setShowModal(false);
            saveRule(data, isEdit, id);
          }}
        />
      )}
    </div>
  );
}

function PriceRuleModal({ rule, onClose, onSave }: { 
  rule: PriceRule | null; 
  onClose: () => void; 
  onSave: (data: Partial<PriceRule>, isEdit: boolean, id?: string) => void;
}) {
  const [formData, setFormData] = useState({
    name: rule?.name || '',
    type: rule?.type || 'near-expiry',
    active: rule?.active ?? true,
    priority: rule?.priority || 1,
    days_threshold: rule?.days_threshold || 3,
    discount_percent: rule?.discount_percent || 20,
    description: rule?.description || ''
  });

  const handleSubmit = () => {
    onSave(formData, !!rule, rule?.id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold">{rule ? 'Edit' : 'Create'} Price Rule</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
            <input 
              type="text" 
              placeholder="e.g., Near Expiry - 20% Off" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rule Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="near-expiry">Near Expiry</option>
              <option value="weekend">Weekend Special</option>
              <option value="clearance">Clearance</option>
              <option value="bundle">Bundle Deal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Days to Expiry Threshold</label>
            <input 
              type="number" 
              value={formData.days_threshold} 
              onChange={(e) => setFormData({...formData, days_threshold: parseInt(e.target.value)})} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Apply discount when items have this many days or less until expiry</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
            <input 
              type="number" 
              value={formData.discount_percent} 
              onChange={(e) => setFormData({...formData, discount_percent: parseInt(e.target.value)})} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority (lower = higher priority)</label>
            <input 
              type="number" 
              value={formData.priority} 
              onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of this pricing rule..."
            />
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {rule ? 'Update' : 'Create'} Rule
          </button>
        </div>
      </div>
    </div>
  );
}