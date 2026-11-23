export type ProjectCategory = 'all' | 'saas' | 'telephony' | 'crm' | 'infra';

export interface HeroStat {
  id: string;
  target: number;
  suffix: string;
  label: string;
  sublabel: string;
}

export interface TopologyNode {
  id: string;
  slug: string;
  name: string;
  shortLabel: string;
  region: string;
  protocol: string;
  latencyMs: number;
  status: string;
  metric: string;
  x: number;
  y: number;
  routePath: string;
  previewImage?: string;
  accent: 'acid' | 'cyan';
  stack: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  period: string;
  role: string;
  highlight?: boolean;
  bullets: string[];
  metrics: { label: string; value: string }[];
}

export interface EducationItem {
  category: string;
  title: string;
  detail: string;
}

export interface DossierItem {
  id: string;
  caseKey: string;
  tag: string;
  title: string;
  description: string;
  stackLabel: string;
  image?: string;
  badge: string;
}

export interface CodeSnippetItem {
  id: 'telephony' | 'portal' | 'whatsapp' | 'backup';
  filename: string;
  language: string;
  runtimeLabel: string;
  badge: string;
  code: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  category: Exclude<ProjectCategory, 'all'>;
  categoryLabel: string;
  starsLabel: string;
  title: string;
  shortTitle: string;
  summary: string;
  tags: string[];
  previewHeaderLeft: string;
  previewHeaderTag: string;
  previewLines: { text: string; tone: 'bright' | 'acid' | 'muted' }[];
  image?: string;
  liveUrl?: string;
  liveLabel?: string;
  githubUrl?: string;
  githubLabel?: string;
  privateLabel?: string;
  blueprint: {
    category: string;
    title: string;
    role: string;
    problem: string;
    stack: string[];
    flow: string[];
    decisions: string[];
    outcome: string;
  };
}

export interface ArchitectureLayer {
  index: string;
  title: string;
  description: string;
  tag: string;
  highlights: string[];
}

export const SITE_CONFIG = {
  name: 'Haris Khan Durrani',
  initials: 'HKD',
  role: 'Head of IT | Senior Full-Stack Developer | Solution Architect',
  shortRole: 'Head of IT & Architect',
  subtitle: 'Head of IT | Senior Full-Stack Developer',
  location: 'Dubai, United Arab Emirates',
  locationShort: 'Dubai · UAE',
  availability: 'Dubai · Available',
  company: 'EBMS Business Services',
  domain: 'hariskhandurrani.com',
  url: 'https://hariskhandurrani.com',
  email: 'haris.khan5117@gmail.com',
  phone: '+971 55 1651588',
  phoneHref: 'tel:+971551651588',
  whatsappHref: 'https://wa.me/971551651588',
  github: 'https://github.com/Haris-Khan-Durrani',
  githubHandle: '@Haris-Khan-Durrani',
  linkedin: 'https://linkedin.com/in/Haris-Khan-Durrani',
  linkedinHandle: '/in/Haris-Khan-Durrani',
  heroDescription:
    'Technology leader and Senior Full-Stack Developer with 9+ years of experience architecting enterprise SaaS, ERP/CRM, and workflow automation platforms that replace manual processes and scale across companies. Leading engineering and IT teams while remaining hands-on in React, Next.js, Node.js, PHP/Laravel, 3CX, and GoHighLevel.',
  experienceIntro:
    '9+ years leading IT strategy, software delivery, and full-stack engineering across the UAE. Managing end-to-end infrastructure, security, and developer teams.',
  dossiersIntro:
    'Interactive folder deck showcasing core enterprise systems designed for EBMS and group companies. Hover or click to fan out and inspect system blueprints.',
  codeIntro:
    'Real architectural code patterns from telephony gateways, CRM webhooks, multi-device WhatsApp, and encrypted PostgreSQL backup daemons.',
  projectsIntro:
    'Real production systems, enterprise integrations, and open-source tooling. Every system can be inspected down to its problem, flow, and architecture.',
  architectureIntro:
    'My unique value is strongest where product strategy, engineering rigor, and operations meet. I navigate effortlessly between executive architectural decision-making and low-level code execution without losing context.',
  contactIntro:
    "Available for Technology Leadership, Solution Architecture advisory, fractional CTO roles, and high-impact enterprise system deliveries in Dubai, the UAE, and globally. Let's discuss your engineering bottlenecks and platforms.",
  languages: 'English (Professional), Urdu (Native)',
  securityPractices: 'JWT, RBAC, OAuth 2.0, AES-256',
} as const;

export const HERO_STATS: HeroStat[] = [
  {
    id: 'years',
    target: 9,
    suffix: '+',
    label: 'Years Leadership',
    sublabel: 'UAE & Global Delivery',
  },
  {
    id: 'users',
    target: 105,
    suffix: ' Users',
    label: 'EBMS Systems Scale',
    sublabel: '9 Sister Companies',
  },
  {
    id: 'reduction',
    target: 80,
    suffix: '%',
    label: 'Duplicate Tooling Cut',
    sublabel: 'Unified API Core',
  },
  {
    id: 'platforms',
    target: 12,
    suffix: '+',
    label: 'Production Platforms',
    sublabel: 'SaaS · ERP · PBX',
  },
];

