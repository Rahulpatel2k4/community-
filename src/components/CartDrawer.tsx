import React, { useState } from 'react';
import {
  CartItem,
  DeliverySlotOption,
  NeighborhoodCluster,
  PoolWindow,
  UserRadiusLocation,
  PaymentMethod,
  Product,
} from '../types';
import {
  calculateCurrentTier,
  DOORSTEP_DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  COD_HANDLING_FEE,
  POOL_WINDOWS,
  INITIAL_PRODUCTS,
} from '../data/mockData';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  Truck,
  Check,
  ArrowRight,
  ArrowLeft,
  Home,
  Clock,
  CreditCard,
  Wallet,
  Banknote,
  Star,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  allProducts?: Product[];
  onAddToCart?: (product: Product) => void;
  onOpenProductDetail?: (product: Product) => void;
  neighborhood: NeighborhoodCluster;
  userLocation: UserRadiusLocation;
  onOpenRadiusModal: () => void;
  deliverySlots: DeliverySlotOption[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  walletBalance: number;
  onOpenWallet: () => void;
  onProceedToCheckout: (
    slotId: string,
    deliveryMode: 'pickup' | 'doorstep',
    pickupLocationId?: string,
    flatAddress?: string,
    selectedPoolWindowId?: string,
    paymentMethod?: PaymentMethod,
    codFee?: number
  ) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  allProducts,
  onAddToCart,
  onOpenProductDetail,
  neighborhood,
  userLocation,
  onOpenRadiusModal,
  deliverySlots,
  onUpdateQuantity,
  onClearCart,
  walletBalance,
  onOpenWallet,
  onProceedToCheckout,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string>(deliverySlots[0]?.id || 'slot-evening');
  const deliveryMode = 'doorstep' as const;
  const [flatNumber, setFlatNumber] = useState<string>(userLocation.address || 'Tower A - House 402');
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [selectedPoolWindowId, setSelectedPoolWindowId] = useState<string>('small_quick');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wallet');

  if (!isOpen) return null;

  // Compute pricing totals
  let standardRetailTotal = 0;
  let communityUnlockedTotal = 0;

  items.forEach((item) => {
    const tierInfo = calculateCurrentTier(item.product);
    standardRetailTotal += item.product.standardRetailPrice * item.quantity;
    communityUnlockedTotal += tierInfo.currentPrice * item.quantity;
  });

  // Solo individual buying fees on quick-commerce apps
  const soloDeliveryFee = 35;
  const soloHandlingFee = 15;
  const totalSoloRetailCost = standardRetailTotal + soloDeliveryFee + soloHandlingFee;

  // Doorstep Delivery System:
  // Orders >= ₹399 are FREE delivery; below ₹399 is charged flat ₹30
  const isEligibleForFreeDelivery = communityUnlockedTotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = isEligibleForFreeDelivery ? 0 : DOORSTEP_DELIVERY_FEE;
  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - communityUnlockedTotal);
  const freeDeliveryProgress = Math.min(100, Math.round((communityUnlockedTotal / FREE_DELIVERY_THRESHOLD) * 100));

  const codFee = paymentMethod === 'cod' ? COD_HANDLING_FEE : 0;
  const finalPayable = communityUnlockedTotal + deliveryFee + codFee;

  // Projected savings comparisons
  const directGrocerySavings = standardRetailTotal - communityUnlockedTotal;
  const projectedNetSavings = totalSoloRetailCost - finalPayable;

  // Recommendations for "Frequently Bought Together" (Clearly separate from cart)
  const productCatalog = allProducts && allProducts.length > 0 ? allProducts : INITIAL_PRODUCTS;
  const recommendations = productCatalog
    .filter((p) => !items.some((it) => it.product.id === p.id))
    .slice(0, 8);

  const handleQuickAdd = (product: Product) => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      onUpdateQuantity(product.id, 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-8 h-full h-dvh">
        <div className="w-full sm:w-[480px] max-w-full bg-[#f4f6fb] shadow-2xl flex flex-col h-full h-dvh max-h-screen sm:max-h-dvh font-sans overflow-hidden">
          
          {/* BLINKIT-STYLE CLEAN HEADER */}
          <div className="shrink-0 px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-200 flex items-center justify-between bg-white text-slate-900 z-10 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="p-2 -ml-1 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Back to store"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight leading-none">
                    My Cart
                  </h2>
                  <span className="text-xs font-black bg-[#E8F4E9] text-[#0c831f] px-2 py-0.5 rounded-full border border-green-200">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold truncate max-w-[210px] mt-0.5">
                  Direct Doorstep Delivery • {neighborhood.shortName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg hover:bg-red-50 cursor-pointer"
                  title="Clear all cart items"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* DRAWER SCROLLABLE BODY */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-[#f4f6fb] overscroll-contain">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
                <div className="w-20 h-20 rounded-2xl bg-emerald-50 text-[#0c831f] flex items-center justify-center mx-auto border border-emerald-200 shadow-2xs">
                  <ShoppingBag className="w-10 h-10 text-[#0c831f]" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto font-medium leading-relaxed">
                    Add farm-fresh vegetables, fruits, staples, or dairy from the catalog to unlock wholesale neighborhood pool pricing!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-[#0c831f] hover:bg-[#0a6e1a] text-white font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Browse Fresh Catalog
                </button>
              </div>
            ) : (
              <>
                {/* 1. FREE DELIVERY THRESHOLD TRACKER (Blinkit Style Milestone) */}
                <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        isEligibleForFreeDelivery ? 'bg-green-100 text-[#0c831f]' : 'bg-orange-100 text-[#F27A24]'
                      }`}>
                        <Truck className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span className="font-black text-slate-900 text-xs truncate">
                        {isEligibleForFreeDelivery
                          ? '🎉 FREE Doorstep Delivery Unlocked!'
                          : `Add ₹${amountNeededForFreeDelivery} more for FREE Doorstep Delivery`}
                      </span>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                      isEligibleForFreeDelivery
                        ? 'bg-green-100 text-[#0c831f]'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {isEligibleForFreeDelivery ? 'Saved ₹30' : 'Target ₹399'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isEligibleForFreeDelivery
                          ? 'bg-[#0c831f]'
                          : 'bg-gradient-to-r from-[#F27A24] to-[#0c831f]'
                      }`}
                      style={{ width: `${freeDeliveryProgress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Cart Total: <strong className="text-slate-900 font-bold">₹{communityUnlockedTotal}</strong></span>
                    <span>
                      {isEligibleForFreeDelivery ? (
                        <strong className="text-[#0c831f]">₹0 Delivery Fee</strong>
                      ) : (
                        <span>Delivery Fee: <strong className="text-slate-700">₹30</strong></span>
                      )}
                    </span>
                  </div>
                </div>

                {/* 2. THE STAR: ADDED ITEMS LIST (Exact Blinkit-Style Product Rows) */}
                <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0c831f]" />
                      <h3 className="text-xs sm:text-sm font-black text-slate-950 uppercase tracking-wider">
                        Added Items in Cart
                      </h3>
                      <span className="text-xs font-bold text-slate-400">({items.length})</span>
                    </div>

                    <span className="text-[11px] font-bold text-[#0c831f] bg-green-50 px-2 py-0.5 rounded-md border border-green-200/60">
                      Wholesale Pooled
                    </span>
                  </div>

                  {/* Individual Product Rows */}
                  <div className="divide-y divide-slate-100">
                    {items.map((item) => {
                      const tierInfo = calculateCurrentTier(item.product);
                      const itemTotalPoolPrice = tierInfo.currentPrice * item.quantity;
                      const itemTotalMRP = item.product.standardRetailPrice * item.quantity;
                      const itemSavings = (item.product.standardRetailPrice - tierInfo.currentPrice) * item.quantity;

                      return (
                        <div
                          key={item.product.id}
                          className="py-3.5 flex items-start gap-3 sm:gap-3.5 first:pt-1 last:pb-1 group"
                        >
                          {/* Large, Crystal-Clear Product Image (Blinkit Style White Rounded Box) */}
                          <div
                            onClick={() => onOpenProductDetail && onOpenProductDetail(item.product)}
                            className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-white border border-slate-200/90 p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs relative cursor-pointer"
                            title="Tap to view description & details"
                          >
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-contain hover:scale-105 transition-transform"
                              loading="lazy"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                            {item.product.organicCertified && (
                              <span className="absolute top-1 left-1 bg-[#0c831f] text-white text-[8px] font-black px-1 py-0.2 rounded shadow-xs">
                                BIO
                              </span>
                            )}
                          </div>

                          {/* Middle Column: Title, Weight, Tier, and Unit Rate */}
                          <div className="flex-1 min-w-0 pr-1">
                            <h4
                              onClick={() => onOpenProductDetail && onOpenProductDetail(item.product)}
                              className="font-black text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2 cursor-pointer hover:text-[#0c831f] transition-colors"
                              title="Tap to view description & details"
                            >
                              {item.product.name}
                            </h4>

                            {/* Weight / Pack size pill */}
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                {item.product.unit}
                              </span>
                              {item.product.hindiName && (
                                <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
                                  {item.product.hindiName}
                                </span>
                              )}
                            </div>

                            {/* Pool Tier & Savings Pill */}
                            <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9.5px] font-black text-[#0c831f] bg-green-50 px-1.5 py-0.5 rounded-md border border-green-200/70">
                                Pool Tier {tierInfo.tierIndex + 1} (₹{tierInfo.currentPrice}/{item.product.baseUnit || 'kg'})
                              </span>
                              {itemSavings > 0 && (
                                <span className="text-[9.5px] font-black text-[#F27A24] bg-orange-50 px-1.5 py-0.5 rounded-md">
                                  Save ₹{itemSavings}
                                </span>
                              )}
                            </div>

                            {/* Quick Remove Action */}
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.product.id, 0)}
                              className="text-[10.5px] text-slate-400 hover:text-red-600 font-bold mt-1.5 inline-flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          </div>

                          {/* Right Column: Blinkit-Style Green Stepper & Price Calculation */}
                          <div className="shrink-0 flex flex-col items-end justify-between min-w-[84px]">
                            {/* Signature Blinkit Green Stepper [- QTY +] */}
                            <div className="flex items-center bg-[#0c831f] text-white rounded-xl p-0.5 shadow-2xs border border-green-700">
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-white hover:bg-black/15 text-xs font-black transition-colors cursor-pointer active:scale-90"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                              </button>
                              <span className="text-xs font-black text-white w-7 text-center select-none">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-lg text-white flex items-center justify-center hover:bg-black/15 text-xs font-black transition-colors cursor-pointer active:scale-90"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                              </button>
                            </div>

                            {/* Price Line Underneath */}
                            <div className="text-right mt-2">
                              <div className="flex items-baseline justify-end gap-1.5">
                                <span className="text-xs text-slate-400 line-through font-semibold">
                                  ₹{itemTotalMRP}
                                </span>
                                <span className="text-sm sm:text-base font-black text-slate-950 leading-none">
                                  ₹{itemTotalPoolPrice}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                                ₹{tierInfo.currentPrice} × {item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. FREQUENTLY BOUGHT TOGETHER (Blinkit Style Add-Ons - Clearly Separated) */}
                {recommendations.length > 0 && (
                  <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#F27A24]" />
                        <h4 className="text-xs sm:text-sm font-black text-slate-950">
                          Frequently Bought Together
                        </h4>
                      </div>
                      <span className="text-[10.5px] font-bold text-slate-400">
                        Tap + ADD to join pool
                      </span>
                    </div>

                    {/* Horizontal scroll container with scrollbar-hidden */}
                    <div className="flex gap-2.5 overflow-x-auto pb-1 pt-0.5 -mx-1 px-1 no-scrollbar">
                      {recommendations.map((rec) => {
                        const recTier = calculateCurrentTier(rec);

                        return (
                          <div
                            key={rec.id}
                            className="bg-[#F8FAFC] rounded-xl p-2 border border-slate-200 hover:border-slate-300 flex flex-col justify-between w-[130px] sm:w-[138px] shrink-0 transition-all group"
                          >
                            <div>
                              {/* Product Image Frame */}
                              <div
                                onClick={() => onOpenProductDetail && onOpenProductDetail(rec)}
                                className="w-full aspect-square bg-white rounded-lg p-1.5 flex items-center justify-center overflow-hidden mb-2 relative border border-slate-100 shadow-2xs cursor-pointer"
                                title="Tap to view description & details"
                              >
                                <img
                                  src={rec.image}
                                  alt={rec.name}
                                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                  loading="lazy"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src =
                                      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                                  }}
                                />
                                {rec.organicCertified && (
                                  <span className="absolute top-1 left-1 bg-[#0c831f] text-white text-[7.5px] font-black px-1 rounded">
                                    BIO
                                  </span>
                                )}
                              </div>

                              {/* Pack size & ADD button row */}
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-[9.5px] font-bold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded truncate max-w-[65px]">
                                  {rec.unit}
                                </span>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuickAdd(rec);
                                  }}
                                  className="border border-[#0c831f] text-[#0c831f] hover:bg-[#0c831f] hover:text-white font-black text-[10.5px] px-2 py-0.5 rounded-lg transition-all active:scale-95 cursor-pointer shadow-2xs shrink-0"
                                >
                                  + ADD
                                </button>
                              </div>

                              {/* Price */}
                              <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="text-xs sm:text-sm font-black text-slate-950">
                                  ₹{recTier.currentPrice}
                                </span>
                                <span className="text-[10px] text-slate-400 line-through">
                                  ₹{rec.standardRetailPrice}
                                </span>
                              </div>

                              {/* Name */}
                              <h5
                                onClick={() => onOpenProductDetail && onOpenProductDetail(rec)}
                                className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight mt-1 group-hover:text-[#0c831f] transition-colors cursor-pointer"
                                title="Tap to view description & details"
                              >
                                {rec.name}
                              </h5>
                            </div>

                            {/* Footer Badge / Rating */}
                            <div className="mt-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[9px] text-slate-500 font-semibold">
                              <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                <span>4.8</span>
                              </span>
                              <span className="text-[#0c831f] font-bold truncate">
                                Save ₹{rec.standardRetailPrice - recTier.currentPrice}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. DELIVERING TO HOME ADDRESS (Doorstep Delivery Confirmation) */}
                <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#0c831f] flex items-center justify-center font-bold shrink-0">
                        <Home className="w-4 h-4 text-[#0c831f]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-950">Delivering to Home</span>
                          <span className="text-[9px] font-black bg-green-100 text-[#0c831f] px-1.5 py-0.2 rounded">
                            Direct Doorstep
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium truncate max-w-[210px] sm:max-w-[280px] mt-0.5">
                          {flatNumber || userLocation.address}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(!isEditingAddress)}
                      className="text-xs font-black text-[#0c831f] hover:underline cursor-pointer shrink-0 ml-1"
                    >
                      {isEditingAddress ? 'Done' : 'Change Flat'}
                    </button>
                  </div>

                  {/* Inline Flat Number Editor when Change is clicked */}
                  {isEditingAddress && (
                    <div className="pt-2 border-t border-slate-100 space-y-2 animate-in fade-in duration-150">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        Edit Flat / Apartment Details:
                      </label>
                      <input
                        type="text"
                        value={flatNumber}
                        onChange={(e) => setFlatNumber(e.target.value)}
                        placeholder="e.g. Tower B - Flat 604, 6th Floor"
                        className="w-full bg-[#f4f6fb] border border-slate-200 focus:border-[#0c831f] rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none"
                      />
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>Courier brings fresh crate straight to your apartment door.</span>
                        <button
                          type="button"
                          onClick={() => setIsEditingAddress(false)}
                          className="font-black text-[#0c831f] underline"
                        >
                          Save Address
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. POOL BATCH WINDOW SELECTOR */}
                <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-[#0c831f]" />
                      <span>Consolidated Batch Window</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Direct Farm Run
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {POOL_WINDOWS.map((win) => {
                      const isSelected = win.id === selectedPoolWindowId;
                      return (
                        <div
                          key={win.id}
                          onClick={() => setSelectedPoolWindowId(win.id)}
                          className={`p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#f7fff9] border-[#0c831f] ring-1 ring-green-600/10'
                              : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-extrabold text-[11px] text-slate-950 truncate">{win.title}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#0c831f] shrink-0" />}
                          </div>
                          <p className="text-[10px] text-[#0c831f] font-bold">
                            Dispatch: {win.dispatchTime}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 6. PAYMENT METHOD SELECTION */}
                <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#0c831f]" />
                      <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Payment Method
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">SELECT 1</span>
                  </div>

                  <div className="space-y-1.5">
                    {/* 1. Community Wallet */}
                    <div
                      onClick={() => setPaymentMethod('wallet')}
                      className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        paymentMethod === 'wallet'
                          ? 'border-[#0c831f] bg-[#f7fff9] ring-1 ring-green-600/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-green-100 text-[#0c831f] flex items-center justify-center font-bold">
                          <Wallet className="w-3.5 h-3.5 text-[#0c831f]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-950">Community Wallet</span>
                            <span className="text-[9px] font-black bg-green-100 text-[#0c831f] px-1.5 py-0.2 rounded-full">
                              Balance: ₹{walletBalance}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium">1-Click Instant Debit • ₹0 fee</p>
                        </div>
                      </div>
                      {paymentMethod === 'wallet' && <Check className="w-4 h-4 text-[#0c831f]" />}
                    </div>

                    {/* 2. UPI / Online */}
                    <div
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        paymentMethod === 'upi'
                          ? 'border-[#0c831f] bg-[#f7fff9] ring-1 ring-green-600/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                          <CreditCard className="w-3.5 h-3.5 text-blue-700" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-950">UPI / QR / Cards</span>
                          <p className="text-[10px] text-slate-500 font-medium">GPay, PhonePe, Paytm, Cards</p>
                        </div>
                      </div>
                      {paymentMethod === 'upi' && <Check className="w-4 h-4 text-[#0c831f]" />}
                    </div>

                    {/* 3. Cash on Delivery (COD) */}
                    <div
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        paymentMethod === 'cod'
                          ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-400'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-950 flex items-center justify-center font-bold">
                          <Banknote className="w-3.5 h-3.5 text-amber-800" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-950">Cash On Delivery</span>
                            <span className="text-[9px] font-black bg-amber-200 text-amber-950 px-1.5 py-0.2 rounded-full">
                              +₹15 handling
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium">Pay cash at door on arrival</p>
                        </div>
                      </div>
                      {paymentMethod === 'cod' && <Check className="w-4 h-4 text-amber-800" />}
                    </div>
                  </div>
                </div>

                {/* 7. BILL DETAILS (Blinkit Style Invoice Breakdown) */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2 text-xs">
                  <h4 className="font-black text-slate-900 text-xs pb-1 border-b border-slate-100 flex items-center justify-between">
                    <span>Bill Details</span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">INC. ALL TAXES</span>
                  </h4>

                  <div className="flex justify-between text-slate-600">
                    <span>Items Retail MRP:</span>
                    <span className="line-through text-slate-400">₹{standardRetailTotal}</span>
                  </div>

                  <div className="flex justify-between text-slate-800 font-semibold">
                    <span>Neighborhood Pooled Price:</span>
                    <span className="font-bold text-[#0c831f]">₹{communityUnlockedTotal}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-700">
                    <span>Direct Doorstep Delivery:</span>
                    {isEligibleForFreeDelivery ? (
                      <span className="font-bold text-[#0c831f] bg-green-50 px-2 py-0.5 rounded text-[11px]">
                        FREE (Saved ₹30)
                      </span>
                    ) : (
                      <span className="font-bold text-slate-900 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                        +₹30 (FREE on ₹399+)
                      </span>
                    )}
                  </div>

                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between items-center text-amber-900 font-medium">
                      <span>COD Handling Fee:</span>
                      <span className="font-bold">+₹15</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Reusable Farm Crate:</span>
                    <span className="text-[#0c831f] font-bold">FREE (₹0)</span>
                  </div>

                  {/* Grand Total Row */}
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-black text-sm text-slate-950">
                    <span>Grand Total:</span>
                    <span className="text-base sm:text-lg font-black text-slate-950">
                      ₹{finalPayable}
                    </span>
                  </div>

                  {/* Total Savings Callout */}
                  <div className="bg-[#f7fff9] border border-green-200 rounded-xl p-2.5 text-center text-[11px] font-extrabold text-[#0c831f] flex items-center justify-center gap-1.5 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#0c831f]" />
                    <span>You are saving ₹{projectedNetSavings} on this order!</span>
                  </div>
                </div>

                {/* Safe & Hygienic Delivery Guarantee */}
                <div className="flex items-center justify-center gap-2 text-slate-400 text-[11px] font-semibold py-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Crate-Inspected • Contactless Doorstep Delivery</span>
                </div>
              </>
            )}
          </div>

          {/* STICKY BOTTOM CHECKOUT BAR (Blinkit Style) */}
          {items.length > 0 && (
            <div className="shrink-0 p-3.5 sm:p-4 bg-white border-t border-slate-200 shadow-lg z-10">
              {paymentMethod === 'wallet' && walletBalance < finalPayable ? (
                <button
                  type="button"
                  onClick={onOpenWallet}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md transition-all flex items-center justify-between px-5 active:scale-95 cursor-pointer"
                >
                  <div className="text-left leading-tight">
                    <span className="text-xs text-amber-100 block uppercase font-bold">
                      Wallet Short by ₹{Math.ceil(finalPayable - walletBalance)}
                    </span>
                    <span className="text-base font-black">Top Up & Place Order</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-black">
                    <span>Add ₹{Math.ceil(finalPayable - walletBalance)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    onProceedToCheckout(
                      selectedSlotId,
                      deliveryMode,
                      undefined,
                      flatNumber,
                      selectedPoolWindowId,
                      paymentMethod,
                      codFee
                    )
                  }
                  className={`w-full py-3.5 rounded-xl text-white font-black text-sm shadow-md transition-all flex items-center justify-between px-4 sm:px-5 active:scale-95 cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'bg-[#F27A24] hover:bg-[#DE6818] shadow-orange-800/20'
                      : 'bg-[#0c831f] hover:bg-[#0a6e1a] shadow-green-800/20'
                  }`}
                >
                  <div className="text-left leading-tight">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base sm:text-lg font-black leading-none">
                        ₹{finalPayable}
                      </span>
                      <span className="text-[11px] text-green-100 font-bold block uppercase">
                        TOTAL
                      </span>
                    </div>
                    <span className="text-[10.5px] text-green-100/90 font-medium block">
                      Saved ₹{projectedNetSavings} in Pool
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm font-black bg-white/20 px-3 py-1.5 rounded-lg">
                    <span>
                      {paymentMethod === 'cod'
                        ? 'Place COD Order'
                        : paymentMethod === 'wallet'
                        ? 'Pay via Wallet'
                        : 'Proceed to Pay'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
