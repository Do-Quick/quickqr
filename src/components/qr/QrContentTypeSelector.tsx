import React from 'react';
import { QrContentType } from '../../types/qr';
import { 
  Globe, 
  FileText, 
  Wifi, 
  UserSquare2, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar, 
  IndianRupee, 
  Share2 
} from 'lucide-react';

interface QrContentTypeSelectorProps {
  selectedType: QrContentType;
  onSelectType: (type: QrContentType) => void;
}

const contentTypes: { id: QrContentType; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'url', label: 'Website URL', icon: Globe },
  { id: 'text', label: 'Plain Text', icon: FileText },
  { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi, badge: 'Hot' },
  { id: 'vcard', label: 'Contact (vCard)', icon: UserSquare2 },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'phone', label: 'Phone Call', icon: Phone },
  { id: 'sms', label: 'SMS / Text', icon: MessageSquare },
  { id: 'social', label: 'Social Profile', icon: Share2, badge: 'Popular' },
  { id: 'event', label: 'Calendar Event', icon: Calendar },
  { id: 'upi', label: 'UPI Pay (BHIM)', icon: IndianRupee, badge: 'India' },
];

export const QrContentTypeSelector: React.FC<QrContentTypeSelectorProps> = ({
  selectedType,
  onSelectType,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          1. Select Content Type
        </label>
        <span className="text-[11px] text-slate-500 font-medium">10 Formats Supported</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {contentTypes.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectType(item.id)}
              type="button"
              className={`relative flex items-center sm:flex-col justify-start sm:justify-center gap-2 p-2.5 rounded-xl border text-left sm:text-center transition-all ${
                isSelected
                  ? 'bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 font-bold shadow-sm ring-1 ring-brand-500/50'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
              }`}
            >
              {item.badge && (
                <span className="absolute -top-1.5 -right-1.5 text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-brand-500 text-slate-950 shadow-sm">
                  {item.badge}
                </span>
              )}
              <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <span className="text-xs truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
