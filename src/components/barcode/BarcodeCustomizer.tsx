import React from 'react';
import type { BarcodeConfig } from '../../types/barcode';
import { Type, Palette, Printer, ShieldCheck, AlertTriangle } from 'lucide-react';

interface BarcodeCustomizerProps {
  config: BarcodeConfig;
  onChange: (newConfig: BarcodeConfig) => void;
}

export const BarcodeCustomizer: React.FC<BarcodeCustomizerProps> = ({ config, onChange }) => {
  const handlePrintSafeToggle = (checked: boolean) => {
    if (checked) {
      onChange({
        ...config,
        printSafeMode: true,
        margin: Math.max(config.margin, 20),
        height: Math.max(config.height, 75),
        lineColor: '#000000',
        background: '#ffffff',
        transparentBackground: false,
      });
    } else {
      onChange({
        ...config,
        printSafeMode: false,
      });
    }
  };

  const isColoredBar = config.lineColor !== '#000000' && !config.printSafeMode;

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          3. Styling & Scanner Reliability
        </label>

        {/* Print-Safe Scanner Guarantee Toggle */}
        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-1 rounded-xl">
          <Printer className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <label htmlFor="printSafeBarcode" className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 cursor-pointer">
            Print-Safe (100% Scan Guarantee)
          </label>
          <input
            type="checkbox"
            id="printSafeBarcode"
            checked={config.printSafeMode}
            onChange={(e) => handlePrintSafeToggle(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-emerald-600 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700"
          />
        </div>
      </div>

      {/* Requirement 9: Prominent Display Text Toggle */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-indigo-500" /> Display Text Label Under Barcode
          </span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Choose whether to show the alphanumeric value</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...config, displayValue: true })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              config.displayValue
                ? 'bg-brand-500 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            Show Text
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...config, displayValue: false })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !config.displayValue
                ? 'bg-brand-500 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            Hide Text
          </button>
        </div>
      </div>

      {/* Warning if colored bars are used that laser scanners can't read */}
      {isColoredBar && (
        <div className="p-2.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
          <span>Tip: Optical & laser scanners require pure black bars on white for 100% scan accuracy.</span>
        </div>
      )}

      {/* Dimensions & Scale */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 mb-1">
            <span>Bar Height</span>
            <span className="font-mono text-brand-600 dark:text-brand-400 font-bold">{config.height}px</span>
          </div>
          <input
            type="range"
            min="40"
            max="180"
            step="5"
            value={config.height}
            onChange={(e) => onChange({ ...config, height: parseInt(e.target.value, 10) })}
            className="w-full accent-brand-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 mb-1">
            <span>Bar Width Scale</span>
            <span className="font-mono text-brand-600 dark:text-brand-400 font-bold">{config.width}x</span>
          </div>
          <input
            type="range"
            min="1.5"
            max="4"
            step="0.2"
            value={config.width}
            onChange={(e) => onChange({ ...config, width: parseFloat(e.target.value) })}
            className="w-full accent-brand-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 mb-1">
            <span>Quiet Margin</span>
            <span className="font-mono text-brand-600 dark:text-brand-400 font-bold">{config.margin}px</span>
          </div>
          <input
            type="range"
            min="10"
            max="30"
            step="2"
            value={config.margin}
            onChange={(e) => onChange({ ...config, margin: parseInt(e.target.value, 10) })}
            className="w-full accent-brand-500"
          />
        </div>
      </div>

      {/* Text Options if enabled */}
      {config.displayValue && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Text Position</label>
            <select
              value={config.textPosition}
              onChange={(e) => onChange({ ...config, textPosition: e.target.value as any })}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white"
            >
              <option value="bottom">Bottom</option>
              <option value="top">Top</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Text Alignment</label>
            <select
              value={config.textAlign}
              onChange={(e) => onChange({ ...config, textAlign: e.target.value as any })}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white"
            >
              <option value="center">Center</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Font Size</label>
            <input
              type="number"
              min="10"
              max="28"
              value={config.fontSize}
              onChange={(e) => onChange({ ...config, fontSize: parseInt(e.target.value, 10) || 16 })}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white font-mono"
            />
          </div>
        </div>
      )}

      {/* Colors */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Bar Line Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.lineColor}
                onChange={(e) => onChange({ ...config, lineColor: e.target.value })}
                className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={config.lineColor}
                onChange={(e) => onChange({ ...config, lineColor: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.background}
                disabled={config.transparentBackground}
                onChange={(e) => onChange({ ...config, background: e.target.value })}
                className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer disabled:opacity-40"
              />
              <input
                type="text"
                value={config.background}
                disabled={config.transparentBackground}
                onChange={(e) => onChange({ ...config, background: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white font-mono uppercase disabled:opacity-40"
              />
            </div>
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-2">
          <input
            type="checkbox"
            id="barTransp"
            checked={config.transparentBackground}
            onChange={(e) => onChange({ ...config, transparentBackground: e.target.checked })}
            className="w-4 h-4 rounded text-brand-500 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700"
          />
          <label htmlFor="barTransp" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            Transparent background (PNG / SVG)
          </label>
        </div>
      </div>
    </div>
  );
};
