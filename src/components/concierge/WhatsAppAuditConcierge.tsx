'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUpRight,
  Calculator,
  MessageSquare,
  X,
} from 'lucide-react';
import { SITE_CONFIG } from '@/data/portfolio';

interface ScopeOption {
  id: string;
  label: string;
  sub: string;
  stack: string;
  timeline: string;
  solutionHref: string;
}

const SCOPE_OPTIONS: ScopeOption[] = [
  {
    id: 'crm',
    label: 'CRM & WhatsApp',
    sub: 'GHL · Zoho · WATI',
    stack: 'GoHighLevel / Zoho + WhatsApp API + Webhooks',
    timeline: '1–2 Weeks',
    solutionHref: '/solutions/gohighlevel-zoho-crm-automation-expert-dubai',
  },
  {
    id: 'saas',
    label: 'Custom Web / ERP',
    sub: 'Next.js · Node · Portal',
    stack: 'Next.js + Node.js / Laravel + MySQL / Postgres',
    timeline: '3–5 Weeks',
    solutionHref: '/solutions/custom-multi-tenant-saas-erp-development-dubai',
  },
  {
    id: '3cx',
    label: '3CX & Auto-Dialer',
    sub: 'PBX · WebRTC · Call Sync',
    stack: '3CX Call Control API + WebRTC + CRM Screen-Pop',
    timeline: '1–2 Weeks',
    solutionHref: '/solutions/3cx-cloud-pbx-ai-auto-dialer-integration-uae',
  },
  {
    id: 'cto',
    label: 'IT & CTO Advisory',
    sub: 'Architecture · Cloud',
    stack: 'System Audit, Team Leadership & DevOps Setup',
    timeline: 'Flexible / Retainer',
    solutionHref: '/solutions/fractional-cto-head-of-it-dubai-uae',
  },
];

const TEAM_SIZES = ['1–15 Staff', '15–50 Staff', '50+ Staff'];

export function WhatsAppAuditConcierge() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>('crm');
  const [teamSize, setTeamSize] = useState<string>(TEAM_SIZES[0]);

  if (pathname?.startsWith('/blog/admin') || pathname?.startsWith('/blog/login')) {
    return null;
  }

  const active = SCOPE_OPTIONS.find((item) => item.id === selectedId) || SCOPE_OPTIONS[0];

  const whatsappMessage = encodeURIComponent(
    `Hi Haris, I visited ${SITE_CONFIG.domain}${pathname || ''} and would like to discuss:\n` +
      `• Service: ${active.label} (${active.sub})\n` +
      `• Team Size: ${teamSize}\n` +
      `• Stack: ${active.stack}`
  );

  const whatsappUrl = `https://wa.me/971551651588?text=${whatsappMessage}`;

  return (
    <div className="fixed bottom-3.5 left-3.5 z-[68] print:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="mb-2 w-[min(286px,calc(100vw-28px))] max-h-[calc(100svh-120px)] overflow-y-auto rounded-2xl border border-[var(--line-strong)] bg-[var(--surface-card-strong)] p-3.5 text-[var(--page-text)] shadow-[0_20px_50px_rgba(0,0,0,0.78)] backdrop-blur-2xl"
          >
            {/* Compact Header */}
            <div className="flex items-center justify-between gap-2 border-b border-[var(--line)] pb-2">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--page-text)]">
                  Quick Project Scope
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close quick scope"
                className="grid h-6 w-6 place-items-center rounded-full border border-[var(--line)] text-[var(--text-soft)] hover:border-[var(--acid)] hover:text-[var(--acid)] cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            {/* 2x2 Compact Service Selector */}
            <div className="mt-2.5 grid grid-cols-2 gap-1.5">
              {SCOPE_OPTIONS.map((opt) => {
                const isSelected = opt.id === selectedId;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedId(opt.id)}
                    className={`rounded-xl border px-2.5 py-1.5 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[var(--acid)] bg-[var(--acid)]/12 text-[var(--page-text)]'
                        : 'border-[var(--line)] bg-[var(--page-text)]/[0.02] text-[var(--text-soft)] hover:border-[var(--line-strong)]'
                    }`}
                  >
                    <div className="truncate text-[11px] font-bold">{opt.label}</div>
                    <div className="truncate font-mono text-[9px] text-[var(--text-dim)]">
                      {opt.sub}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Compact Team Size Pills */}
            <div className="mt-2 flex items-center gap-1">
              {TEAM_SIZES.map((size) => {
                const isSelected = teamSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setTeamSize(size)}
                    className={`flex-1 rounded-lg border py-1 text-center font-mono text-[9.5px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[var(--cyan)] bg-[var(--cyan)]/15 text-[var(--cyan)]'
                        : 'border-[var(--line)] text-[var(--text-soft)] hover:text-[var(--page-text)]'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {/* Minimal Scope Summary */}
            <div className="mt-2.5 rounded-xl border border-[var(--line)] bg-[var(--page-text)]/[0.03] px-2.5 py-2">
              <div className="flex items-center justify-between font-mono text-[9px] uppercase text-[var(--acid)]">
                <span>Suggested Stack</span>
                <span>Est. {active.timeline}</span>
              </div>
              <p className="mt-0.5 text-[10.5px] font-semibold leading-snug text-[var(--page-text)]">
                {active.stack}
              </p>
            </div>

            {/* Compact WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 flex items-center justify-center gap-1.5 rounded-full bg-[var(--acid)] px-3 py-2 text-[10.5px] font-extrabold uppercase tracking-[0.06em] text-[#060608] transition-transform hover:-translate-y-0.5"
            >
              <MessageSquare className="h-3 w-3" />
              <span>Chat on WhatsApp</span>
            </a>

            <div className="mt-2 flex items-center justify-between px-0.5">
              <Link
                href={active.solutionHref}
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-0.5 font-mono text-[9.5px] font-bold text-[var(--cyan)] hover:underline"
              >
                <span>Details</span>
                <ArrowUpRight className="h-2.5 w-2.5" />
              </Link>
              <Link
                href="/tools"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1 font-mono text-[9.5px] font-bold text-[var(--text-soft)] hover:text-[var(--acid)]"
              >
                <Calculator className="h-2.5 w-2.5" />
                <span>ROI Calculators</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Small Compact Trigger Pill */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-[var(--header-border)] bg-[var(--header-bg)] px-3 py-1.5 shadow-[0_10px_28px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-all hover:border-[var(--acid)] cursor-pointer"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <MessageSquare className="h-3 w-3 text-[var(--acid)]" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-[var(--page-text)]">
          {open ? 'Close' : 'Quick Scope'}
        </span>
      </button>
    </div>
  );
}
