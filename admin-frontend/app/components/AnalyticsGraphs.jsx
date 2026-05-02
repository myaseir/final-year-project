'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsGraphs({ analytics }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
      <div className="bg-white p-10 border border-[#F9EAEA] rounded-[3rem] shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-serif italic">Avg. Dosage per Essence</h3>
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-30">Milliliters (ml)</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics?.volume_analysis}>
              <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} 
                cursor={{fill: '#FDF8F8'}} 
              />
              <Bar dataKey="avg_ml" fill="#a7c7d8" radius={[10, 10, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-10 border border-[#F9EAEA] rounded-[3rem] shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-serif italic">Client Expenditure</h3>
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-30">Top Spenders (PKR)</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics?.top_customers} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" fontSize={10} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ borderRadius: '20px', border: 'none' }} />
              <Bar dataKey="value" fill="#4A3F3F" radius={[0, 10, 10, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}