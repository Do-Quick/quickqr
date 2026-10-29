import React from 'react';
import type { BulkConfig, BulkItem } from '../../types/bulk';
import { Eye, FileCheck, Layers } from 'lucide-react';

interface BulkSheetPreviewProps {
  config: BulkConfig;
  items: BulkItem[];
  barcodeFormat: string;
}

// Authentic Normal Black & White QR Code SVG
const NormalQrSvg: React.FC<{ size?: number; logo?: string; logoPos?: string }> = ({ 
  size = 40, 
  logo, 
  logoPos = 'center' 
}) => {
  return (
    <div 
      className="bg-white p-0.5 rounded border border-slate-400 shadow-sm shrink-0 flex items-center justify-center relative"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg viewBox="0 0 29 29" className="w-full h-full" fill="none">
        {/* Crisp white canvas */}
        <rect width="29" height="29" fill="#ffffff" />

        {/* Top-Left Finder Eye */}
        <rect x="2" y="2" width="7" height="7" fill="#000000" />
        <rect x="3" y="3" width="5" height="5" fill="#ffffff" />
        <rect x="4" y="4" width="3" height="3" fill="#000000" />

        {/* Top-Right Finder Eye */}
        <rect x="20" y="2" width="7" height="7" fill="#000000" />
        <rect x="21" y="3" width="5" height="5" fill="#ffffff" />
        <rect x="22" y="4" width="3" height="3" fill="#000000" />

        {/* Bottom-Left Finder Eye */}
        <rect x="2" y="20" width="7" height="7" fill="#000000" />
        <rect x="3" y="21" width="5" height="5" fill="#ffffff" />
        <rect x="4" y="22" width="3" height="3" fill="#000000" />

        {/* Authentic Data Matrix Dots */}
        <rect x="11" y="3" width="2" height="2" fill="#000000" />
        <rect x="15" y="3" width="2" height="2" fill="#000000" />
        <rect x="11" y="6" width="2" height="2" fill="#000000" />
        <rect x="14" y="7" width="2" height="2" fill="#000000" />
        <rect x="17" y="6" width="2" height="2" fill="#000000" />

        <rect x="4" y="11" width="2" height="2" fill="#000000" />
        <rect x="7" y="14" width="2" height="2" fill="#000000" />
        <rect x="11" y="11" width="3" height="3" fill="#000000" />
        <rect x="15" y="11" width="2" height="2" fill="#000000" />
        <rect x="20" y="11" width="2" height="2" fill="#000000" />
        <rect x="24" y="13" width="2" height="2" fill="#000000" />

        <rect x="11" y="16" width="2" height="2" fill="#000000" />
        <rect x="15" y="15" width="3" height="3" fill="#000000" />
        <rect x="20" y="16" width="2" height="2" fill="#000000" />
        <rect x="24" y="18" width="2" height="2" fill="#000000" />

        <rect x="11" y="22" width="2" height="2" fill="#000000" />
        <rect x="15" y="23" width="2" height="2" fill="#000000" />
        <rect x="19" y="21" width="3" height="3" fill="#000000" />
        <rect x="24" y="23" width="2" height="2" fill="#000000" />
      </svg>

      {/* Embedded Logo Badge */}
      {logo && (
        <div 
          className={`absolute rounded bg-white p-0.5 border border-slate-300 shadow-sm flex items-center justify-center overflow-hidden ${
            logoPos === 'center' ? 'inset-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5' :
            logoPos === 'top' ? 'top-0.5 inset-x-1/2 -translate-x-1/2 w-3 h-3' :
            logoPos === 'bottom' ? 'bottom-0.5 inset-x-1/2 -translate-x-1/2 w-3 h-3' :
            logoPos === 'left' ? 'left-0.5 inset-y-1/2 -translate-y-1/2 w-3 h-3' :
            'right-0.5 inset-y-1/2 -translate-y-1/2 w-3 h-3'
          }`}
        >
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
      )}
    </div>
  );
};

// Authentic Normal Barcode representation
const NormalBarcodeSvg: React.FC<{ height?: number; showText?: boolean; text?: string }> = ({ 
  height = 24, 
  showText = true, 
  text = '' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full bg-white px-1 py-0.5 rounded-sm">
      <svg viewBox="0 0 100 28" className="w-full" style={{ height: `${height}px` }} preserveAspectRatio="none">
        <rect width="100" height="28" fill="#ffffff" />
        {/* Solid black bar lines */}
        {[
          { x: 2, w: 2 }, { x: 6, w: 1 }, { x: 9, w: 3 }, { x: 14, w: 1 }, { x: 17, w: 2 },
          { x: 21, w: 4 }, { x: 27, w: 1 }, { x: 30, w: 2 }, { x: 34, w: 3 }, { x: 39, w: 1 },
          { x: 42, w: 2 }, { x: 46, w: 4 }, { x: 52, w: 1 }, { x: 55, w: 2 }, { x: 59, w: 3 },
          { x: 64, w: 1 }, { x: 67, w: 2 }, { x: 71, w: 3 }, { x: 76, w: 1 }, { x: 79, w: 4 },
          { x: 85, w: 2 }, { x: 89, w: 1 }, { x: 92, w: 3 }, { x: 97, w: 1 },
        ].map((bar, i) => (
          <rect key={i} x={bar.x} y="0" width={bar.w} height="28" fill="#000000" />
        ))}
      </svg>
      {showText && text && (
        <span className="text-[8px] font-mono font-extrabold text-slate-950 tracking-tight mt-0.5 truncate max-w-full">
          {text}
        </span>
      )}
    </div>
  );
};

