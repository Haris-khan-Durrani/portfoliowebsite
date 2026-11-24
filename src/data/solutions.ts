export interface UaeSolutionLanding {
  slug: string;
  title: string;
  shortTitle: string;
  heroHeadline: string;
  heroHighlight: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  targetKeywords: string[];
  painPoints: string[];
  deliverables: { title: string; detail: string }[];
  proofMetrics: { value: string; label: string }[];
  relatedProjectSlugs: string[];
  faqs: { question: string; answer: string }[];
}

export const UAE_SOLUTIONS: UaeSolutionLanding[] = [
  {
    slug: 'fractional-cto-head-of-it-dubai-uae',
    title: 'Fractional CTO & Head of IT Advisory in Dubai, UAE',
    shortTitle: 'Fractional CTO & Head of IT Dubai',
    heroHeadline: 'Executive Technology Leadership & Hands-On',
    heroHighlight: 'Solution Architecture in Dubai.',
    metaTitle: 'Fractional CTO & Head of IT Consultant in Dubai, UAE | Haris Khan Durrani',
    metaDescription:
      'Hire Haris Khan Durrani for Fractional CTO, Head of IT leadership, and Enterprise Solution Architecture in Dubai, Abu Dhabi & UAE. 9+ years scaling 105-user multi-company systems.',
    summary:
      'Bridge the gap between boardroom technology strategy and production full-stack execution. I help UAE multi-company groups, consultancies, and scaling enterprises eliminate 80% of redundant SaaS spend, mentor engineering teams, and ship resilient internal platforms.',
    targetKeywords: [
      'Fractional CTO Dubai',
      'Head of IT UAE',
      'Solution Architect Dubai',
      'IT Director Consultant UAE',
      'Enterprise Technology Advisor Dubai',
    ],
    painPoints: [
      'Paying for fragmented, overlapping SaaS subscriptions across sister companies with zero unified reporting.',
      'External agencies delivering slow, unmaintainable software with vendor lock-in and weak security.',
      'Lack of senior in-house architectural leadership to guide developers, DevOps, and CRM/telephony integrations.',
    ],
    deliverables: [
      {
        title: 'Multi-Company SaaS & Tooling Consolidation',
        detail:
          'Audit and unify disparate CRM, ERP, and document tools onto a single multi-tenant API foundation—modeled on our 80% cost reduction across EBMS & 9 sister companies.',
      },
      {
        title: 'Engineering Team Leadership & Code Governance',
        detail:
          'Recruit, mentor, and lead full-stack developers (React, Next.js, Node.js, PHP/Laravel) with strict code reviews, CI/CD, and RBAC security standards.',
      },
      {
        title: 'Linux VPS, Docker & Disaster Recovery Hardening',
        detail:
          'Eliminate downtime and data-loss risk with containerized microservices, Nginx SSL reverse proxies, and automated AES-256 database backups.',
      },
    ],
    proofMetrics: [
      { value: '9+ Yrs', label: 'UAE Technology Leadership' },
      { value: '105 Users', label: 'Active Enterprise Scale' },
      { value: '-80%', label: 'Duplicate SaaS Overhead Cut' },
      { value: '9 Co.', label: 'Sister Companies Unified' },
    ],
    relatedProjectSlugs: ['proposal', 'ebmsportal', 'pgvault'],
    faqs: [
      {
        question: 'What does a Fractional CTO / Head of IT do for a Dubai enterprise group?',
        answer:
          'A Fractional CTO or Head of IT owns your technology roadmap, solution architecture, vendor consolidation, cybersecurity (JWT/RBAC/AES-256), and engineering team delivery—providing executive leadership alongside hands-on Next.js, Node.js, CRM, and telephony implementation at a fraction of a full-time C-suite cost.',
      },
      {
        question: 'Can you audit and rescue an existing legacy ERP or fragmented CRM setup in the UAE?',
        answer:
          'Yes. I regularly audit existing UAE corporate technology stacks, identify duplicate licensing and bottlenecks, and design phased migration architectures that unify operations without disrupting daily sales or client service.',
      },
    ],
  },
  {
    slug: 'gohighlevel-zoho-crm-automation-expert-dubai',
    title: 'GoHighLevel OAuth 2.0 & Zoho CRM Automation Architect in Dubai, UAE',
    shortTitle: 'GoHighLevel & Zoho CRM Architect UAE',
    heroHeadline: 'White-Label CRM Portals & Bi-Directional',
    heroHighlight: 'GoHighLevel + Zoho Automation.',
    metaTitle: 'GoHighLevel API v2 & Zoho CRM Automation Expert Dubai, UAE | Haris Khan Durrani',
    metaDescription:
      'Custom GoHighLevel OAuth 2.0 white-label portals, Zoho CRM API integrations, WhatsApp Business API, and workflow automation for Dubai & UAE enterprises.',
    summary:
      'Move beyond fragile Zapier polling. I engineer custom Node.js & MySQL middleware hubs that connect GoHighLevel API v2 (OAuth 2.0), Zoho CRM, WhatsApp Business API, and internal ERPs with sub-250ms real-time webhook synchronization.',
    targetKeywords: [
      'GoHighLevel Expert Dubai',
      'GoHighLevel API v2 Developer UAE',
      'Zoho CRM Integration Specialist Dubai',
      'White-Label CRM Portal UAE',
      'WhatsApp CRM Automation Dubai',
    ],
    painPoints: [
      'Per-seat CRM licensing fees multiplying across multiple branches or sister companies.',
      'Broken Zapier / Make workflows dropping leads or taking 15+ minutes to sync pipeline updates.',
      'Sales reps manually copying client data between CRM deals, proposals, and WhatsApp.',
    ],
    deliverables: [
      {
        title: 'White-Label Multi-Tenant GoHighLevel OAuth 2.0 Portals',
        detail:
          'Custom Node.js + MySQL portals that synchronize multiple GoHighLevel sub-accounts with atomic refresh-token rotation and strict tenant RBAC.',
      },
      {
        title: 'Zoho CRM & Custom ERP Bi-Directional Sync',
        detail:
          'Hardened HMAC webhook ingestion engines connecting Zoho CRM deals, custom modules, and financial ledgers in real time.',
      },
      {
        title: 'Automated Proposal & WhatsApp Lifecycle Triggers',
        detail:
          'Instant WATI / WhatsApp Business API template dispatch and 680ms PDF contract generation triggered directly from CRM stage changes.',
      },
    ],
    proofMetrics: [
      { value: '<250ms', label: 'Real-Time Webhook Sync' },
      { value: '-80%', label: 'CRM Licensing Savings' },
      { value: '680ms', label: 'Automated PDF Proposal Render' },
      { value: '99.98%', label: 'OAuth Token Uptime' },
    ],
    relatedProjectSlugs: ['ebmsportal', 'proposal', 'whatsapp'],
    faqs: [
      {
        question: 'Can you build a custom white-label dashboard on top of GoHighLevel API v2?',
        answer:
          'Yes. Using GoHighLevel OAuth 2.0, Node.js, and MySQL, I build custom white-label portals that give your staff or clients a tailored interface with granular permissions while keeping contacts, opportunities, and custom fields synced in real time.',
      },
      {
        question: 'Do you integrate WhatsApp Business API and WATI with Zoho CRM and GoHighLevel in Dubai?',
        answer:
          'Yes. I engineer automated WhatsApp OTP verification, Meta template dispatchers, and two-way webhook listeners that log customer replies and trigger pipeline actions inside both Zoho CRM and GoHighLevel.',
      },
    ],
  },
  {
    slug: '3cx-cloud-pbx-ai-auto-dialer-integration-uae',
    title: '3CX Cloud PBX, AI Auto-Dialer & WebRTC Telephony Integration in UAE',
    shortTitle: '3CX AI Telephony & Dialer UAE',
    heroHeadline: 'Bridge Website Leads to Sales Extensions in',
    heroHighlight: '450ms with 3CX & WebRTC.',
    metaTitle: '3CX Cloud PBX, AI Auto-Dialer & CRM Integration Dubai, UAE | Haris Khan Durrani',
    metaDescription:
      'Custom 3CX Call Control API integration, AI outbound auto-dialers, WebRTC website click-to-call widgets, and CRM call recording sync in Dubai & UAE.',
    summary:
      'Turn your 3CX PBX into an automated revenue engine. I build real-time Node.js & WebSocket telephony gateways that connect outbound auto-dialer queues, website click-to-call widgets, and signed call recordings directly to your CRM.',
    targetKeywords: [
      '3CX Integration Dubai',
      '3CX Call Control API Developer',
      'AI Auto Dialer UAE',
      'WebRTC Click to Call Widget',
      '3CX Zoho GoHighLevel Integration',
    ],
    painPoints: [
      'High-intent website visitors leaving because no sales agent calls them within the first 5 minutes.',
      'Sales reps wasting hours dialing numbers manually instead of speaking with qualified prospects.',
      'Unlogged phone calls and missing audio recordings inside Zoho CRM or GoHighLevel.',
    ],
    deliverables: [
      {
        title: 'AI-Assisted Outbound Auto-Dialer Queue',
        detail:
          'Automated campaign dialer that checks live 3CX agent extension presence and bridges outbound calls the instant an agent becomes available.',
      },
      {
        title: 'Zero-Dependency Website Click-to-Call Widget',
        detail:
          'Lightweight vanilla JS embed that lets website visitors request an instant phone bridge to your Dubai sales team in 450ms.',
      },
      {
        title: 'Automated CDR & Signed Recording Attribution',
        detail:
          'Every call duration, disposition, extension ID, and HMAC-signed S3 recording link is automatically pushed to the lead’s CRM timeline.',
      },
    ],
    proofMetrics: [
      { value: '450ms', label: 'Web-to-Agent Call Bridge' },
      { value: '100%', label: 'Automated CRM Call Logging' },
      { value: '<8KB', label: 'Embeddable Call Widget' },
      { value: '24/7', label: 'Timezone-Aware Routing' },
    ],
    relatedProjectSlugs: ['3cx', 'whatsapp', 'ebmsportal'],
    faqs: [
      {
        question: 'Can 3CX PBX automatically dial new CRM leads and connect them to available agents?',
        answer:
          'Yes. By connecting your CRM webhooks to our Node.js 3CX Call Control API gateway, new high-priority leads immediately trigger an extension check and ring the assigned sales representative before bridging the outbound call.',
      },
      {
        question: 'Are 3CX admin credentials exposed to the frontend call widget?',
        answer:
          'Never. The browser widget communicates exclusively with a rate-limited, JWT-authenticated Node.js proxy gateway that manages 3CX PBX sessions securely on the server.',
      },
    ],
  },
  {
    slug: 'custom-multi-tenant-saas-erp-development-dubai',
    title: 'Custom Multi-Tenant SaaS & Enterprise ERP Development in Dubai, UAE',
    shortTitle: 'Multi-Tenant SaaS & ERP Architect Dubai',
    heroHeadline: 'Production Multi-Tenant SaaS & ERPs Built on',
    heroHighlight: 'Next.js, Node.js, Prisma & MySQL.',
    metaTitle: 'Custom Multi-Tenant SaaS & ERP Developer Dubai, UAE | Haris Khan Durrani',
    metaDescription:
      'Architect and ship custom multi-tenant SaaS platforms, School/Corporate ERPs, UAE VAT 201 accounting software, and real-time collaborative apps in Dubai.',
    summary:
      'From multi-campus School ERPs (sms.onesol.ae) and real-time collaborative databases (tablehub.ai) to UAE FTA VAT 201 accounting platforms, I architect and ship production SaaS systems with strict tenant isolation and Stripe billing.',
    targetKeywords: [
      'Custom ERP Developer Dubai',
      'Multi-Tenant SaaS Architect UAE',
      'Next.js Node.js Developer Dubai',
      'UAE VAT 201 Software Development',
      'School ERP System UAE',
    ],
    painPoints: [
      'Off-the-shelf ERP software that is too rigid for UAE freezone, VAT 201, or multi-branch workflows.',
      'Slow spreadsheet processes that break when 50+ team members collaborate simultaneously.',
      'Weak tenant isolation or insecure Stripe webhook implementations risking cross-tenant data leaks.',
    ],
    deliverables: [
      {
        title: 'Multi-Tenant Database & RBAC Architecture',
        detail:
          'End-to-end Next.js, TypeScript, Prisma ORM, and MySQL/PostgreSQL architectures with dual-boundary Role-Based Access Control.',
      },
      {
        title: 'Real-Time Socket.IO Collaboration & Dashboards',
        detail:
          'Sub-10ms live operational grids, kanban boards, and executive analytics modeled on TableHub.ai.',
      },
      {
        title: 'Hardened Stripe Billing & UAE VAT 201 Compliance',
        detail:
          'Fail-closed HMAC Stripe subscription state machines, double-entry ledgers, and deterministic PDF invoice engines.',
      },
    ],
    proofMetrics: [
      { value: '3.8ms', label: 'Prisma MySQL Commit Latency' },
      { value: '<10ms', label: 'Socket.IO Delta Broadcast' },
      { value: '12+', label: 'Production Platforms Shipped' },
      { value: '100%', label: 'UAE VAT 201 Compliant' },
    ],
    relatedProjectSlugs: ['school', 'tablehub', 'accounting'],
    faqs: [
      {
        question: 'What stack do you use to build multi-tenant SaaS and ERP platforms in Dubai?',
        answer:
          'I use Next.js, React, TypeScript, Node.js, Express, Prisma ORM, and MySQL/PostgreSQL, paired with Socket.IO for real-time collaboration, Stripe for subscription billing, WhatsApp Business API for notifications, and Docker on Linux for deployment.',
      },
    ],
  },
];

export function getUaeSolutionBySlug(slug: string): UaeSolutionLanding | undefined {
  return UAE_SOLUTIONS.find((s) => s.slug === slug);
}
