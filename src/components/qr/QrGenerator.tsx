import React, { useState } from 'react';
import { QrCodeConfig } from '../../types/qr';
import { QrContentTypeSelector } from './QrContentTypeSelector';
import { QrInputs } from './QrInputs';
import { QrCustomizer } from './QrCustomizer';
import { QrPreview } from './QrPreview';
import { GoogleAd } from '../common/GoogleAd';

import { PRESET_LOGOS } from '../../utils/svgPresets';

interface QrGeneratorProps {
  onDownloadSuccess: () => void;
}

export const QrGenerator: React.FC<QrGeneratorProps> = ({ onDownloadSuccess }) => {
  const [config, setConfig] = useState<QrCodeConfig>({
    content: 'https://quickqr.app',
    contentType: 'url',
    dotType: 'rounded',
    colorType: 'single',
    dotColor: '#000000',
    gradientType: 'linear',
    gradientColor2: '#000000',
    gradientRotation: 45,
    cornerSquareType: 'extra-rounded',
    cornerSquareColor: '#000000',
    cornerDotType: 'dot',
    cornerDotColor: '#000000',
    backgroundColor: '#ffffff',
    transparentBackground: false,
    logoImage: undefined,
    logoPreset: undefined,
    logoSize: 0.24,
    logoMargin: 6,
    logoPosition: 'center',
    hideBehindLogo: true,
    errorCorrectionLevel: 'M',
    printSafeMode: false,
    width: 1024,
    height: 1024,
    dpi: 300,
    quality: 0.95,
    frameStyle: 'none',
    frameText: 'SCAN ME',
    frameColor: '#000000',
    frameTextColor: '#ffffff',
  });

  const handleContentTypeSelect = React.useCallback((type: any) => {
    setConfig((prev) => {
      if (prev.contentType === type) return prev;

      let newLogo = prev.logoImage;
      let newPreset = prev.logoPreset;
      let newErrLevel = prev.errorCorrectionLevel;

      // Automatically attach matching official logos for UPI and relevant formats
      if (type === 'upi') {
        const upiLogo = PRESET_LOGOS.find((l) => l.name === 'BHIM UPI');
        if (upiLogo) {
          newLogo = upiLogo.svg;
          newPreset = 'BHIM UPI';
          newErrLevel = 'H';
        }
      } else if (type === 'wifi') {
        const wifiLogo = PRESET_LOGOS.find((l) => l.name === 'WiFi');
        if (wifiLogo) {
          newLogo = wifiLogo.svg;
          newPreset = 'WiFi';
          newErrLevel = 'H';
        }
      } else if (type === 'social') {
        const igLogo = PRESET_LOGOS.find((l) => l.name === 'Instagram');
        if (igLogo) {
          newLogo = igLogo.svg;
          newPreset = 'Instagram';
          newErrLevel = 'H';
        }
      }

      return {
        ...prev,
        contentType: type,
        logoImage: newLogo,
        logoPreset: newPreset,
        errorCorrectionLevel: newErrLevel,
      };
    });
  }, []);

  const handleContentChange = React.useCallback((newPayload: string) => {
    setConfig((prev) => {
      if (prev.content === newPayload) return prev;
      return { ...prev, content: newPayload };
    });
  }, []);

  // Quick 1-click Logo Presets
  const handleQuickLogoSelect = (presetName: string | null) => {
    if (!presetName) {
      setConfig((prev) => ({
        ...prev,
        logoImage: undefined,
        logoPreset: undefined,
        errorCorrectionLevel: 'M',
      }));
      return;
    }

    const found = PRESET_LOGOS.find((l) => l.name === presetName);
    if (found) {
      setConfig((prev) => ({
        ...prev,
        logoImage: found.svg,
        logoPreset: found.name,
        errorCorrectionLevel: 'H', // High error correction guarantees 100% scannability with logo
      }));
    }
  };

  return (
    <div id="qr-generator" className="space-y-6">
      {/* Top Banner Ad with high viewability */}
      <GoogleAd slotType="top-leaderboard" />

      {/* Main Generator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Controls & Customizers (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <QrContentTypeSelector
            selectedType={config.contentType}
            onSelectType={handleContentTypeSelect}
          />

          <QrInputs
            contentType={config.contentType}
            onContentChange={handleContentChange}
          />

          {/* Quick 1-Click Brand & App Logo Bar */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  ✨ Quick Brand Logos (1-Click Add)
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Instant scannable logos with automatic 30% error correction
                </span>
              </div>
              {config.logoImage && (
                <button
                  type="button"
                  onClick={() => handleQuickLogoSelect(null)}
                  className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-lg transition-colors"
                >
                  Remove Logo
                </button>
              )}
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
              {/* None option */}
              <button
                type="button"
                onClick={() => handleQuickLogoSelect(null)}
                className={`py-1.5 px-1 rounded-xl text-center border text-[11px] font-medium transition-all ${
                  !config.logoImage
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white font-bold shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                None
              </button>

              {PRESET_LOGOS.map((p) => {
                const isSelected = config.logoImage === p.svg || config.logoPreset === p.name;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleQuickLogoSelect(p.name)}
                    title={p.name}
                    className={`flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-brand-500/15 border-brand-500 text-brand-600 dark:text-brand-400 font-bold ring-1 ring-brand-500/50 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <span className="text-base leading-none">{p.icon}</span>
                    <span className="text-[9px] truncate max-w-full mt-0.5">{p.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {config.logoImage && (
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1 rounded-xl">
                <span>✓</span>
                <span className="font-semibold">{config.logoPreset || 'Custom'} Logo Embedded</span>
                <span className="text-slate-400">•</span>
                <span>Error Correction set to High (H) for 100% scan guarantee</span>
              </div>
            )}
          </div>

          <QrCustomizer
            config={config}
            onChange={setConfig}
          />
        </div>

        {/* Right Side: Live Preview & Sticky Sidebar Ad (5 cols) */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
          <QrPreview
            config={config}
            onDownloadSuccess={onDownloadSuccess}
          />

          {/* High-impact Sticky Sidebar Ad */}
          <GoogleAd slotType="sidebar" />
        </div>

      </div>
    </div>
  );
};
