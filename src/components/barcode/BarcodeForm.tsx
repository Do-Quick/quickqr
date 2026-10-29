import React from 'react';
import { BarcodeConfig, BarcodeFormat } from '../../types/barcode';
import { validateBarcode } from '../../utils/barcodeValidator';
import { AlertCircle, CheckCircle2, Wand2 } from 'lucide-react';

interface BarcodeFormProps {
  config: BarcodeConfig;
  onChange: (newConfig: BarcodeConfig) => void;
}

const barcodeFormats: { id: BarcodeFormat; label: string; desc: string; sample: string }[] = [
  { id: 'CODE128', label: 'CODE 128', desc: 'Universal alphanumeric, logistics, inventory', sample: 'QUICKQR-2026' },
  { id: 'EAN13', label: 'EAN-13', desc: 'Standard retail products worldwide', sample: '590123412345' },
  { id: 'UPC', label: 'UPC-A', desc: 'Standard retail products in USA/Canada', sample: '012345678905' },
  { id: 'EAN8', label: 'EAN-8', desc: 'Compact retail for small packages', sample: '9638507' },
  { id: 'CODE39', label: 'CODE 39', desc: 'Automotive, defense, industrial badges', sample: 'ITEM-42' },
  { id: 'ITF14', label: 'ITF-14', desc: 'Shipping cartons and master packaging', sample: '12345678901231' },
  { id: 'pharmacode', label: 'Pharmacode', desc: 'Pharmaceutical packaging control', sample: '12345' },
  { id: 'codabar', label: 'Codabar', desc: 'Libraries, blood banks, FedEx airbills', sample: 'A12345678B' },
  { id: 'MSI', label: 'MSI / Plessey', desc: 'Supermarkets, warehouse storage shelving', sample: '123456' },
];

export const BarcodeForm: React.FC<BarcodeFormProps> = ({ config, onChange }) => {
  const validation = validateBarcode(config.value, config.format);

  const handleFormatSelect = (fmt: BarcodeFormat) => {
    const selected = barcodeFormats.find((b) => b.id === fmt);
    onChange({
      ...config,
      format: fmt,
      value: selected ? selected.sample : config.value,
    });
  };

  const applySuggestion = () => {
    if (validation.suggestion) {
      onChange({
        ...config,
        value: validation.suggestion,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* 1. Format Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            1. Select Barcode Format
          </label>
          <span className="text-[11px] text-slate-500 font-medium">9 Industry Formats</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {barcodeFormats.map((f) => {
            const isSelected = config.format === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => handleFormatSelect(f.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 font-bold shadow-sm ring-1 ring-brand-500/40'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="text-xs font-bold">{f.label}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{f.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Value Input */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          2. Enter Barcode Value / Data
        </label>
        <div className="relative">
          <input
            type="text"
            value={config.value}
            onChange={(e) => onChange({ ...config, value: e.target.value })}
            placeholder="e.g. 123456789012"
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
          />
        </div>

        {/* Validation Status message */}
        <div className="mt-2">
          {validation.valid ? (
            <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Valid format for {config.format}
              </span>
              {validation.suggestion && (
                <button
                  type="button"
                  onClick={applySuggestion}
                  className="flex items-center gap-1 text-[11px] text-brand-600 dark:text-brand-400 hover:underline font-semibold"
                >
                  <Wand2 className="w-3 h-3" /> Auto-fill Check Digit ({validation.suggestion})
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-2.5">
              <span className="flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" /> {validation.message}
              </span>
              {validation.suggestion && (
                <button
                  type="button"
                  onClick={applySuggestion}
                  className="text-xs bg-rose-100 hover:bg-rose-200 dark:bg-rose-500/20 dark:hover:bg-rose-500/30 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded font-bold transition-colors ml-2"
                >
                  Fix Check Digit
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
