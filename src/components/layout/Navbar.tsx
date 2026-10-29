import React from 'react';
import { QrCode, Barcode, Layers, Scan, Sun, Moon, Laptop } from 'lucide-react';
import type { ThemePreference } from '../../hooks/useTheme';

export type ActiveTab = 'qr' | 'barcode' | 'bulk';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenScanner: () => void;
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenScanner,
  theme,
  setTheme
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 dark:bg-slate-950/85 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('qr')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 via-emerald-600 to-indigo-600 p-[1.5px] shadow-md shadow-brand-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <QrCode className="w-4 h-4 text-brand-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                Quick<span className="text-brand-500 dark:text-brand-400">QR</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                Free
              </span>
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center p-1 bg-slate-200/70 dark:bg-slate-900/90 rounded-2xl border border-slate-300/60 dark:border-slate-800 shadow-inner">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'qr'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Code</span>
          </button>

          <button
            onClick={() => setActiveTab('barcode')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'barcode'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Barcode className="w-3.5 h-3.5" />
            <span>Barcode</span>
          </button>

          <button
            onClick={() => setActiveTab('bulk')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'bulk'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bulk Maker</span>
            <span className="hidden md:inline-block ml-0.5 text-[9px] bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-1 py-0.2 rounded font-bold">PDF/ZIP</span>
          </button>
        </nav>

        {/* Right Tools: Scanner + Theme Selector (Requirement 6) */}
        <div className="flex items-center gap-2">
          {/* Theme Selector Pill (System, Light, Dark) */}
          <div className="flex items-center p-0.5 bg-slate-200/80 dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={() => setTheme('light')}
              title="Light Mode"
              className={`p-1.5 rounded-lg transition-all ${
                theme === 'light'
                  ? 'bg-white text-amber-500 shadow-sm'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setTheme('system')}
              title="System Default Mode"
              className={`p-1.5 rounded-lg transition-all ${
                theme === 'system'
                  ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              title="Dark Mode"
              className={`p-1.5 rounded-lg transition-all ${
                theme === 'dark'
                  ? 'bg-slate-800 text-indigo-400 shadow-sm'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Scanner Button */}
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-slate-200/70 dark:bg-slate-900 hover:bg-slate-300/80 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 rounded-xl transition-all shadow-sm"
            title="Scan QR or Barcode"
          >
            <Scan className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
            <span className="hidden sm:inline">Scanner</span>
          </button>
        </div>

      </div>
    </header>
  );
};
