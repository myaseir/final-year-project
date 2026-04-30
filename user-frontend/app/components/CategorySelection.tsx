import React from 'react';
import { ChevronRight, Wind } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
}

interface Props {
  categories: Category[];
  onSelect: (category: Category) => void;
}

export default function CategorySelection({ categories, onSelect }: Props) {
  return (
    <section className="animate-in fade-in slide-in-from-left duration-500">
      <h2 className="text-5xl font-extrabold mb-10 tracking-tight text-white">
        Select <span className="text-emerald-500">Category</span>
      </h2>
      <div className="grid gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat)}
            className="flex items-center justify-between bg-[#141414] border border-white/5 p-8 rounded-3xl hover:border-emerald-500/50 transition-all group"
          >
            <div className="flex items-center gap-6">
              <cat.icon size={40} className="text-emerald-500" />
              <span className="text-3xl font-bold tracking-tight text-white">{cat.name}</span>
            </div>
            <ChevronRight size={32} className="text-gray-700 group-hover:text-emerald-500 transition-colors" />
          </button>
        ))}
      </div>
    </section>
  );
}