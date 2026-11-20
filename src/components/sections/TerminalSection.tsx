'use client';

import { useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { PROJECTS, SITE_CONFIG } from '@/data/portfolio';
import { DecryptedText } from '@/components/reactbits/DecryptedText';

interface TerminalSectionProps {
  inputRef: RefObject<HTMLInputElement | null>;
  onOpenBlueprint: (projectId: string) => void;
}

interface TerminalEntry {
  id: number;
  command?: string;
  lines: { text: string; tone?: 'acid' | 'cyan' | 'bright' | 'muted' | 'error'; href?: string }[];
}

const QUICK_CHIPS = [
  { label: 'experience', cmd: 'experience' },
  { label: 'proposal-saas', cmd: 'proposal' },
  { label: 'ebms-portal', cmd: 'ebms' },
  { label: '3cx-telephony', cmd: '3cx' },
  { label: 'school-erp', cmd: 'school' },
  { label: 'tablehub', cmd: 'tablehub' },
  { label: 'pgvault', cmd: 'pgvault' },
  { label: 'status', cmd: 'status' },
  { label: 'skills', cmd: 'skills' },
  { label: 'contact', cmd: 'contact' },
  { label: 'clear', cmd: 'clear' },
];

const ALL_COMMANDS = [
  'help',
  'experience',
  'proposal',
  'ebms',
  '3cx',
  'school',
  'tablehub',
  'pgvault',
  'accounting',
  'whatsapp',
  'skills',
  'projects',
  'status',
  'contact',
  'clear',
];

const INITIAL_ENTRIES: TerminalEntry[] = [
  {
    id: 0,
    lines: [
      { text: 'Haris Khan Durrani — Architecture Engine v5.0.0', tone: 'acid' },
      {
        text: 'Type a command or click one of the quick chips below to inspect systems, repos, or CV details.',
        tone: 'muted',
      },
      {
        text: 'Try: experience, proposal, ebms, 3cx, school, tablehub, pgvault, projects, status, skills, contact, help',
        tone: 'muted',
      },
    ],
  },
];

export function TerminalSection({ inputRef, onOpenBlueprint }: TerminalSectionProps) {
  const [entries, setEntries] = useState<TerminalEntry[]>(INITIAL_ENTRIES);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [latencyLabel, setLatencyLabel] = useState('12MS');
  const outputRef = useRef<HTMLDivElement | null>(null);
  const idRef = useRef(1);

  const appendEntry = (command: string, lines: TerminalEntry['lines']) => {
    setEntries((prev) => [...prev, { id: idRef.current++, command, lines }]);
    window.requestAnimationFrame(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    });
  };

  const executeCommand = async (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    const cmd = trimmed.toLowerCase();
    if (!cmd) return;

    setHistory((prev) => [trimmed, ...prev.slice(0, 29)]);
    setHistoryIdx(-1);

    if (cmd === 'clear') {
      setEntries([]);
      return;
    }

    if (cmd.startsWith('open ')) {
      const target = cmd.replace('open ', '').trim();
      const found = PROJECTS.find(
        (p) => p.id === target || p.slug === target || p.title.toLowerCase().includes(target)
      );
      if (found) {
        onOpenBlueprint(found.id);
        appendEntry(trimmed, [
          { text: `Launching System Blueprint modal for "${found.title}"...`, tone: 'acid' },
        ]);
      } else {
        appendEntry(trimmed, [
          { text: `Project "${target}" not found. Run "projects" to list valid IDs.`, tone: 'error' },
        ]);
      }
      return;
    }

    if (cmd === 'status') {
      const t0 = performance.now();
      try {
        const res = await fetch('/api/telemetry');
        const data = await res.json();
        const elapsed = Math.max(1, Math.round(performance.now() - t0));
        setLatencyLabel(`${elapsed}MS`);
        appendEntry(trimmed, [
          { text: '[LIVE NODE.JS TELEMETRY · /api/telemetry]', tone: 'acid' },
          { text: `Node Runtime: ${data.runtime} | Region: ${data.region}`, tone: 'bright' },
          { text: `Dubai Server Time: ${data.dubaiTime}`, tone: 'cyan' },
          {
            text: `Active Enterprise Footprint: ${data.metrics.ebmsUsers} users across ${data.metrics.sisterCompanies} sister companies | ${data.metrics.productionSystems} production systems`,
            tone: 'muted',
          },
          { text: `API Roundtrip Latency: ${elapsed}ms · Status: ${data.status}`, tone: 'acid' },
        ]);
      } catch {
        appendEntry(trimmed, [
          { text: 'Telemetry node online (local mode) · Status: HEALTHY', tone: 'acid' },
        ]);
      }
      return;
    }

    const commandMap: Record<string, TerminalEntry['lines']> = {
      help: [
        { text: 'Available system commands:', tone: 'bright' },
        { text: '  experience    - Haris career timeline (EBMS Head of IT, Capital Sands, Tecxone)', tone: 'acid' },
        { text: '  proposal      - Deep-dive into Proposal & Contract Automation Platform (EBMS Group)', tone: 'acid' },
        { text: '  ebms          - Portal for EBMS & Sister Companies (GoHighLevel v2)', tone: 'acid' },
        { text: '  3cx           - Inspect 3CX AI auto caller, dialer & PBX pipeline', tone: 'acid' },
        { text: '  school        - Multi-tenant School ERP (sms.onesol.ae)', tone: 'acid' },
        { text: '  tablehub      - TableHub collaborative platform (tablehub.ai)', tone: 'acid' },
        { text: '  pgvault       - PGVault Core PostgreSQL disaster recovery daemon', tone: 'acid' },
        { text: '  accounting    - UAE FTA VAT 201 multi-tenant accounting platform', tone: 'acid' },
        { text: '  whatsapp      - WhatsApp Web API & WATI automation service', tone: 'acid' },
        { text: '  projects      - List all 12 production systems (use "open <id>" to inspect)', tone: 'acid' },
        { text: '  status        - Ping live Node.js /api/telemetry endpoint', tone: 'acid' },
        { text: '  skills        - Technical capabilities across stack', tone: 'acid' },
        { text: '  contact       - Direct communication channels in Dubai', tone: 'acid' },
        { text: '  clear         - Clear terminal output', tone: 'acid' },
      ],
      experience: [
        { text: '[CAREER TIMELINE & LEADERSHIP]', tone: 'acid' },
        { text: '1. EBMS Business Services (2020 — Present, Dubai UAE)', tone: 'bright' },
        { text: '   Role: Head of IT | Senior Full-Stack Developer | CRM & Automation Specialist', tone: 'cyan' },
        { text: '   • Head of IT leading engineering for systems serving 105 active users across 9 sister companies.', tone: 'muted' },
        { text: '   • Reduced duplicate tooling by 80% via shared API platform.', tone: 'muted' },
        { text: '   • Deep integrations: Zoho CRM, GoHighLevel, WhatsApp Business API, 3CX PBX.', tone: 'muted' },
        { text: '2. Capital Sands Financial Services (2019 — 2020, UAE) — Senior Web Developer', tone: 'bright' },
        { text: '3. Tecxone (2018 — 2019, UAE) — Senior Web Developer | Plugin Developer (Mymahd e-com)', tone: 'bright' },
        { text: '4. Netxsite (2017 — 2018, UAE) — Web Developer | Plugin Developer', tone: 'bright' },
      ],
      proposal: [
        { text: '[SYSTEM SPEC: Proposal & Contract Automation Platform]', tone: 'acid' },
        { text: 'Context: Enterprise sales automation adopted across EBMS and 9 sister companies.', tone: 'bright' },
        { text: 'Client Adaptation: 360 Audit & Business Setup Consultancy with custom workflows and dynamic templates.', tone: 'muted' },
        { text: 'Tech: Node.js, Express.js, MySQL, PHP, mPDF, GrapesJS, REST APIs.', tone: 'cyan' },
        { text: 'Impact: Replaced inconsistent manual sales proposals with deterministic, print-ready digital contracts (-85% turnaround).', tone: 'muted' },
        { text: 'Deployment: Enterprise private deployment.', tone: 'muted' },
      ],
      ebms: [
        { text: '[SYSTEM SPEC: Portal for EBMS & Sister Companies]', tone: 'acid' },
        { text: 'Tech: GoHighLevel OAuth 2.0, Node.js, Express, MySQL, Tailwind CSS, EJS.', tone: 'cyan' },
        { text: 'Function: White-label CRM portal deployed across multiple group companies, providing centralized multi-tenant access and real-time GoHighLevel data synchronization.', tone: 'bright' },
        { text: 'Impact: Cut duplicate SaaS tool licensing costs by 80%.', tone: 'muted' },
      ],
      '3cx': [
        { text: '[SYSTEM SPEC: 3CX AI Auto Caller, Dialer & Website Widget]', tone: 'acid' },
        { text: 'Tech: Node.js, Express.js, 3CX Call Control API, WebSockets, WebRTC, Docker.', tone: 'cyan' },
        { text: 'Architecture: AI-assisted auto-calling and dialer platform with CRM integration, real-time call queue management, and a zero-dependency website-to-agent calling widget.', tone: 'bright' },
        { text: 'Repo: https://github.com/Haris-Khan-Durrani/maqsam', tone: 'cyan', href: 'https://github.com/Haris-Khan-Durrani/maqsam' },
      ],
      school: [
        { text: '[SYSTEM SPEC: School Management ERP]', tone: 'acid' },
        { text: 'Live URL: https://sms.onesol.ae/', tone: 'cyan', href: 'https://sms.onesol.ae/' },
        { text: 'Tech: Next.js, Node.js, Prisma ORM, MySQL, REST APIs, JWT, RBAC, Docker, WhatsApp API.', tone: 'bright' },
        { text: 'Function: Multi-tenant school ERP covering admissions, fee management, examinations, payroll, reporting, family billing, data imports, and automated WhatsApp notifications.', tone: 'muted' },
      ],
      tablehub: [
        { text: '[SYSTEM SPEC: TableHub Database SaaS]', tone: 'acid' },
        { text: 'Live URL: https://tablehub.ai/', tone: 'cyan', href: 'https://tablehub.ai/' },
        { text: 'Tech: Next.js, React, TypeScript, Prisma, MySQL, Socket.IO, Stripe.', tone: 'bright' },
        { text: 'Function: Airtable-style multi-tenant SaaS with customizable databases, dashboards, workflow automation, real-time collaboration, role permissions, and Stripe subscription billing.', tone: 'muted' },
      ],
      pgvault: [
        { text: '[SYSTEM SPEC: PGVault Core]', tone: 'acid' },
        { text: 'Repo: https://github.com/Haris-Khan-Durrani/PGVault-Core', tone: 'cyan', href: 'https://github.com/Haris-Khan-Durrani/PGVault-Core' },
        { text: 'Tech: TypeScript · PostgreSQL · AWS S3 · Google Drive · AES-256 GCM · Docker.', tone: 'bright' },
        { text: 'Function: Automated, encrypted database backup daemon with point-in-time recovery and Web UI management.', tone: 'muted' },
      ],
      accounting: [
        { text: '[SYSTEM SPEC: Multi-Tenant Accounting & UAE VAT 201 SaaS]', tone: 'acid' },
        { text: 'Repo: https://github.com/Haris-Khan-Durrani/Free-Accounting-Application', tone: 'cyan', href: 'https://github.com/Haris-Khan-Durrani/Free-Accounting-Application' },
        { text: 'Features: 20+ modules, 11 PDF invoice templates, UAE FTA VAT 201 compliance, whitelabel domains.', tone: 'bright' },
      ],
      whatsapp: [
        { text: '[SYSTEM SPEC: WhatsApp Automation & WATI Template Hub]', tone: 'acid' },
        { text: 'Repo: https://github.com/Haris-Khan-Durrani/Wati-send-template', tone: 'cyan', href: 'https://github.com/Haris-Khan-Durrani/Wati-send-template' },
        { text: 'Tech: Node.js, whatsapp-web.js, WATI API, MySQL, OTP Auth, Webhooks.', tone: 'bright' },
      ],
      projects: [
        { text: '[12 PRODUCTION SYSTEMS — Run "open <id>" to inspect blueprint]', tone: 'acid' },
        ...PROJECTS.map((p, idx) => ({
          text: `${String(idx + 1).padStart(2, '0')}. [${p.id}] ${p.title} — ${p.categoryLabel}`,
          tone: 'bright' as const,
        })),
      ],
      skills: [
        { text: '[CORE TECHNICAL PROFICIENCIES]', tone: 'acid' },
        { text: '• Front End: React, Next.js, JavaScript, TypeScript, Tailwind CSS, Redux, Three.js, GSAP.', tone: 'bright' },
        { text: '• Back End: Node.js, Express.js, PHP, Laravel, Python, REST APIs, WebSockets.', tone: 'bright' },
        { text: '• CRM & Telephony: Zoho CRM, GoHighLevel (GHL API v2), 3CX PBX, WhatsApp Business API.', tone: 'cyan' },
        { text: '• Databases & Cloud: MySQL, PostgreSQL, Prisma ORM, Docker, Linux, Nginx, PM2, AWS S3.', tone: 'muted' },
      ],
      contact: [
        { text: '[HARIS KHAN DURRANI — DIRECT CHANNELS]', tone: 'acid' },
        { text: `Phone/WhatsApp: ${SITE_CONFIG.phone}`, tone: 'cyan', href: SITE_CONFIG.phoneHref },
        { text: `Email: ${SITE_CONFIG.email}`, tone: 'cyan', href: `mailto:${SITE_CONFIG.email}` },
        { text: `LinkedIn: linkedin.com${SITE_CONFIG.linkedinHandle}`, tone: 'cyan', href: SITE_CONFIG.linkedin },
        { text: `GitHub: github.com/Haris-Khan-Durrani`, tone: 'cyan', href: SITE_CONFIG.github },
        { text: `Website: ${SITE_CONFIG.domain} · Location: ${SITE_CONFIG.location}`, tone: 'muted' },
      ],
    };

    if (commandMap[cmd]) {
      appendEntry(trimmed, commandMap[cmd]);
    } else {
      appendEntry(trimmed, [
        { text: `Command not found: "${trimmed}". Type "help" for available commands.`, tone: 'error' },
      ]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = inputValue;
      setInputValue('');
      void executeCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = Math.min(historyIdx + 1, history.length - 1);
        setHistoryIdx(nextIdx);
        setInputValue(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputValue(history[nextIdx]);
      } else {
        setHistoryIdx(-1);
        setInputValue('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const q = inputValue.trim().toLowerCase();
      if (!q) return;
      const match = ALL_COMMANDS.find((c) => c.startsWith(q));
      if (match) setInputValue(match);
    }
  };

  return (
    <section
      id="terminal"
      aria-labelledby="terminal-title"
      className="relative border-b border-[var(--line)] bg-gradient-to-b from-[var(--page-bg)] via-[var(--surface)] to-[var(--page-bg)] px-[clamp(16px,4vw,72px)] py-20 sm:py-24"
    >
      <div className="mx-auto mb-6 flex max-w-[1180px] flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--acid)]">
            <DecryptedText text="07 / Interactive System Shell" />
          </div>
          <h2
            id="terminal-title"
            className="m-0 text-2xl font-black uppercase tracking-[-0.02em] text-[var(--page-text)] sm:text-4xl"
          >
            Live Architecture Console
          </h2>
        </div>
        <div className="font-mono text-xs text-[var(--text-faint)]">
          STATUS: <span className="text-[var(--acid)]">ONLINE</span> · LATENCY: {latencyLabel}
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[22px] border border-white/15 bg-[#090a0f] font-mono shadow-[0_32px_90px_rgba(0,0,0,0.65)]">
        {/* Window Chrome */}
        <div className="flex h-11 items-center justify-between border-b border-white/[0.08] bg-[#11131c] px-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="truncate px-2 text-[11px] tracking-[0.06em] text-white/50">
            haris@durrani-architect-box: ~ (bash / zsh)
          </div>
          <div className="hidden text-[10px] font-bold uppercase tracking-[0.14em] text-[#c8ff3d] sm:block">
            NODE v20.x
          </div>
        </div>

        {/* Scrollable Output */}
        <div
          ref={outputRef}
          aria-live="polite"
          className="max-h-[430px] min-h-[270px] space-y-3 overflow-y-auto p-5 text-[12px] leading-[1.7] text-slate-300 sm:p-6 sm:text-[12.5px]"
        >
          {entries.map((entry) => (
            <div key={entry.id} className="space-y-1">
              {entry.command && (
                <div>
                  <span className="mr-2 text-[#60a5fa]">hkd@dubai:~$</span>
                  <span className="font-bold text-[#c8ff3d]">{entry.command}</span>
                </div>
              )}
              {entry.lines.map((line, i) => {
                const toneClass =
                  line.tone === 'acid'
                    ? 'font-bold text-[#c8ff3d]'
                    : line.tone === 'cyan'
                      ? 'text-[#38bdf8]'
                      : line.tone === 'bright'
                        ? 'text-white/90'
                        : line.tone === 'error'
                          ? 'text-red-400'
                          : 'text-white/60';

                if (line.href) {
                  return (
                    <div key={i} className={toneClass}>
                      <a
                        href={line.href}
                        target={line.href.startsWith('http') ? '_blank' : undefined}
                        rel={line.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="underline decoration-[#38bdf8]/50 underline-offset-4 hover:text-[#c8ff3d]"
                      >
                        {line.text}
                      </a>
                    </div>
                  );
                }

                return (
                  <div key={i} className={`whitespace-pre-wrap break-words ${toneClass}`}>
                    {line.text}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Quick Run Chips */}
        <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.06] bg-[#0b0d14] px-5 py-3.5 sm:px-6">
          <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">
            Quick Run:
          </span>
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => void executeCommand(chip.cmd)}
              className="rounded-md border border-white/12 bg-white/[0.06] px-2.5 py-1 text-[11px] text-white/75 transition-colors hover:border-[#c8ff3d] hover:bg-[#c8ff3d] hover:text-[#060608] cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Interactive Prompt Input */}
        <div className="flex items-center border-t border-white/10 bg-[#090a0f] px-5 py-3.5 sm:px-6">
          <span className="mr-2.5 shrink-0 text-[12.5px] font-semibold text-[#60a5fa]">
            hkd@dubai:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type command (help, status, open proposal) and press Enter..."
            aria-label="Interactive terminal command input"
            autoComplete="off"
            spellCheck={false}
            className="w-full min-w-0 bg-transparent text-[12.5px] text-white placeholder:text-white/35 focus:outline-none"
          />
        </div>
      </div>
    </section>
  );
}
