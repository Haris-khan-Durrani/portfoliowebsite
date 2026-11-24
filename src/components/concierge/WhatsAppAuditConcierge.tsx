'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUpRight,
  Calculator,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  X,
} from 'lucide-react';
import { SITE_CONFIG } from '@/data/portfolio';

interface ScopeOption {
  id: string;
  label: string;
  tag: string;
  recommendedStack: string;
  timeline: string;
  typicalImpact: string;
  solutionHref: string;
}

const SCOPE_OPTIONS: ScopeOption[] = [
  {
    id: 'portal',
    label: 'Multi-Company ERP & Group Portal',
    tag: 'Holding Groups · 2–15 Entities',
    recommendedStack: 'Next.js 15 + Node.js/Laravel + MySQL/PostgreSQL RBAC + OAuth 2.0',
    timeline: '4–6 Weeks (Phased Rollout)',
    typicalImpact: 'Cuts duplicate SaaS license waste by 65–80% across sister companies',
    solutionHref: '/solutions/custom-multi-tenant-saas-erp-development-dubai',
  },
  {
    id: 'crm',
    label: 'GoHighLevel / Zoho CRM + WhatsApp Hub',
    tag: 'Sales · Real Estate · Corporate Services',
    recommendedStack: 'GHL API v2 / Zoho Deluge + WATI / Baileys WhatsApp + Redis Webhooks',
    timeline: '2–3 Weeks',
    typicalImpact: '100% automated lead routing, WhatsApp SLA alerts & contract generation',
    solutionHref: '/solutions/gohighlevel-zoho-crm-automation-expert-dubai',
  },
  {
    id: '3cx',
    label: '3CX Cloud PBX & AI Auto-Dialer',
    tag: 'Call Centers · Brokerages · Inside Sales',
    recommendedStack: '3CX Call Control API + WebRTC Click-to-Call + Real-Time CRM Screen-Pop',
    timeline: '2–3 Weeks',
    typicalImpact: 'Drops lead response time under 18 seconds & boosts agent call volume 2.4x',
    solutionHref: '/solutions/3cx-cloud-pbx-ai-auto-dialer-integration-uae',
  },
  {
    id: 'cto',
    label: 'Fractional CTO / Head of IT Advisory',
    tag: 'Executive Leadership · Dubai & UAE',
    recommendedStack: 'Architecture Audit + Team Leadership + Cloud/DevOps & Security Governance',
    timeline: 'Immediate Onboarding (Retainer / Full-Time)',
    typicalImpact: 'Unifies engineering delivery, vendor costs, and disaster-recovery SLAs',
    solutionHref: '/solutions/fractional-cto-head-of-it-dubai-uae',
  },
];

const SCALE_OPTIONS = [
  { id: '1-3', label: '1–3 Companies (10–35 Staff)' },
  { id: '4-10', label: '4–10 Sister Companies (35–120 Staff)' },
  { id: '120+', label: 'Enterprise Scale (120+ Users)' },
];

