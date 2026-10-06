import React, { useState } from 'react';
import { NeighborhoodCluster, DeliverySlotOption } from '../types';
import { DELIVERY_SLOTS } from '../data/mockData';
import { Truck, Clock, Leaf, CheckCircle2, MapPin, ArrowRight, Zap, RefreshCw, Box, AlertCircle } from 'lucide-react';

interface DeliveryScheduleViewProps {
  neighborhood: NeighborhoodCluster;
  onOpenOptimizer: () => void;
}

export const DeliveryScheduleView: React.FC<DeliveryScheduleViewProps> = ({
  neighborhood,
  onOpenOptimizer,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slot-evening');
  const [selectedDropOption, setSelectedDropOption] = useState<'doorstep' | 'contactless' | 'captain'>('doorstep');

  const activeSlot = DELIVERY_SLOTS.find((s) => s.id === selectedSlotId) || DELIVERY_SLOTS[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner - Community Eco-Distribution Style */}
      <div className="bg-gradient-to-r from-[#0c831f] via-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-green-700 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-yellow-300 text-xs font-black border border-white/30">
            <Leaf className="w-3.5 h-3.5" />
            <span>COMMUNITY ECO-DISTRIBUTION MODEL</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Optimized Consolidated Neighborhood Delivery
          </h2>

          <p className="text-emerald-100 text-xs sm:text-sm font-medium leading-relaxed">
            Instead of 30 separate motorcycle couriers burning petrol to the same apartment tower within an hour, <strong>community</strong> synchronizes neighbor orders into scheduled batch runs with zero delivery fees.
          </p>

          <div className="flex flex-wrap gap-4 pt-1 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-[#f7d046]">
              <CheckCircle2 className="w-4 h-4" /> ₹0 Delivery Fee on Group Batches
            </span>
            <span className="flex items-center gap-1.5 text-white">
              <CheckCircle2 className="w-4 h-4" /> Zero Single-Use Plastic Crates
            </span>
            <span className="flex items-center gap-1.5 text-emerald-200">
              <CheckCircle2 className="w-4 h-4" /> 100% Electric Mini-Van Logistics
            </span>
          </div>
        </div>

        <div className="mt-4 sm:mt-0 sm:absolute sm:right-6 sm:bottom-6 z-10">
          <button
            onClick={onOpenOptimizer}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f7d046] hover:bg-yellow-300 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>AI Thinking Route Optimizer</span>
          </button>
        </div>
      </div>

      {/* Delivery Schedule Slots Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Scheduled Residential Batches • {neighborhood.shortName}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Synchronized with dawn farm harvests and evening dinner cooking
            </p>
          </div>
          <span className="text-xs font-extrabold text-[#0c831f] bg-green-100 px-3 py-1 rounded-full">
            3 Batches Daily
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DELIVERY_SLOTS.map((slot) => {
            const isSelected = slot.id === selectedSlotId;
            return (
              <div
                key={slot.id}
                onClick={() => setSelectedSlotId(slot.id)}
                className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative ${
                  isSelected
                    ? 'border-[#0c831f] bg-[#f7fff9] shadow-md ring-2 ring-green-600/10'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {slot.status === 'filling_fast' && (
                  <span className="absolute top-3 right-3 bg-[#f7d046] text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                    Filling Fast (82%)
                  </span>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                      isSelected
                        ? 'bg-[#0c831f] text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{slot.name}</h4>
                    <p className="text-xs font-bold text-[#0c831f]">{slot.timeWindow}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2 mb-3 leading-relaxed font-medium">
                  {slot.description}
                </p>

                <div className="border-t border-slate-100 pt-2.5 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>Order Cut-off:</span>
                    <strong className="text-slate-900">{slot.cutoffTime}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Active Orders:</span>
                    <strong className="text-[#0c831f]">
                      {slot.currentOrders} / {slot.maxOrders} flats
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Fleet:</span>
                    <span className="text-slate-800 font-semibold">{slot.vehicleType}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2">
                  <button
                    className={`w-full py-2 rounded-xl text-xs font-black transition-colors ${
                      isSelected
                        ? 'bg-[#0c831f] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? 'Selected Slot for Orders' : 'Select This Slot'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stop Sequence & Tower Routing Diagram */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#0c831f]" />
              <span>Consolidated Batch Routing Map: {activeSlot.name}</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              One vehicle sequence servicing {neighborhood.name} in 52 minutes flat
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
              Total Stops: 4 Hubs
            </span>
            <span className="text-xs font-bold text-[#0c831f] bg-green-100 px-3 py-1 rounded-lg">
              Estimated CO2 Saved: 8.4 kg
            </span>
          </div>
        </div>

        {/* Route Steps Timeline */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="bg-[#f7f9fc] rounded-xl p-4 border border-slate-200/90 relative group hover:border-[#0c831f] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="w-7 h-7 rounded-full bg-[#0c831f] text-white text-xs font-black flex items-center justify-center">
                1
              </span>
              <span className="text-[11px] font-bold text-[#0c831f]">6:00 PM</span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Tower A Direct Doorstep Run</h4>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Consolidated elevator batch serving floors 1 to 14 directly to apartment doors.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] space-y-1 text-slate-600 font-medium">
              <p>• <strong>Weight:</strong> 28 kg</p>
              <p>• <strong>Elevator:</strong> 0 wait time</p>
              <p>• <strong>Captain:</strong> Ritu Varma (Verified)</p>
            </div>
          </div>

          <div className="bg-[#f7f9fc] rounded-xl p-4 border border-slate-200/90 relative group hover:border-[#0c831f] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="w-7 h-7 rounded-full bg-[#0c831f] text-white text-xs font-black flex items-center justify-center">
                2
              </span>
              <span className="text-[11px] font-bold text-[#0c831f]">6:18 PM</span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Tower A (Opal Block)</h4>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Service lift batch run. Top-down delivery sequence across floors 9, 7, 5, 3, 1.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] space-y-1 text-slate-600 font-medium">
              <p>• <strong>Weight:</strong> 58 kg (9 orders)</p>
              <p>• <strong>Perishables:</strong> Cold insulated tote</p>
              <p>• <strong>Time Saved:</strong> 14 minutes</p>
            </div>
          </div>

          <div className="bg-[#f7f9fc] rounded-xl p-4 border border-slate-200/90 relative group hover:border-[#0c831f] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="w-7 h-7 rounded-full bg-[#0c831f] text-white text-xs font-black flex items-center justify-center">
                3
              </span>
              <span className="text-[11px] font-bold text-[#0c831f]">6:37 PM</span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Tower B (Emerald Block)</h4>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Doorstep drops for 7 flats + 2 lobby concierge held parcels.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] space-y-1 text-slate-600 font-medium">
              <p>• <strong>Weight:</strong> 44 kg (7 orders)</p>
              <p>• <strong>Packaging:</strong> Breathable jute sacks</p>
              <p>• <strong>Staff:</strong> 1 dedicated runner</p>
            </div>
          </div>

          <div className="bg-[#f7f9fc] rounded-xl p-4 border border-slate-200/90 relative group hover:border-[#0c831f] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="w-7 h-7 rounded-full bg-[#0c831f] text-white text-xs font-black flex items-center justify-center">
                4
              </span>
              <span className="text-[11px] font-bold text-[#0c831f]">6:56 PM</span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Tower C & Crate Reclaim</h4>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Bulk master bags delivery + collection of 14 empty farm crates from yesterday.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] space-y-1 text-slate-600 font-medium">
              <p>• <strong>Weight:</strong> 54 kg (6 orders)</p>
              <p>• <strong>Circular Waste:</strong> 0 plastic</p>
              <p>• <strong>Route End:</strong> 7:12 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Drop-off Preferences & Circular System */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preferred Drop-off Method */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Your Preferred Neighborhood Drop Option
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Choose how you want your grouped order received in {neighborhood.shortName}
            </p>
          </div>

          <div className="space-y-2.5">
            <div
              onClick={() => setSelectedDropOption('doorstep')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                selectedDropOption === 'doorstep'
                  ? 'border-[#0c831f] bg-[#f7fff9]'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="w-5 h-5 rounded-full border-2 border-[#0c831f] flex items-center justify-center mt-0.5 shrink-0">
                {selectedDropOption === 'doorstep' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0c831f]" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm">Direct Doorstep Flat Delivery</h4>
                  <span className="text-[11px] font-black text-slate-900 bg-[#E8F4E9] text-[#164E2A] px-2 py-0.5 rounded border border-[#CEE2D1]">
                    FREE on ₹399+ (or ₹30)
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  Delivered straight to your flat door during the tower delivery window.
                </p>
              </div>
            </div>

            <div
              onClick={() => setSelectedDropOption('contactless')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                selectedDropOption === 'contactless'
                  ? 'border-[#0c831f] bg-[#f7fff9]'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="w-5 h-5 rounded-full border-2 border-[#0c831f] flex items-center justify-center mt-0.5 shrink-0">
                {selectedDropOption === 'contactless' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0c831f]" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm">Contactless Doorstep Ring & Drop</h4>
                  <span className="text-[11px] font-black text-[#164E2A] bg-green-100 px-2 py-0.5 rounded">
                    Zero Contact
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  Courier places reusable insulated farm crate at your door, rings bell, and steps back.
                </p>
              </div>
            </div>

            <div
              onClick={() => setSelectedDropOption('captain')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                selectedDropOption === 'captain'
                  ? 'border-[#0c831f] bg-[#f7fff9]'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="w-5 h-5 rounded-full border-2 border-[#0c831f] flex items-center justify-center mt-0.5 shrink-0">
                {selectedDropOption === 'captain' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0c831f]" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm">Tower Captain Hub ({neighborhood.captain.flat})</h4>
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    Host
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  Held with Captain {neighborhood.captain.name}. Pick up when convenient.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Circular Packaging System */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs space-y-4 border border-slate-800">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#f7d046]" />
            <h3 className="text-base font-black text-white">
              Circular & Zero-Waste Packaging
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            <strong>community</strong> operates an endless loop packaging cycle to eliminate single-use plastic bags:
          </p>

          <div className="space-y-2.5">
            <div className="flex items-start gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <Box className="w-5 h-5 text-[#f7d046] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-white">Returnable Farm Crates</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Delivered in food-grade vented crates. Leave yesterday's empty crate at your doorstep for the courier to collect.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <RefreshCw className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-white">Glass Milk Bottle Sterilization</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  A2 cow milk in heavy 1-litre glass bottles. Every returned bottle earns ₹5 community grocery credit.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <Leaf className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-white">Zero Polybags Policy</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Greens and vegetables bundled with natural banana fiber twine and biodegradable paper pouches.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
