import type { WifiData, VCardData, EmailData, SmsData, EventData, UpiData, SocialData } from '../types/qr';

export function formatWifiPayload(data: WifiData): string {
  const escape = (str: string) => str.replace(/([\\;,:"])/g, '\\$1');
  return `WIFI:S:${escape(data.ssid)};T:${data.encryption};P:${escape(data.password)};H:${data.hidden ? 'true' : 'false'};;`;
}

export function formatVCardPayload(data: VCardData): string {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${data.lastName};${data.firstName};;;`,
    `FN:${data.firstName} ${data.lastName}`.trim(),
    data.company ? `ORG:${data.company}` : '',
    data.title ? `TITLE:${data.title}` : '',
    data.phone ? `TEL;TYPE=CELL:${data.phone}` : '',
    data.email ? `EMAIL:${data.email}` : '',
    data.website ? `URL:${data.website}` : '',
    data.address ? `ADR;TYPE=WORK:;;${data.address};;;;` : '',
    'END:VCARD'
  ].filter(Boolean).join('\n');
}

export function formatEmailPayload(data: EmailData): string {
  const params: string[] = [];
  if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`);
  if (data.body) params.push(`body=${encodeURIComponent(data.body)}`);
  const query = params.length > 0 ? `?${params.join('&')}` : '';
  return `mailto:${data.to}${query}`;
}

export function formatSmsPayload(data: SmsData): string {
  return `sms:${data.phone}${data.message ? `?body=${encodeURIComponent(data.message)}` : ''}`;
}

export function formatEventPayload(data: EventData): string {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '' : d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  return [
    'BEGIN:VEVENT',
    `SUMMARY:${data.title || 'Event'}`,
    data.startDate ? `DTSTART:${formatDate(data.startDate)}` : '',
    data.endDate ? `DTEND:${formatDate(data.endDate)}` : '',
    data.location ? `LOCATION:${data.location}` : '',
    data.description ? `DESCRIPTION:${data.description}` : '',
    'END:VEVENT'
  ].filter(Boolean).join('\n');
}

export function formatUpiPayload(data: UpiData): string {
  const vpa = (data.vpa || '').trim();
  const name = (data.name || '').trim() || 'Payee';
  const params: string[] = [
    `pa=${encodeURIComponent(vpa)}`,
    `pn=${encodeURIComponent(name)}`,
    'cu=INR',
  ];
  if (data.amount && parseFloat(data.amount) > 0) {
    params.push(`am=${encodeURIComponent(data.amount)}`);
  }
  if (data.note) {
    params.push(`tn=${encodeURIComponent(data.note)}`);
  }
  return `upi://pay?${params.join('&')}`;
}

export function formatSocialPayload(data: SocialData): string {
  const u = data.username.replace('@', '').trim();
  switch (data.platform) {
    case 'instagram': return `https://instagram.com/${u}`;
    case 'whatsapp': return `https://wa.me/${u.replace(/[^0-9]/g, '')}`;
    case 'twitter': return `https://x.com/${u}`;
    case 'youtube': return u.startsWith('UC') ? `https://youtube.com/channel/${u}` : `https://youtube.com/@${u}`;
    case 'linkedin': return `https://linkedin.com/in/${u}`;
    case 'github': return `https://github.com/${u}`;
    case 'telegram': return `https://t.me/${u}`;
    case 'tiktok': return `https://tiktok.com/@${u}`;
    default: return u;
  }
}