// Hero 55-inspired Interactive Dubai Enterprise Topology Map routes
export const TOPOLOGY_NODES: TopologyNode[] = [
  {
    id: 'proposal',
    slug: 'proposal',
    name: 'Proposal & Contract Engine',
    shortLabel: 'Proposal Engine',
    region: 'Business Bay · 9 Companies',
    protocol: 'REST + mPDF Stream',
    latencyMs: 680,
    status: 'PRIVATE PROD',
    metric: '-85% turnaround · 105 users',
    x: 418,
    y: 88,
    routePath: 'M 94 246 L 166 246 L 166 154 L 296 154 L 296 88 L 418 88',
    previewImage: '/assets/proposal.jpg',
    accent: 'acid',
    stack: ['Node.js', 'MySQL', 'GrapesJS', 'mPDF'],
  },
  {
    id: 'ebmsportal',
    slug: 'ebmsportal',
    name: 'EBMS Group White-Label Portal',
    shortLabel: 'EBMS Portal',
    region: 'DIFC Cluster · GHL OAuth v2',
    protocol: 'OAuth 2.0 + HMAC',
    latencyMs: 18,
    status: 'SYNCED LIVE',
    metric: '-80% duplicate SaaS overhead',
    x: 392,
    y: 196,
    routePath: 'M 94 246 L 210 246 L 210 196 L 392 196',
    previewImage: '/assets/portal.jpg',
    accent: 'acid',
    stack: ['GHL v2', 'Node.js', 'MySQL', 'Tailwind'],
  },
  {
    id: 'school',
    slug: 'school',
    name: 'School Management ERP',
    shortLabel: 'sms.onesol.ae',
    region: 'UAE Cloud · Multi-Tenant',
    protocol: 'Next.js + Prisma + WA',
    latencyMs: 24,
    status: 'LIVE SAAS',
    metric: 'Admissions · Fees · WhatsApp',
    x: 248,
    y: 78,
    routePath: 'M 94 246 L 138 246 L 138 118 L 248 118 L 248 78',
    previewImage: '/assets/school.jpg',
    accent: 'cyan',
    stack: ['Next.js', 'Prisma', 'RBAC', 'Docker'],
  },
  {
    id: 'tablehub',
    slug: 'tablehub',
    name: 'TableHub Database SaaS',
    shortLabel: 'tablehub.ai',
    region: 'Edge Cluster · Socket.IO',
    protocol: 'WebSocket Delta + Stripe',
    latencyMs: 4,
    status: 'LIVE SAAS',
    metric: '3.8ms Prisma commit · RT sync',
    x: 454,
    y: 286,
    routePath: 'M 94 246 L 194 246 L 194 316 L 368 316 L 368 286 L 454 286',
    previewImage: '/assets/tablehub.jpg',
    accent: 'cyan',
    stack: ['Next.js', 'TypeScript', 'Socket.IO', 'Stripe'],
  },
  {
    id: '3cx',
    slug: '3cx',
    name: '3CX AI Auto Caller & Dialer',
    shortLabel: '3CX AI PBX',
    region: 'Dubai PBX · Ext 102 Bridge',
    protocol: '3CX Call Control + WebRTC',
    latencyMs: 12,
    status: 'REALTIME PBX',
    metric: '450ms web-to-agent bridge',
    x: 318,
    y: 280,
    routePath: 'M 94 246 L 166 246 L 166 280 L 318 280',
    previewImage: '/assets/dialer.jpg',
    accent: 'acid',
    stack: ['Node.js', '3CX API', 'WebRTC', 'WebSockets'],
  },
  {
    id: 'pgvault',
    slug: 'pgvault',
    name: 'PGVault Core Recovery Daemon',
    shortLabel: 'PGVault S3',
    region: 'AWS S3 + GDrive · AES-256',
    protocol: 'Stream Gzip + GCM',
    latencyMs: 14,
    status: 'HEALTHY OSS',
    metric: '5-min RPO · Zero disk leak',
    x: 158,
    y: 344,
    routePath: 'M 94 246 L 94 344 L 158 344',
    previewImage: '/assets/pgvault.jpg',
    accent: 'cyan',
    stack: ['TypeScript', 'PostgreSQL', 'AWS S3', 'AES-256'],
  },
];

export const EXPERIENCE_LIST: ExperienceItem[] = [
  {
    id: 'ebms',
    company: 'EBMS Business Services',
    period: '2020 — PRESENT · DUBAI, UAE',
    role: 'Head of IT | Senior Full-Stack Developer | CRM & Automation Specialist',
    highlight: true,
    bullets: [
      'Spearheaded technology strategy, solution architecture, and engineering delivery across business operations, owning hands-on development and infrastructure for systems serving 105 internal users.',
      'Architected enterprise SaaS, ERP, CRM, proposal automation, and white-label portal platforms, giving EBMS and 9 sister companies a shared API-driven technology foundation and reducing duplicate tooling by 80%.',
      'Automated sales and operations workflows by integrating Zoho CRM, GoHighLevel, WhatsApp Business API, and 3CX telephony through custom REST/WebSocket APIs, eliminating repetitive manual work.',
      'Led and mentored development and IT teams while managing Linux VPS servers, databases, Docker deployments, security practices (JWT/RBAC), system availability, and technical support.',
    ],
    metrics: [
      { label: 'Team Leadership', value: 'Engineering & IT' },
      { label: 'Enterprise Scale', value: '105 Users / 9 Companies' },
      { label: 'Tooling Reduction', value: '-80% Overhead' },
      { label: 'Core Stack', value: 'React · Next.js · Node · GHL · 3CX · Docker' },
    ],
  },
  {
    id: 'capital-sands',
    company: 'Capital Sands Financial Services',
    period: '2019 — 2020 · UAE',
    role: 'Senior Web Developer',
    bullets: [
      'Engineered and maintained business web applications, integrations, and internal financial tools as a senior member of the development team.',
      'Implemented secure customer portal interfaces and robust API connections with high data integrity.',
    ],
    metrics: [
      { label: 'Domain', value: 'Financial Services' },
      { label: 'Focus', value: 'Business Apps & Internal Integrations' },
    ],
  },
  {
    id: 'tecxone',
    company: 'Tecxone',
    period: '2018 — 2019 · UAE',
    role: 'Senior Web Developer | Plugin Developer',
    bullets: [
      'Served as senior developer on Mymahd, an e-commerce platform for a regional brand.',
      'Engineered custom plugins and performance enhancements ensuring sub-second checkout speeds.',
    ],
    metrics: [
      { label: 'Project', value: 'Mymahd E-Commerce' },
      { label: 'Focus', value: 'Custom Plugin Architecture' },
    ],
  },
  {
    id: 'netxsite',
    company: 'Netxsite',
    period: '2017 — 2018 · UAE',
    role: 'Web Developer | Plugin Developer',
    bullets: [
      'Developed and maintained WordPress websites, custom plugins, and client-facing web solutions.',
      'Delivered high-performance themes with clean database query optimization.',
    ],
    metrics: [{ label: 'Focus', value: 'WordPress Engine & Plugin Engineering' }],
  },
];

export const EDUCATION_CREDENTIALS: EducationItem[] = [
  {
    category: 'HIGHER EDUCATION',
    title: 'BS Computer Science',
    detail:
      'Newports Institute of Communication and Economics (NICE) · Completed coursework through 5th semester (2017)',
  },
  {
    category: 'SOFTWARE ENGINEERING',
    title: 'ACCP Certified Programmer',
    detail: 'Aptech Computer Education · 3-Year Software Engineering Certification (2014 — 2017)',
  },
  {
    category: 'DESIGN & MULTIMEDIA',
    title: 'Graphic Design Certification',
    detail: 'Arena Multimedia (2017) · UI/UX Layouts, Visual Hierarchy & Brand Systems',
  },
];

