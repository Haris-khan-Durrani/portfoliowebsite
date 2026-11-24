import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/data/portfolio';
import { InteractiveToolsHub } from '@/components/tools/InteractiveToolsHub';
import { Footer } from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Free UAE SaaS ROI, 3CX Auto-Dialer & FTA VAT 201 Calculators',
  description:
    'Interactive UAE business & engineering calculators by Haris Khan Durrani (Head of IT & Solution Architect, Dubai): Multi-Company CRM/SaaS Consolidation Savings, 3CX Speed-to-Lead ROI, UAE FTA VAT 201 Tax Calculator, and HMAC-SHA256 Webhook Tester.',
  keywords: [
    'UAE VAT 201 Calculator',
    'SaaS Consolidation ROI Calculator UAE',
    'GoHighLevel Cost Calculator Dubai',
    '3CX Auto Dialer ROI Calculator',
    'Webhook HMAC SHA256 Generator',
    'Haris Khan Durrani Tools',
  ],
  alternates: {
    canonical: '/tools',
  },
  openGraph: {
    title: `UAE Enterprise ROI, VAT 201 & Architecture Calculators | ${SITE_CONFIG.name}`,
    description:
      'Interactive calculators for UAE multi-company SaaS savings, 3CX telephony speed-to-lead ROI, and UAE FTA VAT 201 filings.',
    url: `${SITE_CONFIG.url}/tools`,
    type: 'website',
  },
};

export default function ToolsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'UAE Enterprise SaaS ROI, 3CX Dialer & FTA VAT 201 Calculators',
    url: `${SITE_CONFIG.url}/tools`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AED',
    },
    author: {
      '@type': 'Person',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <InteractiveToolsHub />
      <Footer />
    </>
  );
}
