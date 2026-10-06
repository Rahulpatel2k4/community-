import React from 'react';
import { ProductCategory, PoolTypeFilter } from '../types';
import { MoreHorizontal, Check } from 'lucide-react';

interface BestsellersQuadrantGridProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  onSelectPoolTypeFilter?: (filter: PoolTypeFilter) => void;
}

export const BestsellersQuadrantGrid: React.FC<BestsellersQuadrantGridProps> = ({
  selectedCategory,
  onSelectCategory,
  onSelectPoolTypeFilter,
}) => {
  const categories = [
    {
      id: 'only_organic' as ProductCategory,
      title: 'Only Organic',
      subtitle: 'Patented Bio-Farms',
      moreCount: '100% BIO',
      isOrganicHighlight: true,
      thumbnails: [
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=240&q=80', // organic tomato
        'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=240&q=80', // organic spinach
        'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=240&q=80', // organic apple
        'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=240&q=80', // organic banana
      ],
    },
    {
      id: 'veggies' as ProductCategory,
      title: 'Vegetables',
      subtitle: '& Farm Fresh',
      moreCount: '+112',
      thumbnails: [
        'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=240&q=80', // potato
        'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=240&q=80', // greens/spinach
        'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=240&q=80', // onion
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=240&q=80', // tomato
      ],
    },
    {
      id: 'fruits' as ProductCategory,
      title: 'Fresh Fruits',
      subtitle: 'Orchard Direct',
      moreCount: '+86',
      thumbnails: [
        'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=240&q=80', // apple
        'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=240&q=80', // banana
        'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=240&q=80', // mango
        'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=240&q=80', // orange
      ],
    },
    {
      id: 'staples' as ProductCategory,
      title: 'Atta & Rice',
      subtitle: 'Dals & Grains',
      moreCount: '+153',
      thumbnails: [
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=240&q=80', // flour
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=240&q=80', // rice
        'https://images.unsplash.com/photo-1585994192701-f1a505c8574a?auto=format&fit=crop&w=240&q=80', // dal
        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=240&q=80', // poha
      ],
    },
    {
      id: 'dairy_fresh' as ProductCategory,
      title: 'Dairy & Milk',
      subtitle: 'Bread & Eggs',
      moreCount: '+48',
      thumbnails: [
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=240&q=80', // milk
        'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=240&q=80', // paneer
        'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=240&q=80', // eggs
        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=240&q=80', // butter/ghee
      ],
    },
    {
      id: 'snacks' as ProductCategory,
      title: 'Chips & Bites',
      subtitle: 'Healthy Bites',
      moreCount: '+78',
      thumbnails: [
        'https://images.unsplash.com/photo-1621996346565-e3d5d6281146?auto=format&fit=crop&w=240&q=80', // banana chips
        'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=240&q=80', // makhana
        'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=240&q=80', // wafers
        'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=240&q=80', // nuts
      ],
    },
    {
      id: 'bakery' as ProductCategory,
      title: 'Bakery & Pav',
      subtitle: 'Fresh Sourdough',
      moreCount: '+42',
      thumbnails: [
        'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=240&q=80', // sourdough
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=240&q=80', // buns
        'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=240&q=80', // bread
        'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=240&q=80', // cookie
      ],
    },
    {
      id: 'beverages' as ProductCategory,
      title: 'Drinks & Juice',
      subtitle: 'Fresh Coconuts',
      moreCount: '+56',
      thumbnails: [
        'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=240&q=80', // coconut
        'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=240&q=80', // cold brew
        'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=240&q=80', // mango nectar
        'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=240&q=80', // citrus
      ],
    },
    {
      id: 'wholesale_crates' as ProductCategory,
      title: 'Wholesale',
      subtitle: 'Farm Gate Sacks',
      moreCount: '+24',
      thumbnails: [
        'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=240&q=80', // onion sack
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=240&q=80', // 50kg atta
        'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=240&q=80', // mango crate
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=240&q=80', // tomato crate
      ],
      isWholesaleCrates: true,
    },
  ];

  return (
    <section className="mb-5">
      {/* Section Header: "Bestsellers" + Right Action */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
            Bestsellers
          </h2>
          <span className="text-[11px] font-bold text-[#164E2A] bg-[#E8F4E9] px-2 py-0.5 rounded-full border border-[#CEE2D1] hidden sm:inline">
            Direct Farm & Mandi Pools
          </span>
        </div>

        <button
          onClick={() => onSelectCategory('all')}
          className="w-8 h-8 rounded-full bg-[#164E2A] hover:bg-[#113E21] text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
          title="View all items"
          aria-label="View all items"
        >
          <MoreHorizontal className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Responsive Quadrant Category Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 sm:gap-2.5">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                onSelectCategory(cat.id);
                if (cat.isWholesaleCrates && onSelectPoolTypeFilter) {
                  onSelectPoolTypeFilter('large');
                }
              }}
              className={`group flex flex-col items-center p-1 sm:p-2 rounded-2xl transition-all text-left relative cursor-pointer min-w-0 overflow-hidden ${
                isSelected
                  ? 'bg-[#E8F4E9] ring-2 ring-[#164E2A] shadow-md border-transparent'
                  : 'bg-[#F0F4F8] hover:bg-[#E4ECF4] border border-[#E2E8F0] shadow-2xs hover:shadow-xs'
              }`}
            >
              {/* Active Indicator Checkmark */}
              {isSelected && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#164E2A] text-white flex items-center justify-center font-black text-xs shadow-xs z-10">
                  <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                </span>
              )}

              {/* 2x2 Image Quadrant Container */}
              <div className="w-full aspect-square bg-white rounded-xl p-0.5 sm:p-1 shadow-2xs overflow-hidden grid grid-cols-2 gap-0.5 group-hover:scale-[1.02] transition-transform">
                {cat.thumbnails.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    className="w-full h-full rounded-md overflow-hidden bg-slate-100 flex items-center justify-center"
                  >
                    <img
                      src={imgSrc}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>

              {/* "+more" Pill underneath 2x2 grid */}
              <span
                className={`text-[8.5px] sm:text-[9.5px] font-black px-1.5 py-0.5 rounded-full mt-1 shadow-2xs border transition-colors max-w-full truncate text-center leading-none ${
                  isSelected
                    ? 'bg-[#164E2A] text-white border-[#164E2A]'
                    : 'bg-white text-slate-600 border-slate-200/90 group-hover:text-slate-900'
                }`}
              >
                {cat.moreCount}
              </span>

              {/* Bold Category Label */}
              <span
                className={`text-[9.5px] sm:text-[11px] font-black text-center leading-tight mt-0.5 transition-colors line-clamp-1 truncate w-full px-0.5 ${
                  isSelected ? 'text-[#164E2A]' : 'text-slate-900 group-hover:text-slate-950'
                }`}
              >
                {cat.title}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
