import React, { useState } from 'react';
import { Product, PoolNotificationOptIn, NeighborhoodCluster } from '../types';
import {
  X,
  Bell,
  BellRing,
  CheckCircle2,
  Users,
  Sparkles,
  Smartphone,
  MessageSquare,
  Building,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
} from 'lucide-react';

interface NotifyWhenPooledModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  neighborhood: NeighborhoodCluster;
  existingOptIn?: PoolNotificationOptIn;
  onSaveOptIn: (optIn: PoolNotificationOptIn, alsoPledge: boolean) => void;
  onRemoveOptIn?: (productId: string) => void;
}

export const NotifyWhenPooledModal: React.FC<NotifyWhenPooledModalProps> = ({
  isOpen,
  onClose,
  product,
  neighborhood,
  existingOptIn,
  onSaveOptIn,
  onRemoveOptIn,
}) => {
  if (!isOpen || !product) return null;

  const defaultThreshold = product.poolActivationThreshold || 5;
  const currentPledges = product.currentPledgesCount || 0;
  const pledgesRemaining = Math.max(0, defaultThreshold - currentPledges);

  const [thresholdCount, setThresholdCount] = useState<number>(
    existingOptIn?.thresholdCount || defaultThreshold
  );
  const [channel, setChannel] = useState<'whatsapp' | 'sms' | 'in_app'>(
    existingOptIn?.channel || 'whatsapp'
  );
  const [contactInfo, setContactInfo] = useState<string>(
    existingOptIn?.phoneOrFlat || '+91 98450 71290 (Tower C - House 702)'
  );
  const [alsoPledgeNow, setAlsoPledgeNow] = useState<boolean>(!existingOptIn);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const optIn: PoolNotificationOptIn = {
      productId: product.id,
      productName: product.name,
      thresholdCount,
      channel,
      phoneOrFlat: contactInfo.trim() || neighborhood.name,
      optedInAt: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    onSaveOptIn(optIn, alsoPledgeNow);
    onClose();
  };

  const projectedPoolPrice = product.tiers[1]?.pricePerKg || product.basePrice;
  const projectedSavings = product.standardRetailPrice - projectedPoolPrice;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/70 via-white to-green-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F27A24] text-white flex items-center justify-center font-black shadow-xs">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFF5EE] text-[#F27A24] px-2 py-0.5 rounded-md border border-[#F27A24]/30">
                  Pool Alert Opt-In
                </span>
                <span className="text-[10px] text-[#5A6F61] font-bold">
                  {neighborhood.shortName}
                </span>
              </div>
              <h3 className="font-black text-[#164E2A] text-base leading-tight mt-0.5">
                Notify When Pooled
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Product Preview Card */}
          <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-3.5 flex gap-3.5 items-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  {product.unit} · {product.category}
                </span>
                <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                  No Active Pool Yet
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-sm truncate mt-0.5">
                {product.name}
              </h4>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xs font-bold text-slate-400 line-through">
                  Solo: ₹{product.standardRetailPrice}
                </span>
                <span className="text-xs font-black text-[#0c831f]">
                  Pool Target: ~₹{projectedPoolPrice}
                </span>
                <span className="text-[10px] font-black text-amber-900 bg-amber-200/70 px-1.5 py-0.2 rounded">
                  Save ₹{projectedSavings}/{product.unit}
                </span>
              </div>
            </div>
          </div>

          {/* Current Pledge Status & Activation Goal */}
          <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs">
                <Users className="w-4 h-4 text-amber-700" />
                <span>Pledge Count Status</span>
              </div>
              <span className="text-xs font-black text-amber-950">
                {currentPledges} / {defaultThreshold} Pledges
              </span>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full bg-amber-200/70 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-[#0c831f] h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round((currentPledges / defaultThreshold) * 100))}%`,
                }}
              />
            </div>

            <p className="text-[11.5px] text-amber-900 font-medium leading-relaxed">
              {pledgesRemaining > 0 ? (
                <>
                  Need <strong>{pledgesRemaining} more neighbor{pledgesRemaining > 1 ? 's' : ''}</strong> in {neighborhood.shortName} or within 5km to pledge for this pool to automatically activate!
                </>
              ) : (
                <>
                  Threshold reached! This pool is ready to lock.
                </>
              )}
            </p>
          </div>

          <form onSubmit={handleConfirm} className="space-y-4">
            {/* Choose Threshold Trigger */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-900 block text-xs">
                1. When should we alert you?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    count: Math.max(1, defaultThreshold - 2),
                    title: 'Early Alert',
                    subtitle: `At ${Math.max(1, defaultThreshold - 2)} pledges`,
                    desc: 'Be 1st in line',
                  },
                  {
                    count: defaultThreshold,
                    title: 'Pool Activation',
                    subtitle: `At ${defaultThreshold} pledges`,
                    desc: 'Instant unlock',
                    recommended: true,
                  },
                  {
                    count: defaultThreshold + 4,
                    title: 'Wholesale Tier',
                    subtitle: `At ${defaultThreshold + 4} pledges`,
                    desc: 'Max Mandi saving',
                  },
                ].map((tier) => (
                  <button
                    key={tier.count}
                    type="button"
                    onClick={() => setThresholdCount(tier.count)}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer relative ${
                      thresholdCount === tier.count
                        ? 'border-[#0c831f] bg-green-50/70 text-slate-900 shadow-2xs ring-1 ring-green-600/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    {tier.recommended && (
                      <span className="absolute -top-2 right-2 bg-[#0c831f] text-white text-[9px] font-black px-1.5 py-0.2 rounded shadow-xs">
                        Recommended
                      </span>
                    )}
                    <p className="font-black text-xs text-slate-900">{tier.title}</p>
                    <p className="font-extrabold text-[11px] text-[#0c831f]">{tier.subtitle}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{tier.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Notification Channel */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-900 block text-xs">
                2. Notification Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, badge: 'Instant' },
                  { id: 'sms', label: 'SMS Alert', icon: Smartphone, badge: 'Standard' },
                  { id: 'in_app', label: 'Society Notice', icon: Building, badge: 'Lobby Bay' },
                ].map((ch) => {
                  const Icon = ch.icon;
                  const isSelected = channel === ch.id;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setChannel(ch.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        isSelected
                          ? 'border-[#164E2A] bg-[#E8F4E9] text-[#164E2A] font-black ring-1 ring-[#164E2A]/30'
                          : 'border-[#DFEBDE] bg-white text-slate-600 font-bold hover:bg-[#F7F9F6]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#164E2A]' : 'text-slate-400'}`} />
                      <span className="text-xs">{ch.label}</span>
                      <span className="text-[9px] text-[#5A6F61] font-medium">{ch.badge}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact / Delivery Address Details */}
            <div className="space-y-1">
              <label className="font-bold text-[#172A1E] block text-xs">
                Your Contact / House Number for Alert
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="e.g. +91 98450 ••••• or Tower B - House 402"
                className="w-full px-3.5 py-2 rounded-xl border border-[#DFEBDE] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#164E2A] bg-white text-[#172A1E]"
                required
              />
            </div>

            {/* Kickstart Pool Checkbox */}
            <div className="bg-[#F7F9F6] border border-[#DFEBDE] rounded-2xl p-3 flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                id="alsoPledge"
                checked={alsoPledgeNow}
                onChange={(e) => setAlsoPledgeNow(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#164E2A] rounded cursor-pointer shrink-0"
              />
              <label htmlFor="alsoPledge" className="text-xs cursor-pointer select-none">
                <span className="font-black text-[#172A1E] block">
                  Kickstart this pool with my pledge right now (+1 neighbor pledge)
                </span>
                <span className="text-[11px] text-[#5A6F61] font-medium block mt-0.5">
                  Advances the pledge counter from {currentPledges} to {currentPledges + 1}. You only confirm and pay if the pool unlocks!
                </span>
              </label>
            </div>

            {/* Submit & Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              {existingOptIn && onRemoveOptIn ? (
                <button
                  type="button"
                  onClick={() => {
                    onRemoveOptIn(product.id);
                    onClose();
                  }}
                  className="text-xs font-bold text-red-600 hover:text-red-700 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
                >
                  Cancel Notification
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Dismiss
                </button>
              )}

              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#164E2A] hover:bg-[#113E21] text-white font-black text-xs shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BellRing className="w-4 h-4" />
                <span>{existingOptIn ? 'Update Alert' : 'Notify Me When Pooled'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
