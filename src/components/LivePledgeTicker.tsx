import React from 'react';
import { NeighborPledgeEvent } from '../types';
import { Sparkles, Users } from 'lucide-react';

interface LivePledgeTickerProps {
  pledges: NeighborPledgeEvent[];
}

export const LivePledgeTicker: React.FC<LivePledgeTickerProps> = ({ pledges }) => {
  if (pledges.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 mb-6 shadow-xs overflow-hidden">
      <div className="flex items-center gap-2 mb-2 px-1">
        <Users className="w-3.5 h-3.5 text-[#0c831f]" />
        <span className="text-xs font-black text-slate-900 tracking-wider uppercase">
          Live Tower Activity in your Society
        </span>
        <span className="text-[10px] bg-green-100 text-[#0c831f] font-extrabold px-1.5 py-0.2 rounded-full">
          Real-time
        </span>
      </div>

      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {pledges.map((pledge) => (
          <div
            key={pledge.id}
            className="shrink-0 flex items-center gap-2.5 bg-[#f7f9fc] hover:bg-[#eff3f9] border border-slate-200/80 rounded-xl px-3 py-2 text-xs text-slate-700 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#f7d046] text-slate-950 font-black flex items-center justify-center text-xs shadow-2xs">
              {pledge.neighborName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-950">{pledge.neighborName}</span>
                <span className="text-[11px] text-slate-500 font-semibold">({pledge.flat})</span>
                <span className="text-[10px] text-slate-400">• {pledge.timeAgo}</span>
              </div>
              <div className="text-[11px] text-slate-700">
                Pledged <strong className="text-slate-950 font-bold">{pledge.quantityKg} kg</strong> of {pledge.productName}
              </div>
              {pledge.tierUnlocked && (
                <div className="text-[10px] font-black text-[#0c831f] flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3 h-3 text-[#0c831f]" />
                  <span>{pledge.tierUnlocked}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
