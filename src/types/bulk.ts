export type BulkItemType = 'qr' | 'barcode' | 'combo';

export interface BulkItem {
  id: string;
  data: string;
  label: string;
  status: 'pending' | 'success' | 'error';
  errorMessage?: string;
  qrDataUrl?: string;
  barcodeDataUrl?: string;
}

export type BulkExportType = 'zip' | 'pdf';
export type BulkLogoPosition = 'center' | 'top' | 'bottom' | 'left' | 'right';

export interface BulkConfig {
  itemType: BulkItemType; // 'qr' | 'barcode' | 'combo' (QR + Barcode + Text on single label)
  exportType: BulkExportType; // 'zip' | 'pdf'
  exportFormat: 'png' | 'svg' | 'jpeg';
  
  // PDF Sheet Page Configuration
  pdfPageSize: 'a4' | 'letter';
  gridCols: number; // how many per row
  gridRows: number; // how many rows per page
  
  // Distance / Spacing between each item
  gapX: number; // horizontal distance in mm (0 - 25mm)
  gapY: number; // vertical distance in mm (0 - 25mm)
  pageMarginMm: number; // margin around the sheet in mm

  // Label Sizing
  labelWidthMm: number; // width of each label in mm (auto-computed or custom)
  labelHeightMm: number; // height of each label in mm

  // Logo Customization
  logoImage?: string;
  logoPosition: BulkLogoPosition;
  logoSizeRatio: number; // 0.15 - 0.35

  // Display toggles
  includeLabel: boolean; // show text label
  displayBarcodeText: boolean; // show barcode numbers under barcode

  // Print-safe optimization
  printSafeMode: boolean; // ensures sharp quiet zone margins and contrast
}
