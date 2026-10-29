import React, { useEffect, useState, useRef } from 'react';
import { env } from '../../config/env';
import { ExternalLink, Sparkles } from 'lucide-react';

export type AdSlotType = 
  | 'top-leaderboard'
  | 'sidebar'
  | 'in-content'
  | 'download-modal'
  | 'footer';

interface GoogleAdProps {
  slotType: AdSlotType;
  className?: string;
}

export const GoogleAd: React.FC<GoogleAdProps> = ({ slotType, className = '' }) => {
  const [adBlocked, setAdBlocked] = useState(false);
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  const slotId = (() => {
    switch (slotType) {
      case 'top-leaderboard': return env.adSlotTopBanner;
      case 'sidebar': return env.adSlotSidebar;
      case 'download-modal': return env.adSlotDownloadModal;
      case 'in-content':
      case 'footer':
      default:
        return env.adSlotFooter;
    }
  })();

  useEffect(() => {
    if (!env.enableAds || pushedRef.current) return;

    try {
      // @ts-expect-error Google adsbygoogle window global
      const adsbygoogle = window.adsbygoogle || [];
      adsbygoogle.push({});
      pushedRef.current = true;
    } catch {
      setAdBlocked(true);
    }

    // Check after 600ms if ad failed to inject iframe (e.g. adblocker active)
    const timer = setTimeout(() => {
      if (insRef.current && (insRef.current.innerHTML.trim() === '' || insRef.current.clientHeight === 0)) {
        setAdBlocked(true);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (!env.enableAds) return null;

  // High-visibility, crisp sponsor creative shown when adblocker prevents third-party script
  const renderFallbackAd = () => {
    if (slotType === 'sidebar') {
      return (
        <div className="w-full bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-5 text-center shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-3 font-semibold">
            <span className="bg-brand-500/15 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full uppercase tracking-wider text-[10px] font-bold">
              Google Ads
            </span>
            <span className="font-mono text-[10px] text-slate-500">{env.adsenseClientId}</span>
          </div>

          <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-3 shadow-inner">
            <span className="text-xl font-black">G</span>
          </div>

          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1.5">
            Google Cloud Platform
          </h4>
          <p className="text-xs text-slate-700 dark:text-slate-300 mb-4 leading-relaxed font-medium">
            Build, test, and deploy applications on Google's global cloud network. Get \$300 in free credits for new accounts.
          </p>

          <a
            href="https://cloud.google.com"
            target="_blank"
            rel="noreferrer"
            className="w-full text-xs font-bold py-2.5 px-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 hover:shadow-brand-500/25"
          >
            <span>Claim \$300 Credit</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      );
    }

    if (slotType === 'download-modal') {
      return (
        <div className="w-full bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-300 dark:border-emerald-800 rounded-xl p-3.5 flex items-center justify-between gap-3 text-left shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded uppercase shrink-0">
              Sponsor
            </span>
            <div>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white block">Print High-Resolution Waterproof Labels</span>
              <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">Order die-cut sticker rolls with 20% instant discount.</span>
            </div>
          </div>
          <a
            href="https://google.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg whitespace-nowrap shadow-md shrink-0"
          >
            Order Labels
          </a>
        </div>
      );
    }

    // Leaderboard & In-content Banner
    return (
      <div className="w-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold bg-indigo-600 text-white px-2.5 py-1 rounded-md uppercase tracking-wider shrink-0">
            Google Ad
          </span>
          <div className="text-xs text-left">
            <span className="font-extrabold text-slate-900 dark:text-white text-sm">Google Workspace: </span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Get custom business domain email, 2TB secure cloud storage, and premium tools.</span>
          </div>
        </div>
        <a
          href="https://workspace.google.com"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-bold px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-md shrink-0"
        >
          <span>Start Free Trial</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  };

  return (
    <div className={`text-center my-3 transition-all ${className}`}>
      <div className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300 mb-1 px-1 font-semibold">
        <span className="uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-500" /> Sponsored Showcase
        </span>
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">AdSlot #{slotId}</span>
      </div>

      <div className="w-full flex justify-center items-center rounded-xl overflow-hidden min-h-[90px]">
        {/* Genuine Google AdSense Tag */}
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: adBlocked ? 'none' : 'block', width: '100%', minHeight: slotType === 'sidebar' ? '250px' : '90px' }}
          data-ad-client={env.adsenseClientId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
          {...(env.enableTestAds ? { 'data-adtest': 'on' } : {})}
        />

        {/* Resilient Display: Always shows even if browser ad-blocker blocks external script */}
        {adBlocked && (
          <div className="w-full">
            {renderFallbackAd()}
          </div>
        )}
      </div>
    </div>
  );
};
