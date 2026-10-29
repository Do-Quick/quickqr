// Centralized typed environment configuration
export interface AppEnvConfig {
  appName: string;
  appTagline: string;
  siteUrl: string;
  supportEmail: string;
  enableAds: boolean;
  enableTestAds: boolean;
  adsenseClientId: string;
  adSlotTopBanner: string;
  adSlotSidebar: string;
  adSlotDownloadModal: string;
  adSlotFooter: string;
  googleAnalyticsId: string;
}

export const env: AppEnvConfig = {
  appName: import.meta.env.VITE_APP_NAME || 'QuickQR',
  appTagline: import.meta.env.VITE_APP_TAGLINE || 'Free QR & Barcode Studio',
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://quickqr.app',
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'contact@quickqr.app',
  enableAds: import.meta.env.VITE_ENABLE_ADS !== 'false',
  enableTestAds: import.meta.env.VITE_ENABLE_TEST_ADS === 'true',
  adsenseClientId: import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT_ID || 'ca-pub-3172721162962009',
  adSlotTopBanner: import.meta.env.VITE_AD_SLOT_TOP_BANNER || '3413249860',
  adSlotSidebar: import.meta.env.VITE_AD_SLOT_SIDEBAR || '3413249860',
  adSlotDownloadModal: import.meta.env.VITE_AD_SLOT_DOWNLOAD_MODAL || '3413249860',
  adSlotFooter: import.meta.env.VITE_AD_SLOT_FOOTER || '3413249860',
  googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '',
};