export const DOSSIERS: DossierItem[] = [
  {
    id: 'dossier-proposal',
    caseKey: 'proposal',
    tag: 'DOCUMENT AUTOMATION',
    title: 'Proposal & Contract Engine',
    description:
      'Replaced manual sales documentation across EBMS and 9 sister companies. Custom workflows for 360 Audit & Business Setup with GrapesJS visual templates and deterministic mPDF rendering.',
    stackLabel: 'Node · MySQL · mPDF',
    image: '/assets/proposal.jpg',
    badge: '9 COMPANIES',
  },
  {
    id: 'dossier-portal',
    caseKey: 'ebmsportal',
    tag: 'WHITE-LABEL CRM PORTAL',
    title: 'Portal for EBMS & Sister Companies',
    description:
      'White-label CRM portal deployed across multiple group companies, providing centralized multi-tenant access and real-time GoHighLevel OAuth 2.0 data synchronization.',
    stackLabel: 'GHL OAuth · Node · EJS',
    image: '/assets/portal.jpg',
    badge: '-80% OVERHEAD',
  },
  {
    id: 'dossier-school',
    caseKey: 'school',
    tag: 'MULTI-TENANT SAAS',
    title: 'School Management ERP',
    description:
      'Multi-tenant school ERP covering admissions, fee management, examinations, payroll, family billing, data imports, and automated WhatsApp notifications. Live at sms.onesol.ae.',
    stackLabel: 'Next.js · Prisma · Docker',
    image: '/assets/school.jpg',
    badge: 'sms.onesol.ae',
  },
  {
    id: 'dossier-tablehub',
    caseKey: 'tablehub',
    tag: 'NO-CODE DATABASE SAAS',
    title: 'TableHub Collaborative Platform',
    description:
      'Airtable-style multi-tenant SaaS with customizable databases, dashboards, workflow automation, real-time collaboration, role permissions, and Stripe billing. Live at tablehub.ai.',
    stackLabel: 'React · Socket.IO · Stripe',
    image: '/assets/tablehub.jpg',
    badge: 'tablehub.ai',
  },
];

