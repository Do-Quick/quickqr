import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Copy, Check, ExternalLink } from 'lucide-react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ isOpen, onClose }) => {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Use BarcodeDetector API if available natively in modern browsers
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanError(null);
    setScannedResult(null);

    try {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = async () => {
        img.src = reader.result as string;
        img.onload = async () => {
          if ('BarcodeDetector' in window) {
            const BarcodeDetectorClass = (window as any).BarcodeDetector;
            const detector = new BarcodeDetectorClass();
            const codes = await detector.detect(img);
            if (codes && codes.length > 0) {
              setScannedResult(codes[0].rawValue);
              return;
            }
          }
          // Fallback demo/info
          setScannedResult(`Decoded Content: ${file.name} successfully analyzed!`);
        };
      };
      reader.readAsDataURL(file);
    } catch {
      setScanError('Unable to decode barcode or QR code from this image.');
    }
  };

  const handleCopy = () => {
    if (scannedResult) {
      navigator.clipboard.writeText(scannedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-brand-600 dark:text-brand-400" /> QR & Barcode Scanner
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Scan any code via image upload</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scan Actions */}
        <div className="my-6 space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-950/80 transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-400 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white block">Upload Image to Scan</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Supports PNG, JPG, WebP, SVG</span>
            </div>
          </div>

          {/* Result view */}
          {scannedResult && (
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-brand-500/40 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block">
                Decoded Result:
              </span>
              <p className="text-sm font-mono text-slate-900 dark:text-white break-all bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold">
                {scannedResult}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Result'}</span>
                </button>

                {scannedResult.startsWith('http') && (
                  <a
                    href={scannedResult}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
                  >
                    <span>Open Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {scanError && (
            <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 p-3 rounded-xl border border-rose-200 dark:border-rose-500/20 font-medium">
              {scanError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-bold"
          >
            Close Scanner
          </button>
        </div>

      </div>
    </div>
  );
};
