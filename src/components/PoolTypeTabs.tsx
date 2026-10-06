import React from 'react';
import {
  Layers,
  Zap,
  Store,
  BellRing,
} from 'lucide-react';
import { PoolTypeFilter, NeighborhoodCluster } from '../types';

interface PoolTypeTabsProps {
  currentFilter: PoolTypeFilter;
  onSelectFilter: (filter: PoolTypeFilter) => void;
  neighborhood: NeighborhoodCluster;
  smallPoolCount: number;
  largePoolCount: number;
  unpooledCount?: number;
  totalProductCount: number;
  onOpenTips?: () => void;
}

export const PoolTypeTabs: React.FC<PoolTypeTabsProps> = ({
  currentFilter,
  onSelectFilter,
  smallPoolCount,
  largePoolCount,
  unpooledCount = 0,
  totalProductCount,
  onOpenTips,
}) => {
  const tabs = [
    {
      id: 'all' as PoolTypeFilter,
      symbol: <Layers className="w-4 h-4 shrink-0" />,
      emoji: '🧺',
      name: 'All Pools',
      count: totalProductCount,
      shortInfo: 'All items',
      badge: 'All',
      color: 'emerald',
    },
    {
      id: 'small' as PoolTypeFilter,
      symbol: <Zap className="w-4 h-4 shrink-0" />,
      emoji: '⚡',
      name: 'Small Pools',
      count: smallPoolCount,
      shortInfo: '3–5 Houses · 20m lock',
      badge: '3–5 Houses',
      color: 'amber',
    },
    {
      id: 'large' as PoolTypeFilter,
      symbol: <Store className="w-4 h-4 shrink-0" />,
      emoji: '🚜',
      name: 'Wholesale',
      count: largePoolCount,
      shortInfo: '15+ Houses · Mandi rates',
      badge: '15+ Houses',
      color: 'green',
    },
    {
      id: 'unpooled' as PoolTypeFilter,
      symbol: <BellRing className="w-4 h-4 shrink-0" />,
      emoji: '🔔',
      name: 'Awaiting',
      count: unpooledCount,
      shortInfo: 'Opt-in alerts',
      badge: 'Alerts',
      color: 'orange',
    },
  ];

  return (
    <div className="w-full mb-3">
      {/* Sleek, compact horizontal segmented strip */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {tabs.map((tab) => {
          const isActive = currentFilter === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectFilter(tab.id)}
              className={`flex-1 min-w-[140px] sm:min-w-0 p-2 sm:p-2.5 rounded-2xl border transition-all text-left flex items-center gap-2.5 cursor-pointer select-none ${
                isActive
                  ? 'bg-[#164E2A] text-white border-[#164E2A] shadow-xs'
                  : 'bg-white hover:bg-[#F2F6F3] text-slate-800 border-slate-200/90 shadow-2xs hover:border-[#CEE2D1]'
              }`}
            >
              {/* Symbol / Icon box */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-black text-xs ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[#E8F4E9] text-[#164E2A]'
                }`}
              >
                {tab.symbol}
              </div>

              {/* Text: Name, Count & Short Info */}
              <div className="min-w-0 flex-1 leading-tight">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-black truncate">{tab.name}</span>
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </div>
                <p
                  className={`text-[10px] font-semibold truncate mt-0.5 ${
                    isActive ? 'text-emerald-100' : 'text-slate-500'
                  }`}
                >
                  {tab.shortInfo}
                </p>
              </div>
            </button>
          );
        })}

        {/* Small Tips (?) Pill Button */}
        {onOpenTips && (
          <button
            type="button"
            onClick={onOpenTips}
            className="shrink-0 flex items-center gap-1 px-2.5 py-2.5 rounded-2xl bg-white hover:bg-amber-50 border border-amber-200 text-[#F27A24] font-black text-xs transition-colors shadow-2xs cursor-pointer"
            title="Difference guide between Small & Wholesale pools"
          >
            <span className="w-4 h-4 rounded-full bg-[#F27A24] text-white flex items-center justify-center text-[10px] font-black">
              ?
            </span>
            <span className="hidden sm:inline text-[11px]">Guide</span>
          </button>
        )}
      </div>
    </div>
  );
};
