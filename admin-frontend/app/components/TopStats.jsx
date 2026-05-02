'use client';

import React from 'react';
import { TrendingUp, ShoppingBag, Droplet, Lightbulb } from 'lucide-react';

export default function TopStats({ analytics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      <div className="p-8 bg-white border border-[#F9EAEA] rounded-[2.5rem] shadow-sm">
        <TrendingUp className="text-[#E29595] mb-4" size={20} />
        <p className="text-[9px] uppercase tracking-widest font-bold opacity-40 mb-1">Total Revenue</p>
        <h2 className="text-3xl font-bold">PKR {analytics?.total_revenue?.toLocaleString() || 0}</h2>
      </div>
      <div className="p-8 bg-white border border-[#F9EAEA] rounded-[2.5rem] shadow-sm">
        <ShoppingBag className="text-[#4A3F3F] mb-4" size={20} />
        <p className="text-[9px] uppercase tracking-widest font-bold opacity-40 mb-1">Estimated Profit</p>
        <h2 className="text-3xl font-bold text-green-600">PKR {analytics?.estimated_profit?.toLocaleString() || 0}</h2>
      </div>
      <div className="p-8 bg-white border border-[#F9EAEA] rounded-[2.5rem] shadow-sm">
        <Droplet className="text-[#a7c7d8] mb-4" size={20} />
        <p className="text-[9px] uppercase tracking-widest font-bold opacity-40 mb-1">Total Fluid Dispensed</p>
        <h2 className="text-3xl font-bold">{analytics?.total_volume_dispensed || 0} ml</h2>
      </div>
      <div className="p-8 bg-[#4A3F3F] text-white rounded-[2.5rem] shadow-xl relative overflow-hidden">
         <Lightbulb className="text-[#E29595] mb-4" size={20} />
         <p className="text-[9px] uppercase tracking-widest font-bold opacity-50 mb-1">Strategy</p>
         <h2 className="text-sm font-serif italic">Dosage Optimization</h2>
      </div>
    </div>
  );
}