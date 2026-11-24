import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { SITE_CONFIG } from '@/data/portfolio';
import { WhatsAppAuditConcierge } from '@/components/concierge/WhatsAppAuditConcierge';
import './globals.css';

const plusJakarta = localFont({
  src: [
    {
      path: '../../node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2',
      weight: '200 800',
      style: 'normal',
    },
    {
      path: '../../node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-italic.woff2',
      weight: '200 800',
      style: 'italic',
    },
  ],
  variable: '--font-jakarta',
  display: 'swap',
  fallback: ['Inter', 'system-ui', 'sans-serif'],
});

const jetbrainsMono = localFont({
  src: [
    {
      path: '../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
      weight: '100 800',
      style: 'normal',
    },
  ],
  variable: '--font-jetbrains',
  display: 'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'monospace'],
});

const instrumentSerif = localFont({
  src: [
    {
      path: '../../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-instrument',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#060608' },
    { media: '(prefers-color-scheme: light)', color: '#f5f5f0' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: 'Haris Khan Durrani — Head of IT | Senior Full-Stack Developer | Solution Architect',
    template: '%s | Haris Khan Durrani — Head of IT & Solution Architect',
  },
  description:
    'Dubai-based Head of IT, Senior Full-Stack Developer, and CRM & Automation Specialist with 9+ years of experience architecting enterprise SaaS, ERP/CRM, telephony, and cloud infrastructure.',
  applicationName: 'Haris Khan Durrani Portfolio',
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  keywords: [
    'Haris Khan Durrani',
    'Head of IT Dubai',
    'Head of IT UAE',
    'Solution Architect Dubai',
    'Solution Architect UAE',
    'Fractional CTO Dubai',
    'Senior Full-Stack Developer Dubai',
    'Senior Full-Stack Developer Abu Dhabi',
    'EBMS Business Services',
    'GoHighLevel Expert Dubai',
    'GoHighLevel API v2 OAuth',
    'Zoho CRM Consultant UAE',
    '3CX Cloud PBX Telephony Dubai',
    'Next.js Architect UAE',
    'Node.js TypeScript Architect',
    'PostgreSQL Disaster Recovery',
    'Docker DevOps UAE',
    'Laravel PHP Enterprise',
    'Multi-Tenant SaaS ERP UAE',
    'WhatsApp Business API UAE',
  ],
  alternates: {
    canonical: '/',
    languages: {
      'en-AE': SITE_CONFIG.url,
      'en-US': SITE_CONFIG.url,
      'x-default': SITE_CONFIG.url,
    },
    types: {
      'application/rss+xml': `${SITE_CONFIG.url}/rss.xml`,
    },
  },
  other: {
    'geo.region': 'AE-DU',
    'geo.placename': 'Dubai, United Arab Emirates',
    'geo.position': '25.2048;55.2708',
    ICBM: '25.2048, 55.2708',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: 'Haris Khan Durrani — Head of IT & Senior Full-Stack Developer',
    description:
      'Technology leader with 9+ years experience architecting enterprise SaaS, ERP/CRM, and workflow automation platforms across Dubai & global enterprises.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Haris Khan Durrani — Head of IT & Solution Architect',
    description:
      'Engineering systems that move businesses — from architecture through hands-on full-stack code, telephony, and DevOps.',
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
  category: 'technology',
};

const themeInitScript = `
(function(){
  try {
    var saved = localStorage.getItem('hkd-theme');
    var theme = (saved === 'light' || saved === 'dark') ? saved : 'dark';
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = 'dark';
  }
  window.addEventListener('error', function(e) {
    var msg = (e && e.message) || '';
    if (msg.indexOf('ChunkLoadError') !== -1 || msg.indexOf('Loading chunk') !== -1) {
      var key = 'hkd_chunk_reload';
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1');
        window.location.reload();
      }
    }
  }, true);
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-[var(--acid)] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-bold focus:text-[#060608]"
        >
          Skip to main content
        </a>
        {children}
        <WhatsAppAuditConcierge />
      </body>
    </html>
  );
}
