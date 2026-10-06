import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  Zap,
  Store,
  Navigation,
  BellRing,
  Truck,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Share2,
  TrendingDown,
  Leaf,
  Layers,
  Clock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { NeighborhoodCluster, UserRadiusLocation } from '../types';
import { CommunityLogo } from './CommunityLogo';

interface TipsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  neighborhood: NeighborhoodCluster;
  userLocation: UserRadiusLocation;
  onOpenRadiusModal: () => void;
  onSimulateNeighborPledge: () => void;
  onOpenInviteModal: () => void;
  onSelectPoolTypeFilter?: (filter: 'all' | 'small' | 'large' | 'unpooled') => void;
}

export const TipsGuideModal: React.FC<TipsGuideModalProps> = ({
  isOpen,
  onClose,
  neighborhood,
  userLocation,
  onOpenRadiusModal,
  onSimulateNeighborPledge,
  onOpenInviteModal,
  onSelectPoolTypeFilter,
}) => {
  const [activeSection, setActiveSection] = useState<
    'all' | 'small_vs_large' | 'radius' | 'notify' | 'delivery_payment' | 'captain'
  >('all');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#164E2A]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overscroll-contain"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#DFEBDE] flex flex-col max-h-[calc(100dvh-1.5rem)] sm:max-h-[90dvh] h-full sm:h-auto my-auto font-sans">
        {/* Modal Header with New Logo - shrink-0 */}
        <div className="shrink-0 p-4 sm:p-5 border-b border-[#DFEBDE] flex items-center justify-between bg-gradient-to-r from-[#E8F4E9] via-white to-[#FFF6F0] z-10">
          <div className="flex items-center gap-3">
            <CommunityLogo size="sm" showTagline={false} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#164E2A] text-white px-2 py-0.5 rounded-md">
                  Community Guide
                </span>
                <span className="text-[10px] text-[#5A6F61] font-bold">
                  {neighborhood.shortName}
                </span>
              </div>
              <h2 className="font-black text-[#164E2A] text-base sm:text-lg leading-tight mt-0.5">
                Buying Pool Tips & Rules
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-[#164E2A] flex items-center justify-center transition-colors cursor-pointer border border-[#DFEBDE]"
            aria-label="Close tips"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Filter Pills - shrink-0 */}
        <div className="shrink-0 px-4 py-2.5 border-b border-[#DFEBDE] bg-[#F7F9F6] flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs z-10">
          {[
            { id: 'all', label: 'All Tips' },
            { id: 'small_vs_large', label: '⚡ Small vs. Large Pools' },
            { id: 'radius', label: '📍 5km Radius Rule' },
            { id: 'notify', label: '🔔 Notify When Pooled' },
            { id: 'delivery_payment', label: '🚚 Delivery & Wallet' },
            { id: 'captain', label: '👤 Society Captain & Stats' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer text-[11px] ${
                activeSection === sec.id
                  ? 'bg-[#164E2A] text-white shadow-2xs'
                  : 'bg-white text-[#5A6F61] border border-[#DFEBDE] hover:bg-[#E8F4E9]'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content Body - min-h-0 prevents push-out */}
        <div className="flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700 overscroll-contain">
          {/* SECTION 1: HOW BUYING POOLS WORK */}
          {(activeSection === 'all' || activeSection === 'small_vs_large') && (
            <div className="bg-[#E8F4E9] border border-[#CEE2D1] rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#164E2A] text-white flex items-center justify-center font-black text-xs">
                  💡
                </span>
                <h3 className="font-black text-sm text-[#164E2A]">
                  How Buying Pools Work
                </h3>
              </div>
              <p className="text-[11.5px] leading-relaxed text-[#172A1E]">
                Instead of paying retail markups and multiple solo delivery fees on quick-commerce apps, neighbors in your society cluster pool their pledges together into bulk harvest crates. As total kg increases, wholesale price tiers unlock automatically!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-center font-bold">
                <div className="bg-white p-2.5 rounded-xl border border-[#CEE2D1]">
                  <p className="text-[#164E2A] font-black text-sm">Step 1</p>
                  <p className="text-[11px] text-[#172A1E] font-extrabold mt-0.5">Pledge or Add Item</p>
                  <p className="text-[10px] text-[#5A6F61]">Pick any active or proposed pool</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#CEE2D1]">
                  <p className="text-[#164E2A] font-black text-sm">Step 2</p>
                  <p className="text-[11px] text-[#172A1E] font-extrabold mt-0.5">Neighbors Join</p>
                  <p className="text-[10px] text-[#5A6F61]">Tier unlocks lower price for everyone</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#CEE2D1]">
                  <p className="text-[#164E2A] font-black text-sm">Step 3</p>
                  <p className="text-[11px] text-[#172A1E] font-extrabold mt-0.5">Consolidated Dispatch</p>
                  <p className="text-[10px] text-[#5A6F61]">Pick-up FREE or Doorstep ₹30</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: SMALL VS LARGE POOLS DIFFERENCE MATRIX */}
          {(activeSection === 'all' || activeSection === 'small_vs_large') && (
            <div className="border border-[#DFEBDE] rounded-2xl p-4 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#164E2A] text-white flex items-center justify-center font-black text-[10px]">
                    VS
                  </span>
                  <h3 className="font-black text-sm text-[#164E2A]">
                    Spot the Difference: Small vs. Large Pools
                  </h3>
                </div>
                <span className="text-[10px] font-black uppercase bg-[#164E2A] text-white px-2 py-0.5 rounded-md">
                  Differential Pricing
                </span>
              </div>

              {/* Table Matrix */}
              <div className="overflow-x-auto rounded-xl border border-[#DFEBDE]">
                <table className="w-full text-left text-[11.5px]">
                  <thead>
                    <tr className="bg-[#F7F9F6] text-[#5A6F61] font-black border-b border-[#DFEBDE]">
                      <th className="p-2.5">Feature</th>
                      <th className="p-2.5 text-[#F27A24] bg-[#FFF6F0]">
                        ⚡ Small Pool (3–5 Houses)
                      </th>
                      <th className="p-2.5 text-[#164E2A] bg-[#E8F4E9]">
                        🚜 Large Pool (15–50+ Houses)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DFEBDE] font-medium">
                    <tr>
                      <td className="p-2.5 font-bold text-[#172A1E]">Neighbors Needed</td>
                      <td className="p-2.5 bg-[#FFF6F0]/70 text-[#172A1E] font-bold">
                        Only 3 to 5 neighboring houses
                      </td>
                      <td className="p-2.5 bg-[#E8F4E9]/70 text-[#164E2A] font-bold">
                        15 to 50+ houses across towers
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-[#172A1E]">Discount vs Retail</td>
                      <td className="p-2.5 bg-[#FFF6F0]/70 text-slate-800">
                        <strong>20% to 32% cheaper</strong> than solo apps
                      </td>
                      <td className="p-2.5 bg-[#E8F4E9]/70 text-slate-800">
                        <strong>40% to 55% cheaper</strong> (Wholesale Mandi)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-[#172A1E]">Turnaround Time</td>
                      <td className="p-2.5 bg-[#FFF6F0]/70 text-[#F27A24] font-bold">
                        Quick 20–30 mins batch locks
                      </td>
                      <td className="p-2.5 bg-[#E8F4E9]/70 text-[#164E2A] font-bold">
                        Scheduled batch (Today 6:00 PM)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-[#172A1E]">Best Suited For</td>
                      <td className="p-2.5 bg-[#FFF6F0]/70 text-slate-700">
                        Urgent dinner veggies, daily milk, bread & eggs
                      </td>
                      <td className="p-2.5 bg-[#E8F4E9]/70 text-slate-700">
                        Weekly pantry stock, 10kg/25kg bags, crate splits
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {onSelectPoolTypeFilter && (
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      onSelectPoolTypeFilter('small');
                      onClose();
                    }}
                    className="flex-1 py-1.5 px-2 bg-[#FFF6F0] hover:bg-[#FFEBDC] text-[#F27A24] border border-[#F27A24]/30 rounded-xl font-black text-[11px] text-center transition-colors cursor-pointer"
                  >
                    View Small Pools Only →
                  </button>
                  <button
                    onClick={() => {
                      onSelectPoolTypeFilter('large');
                      onClose();
                    }}
                    className="flex-1 py-1.5 px-2 bg-[#E8F4E9] hover:bg-[#D9ECD9] text-[#164E2A] border border-[#CEE2D1] rounded-xl font-black text-[11px] text-center transition-colors cursor-pointer"
                  >
                    View Large Pools Only →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: 5KM RADIUS RULE */}
          {(activeSection === 'all' || activeSection === 'radius') && (
            <div className="bg-[#E8F4E9] border border-[#CEE2D1] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-[#439A52]" />
                  <h3 className="font-black text-sm text-[#164E2A]">
                    5.0 km Radius Rule Explained
                  </h3>
                </div>
                <span className="text-[10px] bg-[#CEE2D1] text-[#164E2A] font-black px-2 py-0.5 rounded">
                  Max Radius 5.0 KM
                </span>
              </div>
              <p className="text-[11.5px] leading-relaxed text-[#172A1E]">
                To maximize group purchasing power without delaying delivery routes, all households and societies within a <strong>5.0 km radius corridor</strong> of the distribution hub combine their orders into the same wholesale pool.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-3 rounded-xl border border-[#CEE2D1]">
                <div>
                  <p className="font-black text-[#172A1E] text-xs">
                    Your Current Location: {userLocation.society}
                  </p>
                  <p className="text-[11px] text-[#5A6F61]">
                    {userLocation.distanceKm} km from hub • {userLocation.isWithinRadius ? '✅ Eligible to Pool' : '❌ Outside 5km'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenRadiusModal();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#164E2A] hover:bg-[#113E21] text-white font-black text-xs shadow-2xs transition-colors shrink-0 cursor-pointer"
                >
                  Verify Address Radius
                </button>
              </div>
            </div>
          )}

          {/* SECTION 4: NOTIFY WHEN POOLED */}
          {(activeSection === 'all' || activeSection === 'notify') && (
            <div className="bg-[#FFF6F0] border border-[#F27A24]/30 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-[#F27A24]" />
                <h3 className="font-black text-sm text-[#172A1E]">
                  Notify When Pooled Feature
                </h3>
              </div>
              <p className="text-[11.5px] leading-relaxed text-slate-800">
                Found a product you want that doesn't have an active pool right now? Click <strong>"Notify When Pooled"</strong> on its product card to opt in for alerts.
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-700 list-disc list-inside">
                <li>Choose whether to receive alerts via <strong>WhatsApp, SMS, or In-App</strong>.</li>
                <li>Set your preferred threshold (e.g. notify me when 3 or 5 neighbors have pledged).</li>
                <li>Optionally kickstart the pool with <strong>+1 Pledge</strong> to encourage neighbors to join!</li>
              </ul>
              {onSelectPoolTypeFilter && (
                <button
                  onClick={() => {
                    onSelectPoolTypeFilter('unpooled');
                    onClose();
                  }}
                  className="w-full py-1.5 bg-[#F27A24] hover:bg-[#DE6818] text-white rounded-xl font-bold text-xs transition-colors text-center cursor-pointer shadow-2xs mt-1"
                >
                  Browse Awaiting Pools to Opt-In →
                </button>
              )}
            </div>
          )}

          {/* SECTION 5: DELIVERY & WALLET TIPS */}
          {(activeSection === 'all' || activeSection === 'delivery_payment') && (
            <div className="border border-[#DFEBDE] rounded-2xl p-4 space-y-3 bg-white">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#164E2A]" />
                <h3 className="font-black text-sm text-[#164E2A]">
                  Delivery Modes & Payment Rules
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-[#F7F9F6] p-3 rounded-xl border border-[#DFEBDE] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#172A1E] text-xs">Direct Doorstep Delivery</span>
                    <span className="text-[10px] font-black text-[#164E2A] bg-[#E8F4E9] px-1.5 py-0.2 rounded">
                      FREE on ₹399+
                    </span>
                  </div>
                  <p className="text-[10.5px] text-[#5A6F61]">
                    Delivered directly to your apartment house door. 100% free delivery on all orders ₹399 and above.
                  </p>
                </div>
                <div className="bg-[#F7F9F6] p-3 rounded-xl border border-[#DFEBDE] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#172A1E] text-xs">Orders Below ₹399</span>
                    <span className="text-[10px] font-black text-slate-800 bg-slate-200 px-1.5 py-0.2 rounded">
                      Flat ₹30 Fee
                    </span>
                  </div>
                  <p className="text-[10.5px] text-[#5A6F61]">
                    Orders under ₹399 include a flat ₹30 direct doorstep courier fee.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="bg-[#E8F4E9] p-3 rounded-xl border border-[#CEE2D1] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#164E2A] text-xs flex items-center gap-1">
                      <Wallet className="w-3.5 h-3.5" /> Pool Wallet
                    </span>
                    <span className="text-[10px] font-black text-[#164E2A] bg-white px-1.5 py-0.2 rounded">
                      0 OTP • ₹0 Fee
                    </span>
                  </div>
                  <p className="text-[10.5px] text-[#5A6F61]">
                    One-click checkout without waiting for SMS OTPs. Auto-refunds instant if a pool underfills.
                  </p>
                </div>
                <div className="bg-[#FFF6F0] p-3 rounded-xl border border-[#F27A24]/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#172A1E] text-xs">Cash on Delivery (COD)</span>
                    <span className="text-[10px] font-black text-[#F27A24] bg-white px-1.5 py-0.2 rounded">
                      +₹15 Cash Fee
                    </span>
                  </div>
                  <p className="text-[10.5px] text-[#5A6F61]">
                    Pay in cash at delivery. ₹15 handling charge covers verification and cash handling.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: SOCIETY CAPTAIN & STATS */}
          {(activeSection === 'all' || activeSection === 'captain') && (
            <div className="bg-[#F7F9F6] border border-[#DFEBDE] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#164E2A]" />
                  <h3 className="font-black text-sm text-[#164E2A]">
                    Society Captain & Impact
                  </h3>
                </div>
                <span className="text-[10px] font-black text-[#164E2A] bg-[#E8F4E9] px-2 py-0.5 rounded-full border border-[#CEE2D1]">
                  Verified Society Host
                </span>
              </div>

              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#DFEBDE]">
                <img
                  src={neighborhood.captain.avatar}
                  alt={neighborhood.captain.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#164E2A]"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-[#172A1E]">{neighborhood.captain.name}</p>
                  <p className="text-[11px] text-[#5A6F61]">
                    House {neighborhood.captain.flat} • {neighborhood.captain.completedBatches} batches coordinated
                  </p>
                  <p className="text-[10px] text-[#F27A24] font-extrabold mt-0.5">
                    ★ {neighborhood.captain.rating} Rating • Contact: {neighborhood.captain.phoneMasked}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-[#E8F4E9] p-2.5 rounded-xl border border-[#CEE2D1]">
                  <div className="flex items-center justify-center gap-1 text-[#164E2A] font-black text-base">
                    <TrendingDown className="w-4 h-4" />
                    <span>₹{neighborhood.monthlySavingsInRupees.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[10px] text-[#5A6F61] font-bold">Society Saved This Month</p>
                </div>
                <div className="bg-[#E8F4E9] p-2.5 rounded-xl border border-[#CEE2D1]">
                  <div className="flex items-center justify-center gap-1 text-[#172A1E] font-black text-base">
                    <Leaf className="w-4 h-4 text-[#439A52]" />
                    <span>{neighborhood.co2SavedThisMonthKg} kg</span>
                  </div>
                  <p className="text-[10px] text-[#5A6F61] font-bold">CO2 Emissions Saved</p>
                </div>
              </div>
            </div>
          )}

          {/* SIMULATE & SHARE BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 border-t border-[#DFEBDE]">
            <button
              type="button"
              onClick={() => {
                onSimulateNeighborPledge();
                onClose();
              }}
              className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-[#164E2A] hover:bg-[#113E21] text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F27A24]" />
              <span>Simulate Neighbor Joining Pool</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenInviteModal();
              }}
              className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-white hover:bg-[#F7F9F6] text-[#164E2A] border border-[#DFEBDE] font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#439A52]" />
              <span>Invite Tower via WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#F7F9F6] border-t border-[#DFEBDE] flex items-center justify-between text-xs">
          <span className="text-[11px] text-[#5A6F61] font-medium">
            Got more questions? Tap on <strong className="text-[#164E2A]">?</strong> anytime from the side bar.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#164E2A] hover:bg-[#113E21] text-white font-black text-xs transition-colors cursor-pointer shadow-xs"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
