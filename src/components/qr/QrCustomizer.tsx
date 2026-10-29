import React, { useRef } from 'react';
import type { 
  QrCodeConfig, 
  DotType, 
  CornerSquareType, 
  CornerDotType, 
  ErrorCorrectionLevel,
  LogoPosition 
} from '../../types/qr';
import { PRESET_LOGOS } from '../../utils/svgPresets';
import { 
  Paintbrush, 
  Shapes, 
  Image as ImageIcon, 
  ShieldCheck, 
  LayoutTemplate, 
  Upload, 
  Trash2, 
  Printer 
} from 'lucide-react';

interface QrCustomizerProps {
  config: QrCodeConfig;
  onChange: (newConfig: QrCodeConfig) => void;
}

const colorPresets = [
  { name: 'Emerald', c1: '#10b981', c2: '#047857' },
  { name: 'Cyberpunk', c1: '#06b6d4', c2: '#ec4899' },
  { name: 'Sunset', c1: '#f59e0b', c2: '#ef4444' },
  { name: 'Royal', c1: '#6366f1', c2: '#a855f7' },
  { name: 'Ocean', c1: '#3b82f6', c2: '#0284c7' },
  { name: 'Classic Black', c1: '#000000', c2: '#0f172a' },
];

export const QrCustomizer: React.FC<QrCustomizerProps> = ({ config, onChange }) => {
  const [activeSubTab, setActiveSubTab] = React.useState<'patterns' | 'colors' | 'logo' | 'frame'>('patterns');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({
          ...config,
          logoImage: event.target?.result as string,
          errorCorrectionLevel: 'H',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    onChange({
      ...config,
      logoImage: undefined,
      logoPreset: undefined,
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Toggle Print-Safe Scanner Guarantee Mode
  const handlePrintSafeToggle = (checked: boolean) => {
    if (checked) {
      onChange({
        ...config,
        printSafeMode: true,
        errorCorrectionLevel: 'H',
        dotColor: '#000000',
        backgroundColor: '#ffffff',
        transparentBackground: false,
        colorType: 'single',
      });
    } else {
      onChange({
        ...config,
        printSafeMode: false,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          3. Style & Customization
        </label>
        
        {/* Print-Safe Scanner Guarantee Toggle */}
        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-1 rounded-xl">
          <Printer className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <label htmlFor="printSafeQr" className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 cursor-pointer">
            Print-Safe (100% Scan Guarantee)
          </label>
          <input
            type="checkbox"
            id="printSafeQr"
            checked={config.printSafeMode}
            onChange={(e) => handlePrintSafeToggle(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-emerald-600 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveSubTab('patterns')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'patterns'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Shapes className="w-3.5 h-3.5 text-brand-500" />
          <span>Shapes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('colors')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'colors'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Paintbrush className="w-3.5 h-3.5 text-indigo-500" />
          <span>Colors</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('logo')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'logo'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
          <span>Logo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('frame')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'frame'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5 text-emerald-500" />
          <span>Frame</span>
        </button>
      </div>

      {/* 1. SHAPES TAB */}
      {activeSubTab === 'patterns' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Body Pattern (Circles / Dots / Rounded / Square)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: 'dots', label: 'Circle Dots' },
                { id: 'rounded', label: 'Rounded' },
                { id: 'classy', label: 'Classy' },
                { id: 'classy-rounded', label: 'Curved' },
                { id: 'extra-rounded', label: 'Pill' },
                { id: 'square', label: 'Square' },
              ].map((dot) => (
                <button
                  key={dot.id}
                  type="button"
                  onClick={() => onChange({ ...config, dotType: dot.id as DotType })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    config.dotType === dot.id
                      ? 'bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 font-bold ring-1 ring-brand-500/50 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs block">{dot.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Corner Outer Eye</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'dot', label: 'Circle' },
                  { id: 'extra-rounded', label: 'Rounded' },
                  { id: 'square', label: 'Square' },
                ].map((sq) => (
                  <button
                    key={sq.id}
                    type="button"
                    onClick={() => onChange({ ...config, cornerSquareType: sq.id as CornerSquareType })}
                    className={`p-2 rounded-xl border text-center text-xs transition-all ${
                      config.cornerSquareType === sq.id
                        ? 'bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 font-bold shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {sq.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Corner Inner Pupil</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'dot', label: 'Dot Pupil' },
                  { id: 'square', label: 'Square Pupil' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onChange({ ...config, cornerDotType: p.id as CornerDotType })}
                    className={`p-2 rounded-xl border text-center text-xs transition-all ${
                      config.cornerDotType === p.id
                        ? 'bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 font-bold shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 2. COLORS TAB */}
      {activeSubTab === 'colors' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Color Presets</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...config,
                      colorType: 'gradient',
                      dotColor: preset.c1,
                      gradientColor2: preset.c2,
                      cornerSquareColor: preset.c1,
                      cornerDotColor: preset.c2,
                    })
                  }
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-left"
                >
                  <div
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{ background: `linear-gradient(135deg, ${preset.c1}, ${preset.c2})` }}
                  />
                  <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onChange({ ...config, colorType: 'single' })}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                config.colorType === 'single'
                  ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Solid Color
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...config, colorType: 'gradient' })}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                config.colorType === 'gradient'
                  ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Gradient
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {config.colorType === 'gradient' ? 'Start Color' : 'QR Color'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.dotColor}
                  onChange={(e) => onChange({ ...config, dotColor: e.target.value })}
                  className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={config.dotColor}
                  onChange={(e) => onChange({ ...config, dotColor: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white uppercase font-mono"
                />
              </div>
            </div>

            {config.colorType === 'gradient' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">End Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.gradientColor2}
                    onChange={(e) => onChange({ ...config, gradientColor2: e.target.value })}
                    className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.gradientColor2}
                    onChange={(e) => onChange({ ...config, gradientColor2: e.target.value })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white uppercase font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.backgroundColor}
                  disabled={config.transparentBackground}
                  onChange={(e) => onChange({ ...config, backgroundColor: e.target.value })}
                  className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer disabled:opacity-40"
                />
                <input
                  type="text"
                  value={config.backgroundColor}
                  disabled={config.transparentBackground}
                  onChange={(e) => onChange({ ...config, backgroundColor: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white font-mono uppercase disabled:opacity-40"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="transpBg"
                checked={config.transparentBackground}
                onChange={(e) => onChange({ ...config, transparentBackground: e.target.checked })}
                className="w-4 h-4 rounded text-brand-500 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 focus:ring-brand-500"
              />
              <label htmlFor="transpBg" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer font-medium">
                Transparent Background
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 3. LOGO TAB */}
      {activeSubTab === 'logo' && (
        <div className="space-y-4">
          {/* Logo upload */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 rounded-2xl p-4 text-center transition-all bg-slate-50 dark:bg-slate-950/40">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="hidden"
            />
            {config.logoImage ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-800 p-2 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-md">
                  <img src={config.logoImage} alt="Uploaded logo" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-800 dark:text-slate-200 transition-colors font-medium"
                  >
                    Change Logo
                  </button>
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="text-xs bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()} 
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Upload className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Click to upload your logo</span>
                  <span className="text-[11px] text-slate-500">PNG, SVG, JPG, WebP</span>
                </div>
              </div>
            )}
          </div>

          {/* Preset icons */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Preset App Icons</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_LOGOS.map((preset) => {
                const isSelected = config.logoPreset === preset.name || config.logoImage === preset.svg;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...config,
                        logoImage: preset.svg,
                        logoPreset: preset.name,
                        errorCorrectionLevel: 'H',
                      })
                    }
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 font-bold shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="text-lg">{preset.icon}</span>
                    <span className="text-[10px] truncate">{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logo Position & Sliders */}
          {config.logoImage && (
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Logo Placement Position</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['center', 'top', 'bottom', 'left', 'right'] as LogoPosition[]).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => onChange({ ...config, logoPosition: pos })}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold uppercase border transition-all ${
                        config.logoPosition === pos
                          ? 'bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 mb-1">
                  <span>Logo Size</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400 font-bold">{Math.round(config.logoSize * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.15"
                  max="0.35"
                  step="0.01"
                  value={config.logoSize}
                  onChange={(e) => onChange({ ...config, logoSize: parseFloat(e.target.value) })}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 mb-1">
                  <span>Logo Margin / Padding</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400 font-bold">{config.logoMargin}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="16"
                  step="1"
                  value={config.logoMargin}
                  onChange={(e) => onChange({ ...config, logoMargin: parseInt(e.target.value, 10) })}
                  className="w-full accent-brand-500"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. FRAME TAB */}
      {activeSubTab === 'frame' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Frame / Banner Style</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'none', label: 'No Frame' },
                { id: 'bottom-banner', label: 'Bottom Banner' },
                { id: 'card', label: 'Card Badge' },
                { id: 'badge', label: 'Pill Tag' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onChange({ ...config, frameStyle: f.id as any })}
                  className={`p-2 rounded-xl border text-center text-xs font-medium transition-all ${
                    config.frameStyle === f.id
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {config.frameStyle !== 'none' && (
            <div className="space-y-3 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Call To Action Text</label>
                <input
                  type="text"
                  value={config.frameText}
                  onChange={(e) => onChange({ ...config, frameText: e.target.value })}
                  placeholder="e.g. SCAN ME or VISIT US"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Frame Color</label>
                  <input
                    type="color"
                    value={config.frameColor}
                    onChange={(e) => onChange({ ...config, frameColor: e.target.value })}
                    className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Text Color</label>
                  <input
                    type="color"
                    value={config.frameTextColor}
                    onChange={(e) => onChange({ ...config, frameTextColor: e.target.value })}
                    className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error Correction Level */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-500" /> Scanner Reliability Level
              </label>
              <span className="text-[10px] text-slate-500">Protects against damage / folds</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'L', label: 'L (7%)' },
                { id: 'M', label: 'M (15%)' },
                { id: 'Q', label: 'Q (25%)' },
                { id: 'H', label: 'H (30%)', badge: 'Best for Logo' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => onChange({ ...config, errorCorrectionLevel: lvl.id as ErrorCorrectionLevel })}
                  className={`p-2 rounded-xl border text-center text-xs transition-all ${
                    config.errorCorrectionLevel === lvl.id
                      ? 'bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div>{lvl.label}</div>
                  {lvl.badge && <div className="text-[8px] text-brand-600 dark:text-brand-400 font-medium">{lvl.badge}</div>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
