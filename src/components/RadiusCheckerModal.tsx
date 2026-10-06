import React, { useState } from 'react';
import { NeighborhoodCluster, UserRadiusLocation, SavedLocation, LocationTag } from '../types';
import { MAX_COMMUNITY_POOL_RADIUS_KM, NEIGHBORHOODS } from '../data/mockData';
import {
  requestDeviceLocation,
  savedLocationToUserRadiusLocation,
  saveLocationsToStorage,
  setActiveUserLocation,
} from '../utils/locationService';
import {
  X,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Users,
  Truck,
  Leaf,
  Navigation,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  Home,
  Briefcase,
  Heart,
  Plus,
  Trash2,
  Edit3,
  Compass,
  Check,
  Crosshair,
  Info,
} from 'lucide-react';

interface RadiusCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  neighborhood: NeighborhoodCluster;
  userLocation: UserRadiusLocation;
  onSelectUserLocation: (loc: UserRadiusLocation) => void;
  savedLocations: SavedLocation[];
  onUpdateSavedLocations: (locations: SavedLocation[]) => void;
  onSelectNeighborhood?: (n: NeighborhoodCluster) => void;
  onShowToast?: (msg: string) => void;
}

type ModalTab = 'saved_addresses' | 'gps_detector' | 'radius_checker';

