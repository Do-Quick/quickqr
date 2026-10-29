import React from 'react';
import { env } from '../../config/env';
import { QrCode, Mail, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 text-slate-700 dark:text-slate-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center">
            <QrCode className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-extrabold text-slate-900 dark:text-white text-sm">Quick<span className="text-brand-600 dark:text-brand-400">QR</span></span>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span className="text-slate-600 dark:text-slate-400">Free Forever • No Login Required</span>
        </div>

        {/* Info & Support */}
        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side Private
          </div>
          <a
            href={`mailto:${env.supportEmail}`}
            className="flex items-center gap-1 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors font-semibold"
          >
            <Mail className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>{env.supportEmail}</span>
          </a>
          <span>© {new Date().getFullYear()} {env.appName}</span>
        </div>

      </div>
    </footer>
  );
};
