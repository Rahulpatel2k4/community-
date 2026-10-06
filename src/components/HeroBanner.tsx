import React from 'react';
import { NeighborhoodCluster, UserRadiusLocation } from '../types';
import { Users, Leaf, ArrowRight, ShieldCheck, Share2, Sparkles, TrendingDown, Clock, Zap, Navigation, Building } from 'lucide-react';

interface HeroBannerProps {
  neighborhood: NeighborhoodCluster;
  userLocation: UserRadiusLocation;
  onOpenRadiusModal: () => void;
  onSimulateNeighborPledge: () => void;
  onOpenInviteModal: () => void;
  onViewSchedule: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  neighborhood,
  userLocation,
  onOpenRadiusModal,
  onSimulateNeighborPledge,
  onOpenInviteModal,
  onViewSchedule,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#f7d046] via-[#f7d046] to-amber-300 text-slate-950 border border-yellow-300 shadow-md mb-6 p-6 sm:p-7">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/30 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 -mb-20 w-60 h-60 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-black tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-[#f7d046] animate-pulse" />
              COMMUNITY POOL ACTIVE
            </span>

            {/* 5km Radius Chip */}
            <button
              onClick={onOpenRadiusModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-slate-950 border border-yellow-400 text-xs font-black shadow-2xs hover:bg-white transition-all cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-[#0c831f]" />
              <span>5km Radius Pooling Active</span>
              <span className="text-[10px] bg-green-100 text-[#0c831f] px-1.5 py-0.2 rounded font-extrabold">
                {userLocation.distanceKm} km away
              </span>
            </button>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/80 text-[#0c831f] border border-green-200 text-xs font-extrabold shadow-2xs">
              <Clock className="w-3.5 h-3.5" /> Next Batch Locks 6:00 PM
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/80 text-slate-900 text-xs font-bold">
              <Leaf className="w-3.5 h-3.5 text-[#0c831f]" /> Pick-up FREE • Doorstep ₹30
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-slate-950">
            Buy Together with Neighbors. <br className="hidden sm:inline" />
            <span className="text-[#0c831f]">
              Unlock 30% to 50% Bulk Discounts.
            </span>
          </h1>

          <p className="text-slate-800 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
            Users within a <strong className="text-slate-950">5 km radius</strong> can join pools and group orders into a single consolidated electric mini-van delivery corridor. Farm-gate prices on vegetables, fruits, and staples for {neighborhood.name} and neighboring societies.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={onSimulateNeighborPledge}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#f7d046]" />
              <span>Simulate Neighbor Joining Pool</span>
            </button>

            <button
              onClick={onOpenRadiusModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0c831f] hover:bg-[#0a6e1a] text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
            >
              <Navigation className="w-4 h-4 text-[#f7d046]" />
              <span>5km Radius Checker</span>
            </button>

            <button
              onClick={onOpenInviteModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-xs font-bold transition-colors shadow-2xs"
            >
              <Share2 className="w-4 h-4 text-[#0c831f]" />
              <span>Invite Tower WhatsApp</span>
            </button>

            <button
              onClick={onViewSchedule}
              className="inline-flex items-center gap-1 text-xs font-black text-[#0c831f] hover:text-green-900 underline underline-offset-4 ml-1"
            >
              <span>See Eco-Delivery Route</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Community Captain & Society Card */}
        <div className="lg:col-span-4 bg-white/95 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-md border border-yellow-200 backdrop-blur-xs">
          {/* Captain Spotlight */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <img
              src={neighborhood.captain.avatar}
              alt={neighborhood.captain.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#0c831f]"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-slate-900 truncate">{neighborhood.captain.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-green-100 text-[#0c831f] font-black uppercase">
                  Captain
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {neighborhood.captain.flat} • {neighborhood.captain.completedBatches} batches coordinated
              </p>
              <p className="text-[10px] text-amber-600 font-bold flex items-center gap-1 mt-0.5">
                ★ {neighborhood.captain.rating} Rating • Verified Host
              </p>
            </div>
          </div>

          {/* 5km Radius Cluster Info */}
          <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/80 text-xs space-y-1">
            <div className="flex items-center justify-between text-[11px] font-black text-[#0c831f]">
              <span className="flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5" />
                <span>5.0 km Hub Network</span>
              </span>
              <span>{neighborhood.nearbySocietiesInRadius.length + 1} Societies Pool</span>
            </div>
            <p className="text-[10.5px] text-emerald-950 font-medium leading-tight">
              Anyone within 5km radius can join to unlock society & farm wholesale tiers together.
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-[#f7f9fc] p-2.5 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-center gap-1 text-[#0c831f] font-black text-lg">
                <TrendingDown className="w-4 h-4" />
                <span>₹{neighborhood.monthlySavingsInRupees.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold">Society Saved This Month</p>
            </div>

            <div className="bg-[#f7f9fc] p-2.5 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-center gap-1 text-slate-900 font-black text-lg">
                <Leaf className="w-4 h-4 text-[#0c831f]" />
                <span>{neighborhood.co2SavedThisMonthKg} kg</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold">CO2 Emissions Saved</p>
            </div>
          </div>

          {/* Community Trust Seal */}
          <div className="flex items-center gap-2 text-[11px] text-slate-700 bg-green-50/70 border border-green-200/80 p-2 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-[#0c831f] shrink-0" />
            <span>Guaranteed fresh farm quality or instant 100% refund.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

