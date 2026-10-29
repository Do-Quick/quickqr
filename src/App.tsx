import React, { useState } from 'react';
import { Navbar, type ActiveTab } from './components/layout/Navbar';
import { QrGenerator } from './components/qr/QrGenerator';
import { BarcodeGenerator } from './components/barcode/BarcodeGenerator';
import { BulkGenerator } from './components/bulk/BulkGenerator';
import { QrScannerModal } from './components/scanner/QrScannerModal';
import { DownloadSuccessModal } from './components/common/DownloadSuccessModal';
import { SeoContentSection } from './components/seo/SeoContentSection';
import { Footer } from './components/layout/Footer';
import { useTheme } from './hooks/useTheme';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('qr');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleDownloadSuccess = () => {
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white transition-colors duration-200">
      
      {/* Navbar with Theme Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenScanner={() => setIsScannerOpen(true)}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Compact Clean Hero */}
      <div className="pt-6 pb-4 border-b border-slate-200 dark:border-slate-900 bg-white/70 dark:bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300">
            <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
            <span>QuickQR Studio</span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="text-brand-600 dark:text-brand-400 font-bold">100% Free • No Sign-Up</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto">
            Free Modern <span className="bg-gradient-to-r from-brand-500 via-emerald-400 to-indigo-500 bg-clip-text text-transparent">QR & Barcode</span> Generator
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Custom logos, circular dot shapes, barcodes, and bulk sticker sheets in PDF & ZIP.
          </p>
        </div>
      </div>

      {/* Main Generator Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: QR Generator */}
        {activeTab === 'qr' && (
          <QrGenerator onDownloadSuccess={handleDownloadSuccess} />
        )}

        {/* Tab 2: Barcode Generator */}
        {activeTab === 'barcode' && (
          <BarcodeGenerator onDownloadSuccess={handleDownloadSuccess} />
        )}

        {/* Tab 3: Bulk Generator */}
        {activeTab === 'bulk' && (
          <BulkGenerator onDownloadSuccess={handleDownloadSuccess} />
        )}

        {/* SEO Highlights & FAQ */}
        <SeoContentSection />
      </main>

      {/* Clean Minimal Footer */}
      <Footer />

      {/* Modals */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

      <DownloadSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />

    </div>
  );
}

export default App;
