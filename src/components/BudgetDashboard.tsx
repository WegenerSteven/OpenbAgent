import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Info, TrendingUp, AlertCircle, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { CountyDocument } from '../data';

interface BudgetDashboardProps {
  document: CountyDocument | null;
}

export function BudgetDashboard({ document }: BudgetDashboardProps) {
  if (!document || document.type !== 'Budget') {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-100 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
        <div className="bg-gray-50 p-4 rounded-full">
          <TrendingUp className="text-gray-300" size={48} />
        </div>
        <h3 className="font-display text-lg uppercase">Budget Analytics Preview</h3>
        <p className="text-sm text-gray-500 max-w-xs">Select a Budget document to visualize key allocations and ward-level investments.</p>
      </div>
    );
  }

  const data = [
    { name: 'Health', value: 8.2, color: '#1e3a8a' }, // brand-blue
    { name: 'Roads', value: 6.4, color: '#10b981' }, // brand-emerald
    { name: 'Enviro', value: 4.5, color: '#64748b' }, // slate-500
    { name: 'Plan', value: 3.1, color: '#F27D26' },
    { name: 'Social', value: 2.8, color: '#ff4d4d' },
  ];

  return (
    <div className="space-y-6">
      {/* Amendment Warning */}
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-center gap-3"
      >
        <div className="bg-red-500 text-white p-1.5 rounded-lg shadow-sm">
          <AlertCircle size={16} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Unsynced Amendment Detected</p>
          <p className="text-[10px] text-red-600">Gazette Notice #5421 reallocates KES 450M from Health. Chart below shows original allocation.</p>
        </div>
        <button className="text-[10px] bg-white border border-red-200 text-red-600 font-bold px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
          Recalculate
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-brand-emerald">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Total Allocation</p>
          <p className="text-2xl font-bold text-slate-900">KES 42.3B</p>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
            <TrendingUp size={12} />
            <span>+12% vs 2023</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-red-500">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Pending Bills</p>
          <p className="text-2xl font-bold text-brand-blue">KES 10.5B</p>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-red-600 font-bold">
            <AlertCircle size={12} />
            <span>High Risk Warning</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-blue-400">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Active Projects</p>
          <p className="text-2xl font-bold text-brand-blue">84 Wards</p>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-blue-600 font-bold">
            <MapPin size={12} />
            <span>View Ward Map</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-[10px] uppercase text-slate-400 tracking-widest mb-6 flex items-center gap-2">
          Sector Expenditure Breakdown (Billions KES)
          <Info size={12} className="opacity-40" />
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 0, right: 30, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={80} 
                fontSize={11} 
                fontFamily="Inter"
                tick={{ fill: '#334155', fontWeight: 600 }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(241,245,249,0.5)' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
              />
              <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={28}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
