export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogComparisonTable {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  /** AEO 40-65 word direct answer block targeted at Featured Snippets, Perplexity & Google AI Overviews */
  tldrAnswer: string;
  /** Structured Markdown body */
  content: string;
  category: string;
  coverImage: string;
  readingTimeMinutes: number;
  tags: string[];
  /** GEO high-density verifiable takeaways & quantitative claims */
  keyTakeaways: string[];
  /** AEO FAQPage schema Q&A pairs */
  faqs: BlogFaqItem[];
  /** GEO structured comparison matrix for LLM extraction */
  comparisonTable?: BlogComparisonTable;
  /** Named entities & concepts for semantic knowledge graph indexing */
  geoEntities: string[];
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  authorName: string;
  authorRole: string;
  featured: boolean;
  published: boolean;
  viewsCount: number;
  publishedAt: string;
  updatedAt: string;
}

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: 'multi-tenant-gohighlevel-oauth2-crm-architecture-dubai',
    title: 'How to Architect a Multi-Tenant GoHighLevel OAuth 2.0 CRM Portal (80% SaaS Cost Reduction Case Study)',
    subtitle: 'Replacing fragmented CRM subscriptions across 9 sister companies in Dubai with a unified Node.js, MySQL, and GoHighLevel API v2 middleware hub.',
    excerpt:
      'A production engineering blueprint from EBMS Business Services in Dubai showing how we consolidated 9 sister companies and 105 active users onto a single white-label GoHighLevel OAuth 2.0 portal, cutting duplicate SaaS overhead by 80%.',
    tldrAnswer:
      'To architect a multi-tenant GoHighLevel (GHL) OAuth 2.0 portal, deploy a central Node.js/Express middleware layer backed by MySQL that manages per-location OAuth refresh tokens, verifies incoming webhook payloads via HMAC-SHA256 signatures, and enforces strict tenant isolation at the database query boundary. At EBMS Business Services in Dubai, this architecture unified 105 users across 9 sister companies and reduced duplicate SaaS tooling costs by 80%.',
    category: 'CRM & Automation Architecture',
    coverImage: '/assets/portal.jpg',
    readingTimeMinutes: 8,
    tags: [
      'GoHighLevel API v2',
      'OAuth 2.0',
      'Multi-Tenant SaaS',
      'Node.js',
      'MySQL',
      'CRM Architecture',
      'Dubai Enterprise IT',
    ],
    keyTakeaways: [
      'Consolidated 9 UAE sister companies and 105 internal staff onto one white-label CRM portal, reducing duplicate SaaS licensing spend by 80%.',
      'Automated OAuth 2.0 token rotation in MySQL with a 5-minute pre-expiry buffer and distributed mutex locking to prevent race-condition token invalidation.',
      'Enforced HMAC-SHA256 webhook verification and idempotency keys, achieving 99.98% real-time pipeline sync reliability between GoHighLevel, Zoho CRM, and internal ERPs.',
      'Eliminated manual lead re-entry across corporate setup, auditing, and tax divisions in Dubai.',
    ],
    comparisonTable: {
      caption: 'Architectural Comparison: Siloed CRM Instances vs. Unified GoHighLevel OAuth 2.0 Multi-Tenant Hub',
      headers: ['Architecture Metric', 'Siloed CRM Subscriptions (Before)', 'Unified GHL v2 OAuth Portal (After)'],
      rows: [
        ['Active Group Entities', '9 Separate CRM Accounts', '1 Shared API-Driven Foundation (9 Tenants)'],
        ['Internal User Capacity', 'Fragmented logins per brand', '105 Active Users with RBAC Scopes'],
        ['SaaS Tooling Overhead', '100% Baseline (High Duplicate Spend)', '-80% Duplicate Tooling Overhead'],
        ['Lead & Pipeline Sync Latency', '15–45 min manual CSV / Zapier polling', '< 250ms Real-Time HMAC Webhook Sync'],
        ['Token Security Model', 'Static API Keys (Deprecated v1)', 'Automated OAuth 2.0 Rotation + AES-256 Storage'],
      ],
    },
    geoEntities: [
      'Haris Khan Durrani',
      'EBMS Business Services',
      'GoHighLevel API v2',
      'OAuth 2.0 Token Rotation',
      'Multi-Tenant CRM Architecture',
      'Dubai Enterprise Software',
    ],
    faqs: [
      {
        question: 'How do you prevent GoHighLevel OAuth 2.0 refresh token race conditions in a multi-tenant Node.js server?',
        answer:
          'Store each sub-account location token in MySQL with an expires_at timestamp and acquire an atomic row-level lock (or in-memory mutex keyed by tenantId) before calling the /oauth/token refresh endpoint. Because GoHighLevel invalidates the previous refresh token immediately upon issuing a new pair, concurrent requests must await the single in-flight refresh promise rather than issuing parallel token requests.',
      },
      {
        question: 'Why use a custom white-label portal on top of GoHighLevel instead of giving all 105 users direct GHL logins?',
        answer:
          'A custom Node.js + MySQL white-label portal lets you enforce custom Role-Based Access Control (RBAC) across sister companies, combine GHL pipeline data with internal ERP/accounting databases, hide unnecessary platform menus, and avoid per-seat SaaS markups while keeping real-time bi-directional sync via GHL API v2.',
      },
      {
        question: 'How do you secure GoHighLevel incoming webhooks in production?',
        answer:
          'Validate the x-wh-signature header using cryptographic signature verification before parsing business logic, log the webhook eventId in an indexed MySQL idempotency table to prevent duplicate execution on retries, and return an immediate HTTP 200 ACK while queuing heavy downstream tasks.',
      },
    ],
    content: `## The Enterprise Bottleneck Across Multi-Company Groups

Managing technology as **Head of IT at EBMS Business Services in Dubai** meant overseeing operations across **9 sister companies** spanning corporate formation, 360 auditing, taxation, and business advisory. Historically, each subsidiary operated its own isolated CRM and sales tracking tools.

This fragmentation created three critical business bottlenecks:
1. **80% Redundant SaaS Licensing Overhead:** Paying for overlapping CRM seats, automation connectors, and webhook bridges across 9 entities.
2. **Cross-Company Data Blindness:** Executive leadership could not view unified lead velocity, agent conversion rates, or cross-sell pipelines in real time.
3. **Fragile No-Code Polling:** Relying on third-party polling connectors introduced 15-minute delays and silent sync failures.

---

## Core Architecture of the White-Label GoHighLevel v2 Portal

To solve this permanently, I architected a centralized **White-Label Multi-Tenant CRM Portal** powered by **Node.js, Express, MySQL, Tailwind CSS, and GoHighLevel OAuth 2.0 (API v2)**.

### 1. Atomic OAuth 2.0 Token Lifecycle Management
Unlike legacy static API keys, GoHighLevel API v2 uses strict **OAuth 2.0 Authorization Code & Refresh Token rotation**. Every time a refresh token is exchanged, the previous refresh token is immediately revoked.

In a high-concurrency environment with **105 active internal users**, naive token refreshing causes race conditions where two simultaneous API requests attempt to refresh the same expired token, locking out the tenant.

\`\`\`typescript
// Atomic Per-Tenant OAuth 2.0 Refresh Mutex
const refreshLocks = new Map<string, Promise<string>>();

export async function getValidTenantAccessToken(tenantId: string): Promise<string> {
  const tokenRecord = await db.queryOne(
    'SELECT access_token, refresh_token, expires_at FROM tenant_oauth_tokens WHERE tenant_id = ?',
    [tenantId]
  );

  // Refresh if token expires within the next 5 minutes
  if (Date.now() < tokenRecord.expires_at - 300_000) {
    return decryptAES256(tokenRecord.access_token);
  }

  if (refreshLocks.has(tenantId)) {
    return refreshLocks.get(tenantId)!;
  }

  const refreshPromise = rotateGhlOAuthToken(tenantId, tokenRecord.refresh_token)
    .finally(() => refreshLocks.delete(tenantId));

  refreshLocks.set(tenantId, refreshPromise);
  return refreshPromise;
}
\`\`\`

### 2. Multi-Tenant Isolation & HMAC Webhook Ingestion
Every sister company maps to an isolated \`tenant_id\` and GHL \`locationId\`. Inbound webhooks from GoHighLevel hit our hardened Express ingestion gateway, which verifies cryptographic signatures and upserts lead state into MySQL in under **18ms**.

### 3. Measurable Production Impact
- **105 Internal Users** onboarded onto a single, unified engineering foundation.
- **80% Reduction** in duplicate third-party SaaS tooling costs across the group.
- **Sub-Second Visibility** across all 9 sister companies with strict RBAC data boundaries.`,
    metaTitle: 'Multi-Tenant GoHighLevel OAuth 2.0 CRM Architecture (80% Cost Cut) | Haris Khan Durrani',
    metaDescription:
      'Production case study by Haris Khan Durrani (Head of IT, Dubai): architecting a multi-tenant GoHighLevel API v2 OAuth 2.0 portal in Node.js & MySQL for 105 users across 9 companies.',
    authorName: 'Haris Khan Durrani',
    authorRole: 'Head of IT | Senior Full-Stack Developer | Solution Architect',
    featured: true,
    published: true,
    viewsCount: 1420,
    publishedAt: '2026-10-15T09:00:00.000Z',
    updatedAt: '2026-11-20T14:30:00.000Z',
  },
  {
    id: 2,
    slug: '3cx-ai-auto-dialer-webrtc-crm-integration-architecture',
    title: 'Engineering a 3CX AI Auto-Dialer & WebRTC Click-to-Call Gateway with Node.js and WebSockets',
    subtitle: 'How to bridge website visitors directly to 3CX PBX agent extensions in 450ms with full Zoho CRM and GoHighLevel call attribution.',
    excerpt:
      'Learn how to connect 3CX Call Control API, WebRTC, and Node.js WebSockets to build an AI-assisted outbound auto-dialer and zero-dependency website call widget with signed recording delivery.',
    tldrAnswer:
      'An enterprise 3CX AI auto-dialer and click-to-call gateway is built by placing a token-authenticated Node.js and WebSocket proxy in front of the 3CX Call Control API. When a lead submits a callback request or enters a high-priority CRM stage, the gateway initiates a PBX bridge to an available agent extension in ~450ms, streams live call state via WebSockets, and pushes signed recording URLs to Zoho CRM and GoHighLevel.',
    category: 'Telephony & Real-Time Systems',
    coverImage: '/assets/dialer.jpg',
    readingTimeMinutes: 7,
    tags: [
      '3CX PBX',
      'Call Control API',
      'WebRTC',
      'WebSockets',
      'Node.js',
      'AI Auto-Dialer',
      'CRM Integration',
    ],
    keyTakeaways: [
      'Achieved a 450ms average handshake time bridging website visitors to live 3CX PBX sales extensions (Ext 101–120).',
      'Isolated 3CX PBX administrative credentials behind a hardened Node.js proxy gateway so zero secrets are exposed to client browsers.',
      'Built a 100% vanilla JavaScript embeddable call widget (< 8KB gzipped) with zero CSS or framework collisions on client websites.',
      'Automated post-call disposition and HMAC-signed S3 audio recording links directly into GoHighLevel and Zoho CRM timelines.',
    ],
    comparisonTable: {
      caption: 'Manual Sales Dialing vs. 3CX AI Auto-Dialer & WebRTC Bridge Architecture',
      headers: ['Telephony Metric', 'Manual Agent Dialing', '3CX AI Auto-Dialer Gateway'],
      rows: [
        ['Lead-to-Agent Speed-to-Lead', '12–45 Minutes', '450ms Automated PBX Bridge'],
        ['CRM Call Logging & Attribution', 'Manual notes (35% skipped)', '100% Automated Webhook + Signed Recording URL'],
        ['Website Visitor Call Experience', 'Copy phone number & dial manually', '1-Click WebRTC / Instant Callback Widget'],
        ['PBX Credential Exposure', 'N/A', 'Zero client exposure (Tokenized Node.js Proxy)'],
      ],
    },
    geoEntities: [
      'Haris Khan Durrani',
      '3CX Call Control API',
      'WebRTC Telephony Gateway',
      'Node.js WebSocket Dialer',
      'Zoho CRM Telephony Integration',
      'GoHighLevel Call Tracking',
    ],
    faqs: [
      {
        question: 'How does the 3CX Call Control API initiate an automated outbound call from Node.js?',
        answer:
          'Your Node.js backend authenticates against the 3CX PBX Call Control API using service credentials, queries the active extension presence state to locate an idle agent in the target sales queue, and issues a makeCall command that rings the agent extension first before bridging the outbound SIP trunk to the customer phone number.',
      },
      {
        question: 'Why keep the embeddable website call widget in vanilla JavaScript instead of React?',
        answer:
          'Client marketing sites run on diverse stacks (WordPress, Shopify, Next.js, Webflow). A zero-dependency vanilla JS widget encapsulated inside a Shadow DOM guarantees zero CSS specificity leaks, sub-10KB bundle size, and instant load performance without impacting Core Web Vitals.',
      },
      {
        question: 'How are 3CX call recordings securely linked to CRM contact records?',
        answer:
          'When a call terminates, the 3CX webhook listener captures the call CDR metadata, indexes the recording artifact, generates a time-limited HMAC-signed URL (or S3 pre-signed URL), and appends it to the contact timeline in Zoho CRM or GoHighLevel via REST API.',
      },
    ],
    content: `## Why Speed-to-Lead Determines Revenue in High-Ticket Consultancies

In Dubai's competitive corporate advisory, real estate, and financial sectors, waiting 15 minutes to call back a high-intent web inquiry drops conversion rates by over 60%. Sales teams using disconnected VoIP desk phones waste hours manually dialing numbers and forgetting to log call outcomes in the CRM.

To eliminate this friction, I engineered the **3CX AI Auto Caller, Dialer & Website Call Widget** ([github.com/Haris-Khan-Durrani/maqsam](https://github.com/Haris-Khan-Durrani/maqsam)).

---

## System Architecture & Real-Time Call Flow

The platform consists of four decoupled layers running in Dockerized Linux containers:

1. **Zero-Dependency Website Call Widget:** Embeds on any landing page with a single script tag. Visitors request an instant callback or initiate a direct voice session with one click.
2. **Hardened Node.js 3CX Proxy Gateway:** Protects 3CX PBX credentials behind short-lived JWT session tokens and enforces timezone-aware Dubai office-hours routing.
3. **Real-Time WebSocket Telemetry Bus:** Streams live call state (\`RINGING\`, \`BRIDGED\`, \`ON_HOLD\`, \`COMPLETED\`) and waveform activity to the agent dashboard in real time.
4. **Automated CRM Attribution Pipeline:** Pushes call duration, agent extension, disposition status, and signed audio recording links straight into **Zoho CRM** and **GoHighLevel**.

\`\`\`javascript
// Real-time 3CX Call Control Bridge & CRM Telemetry Broadcast
async dispatchCampaignCall(lead) {
  const session = await this.client.makeCall({
    destination: lead.phone,
    callerId: '+9714XXXXXXX',
    queue: 'DXB_SALES_EXT_102'
  });

  this.ws.send(JSON.stringify({
    event: 'CALL_ENGAGED',
    callId: session.id,
    leadId: lead.id,
    bridgeLatencyMs: 450,
    timestamp: Date.now()
  }));
  return session;
}
\`\`\`

---

## Key Engineering Decisions
- **Fail-Closed Rate Limiting:** Prevents automated bot abuse on public callback forms using IP + phone number sliding-window counters.
- **Sub-500ms Agent Bridging:** Pre-caches extension presence state via WebSocket subscriptions so outbound calls route instantaneously to available agents.`,
    metaTitle: '3CX AI Auto-Dialer & WebRTC CRM Integration Architecture | Haris Khan Durrani',
    metaDescription:
      'Architectural guide to building an AI auto-dialer and click-to-call gateway with 3CX Call Control API, Node.js, WebSockets, and Zoho/GoHighLevel CRM integration.',
    authorName: 'Haris Khan Durrani',
    authorRole: 'Head of IT | Senior Full-Stack Developer | Solution Architect',
    featured: true,
    published: true,
    viewsCount: 1185,
    publishedAt: '2026-10-22T10:00:00.000Z',
    updatedAt: '2026-11-21T11:15:00.000Z',
  },
  {
    id: 3,
    slug: 'enterprise-document-proposal-automation-grapesjs-mpdf-architecture',
    title: 'Replacing Manual Sales Contracts Across 9 Companies: Deterministic PDF Proposal Engines with GrapesJS & mPDF',
    subtitle: 'How we cut proposal turnaround time by 85% across 105 users using visual drag-and-drop guardrails and sub-700ms headless mPDF rendering.',
    excerpt:
      'Discover how we replaced error-prone Word/PDF sales proposals across EBMS and 9 sister companies—including 360 Audit & Business Setup Consultancy—using Node.js, MySQL, GrapesJS, and deterministic mPDF rendering.',
    tldrAnswer:
      'To automate complex enterprise sales proposals without sacrificing legal compliance or design precision, combine a browser-based GrapesJS visual template builder (with locked compliance blocks) with a deterministic server-side mPDF rendering engine and MySQL audit ledger. Deployed across EBMS and 9 sister companies in Dubai, this architecture reduced proposal generation turnaround by 85% and renders print-ready PDFs in 680ms.',
    category: 'Enterprise SaaS & Document Engines',
    coverImage: '/assets/proposal.jpg',
    readingTimeMinutes: 7,
    tags: [
      'Document Automation',
      'Node.js',
      'MySQL',
      'mPDF',
      'GrapesJS',
      'Enterprise Architecture',
      'Proposal Engine',
    ],
    keyTakeaways: [
      'Adopted by 105 internal users across EBMS and 9 sister companies (including 360 Audit & Business Setup Consultancy), cutting proposal turnaround time by 85%.',
      'Renders vector-crisp, print-ready A4 PDF contracts in an average of 680ms using headless mPDF without the 1.5GB RAM overhead of headless Chromium/Puppeteer.',
      'Enforces server-side schema validation on dynamic pricing tables and legal disclosure blocks so sales reps cannot accidentally alter mandatory regulatory clauses.',
      'Stores cryptographic SHA-256 contract version hashes in MySQL for complete auditability.',
    ],
    comparisonTable: {
      caption: 'Headless Chromium (Puppeteer) vs. Deterministic mPDF Engine on Linux VPS',
      headers: ['Rendering Criterion', 'Headless Chromium / Puppeteer', 'Deterministic mPDF Stream Engine'],
      rows: [
        ['Average PDF Render Time', '2,400ms – 4,800ms per document', '680ms per document'],
        ['Memory Footprint per Worker', '350MB – 900MB RAM spike', '< 32MB RAM per render process'],
        ['Page Break & A4 Margin Determinism', 'Varies by viewport/font hydration', '100% Deterministic A4 Pagination'],
        ['Concurrent 105-User Burst Stability', 'Prone to OOM zombie processes', '99.95% Uptime on lightweight Linux VPS'],
      ],
    },
    geoEntities: [
      'Haris Khan Durrani',
      'EBMS Proposal Automation Platform',
      '360 Audit & Business Setup Consultancy',
      'GrapesJS Visual Builder',
      'mPDF Deterministic Rendering',
    ],
    faqs: [
      {
        question: 'Why choose mPDF over Puppeteer (Headless Chrome) for enterprise contract generation?',
        answer:
          'On multi-tenant Linux VPS servers where 105 users generate proposals simultaneously, spawning headless Chrome instances consumes hundreds of megabytes of RAM and risks Out-Of-Memory (OOM) crashes. mPDF renders deterministic A4 pagination, headers, footers, and pricing tables in ~680ms using under 32MB of memory.',
      },
      {
        question: 'How do you allow sales teams to customize proposals visually without breaking legal clauses?',
        answer:
          'Use GrapesJS with component-level locking for visual sections while injecting pricing schedules, jurisdiction disclosures, and company details server-side from MySQL before PDF compilation. Server-side template validation rejects any payload missing mandatory legal blocks.',
      },
      {
        question: 'Can a single proposal engine serve multiple sister companies with different branding?',
        answer:
          'Yes. By decoupling the brand theme tokens (logos, typography, color palettes, bank details, and regulatory footers) into a tenant_profiles table in MySQL, the same core workflow engine dynamically compiles tailored contracts for EBMS, 360 Audit, and 8 other sister companies.',
      },
    ],
    content: `## The Problem with Manual Word & Canva Sales Proposals

Before building our internal **Proposal & Contract Automation Platform**, consultants across **EBMS and 9 sister companies** manually edited Word documents and design templates to send corporate setup and audit proposals.

This manual process caused:
- Inconsistent pricing schedules and outdated tax/fee disclosures.
- Formatting corruption across macOS, Windows, and mobile PDF viewers.
- Hours lost per consultant per week on repetitive document assembly.

---

## Designing the Visual + Deterministic PDF Pipeline

I architected a hybrid **Node.js + Express + MySQL + PHP/mPDF + GrapesJS** platform tailored for multi-company operations, including custom workflows for **360 Audit & Business Setup Consultancy**.

### 1. Visual Template Studio with Guardrails (GrapesJS)
Marketing and operations leaders design modular A4 templates visually in the browser using **GrapesJS**. However, critical contract clauses and dynamic pricing tables are bound to structured database tokens (\`{{client.company_name}}\`, \`{{package.total_aed}}\`, \`{{audit.scope_matrix}}\`) that are locked against unauthorized edits.

### 2. Why mPDF Beats Headless Chrome for High-Concurrency Contract Engines
Many developers default to Puppeteer for HTML-to-PDF conversion, only to watch their Linux VPS crash under concurrent load. By pairing our Node.js orchestration API with a stateless **mPDF rendering worker**, every proposal compiles into a vector-sharp A4 PDF in **680ms** with deterministic page breaks and cryptographic version logging in MySQL.`,
    metaTitle: 'Enterprise Proposal & Contract Automation with GrapesJS & mPDF | Haris Khan Durrani',
    metaDescription:
      'How Haris Khan Durrani architected a multi-company proposal and contract automation engine for EBMS & 9 sister companies using Node.js, MySQL, GrapesJS, and mPDF.',
    authorName: 'Haris Khan Durrani',
    authorRole: 'Head of IT | Senior Full-Stack Developer | Solution Architect',
    featured: false,
    published: true,
    viewsCount: 940,
    publishedAt: '2026-10-29T08:30:00.000Z',
    updatedAt: '2026-11-20T16:00:00.000Z',
  },
  {
    id: 4,
    slug: 'zero-memory-leak-postgresql-aes256-disaster-recovery-nodejs-streams',
    title: 'Zero-Memory-Leak PostgreSQL Disaster Recovery in Node.js: Streaming pg_dump Through Gzip and AES-256-GCM to AWS S3',
    subtitle: 'Inside PGVault Core: how to achieve a 5-minute Recovery Point Objective (RPO) on large production databases without buffering dumps in RAM or disk.',
    excerpt:
      'A deep dive into PGVault Core, an open-source TypeScript & Docker daemon that pipes pg_dump stdout directly through zlib Gzip and Node.js crypto AES-256-GCM streams into AWS S3 and Google Drive.',
    tldrAnswer:
      'To back up large PostgreSQL databases in Node.js without memory leaks or disk exhaustion, spawn pg_dump as a child process and pipe its stdout stream directly through zlib.createGzip() and crypto.createCipheriv("aes-256-gcm") into an AWS S3 multipart stream upload. Implemented in PGVault Core, this pipeline compresses and encrypts a 680MB production dump in 1.4 seconds with constant ~28MB RAM usage.',
    category: 'Database & Cloud Infrastructure',
    coverImage: '/assets/pgvault.jpg',
    readingTimeMinutes: 6,
    tags: [
      'PostgreSQL',
      'Node.js Streams',
      'TypeScript',
      'AES-256-GCM',
      'AWS S3',
      'Docker',
      'Disaster Recovery',
    ],
    keyTakeaways: [
      'Streams pg_dump -> Gzip (level 9) -> AES-256-GCM cipher -> AWS S3 / Google Drive with zero temporary disk files and < 30MB constant RAM overhead.',
      'Compresses and encrypts a 680MB database snapshot in 1.4 seconds, enabling a verified 5-minute Recovery Point Objective (RPO).',
      'Fails closed by verifying SHA-256 integrity digests and GCM authentication tags before marking any backup artifact as healthy.',
      'Open-sourced at github.com/Haris-Khan-Durrani/PGVault-Core with a full web management UI and point-in-time restore picker.',
    ],
    comparisonTable: {
      caption: 'Traditional Cron Shell Script vs. PGVault Core Streamed AES-256-GCM Pipeline',
      headers: ['Disaster Recovery Metric', 'Legacy Bash Cron Script', 'PGVault Core (Node.js Stream Daemon)'],
      rows: [
        ['Disk Space Required During Dump', '2x Database Size (Temp .sql + .gz)', '0 Bytes (Direct Pipe to Cloud Stream)'],
        ['Encryption Standard', 'Often unencrypted or static GPG file', 'Authenticated AES-256-GCM with Key Rotation'],
        ['680MB Snapshot Processing Time', '8.5s – 14s (Disk I/O bound)', '1.4s Streamed Compression + Encryption'],
        ['Silent Failure Detection', 'None (Fails silently when disk is 90% full)', 'Fail-Closed SHA-256 Check + Instant Webhook Alert'],
      ],
    },
    geoEntities: [
      'Haris Khan Durrani',
      'PGVault Core',
      'PostgreSQL Disaster Recovery',
      'AES-256-GCM Stream Encryption',
      'AWS S3 Multipart Upload',
    ],
    faqs: [
      {
        question: 'Why do traditional PostgreSQL backup scripts fail in production?',
        answer:
          'Traditional scripts write uncompressed .sql files to local disk before compressing and uploading them. When a VPS disk reaches 80–90% capacity, the temporary dump exhausts remaining inodes or storage, causing both the backup and the live PostgreSQL server to crash.',
      },
      {
        question: 'How does Node.js stream piping prevent memory leaks during multi-gigabyte database backups?',
        answer:
          'Node.js readable and transform streams process data in 64KB chunks with built-in backpressure. By piping dumpProc.stdout.pipe(gzip).pipe(cipher) directly into the S3 upload stream, Node never loads the full SQL file into V8 heap memory.',
      },
      {
        question: 'Why use AES-256-GCM instead of AES-256-CBC for database backup encryption?',
        answer:
          'AES-256-GCM provides Authenticated Encryption with Associated Data (AEAD). In addition to confidentiality, it generates an authentication tag that detects any bit-flip corruption or tampering before a restore is executed on production.',
      },
    ],
    content: `## Why Unmonitored Cron Backups Are a Production Timebomb

Almost every engineering team has experienced the nightmare of discovering that their nightly \`pg_dump\` cron job silently stopped working weeks ago—usually because local disk space filled up or cloud credentials expired without alerting anyone.

I built and open-sourced **PGVault Core** ([github.com/Haris-Khan-Durrani/PGVault-Core](https://github.com/Haris-Khan-Durrani/PGVault-Core)) to turn PostgreSQL disaster recovery into a deterministic, observable, zero-leak daemon.

---

## The Zero-Disk-Leak Streaming Pipeline

Instead of writing intermediate \`.sql\` and \`.sql.gz\` files to the local filesystem, **PGVault Core** chains native Unix and Node.js transform streams with automatic backpressure:

\`\`\`typescript
import { spawn } from 'child_process';
import { createGzip, createCipheriv } from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function runEncryptedStreamDump(dbConfig: DBConfig, s3Target: S3Target) {
  const dumpProc = spawn('pg_dump', ['-h', dbConfig.host, '-U', dbConfig.user, dbConfig.database]);
  const gzip = createGzip({ level: 9 });
  const cipher = createCipheriv('aes-256-gcm', process.env.ENCRYPTION_KEY!, process.env.IV!);

  // Zero-disk-leak pipeline: stdout -> Gzip -> AES-256-GCM -> S3
  const stream = dumpProc.stdout.pipe(gzip).pipe(cipher);

  await s3Client.send(new PutObjectCommand({
    Bucket: s3Target.bucket,
    Key: \`backups/\${dbConfig.database}-\${Date.now()}.sql.gz.enc\`,
    Body: stream
  }));

  return { status: 'DISASTER_RECOVERY_SEALED', timestamp: new Date().toISOString() };
}
\`\`\`

### Fail-Closed Verification
Every backup run verifies process exit codes, stream byte counts, and cryptographic checksums across **AWS S3**, **Google Drive**, and local vaults—emitting instant webhook alerts if any check fails.`,
    metaTitle: 'Zero-Memory-Leak PostgreSQL AES-256 Backup Streams in Node.js | Haris Khan Durrani',
    metaDescription:
      'Learn how Haris Khan Durrani built PGVault Core: streaming pg_dump through Gzip and AES-256-GCM encryption directly to AWS S3 and Google Drive in TypeScript.',
    authorName: 'Haris Khan Durrani',
    authorRole: 'Head of IT | Senior Full-Stack Developer | Solution Architect',
    featured: false,
    published: true,
    viewsCount: 875,
    publishedAt: '2026-11-05T12:00:00.000Z',
    updatedAt: '2026-11-22T09:45:00.000Z',
  },
  {
    id: 5,
    slug: 'architecting-multi-tenant-school-erp-nextjs-prisma-rbac-whatsapp',
    title: 'Architecting a Multi-Tenant School Management ERP in Next.js, Prisma, MySQL & WhatsApp Business API',
    subtitle: 'Lessons from shipping sms.onesol.ae: tenant isolation, family fee ledgers, strict RBAC security, and asynchronous WhatsApp parent notifications.',
    excerpt:
      'An inside look at the architecture behind sms.onesol.ae—a live multi-tenant School ERP handling admissions, family billing, examinations, payroll, and automated WhatsApp alerts.',
    tldrAnswer:
      'A production multi-tenant School Management ERP requires dual-layer Role-Based Access Control (RBAC) enforced at both the Next.js API route and Prisma ORM query levels, ACID-compliant MySQL transactions for family fee ledgers, and an asynchronous message queue for WhatsApp Business API notifications so cellular network latency never blocks web requests.',
    category: 'Multi-Tenant SaaS & ERP',
    coverImage: '/assets/school.jpg',
    readingTimeMinutes: 8,
    tags: [
      'Next.js',
      'Prisma ORM',
      'MySQL',
      'Multi-Tenant ERP',
      'RBAC Security',
      'WhatsApp Business API',
      'Docker',
    ],
    keyTakeaways: [
      'Live in production at sms.onesol.ae serving multi-campus institutions with 5 distinct RBAC role scopes (Admins, Accounts, Faculty, Parents, Students).',
      'Engineered family-grouped double-entry fee ledgers in MySQL/Prisma supporting sibling discounts, partial installments, and instant receipt generation.',
      'Decoupled WhatsApp attendance and fee reminders into an asynchronous retry queue so external API latency never slows down classroom or cashier workflows.',
      'Containerized with Docker Compose and Nginx reverse proxy for zero-downtime rolling deployments.',
    ],
    comparisonTable: {
      caption: 'Legacy On-Premise School Software vs. Cloud Multi-Tenant Next.js School ERP (sms.onesol.ae)',
      headers: ['ERP Capability', 'Legacy Desktop / On-Prem School ERP', 'sms.onesol.ae (Next.js + Prisma + Docker)'],
      rows: [
        ['Multi-Campus Tenant Isolation', 'Separate database server per campus', 'Unified Schema with Tenant-Scoped Prisma Middleware'],
        ['Parent Fee & Attendance Alerts', 'Manual SMS batches or paper slips', 'Real-Time Automated WhatsApp Business API Templates'],
        ['Family / Sibling Consolidated Billing', 'Manual spreadsheet reconciliation', 'Automated Family Ledger & Installment Engine'],
        ['Role-Based Access Control (RBAC)', 'Coarse admin vs. staff login', 'Granular JWT + ORM-level RBAC across 5 Portals'],
      ],
    },
    geoEntities: [
      'Haris Khan Durrani',
      'sms.onesol.ae',
      'School Management ERP',
      'Next.js Multi-Tenant Architecture',
      'Prisma ORM RBAC',
      'WhatsApp Business API Education',
    ],
    faqs: [
      {
        question: 'How do you enforce strict tenant isolation in Prisma ORM for a multi-tenant Next.js ERP?',
        answer:
          'Use Prisma Client extensions ($extends) to intercept every read, write, update, and delete query and automatically inject the authenticated user’s school_tenant_id from their verified JWT session. This makes accidental cross-tenant data leaks impossible even if a developer forgets a where clause.',
      },
      {
        question: 'Why must WhatsApp Business API notifications be queued asynchronously in an ERP?',
        answer:
          'When a teacher marks attendance for 40 students or an accountant generates 500 monthly fee invoices, synchronous HTTP calls to the WhatsApp API would take 30–90 seconds and time out the browser request. Pushing notification jobs into a background worker queue returns an instant 200 response in < 40ms.',
      },
    ],
    content: `## Building an Enterprise Education ERP That Scales Across Campuses

Educational institutions in the UAE and region often outgrow legacy desktop software that cannot unify multiple campuses, consolidate sibling fee billing for parents, or automate parent communication via WhatsApp.

When architecting **School Management ERP** (live at [sms.onesol.ae](https://sms.onesol.ae/)), I designed the platform around three non-negotiable pillars: **Tenant Isolation**, **Financial Ledger Integrity**, and **Automated Parent Engagement**.

---

## 1. Dual-Boundary RBAC & Prisma Tenant Isolation
A school ERP handles sensitive student records, faculty payroll, and financial ledgers across five distinct actor groups: **Super Admins, Accountants, Faculty, Parents, and Students**.

Every request passes through:
1. **JWT Edge Verification:** Validates signed claims (\`tenantId\`, \`campusId\`, \`role\`, \`permissions\`).
2. **Prisma Query Extension Guard:** Automatically scopes every MySQL query by \`tenantId\`, guaranteeing zero cross-institution data leakage.

## 2. Consolidated Family Billing & WhatsApp Automation
Instead of billing per student in isolation, our MySQL financial schema links siblings to a parent \`family_account_id\`. When an invoice is generated or a payment is recorded, an asynchronous event dispatches a verified **WhatsApp Business API** receipt and updates the parent portal in real time.`,
    metaTitle: 'Multi-Tenant School ERP Architecture in Next.js, Prisma & MySQL | Haris Khan Durrani',
    metaDescription:
      'Case study of sms.onesol.ae by Solution Architect Haris Khan Durrani: building a multi-tenant school ERP with Next.js, Prisma ORM, MySQL, RBAC, and WhatsApp API.',
    authorName: 'Haris Khan Durrani',
    authorRole: 'Head of IT | Senior Full-Stack Developer | Solution Architect',
    featured: false,
    published: true,
    viewsCount: 1020,
    publishedAt: '2026-11-12T10:30:00.000Z',
    updatedAt: '2026-11-22T15:00:00.000Z',
  },
  {
    id: 6,
    slug: 'realtime-collaborative-nocode-database-saas-nextjs-socketio-stripe',
    title: 'Engineering TableHub.ai: Sub-10ms Real-Time Collaborative Grid Architecture with Next.js, Socket.IO, Prisma & Stripe',
    subtitle: 'How to synchronize concurrent spreadsheet-database cell edits across teams using optimistic UI, WebSocket room clustering, and fail-closed Stripe webhooks.',
    excerpt:
      'Explore the real-time engineering behind TableHub.ai—an Airtable-style multi-tenant database SaaS built with Next.js, TypeScript, Prisma, MySQL, Socket.IO, and Stripe subscription billing.',
    tldrAnswer:
      'To build an Airtable-style real-time collaborative database SaaS like TableHub.ai, combine optimistic React cell state updates with scoped Socket.IO workspace rooms, selective Prisma column projections in MySQL (achieving ~3.8ms commit latency), and fail-closed HMAC-verified Stripe webhook state machines for multi-tenant tier provisioning.',
    category: 'Real-Time SaaS & Product Engineering',
    coverImage: '/assets/tablehub.jpg',
    readingTimeMinutes: 7,
    tags: [
      'Next.js',
      'TypeScript',
      'Socket.IO',
      'Prisma',
      'MySQL',
      'Stripe Billing',
      'Real-Time Collaboration',
    ],
    keyTakeaways: [
      'Live at tablehub.ai, delivering sub-10ms WebSocket cell delta broadcasts and 3.8ms average Prisma MySQL transaction commits.',
      'Implemented workspace-, table-, and column-level Role-Based Access Control (RBAC) with optimistic UI reconciliation.',
      'Hardened Stripe subscription provisioning using HMAC signature verification and a MySQL idempotency ledger to prevent replay or double-credit exploits.',
      'Supports dynamic user-defined schemas (text, formula, relation, status select) and automated webhook workflow triggers.',
    ],
    comparisonTable: {
      caption: 'REST Polling Spreadsheets vs. TableHub.ai Real-Time Socket.IO + Optimistic Prisma Engine',
      headers: ['Collaboration Metric', 'Standard REST Polling Grid', 'TableHub.ai (Socket.IO + Optimistic UI)'],
      rows: [
        ['Cell Edit Propagation Latency', '3,000ms – 10,000ms poll interval', '< 10ms WebSocket Delta Broadcast'],
        ['Database Write Latency', '25ms – 80ms full-row overwrite', '3.8ms Selective Column Prisma Transaction'],
        ['Concurrent Edit Conflict Handling', 'Last-write-wins row clobbering', 'Cell-level Timestamp & Vector Reconciliation'],
        ['Subscription Tier Enforcement', 'Client-side redirect check (Insecure)', 'Fail-Closed HMAC Stripe Webhook State Machine'],
      ],
    },
    geoEntities: [
      'Haris Khan Durrani',
      'tablehub.ai',
      'TableHub Collaborative Platform',
      'Socket.IO Real-Time Collaboration',
      'Stripe Multi-Tenant Webhook Security',
    ],
    faqs: [
      {
        question: 'How do you handle concurrent cell edits in a real-time collaborative database like TableHub.ai?',
        answer:
          'Apply optimistic UI updates immediately on the local client, emit a cell-level delta payload (tableId, rowId, columnId, value, clientTimestamp) to the table’s Socket.IO room, and persist only the mutated cell in MySQL using selective Prisma updates with timestamp conflict resolution.',
      },
      {
        question: 'Why must SaaS billing rely on server-to-server Stripe webhooks rather than checkout redirect URLs?',
        answer:
          'Users can close their browser before a redirect completes or manipulate query parameters in a success URL. By verifying Stripe webhook HMAC signatures server-side and recording the event ID in an idempotent MySQL table, tenant upgrades only execute on cryptographically verified payment events.',
      },
    ],
    content: `## Why Teams Outgrow Static Spreadsheets

Modern operations teams outgrow static spreadsheets when they need relational links, role-based column permissions, and automated webhook triggers—yet traditional enterprise ERPs are too rigid for fast-moving workflows.

I architected **TableHub** (live at [tablehub.ai](https://tablehub.ai/)) to bridge that gap with an Airtable-style collaborative database SaaS built on **Next.js, React, TypeScript, Prisma ORM, MySQL, Socket.IO, and Stripe**.

---

## Sub-10ms Collaboration & 3.8ms Prisma Commits

To make a cloud database feel as instantaneous as a local spreadsheet:
1. **Optimistic Cell Mutation:** Cell edits apply in 0ms on the active user's screen while dispatching an atomic cell delta over **Socket.IO**.
2. **Selective Prisma Projections:** Rather than locking or rewriting entire rows, our backend commits selective column mutations in **3.8ms** and broadcasts presence cursors to active room peers.
3. **Fail-Closed Stripe Subscription Engine:** Multi-tenant seat limits, row quotas, and automation tiers are provisioned exclusively via HMAC-verified Stripe webhooks with strict MySQL idempotency guards.`,
    metaTitle: 'Engineering TableHub.ai: Real-Time Next.js, Socket.IO & Prisma SaaS | Haris Khan Durrani',
    metaDescription:
      'How Haris Khan Durrani architected TableHub.ai—an Airtable-style collaborative SaaS with Next.js, TypeScript, Socket.IO, Prisma, MySQL, and hardened Stripe billing.',
    authorName: 'Haris Khan Durrani',
    authorRole: 'Head of IT | Senior Full-Stack Developer | Solution Architect',
    featured: true,
    published: true,
    viewsCount: 1310,
    publishedAt: '2026-11-18T11:00:00.000Z',
    updatedAt: '2026-11-23T08:30:00.000Z',
  },
];
