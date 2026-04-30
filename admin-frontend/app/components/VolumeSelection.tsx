import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ProductOption {
  id: string;
  volume: string;
  price: string;
}

interface Props {
  categoryName: string;
  Icon: React.ElementType;
  options: ProductOption[];
  onBack: () => void;
}

export default function VolumeSelection({ categoryName, Icon, options, onBack }: Props) {
  return (
    <section className="animate-in fade-in slide-in-from-right duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Categories
      </button>

      <div className="flex items-center gap-4 mb-10">
        <Icon size={48} className="text-emerald-500" />
        <h2 className="text-5xl font-extrabold tracking-tight text-white">
          Choose <span className="text-emerald-500">Volume</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            className="flex items-center justify-between bg-[#141414] border border-white/5 p-8 rounded-3xl hover:border-emerald-500 group transition-all"
          >
            <div className="text-left text-white">
              <span className="text-emerald-500 font-mono text-sm block mb-1 uppercase">Capacity</span>
              <span className="text-4xl font-bold">{opt.volume}</span>
            </div>
            <div className="text-right text-white">
              <span className="text-gray-500 text-sm block mb-1 uppercase font-semibold tracking-wider">Amount</span>
              <span className="text-3xl font-light">Rs. {opt.price}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}