import { BarcodeFormat } from '../types/barcode';

export function calculateEan13CheckDigit(raw12: string): string {
  if (raw12.length !== 12 || !/^\d+$/.test(raw12)) return '';
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(raw12[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const mod = sum % 10;
  return String(mod === 0 ? 0 : 10 - mod);
}

export function calculateEan8CheckDigit(raw7: string): string {
  if (raw7.length !== 7 || !/^\d+$/.test(raw7)) return '';
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    const digit = parseInt(raw7[i], 10);
    sum += i % 2 === 0 ? digit * 3 : digit;
  }
  const mod = sum % 10;
  return String(mod === 0 ? 0 : 10 - mod);
}

export function validateBarcode(value: string, format: BarcodeFormat): { valid: boolean; message?: string; suggestion?: string } {
  if (!value || value.trim().length === 0) {
    return { valid: false, message: 'Please enter a barcode value' };
  }

  const clean = value.trim();

  switch (format) {
    case 'EAN13': {
      if (!/^\d+$/.test(clean)) {
        return { valid: false, message: 'EAN-13 only accepts numeric digits (0-9)' };
      }
      if (clean.length === 12) {
        const check = calculateEan13CheckDigit(clean);
        return { 
          valid: true, 
          suggestion: `${clean}${check}`, 
          message: `Auto-computed check digit: ${check}` 
        };
      }
      if (clean.length !== 13) {
        return { valid: false, message: `EAN-13 requires 12 or 13 digits (currently ${clean.length})` };
      }
      const raw12 = clean.substring(0, 12);
      const expected = calculateEan13CheckDigit(raw12);
      if (clean[12] !== expected) {
        return {
          valid: false,
          message: `Invalid check digit (${clean[12]}). Expected: ${expected}`,
          suggestion: `${raw12}${expected}`
        };
      }
      return { valid: true };
    }

    case 'EAN8': {
      if (!/^\d+$/.test(clean)) {
        return { valid: false, message: 'EAN-8 only accepts numeric digits (0-9)' };
      }
      if (clean.length === 7) {
        const check = calculateEan8CheckDigit(clean);
        return { valid: true, suggestion: `${clean}${check}`, message: `Auto-computed check digit: ${check}` };
      }
      if (clean.length !== 8) {
        return { valid: false, message: `EAN-8 requires 7 or 8 digits (currently ${clean.length})` };
      }
      const raw7 = clean.substring(0, 7);
      const expected = calculateEan8CheckDigit(raw7);
      if (clean[7] !== expected) {
        return { valid: false, message: `Invalid check digit. Expected: ${expected}`, suggestion: `${raw7}${expected}` };
      }
      return { valid: true };
    }

    case 'UPC': {
      if (!/^\d+$/.test(clean)) {
        return { valid: false, message: 'UPC only accepts numeric digits (0-9)' };
      }
      if (clean.length !== 12) {
        return { valid: false, message: `UPC-A requires exactly 12 digits (currently ${clean.length})` };
      }
      return { valid: true };
    }

    case 'CODE39': {
      // CODE39 standard characters: 0-9, A-Z, space, -, ., $, /, +, %
      if (!/^[0-9A-Z\-. $/+%]+$/.test(clean)) {
        return { valid: false, message: 'CODE39 supports uppercase A-Z, 0-9, and - . $ / + % space' };
      }
      return { valid: true };
    }

    case 'ITF14': {
      if (!/^\d+$/.test(clean)) {
        return { valid: false, message: 'ITF-14 requires numeric digits only' };
      }
      if (clean.length !== 14) {
        return { valid: false, message: `ITF-14 requires exactly 14 digits (currently ${clean.length})` };
      }
      return { valid: true };
    }

    case 'pharmacode': {
      if (!/^\d+$/.test(clean)) {
        return { valid: false, message: 'Pharmacode only accepts numbers between 3 and 131070' };
      }
      const num = parseInt(clean, 10);
      if (num < 3 || num > 131070) {
        return { valid: false, message: 'Pharmacode must be between 3 and 131070' };
      }
      return { valid: true };
    }

    case 'CODE128':
    default:
      return { valid: true };
  }
}
