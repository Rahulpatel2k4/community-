import React, { useState } from 'react';
import { NeighborhoodCluster } from '../types';
import { X, Sparkles, Plus } from 'lucide-react';

interface StartPoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  neighborhood: NeighborhoodCluster;
  onPoolCreated: (name: string, targetKg: number, origin: string) => void;
}

export const StartPoolModal: React.FC<StartPoolModalProps> = ({
  isOpen,
  onClose,
  neighborhood,
  onPoolCreated,
}) => {
  const [productName, setProductName] = useState('');
  const [targetKg, setTargetKg] = useState('30');
  const [farmOrigin, setFarmOrigin] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;
    onPoolCreated(productName.trim(), Number(targetKg) || 30, farmOrigin || 'Direct Mandi Mandate');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#f7d046] text-slate-950 flex items-center justify-center font-black">
              c
            </div>
            <div>
              <h3 className="font-black text-slate-950 text-base">Propose a Community Pool</h3>
              <p className="text-xs text-slate-500 font-medium">{neighborhood.shortName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Want your society to bulk-order seasonal Ratnagiri Alphonso mangoes, cold-pressed oils, or 50kg grain bags? Propose it to neighbors!
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-800 block mb-1">Product or Staple Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Organic Ratnagiri Alphonso Mango Crate"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-[#f4f6fb] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#0c831f] font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Target Pool Goal (kg/units)</label>
              <input
                type="number"
                min="5"
                max="500"
                value={targetKg}
                onChange={(e) => setTargetKg(e.target.value)}
                className="w-full bg-[#f4f6fb] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#0c831f] font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">Farm Origin / Mandi</label>
              <input
                type="text"
                placeholder="e.g. Devgad, Maharashtra"
                value={farmOrigin}
                onChange={(e) => setFarmOrigin(e.target.value)}
                className="w-full bg-[#f4f6fb] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-[#0c831f] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Note for Tower Captain & Neighbors</label>
            <textarea
              rows={2}
              placeholder="e.g. Tree-ripened, naturally sweet. If 8 families pledge 3kg each, we can get farmer wholesale pricing."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#f4f6fb] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-[#0c831f] resize-none font-medium"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0c831f] hover:bg-[#0a6e1a] text-white font-black text-xs shadow-md shadow-green-700/20 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Launch Community Pool for {neighborhood.shortName}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
