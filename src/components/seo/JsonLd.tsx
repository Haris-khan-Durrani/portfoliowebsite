import { PROJECTS, SITE_CONFIG, SKILLS_ROW_1, SKILLS_ROW_2, type ProjectItem } from '@/data/portfolio';

export const UAE_AUTHORITY_FAQS = [
  {
    question:
      'Who is Haris Khan Durrani and what enterprise technology services does he lead in Dubai and the UAE?',
    answer:
      'Haris Khan Durrani is a Dubai-based Head of IT, Solution Architect, and Senior Full-Stack Developer with 9+ years of experience in the UAE. At EBMS Business Services in Dubai, he leads technology strategy and engineering across 9 sister companies serving 105 internal users—specializing in Multi-Tenant SaaS, ERP/CRM architecture, GoHighLevel OAuth 2.0 integrations, Zoho CRM automation, 3CX Cloud PBX AI telephony, and Docker/Linux cloud infrastructure.',
  },
  {
    question:
      'How can UAE multi-company groups reduce duplicate SaaS and CRM licensing costs by 80%?',
    answer:
      'By replacing isolated per-company CRM and document subscriptions with a centralized API-driven multi-tenant middleware layer (using Node.js, MySQL, GoHighLevel API v2 OAuth 2.0, and deterministic mPDF proposal engines). At EBMS Group in Dubai, this architecture cut duplicate SaaS tooling overhead by 80% while giving 105 users real-time bi-directional pipeline synchronization.',
  },
  {
    question:
      'How do Dubai enterprises integrate 3CX PBX phone systems with GoHighLevel, Zoho CRM, and WhatsApp Business API?',
    answer:
      'Through a token-authenticated Node.js and WebSocket telephony gateway that connects the 3CX Call Control API and WebRTC website call widgets directly to CRM webhooks. Outbound and inbound calls bridge to sales extensions in ~450ms and automatically log call dispositions, durations, and HMAC-signed audio recording URLs into GoHighLevel and Zoho CRM while triggering WhatsApp Business API follow-ups.',
  },
  {
    question:
      'Is Haris Khan Durrani available for Fractional CTO, Head of IT advisory, and custom SaaS/ERP architecture across Dubai, Abu Dhabi, and the GCC?',
    answer:
      'Yes. Haris Khan Durrani provides Solution Architecture consulting, Fractional CTO leadership, custom Next.js/Node.js multi-tenant SaaS & ERP development, and CRM/telephony automation across Dubai, Abu Dhabi, Sharjah, all 7 UAE Emirates, and global remote enterprises. Direct contact: +971 55 1651588 or haris.khan5117@gmail.com.',
  },
];

