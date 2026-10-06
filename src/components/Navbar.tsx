import React, { useState } from 'react';
import { ShoppingBag, Users, Zap, Truck, Sparkles, MapPin, ChevronDown, Check, Clock, Leaf, Search, Navigation, Wallet, Store, Sliders, Home, Briefcase, Heart, Plus, Crosshair } from 'lucide-react';
import { NeighborhoodCluster, UserRadiusLocation, PoolTypeFilter, SavedLocation, LocationTag } from '../types';
import { CommunityLogo } from './CommunityLogo';

interface NavbarProps {
  neighborhoods: NeighborhoodCluster[];
  selectedNeighborhood: NeighborhoodCluster;
  onSelectNeighborhood: (n: NeighborhoodCluster) => void;
  userLocation: UserRadiusLocation;
  onOpenRadiusModal: () => void;
  activeTab: 'catalog' | 'schedule' | 'optimizer' | 'orders' | 'admin';
  setActiveTab: (tab: 'catalog' | 'schedule' | 'optimizer' | 'orders' | 'admin') => void;
  poolTypeFilter?: PoolTypeFilter;
  onSelectPoolTypeFilter?: (filter: PoolTypeFilter) => void;
  cartCount: number;
  cartTotalSavings: number;
  onOpenCart: () => void;
  onOpenInviteModal: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  walletBalance: number;
  onOpenWallet: () => void;
  onOpenEngineInspector?: () => void;
  savedLocations?: SavedLocation[];
  onSelectSavedLocation?: (loc: SavedLocation) => void;
  onDetectGps?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  neighborhoods,
  selectedNeighborhood,
  onSelectNeighborhood,
  userLocation,
  onOpenRadiusModal,
  activeTab,
  setActiveTab,
  poolTypeFilter = 'all',
  onSelectPoolTypeFilter,
  cartCount,
  cartTotalSavings,
  onOpenCart,
  onOpenInviteModal,
  searchQuery = '',
  setSearchQuery,
  walletBalance,
  onOpenWallet,
  onOpenEngineInspector,
  savedLocations = [],
  onSelectSavedLocation,
  onDetectGps,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getTagIcon = (tag: LocationTag) => {
    switch (tag) {
      case 'home':
        return <Home className="w-3.5 h-3.5 text-[#164E2A]" />;
      case 'work':
        return <Briefcase className="w-3.5 h-3.5 text-blue-600" />;
      case 'parents':
        return <Heart className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <MapPin className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#DFEBDE] shadow-xs">
      {/* Top community micro strip */}
      <div className="bg-[#164E2A] px-4 py-1.5 text-xs text-white flex items-center justify-between font-bold">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="flex h-2 w-2 rounded-full bg-[#439A52] animate-ping" />
          <span className="uppercase tracking-wider text-[11px] font-black text-[#F27A24]">
            COMMUNITY:
          </span>
          <span className="font-medium text-emerald-100">
            Farm-direct society bulk buying — neighbors within 5km radius pool orders to unlock wholesale mandi prices
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-emerald-100 text-xs font-semibold">
          <button
            onClick={onOpenRadiusModal}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer"
          >
            <Navigation className="w-3 h-3 text-[#439A52]" />
            <span>5km Radius Pooling Active</span>
          </button>
          <span className="flex items-center gap-1 text-white">
            <Clock className="w-3.5 h-3.5 text-[#439A52]" /> 6:00 PM Batch Locks
          </span>
          <span className="flex items-center gap-1 text-white">
            <Leaf className="w-3.5 h-3.5 text-[#439A52]" /> Pick-up: FREE • Doorstep: ₹30
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 md:gap-6">
          {/* Brand Logo & Location */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            {/* New App Logo from uploaded image */}
            <button
              onClick={() => setActiveTab('catalog')}
              className="text-left focus:outline-none group cursor-pointer"
              title="COMMUNITY - Buy Together. Save Together."
            >
              <CommunityLogo size="md" showTagline={true} />
            </button>

            {/* Location Selector Component */}
            <div className="relative hidden sm:block">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex flex-col text-left py-1 px-2.5 rounded-xl hover:bg-[#F7F9F6] transition-colors border border-transparent hover:border-[#DFEBDE] cursor-pointer"
                >
                  <span className="text-[11px] font-extrabold text-[#172A1E] flex items-center gap-1">
                    Delivery in Scheduled Eco-Batch
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  </span>
                  <span className="text-xs text-slate-600 font-medium truncate max-w-[210px] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#164E2A] shrink-0" />
                    <span className="truncate font-semibold">{userLocation.address || selectedNeighborhood.name}</span>
                  </span>
                </button>

                {/* 5KM Radius Badge & Trigger */}
                <button
                  onClick={onOpenRadiusModal}
                  title="Users within 5km radius can join pool. Click to check distance & saved locations."
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer shadow-2xs ${
                    userLocation.isWithinRadius
                      ? 'bg-[#E8F4E9] border-[#CEE2D1] text-[#164E2A] hover:bg-[#D9ECD9]'
                      : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                  }`}
                >
                  <Navigation className="w-3 h-3 text-[#439A52]" />
                  <span className="hidden lg:inline">5km Pool:</span>
                  <span>{userLocation.distanceKm} km</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                      userLocation.isWithinRadius
                        ? 'bg-[#164E2A] text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {userLocation.isWithinRadius ? 'Eligible' : 'Check'}
                  </span>
                </button>
              </div>

              {showDropdown && (
                <div className="absolute left-0 mt-2 w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Delivery Location & Hub</p>
                      <p className="text-[11px] text-slate-500">Scheduled batch dispatch within 5.0 km corridor</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onOpenRadiusModal();
                      }}
                      className="text-[10px] font-black text-[#164E2A] underline cursor-pointer"
                    >
                      Manage
                    </button>
                  </div>

                  {/* 1. Quick Phone GPS Auto-Detect Button */}
                  <div className="p-2 border-b border-slate-100">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        if (onDetectGps) {
                          onDetectGps();
                        } else {
                          onOpenRadiusModal();
                        }
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#164E2A] border border-emerald-200 transition-colors cursor-pointer text-xs font-black"
                    >
                      <span className="flex items-center gap-2">
                        <Crosshair className="w-4 h-4 text-[#F27A24]" />
                        <span>📍 Auto-Detect via Phone GPS</span>
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-md font-bold text-slate-600">
                        Live Precision
                      </span>
                    </button>
                  </div>

                  {/* 2. Saved Locations Section */}
                  {savedLocations.length > 0 && (
                    <div className="py-2 px-1 border-b border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-2 mb-1.5">
                        Saved Delivery Addresses
                      </p>
                      <div className="space-y-1">
                        {savedLocations.slice(0, 3).map((loc) => {
                          const isSelected =
                            userLocation.address.includes(loc.societyName) ||
                            (loc.flatTower && userLocation.address.includes(loc.flatTower));

                          return (
                            <button
                              key={loc.id}
                              onClick={() => {
                                if (onSelectSavedLocation) onSelectSavedLocation(loc);
                                setShowDropdown(false);
                              }}
                              className={`w-full text-left px-2.5 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-green-50 text-[#164E2A] border border-green-200 font-bold'
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="p-1 rounded-lg bg-white border border-slate-200 shrink-0">
                                  {getTagIcon(loc.tag)}
                                </span>
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-900 text-xs truncate">{loc.title}</p>
                                  <p className="text-[10px] text-slate-500 truncate">
                                    {loc.flatTower ? `${loc.flatTower}, ` : ''}{loc.societyName}
                                  </p>
                                </div>
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#164E2A] shrink-0 ml-1" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 3. Registered Societies / Hubs */}
                  <div className="pt-2 px-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-2 mb-1">
                      Society Hubs
                    </p>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {neighborhoods.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => {
                            onSelectNeighborhood(n);
                            setShowDropdown(false);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                            selectedNeighborhood.id === n.id
                              ? 'bg-green-50 text-[#164E2A] border border-green-200 font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                              {n.name}
                              {selectedNeighborhood.id === n.id && (
                                <Check className="w-3.5 h-3.5 text-[#164E2A]" />
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5 font-normal">
                              {n.distanceFromHubKm} km from hub • {n.activeHouseholds} houses pooling
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer button */}
                  <div className="p-2 border-t border-slate-100 mt-1">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onOpenRadiusModal();
                      }}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#164E2A]" />
                      <span>+ Add New Address or Check 5km Radius</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Central Search Bar */}
          <div className="flex-1 max-w-xl mx-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="catalog-search-input"
                type="text"
                placeholder='Search "milk", "onion", "potatoes", "basmati rice", "atta"...'
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                className="w-full bg-[#F7F9F6] hover:bg-[#EEF3EE] focus:bg-white border border-[#DFEBDE] focus:border-[#164E2A] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#172A1E] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#164E2A]/10 transition-all font-medium"
              />
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Community Wallet Button */}
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#E8F4E9] hover:bg-[#D9ECD9] border border-[#CEE2D1] text-[#164E2A] font-extrabold text-xs transition-all active:scale-95 shadow-2xs group cursor-pointer"
              title="Open Community Pool Wallet (1-Click Checkout)"
            >
              <div className="w-6 h-6 rounded-lg bg-[#164E2A] flex items-center justify-center text-white shadow-2xs">
                <Wallet className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] text-[#439A52] font-black uppercase tracking-tight">Pool Wallet</span>
                <span className="text-xs font-black text-[#164E2A]">₹{walletBalance}</span>
              </div>
              <span className="bg-[#164E2A] group-hover:bg-[#113E21] text-white text-[10px] font-black px-1.5 py-0.2 rounded-md transition-colors">
                +Add
              </span>
            </button>

            <button
              onClick={onOpenInviteModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F7F9F6] hover:bg-[#EAF2EA] border border-[#DFEBDE] text-xs font-bold text-[#164E2A] transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-[#F27A24]" />
              <span>Invite Tower</span>
            </button>

            {/* Cart Button with deep forest green brand color */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#164E2A] hover:bg-[#113E21] text-white font-extrabold text-xs shadow-md shadow-[#164E2A]/20 transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-white fill-white" />
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[13px] font-extrabold">My Cart</span>
                {cartCount > 0 && (
                  <span className="text-[10px] text-emerald-200 font-semibold">
                    {cartCount} items • Saved ₹{cartTotalSavings}
                  </span>
                )}
              </div>
              {cartCount > 0 && (
                <span className="bg-[#F27A24] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Feature Tabs Row */}
        <div className="flex items-center justify-between overflow-x-auto py-2 border-t border-[#DFEBDE] no-scrollbar gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            {/* All Pools */}
            <button
              onClick={() => {
                setActiveTab('catalog');
                onSelectPoolTypeFilter && onSelectPoolTypeFilter('all');
              }}
              className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'catalog' && poolTypeFilter === 'all'
                  ? 'bg-[#164E2A] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-[#E8F4E9]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>All Pools</span>
            </button>

            {/* Small Pools Tab */}
            <button
              onClick={() => {
                setActiveTab('catalog');
                onSelectPoolTypeFilter && onSelectPoolTypeFilter('small');
              }}
              className={`px-3 py-1.5 rounded-full font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'catalog' && poolTypeFilter === 'small'
                  ? 'bg-[#F27A24] text-white shadow-xs ring-2 ring-[#F27A24]/30'
                  : 'text-[#164E2A] bg-[#FFF5EE] hover:bg-[#FFEBDC] border border-[#F27A24]/40'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>⚡ Small Pools (3–5 Houses)</span>
              <span className="text-[10px] bg-white text-[#F27A24] px-1 rounded font-black">
                22m
              </span>
            </button>

            {/* Large Pools Tab */}
            <button
              onClick={() => {
                setActiveTab('catalog');
                onSelectPoolTypeFilter && onSelectPoolTypeFilter('large');
              }}
              className={`px-3 py-1.5 rounded-full font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'catalog' && poolTypeFilter === 'large'
                  ? 'bg-[#164E2A] text-white shadow-xs ring-2 ring-[#164E2A]/30'
                  : 'text-[#164E2A] bg-[#E8F4E9] hover:bg-[#D9ECD9] border border-[#CEE2D1]'
              }`}
            >
              <Store className="w-3.5 h-3.5 fill-current" />
              <span>🚜 Large Wholesale (15–50+ Houses)</span>
              <span className="text-[10px] bg-[#164E2A] text-white px-1 rounded font-black">
                -55%
              </span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-[#164E2A] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-[#E8F4E9]'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Eco Schedule</span>
            </button>

            <button
              onClick={() => setActiveTab('optimizer')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'optimizer'
                  ? 'bg-[#164E2A] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-[#E8F4E9]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F27A24]" />
              <span>Route AI</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#164E2A] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-[#E8F4E9]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Orders ({selectedNeighborhood.activeOrdersToday})</span>
            </button>

            {onOpenEngineInspector && (
              <button
                onClick={onOpenEngineInspector}
                className="px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer text-[#164E2A] bg-[#E8F4E9] hover:bg-[#D9ECD9] border border-[#CEE2D1]"
                title="Inspect Landed Cost, Safe Margins, & Supplier Procurement"
              >
                <Sliders className="w-3.5 h-3.5 text-[#164E2A]" />
                <span>Pool Engine</span>
              </button>
            )}

            <button
              onClick={() => {
                setActiveTab('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-full font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs ${
                activeTab === 'admin'
                  ? 'bg-[#164E2A] text-white ring-2 ring-[#164E2A]/30'
                  : 'text-[#164E2A] bg-[#FFF5EE] hover:bg-[#FFEBDC] border border-[#F27A24]/40'
              }`}
              title="Open Full Page Admin Store Manager: Add, Remove, Edit Prices, Photos & Sellers"
            >
              <Store className="w-3.5 h-3.5 text-[#F27A24]" />
              <span>⚙️ Store Admin</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 text-[11px] font-semibold text-[#5A6F61] shrink-0">
            <span className="flex items-center gap-1 text-[#164E2A]">
              <Check className="w-3.5 h-3.5 text-[#439A52]" /> Zero Middleman
            </span>
            <span className="flex items-center gap-1 text-[#164E2A]">
              <Check className="w-3.5 h-3.5 text-[#439A52]" /> 100% Reusable Crates
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
