import React from 'react';
import { Percent, Truck, Zap, TrendingDown, Sparkles } from 'lucide-react';

interface OffersForYouBannerProps {
  onSelectOffer?: (code: string) => void;
  onOpenRadiusModal?: () => void;
}

export const OffersForYouBanner: React.FC<OffersForYouBannerProps> = ({
  onSelectOffer,
  onOpenRadiusModal,
}) => {
  const offers = [
    {
      id: 'flat50',
      icon: <Percent className="w-5 h-5 text-amber-700" />,
      iconBg: 'bg-amber-100',
      title: 'Enjoy FLAT ₹50 OFF',
      subtitle: 'On your first community pool order above ₹249',
      badge: 'WELCOME50',
      actionText: 'Apply in Cart',
    },
    {
      id: 'freedelivery',
      icon: <Truck className="w-5 h-5 text-emerald-800" />,
      iconBg: 'bg-emerald-100',
      title: 'FREE Doorstep Delivery',
      subtitle: 'On orders ₹399+ delivered directly to your apartment (Saved ₹30)',
      badge: 'FREE ON ₹399+',
      actionText: 'Check Delivery',
      onClick: onOpenRadiusModal,
    },
    {
      id: 'mandiwholesale',
      icon: <TrendingDown className="w-5 h-5 text-orange-700" />,
      iconBg: 'bg-orange-100',
      title: 'Save up to 45% vs Quick Apps',
      subtitle: 'Unlock APMC mandi wholesale rates when 5+ houses pool together',
      badge: 'DIRECT MANDI',
      actionText: 'View Wholesale',
    },
    {
      id: 'quickpool',
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      iconBg: 'bg-amber-50',
      title: '⚡ Small Quick Pools',
      subtitle: 'Dispatched in 22 mins as soon as 15kg is pooled among neighbors',
      badge: '15KG UNLOCK',
      actionText: 'Join Small Pool',
    },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-[#F9C727] via-[#F8C11E] to-[#F5B800] rounded-2xl p-2.5 sm:p-3 shadow-md mb-4 overflow-hidden">
      {/* Header Label: ✦ OFFERS FOR YOU ✦ */}
      <div className="flex items-center justify-center gap-1.5 mb-2.5">
        <span className="text-[11px] font-black tracking-widest uppercase text-slate-900 drop-shadow-2xs flex items-center gap-1">
          <span className="text-slate-800">✦</span>
          <span>OFFERS FOR YOU</span>
          <span className="text-slate-800">✦</span>
        </span>
      </div>

      {/* Horizontal Carousel of Offer Cards */}
      <div className="flex items-stretch gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {offers.map((offer) => (
          <div
            key={offer.id}
            onClick={() => {
              if (offer.onClick) offer.onClick();
              else if (onSelectOffer) onSelectOffer(offer.badge);
            }}
            className="flex-shrink-0 w-[260px] max-w-[82vw] sm:w-[300px] bg-white/95 hover:bg-white rounded-xl p-3 shadow-sm border border-yellow-200/80 flex items-center gap-3 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
          >
            {/* Offer Icon Box */}
            <div
              className={`w-10 h-10 rounded-xl ${offer.iconBg} flex items-center justify-center font-black shrink-0 shadow-2xs`}
            >
              {offer.icon}
            </div>

            {/* Offer Text Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-black text-slate-950 truncate leading-tight">
                  {offer.title}
                </h4>
              </div>
              <p className="text-[10px] text-slate-600 font-medium line-clamp-2 leading-tight mt-0.5">
                {offer.subtitle}
              </p>
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100">
                <span className="text-[9px] font-black uppercase tracking-wider text-[#164E2A] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  {offer.badge}
                </span>
                <span className="text-[10px] font-extrabold text-[#F27A24] hover:underline">
                  {offer.actionText} →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
