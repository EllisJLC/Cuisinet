
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StoreShoppingComparison } from '../types';

interface ComparisonChartProps {
  data: StoreShoppingComparison[];
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    return data.map(store => {
      // Try to parse totalCost into a number for the chart
      const numericVal = parseFloat(store.totalCost.replace(/[^0-9.]/g, ''));
      return {
        name: store.storeName,
        total: numericVal,
        label: store.totalCost,
        isLowest: store.isLowestPrice
      };
    });
  }, [data]);

  return (
    <div className="h-[300px] w-full bg-white p-4 rounded-3xl border border-slate-100">
      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Total Basket Price Comparison</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
          />
          <YAxis hide />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs font-bold">
                    <p>{payload[0].payload.name}</p>
                    <p className="text-emerald-400 mt-1">{payload[0].payload.label}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="total" radius={[8, 8, 8, 8]} barSize={40}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.isLowest ? '#10b981' : '#e2e8f0'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
