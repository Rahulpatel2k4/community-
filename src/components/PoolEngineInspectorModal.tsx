import React, { useState } from 'react';
import { Product } from '../types';
import {
  getProductUnit,
  calculateLandedCost,
  calculateMinimumSafePrice,
  getNormalizedPriceTiers,
  calculatePoolPrice,
  calculateNextPriceTier,
  calculatePoolProgress,
  calculatePoolStatus,
  calculateProcurementQuantity,
  formatPricePerUnit,
  formatQuantity,
  getPoolSummary,
} from '../services/poolEngine';
import {
  X,
  Sliders,
  DollarSign,
  TrendingDown,
  Layers,
  ShieldCheck,
  Truck,
  Package,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface PoolEngineInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProductQuantity?: (productId: string, newQty: number) => void;
}

export const PoolEngineInspectorModal: React.FC<PoolEngineInspectorModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProductQuantity,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const activeProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Simulator quantity override
  const [simulatedQuantity, setSimulatedQuantity] = useState<number | null>(null);

  if (!isOpen || !activeProduct) return null;

  const currentEffectiveQty =
    simulatedQuantity !== null
      ? simulatedQuantity
      : activeProduct.currentQuantity ?? activeProduct.currentPoolKg ?? 0;

  const { unitType, baseUnit, unitPriceLabel } = getProductUnit(activeProduct);
  const landedCost = calculateLandedCost(activeProduct);
  const minimumSafePrice = calculateMinimumSafePrice(activeProduct);
  const normalPrice = activeProduct.normalPrice ?? activeProduct.standardRetailPrice;
  const tiers = getNormalizedPriceTiers(activeProduct);

  const activePoolPrice = calculatePoolPrice(activeProduct, currentEffectiveQty);
  const nextTier = calculateNextPriceTier(activeProduct, currentEffectiveQty);
  const progressPercent = calculatePoolProgress(activeProduct, currentEffectiveQty);
  const poolStatus = calculatePoolStatus(activeProduct, currentEffectiveQty);
  const procurement = calculateProcurementQuantity(activeProduct, currentEffectiveQty);

  const maxCapacity = activeProduct.maximumPoolQuantity ?? activeProduct.maxTierCapacityKg ?? 150;
  const targetMOQ = activeProduct.targetPoolQuantity ?? activeProduct.poolTargetKg ?? 100;
  const minPool = activeProduct.minimumPoolQuantity ?? 25;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pool-engine-inspector-title"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-[#DFEBDE]">
        {/* Header */}
        <div className="bg-[#164E2A] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-black">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="pool-engine-inspector-title" className="text-base sm:text-lg font-black tracking-tight">
                  Pool Engine & Economics Inspector
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#F27A24] text-white">
                  Live Truth Engine
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium">
                Unit-aware pricing, landed cost floor & supplier procurement rules
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer text-white"
            aria-label="Close Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Product Selector Bar */}
          <div>
            <label className="text-xs font-black text-slate-700 block mb-1.5 uppercase tracking-wider">
              Select Product to Inspect:
            </label>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {products.map((p) => {
                const isSelected = p.id === activeProduct.id;
                const pUnit = getProductUnit(p);
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProductId(p.id);
                      setSimulatedQuantity(null);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#164E2A] text-white border-[#164E2A] shadow-xs'
                        : 'bg-[#F7F9F6] hover:bg-[#EEF3EE] text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{p.name.split(' ')[0]}</span>
                    <span
                      className={`text-[10px] px-1 rounded ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {pUnit.baseUnit}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Key Product Metadata Strip */}
          <div className="bg-[#F7F9F6] p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                Product & Category
              </span>
              <h3 className="text-sm font-black text-slate-900">{activeProduct.name}</h3>
              <p className="text-xs text-slate-500 font-medium">
                Unit Type: <strong className="text-slate-800">{unitType}</strong> • Base Unit:{' '}
                <strong className="text-slate-800">{baseUnit}</strong> • Perishability:{' '}
                <strong className="text-slate-800">{activeProduct.perishabilityLevel || 'HIGH'}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3 text-right">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Normal Retail</span>
                <span className="text-sm font-black text-slate-900">
                  {formatPricePerUnit(normalPrice, baseUnit)}
                </span>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                <span className="text-[10px] text-emerald-800 font-bold block uppercase">Current Pool</span>
                <span className="text-sm font-black text-[#164E2A]">
                  {formatPricePerUnit(activePoolPrice, baseUnit)}
                </span>
              </div>
            </div>
          </div>

          {/* Real-Time Pool Quantity Simulator */}
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#F27A24]" />
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Interactive Pool Quantity Simulator
                </span>
              </div>
              <button
                onClick={() => setSimulatedQuantity(null)}
                className="text-[11px] font-bold text-[#F27A24] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset to live ({activeProduct.currentQuantity ?? activeProduct.currentPoolKg} {baseUnit})</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="range"
                min="0"
                max={maxCapacity}
                step={activeProduct.orderIncrement || 1}
                value={currentEffectiveQty}
                onChange={(e) => setSimulatedQuantity(Number(e.target.value))}
                className="w-full accent-[#164E2A] cursor-pointer"
              />
              <div className="shrink-0 flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max={maxCapacity}
                  value={currentEffectiveQty}
                  onChange={(e) => setSimulatedQuantity(Math.max(0, Number(e.target.value)))}
                  className="w-20 px-2.5 py-1.5 rounded-xl border border-slate-300 font-black text-sm text-center bg-white"
                />
                <span className="text-xs font-bold text-slate-700">{baseUnit}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold pt-1">
              <span>0 {baseUnit}</span>
              <span>Min to Oper: {minPool} {baseUnit}</span>
              <span>Target MOQ: {targetMOQ} {baseUnit}</span>
              <span>Max Capacity: {maxCapacity} {baseUnit}</span>
            </div>
          </div>

          {/* 3-Column Engine Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Landed Cost & Safe Floor */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#164E2A] border-b pb-2">
                <DollarSign className="w-4 h-4" />
                <span>1. Cost Breakdown & Floor</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Supplier Cost:</span>
                  <span className="font-bold">₹{activeProduct.supplierCost ?? Math.round(activeProduct.basePrice * 0.75)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Transport & Logistics:</span>
                  <span className="font-bold">₹{activeProduct.transportCost ?? 3}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Packaging & Crating:</span>
                  <span className="font-bold">₹{activeProduct.packagingCost ?? 1}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Payment Gateway & Cloud:</span>
                  <span className="font-bold">₹{activeProduct.paymentCost ?? 1}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Operations & Hub Drop:</span>
                  <span className="font-bold">₹{activeProduct.operationalCost ?? 1}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Wastage Reserve ({activeProduct.wastageReservePercent ?? 5}%):</span>
                  <span className="font-bold">₹{activeProduct.wastageReserve ?? 2}</span>
                </div>

                <div className="pt-2 border-t border-dashed flex justify-between font-black text-slate-900">
                  <span>Landed Cost Per Unit:</span>
                  <span>₹{landedCost}{unitPriceLabel}</span>
                </div>

                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-[#164E2A] font-bold text-[11px] leading-tight">
                  <div className="flex items-center gap-1 mb-0.5 font-black text-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Safe Price Floor: ₹{minimumSafePrice}{unitPriceLabel}</span>
                  </div>
                  <span>Includes {activeProduct.requiredMarginPercent ?? 8}% mandatory margin. Engine never sells below this.</span>
                </div>
              </div>
            </div>

            {/* Column 2: Quantity-Based Price Tiers */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#164E2A] border-b pb-2">
                <Layers className="w-4 h-4" />
                <span>2. Quantity Price Tiers</span>
              </div>

              <div className="space-y-2">
                {tiers.map((t, idx) => {
                  const isActive =
                    currentEffectiveQty >= t.minQuantity &&
                    (t.maxQuantity === null || currentEffectiveQty <= t.maxQuantity);

                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border transition-all text-xs ${
                        isActive
                          ? 'bg-[#E8F4E9] border-[#164E2A] ring-1 ring-[#164E2A]'
                          : 'bg-[#F7F9F6] border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-black">
                        <span className={isActive ? 'text-[#164E2A]' : 'text-slate-800'}>
                          Tier {idx + 1}: {t.minQuantity}
                          {t.maxQuantity !== null ? `–${t.maxQuantity}` : '+'} {baseUnit}
                        </span>
                        <span className="text-sm font-black text-[#164E2A]">
                          {formatPricePerUnit(t.price, baseUnit)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                        <span>{t.label || 'Quantity Tier'}</span>
                        <span className="font-bold text-[#F27A24]">
                          {Math.round(((normalPrice - t.price) / normalPrice) * 100)}% Discount
                        </span>
                      </div>
                    </div>
                  );
                })}

                {nextTier ? (
                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs">
                    <span className="font-black text-[#F27A24] block">Next Tier Target</span>
                    <span className="text-slate-700">
                      Need <strong>{formatQuantity(nextTier.remainingQuantity, baseUnit)}</strong> more to reach{' '}
                      <strong>{formatPricePerUnit(nextTier.nextPrice, baseUnit)}</strong>
                    </span>
                  </div>
                ) : (
                  <div className="bg-green-50 p-2.5 rounded-xl border border-green-200 text-xs font-bold text-[#164E2A]">
                    ✓ Maximum Community Discount Unlocked!
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: Supplier Procurement & Wastage */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#164E2A] border-b pb-2">
                <Truck className="w-4 h-4" />
                <span>3. Supplier Procurement</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Customer Ordered Demand:</span>
                  <span className="font-bold">{formatQuantity(currentEffectiveQty, baseUnit)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Wastage Buffer ({procurement.wastageReservePercent}%):</span>
                  <span className="font-bold">+{procurement.wastageBufferQuantity} {baseUnit}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Supplier Order Increment:</span>
                  <span className="font-bold">{procurement.supplierOrderIncrement} {baseUnit}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Supplier Minimum MOQ:</span>
                  <span className="font-bold">{procurement.supplierMOQ} {baseUnit}</span>
                </div>

                <div className="pt-2 border-t border-dashed flex justify-between font-black text-slate-900">
                  <span>Final Supplier Purchase:</span>
                  <span className="text-[#164E2A] font-black text-sm">
                    {formatQuantity(procurement.finalSupplierPurchaseQuantity, baseUnit)}
                  </span>
                </div>

                <p className="text-[10px] text-slate-500 font-medium">
                  Customers only pay for ordered {currentEffectiveQty} {baseUnit}. The extra {procurement.wastageBufferQuantity} {baseUnit} is business-side buffer.
                </p>

                <div className="bg-slate-100 p-2.5 rounded-xl text-[11px] font-bold text-slate-700">
                  <span>Estimated Supplier Payout: ₹{procurement.totalCostEstimate.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Pool Engine Status: {poolStatus}</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#164E2A] hover:bg-[#113E21] text-white text-xs font-black transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