export const RadiusCheckerModal: React.FC<RadiusCheckerModalProps> = ({
  isOpen,
  onClose,
  neighborhood,
  userLocation,
  onSelectUserLocation,
  savedLocations,
  onUpdateSavedLocations,
  onSelectNeighborhood,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('saved_addresses');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [detectedGpsInfo, setDetectedGpsInfo] = useState<{
    latitude: number;
    longitude: number;
    accuracyMeters: number;
    distanceKm: number;
    society: string;
    address: string;
  } | null>(null);

  // Form state for adding/editing a saved address
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    tag: LocationTag;
    title: string;
    flatTower: string;
    societyName: string;
    area: string;
    pincode: string;
    landmark: string;
    deliveryInstructions: string;
    isDefault: boolean;
  }>({
    tag: 'home',
    title: 'Home',
    flatTower: '',
    societyName: neighborhood.name,
    area: neighborhood.cityArea,
    pincode: '560043',
    landmark: '',
    deliveryInstructions: 'Ring doorbell and leave crate on doorstep stand',
    isDefault: false,
  });

  // Radius slider custom distance
  const [customDistance, setCustomDistance] = useState<number>(userLocation.distanceKm);

  if (!isOpen) return null;

  const isEligible = customDistance <= MAX_COMMUNITY_POOL_RADIUS_KM;

  // Handle Automatic Phone GPS Request
  const handleDetectDeviceGps = async () => {
    setIsDetectingGps(true);
    setGpsError(null);

    const result = await requestDeviceLocation(NEIGHBORHOODS);
    setIsDetectingGps(false);

    if (result.success && result.latitude && result.longitude) {
      setDetectedGpsInfo({
        latitude: result.latitude,
        longitude: result.longitude,
        accuracyMeters: result.accuracyMeters || 10,
        distanceKm: result.distanceKm || 1.5,
        society: result.society || neighborhood.name,
        address: result.address || 'Detected Phone GPS Location',
      });

      const newLoc: UserRadiusLocation = {
        address: result.address || `GPS Location (${Math.round(result.latitude * 1000) / 1000}, ${Math.round(result.longitude * 1000) / 1000})`,
        society: result.society || neighborhood.name,
        distanceKm: result.distanceKm || 1.5,
        isWithinRadius: (result.distanceKm || 1.5) <= MAX_COMMUNITY_POOL_RADIUS_KM,
        latitude: result.latitude,
        longitude: result.longitude,
        accuracyMeters: result.accuracyMeters,
        detectedViaGps: true,
      };

      onSelectUserLocation(newLoc);
      setActiveUserLocation(newLoc);

      if (onShowToast) {
        onShowToast(`📍 Location auto-detected via Phone GPS (±${result.accuracyMeters || 10}m accuracy)!`);
      }
    } else {
      setGpsError(result.errorMessage || 'Unable to retrieve location.');
    }
  };

  // Start adding a new address
  const handleStartAddAddress = () => {
    setFormData({
      tag: 'home',
      title: 'Home',
      flatTower: '',
      societyName: neighborhood.name,
      area: neighborhood.cityArea,
      pincode: '560043',
      landmark: '',
      deliveryInstructions: 'Ring doorbell and leave crate on doorstep stand',
      isDefault: false,
    });
    setEditingLocationId(null);
    setIsAddingNew(true);
  };

  // Start editing an existing address
  const handleStartEditAddress = (loc: SavedLocation) => {
    setFormData({
      tag: loc.tag,
      title: loc.title,
      flatTower: loc.flatTower,
      societyName: loc.societyName,
      area: loc.area,
      pincode: loc.pincode,
      landmark: loc.landmark || '',
      deliveryInstructions: loc.deliveryInstructions || '',
      isDefault: !!loc.isDefault,
    });
    setEditingLocationId(loc.id);
    setIsAddingNew(true);
  };

  // Save address from form
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.flatTower.trim() || !formData.societyName.trim()) {
      alert('Please fill in Flat/Tower and Society Name');
      return;
    }

    let updatedList: SavedLocation[];

    if (editingLocationId) {
      updatedList = savedLocations.map((loc) => {
        if (loc.id === editingLocationId) {
          return {
            ...loc,
            tag: formData.tag,
            title: formData.title || (formData.tag === 'home' ? 'Home' : formData.tag === 'work' ? 'Work' : 'Saved Location'),
            flatTower: formData.flatTower,
            societyName: formData.societyName,
            area: formData.area,
            pincode: formData.pincode,
            landmark: formData.landmark,
            deliveryInstructions: formData.deliveryInstructions,
            isDefault: formData.isDefault,
          };
        }
        return formData.isDefault ? { ...loc, isDefault: false } : loc;
      });
      if (onShowToast) onShowToast(`✅ Updated address "${formData.title}"!`);
    } else {
      const newSaved: SavedLocation = {
        id: `loc-custom-${Date.now()}`,
        tag: formData.tag,
        title: formData.title || (formData.tag === 'home' ? 'Home' : formData.tag === 'work' ? 'Work' : 'Saved Location'),
        flatTower: formData.flatTower,
        societyName: formData.societyName,
        area: formData.area,
        pincode: formData.pincode,
        landmark: formData.landmark,
        deliveryInstructions: formData.deliveryInstructions,
        distanceKm: userLocation.distanceKm || 1.8,
        isDefault: formData.isDefault || savedLocations.length === 0,
        createdAt: new Date().toISOString(),
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      };

      if (formData.isDefault) {
        updatedList = [newSaved, ...savedLocations.map((l) => ({ ...l, isDefault: false }))];
      } else {
        updatedList = [newSaved, ...savedLocations];
      }
      if (onShowToast) onShowToast(`✨ Saved "${newSaved.title}" to your delivery addresses!`);
    }

    onUpdateSavedLocations(updatedList);
    saveLocationsToStorage(updatedList);
    setIsAddingNew(false);
    setEditingLocationId(null);
  };

  // Delete a saved address
  const handleDeleteAddress = (id: string, title: string) => {
    const updated = savedLocations.filter((l) => l.id !== id);
    onUpdateSavedLocations(updated);
    saveLocationsToStorage(updated);
    if (onShowToast) onShowToast(`🗑️ Removed address "${title}".`);
  };

  // Select a saved address as active delivery location
  const handleSelectSavedLocation = (loc: SavedLocation) => {
    const converted = savedLocationToUserRadiusLocation(loc);
    onSelectUserLocation(converted);
    setActiveUserLocation(converted);
    if (onShowToast) onShowToast(`📍 Active delivery address set to: ${loc.title}`);
    onClose();
  };

  const getTagIcon = (tag: LocationTag) => {
    switch (tag) {
      case 'home':
        return <Home className="w-4 h-4 text-[#164E2A]" />;
      case 'work':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'parents':
        return <Heart className="w-4 h-4 text-rose-600" />;
      default:
        return <MapPin className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden font-sans my-8">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#164E2A] via-[#1b5e33] to-[#0c831f] text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md text-emerald-300 flex items-center justify-center shadow-xs border border-white/20">
              <Navigation className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">Location & 5km Pool Hub</h3>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Doorstep Delivery
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">
                Auto-detect your phone GPS coordinates or choose from your saved addresses
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-slate-200 bg-[#F7F9F6] px-4 pt-3 gap-2 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => {
              setActiveTab('saved_addresses');
              setIsAddingNew(false);
            }}
            className={`px-4 py-2.5 rounded-t-xl font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'saved_addresses'
                ? 'bg-white text-[#164E2A] border-t-2 border-t-[#164E2A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Saved Addresses ({savedLocations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gps_detector')}
            className={`px-4 py-2.5 rounded-t-xl font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'gps_detector'
                ? 'bg-white text-[#164E2A] border-t-2 border-t-[#164E2A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 text-[#F27A24]" />
            <span>Auto-Detect Phone GPS</span>
          </button>

          <button
            onClick={() => setActiveTab('radius_checker')}
            className={`px-4 py-2.5 rounded-t-xl font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'radius_checker'
                ? 'bg-white text-[#164E2A] border-t-2 border-t-[#164E2A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Navigation className="w-4 h-4 text-[#439A52]" />
            <span>5km Radar & Distance</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto bg-[#F7F9F6]">
          {/* TAB 1: SAVED ADDRESSES */}
          {activeTab === 'saved_addresses' && (
            <div className="space-y-4">
              {/* Top Action Bar: Add New Address */}
              {!isAddingNew && (
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Your Saved Delivery Addresses</h4>
                    <p className="text-xs text-slate-500">Pick an address for scheduled consolidated batch delivery</p>
                  </div>

                  <button
                    onClick={handleStartAddAddress}
                    className="flex items-center gap-1.5 bg-[#164E2A] hover:bg-[#113E21] text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Address</span>
                  </button>
                </div>
              )}

              {/* Form for Add/Edit Saved Address */}
              {isAddingNew && (
                <form onSubmit={handleSaveAddress} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                      {editingLocationId ? <Edit3 className="w-4 h-4 text-[#164E2A]" /> : <Plus className="w-4 h-4 text-[#F27A24]" />}
                      <span>{editingLocationId ? 'Edit Address' : 'Add New Delivery Address'}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="text-xs text-slate-500 hover:text-slate-700 font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Tag Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Save address as:</label>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      {[
                        { id: 'home', label: 'Home', icon: Home },
                        { id: 'work', label: 'Work', icon: Briefcase },
                        { id: 'parents', label: 'Parents', icon: Heart },
                        { id: 'other', label: 'Other', icon: MapPin },
                      ].map((t) => {
                        const Icon = t.icon;
                        const isSelected = formData.tag === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, tag: t.id as LocationTag, title: t.label })}
                            className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 font-extrabold cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-emerald-50 border-[#164E2A] text-[#164E2A] ring-2 ring-[#164E2A]/20'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Flat / House / Wing / Tower No. *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Flat 402, Tower B (Emerald)"
                        value={formData.flatTower}
                        onChange={(e) => setFormData({ ...formData, flatTower: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#F7F9F6] border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#164E2A]/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Society / Apartment Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Silver Springs Enclave"
                        value={formData.societyName}
                        onChange={(e) => setFormData({ ...formData, societyName: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#F7F9F6] border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#164E2A]/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Area / Street</label>
                      <input
                        type="text"
                        placeholder="e.g. Hennur Ring Road, Bangalore North"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#F7F9F6] border border-slate-200 rounded-xl font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        placeholder="e.g. 560043"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#F7F9F6] border border-slate-200 rounded-xl font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Instructions for Batch Driver</label>
                    <input
                      type="text"
                      placeholder="e.g. Leave with security guard / Ring bell & leave on doorstep stand"
                      value={formData.deliveryInstructions}
                      onChange={(e) => setFormData({ ...formData, deliveryInstructions: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#F7F9F6] border border-slate-200 rounded-xl font-medium"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                        className="w-4 h-4 text-[#164E2A] rounded focus:ring-[#164E2A]"
                      />
                      <span>Set as default delivery address</span>
                    </label>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#164E2A] hover:bg-[#113E21] text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      {editingLocationId ? 'Save Changes' : 'Save Address'}
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Locations List */}
              <div className="space-y-3">
                {savedLocations.map((loc) => {
                  const isCurrentActive =
                    userLocation.address.includes(loc.societyName) ||
                    (loc.flatTower && userLocation.address.includes(loc.flatTower));

                  return (
                    <div
                      key={loc.id}
                      className={`bg-white rounded-2xl p-4 border transition-all ${
                        isCurrentActive
                          ? 'border-[#164E2A] ring-2 ring-[#164E2A]/10 bg-emerald-50/30'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                            {getTagIcon(loc.tag)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="font-black text-slate-900 text-xs sm:text-sm truncate">
                                {loc.title}
                              </h5>
                              {loc.isDefault && (
                                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                  Default
                                </span>
                              )}
                              {isCurrentActive && (
                                <span className="bg-[#164E2A] text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Active Delivery
                                </span>
                              )}
                            </div>

                            <p className="font-semibold text-slate-800 text-xs mt-1">
                              {loc.flatTower ? `${loc.flatTower}, ` : ''}{loc.societyName}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {loc.area} • Pincode: {loc.pincode}
                            </p>

                            {loc.deliveryInstructions && (
                              <p className="text-[10px] text-[#164E2A] font-semibold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 mt-2 inline-block">
                                💬 Note: {loc.deliveryInstructions}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditAddress(loc)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
                            title="Edit Address"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(loc.id, loc.title)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-slate-200"
                            title="Delete Address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          {!isCurrentActive && (
                            <button
                              type="button"
                              onClick={() => handleSelectSavedLocation(loc)}
                              className="px-3 py-1.5 bg-[#164E2A] hover:bg-[#113E21] text-white text-xs font-black rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                            >
                              Deliver Here
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: AUTO-DETECT PHONE GPS */}
          {activeTab === 'gps_detector' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#164E2A] flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
                  <Crosshair className={`w-7 h-7 ${isDetectingGps ? 'animate-spin text-[#F27A24]' : ''}`} />
                </div>

                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 text-base">
                    Automatic Phone GPS Permission & Detection
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Allow device location permissions to automatically lock your exact tower coordinates and verify instant eligibility for 5km bulk pool farm savings.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDetectDeviceGps}
                  disabled={isDetectingGps}
                  className="px-6 py-3 rounded-2xl bg-[#164E2A] hover:bg-[#113E21] text-white font-black text-xs shadow-lg shadow-[#164E2A]/20 transition-all active:scale-95 cursor-pointer inline-flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4 text-emerald-300" />
                  <span>{isDetectingGps ? 'Detecting Device GPS...' : '📍 Allow & Detect My Exact Location'}</span>
                </button>

                {gpsError && (
                  <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl text-left text-xs text-red-800 space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      Location Permission Denied or Unavailable
                    </p>
                    <p className="text-[11px] text-red-700">
                      {gpsError} Please check browser/phone permissions, or pick an address from the "Saved Addresses" tab.
                    </p>
                  </div>
                )}

                {detectedGpsInfo && (
                  <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-left space-y-2 animate-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#164E2A] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#439A52]" /> GPS Locked Successfully
                      </span>
                      <span className="text-[10px] bg-white border border-emerald-300 px-2 py-0.5 rounded-md font-bold text-[#164E2A]">
                        Accuracy: ±{detectedGpsInfo.accuracyMeters}m
                      </span>
                    </div>

                    <p className="font-bold text-slate-900 text-xs">
                      {detectedGpsInfo.address}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Nearest Hub: <span className="font-bold text-[#164E2A]">{detectedGpsInfo.society}</span> ({detectedGpsInfo.distanceKm} km from central depot)
                    </p>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          handleStartAddAddress();
                          setFormData((prev) => ({
                            ...prev,
                            societyName: detectedGpsInfo.society,
                            flatTower: `GPS Pin (±${detectedGpsInfo.accuracyMeters}m)`,
                          }));
                          setActiveTab('saved_addresses');
                        }}
                        className="text-xs font-bold text-[#164E2A] bg-white hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 cursor-pointer"
                      >
                        + Save this GPS location as an Address
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: 5KM RADAR & CORRIDOR CHECKER */}
          {activeTab === 'radius_checker' && (
            <div className="space-y-4">
              {/* Visual 5KM Radar Card */}
              <div className="bg-white rounded-2xl p-4 border-2 border-green-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0c831f]" />
                    <span className="text-xs font-black text-slate-950">
                      Central Distribution Hub: {neighborhood.hubName.split('(')[0].trim()}
                    </span>
                  </div>
                  <span className="text-[11px] font-black bg-green-100 text-[#0c831f] px-2 py-0.5 rounded-md">
                    Max Radius: 5.0 km
                  </span>
                </div>

                {/* Progress bar visual */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span>Your distance from Hub</span>
                    <span className={isEligible ? 'text-[#0c831f] font-black' : 'text-red-600 font-black'}>
                      {customDistance} km {isEligible ? '(Within 5km Pool)' : '(Beyond 5km Limit)'}
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isEligible ? 'bg-gradient-to-r from-emerald-500 to-[#0c831f]' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, (customDistance / 6.0) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Interactive Slider */}
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                    <span>Simulate Distance:</span>
                    <span className="font-extrabold text-slate-900">{customDistance} km</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="7.0"
                    step="0.1"
                    value={customDistance}
                    onChange={(e) => setCustomDistance(parseFloat(e.target.value))}
                    className="w-full accent-[#164E2A] cursor-pointer"
                  />
                </div>
              </div>

              {/* Eligibility explanation */}
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs text-slate-700 space-y-1.5">
                <p className="font-extrabold text-[#164E2A] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#439A52]" /> Why 5km Pooling Works:
                </p>
                <p className="text-[11px] text-slate-600">
                  Consolidated single-van deliveries are dispatched only within 5km of our agri-hub. This guarantees morning freshness harvested & delivered within 24h with zero packaging and transport waste.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Current Active: <span className="font-black text-slate-900">{userLocation.address}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
