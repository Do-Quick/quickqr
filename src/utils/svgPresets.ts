// Safe Base64-encoded SVG data URIs for official brand & utility preset logos
// Solid badge designs guarantee maximum contrast, zero clashing with QR modules, and 100% scan reliability

const toBase64Uri = (svg: string) => {
  try {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg.trim())))}`;
  } catch {
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
  }
};

export const PRESET_LOGOS = [
  {
    name: 'BHIM UPI',
    icon: '🇮🇳',
    svg: toBase64Uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" rx="22" fill="#007934"/>
      <!-- Saffron / White Official UPI Chevrons -->
      <path d="M24 28h52v12H48l18 18-12 12-24-24 14-14H24v-4z" fill="#ffffff"/>
      <path d="M44 64l14-14 18 18v8H44v-12z" fill="#f37021"/>
      <text x="50" y="88" font-family="-apple-system, BlinkMacSystemFont, Arial, sans-serif" font-size="13" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">UPI</text>
    </svg>`),
  },
  {
    name: 'YouTube',
    icon: '▶️',
    svg: toBase64Uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" rx="24" fill="#FF0000"/>
      <!-- Play Triangle -->
      <polygon points="40,32 72,50 40,68" fill="#FFFFFF"/>
    </svg>`),
  },
  {
    name: 'WhatsApp',
    icon: '💬',
    svg: toBase64Uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" rx="50" fill="#25D366"/>
      <path d="M50 20C33.43 20 20 33.43 20 50c0 5.3 1.38 10.28 3.79 14.6L20 80l15.82-3.73C40.02 78.65 44.87 80 50 80c16.57 0 30-13.43 30-30S66.57 20 50 20zm14.7 42.4c-.6.17-3.56 1.76-4.11 1.95-.55.2-1 .3-1.4.3-.4 0-.8-.1-1.3-.3-2.5-1-6.1-3.6-8.6-6.1-2.5-2.5-5.1-6.1-6.1-8.6-.2-.5-.3-.9-.3-1.3 0-.4.1-.8.3-1.4.2-.55 1.78-3.51 1.95-4.11.2-.6.1-1.1-.1-1.5s-1.8-4.3-2.5-5.9c-.7-1.6-1.4-1.4-1.9-1.4h-1.6c-.5 0-1.4.2-2.1.9-.7.8-2.7 2.6-2.7 6.4s2.8 7.4 3.2 7.9c.4.5 5.5 8.4 13.3 11.8 1.9.8 3.3 1.3 4.5 1.7 1.9.6 3.6.5 5 .3 1.5-.2 4.7-1.9 5.4-3.8.7-1.9.7-3.5.5-3.8-.2-.3-.7-.5-1.5-.7z" fill="#FFFFFF"/>
    </svg>`),
  },
  {
    name: 'Instagram',
    icon: '📷',
    svg: toBase64Uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <radialGradient id="igGrad" cx="20%" cy="100%" r="130%">
          <stop offset="0%" stop-color="#ffdc80"/>
          <stop offset="25%" stop-color="#fd1d1d"/>
          <stop offset="60%" stop-color="#c13584"/>
          <stop offset="100%" stop-color="#405de6"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx="24" fill="url(#igGrad)"/>
      <rect x="25" y="25" width="50" height="50" rx="14" fill="none" stroke="#FFFFFF" stroke-width="5"/>
      <circle cx="50" cy="50" r="12" fill="none" stroke="#FFFFFF" stroke-width="5"/>
      <circle cx="64" cy="36" r="3" fill="#FFFFFF"/>
    </svg>`),
  },
  {
    name: 'Google',
    icon: '🔍',
    svg: toBase64Uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" rx="50" fill="#FFFFFF"/>
      <rect width="96" height="96" x="2" y="2" rx="48" fill="none" stroke="#E2E8F0" stroke-width="2"/>
      <g transform="translate(18, 18) scale(1.33)">
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      </g>
    </svg>`),
  },
  {
    name: 'LinkedIn',
    icon: '💼',
    svg: toBase64Uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" rx="22" fill="#0A66C2"/>
      <path d="M32 40h9v32h-9zM36.5 26a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM48 40h8.6v4.4h.1c1.2-2.3 4.2-4.7 8.6-4.7 9.2 0 10.9 6 10.9 13.9V72h-9V57.6c0-3.4-.1-7.8-4.8-7.8-4.8 0-5.5 3.7-5.5 7.6V72h-9V40z" fill="#FFFFFF"/>
    </svg>`),
  },
  {
    name: 'X (Twitter)',
    icon: '𝕏',
    svg: toBase64Uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" rx="22" fill="#000000"/>
      <rect width="96" height="96" x="2" y="2" rx="20" fill="none" stroke="#334155" stroke-width="1.5"/>
      <path d="M30 28l16.8 22.4L30 72h5.2l13.9-15.8L61.2 72H74L56.1 48.2 71.8 28h-5.2L53.7 42.6 42.8 28H30zm7.6 3.8h8.1l20.7 27.6h-8.1L37.6 31.8z" fill="#FFFFFF"/>
    </svg>`),
  },
  {
    name: 'WiFi',
    icon: '📶',
    svg: toBase64Uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" rx="22" fill="#2563EB"/>
      <path d="M22 36c15.5-14.7 40.5-14.7 56 0" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/>
      <path d="M32 49c10-9.5 26-9.5 36 0" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/>
      <path d="M42 62c4.5-4.2 11.5-4.2 16 0" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/>
      <circle cx="50" cy="74" r="5" fill="#FFFFFF"/>
    </svg>`),
  },
  {
    name: 'Website',
    icon: '🌐',
    svg: toBase64Uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" rx="22" fill="#0D9488"/>
      <circle cx="50" cy="50" r="26" fill="none" stroke="#FFFFFF" stroke-width="5"/>
      <ellipse cx="50" cy="50" rx="12" ry="26" fill="none" stroke="#FFFFFF" stroke-width="5"/>
      <line x1="24" y1="50" x2="76" y2="50" stroke="#FFFFFF" stroke-width="5"/>
      <line x1="28" y1="37" x2="72" y2="37" stroke="#FFFFFF" stroke-width="4"/>
      <line x1="28" y1="63" x2="72" y2="63" stroke="#FFFFFF" stroke-width="4"/>
    </svg>`),
  },
];
