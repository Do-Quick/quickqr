import React, { useState, useEffect, useRef } from 'react';
import type { 
  QrContentType, 
  WifiData, 
  VCardData, 
  EmailData, 
  SmsData, 
  EventData, 
  UpiData, 
  SocialData 
} from '../../types/qr';
import { 
  formatWifiPayload, 
  formatVCardPayload, 
  formatEmailPayload, 
  formatSmsPayload, 
  formatEventPayload, 
  formatUpiPayload, 
  formatSocialPayload 
} from '../../utils/qrPayloads';
import { Eye, EyeOff, Sparkles, IndianRupee } from 'lucide-react';

interface QrInputsProps {
  contentType: QrContentType;
  onContentChange: (payload: string) => void;
}

export const QrInputs: React.FC<QrInputsProps> = ({ contentType, onContentChange }) => {
  // Generic Text / URL
  const [url, setUrl] = useState('https://quickqr.app');
  const [text, setText] = useState('Scan with QuickQR');

  // WiFi
  const [wifi, setWifi] = useState<WifiData>({
    ssid: 'MyHomeWiFi',
    password: '',
    encryption: 'WPA',
    hidden: false,
  });
  const [showWifiPass, setShowWifiPass] = useState(false);

  // vCard
  const [vcard, setVcard] = useState<VCardData>({
    firstName: 'Alex',
    lastName: 'Morgan',
    phone: '+1 555 123 4567',
    email: 'alex@example.com',
    company: 'Creative Studios',
    title: 'Lead Designer',
    website: 'https://example.com',
    address: 'New York, NY',
  });

  // Email
  const [email, setEmail] = useState<EmailData>({
    to: 'hello@example.com',
    subject: 'Inquiry from QR Code',
    body: 'Hi, I saw your QR code and wanted to connect!',
  });

  // SMS
  const [sms, setSms] = useState<SmsData>({
    phone: '+1 555 987 6543',
    message: 'Hello! I scanned your QR code.',
  });

  // Event
  const [event, setEvent] = useState<EventData>({
    title: 'Product Launch & Showcase',
    startDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 90000000).toISOString().slice(0, 16),
    location: 'Grand Ballroom & Online',
    description: 'Join us for the official unveiling of next-gen tools.',
  });

  // UPI Payments (BHIM, Google Pay, PhonePe, Paytm)
  const [upi, setUpi] = useState<UpiData>({
    vpa: 'merchant@upi',
    name: 'Merchant Store',
    amount: '',
    note: 'Payment via QuickQR',
  });

  // Social
  const [social, setSocial] = useState<SocialData>({
    platform: 'instagram',
    username: 'quickqr_app',
  });

  // Guard ref to prevent infinite loops
  const lastPayloadRef = useRef('');

  useEffect(() => {
    let payload = '';
    switch (contentType) {
      case 'url':
        payload = url.trim();
        break;
      case 'text':
        payload = text;
        break;
      case 'wifi':
        payload = formatWifiPayload(wifi);
        break;
      case 'vcard':
        payload = formatVCardPayload(vcard);
        break;
      case 'email':
        payload = formatEmailPayload(email);
        break;
      case 'phone':
        payload = `tel:${sms.phone.trim()}`;
        break;
      case 'sms':
        payload = formatSmsPayload(sms);
        break;
      case 'event':
        payload = formatEventPayload(event);
        break;
      case 'upi':
        payload = formatUpiPayload(upi);
        break;
      case 'social':
        payload = formatSocialPayload(social);
        break;
      default:
        payload = 'https://quickqr.app';
    }

    if (lastPayloadRef.current !== payload) {
      lastPayloadRef.current = payload;
      onContentChange(payload);
    }
  }, [contentType, url, text, wifi, vcard, email, sms, event, upi, social, onContentChange]);

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          2. Enter Content & Details
        </label>
        <span className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Live Real-Time Encoding
        </span>
      </div>

      {/* URL INPUT */}
      {contentType === 'url' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Website URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/your-page"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Tip: Include <code className="text-brand-600 dark:text-brand-400 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">https://</code> for instant mobile scan-to-browser action.
          </p>
        </div>
      )}

      {/* TEXT INPUT */}
      {contentType === 'text' && (
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Plain Text or Note</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Type or paste any text, voucher code, serial number, or note..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 resize-y"
          />
        </div>
      )}

      {/* WIFI INPUT */}
      {contentType === 'wifi' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Network Name (SSID)</label>
            <input
              type="text"
              value={wifi.ssid}
              onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
              placeholder="e.g. MyHomeWiFi"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showWifiPass ? 'text' : 'password'}
                value={wifi.password}
                onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                placeholder="Leave blank for open networks"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowWifiPass(!showWifiPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showWifiPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Encryption</label>
            <select
              value={wifi.encryption}
              onChange={(e) => setWifi({ ...wifi, encryption: e.target.value as any })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
              <option value="WEP">WEP (Legacy)</option>
              <option value="nopass">None (Open Network)</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="wifiHidden"
              checked={wifi.hidden}
              onChange={(e) => setWifi({ ...wifi, hidden: e.target.checked })}
              className="w-4 h-4 rounded text-brand-500 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 focus:ring-brand-500"
            />
            <label htmlFor="wifiHidden" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              Hidden Network (SSID not broadcast)
            </label>
          </div>
        </div>
      )}

      {/* VCARD INPUT */}
      {contentType === 'vcard' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name</label>
            <input
              type="text"
              value={vcard.firstName}
              onChange={(e) => setVcard({ ...vcard, firstName: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
            <input
              type="text"
              value={vcard.lastName}
              onChange={(e) => setVcard({ ...vcard, lastName: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
            <input
              type="tel"
              value={vcard.phone}
              onChange={(e) => setVcard({ ...vcard, phone: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              value={vcard.email}
              onChange={(e) => setVcard({ ...vcard, email: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Organization / Company</label>
            <input
              type="text"
              value={vcard.company}
              onChange={(e) => setVcard({ ...vcard, company: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
            <input
              type="text"
              value={vcard.title}
              onChange={(e) => setVcard({ ...vcard, title: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Website URL</label>
            <input
              type="url"
              value={vcard.website}
              onChange={(e) => setVcard({ ...vcard, website: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* EMAIL INPUT */}
      {contentType === 'email' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Recipient Email</label>
            <input
              type="email"
              value={email.to}
              onChange={(e) => setEmail({ ...email, to: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Subject</label>
            <input
              type="text"
              value={email.subject}
              onChange={(e) => setEmail({ ...email, subject: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pre-filled Body</label>
            <textarea
              value={email.body}
              onChange={(e) => setEmail({ ...email, body: e.target.value })}
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none resize-y"
            />
          </div>
        </div>
      )}

      {/* PHONE OR SMS INPUT */}
      {(contentType === 'phone' || contentType === 'sms') && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number (with Country Code)</label>
            <input
              type="tel"
              value={sms.phone}
              onChange={(e) => setSms({ ...sms, phone: e.target.value })}
              placeholder="+1 555 123 4567"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          {contentType === 'sms' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pre-filled Message</label>
              <textarea
                value={sms.message}
                onChange={(e) => setSms({ ...sms, message: e.target.value })}
                rows={3}
                placeholder="Hi, I am reaching out regarding..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          )}
        </div>
      )}

      {/* SOCIAL MEDIA INPUT */}
      {contentType === 'social' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'instagram', label: 'Instagram' },
              { id: 'whatsapp', label: 'WhatsApp' },
              { id: 'twitter', label: 'X (Twitter)' },
              { id: 'youtube', label: 'YouTube' },
              { id: 'linkedin', label: 'LinkedIn' },
              { id: 'github', label: 'GitHub' },
              { id: 'telegram', label: 'Telegram' },
              { id: 'tiktok', label: 'TikTok' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSocial({ ...social, platform: p.id as any })}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  social.platform === p.id
                    ? 'bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 shadow-sm font-bold'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {social.platform === 'whatsapp' ? 'Phone Number (with Country Code)' : 'Username or Handle'}
            </label>
            <input
              type="text"
              value={social.username}
              onChange={(e) => setSocial({ ...social, username: e.target.value })}
              placeholder={social.platform === 'whatsapp' ? '+15551234567' : '@yourname'}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* EVENT INPUT */}
      {contentType === 'event' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Event Title</label>
            <input
              type="text"
              value={event.title}
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Date & Time</label>
            <input
              type="datetime-local"
              value={event.startDate}
              onChange={(e) => setEvent({ ...event, startDate: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">End Date & Time</label>
            <input
              type="datetime-local"
              value={event.endDate}
              onChange={(e) => setEvent({ ...event, endDate: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location / Venue / Link</label>
            <input
              type="text"
              value={event.location}
              onChange={(e) => setEvent({ ...event, location: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* DEDICATED UPI PAYMENT INPUT (BHIM / PhonePe / GPay / Paytm) */}
      {contentType === 'upi' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400">
            <IndianRupee className="w-4 h-4 shrink-0" />
            <span>Works with Google Pay, PhonePe, Paytm, BHIM, and all UPI mobile banking apps.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              UPI ID (VPA) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={upi.vpa}
              onChange={(e) => setUpi({ ...upi, vpa: e.target.value })}
              placeholder="e.g. storename@okhdfcbank or 9876543210@paytm"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Payee / Merchant Name</label>
              <input
                type="text"
                value={upi.name}
                onChange={(e) => setUpi({ ...upi, name: e.target.value })}
                placeholder="Business or Person Name"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Amount in ₹ (Optional)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={upi.amount}
                onChange={(e) => setUpi({ ...upi, amount: e.target.value })}
                placeholder="Leave blank for any amount"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Payment Note / Description</label>
            <input
              type="text"
              value={upi.note}
              onChange={(e) => setUpi({ ...upi, note: e.target.value })}
              placeholder="e.g. Store Bill, Invoice #45"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>
      )}

    </div>
  );
};