export function PortfolioJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_CONFIG.url}/#website`,
        url: SITE_CONFIG.url,
        name: `${SITE_CONFIG.name} — Head of IT, Solution Architect & Senior Full-Stack Developer (Dubai, UAE)`,
        description: SITE_CONFIG.heroDescription,
        inLanguage: 'en-AE',
        publisher: {
          '@id': `${SITE_CONFIG.url}/#person`,
        },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_CONFIG.url}/#profilepage`,
        url: SITE_CONFIG.url,
        name: `${SITE_CONFIG.name} — Head of IT | Senior Full-Stack Developer | Solution Architect Dubai, UAE`,
        isPartOf: { '@id': `${SITE_CONFIG.url}/#website` },
        mainEntity: { '@id': `${SITE_CONFIG.url}/#person` },
        dateModified: new Date().toISOString().split('T')[0],
      },
      {
        '@type': 'Person',
        '@id': `${SITE_CONFIG.url}/#person`,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        jobTitle: SITE_CONFIG.role,
        description: SITE_CONFIG.heroDescription,
        worksFor: {
          '@type': 'Organization',
          name: SITE_CONFIG.company,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Dubai',
            addressRegion: 'Dubai',
            addressCountry: 'AE',
          },
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dubai',
          addressRegion: 'Dubai',
          addressCountry: 'AE',
        },
        alumniOf: [
          {
            '@type': 'CollegeOrUniversity',
            name: 'Newports Institute of Communication and Economics (NICE)',
          },
          {
            '@type': 'EducationalOrganization',
            name: 'Aptech Computer Education',
          },
          {
            '@type': 'EducationalOrganization',
            name: 'Arena Multimedia',
          },
        ],
        knowsAbout: [...SKILLS_ROW_1, ...SKILLS_ROW_2],
        knowsLanguage: ['English', 'Urdu'],
        telephone: '+971551651588',
        email: `mailto:${SITE_CONFIG.email}`,
        sameAs: [SITE_CONFIG.github, SITE_CONFIG.linkedin],
      },
      // UAE-Wide Local & Regional Authority Schema (Covers all 7 Emirates + GCC)
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE_CONFIG.url}/#uae-service`,
        name: `${SITE_CONFIG.name} — Enterprise Solution Architecture, SaaS & IT Leadership (Dubai, UAE)`,
        url: SITE_CONFIG.url,
        image: `${SITE_CONFIG.url}/opengraph-image`,
        telephone: '+971551651588',
        email: SITE_CONFIG.email,
        priceRange: '$$$$',
        founder: { '@id': `${SITE_CONFIG.url}/#person` },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dubai',
          addressRegion: 'Dubai',
          addressCountry: 'AE',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 25.2048,
          longitude: 55.2708,
        },
        areaServed: [
          { '@type': 'City', name: 'Dubai' },
          { '@type': 'City', name: 'Abu Dhabi' },
          { '@type': 'City', name: 'Sharjah' },
          { '@type': 'City', name: 'Ajman' },
          { '@type': 'City', name: 'Ras Al Khaimah' },
          { '@type': 'City', name: 'Fujairah' },
          { '@type': 'City', name: 'Umm Al Quwain' },
          { '@type': 'Country', name: 'United Arab Emirates' },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'UAE Enterprise Architecture & Full-Stack Engineering Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Multi-Tenant SaaS & Custom ERP Architecture (Next.js, Node.js, Prisma, MySQL, PostgreSQL)',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'GoHighLevel OAuth 2.0 White-Label Portals & Zoho CRM Workflow Automation',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: '3CX Cloud PBX AI Auto-Dialer, WebRTC Click-to-Call & WhatsApp Business API Integration',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Fractional CTO, Head of IT Leadership & Linux/Docker Cloud Infrastructure Hardening',
              },
            },
          ],
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_CONFIG.url}/#projects`,
        name: 'Architected & Shipped Production Systems in Dubai & UAE',
        numberOfItems: PROJECTS.length,
        itemListElement: PROJECTS.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${SITE_CONFIG.url}/projects/${project.slug}`,
          item: {
            '@type': 'SoftwareApplication',
            name: project.title,
            applicationCategory: project.categoryLabel,
            operatingSystem: 'Web, Cloud, Linux, Docker',
            description: project.summary,
            author: { '@id': `${SITE_CONFIG.url}/#person` },
            ...(project.liveUrl ? { url: project.liveUrl } : {}),
            ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
          },
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_CONFIG.url}/#faq`,
        mainEntity: UAE_AUTHORITY_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProjectJsonLd({ project }: { project: ProjectItem }) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_CONFIG.url,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Systems',
            item: `${SITE_CONFIG.url}/#work`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: project.title,
            item: `${SITE_CONFIG.url}/projects/${project.slug}`,
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: project.blueprint.title,
        applicationCategory: project.blueprint.category,
        description: project.summary,
        operatingSystem: 'Web, Cloud, Linux, Docker',
        author: {
          '@type': 'Person',
          name: SITE_CONFIG.name,
          url: SITE_CONFIG.url,
        },
        ...(project.image ? { image: `${SITE_CONFIG.url}${project.image}` } : {}),
        ...(project.liveUrl ? { url: project.liveUrl } : {}),
        ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
