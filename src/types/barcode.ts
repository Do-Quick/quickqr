export type BarcodeFormat =
  | 'CODE128'
  | 'EAN13'
  | 'EAN8'
  | 'UPC'
  | 'CODE39'
  | 'ITF14'
  | 'MSI'
  | 'pharmacode'
  | 'codabar';

export interface BarcodeConfig {
  value: string;
  format: BarcodeFormat;
  width: number; // width of a single bar (1.5 - 4)
  height: number; // height in px (40 - 200)
  displayValue: boolean; // toggle to show or hide text under barcode
  font: string;
  fontSize: number; // 10 - 36
  fontOptions: string; // "bold", "italic", "bold italic", ""
  textAlign: 'left' | 'center' | 'right';
  textPosition: 'bottom' | 'top';
  textMargin: number;
  lineColor: string;
  background: string;
  transparentBackground: boolean;
  margin: number; // quiet zone margin
  printSafeMode: boolean; // enforces quiet zone (>=20px) and high contrast for 100% print readability
  
  // Export Settings
  exportWidth: number;
  exportFormat: 'png' | 'svg' | 'jpeg' | 'webp' | 'pdf';
  dpi: 72 | 150 | 300;
  quality: number;
}
