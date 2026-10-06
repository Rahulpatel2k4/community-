import React, { useState } from 'react';
import {
  X,
  Wallet,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  ShieldCheck,
  Zap,
  Gift,
  CheckCircle2,
  Clock,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { WalletTransaction } from '../types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  transactions: WalletTransaction[];
  onAddFunds: (amount: number, bonus?: number) => void;
  autoDebitEnabled: boolean;
  onToggleAutoDebit: (enabled: boolean) => void;
  requiredAmount?: number; // If opened from cart when balance is short
}

const TOPUP_PACKS = [
  {
    amount: 500,
    bonus: 25,
    tag: 'Quick Refill',
    highlight: false,
    benefit: 'Save on small everyday pools',
  },
  {
    amount: 1000,
    bonus: 65,
    tag: 'Most Popular (6.5% Extra)',
    highlight: true,
    benefit: 'Covers weekly organic vegetables & milk',
  },
  {
    amount: 2000,
    bonus: 150,
    tag: 'Maximum Value (7.5% Extra)',
    highlight: false,
    benefit: 'Direct farm sack & monthly grocery bulk',
  },
];

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  balance,
  transactions,
  onAddFunds,
  autoDebitEnabled,
  onToggleAutoDebit,
  requiredAmount,
}) => {
  const [selectedPackIndex, setSelectedPackIndex] = useState<number>(1); // Default ₹1000
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'topup' | 'passbook'>('topup');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [topupSuccess, setTopupSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleTopup = (amt: number, bonus: number = 0) => {
    setIsProcessing(true);
    setTimeout(() => {
      onAddFunds(amt, bonus);
      setIsProcessing(false);
      setTopupSuccess(true);
      setTimeout(() => {
        setTopupSuccess(false);
      }, 2000);
    }, 600);
  };

  const handleCustomTopup = () => {
    const val = parseFloat(customAmount);
    if (isNaN(val) || val < 50) return;
    const bonus = val >= 1000 ? Math.round(val * 0.065) : val >= 500 ? Math.round(val * 0.05) : 0;
    handleTopup(val, bonus);
    setCustomAmount('');
    setIsCustomMode(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overscroll-contain"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 flex flex-col max-h-[calc(100dvh-1.5rem)] sm:max-h-[90dvh] h-full sm:h-auto overflow-hidden my-auto font-sans">
        {/* Header - shrink-0 prevents header from shrinking or getting cut off */}
        <div className="shrink-0 p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-white to-[#FFF6F0] z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#164E2A] text-white flex items-center justify-center shadow-xs">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-950 text-base">Community Pool Wallet</h3>
                <span className="text-[10px] font-black bg-[#164E2A] text-white px-2 py-0.5 rounded-full">
                  1-CLICK ZERO OTP
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Pay once, join society bulk runs without repeated OTPs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close wallet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortage Alert if user was redirected from cart - shrink-0 */}
        {requiredAmount && requiredAmount > balance && (
          <div className="shrink-0 bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center gap-2.5 text-xs text-amber-900 z-10">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="flex-1 font-medium">
              Your cart requires <strong>₹{requiredAmount}</strong>. Top up{' '}
              <strong>₹{Math.ceil(requiredAmount - balance)}</strong> to place your order with 1 click!
            </div>
            <button
              onClick={() => {
                const diff = Math.ceil(requiredAmount - balance);
                handleTopup(diff, diff >= 500 ? 25 : 0);
              }}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-black text-[11px] shrink-0 transition-colors cursor-pointer"
            >
              Add ₹{Math.ceil(requiredAmount - balance)}
            </button>
          </div>
        )}

        {/* Body Content - min-h-0 prevents flex items from pushing modal outside screen */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 overscroll-contain">
          {/* Big Balance Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#164E2A] text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-44 h-44 bg-[#F27A24]/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-44 h-44 bg-[#439A52]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#f7d046]" />
                  Available Pool Balance
                </span>
                <span className="text-[11px] font-bold bg-white/10 text-emerald-300 px-2.5 py-0.5 rounded-full border border-white/10">
                  Instant Auto-Debit Ready
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">
                  ₹{balance.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-300 font-medium">INR</span>
              </div>

              {/* Frictionless Benefits Pill Row */}
              <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0c831f] shrink-0" />
                  <span>Saves ₹15 on COD charges</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Zap className="w-3.5 h-3.5 text-[#f7d046] shrink-0" />
                  <span>Locks batch in 1 click</span>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-Debit Feature Switch */}
          <div className="bg-emerald-50/70 border border-green-200/90 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0c831f] text-white flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">
                  Smart Auto-Lock on Pool Cutoff
                </h4>
                <p className="text-[11px] text-slate-500 font-medium leading-tight">
                  Automatically secures your items when batch reaches wholesale target
                </p>
              </div>
            </div>

            <button
              onClick={() => onToggleAutoDebit(!autoDebitEnabled)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                autoDebitEnabled ? 'bg-[#0c831f]' : 'bg-slate-300'
              }`}
              aria-label="Toggle auto debit"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  autoDebitEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Tabs: Recharge vs Passbook */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('topup')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'topup' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Recharge Wallet (+Bonus)</span>
            </button>
            <button
              onClick={() => setActiveTab('passbook')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'passbook' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Passbook & History ({transactions.length})</span>
            </button>
          </div>

          {activeTab === 'topup' ? (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800">Select Instant Recharge Pack:</span>
                <span className="text-[11px] text-[#0c831f] font-bold flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" /> Instant Bonus Cashback Credited
                </span>
              </div>

              {/* Preset Top-up Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {TOPUP_PACKS.map((pack, idx) => {
                  const isSelected = selectedPackIndex === idx && !isCustomMode;
                  return (
                    <div
                      key={pack.amount}
                      onClick={() => {
                        setSelectedPackIndex(idx);
                        setIsCustomMode(false);
                      }}
                      className={`relative rounded-2xl p-3.5 cursor-pointer border-2 transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#164E2A] bg-[#E8F4E9]/60 shadow-xs ring-1 ring-[#164E2A]/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {pack.highlight && (
                        <span className="absolute -top-2.5 right-3 bg-[#F27A24] text-white text-[9px] font-black px-2 py-0.5 rounded-full border border-orange-400 uppercase tracking-tight shadow-2xs">
                          {pack.tag}
                        </span>
                      )}

                      <div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-lg font-black text-slate-950">₹{pack.amount}</span>
                          <span className="text-[10px] font-black text-[#164E2A] bg-[#E8F4E9] px-1.5 py-0.5 rounded border border-[#CEE2D1]">
                            +₹{pack.bonus} Free
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium mt-1 leading-tight">
                          {pack.benefit}
                        </p>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Credits:</span>
                        <span className="font-bold text-slate-900">₹{pack.amount + pack.bonus}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom amount toggle */}
              <div className="bg-[#f7f9fc] border border-slate-200 rounded-2xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">Or Enter Custom Recharge Amount:</span>
                  <span className="text-[10px] text-slate-400 font-medium">Min ₹50</span>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-500 text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={50}
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setIsCustomMode(true);
                      }}
                      placeholder="e.g. 750"
                      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 focus:border-[#164E2A] rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCustomTopup}
                    disabled={!customAmount || parseFloat(customAmount) < 50}
                    className="px-4 py-2 bg-[#164E2A] hover:bg-[#113E21] disabled:bg-slate-300 text-white rounded-xl text-xs font-extrabold transition-colors disabled:cursor-not-allowed cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => {
                  const pack = TOPUP_PACKS[selectedPackIndex];
                  handleTopup(pack.amount, pack.bonus);
                }}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-[#164E2A] hover:bg-[#113E21] text-white font-black text-sm shadow-md shadow-[#164E2A]/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting to UPI / Bank...
                  </span>
                ) : topupSuccess ? (
                  <span className="flex items-center gap-1.5 text-yellow-300">
                    <CheckCircle2 className="w-4 h-4" /> Added to Pool Wallet!
                  </span>
                ) : (
                  <>
                    <span>
                      Add ₹{TOPUP_PACKS[selectedPackIndex].amount} to Wallet (Get ₹
                      {TOPUP_PACKS[selectedPackIndex].amount + TOPUP_PACKS[selectedPackIndex].bonus} in balance)
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#164E2A]" /> 100% Refundable
                </span>
                <span>•</span>
                <span>Supported: UPI, Rupay, Cards, NetBanking</span>
              </div>
            </div>
          ) : (
            /* Passbook History Tab */
            <div className="space-y-2.5">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-medium">
                  No transactions yet in your passbook.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="p-3 sm:p-3.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            tx.type === 'credit'
                              ? 'bg-[#E8F4E9] text-[#164E2A]'
                              : tx.type === 'cashback'
                              ? 'bg-amber-100 text-[#F27A24]'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {tx.type === 'credit' ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : tx.type === 'cashback' ? (
                            <Gift className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>

                        <div>
                          <p className="font-extrabold text-slate-900 leading-tight">
                            {tx.description}
                          </p>
                          <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
                            {tx.date} • Bal: ₹{tx.balanceAfter}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`font-black text-sm block ${
                            tx.type === 'debit' ? 'text-slate-900' : 'text-[#164E2A]'
                          }`}
                        >
                          {tx.type === 'debit' ? '-' : '+'}₹{tx.amount}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                          {tx.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