export const CODE_SNIPPETS: CodeSnippetItem[] = [
  {
    id: 'telephony',
    filename: '3CX-AutoDialer.js',
    language: 'JavaScript · Node.js',
    runtimeLabel: '3CX CALL CONTROL + WEBSOCKET',
    badge: 'REALTIME PBX',
    code: `// 3CX Call Control & AI Auto-Dialer Gateway
import { CallControlClient } from '@3cx/call-control-api';
import WebSocket from 'ws';

export class AutoDialerEngine {
  constructor(config) {
    this.client = new CallControlClient({
      host: config.pbxHost,
      apiKey: process.env.PBX_API_SECRET
    });
    this.ws = new WebSocket(config.streamUrl);
  }

  async dispatchCampaignCall(lead) {
    // Initiate WebRTC call bridge between PBX queue and destination
    const session = await this.client.makeCall({
      destination: lead.phone,
      callerId: '+9714XXXXXXX',
      queue: 'DXB_SALES_EXT_102'
    });
    
    // Broadcast real-time call telemetry to CRM agent widget
    this.ws.send(JSON.stringify({
      event: 'CALL_ENGAGED',
      callId: session.id,
      leadId: lead.id,
      timestamp: Date.now()
    }));
    return session;
  }
}`,
  },
  {
    id: 'portal',
    filename: 'GHL-Portal-Sync.ts',
    language: 'TypeScript · Express',
    runtimeLabel: 'GOHIGHLEVEL OAUTH V2 · HMAC',
    badge: 'MULTI-TENANT',
    code: `// EBMS Sister Company Portal & GoHighLevel v2 OAuth
import { Router, Request, Response } from 'express';
import { GHLClient } from './services/ghl';

export const portalRouter = Router();

portalRouter.post('/api/v2/contacts/sync', async (req: Request, res: Response) => {
  const { tenantId, contactPayload, signature } = req.body;
  
  // Verify HMAC signature against EBMS sister company secret
  if (!verifyTenantHMAC(signature, req.body, tenantId)) {
    return res.status(401).json({ error: 'UNAUTHORIZED_TENANT_ACCESS' });
  }

  const ghl = new GHLClient({ tenantId });
  const result = await ghl.upsertContactWithCustomFields({
    ...contactPayload,
    tags: ['EBMS_GROUP_VERIFIED', 'PROPOSAL_AUTOMATED']
  });

  return res.status(200).json({ status: 'SYNCED', contactId: result.id });
});`,
  },
  {
    id: 'whatsapp',
    filename: 'WATI-WhatsApp-OTP.js',
    language: 'JavaScript · Node.js',
    runtimeLabel: 'WATI META TEMPLATE DISPATCH',
    badge: 'OTP AUTH',
    code: `// WATI Meta Template & Transactional OTP Dispatcher
const axios = require('axios');
const crypto = require('crypto');

async function dispatchWhatsAppOTP(recipientPhone, templateName = 'auth_otp_v2') {
  const otpCode = crypto.randomInt(100000, 999999).toString();
  
  const payload = {
    template_name: templateName,
    broadcast_name: \`OTP_\${Date.now()}\`,
    parameters: [
      { name: 'code', value: otpCode },
      { name: 'validity_minutes', value: '10' }
    ]
  };

  const response = await axios.post(
    \`\${process.env.WATI_API_ENDPOINT}/api/v1/sendTemplateMessage?whatsappNumber=\${recipientPhone}\`,
    payload,
    { headers: { Authorization: \`Bearer \${process.env.WATI_ACCESS_TOKEN}\` } }
  );

  return { success: response.status === 200, otpCode, messageId: response.data.id };
}`,
  },
  {
    id: 'backup',
    filename: 'PGVault-Stream-Backup.ts',
    language: 'TypeScript · AWS S3',
    runtimeLabel: 'AES-256-GCM ZERO-LEAK STREAM',
    badge: 'DISASTER RECOVERY',
    code: `// PGVault Core: High-Efficiency Streamed PostgreSQL Backup
import { spawn } from 'child_process';
import { createGzip, createCipheriv } from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function runEncryptedStreamDump(dbConfig: DBConfig, s3Target: S3Target) {
  // Stream pg_dump directly through Gzip and AES-256-GCM cipher (Zero Disk Memory Leak)
  const dumpProc = spawn('pg_dump', ['-h', dbConfig.host, '-U', dbConfig.user, dbConfig.database]);
  const gzip = createGzip({ level: 9 });
  const cipher = createCipheriv('aes-256-gcm', process.env.ENCRYPTION_KEY!, process.env.IV!);

  const stream = dumpProc.stdout.pipe(gzip).pipe(cipher);
  
  const upload = new PutObjectCommand({
    Bucket: s3Target.bucket,
    Key: \`backups/\${dbConfig.database}-\${Date.now()}.sql.gz.enc\`,
    Body: stream
  });

  await s3Client.send(upload);
  return { status: 'DISASTER_RECOVERY_SEALED', timestamp: new Date().toISOString() };
}`,
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'proposal',
    slug: 'proposal',
    category: 'saas',
    categoryLabel: 'Enterprise Document Automation',
    starsLabel: 'EBMS & 9 Companies',
    title: 'Proposal & Contract Platform',
    shortTitle: 'Proposal & Contract Engine',
    summary:
      'Engineered a proposal and document-generation platform that replaced inconsistent manual sales documentation across EBMS and 9 sister companies. Adapted for 360 Audit & Business Setup Consultancy with custom workflows, dynamic templates, and deterministic mPDF rendering.',
    tags: ['Node.js', 'Express', 'MySQL', 'PHP', 'mPDF', 'GrapesJS', 'REST APIs'],
    previewHeaderLeft: 'proposal-engine // doc-gen',
    previewHeaderTag: '9 COMPANIES',
    previewLines: [
      { text: 'Audit: 360 Audit & Business Setup Consultancy template loaded', tone: 'bright' },
      { text: 'Dynamic GrapesJS canvas converted to PDF in 680ms', tone: 'acid' },
      { text: 'Automated sales proposals adopted across 105 EBMS users', tone: 'muted' },
    ],
    image: '/assets/proposal.jpg',
    privateLabel: 'Enterprise Private Deployment',
    blueprint: {
      category: 'Enterprise Document Automation',
      title: 'Proposal & Contract Automation Platform (EBMS & 9 Sister Companies)',
      role: 'Head of IT, Solution Architect, Full-Stack Lead Developer.',
      problem:
        'Inconsistent, manual sales documentation created formatting errors, untracked pricing variations, and lost hours across 105 team members and 9 group companies.',
      stack: ['Node.js', 'Express.js', 'MySQL', 'PHP', 'mPDF Engine', 'GrapesJS WYSIWYG', 'REST APIs'],
      flow: [
        'Template Ingestion: Dynamic layouts customized for 360 Audit & Business Setup Consultancy.',
        'Dynamic Data Binding: Auto-injects company details, packages, pricing schedules, and client terms.',
        'Visual In-Browser Builder: Sales reps customize scope with enforced brand and disclosure guardrails.',
        'Deterministic mPDF Render: Headless engine streams vector-crisp PDF documents in under 700ms.',
        'Group Distribution: Deployed as the central sales contract engine across EBMS and 9 sister companies.',
      ],
      decisions: [
        'Engineered strict server-side template validation to prevent sales agents from breaking legal compliance text.',
        'Utilized mPDF headless rendering over heavy browser headless instances (Puppeteer) to maintain 99.9% uptime on lightweight Linux servers.',
        'Centralized contract versioning in MySQL with cryptographic audit hash logging.',
      ],
      outcome:
        'Adopted across EBMS and 9 sister companies, reducing proposal turnaround time by 85% and standardizing multi-company sales contracts.',
    },
  },
  {
    id: 'ebmsportal',
    slug: 'ebmsportal',
    category: 'crm',
    categoryLabel: 'White-Label CRM & Multi-Tenant',
    starsLabel: 'Group Platform',
    title: 'Portal for EBMS Group',
    shortTitle: 'EBMS Group Portal',
    summary:
      'Developed a white-label CRM portal deployed across multiple group companies, providing centralized access and real-time GoHighLevel OAuth 2.0 data synchronization with Tailwind CSS and Node.js.',
    tags: ['GoHighLevel OAuth 2.0', 'Node.js', 'Express', 'MySQL', 'Tailwind CSS', 'EJS'],
    previewHeaderLeft: 'ebms-portal // ghl-v2-oauth',
    previewHeaderTag: 'MULTI-TENANT',
    previewLines: [
      { text: 'OAuth Token verified across sister company locations', tone: 'bright' },
      { text: 'Real-time bi-directional pipeline & lead synchronization', tone: 'acid' },
      { text: 'Reduced duplicate tooling overhead by 80% across the group', tone: 'muted' },
    ],
    image: '/assets/portal.jpg',
    privateLabel: 'Group Enterprise Platform',
    blueprint: {
      category: 'White-Label CRM Portal & Multi-Tenant',
      title: 'Portal for EBMS & Sister Companies',
      role: 'Head of IT, Solution Architect, GoHighLevel Integration Specialist.',
      problem:
        'Group companies were running disparate CRM tools, leading to duplicated subscription expenses, fragmented client records, and manual re-entry.',
      stack: ['GoHighLevel OAuth 2.0', 'Node.js', 'Express', 'MySQL', 'Tailwind CSS', 'EJS'],
      flow: [
        'OAuth 2.0 Group Authentication: Centralizes credentials for EBMS and multiple group subsidiaries.',
        'Real-time Data Synchronization: Hooks into GoHighLevel API v2 webhooks to mirror contact and pipeline updates.',
        'White-Label Interface: Serves tenant-tailored branding, permissions, and dashboards.',
        'Operational Reporting: Aggregates conversion metrics and agent workloads across sister companies.',
      ],
      decisions: [
        'Engineered a shared API layer allowing sister companies to leverage single GoHighLevel instances without cross-company data leakage.',
        'Used Tailwind CSS and server-rendered EJS templates for lightning-fast loads and zero frontend hydration lag.',
        'Integrated strict HMAC verification on incoming webhooks to ensure complete data security.',
      ],
      outcome:
        'Reduced duplicate tooling overhead by 80% across the group while giving 105 active users unified real-time CRM visibility.',
    },
  },
  {
    id: 'school',
    slug: 'school',
    category: 'saas',
    categoryLabel: 'Multi-Tenant Education ERP',
    starsLabel: 'Live SaaS',
    title: 'School Management ERP',
    shortTitle: 'School Management ERP',
    summary:
      'Architected a multi-tenant school ERP covering admissions, fee management, examinations, payroll, reporting, family billing, data imports, and automated WhatsApp notifications with strict RBAC security.',
    tags: ['Next.js', 'Node.js', 'Prisma ORM', 'MySQL', 'JWT / RBAC', 'Docker', 'WhatsApp API'],
    previewHeaderLeft: 'school-erp // multi-tenant',
    previewHeaderTag: 'LIVE: sms.onesol.ae',
    previewLines: [
      { text: 'RBAC Scopes: Admins, Accounts, Faculty, Parents, Students', tone: 'bright' },
      { text: 'Fee ledger & family billing reconciled with WhatsApp alerts', tone: 'acid' },
      { text: 'Dockerized production microservices running on high-availability VPS', tone: 'muted' },
    ],
    image: '/assets/school.jpg',
    liveUrl: 'https://sms.onesol.ae/',
    liveLabel: 'sms.onesol.ae',
    blueprint: {
      category: 'Multi-Tenant Education ERP',
      title: 'School Management ERP — Enterprise Multi-Tenant Platform',
      role: 'Solution Architect, Lead Full-Stack Next.js Developer, RBAC Systems Designer.',
      problem:
        'School networks struggle with fragmented legacy software that cannot scale across campuses, handle family billing, or automate communication with parents.',
      stack: [
        'Next.js',
        'Node.js',
        'Prisma ORM',
        'MySQL',
        'JWT Authentication',
        'RBAC Scopes',
        'Docker',
        'WhatsApp API',
      ],
      flow: [
        'Multi-Tenant Tenant Isolation: Scopes database models by institution and campus.',
        'Admissions & Fee Management: Tracks student enrollment, installments, fee reconciliations, and family billing ledgers.',
        'Examinations & Grading: Processes grade curves, report cards, and faculty schedules.',
        'Automated WhatsApp Alerts: Dispatches instant attendance notifications and fee reminders to parents.',
        'Dockerized Cloud Deployment: Multi-container setup ensuring zero-downtime scaling.',
      ],
      decisions: [
        'Enforced role-based access control (RBAC) at both API and ORM boundaries to protect confidential student and payroll records.',
        'Implemented asynchronous WhatsApp notification queues to prevent slow cellular network timeouts from blocking web requests.',
        'Containerized deployment using Docker Compose for reproducible production staging.',
      ],
      outcome:
        'Live in production at sms.onesol.ae, powering admissions, examinations, and automated parent communication across institutions.',
    },
  },
  {
    id: 'tablehub',
    slug: 'tablehub',
    category: 'saas',
    categoryLabel: 'No-Code Collaborative SaaS',
    starsLabel: 'Live SaaS',
    title: 'TableHub Database Platform',
    shortTitle: 'TableHub SaaS',
    summary:
      'Architected an Airtable-style multi-tenant SaaS with customizable databases, dashboards, workflow automation, real-time collaboration, role-based permissions, integrations, and Stripe subscription billing.',
    tags: ['Next.js', 'React', 'TypeScript', 'Prisma', 'MySQL', 'Socket.IO', 'Stripe'],
    previewHeaderLeft: 'tablehub // realtime-cluster',
    previewHeaderTag: 'LIVE: tablehub.ai',
    previewLines: [
      { text: 'Socket.IO operational delta broadcast to active team peers', tone: 'bright' },
      { text: 'Prisma transaction committed in 3.8ms with optimistic UI', tone: 'acid' },
      { text: 'Stripe Customer Portal & automated tier billing provisioning', tone: 'muted' },
    ],
    image: '/assets/tablehub.jpg',
    liveUrl: 'https://tablehub.ai/',
    liveLabel: 'tablehub.ai',
    githubUrl: 'https://github.com/Haris-Khan-Durrani',
    githubLabel: 'GitHub Profile',
    blueprint: {
      category: 'No-Code Database SaaS',
      title: 'TableHub — Real-Time Collaborative Platform',
      role: 'Lead Architect, Real-Time Full-Stack Developer, WebSocket Specialist.',
      problem:
        'Business teams outgrow static spreadsheets but find enterprise software rigid and expensive, needing custom databases with instant collaboration.',
      stack: ['Next.js', 'React', 'TypeScript', 'Prisma ORM', 'MySQL', 'Socket.IO', 'Stripe Billing'],
      flow: [
        'Dynamic Schema Builder: Users define custom tables, column types (text, formula, relation, select), and dashboard views.',
        'WebSocket Room Clustering: Syncs concurrent cell updates across team members in sub-10ms latency.',
        'Automated Workflow Logic: Triggers external webhooks and internal field calculations when threshold rules are met.',
        'Granular Role Permissions: Scopes read/write access per workspace, table, or column level.',
        'Stripe Subscription Billing: Handles tier provisioning, customer portal self-service, and invoice receipts.',
      ],
      decisions: [
        'Utilized optimistic UI updates on the frontend with server-side conflict resolution via timestamp reconciliation.',
        'Streamlined Prisma queries with selective field fetches to maintain high throughput during high-concurrency editing.',
      ],
      outcome:
        'Live in production at tablehub.ai, providing an Airtable-style collaborative operating system with enterprise RBAC and automated workflows.',
    },
  },
  {
    id: '3cx',
    slug: '3cx',
    category: 'telephony',
    categoryLabel: 'AI Telephony & Auto-Dialer',
    starsLabel: '3CX PBX Core',
    title: '3CX AI Auto Caller & Dialer',
    shortTitle: '3CX AI Dialer',
    summary:
      'Building an AI-assisted auto-calling and dialer platform with CRM integration, real-time call management, 3CX Call Control API bridging, and a lightweight website-to-agent calling widget.',
    tags: ['Node.js', 'Express', '3CX Call Control API', 'WebSockets', 'WebRTC', 'Docker'],
    previewHeaderLeft: '3cx-dialer // auto-caller',
    previewHeaderTag: 'REALTIME PBX',
    previewLines: [
      { text: 'Call Control API handshake → Outbound campaign queue', tone: 'bright' },
      { text: 'Bridged website caller to agent extension 102 in 450ms', tone: 'acid' },
      { text: 'Dispatched call audio recording signed URL to CRM webhook', tone: 'muted' },
    ],
    image: '/assets/dialer.jpg',
    githubUrl: 'https://github.com/Haris-Khan-Durrani/maqsam',
    githubLabel: 'Telephony Repo',
    blueprint: {
      category: 'AI Telephony & Call Control',
      title: '3CX AI Auto Caller, Dialer & Website Call Widget',
      role: 'Telephony Architect, Real-Time WebRTC Integration, PBX Integration Specialist.',
      problem:
        'Sales teams lose hot leads due to slow dialer response times, disconnect between web visitors and phone reps, and unlinked call recordings.',
      stack: ['Node.js', 'Express.js', '3CX Call Control API', 'WebSockets', 'WebRTC', 'Docker'],
      flow: [
        'Website Call Widget: Zero-dependency embed allows visitors to request instant phone callbacks with 1 click.',
        '3CX Call Control Bridging: Connects visitor phone numbers with available sales agent extensions in real time.',
        'AI Auto-Dialer Engine: Runs outbound calling campaigns based on CRM pipeline priorities.',
        'Webhook Lifecycle Broadcast: Emits call initiation, duration, and disposition events into Zoho CRM and GoHighLevel.',
        'Signed Recording Delivery: Generates short-lived HMAC-signed S3 links for recording compliance reviews.',
      ],
      decisions: [
        'Kept the frontend embed 100% vanilla to guarantee zero CSS/JS namespace collisions on client websites.',
        'Protected 3CX PBX admin credentials behind a token-authenticated backend proxy gateway.',
        'Implemented automatic timezone-aware office-hours routing with failover to voicemail.',
      ],
      outcome:
        'Turned complex VoIP PBX telephony into a high-conversion website widget and automated calling pipeline with full CRM attribution.',
    },
  },
  {
    id: 'nexus',
    slug: 'nexus',
    category: 'saas',
    categoryLabel: 'Interactive 3D Web & CMS',
    starsLabel: 'Live Website',
    title: 'Nexus Basketball 3D Platform',
    shortTitle: 'Nexus Basketball 3D',
    summary:
      'Built a fully custom WordPress platform with a bespoke theme and plugin-based admin layer so non-technical staff manage dynamic content. Implemented Three.js and GSAP interactions without sacrificing content manageability.',
    tags: ['WordPress', 'PHP', 'Custom Plugin', 'Three.js', 'GSAP', 'JavaScript'],
    previewHeaderLeft: 'nexus // three.js-court',
    previewHeaderTag: 'LIVE: nexusbasketball.com',
    previewLines: [
      { text: 'WebGL 3D interactive basketball court rendering at 60 FPS', tone: 'bright' },
      { text: 'GSAP scroll animations mapped to custom admin schema', tone: 'acid' },
      { text: 'Custom plugin admin layer eliminating visual builder bloat', tone: 'muted' },
    ],
    image: '/assets/nexus.jpg',
    liveUrl: 'https://nexusbasketball.com/',
    liveLabel: 'nexusbasketball.com',
    blueprint: {
      category: 'Interactive 3D Web & CMS',
      title: 'Nexus Basketball — Interactive 3D Platform',
      role: 'Full-Stack Developer, 3D WebGL Specialist, Custom WordPress Architect.',
      problem:
        'A sports entertainment brand needed a visually arresting 3D experience that non-technical marketing staff could still easily edit from a standard CMS.',
      stack: ['WordPress', 'PHP', 'Custom Plugin', 'Custom Theme', 'Three.js', 'GSAP', 'JavaScript'],
      flow: [
        'Custom Theme Architecture: Built from scratch without bloated commercial visual page builders.',
        'Three.js 3D Court: Renders an interactive 3D basketball court and dynamic physics at 60 FPS.',
        'GSAP Scroll Choreography: Coordinates camera angles and typography with visitor scroll position.',
        'Plugin-Based Admin Layer: Allows marketing teams to manage player rosters, schedules, and dynamic content.',
        'Performance Caching: Zero render blocking ensuring rapid first contentful paint.',
      ],
      decisions: [
        'Replaced commercial page builders with lightweight custom Gutenberg blocks to keep page payload minimal.',
        'Engineered Three.js render loops to pause when out of viewport, preserving mobile battery and CPU life.',
      ],
      outcome:
        'Delivered a state-of-the-art interactive experience at nexusbasketball.com with seamless backend content management for non-technical staff.',
    },
  },
  {
    id: 'hammam',
    slug: 'hammam',
    category: 'saas',
    categoryLabel: 'E-Commerce & Payments',
    starsLabel: 'Live Store',
    title: 'Home Of Hammam Storefront',
    shortTitle: 'Home Of Hammam',
    summary:
      'Delivered a responsive, high-conversion Shopify storefront with bespoke product catalog architecture, optimized checkout configuration, payment gateway integrations, and performance UX enhancements.',
    tags: ['Shopify', 'Liquid', 'Stripe', 'Responsive UX', 'Payment Gateways'],
    previewHeaderLeft: 'storefront // shopify-stripe',
    previewHeaderTag: 'LIVE: homeofhammam.ae',
    previewLines: [
      { text: 'Curated luxury Hammam product setup & localized currency', tone: 'bright' },
      { text: 'Frictionless mobile checkout flow with sub-second page loads', tone: 'acid' },
      { text: 'Delivered on-time storefront for regional UAE wellness brand', tone: 'muted' },
    ],
    image: '/assets/hammam.jpg',
    liveUrl: 'https://homeofhammam.ae/',
    liveLabel: 'homeofhammam.ae',
    blueprint: {
      category: 'E-Commerce & Payments',
      title: 'Home Of Hammam — Responsive Shopify Storefront',
      role: 'E-Commerce Engineer, UX Specialist, Payment Gateway Integration.',
      problem:
        'A luxury wellness brand required a bespoke digital shopping experience with local UAE payment processing and seamless mobile checkout.',
      stack: ['Shopify', 'Liquid', 'Stripe', 'Responsive UX', 'CSS3', 'Payment Gateways'],
      flow: [
        'Catalog Architecture: Curated product taxonomy for luxury Moroccan bath and hammam goods.',
        'Custom Liquid Optimization: Minimized asset weights and unneeded third-party apps.',
        'Checkout Configuration: Configured Stripe and local payment gateways with multi-currency support.',
        'Mobile UX Refinement: Streamlined one-thumb product exploration and cart drawer interactions.',
      ],
      decisions: [
        'Avoided slow third-party Shopify apps in favor of native Liquid components to maintain fast Core Web Vitals.',
        'Integrated clear trust badges and instant currency localization for GCC shoppers.',
      ],
      outcome:
        'Successfully launched homeofhammam.ae with smooth mobile conversion rates and high checkout reliability.',
    },
  },
  {
    id: 'pgvault',
    slug: 'pgvault',
    category: 'infra',
    categoryLabel: 'Database & Cloud Disaster Recovery',
    starsLabel: 'GitHub OSS',
    title: 'PGVault Core',
    shortTitle: 'PGVault Core',
    summary:
      'Automated PostgreSQL backup & disaster recovery daemon. Compresses, encrypts (AES-256 GCM), and schedules multi-cloud database backups (AWS S3, Google Drive, Local) with web UI management and instant point-in-time recovery.',
    tags: ['TypeScript', 'PostgreSQL', 'AWS S3', 'Google Drive', 'AES-256', 'Docker'],
    previewHeaderLeft: 'pgvault-daemon --status',
    previewHeaderTag: 'HEALTHY',
    previewLines: [
      { text: '$ pgvault backup --target=s3 --encrypt=AES-256', tone: 'bright' },
      { text: '[✓] Stream dump compressed (680MB) & encrypted in 1.4s', tone: 'acid' },
      { text: '[✓] Uploaded to s3://prod-pg-vault/backups/db-snap-2026.sql.gz.enc', tone: 'muted' },
    ],
    image: '/assets/pgvault.jpg',
    githubUrl: 'https://github.com/Haris-Khan-Durrani/PGVault-Core',
    githubLabel: 'GitHub Repo',
    blueprint: {
      category: 'Database & Cloud Operations',
      title: 'PGVault Core — Automated PostgreSQL Disaster Recovery',
      role: 'Tooling Architect, Node/TypeScript Core Engineer, Multi-Cloud Storage Designer.',
      problem:
        'Database backups frequently fail in production due to unmaintained shell scripts, lack of compression, and absence of verified encryption.',
      stack: [
        'TypeScript',
        'Node.js',
        'PostgreSQL',
        'pg_dump',
        'AWS S3',
        'Google Drive API',
        'AES-256 GCM',
        'Docker',
      ],
      flow: [
        'Target Database Handshake: Authenticates PostgreSQL connection and verifies privileges.',
        'Atomic Stream Compression: Streams pg_dump output through gzip without exhausting local disk memory.',
        'Cryptographic Envelope: Encrypts backup artifacts using AES-256 GCM with rotating keys.',
        'Multi-Cloud Dispatch: Uploads artifacts asynchronously to AWS S3 and secondary Google Drive storage.',
        'Health Telemetry & Retention: Prunes expired backups based on customizable retention rules.',
      ],
      decisions: [
        'Avoid monolithic in-memory buffering by streaming directly from database process to encrypted storage.',
        'Fail closed: emit instant webhook alerts if SHA-256 hash does not match cloud destination payload.',
        'Provide both standalone CLI daemon mode and containerized Docker execution with zero host dependencies.',
      ],
      outcome:
        'Reduced manual database administration overhead to zero while establishing a verifiable 5-minute recovery point objective (RPO).',
    },
  },
  {
    id: 'accounting',
    slug: 'accounting',
    category: 'saas',
    categoryLabel: 'Enterprise SaaS & Compliance',
    starsLabel: 'Production Ready',
    title: 'Accounting & UAE VAT 201 SaaS',
    shortTitle: 'UAE VAT 201 SaaS',
    summary:
      'Multi-tenant SaaS billing, accounting, and financial management application built for modern enterprises. Features 20+ modules, 11 PDF invoice templates, UAE FTA VAT 201 compliance, and whitelabel domains.',
    tags: ['PHP', 'MySQL', 'Multi-Tenant', 'UAE VAT 201', 'PDF Engines', 'REST API'],
    previewHeaderLeft: 'tax-engine // uae-fta-vat201',
    previewHeaderTag: 'COMPLIANT',
    previewLines: [
      { text: 'Standard Rated Supplies: AED 1,450,000.00 (VAT 5%: AED 72,500)', tone: 'bright' },
      { text: 'Net Tax Payable calculated: AED 48,220.00', tone: 'acid' },
      { text: 'Generated PDF Invoice Template #04 with QR tax stamp', tone: 'muted' },
    ],
    githubUrl: 'https://github.com/Haris-Khan-Durrani/Free-Accounting-Application',
    githubLabel: 'GitHub Repo',
    blueprint: {
      category: 'Enterprise SaaS & Finance',
      title: 'Multi-Tenant Accounting & UAE VAT 201 Platform',
      role: 'Solution Architect, Financial Logic Implementation, Multi-Tenant Database Engineer.',
      problem:
        'Commercial enterprises operating in the UAE require strict compliance with FTA VAT 201 tax filings, multi-currency invoicing, and tenant-isolated accounting ledgers without paying exorbitant enterprise licensing fees.',
      stack: ['PHP 8.2', 'MySQL', 'Multi-Tenancy Architecture', 'UAE FTA VAT 201', 'mPDF Engine', 'RESTful APIs'],
      flow: [
        'Tenant Subdomain & Domain Resolution: Dynamically isolates corporate tenant context.',
        'Double-Entry General Ledger: Enforces balanced debit/credit transactions with ACID compliance.',
        'Automated VAT 201 Box Calculations: Segregates 5% standard rated, zero-rated, and exempt supplies.',
        'Cryptographic Invoice Generation: Renders FTA-compliant tax invoices across 11 bespoke templates.',
        'Export & Reporting Engine: Generates real-time P&L, balance sheets, and audit reports.',
      ],
      decisions: [
        'Enforce strict tenant data boundaries at the ORM/query level to eliminate accidental cross-tenant data leaks.',
        'Implement immutable journal entry tables where corrections require reversing entries rather than destructive updates.',
        'Embed pre-calculated box tallies for UAE VAT 201 filing to prevent discrepancies during government audits.',
      ],
      outcome:
        'Shipped a full-featured accounting SaaS capable of supporting high-volume invoice generation and audit-ready VAT filings.',
    },
  },
  {
    id: 'whatsapp',
    slug: 'whatsapp',
    category: 'telephony',
    categoryLabel: 'Messaging & Bot API',
    starsLabel: 'Multi-Device',
    title: 'WhatsApp Automation & WATI Hub',
    shortTitle: 'WhatsApp & WATI Hub',
    summary:
      'Multi-device WhatsApp REST API server with whatsapp-web.js, WATI template dispatchers, and WhatsApp OTP authentication systems with session resilience, QR generation, and MySQL webhook synchronization.',
    tags: ['Node.js', 'whatsapp-web.js', 'WATI API', 'MySQL', 'OTP Auth', 'Webhooks'],
    previewHeaderLeft: 'wati-dispatcher // template-queue',
    previewHeaderTag: 'SENT 200 OK',
    previewLines: [
      { text: 'Payload: sendTemplateMessage(template="order_confirmation_v2")', tone: 'bright' },
      { text: 'Delivered via WhatsApp API to +971-55-XXX-XXXX', tone: 'acid' },
      { text: 'Webhook acknowledgment received · Status updated in MySQL', tone: 'muted' },
    ],
    githubUrl: 'https://github.com/Haris-Khan-Durrani/Wati-send-template',
    githubLabel: 'GitHub Repo',
    blueprint: {
      category: 'Messaging & Bot API',
      title: 'WhatsApp Automation & WATI Template Hub',
      role: 'Backend Architect, API Integration, Session Management Specialist.',
      problem:
        'Businesses needed reliable WhatsApp messaging for transactional OTP authentication and marketing templates without paying steep third-party per-session markup fees.',
      stack: ['Node.js', 'whatsapp-web.js', 'WATI REST API', 'PHP', 'MySQL', 'Webhooks'],
      flow: [
        'QR Code Auth & Session Persistence: Initializes Express server and saves WhatsApp web credentials.',
        'Template Payload Validation: Formats customer parameters and language codes according to Meta standards.',
        'WATI REST Dispatch: Sends verified template messages to customer phone numbers.',
        'Inbound Hook Handler: Ingests incoming responses and triggers automated CRM actions.',
        'Transactional OTP Engine: Generates time-sensitive tokens and verifies customer registration.',
      ],
      decisions: [
        'Structure the Node.js server with automatic reconnection handlers to gracefully recover if WhatsApp Web disconnects.',
        'Isolate sensitive customer phone numbers behind tokenized payloads before database logging.',
      ],
      outcome:
        'Established a rock-solid, multi-device WhatsApp messaging backbone with automated OTP and CRM synchronization.',
    },
  },
  {
    id: 'centralpanel',
    slug: 'centralpanel',
    category: 'crm',
    categoryLabel: 'Operational Dashboard',
    starsLabel: 'UAE Free Zones',
    title: 'Central Freezone Compliance Hub',
    shortTitle: 'Freezone Compliance Hub',
    summary:
      'Unified operations and checklist management panel connecting multiple UAE Free Zones and mainland licensing workflows into a single dashboard with session management, MySQL persistence, and real-time step trackers.',
    tags: ['Node.js', 'Express', 'MySQL', 'EJS/Tailwind', 'Session Auth'],
    previewHeaderLeft: 'compliance // dxb-freezone-sync',
    previewHeaderTag: 'VERIFIED',
    previewLines: [
      { text: 'Checklist status: Trade License + Establishment Card + Visa Quota', tone: 'bright' },
      { text: '100% Steps validated across 6 corporate authorities', tone: 'acid' },
      { text: 'Unified operational tracking for legal & corporate agents', tone: 'muted' },
    ],
    githubUrl: 'https://github.com/Haris-Khan-Durrani/centralpanel',
    githubLabel: 'GitHub Repo',
    blueprint: {
      category: 'Operational Dashboard',
      title: 'Central Freezone Compliance & Checklist Hub',
      role: 'Backend Architect, Operations Designer, MySQL Specialist.',
      problem:
        'Navigating corporate setup across multiple Dubai Free Zones involves fragmented requirements and manual checklists that lead to compliance delays.',
      stack: ['Node.js', 'Express', 'MySQL', 'Session Auth', 'Tailwind CSS'],
      flow: [
        'Unified Freezone Schema: Maps authority requirements into standardized operational stages.',
        'Live Step Tracker: Guides corporate agents through visa quotas, trade licenses, and banking steps.',
        'Automated Document Checklist: Verifies passport copies, board resolutions, and lease agreements.',
        'Status Synchronization: Updates clients in real time as free zone approvals progress.',
      ],
      decisions: [
        'Normalize differing free zone terminology into a unified workflow model.',
        'Store step histories in immutable audit logs to resolve compliance disputes.',
      ],
      outcome: 'Reduced company formation cycle times by 40% across participating corporate legal teams.',
    },
  },
  {
    id: 'stripeapp',
    slug: 'stripeapp',
    category: 'infra',
    categoryLabel: 'Billing & Security',
    starsLabel: 'Webhook Hardening',
    title: 'Stripe Multi-Tenant Billing Hub',
    shortTitle: 'Stripe Billing Hub',
    summary:
      'Hardened billing integration engine handling Stripe Checkout, webhook verification with HMAC signatures, customer portal redirection, automatic tier upgrading, and fail-closed security.',
    tags: ['Node.js', 'Express', 'Stripe API', 'MySQL', 'HMAC Webhooks'],
    previewHeaderLeft: 'stripe-webhook // hmac-signed',
    previewHeaderTag: 'VERIFIED',
    previewLines: [
      { text: 'Header: stripe-signature verified with endpoint secret', tone: 'bright' },
      { text: 'Event: customer.subscription.created → Tenant Tier: "Enterprise"', tone: 'acid' },
      { text: 'Idempotency check passed · DB record updated in 3ms', tone: 'muted' },
    ],
    githubUrl: 'https://github.com/Haris-Khan-Durrani/Stripe-Subscription-App',
    githubLabel: 'GitHub Repo',
    blueprint: {
      category: 'Billing & Security',
      title: 'Stripe Multi-Tenant Billing Hub & Webhook Shield',
      role: 'Security & Payment Engineer, Node.js Backend Developer.',
      problem:
        'Flawed webhook handling in SaaS billing applications allows malicious actors to spoof payment success events or trigger cross-tenant account upgrades.',
      stack: ['Node.js', 'Express', 'Stripe API', 'MySQL', 'HMAC Signatures'],
      flow: [
        'Session Provisioning: Creates Stripe Checkout sessions tied to immutable tenant IDs.',
        'Cryptographic Verification: Validates Stripe webhook HMAC signatures before parsing event bodies.',
        'Idempotency Guard: Verifies event IDs in MySQL to prevent double-crediting on network retries.',
        'Subscription State Machine: Manages active, past_due, canceled, and grace-period transitions.',
      ],
      decisions: [
        'Fail closed: Immediately reject any webhook that fails signature verification without executing DB updates.',
        'Never trust browser redirect parameters for subscription fulfillment; rely solely on server-to-server webhooks.',
      ],
      outcome: 'Hardened SaaS billing pipeline against spoofing and duplicate transaction exploits.',
    },
  },
];