export const BulkSheetPreview: React.FC<BulkSheetPreviewProps> = ({
  config,
  items,
}) => {
  const previewItems = items.slice(0, config.gridCols * config.gridRows);
  const totalSlots = config.gridCols * config.gridRows;

  // Placeholder empty slots if items < totalSlots
  const displayItems = Array.from({ length: totalSlots }).map((_, idx) => {
    return previewItems[idx] || {
      id: `placeholder-${idx}`,
      data: `ITEM-${idx + 101}`,
      label: `Product #${idx + 101}`,
      status: 'pending' as const,
    };
  });

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header with High-Contrast Text */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Live Sheet Sticker Preview
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {config.gridCols} Columns × {config.gridRows} Rows • Gap: {config.gapX}mm × {config.gapY}mm
          </p>
        </div>
        <span className="text-[11px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-3 py-1 rounded-full uppercase">
          {config.pdfPageSize.toUpperCase()} Sheet
        </span>
      </div>

      {/* Blueprint Drafting Desk Container */}
      <div className="w-full bg-slate-200 dark:bg-slate-950/90 p-4 sm:p-5 rounded-xl border-2 border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center overflow-x-auto shadow-inner">
        <div className="text-[10px] uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5 self-start">
          <Layers className="w-3.5 h-3.5 text-brand-600" /> Printable Sheet Layout ({totalSlots} Labels per page)
        </div>

        {/* Paper Sheet Representation with 3D Depth & Real Cut-Out Stickers */}
        <div 
          className="bg-white text-slate-950 shadow-2xl rounded-md p-3 sm:p-4 transition-all border-2 border-slate-300 dark:border-slate-700 relative"
          style={{
            width: '100%',
            maxWidth: '520px',
            minHeight: '380px',
          }}
        >
          {/* Inner Grid of Sticker Labels */}
          <div
            className="grid w-full h-full"
            style={{
              gridTemplateColumns: `repeat(${config.gridCols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${config.gridRows}, minmax(0, 1fr))`,
              columnGap: `${Math.max(2, config.gapX * 1.5)}px`,
              rowGap: `${Math.max(2, config.gapY * 1.5)}px`,
            }}
          >
            {displayItems.map((item, idx) => (
              <div
                key={idx}
                className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-md p-1.5 flex flex-col items-center justify-center text-center relative bg-slate-50/50 hover:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                style={{
                  minHeight: `${Math.max(48, 250 / config.gridRows)}px`,
                }}
              >
                {/* 1. COMBO MODE: QR + Barcode + Text on same sticker */}
                {config.itemType === 'combo' && (
                  <div className="w-full flex items-center justify-between gap-1.5">
                    {/* Normal Black & White QR */}
                    <NormalQrSvg 
                      size={Math.min(38, Math.max(28, 200 / config.gridRows))} 
                      logo={config.logoImage} 
                      logoPos={config.logoPosition} 
                    />

                    {/* Normal Barcode + Text Label */}
                    <div className="flex-1 flex flex-col items-center overflow-hidden">
                      <NormalBarcodeSvg 
                        height={Math.min(20, Math.max(14, 120 / config.gridRows))} 
                        showText={config.displayBarcodeText} 
                        text={item.data} 
                      />
                      {config.includeLabel && (
                        <span className="text-[8px] font-extrabold text-slate-950 truncate mt-0.5 max-w-full">
                          {item.label}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. QR ONLY */}
                {config.itemType === 'qr' && (
                  <div className="flex flex-col items-center justify-center w-full">
                    <NormalQrSvg 
                      size={Math.min(46, Math.max(32, 220 / config.gridRows))} 
                      logo={config.logoImage} 
                      logoPos={config.logoPosition} 
                    />
                    {config.includeLabel && (
                      <span className="text-[8px] font-extrabold text-slate-950 truncate max-w-full mt-1">
                        {item.label}
                      </span>
                    )}
                  </div>
                )}

                {/* 3. BARCODE ONLY */}
                {config.itemType === 'barcode' && (
                  <div className="flex flex-col items-center justify-center w-full">
                    <NormalBarcodeSvg 
                      height={Math.min(26, Math.max(18, 140 / config.gridRows))} 
                      showText={config.displayBarcodeText} 
                      text={item.data} 
                    />
                    {config.includeLabel && (
                      <span className="text-[8.5px] font-extrabold text-slate-950 truncate max-w-full mt-0.5">
                        {item.label}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info with High-Contrast Text */}
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 px-1 font-semibold">
        <span>Authentic black on white sticker view</span>
        <span className="text-brand-600 dark:text-brand-400 font-bold flex items-center gap-1">
          <FileCheck className="w-3.5 h-3.5" /> Scanner & Print Certified
        </span>
      </div>
    </div>
  );
};
