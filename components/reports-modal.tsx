'use client';

import { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

interface ReportsModalProps {
  onClose: () => void;
}

interface DailyData {
  date: string;
  margin: number;
  revenue: number;
  profit: number;
}

export default function ReportsModal({ onClose }: ReportsModalProps) {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCOGS, setTotalCOGS] = useState(0);
  const [totalDiscounts, setTotalDiscounts] = useState(0);
  const [wasteCost, setWasteCost] = useState(0);
  const [shrinkCost, setShrinkCost] = useState(0);
  const [weeklyData, setWeeklyData] = useState<DailyData[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/inventory/all');
      const batches = await response.json();
      
      // Calculate totals
      const totalInventoryValue = batches.reduce((sum: number, b: any) => sum + (b.retail_price * b.quantity), 0);
      const totalCostValue = batches.reduce((sum: number, b: any) => sum + (b.cost_price * b.quantity), 0);
      
      setTotalRevenue(totalInventoryValue);
      setTotalCOGS(totalCostValue);
      setWasteCost(44.80);
      setShrinkCost(62.80);
      
      // Sample weekly data
      setWeeklyData([
        { date: 'Jan 02', margin: 49.9, revenue: 174.65, profit: 87.15 },
        { date: 'Jan 03', margin: 56.1, revenue: 96.78, profit: 54.28 },
        { date: 'Jan 04', margin: 34.5, revenue: 97.80, profit: 33.70 },
        { date: 'Jan 05', margin: 53.7, revenue: 47.91, profit: 25.71 },
        { date: 'Jan 06', margin: 62.3, revenue: 110.28, profit: 6.08 },
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const grossProfit = totalRevenue - totalCOGS - totalDiscounts - wasteCost - shrinkCost;
  const margin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Reports & Summary</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Today's Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Revenue</p>
                <p className="text-lg font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">COGS</p>
                <p className="text-lg font-bold text-gray-900">${totalCOGS.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Discounts</p>
                <p className="text-lg font-bold text-gray-900">${totalDiscounts.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Waste Cost</p>
                <p className="text-lg font-bold text-red-600">${wasteCost.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Shrink Cost</p>
                <p className="text-lg font-bold text-red-600">${shrinkCost.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Gross Profit</p>
                  <p className="text-2xl font-bold text-green-600">${grossProfit.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Margin</p>
                  <p className="text-2xl font-bold text-blue-600">{margin.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Last 7 Days */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Last 7 Days</h3>
            <div className="space-y-3">
              {weeklyData.map((day) => (
                <div key={day.date} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{day.date}</p>
                    <p className="text-xs text-gray-500">{day.margin}% margin</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${day.revenue.toFixed(2)}</p>
                    <p className="text-sm text-green-600">+${day.profit.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={() => window.print()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}