export function WhatsAppAuditConcierge() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [selectedScopeId, setSelectedScopeId] = useState<string>('portal');
  const [selectedScale, setSelectedScale] = useState<string>(SCALE_OPTIONS[1].label);

  // Never show on admin or login pages
  if (pathname?.startsWith('/blog/admin') || pathname?.startsWith('/blog/login')) {
    return null;
  }

  const activeScope =
    SCOPE_OPTIONS.find((item) => item.id === selectedScopeId) || SCOPE_OPTIONS[0];

  const whatsappMessage = encodeURIComponent(
    `Hi Haris, I was reviewing ${SITE_CONFIG.domain}${pathname || ''} and would like to discuss:\n\n` +
      `• Project Focus: ${activeScope.label}\n` +
      `• Organization Scale: ${selectedScale}\n` +
      `• Recommended Stack: ${activeScope.recommendedStack}\n\n` +
      `Are you available for a quick 15-minute architecture review this week?`
  );

  const whatsappUrl = `https://wa.me/971551651588?text=${whatsappMessage}`;

  return (
    <div className="fixed bottom-4 left-4 z-[75] print:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="mb-3 w-[min(390px,calc(100vw-32px))] overflow-hidden rounded-[24px] border border-[var(--line-strong)] bg-[var(--surface-card-strong)] p-5 text-[var(--page-text)] shadow-[0_28px_80px_rgba(0,0,0,0.82)] backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-[var(--line)] pb-3.5">
              <div>
                <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Dubai Solution Architect Concierge</span>
                </div>
                <h3 className="mt-1 text-base font-extrabold tracking-tight text-[var(--page-text)]">
                  60-Second Architecture Scope & Audit
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close Architecture Concierge"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--line)] text-[var(--text-soft)] hover:border-[var(--acid)] hover:text-[var(--acid)] cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Step 1: Select System Focus */}
            <div className="mt-3.5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-dim)]">
                1. Select What You Need to Build or Optimize
              </p>
              <div className="mt-2 grid grid-cols-1 gap-1.5">
                {SCOPE_OPTIONS.map((opt) => {
                  const active = opt.id === selectedScopeId;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedScopeId(opt.id)}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left transition-all cursor-pointer ${
                        active
                          ? 'border-[var(--acid)] bg-[var(--acid)]/12 text-[var(--page-text)]'
                          : 'border-[var(--line)] bg-[var(--page-text)]/[0.02] text-[var(--text-soft)] hover:border-[var(--line-strong)]'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{opt.label}</div>
                        <div className="font-mono text-[10px] text-[var(--text-dim)]">
                          {opt.tag}
                        </div>
                      </div>
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 ${
                          active ? 'text-[var(--acid)]' : 'text-transparent'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Organization Scale */}
            <div className="mt-3.5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-dim)]">
                2. Organization Scale
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {SCALE_OPTIONS.map((scale) => {
                  const active = selectedScale === scale.label;
                  return (
                    <button
                      key={scale.id}
                      type="button"
                      onClick={() => setSelectedScale(scale.label)}
                      className={`rounded-lg border px-2.5 py-1 font-mono text-[10px] font-bold transition-all cursor-pointer ${
                        active
                          ? 'border-[var(--cyan)] bg-[var(--cyan)]/15 text-[var(--cyan)]'
                          : 'border-[var(--line)] text-[var(--text-soft)] hover:text-[var(--page-text)]'
                      }`}
                    >
                      {scale.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instant Architecture Recommendation Box */}
            <div className="mt-3.5 rounded-xl border border-[var(--acid)]/30 bg-[var(--acid)]/[0.05] p-3">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--acid)]">
                <span>Recommended Blueprint</span>
                <span>Est. {activeScope.timeline}</span>
              </div>
              <p className="mt-1 font-mono text-[11px] font-bold text-[var(--page-text)]">
                {activeScope.recommendedStack}
              </p>
              <p className="mt-1 text-[11px] text-[var(--text-soft)]">
                {activeScope.typicalImpact}
              </p>
            </div>

            {/* Primary WhatsApp Direct Conversion CTA */}
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#c8ff3d] to-[#a5ea10] px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.08em] text-[#060608] shadow-[0_8px_25px_rgba(200,255,61,0.3)] transition-all hover:-translate-y-0.5"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Send Scope on WhatsApp (+971 55 1651588)</span>
              </a>

              <div className="flex items-center justify-between gap-2 pt-1">
                <Link
                  href={activeScope.solutionHref}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1 font-mono text-[10.5px] font-bold text-[var(--cyan)] hover:underline"
                >
                  <span>View Full Solution Specs</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
                <Link
                  href="/tools"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1 font-mono text-[10.5px] font-bold text-[var(--acid)] hover:underline"
                >
                  <Calculator className="h-3 w-3" />
                  <span>Calculate AED Savings</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Pill */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="group flex items-center gap-2.5 rounded-full border border-[var(--acid)]/45 bg-[var(--header-bg)] px-4 py-2.5 text-left shadow-[0_16px_40px_rgba(0,0,0,0.65)] backdrop-blur-2xl transition-all hover:-translate-y-0.5 hover:border-[var(--acid)] cursor-pointer"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[var(--acid)]" />
          <span className="font-mono text-[11px] font-extrabold uppercase tracking-[0.08em] text-[var(--page-text)]">
            {open ? 'Hide Audit Concierge' : 'Free 15-Min Architecture Audit'}
          </span>
        </div>
      </button>
    </div>
  );
}
