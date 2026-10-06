import React, { useState, useEffect } from 'react';
import { Product, PatentedFarm } from '../types';
import { calculateCurrentTier } from '../services/poolEngine';
import {
  ChevronDown,
  Heart,
  Share2,
  Search,
  Truck,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  Sparkles,
  ChevronRight,
  Store,
  Zap,
  Clock,
  Star,
  Leaf,
  X,
  MapPin,
  Calendar,
  Award,
  BadgeCheck,
} from 'lucide-react';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  quantityInCart: number;
  onUpdateCart: (product: Product, newQty: number) => void;
  allProducts?: Product[];
  onSelectProduct?: (product: Product) => void;
  onOpenSearch?: () => void;
  onOpenFarmModal?: (farm: PatentedFarm) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  quantityInCart,
  onUpdateCart,
  allProducts = [],
  onSelectProduct,
  onOpenSearch,
  onOpenFarmModal,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showSourceDetails, setShowSourceDetails] = useState<boolean>(false);
  const [showToastMessage, setShowToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setActiveImageIndex(0);
    setIsFavorite(false);
    setShowSourceDetails(false);
  }, [product?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const tierInfo = calculateCurrentTier(product);
  const savingsAmount = product.standardRetailPrice - tierInfo.currentPrice;
  const isUnpooled = product.hasActivePool === false;

  // Category related items
  const categoryProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 6);

  // Gallery images (the main image + contextual farm/cutting shots)
  const galleryImages = [
    product.image,
    // Add realistic zoom/close-up crop versions
    `${product.image}&auto=format&fit=crop&w=800&q=85`,
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  ];

  const handleShare = async () => {
    const shareText = `Check out fresh ${product.name} on Community Pool for ₹${tierInfo.currentPrice} (MRP ₹${product.standardRetailPrice})!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // Fallback to clipboard
        navigator.clipboard?.writeText(window.location.href);
        triggerToast('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard?.writeText(`${shareText} ${window.location.href}`);
      triggerToast('Product details copied to clipboard!');
    }
  };

  const triggerToast = (msg: string) => {
    setShowToastMessage(msg);
    setTimeout(() => {
      setShowToastMessage(null);
    }, 2400);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Toast popup */}
      {showToastMessage && (
        <div className="fixed top-5 inset-x-0 mx-auto w-fit z-60 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 animate-in slide-in-from-top-3">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{showToastMessage}</span>
        </div>
      )}

      {/* Main Container - Mobile full screen sheet, Desktop sleek dialog */}
      <div className="w-full sm:max-w-md md:max-w-lg bg-[#F4F6FB] h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl shadow-2xl flex flex-col font-sans overflow-hidden relative">
        
        {/* TOP FLOATING OVERLAY BAR (Exact Blinkit Style in User Photo!) */}
        <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-3 sm:p-4 pointer-events-none">
          {/* Circular Down Arrow Back Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-90 pointer-events-auto cursor-pointer"
            aria-label="Back / Close"
          >
            <ChevronDown className="w-6 h-6" />
          </button>

          {/* Right Action Icons: Heart, Search, Share (Exact Blinkit Layout from Photo!) */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                setIsFavorite(!isFavorite);
                triggerToast(!isFavorite ? 'Added to wishlist ❤️' : 'Removed from wishlist');
              }}
              className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-90 cursor-pointer"
              aria-label="Favorite"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-700'
                }`}
              />
            </button>

            {onOpenSearch && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
                className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-90 cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-slate-700" />
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-90 cursor-pointer"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE PRODUCT DETAILS BODY */}
        <div className="flex-1 overflow-y-auto overscroll-contain pb-24">
          
          {/* HERO PRODUCT IMAGE WITH CAROUSEL DOTS (Exact Blinkit Style) */}
          <div className="relative w-full aspect-square bg-[#FAF7F2] flex items-center justify-center overflow-hidden border-b border-slate-200/80">
            <img
              src={galleryImages[activeImageIndex] || product.image}
              alt={product.name}
              className="w-full h-full object-contain p-6 sm:p-8 transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
              }}
            />

            {/* Badges on Hero */}
            <div className="absolute bottom-6 left-4 flex flex-wrap gap-1.5 z-10">
              {product.organicCertified && (
                <span className="bg-[#0c831f] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <Leaf className="w-3 h-3" />
                  <span>ORGANIC CERTIFIED</span>
                </span>
              )}
              {isUnpooled ? (
                <span className="bg-[#F27A24] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>AWAITING POOL PLEDGES</span>
                </span>
              ) : (
                <span className="bg-[#164E2A] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#F27A24] fill-[#F27A24]" />
                  <span>TIER {tierInfo.tierIndex + 1} WHOLESALE POOL</span>
                </span>
              )}
            </div>

            {/* Carousel Indicator Dots (Blinkit Style) */}
            <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`rounded-full transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'w-5 h-2 bg-slate-900'
                      : 'w-2 h-2 bg-slate-400/60 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="p-3.5 sm:p-4 space-y-3.5">
            
            {/* SOURCE / ORIGIN CARD (Exact Blinkit Style from Photo!) */}
            <div className="bg-[#EDF5FD] rounded-2xl p-3.5 border border-[#D5E6F8] flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-9 h-9 rounded-xl bg-white text-[#1E56A0] flex items-center justify-center shrink-0 shadow-2xs">
                  <MapPin className="w-4.5 h-4.5 text-[#1E56A0]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#1E56A0] block">
                    Source Farm & Origin
                  </span>
                  <p className="text-xs sm:text-sm font-black text-slate-900 truncate">
                    {product.patentedFarm ? product.patentedFarm.name : product.farmOrigin}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSourceDetails(!showSourceDetails)}
                className="bg-[#D3E8D7] hover:bg-[#C2DFCA] text-[#0c831f] text-xs font-black px-3 py-1.5 rounded-xl shrink-0 transition-colors cursor-pointer"
              >
                {showSourceDetails ? 'Hide' : 'View details'}
              </button>
            </div>

            {/* Source Details Expanded Box */}
            {showSourceDetails && (
              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2.5 text-xs text-slate-600 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-black text-slate-950 text-xs">Origin & Harvest Traceability</span>
                  <span className="text-[10px] font-bold text-[#0c831f] bg-green-50 px-2 py-0.5 rounded">
                    Direct Farm Gate
                  </span>
                </div>
                <div className="space-y-2 pt-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Where Grown:</span>
                      <span className="text-slate-600">{product.whereGrown || product.farmOrigin}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">When Grown & Harvested:</span>
                      <span className="text-slate-600">{product.whenGrown || product.harvestWindow}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0c831f] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">App Quality Check:</span>
                      <span className="text-slate-600">Zero synthetic chemical carbide, lab tested pesticide-free, delivered in breathable returnable crates.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DEDICATED PATENTED FARM & APP AWARDS BOX */}
            {product.patentedFarm && (
              <div
                onClick={() => {
                  if (onOpenFarmModal && product.patentedFarm) {
                    onOpenFarmModal(product.patentedFarm);
                  }
                }}
                className="bg-gradient-to-br from-emerald-50 via-[#F7FAF7] to-amber-50/70 rounded-2xl p-4 border border-emerald-300 shadow-2xs space-y-3 cursor-pointer hover:border-[#0c831f] hover:shadow-xs transition-all group"
                title="Tap to see full farm story, photo gallery, owner & app awards"
              >
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200/70">
                  <div className="flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-[#0c831f]" />
                    <span className="text-xs font-black text-[#164E2A] uppercase tracking-wide">
                      Patented Bio-Farm Profile
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-700" />
                    <span>App Awarded Farm 🏆</span>
                  </span>
                </div>

                {/* Farm & Owner Intro */}
                <div className="flex items-start gap-3">
                  <img
                    src={product.patentedFarm.owner.avatar}
                    alt={product.patentedFarm.owner.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-600/30 shrink-0 shadow-2xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-black text-slate-950 text-xs sm:text-sm truncate group-hover:text-[#0c831f] transition-colors">
                        {product.patentedFarm.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-600 font-semibold mt-0.5 truncate">
                      Owner: {product.patentedFarm.owner.name} ({product.patentedFarm.owner.experienceYears}y exp)
                    </p>
                    <p className="text-[10px] text-[#0c831f] font-bold">
                      Patent #{product.patentedFarm.patentNumber} • {product.patentedFarm.location}
                    </p>
                  </div>
                </div>

                {/* Awards Summary Box */}
                {product.patentedFarm.awards && product.patentedFarm.awards.length > 0 && (
                  <div className="bg-white/90 rounded-xl p-2.5 border border-amber-200/80 space-y-1.5">
                    <span className="text-[10px] font-black text-amber-950 uppercase tracking-wide block">
                      Awards Given by Our App:
                    </span>
                    <div className="space-y-1">
                      {product.patentedFarm.awards.slice(0, 2).map((aw) => (
                        <div key={aw.id} className="flex items-start gap-1.5 text-[10.5px]">
                          <span className="text-xs shrink-0">{aw.icon}</span>
                          <div className="min-w-0 flex-1">
                            <span className="font-black text-slate-900">{aw.title} ({aw.year}): </span>
                            <span className="text-slate-600">{aw.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action CTA Link */}
                <div className="flex items-center justify-between pt-0.5 text-xs font-black text-[#0c831f]">
                  <span className="flex items-center gap-1 text-[11px]">
                    <BadgeCheck className="w-3.5 h-3.5 text-[#0c831f]" />
                    <span>Verified Regenerative Farm Partner</span>
                  </span>
                  <span className="underline group-hover:text-emerald-800">
                    View Photos, Story & Awards →
                  </span>
                </div>
              </div>
            )}

            {/* MAIN PRODUCT TITLE, UNIT & PRICE CARD (Exact Blinkit Style) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2.5">
              {/* Delivery ETA Pill */}
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                  <Clock className="w-3 h-3 text-[#0c831f]" />
                  <span>Direct Doorstep Batch</span>
                </span>
                <span className="text-[11px] font-bold text-slate-400">•</span>
                <span className="text-[11px] font-bold text-[#0c831f]">
                  Fresh Farm Gate
                </span>
              </div>

              {/* Product Title */}
              <div>
                <h1 className="text-lg sm:text-xl font-black text-slate-950 leading-tight">
                  {product.name}
                </h1>
                {product.hindiName && (
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {product.hindiName}
                  </p>
                )}
              </div>

              {/* Pack Size / Unit */}
              <div className="text-xs sm:text-sm font-bold text-slate-600">
                {product.unit}
              </div>

              {/* Price Row: Bold Final Pool Price + Strikethrough MRP */}
              <div className="flex items-baseline gap-2 pt-1 border-t border-slate-100">
                <span className="text-2xl sm:text-3xl font-black text-slate-950 leading-none">
                  ₹{tierInfo.currentPrice}
                </span>
                <span className="text-sm font-bold text-slate-400 line-through">
                  MRP ₹{product.standardRetailPrice}
                </span>
                {savingsAmount > 0 && (
                  <span className="text-xs font-black text-[#0c831f] bg-green-50 px-2 py-0.5 rounded-md border border-green-200/60">
                    Save ₹{savingsAmount} ({tierInfo.currentDiscountPct}% OFF)
                  </span>
                )}
              </div>

              <p className="text-[10px] text-slate-400 font-medium">
                Inclusive of all taxes • Pooled directly with neighborhood buyers
              </p>
            </div>

            {/* REPLACEMENT / QUALITY ASSURANCE CARD (Exact Blinkit Style from Photo!) */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <span className="text-xs font-black text-slate-900 block leading-tight">
                    48 hours easy replacement
                  </span>
                  <span className="text-[10.5px] text-slate-500 font-medium">
                    100% money back guarantee if not completely fresh
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>

            {/* COMMUNITY POOL TIER PRICING BREAKDOWN */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#0c831f]" />
                  <h3 className="text-xs sm:text-sm font-black text-slate-950">
                    Neighborhood Pool Tiers
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-[#0c831f] bg-green-50 px-2 py-0.5 rounded-full">
                  {product.pledgerCount} Neighbors Joined
                </span>
              </div>

              {/* Tiers List */}
              <div className="space-y-1.5">
                {product.tiers.map((t, idx) => {
                  const isCurrent = idx === tierInfo.tierIndex;
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        isCurrent
                          ? 'bg-[#F7FFF9] border-[#0c831f] ring-1 ring-green-600/20 shadow-2xs'
                          : 'bg-slate-50/70 border-slate-200/80 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                            isCurrent
                              ? 'bg-[#0c831f] text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <span className={`font-black ${isCurrent ? 'text-slate-950' : 'text-slate-700'}`}>
                            {t.label}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-medium">
                            {t.minKg > 0 ? `Unlocks at ${t.minKg} kg pooled` : 'Base pool threshold'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`font-black text-sm block leading-none ${isCurrent ? 'text-[#0c831f]' : 'text-slate-900'}`}>
                          ₹{t.pricePerKg}
                        </span>
                        {t.discountPct > 0 && (
                          <span className="text-[10px] font-extrabold text-[#F27A24]">
                            {t.discountPct}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PRODUCT DESCRIPTION & FRESHNESS DETAILS */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
              <h3 className="text-xs sm:text-sm font-black text-slate-950">
                Product Details
              </h3>

              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {product.description}
              </p>

              {/* Badges Pill Row */}
              {product.badges && product.badges.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {product.badges.map((b, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md"
                    >
                      ✓ {b}
                    </span>
                  ))}
                </div>
              )}

              {/* Key Features Table */}
              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Harvested & Packed:</span>
                  <span className="font-bold text-slate-900">{product.harvestWindow}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Packaging Type:</span>
                  <span className="font-bold text-slate-900">Breathable Eco Farm Crate (Zero Polybag)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Shelf Life & Storage:</span>
                  <span className="font-bold text-slate-900">3–5 Days in cool dry location</span>
                </div>
              </div>
            </div>

            {/* TOP PRODUCTS IN THIS CATEGORY (Exact Blinkit Style from Photo!) */}
            {categoryProducts.length > 0 && (
              <div className="space-y-2.5 pt-1">
                <h3 className="text-xs sm:text-sm font-black text-slate-950 px-1">
                  Top products in this category
                </h3>

                <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                  {categoryProducts.map((catProd) => {
                    const catTier = calculateCurrentTier(catProd);
                    return (
                      <div
                        key={catProd.id}
                        onClick={() => {
                          if (onSelectProduct) onSelectProduct(catProd);
                        }}
                        className="bg-white rounded-2xl p-2.5 border border-slate-200/90 shadow-2xs hover:shadow-xs flex flex-col justify-between w-[130px] sm:w-[140px] shrink-0 transition-all cursor-pointer group"
                      >
                        <div>
                          {/* Image Box */}
                          <div className="w-full aspect-square bg-[#FAF7F2] rounded-xl p-1.5 flex items-center justify-center overflow-hidden mb-2 relative">
                            <img
                              src={catProd.image}
                              alt={catProd.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                            {catProd.organicCertified && (
                              <span className="absolute top-1 left-1 bg-[#0c831f] text-white text-[8px] font-black px-1 rounded">
                                BIO
                              </span>
                            )}
                          </div>

                          {/* Unit */}
                          <span className="text-[9.5px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded truncate block w-fit mb-1">
                            {catProd.unit}
                          </span>

                          {/* Price */}
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs font-black text-slate-950">
                              ₹{catTier.currentPrice}
                            </span>
                            <span className="text-[10px] text-slate-400 line-through">
                              ₹{catProd.standardRetailPrice}
                            </span>
                          </div>

                          {/* Name */}
                          <h4 className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight mt-0.5 group-hover:text-[#0c831f]">
                            {catProd.name}
                          </h4>
                        </div>

                        {/* Add button inside category card */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateCart(catProd, 1);
                            triggerToast(`Added ${catProd.name} to cart!`);
                          }}
                          className="mt-2 w-full py-1 rounded-lg border border-[#0c831f] text-[#0c831f] hover:bg-[#0c831f] hover:text-white font-black text-[10.5px] transition-all cursor-pointer"
                        >
                          + ADD
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STICKY BOTTOM ACTION BAR (Exact Blinkit Layout from Photo!) */}
        <div className="shrink-0 p-3 sm:p-4 bg-white border-t border-slate-200 shadow-xl z-20 flex items-center justify-between gap-3">
          {/* Left Column: Pack Size & Price (Blinkit Style) */}
          <div className="leading-tight">
            <span className="text-xs font-bold text-slate-600 block">
              {product.unit}
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-base sm:text-lg font-black text-slate-950">
                ₹{tierInfo.currentPrice}
              </span>
              <span className="text-xs font-semibold text-slate-400 line-through">
                MRP ₹{product.standardRetailPrice}
              </span>
            </div>
            <span className="text-[9.5px] text-slate-400 font-medium block">
              Inclusive of all taxes
            </span>
          </div>

          {/* Right Column: Add to Cart button or Blinkit Green Stepper */}
          <div className="shrink-0">
            {quantityInCart === 0 ? (
              <button
                type="button"
                onClick={() => {
                  onUpdateCart(product, 1);
                  triggerToast(`Added ${product.name} to cart!`);
                }}
                className="px-6 sm:px-8 py-3 rounded-xl bg-[#0c831f] hover:bg-[#0a6e1a] text-white font-black text-sm shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Add to cart
              </button>
            ) : (
              <div className="flex items-center bg-[#0c831f] text-white rounded-xl p-1 shadow-md border border-green-700">
                <button
                  type="button"
                  onClick={() => onUpdateCart(product, quantityInCart - 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-black/15 text-sm font-black transition-colors cursor-pointer active:scale-90"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4 stroke-[2.5]" />
                </button>
                <span className="text-sm font-black text-white w-8 text-center select-none">
                  {quantityInCart}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateCart(product, quantityInCart + 1)}
                  className="w-8 h-8 rounded-lg text-white flex items-center justify-center hover:bg-black/15 text-sm font-black transition-colors cursor-pointer active:scale-90"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
