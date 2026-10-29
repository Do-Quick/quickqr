import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import type { BulkConfig } from '../types/bulk';

/**
 * Estimates file size in KB or MB based on dimensions, format, and quality.
 */
export function estimateFileSize(width: number, height: number, format: string, quality: number = 0.9): string {
  if (format === 'svg') return '~15 - 35 KB (Vector)';
  if (format === 'pdf') return '~45 - 90 KB';

  const pixels = width * height;
  let estimatedBytes: number;

  switch (format) {
    case 'png':
      estimatedBytes = Math.max(12 * 1024, pixels * 0.12);
      break;
    case 'jpeg':
      estimatedBytes = Math.max(10 * 1024, pixels * 0.25 * quality);
      break;
    case 'webp':
      estimatedBytes = Math.max(8 * 1024, pixels * 0.08 * quality);
      break;
    default:
      estimatedBytes = pixels * 0.15;
  }

  if (estimatedBytes < 1024 * 1024) {
    return `~${Math.round(estimatedBytes / 1024)} KB`;
  }
  return `~${(estimatedBytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Direct download trigger for any Blob or DataURL
 */
export function triggerDownload(urlOrBlob: string | Blob, filename: string) {
  const link = document.createElement('a');
  if (typeof urlOrBlob === 'string') {
    link.href = urlOrBlob;
  } else {
    link.href = URL.createObjectURL(urlOrBlob);
  }
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  if (typeof urlOrBlob !== 'string') {
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }
}

/**
 * Prints ONLY the generated code image, preventing printing of the full website
 */
export function printCodeOnly(dataUrl: string, title: string = '') {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title || 'Print Code'}</title>
          <style>
            body {
              margin: 0;
              padding: 24px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 90vh;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              background: #fff;
              color: #000;
            }
            img {
              max-width: 80%;
              max-height: 75vh;
              height: auto;
              image-rendering: -webkit-optimize-contrast;
              image-rendering: crisp-edges;
            }
            .caption {
              margin-top: 14px;
              font-size: 15px;
              font-weight: 700;
              color: #0f172a;
              text-align: center;
            }
            @media print {
              body { margin: 0; padding: 12px; }
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="${title}" />
          ${title ? `<div class="caption">${title}</div>` : ''}
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }, 300);
  }
}

/**
 * Generates an elegant single-item PDF card
 */
export async function exportSingleToPdf(
  dataUrl: string, 
  title: string, 
  subtitle: string = '', 
  filename: string = 'quickqr-code.pdf'
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const cardW = 140;
  const cardH = 170;
  const cardX = (pageWidth - cardW) / 2;
  const cardY = (pageHeight - cardH) / 2 - 10;

  // Outer border & fill
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(cardX, cardY, cardW, cardH, 6, 6, 'FD');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(title.length > 30 ? title.substring(0, 30) + '...' : title, pageWidth / 2, cardY + 16, { align: 'center' });

  // Subtitle
  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(subtitle.length > 50 ? subtitle.substring(0, 50) + '...' : subtitle, pageWidth / 2, cardY + 23, { align: 'center' });
  }

  // Code Image
  const imgSize = 100;
  const imgX = (pageWidth - imgSize) / 2;
  const imgY = cardY + 30;
  doc.addImage(dataUrl, 'PNG', imgX, imgY, imgSize, imgSize);

  // Footer / Branding
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(34, 197, 94);
  doc.text('Generated with QuickQR.app - Free QR & Barcode Studio', pageWidth / 2, cardY + cardH - 12, { align: 'center' });

  doc.save(filename);
}

/**
 * Generates a ZIP archive containing individual image files for bulk items
 */
export async function exportBulkToZip(
  items: { filename: string; dataUrl: string }[],
  zipFilename: string = 'quickqr-bulk-export.zip',
  onProgress?: (percent: number) => void
) {
  const zip = new JSZip();
  const folder = zip.folder('quickqr-codes');

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const base64Data = item.dataUrl.split(',')[1];
    if (folder && base64Data) {
      folder.file(item.filename, base64Data, { base64: true });
    }
    if (onProgress) {
      onProgress(Math.round(((i + 1) / items.length) * 50));
    }
  }

  const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    if (onProgress) {
      onProgress(50 + Math.round(metadata.percent / 2));
    }
  });

  triggerDownload(content, zipFilename);
}

export interface BulkExportItem {
  label: string;
  qrDataUrl?: string;
  barcodeDataUrl?: string;
}

/**
 * Generates a multi-page PDF sticker/label sheet with custom grid, gaps, sizing, and combo QR+Barcode support
 */
export async function exportBulkToPdf(
  items: BulkExportItem[],
  config: BulkConfig,
  filename: string = 'quickqr-bulk-labels.pdf',
  onProgress?: (percent: number) => void
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: config.pdfPageSize,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = config.pageMarginMm || 10;
  const cols = Math.max(1, config.gridCols || 3);
  const rows = Math.max(1, config.gridRows || 6);
  const gapX = config.gapX || 2;
  const gapY = config.gapY || 2;
  const itemsPerPage = cols * rows;

  // Compute exact cell width and height considering custom gaps
  const availableWidth = pageWidth - margin * 2 - (cols - 1) * gapX;
  const availableHeight = pageHeight - margin * 2 - (rows - 1) * gapY;
  const cellWidth = availableWidth / cols;
  const cellHeight = availableHeight / rows;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const pageItemIndex = i % itemsPerPage;

    if (i > 0 && pageItemIndex === 0) {
      doc.addPage();
    }

    const colIndex = pageItemIndex % cols;
    const rowIndex = Math.floor(pageItemIndex / cols);

    const cellX = margin + colIndex * (cellWidth + gapX);
    const cellY = margin + rowIndex * (cellHeight + gapY);

    // Draw sticker boundary cut guidelines
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.15);
    doc.roundedRect(cellX, cellY, cellWidth, cellHeight, 1.5, 1.5, 'S');

    // Layout Mode 1: COMBO MODE (Both QR + Barcode on the exact same label)
    if (config.itemType === 'combo' && item.qrDataUrl && item.barcodeDataUrl) {
      const qrSize = Math.min(cellWidth * 0.42, cellHeight * 0.75);
      const qrX = cellX + 2;
      const qrY = cellY + (cellHeight - qrSize) / 2;
      doc.addImage(item.qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

      const barcodeW = cellWidth - qrSize - 6;
      const barcodeH = cellHeight * 0.45;
      const barcodeX = qrX + qrSize + 2;
      const barcodeY = cellY + 3;
      doc.addImage(item.barcodeDataUrl, 'PNG', barcodeX, barcodeY, barcodeW, barcodeH);

      // Label text
      if (config.includeLabel && item.label) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);
        const textY = barcodeY + barcodeH + 5;
        const maxChars = Math.floor(barcodeW / 1.8);
        const displayLabel = item.label.length > maxChars ? item.label.substring(0, maxChars) + '...' : item.label;
        doc.text(displayLabel, barcodeX + barcodeW / 2, textY, { align: 'center' });
      }
    } 
    // Layout Mode 2: Barcode Only
    else if (config.itemType === 'barcode' && item.barcodeDataUrl) {
      const barW = cellWidth * 0.88;
      const barH = config.includeLabel ? cellHeight * 0.55 : cellHeight * 0.75;
      const barX = cellX + (cellWidth - barW) / 2;
      const barY = cellY + 3;
      doc.addImage(item.barcodeDataUrl, 'PNG', barX, barY, barW, barH);

      if (config.includeLabel && item.label) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        const maxChars = Math.floor(cellWidth / 1.8);
        const displayLabel = item.label.length > maxChars ? item.label.substring(0, maxChars) + '...' : item.label;
        doc.text(displayLabel, cellX + cellWidth / 2, barY + barH + 4, { align: 'center' });
      }
    }
    // Layout Mode 3: QR Only
    else if (item.qrDataUrl) {
      const qrSize = config.includeLabel 
        ? Math.min(cellWidth * 0.72, (cellHeight - 7) * 0.9) 
        : Math.min(cellWidth * 0.82, cellHeight * 0.85);

      const qrX = cellX + (cellWidth - qrSize) / 2;
      const qrY = cellY + 2;
      doc.addImage(item.qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

      if (config.includeLabel && item.label) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);
        const maxChars = Math.floor(cellWidth / 1.6);
        const displayLabel = item.label.length > maxChars ? item.label.substring(0, maxChars) + '...' : item.label;
        doc.text(displayLabel, cellX + cellWidth / 2, qrY + qrSize + 4, { align: 'center' });
      }
    }

    if (onProgress) {
      onProgress(Math.round(((i + 1) / items.length) * 100));
    }
  }

  doc.save(filename);
}
