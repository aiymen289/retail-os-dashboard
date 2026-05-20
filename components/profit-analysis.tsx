'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ProductProfit {
  name: string;
  profit: number;
  margin: number;
  revenue: number;
  cogs: number;
  units_sold: number;
}

export default function ProfitAnalysis() {
  const [data, setData] = useState<{ products: ProductProfit[]; total_profit: number; average_margin: number }>({
    products: [],
    total_profit: 0,
    average_margin: 0
  });
  const [selectedProduct, setSelectedProduct] = useState<ProductProfit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const getMockData = () => {
    return {
      products: [
        { name: "Whole Milk 1L", profit: 195.00, margin: 60.6, revenue: 304.39, cogs: 120.00, units_sold: 61 },
        { name: "Fresh Eggs 12ct", profit: 130.00, margin: 55.2, revenue: 235.50, cogs: 105.50, units_sold: 47 },
        { name: "Greek Yogurt 500g", profit: 85.50, margin: 48.5, revenue: 176.50, cogs: 91.00, units_sold: 35 },
        { name: "Cheddar Cheese 200g", profit: 72.30, margin: 52.3, revenue: 138.20, cogs: 65.90, units_sold: 28 },
        { name: "Mineral Water 1.5L", profit: 65.20, margin: 42.8, revenue: 152.40, cogs: 87.20, units_sold: 42 },
        { name: "Apple Juice 1L", profit: 58.40, margin: 45.2, revenue: 129.20, cogs: 70.80, units_sold: 29 },
        { name: "White Bread 500g", profit: 45.80, margin: 38.5, revenue: 119.00, cogs: 73.20, units_sold: 34 },
        { name: "Croissant Pack 4ct", profit: 38.20, margin: 41.2, revenue: 92.70, cogs: 54.50, units_sold: 18 },
        { name: "Orange Juice 1L", profit: 32.50, margin: 35.8, revenue: 90.80, cogs: 58.30, units_sold: 20 },
        { name: "Sourdough Bread", profit: 28.90, margin: 44.7, revenue: 64.70, cogs: 35.80, units_sold: 13 }
      ],
      total_profit: 751.80,
      average_margin: 46.5
    };
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/profit-analysis');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Handle different response formats
      let productsData: ProductProfit[] = [];
      let totalProfit = 0;
      let avgMargin = 0;
      
      if (result && Array.isArray(result.products)) {
        productsData = result.products;
        totalProfit = result.total_profit || 0;
        avgMargin = result.average_margin || 0;
      } else if (Array.isArray(result)) {
        productsData = result;
        totalProfit = productsData.reduce((sum, p) => sum + (p.profit || 0), 0);
        avgMargin = productsData.length > 0 ? productsData.reduce((sum, p) => sum + (p.margin || 0), 0) / productsData.length : 0;
      } else {
        // Use mock data if response is invalid
        const mockData = getMockData();
        productsData = mockData.products;
        totalProfit = mockData.total_profit;
        avgMargin = mockData.average_margin;
      }
      
      setData({
        products: productsData,
        total_profit: totalProfit,
        average_margin: avgMargin
      });
    } catch (error) {
      console.error('Error fetching profit analysis:', error);
      // Use mock data on error
      const mockData = getMockData();
      setData(mockData);
      setError('Using demo data. Connect backend for real data.');
    } finally {
      setLoading(false);
    }
  };

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          {error}
        </div>
      )}
      
      <h2 className="text-xl font-bold text-gray-900 mb-4">Profit Analysis</h2>
      
      {/* Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Top 10 Products by Gross Profit</h3>
        {data.products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No product data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.products} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={80} 
                tick={{ fontSize: 11 }}
                interval={0}
              />
              <YAxis label={{ value: 'Gross Profit ($)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Gross Profit']}
                cursor={{ fill: '#f3f4f6' }}
              />
              <Bar dataKey="profit" onClick={(data) => setSelectedProduct(data.payload)} cursor="pointer">
                {data.products.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Product Details */}
      {selectedProduct && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">{selectedProduct.name}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600">Revenue</p>
              <p className="text-lg font-bold text-gray-900">${selectedProduct.revenue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">COGS</p>
              <p className="text-lg font-bold text-gray-900">${selectedProduct.cogs.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Units Sold</p>
              <p className="text-lg font-bold text-gray-900">{selectedProduct.units_sold}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Gross Profit Margin</p>
              <p className="text-lg font-bold text-green-600">{selectedProduct.margin}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-xs text-gray-600">Total Gross Profit</p>
          <p className="text-2xl font-bold text-green-600">${data.total_profit.toFixed(2)}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-xs text-gray-600">Average Margin</p>
          <p className="text-2xl font-bold text-blue-600">{data.average_margin}%</p>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-400 text-center">
        Click on any bar to see product details
      </div>
    </div>
  );
}