export const SKILLS_ROW_1: string[] = [
  'Solution Architecture',
  'React & Next.js',
  'TypeScript',
  'Node.js & Express',
  'GoHighLevel API v2',
  'Zoho CRM & Automation',
  '3CX Cloud PBX',
  'WhatsApp Business API',
  'PostgreSQL & MySQL',
  'Docker & Containers',
  'Prisma ORM',
  'Socket.IO & WebSockets',
];

export const SKILLS_ROW_2: string[] = [
  'Laravel & PHP',
  'WordPress Custom Plugins',
  'Shopify & WooCommerce',
  'Three.js & GSAP',
  'n8n / Make / Zapier',
  'Stripe Payments & Webhooks',
  'Nginx & PM2',
  'Linux VPS Hardening',
  'OAuth 2.0 & JWT',
  'Multi-Tenant SaaS',
  'REST & WebRTC',
  'AES-256 Encryption',
];

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    index: '01 / UX',
    title: 'Product & UI Systems',
    description:
      'Responsive enterprise dashboards, interactive component libraries, WebGL 3D visualizations, state management, role-based interfaces, and fast design systems built with React, Next.js, Vue, Tailwind CSS, Three.js, and GSAP.',
    tag: 'FRONTEND',
    highlights: ['React 19', 'Next.js', 'Three.js', 'GSAP', 'Tailwind CSS'],
  },
  {
    index: '02 / APP',
    title: 'Distributed Backend & Logic',
    description:
      'RESTful microservices, WebSocket clusters, event buses, OAuth 2.0 authentication, rate limiting, and business domain workflows developed using Node.js, Express, TypeScript, Laravel, and Python.',
    tag: 'APIS & LOGIC',
    highlights: ['Node.js', 'TypeScript', 'Laravel', 'WebSockets', 'OAuth 2.0'],
  },
  {
    index: '03 / CRM',
    title: 'CRM, Telephony & Automation',
    description:
      'Zoho CRM and GoHighLevel API integrations, 3CX PBX telephony gateways, WhatsApp Business API hubs, n8n automations, and payment pipelines across PostgreSQL, MySQL, MSSQL, Prisma, and Redis.',
    tag: 'INTEGRATIONS',
    highlights: ['GoHighLevel v2', 'Zoho CRM', '3CX PBX', 'WhatsApp API', 'n8n'],
  },
  {
    index: '04 / OPS',
    title: 'Cloud, Infra & Security',
    description:
      'Dockerized container environments, Nginx reverse proxies with SSL termination, PM2 process management, automated database disaster recovery, Linux VPS hardening, and fail-closed security protocols (JWT/RBAC).',
    tag: 'DEVOPS & CLOUD',
    highlights: ['Docker', 'Nginx SSL', 'Linux VPS', 'AES-256', 'JWT / RBAC'],
  },
];

