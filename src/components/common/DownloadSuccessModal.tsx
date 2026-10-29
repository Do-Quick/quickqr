import React from 'react';
import { GoogleAd } from './GoogleAd';
import { CheckCircle2, X, Share2 } from 'lucide-react';

interface DownloadSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadSuccessModal: React.FC<DownloadSuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'QuickQR - Free Modern QR & Barcode Generator',
        text: 'Generate custom QR codes with logos and circular styles for free!',
        url: window.location.origin,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.origin);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 shadow-lg shadow-brand-500/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">
          Download Complete!
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-5 leading-relaxed font-medium">
          Your high-resolution code has been saved to your device. Scan it with any phone camera or optical barcode scanner!
        </p>

        {/* Ad Unit Placed in the Success Modal */}
        <div className="my-4">
          <GoogleAd slotType="download-modal" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-brand-500/20 transition-all"
          >
            Create Another Code
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors border border-slate-300 dark:border-slate-700"
          >
            <Share2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Share</span>
          </button>
        </div>

        <div className="mt-4 text-[10px] text-slate-500 dark:text-slate-400">
          QuickQR is 100% free with unlimited generation and no login needed.
        </div>

      </div>
    </div>
  );
};
