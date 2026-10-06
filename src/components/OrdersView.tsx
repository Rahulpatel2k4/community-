import React, { useState } from 'react';
import { NeighborhoodCluster, PaymentMethod } from '../types';
import { Truck, CheckCircle2, Clock, MapPin, Package, ShieldCheck, QrCode, ArrowRight, RefreshCw, Leaf, Home, Building, Wallet, Banknote, Zap } from 'lucide-react';

interface PlacedOrder {
  id: string;
  orderNumber: string;
  items: Array<{ name: string; qty: number; unit: string; price: number; saved: number }>;
  totalAmount: number;
  totalSaved: number;
  slotName: string;
  timeWindow: string;
  deliveryMode: 'pickup' | 'doorstep';
  deliveryFee: number; // 30 or 0
  flatAddress?: string;
  poolWindowName?: string;
  paymentMethod?: PaymentMethod;
  codFee?: number;
  status: 'pooling' | 'harvesting' | 'sorting' | 'out_for_delivery' | 'delivered';
  placedTime: string;
}

interface OrdersViewProps {
  neighborhood: NeighborhoodCluster;
  orders: PlacedOrder[];
  onAdvanceOrderStatus: (orderId: string) => void;
  onOpenCatalog: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  neighborhood,
  orders,
  onAdvanceOrderStatus,
  onOpenCatalog,
}) => {
  const [selectedOrderIndex, setSelectedOrderIndex] = useState<number>(0);

  const activeOrder = orders[selectedOrderIndex] || orders[0];

  const getStepNumber = (status: PlacedOrder['status']): number => {
    switch (status) {
      case 'pooling':
        return 1;
      case 'harvesting':
        return 2;
      case 'sorting':
        return 3;
      case 'out_for_delivery':
        return 4;
      case 'delivered':
        return 5;
    }
  };

  const steps = [
    { title: 'Demand Pooling', desc: 'Neighbors grouping orders to lock bulk tier' },
    { title: 'Farm Harvest & Mandi Gate', desc: 'Direct sourcing from peri-urban growers' },
    { title: 'Community Depot Sorting', desc: 'Packed in reusable crates without single-use plastic' },
    { title: 'Consolidated EV Route', desc: 'Electric mini-van delivering top-down tower sequence' },
    { title: 'Delivered Safely', desc: 'Direct handoff at your apartment house door' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950">
            Neighborhood Batches & Order Tracking
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time status for consolidated eco-deliveries in {neighborhood.name}
          </p>
        </div>

        <button
          onClick={onOpenCatalog}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0c831f] hover:bg-[#0a6e1a] text-white font-extrabold text-xs shadow-md shadow-green-700/20 transition-all self-start sm:self-auto"
        >
          <span>Shop More Fresh Staples</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-200">
            <Package className="w-8 h-8 text-[#0c831f]" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-base">No active orders placed yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-medium">
              Add fresh staples or fruits to the pool to unlock bulk discounts alongside your {neighborhood.activeHouseholds} neighbors!
            </p>
          </div>
          <button
            onClick={onOpenCatalog}
            className="px-5 py-2.5 rounded-xl bg-[#0c831f] text-white font-extrabold text-xs hover:bg-[#0a6e1a] transition-colors shadow-xs"
          >
            Join Ongoing Tower Pool
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Order Selector */}
          <div className="lg:col-span-4 space-y-2.5">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
              Your Society Orders ({orders.length})
            </span>

            {orders.map((ord, idx) => {
              const isSelected = idx === selectedOrderIndex;
              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrderIndex(idx)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#f7fff9] border-[#0c831f] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-black text-slate-950">{ord.orderNumber}</span>
                    <span className="text-[10px] font-extrabold text-[#0c831f] bg-green-100 px-2 py-0.5 rounded-full capitalize">
                      {ord.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-800">{ord.slotName}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mt-0.5">
                    <span>{ord.timeWindow}</span>
                    <span className={`font-bold ${ord.deliveryFee === 0 ? 'text-[#0c831f] bg-green-50 px-1.5 rounded' : 'text-slate-700 bg-amber-100 px-1.5 rounded'}`}>
                      {ord.deliveryFee === 0 ? 'Doorstep (FREE)' : 'Doorstep (₹30)'}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">{ord.items.length} items</span>
                    <div className="flex items-center gap-1.5">
                      {ord.paymentMethod === 'cod' ? (
                        <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300">
                          COD
                        </span>
                      ) : ord.paymentMethod === 'wallet' ? (
                        <span className="text-[10px] font-black bg-green-100 text-[#0c831f] px-1.5 py-0.2 rounded">
                          Wallet
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                          Prepaid
                        </span>
                      )}
                      <span className="font-black text-slate-950">₹{ord.totalAmount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Tracking & Stepper */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-[#0c831f] uppercase tracking-wider bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                    Consolidated Eco-Batch #{activeOrder.orderNumber}
                  </span>
                  {activeOrder.poolWindowName && (
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                      {activeOrder.poolWindowName}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black text-slate-950 mt-1">
                  {activeOrder.slotName} • {neighborhood.shortName}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1 text-slate-900 font-bold bg-[#E8F4E9] border border-[#CEE2D1] px-2.5 py-1 rounded-lg">
                    <Home className="w-3.5 h-3.5 text-[#164E2A]" />
                    <span>Direct Doorstep Delivery: {activeOrder.flatAddress || 'Apartment House Door'} ({activeOrder.deliveryFee === 0 ? 'FREE on ₹399+' : '₹30 Fee'})</span>
                  </span>

                  {/* Payment Method Badge */}
                  {activeOrder.paymentMethod === 'cod' ? (
                    <span className="flex items-center gap-1 text-amber-950 font-bold bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg">
                      <Banknote className="w-3.5 h-3.5 text-amber-800" />
                      <span>Cash On Delivery • Pay ₹{activeOrder.totalAmount} in cash on arrival</span>
                    </span>
                  ) : activeOrder.paymentMethod === 'wallet' ? (
                    <span className="flex items-center gap-1 text-[#0c831f] font-bold bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg">
                      <Wallet className="w-3.5 h-3.5 text-[#0c831f]" />
                      <span>Paid via Community Wallet (1-Click Debit)</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-blue-900 font-bold bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                      <Zap className="w-3.5 h-3.5 text-blue-600" />
                      <span>Prepaid Online (UPI / Card)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Simulation Advance Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAdvanceOrderStatus(activeOrder.id)}
                  className="px-3.5 py-2 rounded-xl bg-[#f7d046] hover:bg-yellow-300 text-slate-950 font-black text-xs shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Simulate Next Stage</span>
                </button>
              </div>
            </div>

            {/* Visual Stepper */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Neighborhood Batch Progress
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {steps.map((st, i) => {
                  const stepNum = i + 1;
                  const currentActiveStep = getStepNumber(activeOrder.status);
                  const isDone = stepNum < currentActiveStep;
                  const isCurrent = stepNum === currentActiveStep;

                  return (
                    <div key={i} className="relative flex items-start gap-3">
                      <div
                        className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ring-4 ring-white ${
                          isDone
                            ? 'bg-[#0c831f] text-white'
                            : isCurrent
                            ? 'bg-[#f7d046] text-slate-950 animate-pulse'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : stepNum}
                      </div>

                      <div className="min-w-0">
                        <h5
                          className={`text-xs font-black ${
                            isCurrent
                              ? 'text-slate-950'
                              : isDone
                              ? 'text-[#0c831f]'
                              : 'text-slate-400'
                          }`}
                        >
                          {st.title} {isCurrent && <span className="text-[10px] bg-yellow-100 text-yellow-900 font-extrabold px-1.5 py-0.2 rounded ml-1.5">In Progress</span>}
                        </h5>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{st.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items Table */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                Items in This Consolidated Batch
              </span>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {activeOrder.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-extrabold text-slate-900">{it.name}</span>
                      <span className="text-slate-500 ml-1.5 font-medium">({it.qty} {it.unit})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-slate-950">₹{it.price * it.qty}</span>
                      <span className="text-[10px] text-[#0c831f] block font-bold">
                        Saved ₹{it.saved} vs Solo
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Fee Line */}
              <div className="flex justify-between items-center text-xs px-2 py-0.5">
                <span className="text-slate-600 font-medium">
                  Direct Doorstep Delivery:
                </span>
                <span className={`font-black ${activeOrder.deliveryFee === 0 ? 'text-[#0c831f]' : 'text-slate-900'}`}>
                  {activeOrder.deliveryFee === 0 ? 'FREE (₹0 • Orders ₹399+)' : '+₹30'}
                </span>
              </div>

              {/* Payment Pricing Line */}
              <div className="flex justify-between items-center text-xs px-2 py-0.5">
                <span className="text-slate-600 font-medium">
                  Payment Surcharge:
                </span>
                <span className={`font-black ${activeOrder.paymentMethod === 'cod' ? 'text-amber-900' : 'text-[#0c831f]'}`}>
                  {activeOrder.paymentMethod === 'cod' ? '+₹15 COD Handling' : '₹0 (Prepaid/Wallet Saved ₹15)'}
                </span>
              </div>

              {/* Total & Eco Savings Footer */}
              <div className="bg-[#1c1c1c] text-white rounded-2xl p-4 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-yellow-300 font-bold">
                    <Leaf className="w-3.5 h-3.5 text-[#0c831f]" />
                    <span>0.32 kg CO2 Saved on this Order</span>
                  </div>
                  <p className="text-slate-400 text-[11px] font-medium">
                    Mode: <strong className="text-white">Direct Doorstep Delivery ({activeOrder.deliveryFee === 0 ? 'FREE' : '₹30'})</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 text-[10px] font-semibold block">Total Paid</span>
                  <span className="text-lg font-black text-[#f7d046]">
                    ₹{activeOrder.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
