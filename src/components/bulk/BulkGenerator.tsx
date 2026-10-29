import React, { useState, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import JsBarcode from 'jsbarcode';
import confetti from 'canvas-confetti';
import type { BulkItem, BulkConfig, BulkItemType, BulkLogoPosition } from '../../types/bulk';
import type { BarcodeFormat } from '../../types/barcode';
import { exportBulkToZip, exportBulkToPdf } from '../../utils/exportHelpers';
import { PRESET_LOGOS } from '../../utils/svgPresets';
import { BulkSheetPreview } from './BulkSheetPreview';
import { GoogleAd } from '../common/GoogleAd';
import { 
  Layers, 
  Archive, 
  FileText, 
  Play, 
  Sliders, 
  Printer, 
  Upload, 
  Trash2, 
  QrCode, 
  Barcode, 
  Sparkles 
} from 'lucide-react';

interface BulkGeneratorProps {
  onDownloadSuccess: () => void;
}

export const BulkGenerator: React.FC<BulkGeneratorProps> = ({ onDownloadSuccess }) => {
  const [itemType, setItemType] = useState<BulkItemType>('combo');
  const [barcodeFormat, setBarcodeFormat] = useState<BarcodeFormat>('CODE128');
  const [inputMode, setInputMode] = useState<'text' | 'csv' | 'sequence'>('sequence');

  // Input states
  const [rawText, setRawText] = useState(
    'https://quickqr.app/sku-101,Item #101\nhttps://quickqr.app/sku-102,Item #102\nhttps://quickqr.app/sku-103,Item #103\nhttps://quickqr.app/sku-104,Item #104\nhttps://quickqr.app/sku-105,Item #105\nhttps://quickqr.app/sku-106,Item #106'
  );

  // Sequential generator states
  const [seqPrefix, setSeqPrefix] = useState('INV-');
  const [seqStart, setSeqStart] = useState(1001);
  const [seqCount, setSeqCount] = useState(18);
  const [seqPad, setSeqPad] = useState(4);

  // Bulk Configuration (Fulfills Requirements 5 & 6)
  const [config, setConfig] = useState<BulkConfig>({
    itemType: 'combo',
    exportType: 'pdf',
    exportFormat: 'png',
    pdfPageSize: 'a4',
    gridCols: 3,
    gridRows: 6,
    gapX: 3, // 3mm horizontal distance
    gapY: 3, // 3mm vertical distance
    pageMarginMm: 10,
    labelWidthMm: 63,
    labelHeightMm: 38,
    logoImage: undefined,
    logoPosition: 'center',
    logoSizeRatio: 0.22,
    includeLabel: true,
    displayBarcodeText: true,
    printSafeMode: true,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Parse items
  const parseItems = (): BulkItem[] => {
    if (inputMode === 'sequence') {
      const result: BulkItem[] = [];
      for (let i = 0; i < seqCount; i++) {
        const num = seqStart + i;
        const padded = String(num).padStart(seqPad, '0');
        const code = `${seqPrefix}${padded}`;
        result.push({
          id: `seq-${i}`,
          data: code,
          label: code,
          status: 'pending',
        });
      }
      return result;
    }

    const lines = rawText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    return lines.map((line, idx) => {
      let data = line;
      let label = `Item #${idx + 1}`;
      if (line.includes(',')) {
        const parts = line.split(',');
        data = parts[0].trim();
        label = parts.slice(1).join(',').trim() || data;
      }
      return {
        id: `item-${idx}`,
        data,
        label,
        status: 'pending',
      };
    });
  };

  const items = parseItems();

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setRawText(event.target?.result as string);
        setInputMode('text');
      };
      reader.readAsText(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setConfig((prev) => ({
          ...prev,
          logoImage: ev.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate QR DataURL
  const generateQrDataUrl = async (data: string): Promise<string> => {
    const qr = new QRCodeStyling({
      width: 400,
      height: 400,
      data,
      margin: config.printSafeMode ? 14 : 10,
      dotsOptions: { type: 'rounded', color: '#000000' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#000000' },
      backgroundOptions: { color: '#ffffff' },
      image: config.logoImage || undefined,
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: config.logoSizeRatio,
        margin: 4,
      },
      qrOptions: {
        errorCorrectionLevel: config.logoImage ? 'H' : 'M',
      },
    });

    const blob = await qr.getRawData('png');
    if (!blob) throw new Error('Failed to render QR');
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob as Blob);
    });
  };

  // Generate Barcode DataURL
  const generateBarcodeDataUrl = (data: string): string => {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, data, {
      format: barcodeFormat,
      width: 2.2,
      height: 75,
      displayValue: config.displayBarcodeText,
      fontSize: 14,
      background: '#ffffff',
      lineColor: '#000000',
      margin: config.printSafeMode ? 16 : 10,
    });
    return canvas.toDataURL('image/png');
  };

  // Execute Bulk Run
  const handleStartBulk = async () => {
    if (items.length === 0) {
      alert('Please enter at least one item.');
      return;
    }

    setIsProcessing(true);
    setProgress(5);
    setStatusMessage(`Preparing ${items.length} codes...`);

    const renderedForPdf: { label: string; qrDataUrl?: string; barcodeDataUrl?: string }[] = [];
    const renderedForZip: { filename: string; dataUrl: string }[] = [];

    try {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        setStatusMessage(`Rendering code ${i + 1} of ${items.length}: ${item.label}...`);

        let qrUrl = '';
        let barUrl = '';

        if (itemType === 'qr' || itemType === 'combo') {
          qrUrl = await generateQrDataUrl(item.data);
        }
        if (itemType === 'barcode' || itemType === 'combo') {
          barUrl = generateBarcodeDataUrl(item.data);
        }

        renderedForPdf.push({
          label: item.label,
          qrDataUrl: qrUrl,
          barcodeDataUrl: barUrl,
        });

        const safeName = `${item.label.replace(/[^a-zA-Z0-9_-]/g, '_') || `item_${i + 1}`}`;
        if (qrUrl) renderedForZip.push({ filename: `${safeName}_qr.png`, dataUrl: qrUrl });
        if (barUrl) renderedForZip.push({ filename: `${safeName}_barcode.png`, dataUrl: barUrl });

        setProgress(Math.round(((i + 1) / items.length) * 50));
      }

      if (config.exportType === 'zip') {
        setStatusMessage('Compressing into ZIP archive...');
        await exportBulkToZip(renderedForZip, `quickqr-bulk-${itemType}.zip`, (p) => setProgress(p));
      } else {
        setStatusMessage('Assembling PDF printable label sheet...');
        await exportBulkToPdf(renderedForPdf, { ...config, itemType }, `quickqr-bulk-${itemType}-labels.pdf`, (p) => setProgress(p));
      }

      setProgress(100);
      setStatusMessage('Completed!');
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#22c55e', '#3b82f6'],
      });
      onDownloadSuccess();
    } catch (err: any) {
      console.error('Bulk generation error:', err);
      setStatusMessage(`Error: ${err?.message || 'Bulk failed'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Ad */}
      <GoogleAd slotType="top-leaderboard" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* 1. Item Type Selection with Combo Mode */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                1. Select Code Format
              </label>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <Printer className="w-3.5 h-3.5" />
                <span>100% Print-Safe Certified</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setItemType('combo'); setConfig({ ...config, itemType: 'combo' }); }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 text-center transition-all ${
                  itemType === 'combo'
                    ? 'bg-gradient-to-r from-brand-600 via-emerald-600 to-indigo-600 text-white font-extrabold border-brand-500 shadow-md shadow-brand-500/20'
                    : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <QrCode className={`w-4 h-4 ${itemType === 'combo' ? 'text-white' : 'text-brand-600 dark:text-brand-400'}`} />
                  <span className={`text-xs ${itemType === 'combo' ? 'text-white font-bold' : 'text-slate-500'}`}>+</span>
                  <Barcode className={`w-4 h-4 ${itemType === 'combo' ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
                </div>
                <span className="text-xs font-bold block">QR + Barcode Combo</span>
                <span className={`text-[10px] ${itemType === 'combo' ? 'text-white/90' : 'text-slate-600 dark:text-slate-400'}`}>Both on same sticker</span>
              </button>

              <button
                type="button"
                onClick={() => { setItemType('qr'); setConfig({ ...config, itemType: 'qr' }); }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 text-center transition-all ${
                  itemType === 'qr'
                    ? 'bg-brand-600 text-white font-extrabold border-brand-500 shadow-md'
                    : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <QrCode className={`w-5 h-5 mx-auto mb-1 ${itemType === 'qr' ? 'text-white' : 'text-brand-600 dark:text-brand-400'}`} />
                <span className="text-xs font-bold block">QR Code Only</span>
                <span className={`text-[10px] ${itemType === 'qr' ? 'text-white/90' : 'text-slate-600 dark:text-slate-400'}`}>Stickers & Labels</span>
              </button>

              <button
                type="button"
                onClick={() => { setItemType('barcode'); setConfig({ ...config, itemType: 'barcode' }); }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 text-center transition-all ${
                  itemType === 'barcode'
                    ? 'bg-brand-600 text-white font-extrabold border-brand-500 shadow-md'
                    : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <Barcode className={`w-5 h-5 mx-auto mb-1 ${itemType === 'barcode' ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
                <span className="text-xs font-bold block">Barcode Only</span>
                <span className={`text-[10px] ${itemType === 'barcode' ? 'text-white/90' : 'text-slate-600 dark:text-slate-400'}`}>Inventory & Retail</span>
              </button>
            </div>

            {(itemType === 'barcode' || itemType === 'combo') && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-800 dark:text-slate-200 font-bold">Barcode Standard:</span>
                <select
                  value={barcodeFormat}
                  onChange={(e) => setBarcodeFormat(e.target.value as any)}
                  className="bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white font-bold"
                >
                  <option value="CODE128">CODE 128 (Universal)</option>
                  <option value="EAN13">EAN-13 (Retail)</option>
                  <option value="UPC">UPC-A (North America)</option>
                  <option value="CODE39">CODE 39 (Industrial)</option>
                  <option value="ITF14">ITF-14 (Packaging)</option>
                </select>
              </div>
            )}
          </div>

          {/* 2. Bulk Input Data */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                2. Input Data & Labels
              </label>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{items.length} items ready</span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setInputMode('sequence')}
                className={`py-1.5 px-2 rounded-lg transition-all ${
                  inputMode === 'sequence' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white font-extrabold shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-bold'
                }`}
              >
                Auto Sequence
              </button>

              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`py-1.5 px-2 rounded-lg transition-all ${
                  inputMode === 'text' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white font-extrabold shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-bold'
                }`}
              >
                Line by Line
              </button>

              <label className={`py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                inputMode === 'csv' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white font-extrabold shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-bold'
              }`}>
                CSV File
                <input type="file" accept=".csv,.txt" onChange={handleCsvUpload} className="hidden" />
              </label>
            </div>

            {inputMode === 'sequence' ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Prefix</label>
                  <input
                    type="text"
                    value={seqPrefix}
                    onChange={(e) => setSeqPrefix(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-950 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Start #</label>
                  <input
                    type="number"
                    min="0"
                    value={seqStart}
                    onChange={(e) => setSeqStart(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-950 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Count</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={seqCount}
                    onChange={(e) => setSeqCount(parseInt(e.target.value, 10) || 18)}
                    className="w-full bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-950 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Digits</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={seqPad}
                    onChange={(e) => setSeqPad(parseInt(e.target.value, 10) || 4)}
                    className="w-full bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-950 dark:text-white font-bold"
                  />
                </div>
                <div className="col-span-2 sm:col-span-4 text-xs text-slate-800 dark:text-slate-200 pt-1 font-semibold">
                  Range: <span className="font-mono text-brand-600 dark:text-brand-400 font-extrabold">{seqPrefix}{String(seqStart).padStart(seqPad, '0')}</span> to{' '}
                  <span className="font-mono text-brand-600 dark:text-brand-400 font-extrabold">{seqPrefix}{String(seqStart + seqCount - 1).padStart(seqPad, '0')}</span>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Paste Entries (1 per line, or format: <code className="text-brand-600 dark:text-brand-400 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono font-bold">data,Label</code>)
                </label>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  rows={6}
                  className="w-full bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs font-mono font-semibold text-slate-950 dark:text-white focus:ring-2 focus:ring-brand-500/50 resize-y"
                />
              </div>
            )}
          </div>

          {/* 3. Sizing, Spacing & Logo Position (Fulfills Requirement 5) */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                3. Sheet Grid, Distance Gaps & Logo Position
              </label>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">Custom Millimeter Control</span>
            </div>

            {/* Columns & Rows & Distance Sliders */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Per Row (Columns)</label>
                <select
                  value={config.gridCols}
                  onChange={(e) => setConfig({ ...config, gridCols: parseInt(e.target.value, 10) })}
                  className="w-full bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-950 dark:text-white font-bold"
                >
                  <option value={1}>1 Per Row</option>
                  <option value={2}>2 Per Row</option>
                  <option value={3}>3 Per Row</option>
                  <option value={4}>4 Per Row</option>
                  <option value={5}>5 Per Row</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Rows per Page</label>
                <select
                  value={config.gridRows}
                  onChange={(e) => setConfig({ ...config, gridRows: parseInt(e.target.value, 10) })}
                  className="w-full bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-950 dark:text-white font-bold"
                >
                  <option value={3}>3 Rows</option>
                  <option value={4}>4 Rows</option>
                  <option value={6}>6 Rows</option>
                  <option value={8}>8 Rows</option>
                  <option value={10}>10 Rows</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-800 dark:text-slate-200 mb-1 font-bold">
                  <span>Horizontal Gap</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400 font-extrabold">{config.gapX}mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={config.gapX}
                  onChange={(e) => setConfig({ ...config, gapX: parseInt(e.target.value, 10) })}
                  className="w-full accent-brand-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-800 dark:text-slate-200 mb-1 font-bold">
                  <span>Vertical Gap</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400 font-extrabold">{config.gapY}mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={config.gapY}
                  onChange={(e) => setConfig({ ...config, gapY: parseInt(e.target.value, 10) })}
                  className="w-full accent-brand-600"
                />
              </div>
            </div>

            {/* Logo Customization for Bulk */}
            {(itemType === 'qr' || itemType === 'combo') && (
              <div className="p-4 bg-slate-50 dark:bg-slate-950/70 rounded-xl border-2 border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Bulk Logo & Placement Position:
                  </span>
                  {config.logoImage ? (
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, logoImage: undefined })}
                      className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove Logo
                    </button>
                  ) : (
                    <label className="text-xs text-brand-600 dark:text-brand-400 hover:underline cursor-pointer flex items-center gap-1 font-extrabold">
                      <Upload className="w-3.5 h-3.5" /> Upload Brand Logo
                      <input
                        type="file"
                        ref={logoInputRef}
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {config.logoImage && (
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Where to Place Logo on each QR Code:
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {(['center', 'top', 'bottom', 'left', 'right'] as BulkLogoPosition[]).map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => setConfig({ ...config, logoPosition: pos })}
                          className={`py-1.5 rounded-lg text-xs font-extrabold uppercase border-2 transition-all ${
                            config.logoPosition === pos
                              ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                              : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-slate-950 dark:hover:text-white'
                          }`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bText"
                  checked={config.includeLabel}
                  onChange={(e) => setConfig({ ...config, includeLabel: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-600 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 focus:ring-brand-500"
                />
                <label htmlFor="bText" className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                  Print text label on each sticker
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bSafe"
                  checked={config.printSafeMode}
                  onChange={(e) => setConfig({ ...config, printSafeMode: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-600 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 focus:ring-brand-500"
                />
                <label htmlFor="bSafe" className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                  Enforce Scanner Print-Safe Quiet Zones
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview & Export Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Requirement 10: Interactive Live Visual Sheet Preview */}
          <BulkSheetPreview
            config={{ ...config, itemType }}
            items={items}
            barcodeFormat={barcodeFormat}
          />

          {/* Export Action Card */}
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Export Target
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Total: {items.length} stickers</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConfig({ ...config, exportType: 'pdf' })}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  config.exportType === 'pdf'
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-600 text-indigo-700 dark:text-indigo-300 font-extrabold shadow-sm'
                    : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-indigo-400'
                }`}
              >
                <FileText className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
                <span className="text-xs block font-bold">Printable PDF</span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Sticker Sheet</span>
              </button>

              <button
                type="button"
                onClick={() => setConfig({ ...config, exportType: 'zip' })}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  config.exportType === 'zip'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 text-emerald-700 dark:text-emerald-300 font-extrabold shadow-sm'
                    : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-emerald-400'
                }`}
              >
                <Archive className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                <span className="text-xs block font-bold">ZIP Archive</span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Individual PNGs</span>
              </button>
            </div>

            {/* Progress */}
            {isProcessing && (
              <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border-2 border-indigo-500/30">
                <div className="flex justify-between text-xs text-slate-800 dark:text-slate-200">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{statusMessage}</span>
                  <span className="font-mono font-bold">{progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Generate Button with High-Contrast Text */}
            <button
              type="button"
              onClick={handleStartBulk}
              disabled={isProcessing || items.length === 0}
              className="w-full py-4 px-4 bg-gradient-to-r from-brand-600 via-emerald-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              <span>{isProcessing ? `Exporting ${progress}%...` : `Download ${items.length} Stickers (${config.exportType.toUpperCase()})`}</span>
            </button>
          </div>

          {/* Sticky Sidebar Ad */}
          <GoogleAd slotType="sidebar" />
        </div>

      </div>
    </div>
  );
};
