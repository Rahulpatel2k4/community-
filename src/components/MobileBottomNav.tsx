import React from 'react';
import { Home, ShoppingBag, LayoutGrid, Clock, ShoppingCart } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'catalog' | 'schedule' | 'optimizer' | 'orders' | 'admin';
  setActiveTab: (tab: 'catalog' | 'schedule' | 'optimizer' | 'orders' | 'admin') => void;
  cartCount: number;
  onOpenCart: () => void;
  onScrollToCategories?: () => void;
  onOpenWallet?: () => void;
  walletBalance?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  onScrollToCategories,
  onOpenWallet,
  walletBalance = 750,
}) => {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-1.5 flex items-center justify-around select-none pb-[max(0.35rem,env(safe-area-inset-bottom))]"
      aria-label="Mobile Navigation"
    >
      {/* 1. Home */}
      <button
        type="button"
        onClick={() => setActiveTab('catalog')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          activeTab === 'catalog'
            ? 'text-[#164E2A] font-black'
            : 'text-slate-500 hover:text-slate-800 font-semibold'
        }`}
      >
        <div className="relative">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              activeTab === 'catalog' ? 'bg-[#E8F4E9] text-[#164E2A]' : 'text-slate-500'
            }`}
          >
            <Home className="w-4 h-4" />
          </div>
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">Home</span>
      </button>

      {/* 2. Order Again / Orders */}
      <button
        type="button"
        onClick={() => setActiveTab('orders')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          activeTab === 'orders'
            ? 'text-[#164E2A] font-black'
            : 'text-slate-500 hover:text-slate-800 font-semibold'
        }`}
      >
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
            activeTab === 'orders' ? 'bg-[#E8F4E9] text-[#164E2A]' : 'text-slate-500'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">Order Again</span>
      </button>

      {/* 3. Categories (Quadrant Grid shortcut) */}
      <button
        type="button"
        onClick={() => {
          setActiveTab('catalog');
          if (onScrollToCategories) onScrollToCategories();
        }}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 hover:text-slate-800 font-semibold transition-all cursor-pointer"
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-[#164E2A]">
          <LayoutGrid className="w-4 h-4" />
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">Categories</span>
      </button>

      {/* 4. Pool Schedule */}
      <button
        type="button"
        onClick={() => setActiveTab('schedule')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          activeTab === 'schedule'
            ? 'text-[#164E2A] font-black'
            : 'text-slate-500 hover:text-slate-800 font-semibold'
        }`}
      >
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
            activeTab === 'schedule' ? 'bg-[#E8F4E9] text-[#164E2A]' : 'text-slate-500'
          }`}
        >
          <Clock className="w-4 h-4" />
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">Batches</span>
      </button>

      {/* 5. Brand Pill with Cart Count (matching right red/green brand pill in screenshot) */}
      <button
        type="button"
        onClick={onOpenCart}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#164E2A] hover:bg-[#113E21] text-white shadow-md active:scale-95 transition-all cursor-pointer"
      >
        <ShoppingCart className="w-3.5 h-3.5 text-white" />
        <span className="text-xs font-black tracking-tight uppercase">
          Cart
        </span>
        {cartCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-[#F27A24] text-white text-[10px] font-black flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>
    </nav>
  );
};
