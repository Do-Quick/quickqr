import React, { useState } from 'react';
import { BarcodeConfig } from '../../types/barcode';
import { BarcodeForm } from './BarcodeForm';
import { BarcodeCustomizer } from './BarcodeCustomizer';
import { BarcodePreview } from './BarcodePreview';
import { GoogleAd } from '../common/GoogleAd';

interface BarcodeGeneratorProps {
  onDownloadSuccess: () => void;
}

export const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({ onDownloadSuccess }) => {
  const [config, setConfig] = useState<BarcodeConfig>({
    value: 'QUICKQR-2026',
    format: 'CODE128',
    width: 2.2,
    height: 90,
    displayValue: true,
    font: 'monospace',
    fontSize: 16,
    fontOptions: '',
    textAlign: 'center',
    textPosition: 'bottom',
    textMargin: 4,
    lineColor: '#000000',
    background: '#ffffff',
    transparentBackground: false,
    margin: 12,
    printSafeMode: false,
    exportWidth: 1200,
    exportFormat: 'png',
    dpi: 300,
    quality: 0.95,
  });

  return (
    <div id="barcode-generator" className="space-y-6">
      {/* Top Banner Ad with high viewability */}
      <GoogleAd slotType="top-leaderboard" />

      {/* Main Generator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Form & Customizer (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <BarcodeForm
            config={config}
            onChange={setConfig}
          />

          <BarcodeCustomizer
            config={config}
            onChange={setConfig}
          />
        </div>

        {/* Right Side: Live Barcode Preview & Sticky Ad (5 cols) */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
          <BarcodePreview
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