export const PROJECT_FILTERS: { id: ProjectCategory; label: string }[] = [
  { id: 'all', label: 'All Systems (12)' },
  { id: 'saas', label: 'SaaS & Platforms' },
  { id: 'telephony', label: 'Telephony & WhatsApp' },
  { id: 'crm', label: 'CRM & Automation' },
  { id: 'infra', label: 'Database & Ops' },
];

export const NAV_ITEMS = [
  { id: 'experience', label: 'Experience', mobileIndex: '01', mobileTitle: 'Experience & Leadership' },
  { id: 'dossiers', label: 'Blueprints', mobileIndex: '02', mobileTitle: 'Architectural Blueprints' },
  { id: 'work', label: 'Systems (12)', mobileIndex: '03', mobileTitle: '12 Production Systems' },
  { id: 'blog', label: 'Blog', mobileIndex: '04', mobileTitle: 'Architecture Blog (SEO/GEO)' },
  { id: 'codeplay', label: 'Code', mobileIndex: '05', mobileTitle: 'Code Playground' },
  { id: 'architecture', label: 'Stack', mobileIndex: '06', mobileTitle: 'Technology Stack', hideInTopbar: true },
  { id: 'terminal', label: 'Console >_', mobileIndex: '07', mobileTitle: 'Interactive Terminal' },
  { id: 'contact', label: 'Contact', mobileIndex: '08', mobileTitle: 'Get In Touch' },
];

export function getProjectBySlug(slug: string): ProjectItem | undefined {
  return PROJECTS.find((p) => p.slug === slug || p.id === slug);
}
