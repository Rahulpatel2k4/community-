import React, { useState } from 'react';
import { NeighborhoodCluster } from '../types';
import { X, Copy, Check, Users, MessageCircle } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  neighborhood: NeighborhoodCluster;
}

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, neighborhood }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `Hey neighbors in ${neighborhood.name}! 👋
We are currently pooling orders on community to unlock 40% wholesale farm prices on fresh vegetables, A2 milk, and organic staples with direct doorstep delivery (FREE delivery on orders above ₹399).

Next batch is closing soon! Join our society pool here:
https://community.freshpool.in/pool/${neighborhood.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
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
              <h3 className="font-black text-slate-950 text-base">Invite Tower Neighbors</h3>
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
          The more households that join from your tower, the quicker the collective progress bar unlocks the maximum <strong>Farm Gate 50% discount</strong> for everyone!
        </p>

        {/* Message preview box */}
        <div className="bg-[#f7f9fc] border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 font-mono whitespace-pre-line leading-relaxed break-all break-words overflow-hidden">
          {shareText}
        </div>

        {/* Action buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleWhatsApp}
            className="w-full py-3 rounded-xl bg-[#0c831f] hover:bg-[#0a6e1a] text-white font-black text-xs shadow-md shadow-green-700/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Share to Tower WhatsApp Group</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#0c831f]" />
                <span className="text-[#0c831f] font-black">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-600" />
                <span>Copy Invitation Message</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
