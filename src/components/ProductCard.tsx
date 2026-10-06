import React from 'react';
import { Product, PoolTypeFilter, PoolNotificationOptIn, PatentedFarm } from '../types';
import { calculateCurrentTier } from '../data/mockData';
import {
  getPoolSummary,
  formatPricePerUnit,
  formatQuantity,
} from '../services/poolEngine';
import {
  Users,
  Sparkles,
  Plus,
  Minus,
  Check,
  MapPin,
  Clock,
  Tag,
  Zap,
  ArrowDown,
  Store,
  Bell,
  BellRing,
  AlertCircle,
  HelpCircle,
  Leaf,
  Award,
  Calendar,
  BadgeCheck,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onUpdateCart: (product: Product, newQty: number) => void;
  onPledgeDirect: (product: Product, addedKg: number) => void;
  onOpenDetail?: (product: Product) => void;
  onOpenFarmModal?: (farm: PatentedFarm) => void;
  poolTypeFilter?: PoolTypeFilter;
  isNotified?: boolean;
  notificationOptIn?: PoolNotificationOptIn;
  onOpenNotifyModal?: (product: Product) => void;
  onPledgeToActivate?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onUpdateCart,
  onPledgeDirect,
  onOpenDetail,
  onOpenFarmModal,
  poolTypeFilter = 'all',
  isNotified = false,
  notificationOptIn,
  onOpenNotifyModal,
  onPledgeToActivate,
}) => {
  const summary = getPoolSummary(product);
  const { tierIndex, currentPrice, currentDiscountPct, nextTier, progressPct } =
    calculateCurrentTier(product);

  const smallPoolPrice = product.tiers[1]?.pricePerKg || currentPrice;
  const wholesalePrice = product.tiers[product.tiers.length - 1]?.pricePerKg || currentPrice;
  const smallPoolSavings = product.standardRetailPrice - smallPoolPrice;
  const wholesaleSavings = product.standardRetailPrice - wholesalePrice;
  const soloSavings = product.standardRetailPrice - currentPrice;

  // Selected display price based on the active tab
  const displayPrice =
    poolTypeFilter === 'small'
      ? smallPoolPrice
      : poolTypeFilter === 'large'
      ? wholesalePrice
      : currentPrice;

  const displaySavings =
    poolTypeFilter === 'small'
      ? smallPoolSavings
      : poolTypeFilter === 'large'
      ? wholesaleSavings
      : soloSavings;

  // For unpooled products
  const isUnpooled = product.hasActivePool === false;
  const activationThreshold = product.poolActivationThreshold || 5;
  const currentPledges = product.currentPledgesCount || 0;
  const pledgesNeeded = Math.max(0, activationThreshold - currentPledges);
  const pledgeProgressPct = Math.min(100, Math.round((currentPledges / activationThreshold) * 100));
  const unpooledProjectedPrice = product.tiers[1]?.pricePerKg || product.basePrice;
  const unpooledProjectedSavings = product.standardRetailPrice - unpooledProjectedPrice;

  return (
    <div
      className={`group bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden relative p-3 ${
        isUnpooled
          ? isNotified
            ? 'border-[#F27A24] bg-[#FFF8F4] shadow-xs ring-1 ring-[#F27A24]/40'
            : 'border-[#DFEBDE] shadow-2xs hover:border-[#F27A24] hover:shadow-md'
          : poolTypeFilter === 'small'
          ? 'border-[#FFE3D0] hover:border-[#F27A24] hover:shadow-md'
          : poolTypeFilter === 'large'
          ? 'border-[#CEE2D1] hover:border-[#164E2A] hover:shadow-md'
          : 'border-[#DFEBDE] shadow-2xs hover:border-[#439A52] hover:shadow-md'
      }`}
    >
      {/* Top Media Container */}
      <div
        onClick={() => onOpenDetail && onOpenDetail(product)}
        className="relative h-44 w-full bg-[#F7F9F6] rounded-xl overflow-hidden flex items-center justify-center cursor-pointer"
        title="Tap to view product description & details"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Dynamic Pool Badge based on active tab / pooled state */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 max-w-[70%]">
          {isUnpooled ? (
            <span className="bg-[#164E2A] text-[#F27A24] text-[9.5px] sm:text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs tracking-wide truncate">
              <Clock className="w-3 h-3 text-[#F27A24] shrink-0" />
              <span className="truncate">AWAITING POOL</span>
            </span>
          ) : poolTypeFilter === 'small' ? (
            <span className="bg-[#F27A24] text-white text-[9.5px] sm:text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs tracking-wide truncate">
              <Zap className="w-3 h-3 fill-white shrink-0" />
              <span className="truncate">SMALL POOL (3–5 HOUSES)</span>
            </span>
          ) : poolTypeFilter === 'large' ? (
            <span className="bg-[#164E2A] text-white text-[9.5px] sm:text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs tracking-wide truncate">
              <Store className="w-3 h-3 fill-white shrink-0" />
              <span className="truncate">WHOLESALE (15+ HOUSES)</span>
            </span>
          ) : (
            <span className="bg-[#164E2A] text-white text-[9.5px] sm:text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs tracking-wide truncate">
              <Zap className="w-3 h-3 fill-[#F27A24] text-[#F27A24] shrink-0" />
              <span className="truncate">
                {product.poolType === 'small'
                  ? 'SMALL POOL'
                  : product.poolType === 'large'
                  ? 'LARGE POOL'
                  : 'SOCIETY POOL'}
              </span>
            </span>
          )}

          {product.organicCertified && (
            <span className="bg-[#439A52] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-md shadow-xs self-start">
              ORGANIC
            </span>
          )}
        </div>

        {/* Right Corner Badge (Discount or Alert Tag) */}
        <div className="absolute top-2 right-2 shrink-0">
          {isUnpooled ? (
            isNotified ? (
              <span className="bg-[#F27A24] text-white text-[9.5px] sm:text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                <BellRing className="w-3 h-3 shrink-0" />
                <span>Alert On</span>
              </span>
            ) : (
              <span className="bg-[#164E2A]/90 backdrop-blur-xs text-[#F27A24] text-[9.5px] sm:text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                <span>Unlock ~{Math.round((unpooledProjectedSavings / product.standardRetailPrice) * 100)}%</span>
              </span>
            )
          ) : (
            <span
              className={`text-white text-[9.5px] sm:text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 ${
                poolTypeFilter === 'small' ? 'bg-[#F27A24]' : 'bg-[#164E2A]'
              }`}
            >
              {poolTypeFilter === 'small'
                ? `${Math.round((smallPoolSavings / product.standardRetailPrice) * 100)}% OFF`
                : poolTypeFilter === 'large'
                ? `${product.tiers[product.tiers.length - 1].discountPct}% OFF`
                : `${currentDiscountPct}% OFF`}
            </span>
          )}
        </div>

        {/* Bottom Pledger Count on Image (Unit-aware) */}
        <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] text-white bg-[#164E2A]/85 backdrop-blur-xs px-2 py-0.5 rounded-md min-w-0 overflow-hidden">
          {isUnpooled ? (
            <span className="flex items-center gap-1 truncate text-[#FFE3D0] font-bold min-w-0 pr-1">
              <Users className="w-3 h-3 text-[#F27A24] shrink-0" />
              <span className="truncate">{currentPledges} neighbors pledged</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 truncate text-emerald-100 font-medium min-w-0 pr-1">
              <Users className="w-3 h-3 text-[#439A52] shrink-0" />
              <span className="truncate">{summary.participantCount} neighbors pooling</span>
            </span>
          )}
          <span className="text-[#F27A24] font-black shrink-0 ml-1">
            {isUnpooled ? `${activationThreshold} needed` : summary.formattedQuantity}
          </span>
        </div>
      </div>

      {/* Body Details */}
      <div className="pt-2 flex-1 flex flex-col justify-between space-y-2 min-w-0 overflow-hidden">
        <div
          onClick={() => onOpenDetail && onOpenDetail(product)}
          className="min-w-0 cursor-pointer"
          title="Tap to view product description & details"
        >
          {/* Unit / Weight Tag */}
          <div className="flex items-center justify-between text-[11px] text-[#5A6F61] font-semibold min-w-0">
            <span className="truncate">{product.unit}</span>
            <span className="text-[10px] text-slate-400 truncate max-w-[110px] ml-1 shrink-0">
              {product.farmOrigin.split(',')[0]}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-extrabold text-[#172A1E] text-xs sm:text-sm leading-snug line-clamp-1 group-hover:text-[#164E2A] transition-colors mt-0.5">
            {product.name}
          </h3>
          {product.hindiName && (
            <p className="text-[10.5px] text-[#8CA091] font-medium truncate">{product.hindiName}</p>
          )}

          {/* Where & When Grown Sub-info */}
          {(product.whereGrown || product.whenGrown) && (
            <div className="mt-1 space-y-0.5 text-[9.5px] text-[#486350] font-semibold">
              {product.whereGrown && (
                <div className="flex items-center gap-1 truncate" title={`Grown at: ${product.whereGrown}`}>
                  <MapPin className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                  <span className="truncate"><strong>Where:</strong> {product.whereGrown.split('(')[0]}</span>
                </div>
              )}
              {product.whenGrown && (
                <div className="flex items-center gap-1 truncate text-slate-500 font-medium" title={`Harvest schedule: ${product.whenGrown}`}>
                  <Calendar className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                  <span className="truncate"><strong>When:</strong> {product.whenGrown}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* INTERACTIVE SMALL BOX: PATENTED FARM, OWNER & APP AWARDS */}
        {product.patentedFarm && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenFarmModal && product.patentedFarm) {
                onOpenFarmModal(product.patentedFarm);
              }
            }}
            className="bg-gradient-to-br from-emerald-50/95 via-[#F1F8F2] to-amber-50/80 border border-emerald-300/80 hover:border-[#0c831f] p-2 rounded-xl text-left cursor-pointer transition-all hover:shadow-xs group/farm relative overflow-hidden"
            title="Tap to see farm description, photos, owner & app awards"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px] uppercase font-black tracking-wider text-[#164E2A] flex items-center gap-1">
                <Leaf className="w-2.5 h-2.5 text-[#0c831f] shrink-0" />
                <span className="truncate">Patented Bio-Farm</span>
              </span>
              <span className="text-[8.5px] font-black text-amber-900 bg-amber-100/90 border border-amber-300/70 px-1.5 py-0.2 rounded-md flex items-center gap-0.5 shrink-0 shadow-2xs">
                <Award className="w-2.5 h-2.5 text-amber-700 shrink-0" />
                <span>App Awarded 🏆</span>
              </span>
            </div>

            <div className="mt-1 flex items-center gap-2">
              <img
                src={product.patentedFarm.owner.avatar}
                alt={product.patentedFarm.owner.name}
                className="w-5 h-5 rounded-full object-cover border border-emerald-600/40 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-[10.5px] font-black text-slate-950 truncate leading-tight group-hover/farm:text-[#0c831f] transition-colors">
                  {product.patentedFarm.name}
                </p>
                <p className="text-[9px] text-slate-500 font-medium truncate">
                  {product.patentedFarm.owner.name} • {product.patentedFarm.owner.experienceYears}y exp
                </p>
              </div>
            </div>

            <div className="mt-1 pt-1 border-t border-emerald-200/60 flex items-center justify-between text-[9px]">
              <span className="text-slate-500 font-bold truncate">
                📜 #{product.patentedFarm.patentNumber}
              </span>
              <span className="text-[#0c831f] font-black shrink-0 underline ml-1 group-hover/farm:text-emerald-800">
                View Farm Story & Awards →
              </span>
            </div>
          </div>
        )}

        {/* COMPACT POOL PRICING SECTION */}
        {isUnpooled ? (
          /* UNPOOLED PRODUCT COMPACT POOL PRICING */
          <div
            onClick={() => onOpenDetail && onOpenDetail(product)}
            className="bg-[#FFF8F4] border border-[#F27A24]/30 rounded-xl p-2 sm:p-2.5 space-y-1 overflow-hidden min-w-0 cursor-pointer"
            title="Tap to view pool pricing & details"
          >
            <div className="flex items-center justify-between gap-1 overflow-hidden min-w-0">
              <span className="text-[9px] sm:text-[10px] font-black tracking-wider uppercase text-[#F27A24] shrink-0">
                POOL PRICING
              </span>
              <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-500 truncate text-right">
                {currentPledges} / {activationThreshold} houses
              </span>
            </div>

            {/* Dominant Current Price */}
            <div className="min-w-0">
              <div className="flex items-baseline gap-1 min-w-0 overflow-hidden">
                <span className="text-sm sm:text-base font-black text-[#172A1E] leading-none truncate">
                  {formatPricePerUnit(product.standardRetailPrice, summary.unit)}
                </span>
              </div>
              <p className="text-[9px] sm:text-[9.5px] font-semibold text-slate-500 mt-0.5 truncate">
                Current solo price
              </p>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full bg-[#FFEADA] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#F27A24] transition-all duration-300"
                style={{ width: `${pledgeProgressPct}%` }}
              />
            </div>

            {/* Next Tier Unlock & Savings Information */}
            <div className="pt-0.5 leading-tight space-y-0.5 overflow-hidden min-w-0">
              <p className="text-[9.5px] sm:text-[10.5px] font-black text-[#F27A24] truncate">
                {pledgesNeeded > 0
                  ? `${pledgesNeeded} more ${pledgesNeeded === 1 ? 'house' : 'houses'} → unlock ${formatPricePerUnit(unpooledProjectedPrice, summary.unit)}`
                  : `Ready to unlock ${formatPricePerUnit(unpooledProjectedPrice, summary.unit)}!`}
              </p>
              <p className="text-[9px] sm:text-[9.5px] font-bold text-[#164E2A] truncate">
                Save {formatPricePerUnit(unpooledProjectedSavings, summary.unit)} at {activationThreshold}+ houses
              </p>
            </div>
          </div>
        ) : (
          /* ACTIVE PRODUCT COMPACT POOL PRICING (UNIT-AWARE) */
          <div
            onClick={() => onOpenDetail && onOpenDetail(product)}
            className="bg-[#F7F9F6] border border-[#DFEBDE] rounded-xl p-2 sm:p-2.5 space-y-1 overflow-hidden min-w-0 cursor-pointer"
            title="Tap to view pool pricing & details"
          >
            <div className="flex items-center justify-between gap-1 overflow-hidden min-w-0">
              <span className="text-[9px] sm:text-[10px] font-black tracking-wider uppercase text-[#164E2A] shrink-0">
                POOL PRICING
              </span>
              <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-600 truncate text-right">
                {summary.participantCount} houses • {summary.formattedQuantity}
              </span>
            </div>

            {/* Dominant Current Price */}
            <div className="min-w-0">
              <div className="flex items-baseline gap-1 min-w-0 overflow-hidden">
                <span className="text-sm sm:text-base font-black text-[#164E2A] leading-none truncate">
                  {summary.formattedCurrentPrice}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 line-through font-medium shrink-0 ml-1">
                  {formatPricePerUnit(summary.normalPrice, summary.unit)}
                </span>
              </div>
              <p className="text-[9px] sm:text-[9.5px] font-semibold text-[#5A6F61] mt-0.5 truncate">
                Current pool price
              </p>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full bg-[#DFEBDE] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#164E2A] transition-all duration-300"
                style={{ width: `${summary.progressPercent}%` }}
              />
            </div>

            {/* Next Tier Unlock & Savings Information */}
            <div className="pt-0.5 leading-tight space-y-0.5 overflow-hidden min-w-0">
              {summary.nextTierQuantity !== null ? (
                <>
                  <p className="text-[9.5px] sm:text-[10.5px] font-black text-[#F27A24] truncate">
                    {summary.formattedRemaining} more → unlock {formatPricePerUnit(summary.nextTierPrice!, summary.unit)}
                  </p>
                  <p className="text-[9px] sm:text-[9.5px] font-bold text-[#164E2A] truncate">
                    Save {formatPricePerUnit(summary.normalPrice - summary.nextTierPrice!, summary.unit)} at {summary.nextTierQuantity} {summary.unit}+
                  </p>
                </>
              ) : (
                <p className="text-[9px] sm:text-[9.5px] font-black text-[#164E2A] truncate">
                  ✓ Max Wholesale Tier Unlocked! (Save {summary.formattedSavingsPerUnit})
                </p>
              )}
            </div>
          </div>
        )}

        {/* BOTTOM ACTION ROW */}
        {isUnpooled ? (
          /* UNPOOLED ACTION ROW: NOTIFY WHEN POOLED + PLEDGE BUTTON */
          <div className="pt-1.5 border-t border-slate-100 space-y-1.5 min-w-0 overflow-hidden">
            <div className="flex items-center justify-between gap-1 min-w-0">
              <div className="flex items-baseline gap-1 min-w-0 truncate">
                <span className="text-xs sm:text-sm font-black text-[#172A1E] truncate">
                  ~{formatPricePerUnit(unpooledProjectedPrice, summary.unit)}
                </span>
                <span className="text-[10px] font-bold text-slate-400 line-through shrink-0">
                  {formatPricePerUnit(product.standardRetailPrice, summary.unit)}
                </span>
              </div>
              <span className="text-[8.5px] sm:text-[9px] font-black text-[#F27A24] bg-[#FFEBDC] px-1.5 py-0.2 rounded shrink-0 truncate">
                Save {formatPricePerUnit(unpooledProjectedSavings, summary.unit)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 min-w-0">
              {/* PRIMARY ACTION: NOTIFY WHEN POOLED */}
              <button
                type="button"
                onClick={() => onOpenNotifyModal && onOpenNotifyModal(product)}
                className="flex-1 min-w-0 py-1.5 px-2 rounded-lg font-black text-[10px] sm:text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-2xs bg-[#F27A24] hover:bg-[#DE6818] text-white border border-[#F27A24] truncate"
                title="Get notified when pledge threshold is hit"
              >
                {isNotified ? (
                  <>
                    <BellRing className="w-3 h-3 fill-white shrink-0" />
                    <span className="truncate">Alert Set</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-3 h-3 shrink-0" />
                    <span className="truncate">Notify Me</span>
                  </>
                )}
              </button>

              {/* SECONDARY ACTION: PLEDGE TO ADVANCE COUNTER */}
              <button
                type="button"
                onClick={() => onPledgeToActivate && onPledgeToActivate(product)}
                className="py-1.5 px-2 rounded-lg font-bold text-[10px] sm:text-[11px] border border-[#DFEBDE] hover:border-[#164E2A] bg-white hover:bg-[#E8F4E9] text-[#164E2A] transition-all flex items-center justify-center gap-0.5 cursor-pointer active:scale-95 shrink-0"
                title="Pledge +1 to count towards activating this pool"
              >
                <Plus className="w-3 h-3 text-[#164E2A]" />
                <span>+1</span>
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE PRODUCT ACTION ROW: PRICING & CART BUTTON */
          <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-100 min-w-0 overflow-hidden">
            {/* Price Column: Strictly bounded, never causes button to wrap or push out */}
            <div className="min-w-0 flex-1 overflow-hidden pr-1">
              <div className="flex items-baseline gap-1 min-w-0 overflow-hidden">
                <span
                  className={`text-xs sm:text-sm font-black truncate leading-tight ${
                    poolTypeFilter === 'small' ? 'text-[#F27A24]' : 'text-[#172A1E]'
                  }`}
                >
                  {formatPricePerUnit(displayPrice, summary.unit)}
                </span>
                <span className="text-[9.5px] sm:text-[10px] text-slate-400 line-through shrink-0">
                  {formatPricePerUnit(summary.normalPrice, summary.unit)}
                </span>
              </div>
              <span
                className={`text-[8.5px] sm:text-[9.5px] font-bold block truncate leading-none mt-0.5 ${
                  poolTypeFilter === 'small' ? 'text-[#F27A24]' : 'text-[#164E2A]'
                }`}
              >
                Save {formatPricePerUnit(displaySavings, summary.unit)} vs Solo
              </span>
            </div>

            {/* Quick ADD / QTY Toggle Button (Strictly sized, never overflows) */}
            <div className="shrink-0 flex items-center justify-end">
              {quantityInCart > 0 ? (
                <div className="flex items-center bg-[#164E2A] text-white rounded-lg p-0.5 shadow-2xs shrink-0">
                  <button
                    type="button"
                    onClick={() => onUpdateCart(product, quantityInCart - 1)}
                    className="w-5.5 h-5.5 sm:w-6 sm:h-6 flex items-center justify-center text-white hover:bg-black/20 rounded font-black transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-black text-white px-1 sm:px-1.5 min-w-[14px] text-center select-none">
                    {quantityInCart}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateCart(product, quantityInCart + 1)}
                    className="w-5.5 h-5.5 sm:w-6 sm:h-6 flex items-center justify-center text-white hover:bg-black/20 rounded font-black transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onUpdateCart(product, 1)}
                  className={`font-black text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg uppercase tracking-wider shadow-2xs transition-all active:scale-95 flex items-center justify-center cursor-pointer shrink-0 ${
                    poolTypeFilter === 'small'
                      ? 'border border-[#F27A24] text-[#F27A24] bg-[#FFF8F4] hover:bg-[#F27A24] hover:text-white'
                      : 'border border-[#164E2A] text-[#164E2A] bg-[#E8F4E9] hover:bg-[#164E2A] hover:text-white'
                  }`}
                >
                  <span>ADD</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

