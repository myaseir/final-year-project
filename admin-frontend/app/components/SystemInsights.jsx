'use client';

import React from 'react';
import { Lightbulb, ArrowUpRight } from 'lucide-react';

export default function SystemInsights({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="mb-16 p-10 bg-[#FFF5F5] border border-[#F9EAEA] rounded-[3rem] flex flex-col md:flex-row gap-10 items-center">
      <div className="md:w-1/3">
        <div className="flex items-center gap-3 mb-4">
           <div className="h-8 w-8 rounded-full bg-[#E29595] flex items-center justify-center text-white">
              <Lightbulb size={16} />
           </div>
           <h3 className="text-xl font-serif italic">System Insights</h3>
        </div>
        <p className="text-xs text-[#8C7A7A] leading-relaxed">
          Automated suggestions based on dispensing frequency, dose volume, and wallet activity.
        </p>
      </div>
      <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((tip, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-[#F9EAEA] flex items-start gap-4 group hover:border-[#E29595] transition-colors">
            <ArrowUpRight className="text-[#E29595] mt-1 shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={16} />
            <span className="text-[11px] font-bold uppercase tracking-wide leading-relaxed">{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}