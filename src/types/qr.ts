export type QrContentType =
  | 'url'
  | 'text'
  | 'wifi'
  | 'vcard'
  | 'email'
  | 'phone'
  | 'sms'
  | 'event'
  | 'upi'
  | 'social';

export type DotType =
  | 'rounded'
  | 'dots'
  | 'classy'
  | 'classy-rounded'
  | 'square'
  | 'extra-rounded';

export type CornerSquareType = 'dot' | 'square' | 'extra-rounded';
export type CornerDotType = 'dot' | 'square';

export type ColorType = 'single' | 'gradient';
export type GradientType = 'linear' | 'radial';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type ExportFormat = 'png' | 'svg' | 'jpeg' | 'webp' | 'pdf';

export type LogoPosition = 'center' | 'top' | 'bottom' | 'left' | 'right';

export interface QrCodeConfig {
  content: string;
  contentType: QrContentType;
  // Dots styling
  dotType: DotType;
  colorType: ColorType;
  dotColor: string;
  gradientType: GradientType;
  gradientColor2: string;
  gradientRotation: number;
  
  // Corners styling
  cornerSquareType: CornerSquareType;
  cornerSquareColor: string;
  cornerDotType: CornerDotType;
  cornerDotColor: string;

  // Background
  backgroundColor: string;
  transparentBackground: boolean;

  // Logo / Branding
  logoImage?: string;
  logoPreset?: string;
  logoSize: number; // 0.15 to 0.40
  logoMargin: number; // 0 to 20
  logoPosition: LogoPosition;
  hideBehindLogo: boolean;

  // Error Correction & Print-Safe Scan Optimization
  errorCorrectionLevel: ErrorCorrectionLevel;
  printSafeMode: boolean; // Enforces minimum quiet margin & high contrast for guaranteed scanner compatibility

  // Dimensions & Export
  width: number; // in pixels
  height: number;
  dpi: 72 | 150 | 300;
  quality: number; // 0.1 to 1.0

  // Frame / Label
  frameStyle: 'none' | 'bottom-banner' | 'card' | 'badge';
  frameText: string;
  frameColor: string;
  frameTextColor: string;
}

export interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  title: string;
  website: string;
  address: string;
}

export interface EmailData {
  to: string;
  subject: string;
  body: string;
}

export interface SmsData {
  phone: string;
  message: string;
}

export interface EventData {
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export interface UpiData {
  vpa: string;
  name: string;
  amount: string;
  note: string;
}

export interface SocialData {
  platform: 'instagram' | 'whatsapp' | 'twitter' | 'youtube' | 'linkedin' | 'github' | 'telegram' | 'tiktok';
  username: string;
}
