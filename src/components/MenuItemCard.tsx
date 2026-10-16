import React from 'react';
import { MenuItem } from '../types';
import { DishIllustration } from './DishIllustration';
import { formatRupiah } from '../utils/orderMath';
import { Flame, Plus } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onSelect }) => {
  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Product Illustration Visual */}
      <div className="relative overflow-hidden cursor-pointer" onClick={() => onSelect(item)}>
        <DishIllustration type={item.imageSvgType} className="w-full h-44 transition-transform duration-300 group-hover:scale-102" />
        
        {item.popular && (
          <span className="absolute top-2 right-2 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-600 text-white shadow-xs">
            Terlaris
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span className="capitalize">{item.category}</span>
            {item.allowSpicyLevel && (
              <span className="flex items-center gap-1 text-red-600 font-semibold text-[11px]">
                <Flame className="w-3 h-3 fill-red-600" />
                Level 0 - {item.maxSpicyLevel}
              </span>
            )}
          </div>

          <h3
            className="text-base font-bold text-stone-900 group-hover:text-red-600 transition-colors cursor-pointer"
            onClick={() => onSelect(item)}
          >
            {item.name}
          </h3>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-400 block font-medium">Harga</span>
            <span className="text-base font-extrabold text-stone-950 font-mono tabular-nums">
              {formatRupiah(item.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelect(item)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 active:scale-95 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
            aria-label={`Pesan ${item.name}`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{item.allowSpicyLevel ? 'Pilih Level' : 'Tambah'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
