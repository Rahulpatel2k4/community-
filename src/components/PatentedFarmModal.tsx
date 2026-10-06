import React, { useState } from 'react';
import { PatentedFarm, Product } from '../types';
import {
  X,
  MapPin,
  Mountain,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Leaf,
  Plus,
  ArrowRight,
  Share2,
  Check,
  FileText,
  BadgeCheck,
  Info,
} from 'lucide-react';
import { calculateCurrentTier } from '../services/poolEngine';

interface PatentedFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  farm: PatentedFarm | null;
  allProducts?: Product[];
  onAddToCart?: (product: Product) => void;
  onOpenProductDetail?: (product: Product) => void;
}

export const PatentedFarmModal: React.FC<PatentedFarmModalProps> = ({
  isOpen,
  onClose,
  farm,
  allProducts = [],
  onAddToCart,
  onOpenProductDetail,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  if (!isOpen || !farm) return null;

  // Find products grown on this specific farm
  const farmProducts = allProducts.filter(
    (p) => p.patentedFarm?.id === farm.id || p.farmOrigin.toLowerCase().includes(farm.name.toLowerCase())
  );

  const handleShare = () => {
    const text = `Check out patented organic farm "${farm.name}" on Community Pool app! Certified 100% pesticide-free.`;
    if (navigator.share) {
      navigator.share({ title: farm.name, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${text} ${window.location.href}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full sm:max-w-lg md:max-w-xl bg-white h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl shadow-2xl flex flex-col font-sans overflow-hidden relative">
        
        {/* TOP FLOATING CONTROLS */}
        <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-3.5 sm:p-4 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md pointer-events-auto">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>PATENTED BIO-FARM PROFILE</span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-90 cursor-pointer"
              title="Share farm profile"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-90 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          
          {/* HERO FARM IMAGE WITH GALLERY */}
          <div className="relative w-full h-64 sm:h-72 bg-slate-900 overflow-hidden">
            <img
              src={farm.galleryImages[activeImageIndex] || farm.heroImage}
              alt={farm.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

            {/* Farm Title on Hero */}
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <span className="text-[10px] uppercase font-black tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-md inline-block mb-1.5">
                Patent #{farm.patentNumber}
              </span>
              <h2 className="text-xl sm:text-2xl font-black leading-tight text-white drop-shadow-md">
                {farm.name}
              </h2>
              <p className="text-xs text-emerald-100 flex items-center gap-1.5 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{farm.location}</span>
                <span>•</span>
                <Mountain className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{farm.altitudeMeters}m ASL</span>
              </p>
            </div>
          </div>

          {/* Thumbnail Gallery Row */}
          {farm.galleryImages.length > 1 && (
            <div className="flex items-center gap-2 p-3 bg-slate-50 border-b border-slate-100 overflow-x-auto no-scrollbar">
              {farm.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-[#0c831f] ring-2 ring-emerald-500/20 shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Farm view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="p-4 sm:p-5 space-y-4">
            
            {/* PATENT DETAILS & BIO-METHOD */}
            <div className="bg-[#F7F9F6] rounded-2xl p-4 border border-[#DFEBDE] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#164E2A] flex items-center gap-1.5 uppercase tracking-wide">
                  <FileText className="w-4 h-4 text-[#0c831f]" />
                  <span>Patented Bio-Method</span>
                </span>
                <span className="text-[10.5px] font-black text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                  Est. {farm.establishedYear}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                "{farm.patentTitle}"
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {farm.description}
              </p>

              {/* Badges / Certifications */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {farm.certifications.map((cert, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-extrabold text-[#164E2A] bg-emerald-50 border border-[#CEE2D1] px-2.5 py-0.5 rounded-full flex items-center gap-1"
                  >
                    <BadgeCheck className="w-3 h-3 text-[#0c831f]" />
                    <span>{cert}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* AWARDS GIVEN BY OUR APP (Explicit User Request!) */}
            <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-white rounded-2xl p-4 border border-amber-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-amber-200/70">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-950">
                      Awards Given by Our App
                    </h3>
                    <p className="text-[10px] text-amber-900/80 font-semibold">
                      Community App Quality & Bio-Soil Verification Council
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full">
                  VERIFIED
                </span>
              </div>

              {/* Award List */}
              <div className="space-y-2">
                {farm.awards.map((award) => (
                  <div
                    key={award.id}
                    className="bg-white/90 rounded-xl p-3 border border-amber-200/80 shadow-2xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{award.icon}</span>
                        <h4 className="font-black text-slate-900 text-xs sm:text-sm">
                          {award.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                        {award.year}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed pl-6">
                      {award.description}
                    </p>

                    <div className="pl-6 pt-0.5 text-[9.5px] font-bold text-slate-400">
                      {award.issuer}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FARM OWNER & MASTER GROWER DETAILS */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                Farm Owner & Master Agronomist
              </span>

              <div className="flex items-start gap-3.5">
                <img
                  src={farm.owner.avatar}
                  alt={farm.owner.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600/30 shrink-0 shadow-xs"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-slate-950 text-sm sm:text-base leading-tight">
                    {farm.owner.name}
                  </h4>
                  <p className="text-xs text-[#0c831f] font-bold mt-0.5">
                    {farm.owner.title}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {farm.owner.experienceYears} Years Dedicated to Chemical-Free Regenerative Agriculture
                  </p>
                </div>
              </div>

              {/* Owner Quote */}
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-amber-200/50 text-xs italic text-slate-700 font-serif leading-relaxed">
                "{farm.owner.quote}"
              </div>
            </div>

            {/* WHEN & WHERE GROWN (SOIL & CLIMATE SPECS) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2.5">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                Where & How Produce Is Grown
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Soil & Substrate</span>
                  <span className="font-bold text-slate-900 mt-0.5 block leading-tight">{farm.soilType}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Elevation & Climate</span>
                  <span className="font-bold text-slate-900 mt-0.5 block leading-tight">{farm.altitudeMeters}m Alpine Ridge</span>
                </div>
              </div>

              {/* Growing Protocols */}
              <div className="space-y-1.5 pt-1">
                {farm.growingMethods.map((method, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0c831f] shrink-0" />
                    <span>{method}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FRESH PRODUCE SOURCED FROM THIS FARM */}
            {farmProducts.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-950">
                      Produce from {farm.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Order directly through neighborhood pooled wholesale batches
                    </p>
                  </div>
                  <span className="text-xs font-black text-[#0c831f] bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                    {farmProducts.length} {farmProducts.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {farmProducts.map((prod) => {
                    const tier = calculateCurrentTier(prod);
                    return (
                      <div
                        key={prod.id}
                        className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs hover:shadow-xs flex items-center gap-3 transition-all"
                      >
                        <div
                          onClick={() => {
                            if (onOpenProductDetail) {
                              onClose();
                              onOpenProductDetail(prod);
                            }
                          }}
                          className="w-16 h-16 rounded-xl bg-slate-50 p-1 flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden cursor-pointer"
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4
                            onClick={() => {
                              if (onOpenProductDetail) {
                                onClose();
                                onOpenProductDetail(prod);
                              }
                            }}
                            className="text-xs font-black text-slate-900 truncate cursor-pointer hover:text-[#0c831f]"
                          >
                            {prod.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-semibold block">
                            {prod.unit}
                          </span>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-xs font-black text-slate-950">
                              ₹{tier.currentPrice}
                            </span>
                            <span className="text-[10px] text-slate-400 line-through">
                              ₹{prod.standardRetailPrice}
                            </span>
                          </div>
                        </div>

                        {onAddToCart && (
                          <button
                            type="button"
                            onClick={() => onAddToCart(prod)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#0c831f] hover:bg-[#0a6e1a] text-white font-black text-[11px] shrink-0 transition-all active:scale-95 cursor-pointer"
                          >
                            + ADD
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM CLOSE BAR */}
        <div className="shrink-0 p-3 bg-white border-t border-slate-200 flex items-center justify-between z-20">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#0c831f]" />
            <span>Community Verified Organic Partner</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-colors cursor-pointer"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
};
