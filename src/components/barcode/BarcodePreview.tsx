import React, { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import confetti from 'canvas-confetti';
import { BarcodeConfig } from '../../types/barcode';
import { ExportFormat } from '../../types/qr';
import { estimateFileSize, exportSingleToPdf, triggerDownload, printCodeOnly } from '../../utils/exportHelpers';
import { validateBarcode } from '../../utils/barcodeValidator';
import { Download, Copy, Printer, Check, Sparkles } from 'lucide-react';

interface BarcodePreviewProps {
  config: BarcodeConfig;
  onDownloadSuccess: () => void;
}

export const BarcodePreview: React.FC<BarcodePreviewProps> = ({ config, onDownloadSuccess }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  const validation = validateBarcode(config.value, config.format);

  // Render Barcode
  useEffect(() => {
    if (!svgRef.current || !canvasRef.current) return;

    if (!validation.valid && !validation.suggestion) {
      setRenderError(validation.message || 'Invalid barcode input');
      return;
    }

    try {
      const renderValue = validation.valid ? config.value : (validation.suggestion || config.value);

      // Render to SVG
      JsBarcode(svgRef.current, renderValue, {
        format: config.format,
        width: config.width,
        height: config.height,
        displayValue: config.displayValue,
        fontSize: config.fontSize,
        fontOptions: config.fontOptions,
        textAlign: config.textAlign,
        textPosition: config.textPosition,
        lineColor: config.lineColor,
        background: config.transparentBackground ? 'transparent' : config.background,
        margin: config.margin,
      });

      // Render to Canvas for raster PNG/JPG export
      JsBarcode(canvasRef.current, renderValue, {
        format: config.format,
        width: config.width * 2, // 2x for sharp high-DPI export
        height: config.height * 2,
        displayValue: config.displayValue,
        fontSize: config.fontSize * 2,
        fontOptions: config.fontOptions,
        textAlign: config.textAlign,
        textPosition: config.textPosition,
        lineColor: config.lineColor,
        background: config.transparentBackground ? 'transparent' : config.background,
        margin: config.margin * 2,
      });

      setRenderError(null);
    } catch (err: any) {
      console.warn('JsBarcode render failed:', err);
      setRenderError(err?.message || 'Unable to render barcode with current settings');
    }
  }, [config, validation]);

  const handleDownload = async () => {
    if (!canvasRef.current || !svgRef.current) return;
    setDownloading(true);

    try {
      if (selectedFormat === 'svg') {
        const svgData = new XMLSerializer().serializeToString(svgRef.current);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        triggerDownload(svgBlob, `barcode-${config.format.toLowerCase()}.svg`);
      } else if (selectedFormat === 'pdf') {
        const dataUrl = canvasRef.current.toDataURL('image/png');
        await exportSingleToPdf(
          dataUrl,
          `${config.format} Barcode`,
          config.value,
          `barcode-${config.format.toLowerCase()}.pdf`
        );
      } else {
        const mimeType = selectedFormat === 'jpeg' ? 'image/jpeg' : selectedFormat === 'webp' ? 'image/webp' : 'image/png';
        const dataUrl = canvasRef.current.toDataURL(mimeType, config.quality);
        triggerDownload(dataUrl, `barcode-${config.format.toLowerCase()}.${selectedFormat}`);
      }

      triggerCelebration();
    } catch (err) {
      console.error('Barcode download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#22c55e', '#6366f1', '#3b82f6'],
    });
    onDownloadSuccess();
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (blob && navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      });
    } catch (err) {
      console.error('Failed to copy barcode:', err);
    }
  };

  const estimatedSize = estimateFileSize(
    config.width * 100, 
    config.height * 2, 
    selectedFormat, 
    config.quality
  );

  const handlePrint = () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      printCodeOnly(dataUrl, `${config.format}: ${config.value}`);
    } catch (err) {
      console.error('Print barcode error:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-500" /> Live Barcode Preview
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{config.format} Industry Standard</p>
        </div>
        <div className="flex items-center gap-1.5">
          {config.printSafeMode && (
            <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded-full">
              ✓ Print-Safe
            </span>
          )}
          <span className="text-[11px] font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-500/20 font-semibold">
            Vector SVG & 300 DPI
          </span>
        </div>
      </div>

      {/* SVG Preview Box */}
      <div className="w-full min-h-[160px] p-4 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800/80 flex items-center justify-center overflow-x-auto shadow-inner">
        {renderError ? (
          <div className="text-xs text-rose-500 dark:text-rose-400 text-center py-4">
            {renderError}
          </div>
        ) : (
          <svg 
            ref={svgRef} 
            className="max-w-full h-auto transition-transform hover:scale-[1.02]"
          />
        )}
        {/* Hidden Canvas for raster exports */}
        <canvas ref={canvasRef} className="hidden" />
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

      {/* File Size & Specs Note */}
      <div className="w-full mt-3 p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <span>Estimated Size: <strong className="text-slate-800 dark:text-slate-200">{estimatedSize}</strong></span>
        <span>Resolution: <strong className="text-slate-800 dark:text-slate-200">Print 300 DPI</strong></span>
      </div>

      {/* Download Action Buttons */}
      <div className="w-full mt-4 space-y-2">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading || !!renderError}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-500 via-emerald-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-slate-950 group-hover:translate-y-0.5 transition-transform" />
          <span>{downloading ? 'Exporting...' : `Download ${selectedFormat.toUpperCase()} Barcode`}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!!renderError}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
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
            <span>Print Barcode</span>
          </button>
        </div>
      </div>

      <div className="w-full mt-3 text-center">
        <span className="text-[10px] text-slate-500">
          ✓ Standard GS1 & ISO compliant formats • Free forever
        </span>
      </div>

    </div>
  );
};
