import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import confetti from 'canvas-confetti';
import type { QrCodeConfig, ExportFormat } from '../../types/qr';
import { estimateFileSize, exportSingleToPdf, triggerDownload, printCodeOnly } from '../../utils/exportHelpers';
import { 
  Download, 
  Copy, 
  Printer, 
  Check, 
  Sliders, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface QrPreviewProps {
  config: QrCodeConfig;
  onDownloadSuccess: () => void;
}

export const QrPreview: React.FC<QrPreviewProps> = ({ config, onDownloadSuccess }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<QRCodeStyling | null>(null);

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showAdvancedSize, setShowAdvancedSize] = useState(false);
  const [customPx, setCustomPx] = useState(config.width || 1024);

  // Helper to build robust QRCodeStyling options
  const buildQrOptions = (cfg: QrCodeConfig, width: number, height: number, margin: number) => {
    const dotsOptions: any = {
      type: cfg.dotType,
    };

    if (cfg.colorType === 'gradient') {
      dotsOptions.gradient = {
        type: cfg.gradientType,
        rotation: (cfg.gradientRotation * Math.PI) / 180,
        colorStops: [
          { offset: 0, color: cfg.dotColor },
          { offset: 1, color: cfg.gradientColor2 },
        ],
      };
    } else {
      dotsOptions.color = cfg.dotColor;
    }

    const hasLogo = Boolean(cfg.logoImage && cfg.logoImage.length > 0);
    const isDataUri = cfg.logoImage?.startsWith('data:');

    return {
      width,
      height,
      data: cfg.content || 'https://quickqr.app',
      margin,
      dotsOptions,
      cornersSquareOptions: {
        type: cfg.cornerSquareType,
        color: cfg.cornerSquareColor || cfg.dotColor,
      },
      cornersDotOptions: {
        type: cfg.cornerDotType,
        color: cfg.cornerDotColor || cfg.dotColor,
      },
      backgroundOptions: {
        color: cfg.transparentBackground ? 'transparent' : cfg.backgroundColor,
      },
      image: hasLogo ? cfg.logoImage : undefined,
      imageOptions: {
        hideBackgroundDots: hasLogo ? cfg.hideBehindLogo : false,
        imageSize: cfg.logoSize || 0.24,
        margin: cfg.logoMargin ?? 6,
        saveAsBlob: false, // Critical: bypass fragile XMLHttpRequest on data URIs
        ...(isDataUri ? {} : { crossOrigin: 'anonymous' }),
      },
      qrOptions: {
        errorCorrectionLevel: cfg.errorCorrectionLevel || (hasLogo ? 'H' : 'M'),
      },
    };
  };

  // Initialize and update QRCodeStyling cleanly
  useEffect(() => {
    const previewMargin = config.printSafeMode ? 14 : 10;
    const options = buildQrOptions(config, 280, 280, previewMargin);

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      qrCodeInstance.current = new QRCodeStyling(options);
      qrCodeInstance.current.append(containerRef.current);
    }
  }, [config]);

  // Robust, uncorrupted download implementation using isolated instance
  const handleDownload = async () => {
    setDownloading(true);

    try {
      const targetWidth = customPx || 1024;
      const targetHeight = targetWidth;
      const targetMargin = Math.round(targetWidth * 0.05);

      if (selectedFormat === 'pdf') {
        const pdfOptions = buildQrOptions(config, 1024, 1024, 40);
        const exportQr = new QRCodeStyling(pdfOptions);
        const rawBlob = await exportQr.getRawData('png');
        if (rawBlob) {
          const reader = new FileReader();
          reader.onload = async () => {
            const dataUrl = reader.result as string;
            await exportSingleToPdf(
              dataUrl, 
              config.frameText || 'QuickQR Code', 
              config.content.length > 40 ? config.content.substring(0, 40) + '...' : config.content,
              'quickqr-code.pdf'
            );
            triggerCelebration();
          };
          reader.readAsDataURL(rawBlob as Blob);
        }
      } else if (selectedFormat === 'svg') {
        const svgOptions = buildQrOptions(config, targetWidth, targetHeight, targetMargin);
        const exportQr = new QRCodeStyling({ ...svgOptions, type: 'svg' });
        await exportQr.download({
          name: `quickqr-${targetWidth}px`,
          extension: 'svg',
        });
        triggerCelebration();
      } else {
        // Raster formats (PNG, JPEG, WEBP)
        const formatExt = selectedFormat === 'jpeg' ? 'jpeg' : selectedFormat === 'webp' ? 'webp' : 'png';
        const exportOptions = buildQrOptions(config, targetWidth, targetHeight, targetMargin);
        const exportQr = new QRCodeStyling(exportOptions);
        const blob = await exportQr.getRawData(formatExt as any);
        if (blob) {
          triggerDownload(blob as Blob, `quickqr-${targetWidth}px.${selectedFormat}`);
          triggerCelebration();
        }
      }
    } catch (err) {
      console.error('Download error:', err);
      // Fallback: capture canvas from DOM directly if exportQr throws
      try {
        const canvas = containerRef.current?.querySelector('canvas');
        if (canvas) {
          const mime = selectedFormat === 'jpeg' ? 'image/jpeg' : selectedFormat === 'webp' ? 'image/webp' : 'image/png';
          const dataUrl = canvas.toDataURL(mime, 0.95);
          triggerDownload(dataUrl, `quickqr-code.${selectedFormat}`);
          triggerCelebration();
        }
      } catch {
        alert('Could not download image. Please try PNG format.');
      }
    } finally {
      setDownloading(false);
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#22c55e', '#6366f1', '#3b82f6', '#ec4899'],
    });
    onDownloadSuccess();
  };

  const handleCopy = async () => {
    try {
      const canvas = containerRef.current?.querySelector('canvas');
      if (canvas && navigator.clipboard && window.ClipboardItem) {
        canvas.toBlob(async (blob) => {
          if (blob) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }
        }, 'image/png');
      } else if (qrCodeInstance.current) {
        const blob = await qrCodeInstance.current.getRawData('png');
        if (blob && navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob as Blob })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }
    } catch (err) {
      console.error('Failed to copy image:', err);
    }
  };

  const handlePrint = async () => {
    try {
      const canvas = containerRef.current?.querySelector('canvas');
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        printCodeOnly(dataUrl, config.frameText || 'QuickQR Code');
      } else if (qrCodeInstance.current) {
        const blob = await qrCodeInstance.current.getRawData('png');
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => {
            printCodeOnly(reader.result as string, config.frameText || 'QuickQR Code');
          };
          reader.readAsDataURL(blob as Blob);
        }
      }
    } catch (err) {
      console.error('Print error:', err);
    }
  };

  const estimatedSize = estimateFileSize(customPx, customPx, selectedFormat, config.quality);

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-500" /> Live QR Code Preview
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">High-Resolution Vector & Raster Canvas</p>
        </div>
        <div className="flex items-center gap-1.5">
          {config.printSafeMode && (
            <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Scanner Certified
            </span>
          )}
          <span className="text-[11px] font-mono bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2.5 py-0.5 rounded-full border border-brand-500/20 font-semibold">
            {customPx} × {customPx} px
          </span>
        </div>
      </div>

      {/* Styled Frame & Canvas Preview */}
      <div className="relative my-2 p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800/80 flex flex-col items-center justify-center shadow-inner group">
        {/* Frame Top / Card */}
        {config.frameStyle === 'card' && (
          <div 
            className="w-full text-center py-1.5 px-4 mb-2 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm"
            style={{ backgroundColor: config.frameColor, color: config.frameTextColor }}
          >
            {config.frameText || 'SCAN ME'}
          </div>
        )}

        {/* QR Canvas Mounting Point */}
        <div 
          ref={containerRef} 
          className="flex items-center justify-center overflow-hidden rounded-xl bg-transparent transition-transform hover:scale-[1.01]"
        />

        {/* Frame Bottom Banner */}
        {config.frameStyle === 'bottom-banner' && (
          <div 
            className="w-full text-center py-2 px-4 mt-2 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm"
            style={{ backgroundColor: config.frameColor, color: config.frameTextColor }}
          >
            {config.frameText || 'SCAN ME WITH PHONE'}
          </div>
        )}

        {/* Frame Badge */}
        {config.frameStyle === 'badge' && (
          <div 
            className="inline-block px-3 py-1 mt-2 rounded-full font-bold text-[11px] uppercase tracking-wider shadow-sm"
            style={{ backgroundColor: config.frameColor, color: config.frameTextColor }}
          >
            {config.frameText || 'SCAN ME'}
          </div>
        )}
      </div>

      {/* Format Selector Pills */}
      <div className="w-full mt-4">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
          Select Download Format:
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {(['png', 'svg', 'jpeg', 'webp', 'pdf'] as ExportFormat[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setSelectedFormat(fmt)}
              className={`py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                selectedFormat === fmt
                  ? 'bg-brand-500 text-slate-950 shadow-md shadow-brand-500/20'
                  : 'bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Resolution & Size Preset Selector */}
      <div className="w-full mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Export Size & Resolution
          </label>
          <button
            type="button"
            onClick={() => setShowAdvancedSize(!showAdvancedSize)}
            className="text-[11px] text-brand-600 dark:text-brand-400 hover:text-brand-500 font-medium flex items-center gap-1"
          >
            <Sliders className="w-3 h-3" /> {showAdvancedSize ? 'Hide Advanced' : 'Custom Pixels'}
          </button>
        </div>

        {/* Quick Resolution Buttons */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: '512px', px: 512, sub: 'Web' },
            { label: '1024px', px: 1024, sub: 'HD' },
            { label: '2048px', px: 2048, sub: 'Print 300DPI' },
            { label: '4096px', px: 4096, sub: '4K Ultra' },
          ].map((res) => (
            <button
              key={res.px}
              type="button"
              onClick={() => setCustomPx(res.px)}
              className={`py-1.5 px-1 rounded-xl text-center border transition-all ${
                customPx === res.px
                  ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="text-xs">{res.label}</div>
              <div className="text-[9px] text-slate-500">{res.sub}</div>
            </button>
          ))}
        </div>

        {/* Advanced Pixel / KB Slider / Custom Input */}
        {showAdvancedSize && (
          <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
              <span>Custom Width & Height:</span>
              <span className="font-mono text-brand-600 dark:text-brand-400 font-bold">{customPx} px</span>
            </div>
            <input
              type="range"
              min="256"
              max="4096"
              step="64"
              value={customPx}
              onChange={(e) => setCustomPx(parseInt(e.target.value, 10))}
              className="w-full accent-brand-500"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <span>Estimated File Size:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{estimatedSize}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Download Button */}
      <div className="w-full mt-5 space-y-2">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-500 via-emerald-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
        >
          <Download className="w-4 h-4 text-slate-950 group-hover:translate-y-0.5 transition-transform" />
          <span>{downloading ? 'Exporting...' : `Download ${selectedFormat.toUpperCase()} (${customPx}px)`}</span>
        </button>

        {/* Sub actions: Copy & Print */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-brand-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied PNG!' : 'Copy to Clipboard'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-500" />
            <span>Print Code</span>
          </button>
        </div>
      </div>

    </div>
  );
};
