'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Calculator,
  Check,
  Copy,
  DollarSign,
  PhoneCall,
  Receipt,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { SITE_CONFIG } from '@/data/portfolio';
import { UAE_SOLUTIONS } from '@/data/solutions';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';

export function InteractiveToolsHub() {
  // 1. Multi-Company SaaS & CRM Consolidation ROI Calculator State
  const [companyCount, setCompanyCount] = useState(5);
  const [staffUsers, setStaffUsers] = useState(65);
  const [monthlySpendPerCompanyAed, setMonthlySpendPerCompanyAed] = useState(3200);

  const saasRoi = useMemo(() => {
    const currentMonthlyAed = companyCount * monthlySpendPerCompanyAed;
    const currentAnnualAed = currentMonthlyAed * 12;
    // Unified multi-tenant GHL + Node.js portal cuts duplicate tooling by ~78-80%
    const unifiedMonthlyAed = Math.round(currentMonthlyAed * 0.22);
    const annualSavingsAed = currentAnnualAed - unifiedMonthlyAed * 12;
    const annualSavingsUsd = Math.round(annualSavingsAed / 3.6725);
    const hoursSavedPerMonth = staffUsers * 11;
    return {
      currentMonthlyAed,
      currentAnnualAed,
      unifiedMonthlyAed,
      annualSavingsAed,
      annualSavingsUsd,
      hoursSavedPerMonth,
    };
  }, [companyCount, staffUsers, monthlySpendPerCompanyAed]);

  // 2. 3CX Speed-to-Lead & AI Auto-Dialer Revenue Recovery Calculator State
  const [monthlyLeads, setMonthlyLeads] = useState(450);
  const [avgDealValueAed, setAvgDealValueAed] = useState(12000);
  const [currentCloseRate, setCurrentCloseRate] = useState(4);

  const dialerRoi = useMemo(() => {
    const currentMonthlyRevAed = Math.round(
      monthlyLeads * (currentCloseRate / 100) * avgDealValueAed
    );
    // 450ms WebRTC & 3CX auto-dialer speed-to-lead typically boosts contact-to-close by +45% relative
    const boostedCloseRate = Number((currentCloseRate * 1.45).toFixed(1));
    const projectedMonthlyRevAed = Math.round(
      monthlyLeads * (boostedCloseRate / 100) * avgDealValueAed
    );
    const extraMonthlyRevAed = projectedMonthlyRevAed - currentMonthlyRevAed;
    const extraAnnualRevAed = extraMonthlyRevAed * 12;
    return {
      currentMonthlyRevAed,
      boostedCloseRate,
      projectedMonthlyRevAed,
      extraMonthlyRevAed,
      extraAnnualRevAed,
    };
  }, [monthlyLeads, avgDealValueAed, currentCloseRate]);

  // 3. UAE FTA VAT 201 Tax & Invoice Calculator State
  const [standardSuppliesAed, setStandardSuppliesAed] = useState(850000);
  const [zeroRatedSuppliesAed, setZeroRatedSuppliesAed] = useState(120000);
  const [recoverableExpensesAed, setRecoverableExpensesAed] = useState(310000);

  const vatSummary = useMemo(() => {
    const outputVatAed = Math.round(standardSuppliesAed * 0.05 * 100) / 100;
    const inputVatAed = Math.round(recoverableExpensesAed * 0.05 * 100) / 100;
    const netVatPayableAed = Math.round((outputVatAed - inputVatAed) * 100) / 100;
    const totalGrossSalesAed = standardSuppliesAed + zeroRatedSuppliesAed + outputVatAed;
    return {
      outputVatAed,
      inputVatAed,
      netVatPayableAed,
      totalGrossSalesAed,
    };
  }, [standardSuppliesAed, zeroRatedSuppliesAed, recoverableExpensesAed]);

  // 4. Live Webhook HMAC-SHA256 Signature Generator (Browser Web Crypto API)
  const [webhookSecret, setWebhookSecret] = useState('ebms_tenant_secret_2026');
  const [webhookPayload, setWebhookPayload] = useState(
    '{"tenantId":"ebms-dubai","event":"contact.synced","leadId":"LD-9941"}'
  );
  const [hmacSignature, setHmacSignature] = useState<string>('');
  const [copiedHmac, setCopiedHmac] = useState(false);

  const computeHmac = async (secret: string, payload: string) => {
    try {
      const enc = new TextEncoder();
      const key = await window.crypto.subtle.importKey(
        'raw',
        enc.encode(secret || 'secret'),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const sig = await window.crypto.subtle.sign('HMAC', key, enc.encode(payload));
      const hex = Array.from(new Uint8Array(sig))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      setHmacSignature(hex);
    } catch {
      setHmacSignature('sha256-computation-ready');
    }
  };

  useMemo(() => {
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
      void computeHmac(webhookSecret, webhookPayload);
    }
  }, [webhookSecret, webhookPayload]);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)]">
      <div className="arch-grid-bg" aria-hidden="true" />

      {/* Top Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[var(--page-text)] hover:text-[var(--acid)]"
            >
              <ArrowLeft className="h-4 w-4 text-[var(--acid)]" />
              <span>Portfolio Home</span>
            </Link>
            <span className="text-[var(--line)]">/</span>
            <span className="font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--acid)]">
              Free UAE Enterprise Calculators &amp; Developer Tools
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/blog"
              className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-1.5 font-mono text-[10.5px] font-bold uppercase text-[var(--text-soft)] hover:border-[var(--acid)] hover:text-[var(--page-text)]"
            >
              Architecture Blog
            </Link>
            <Link
              href="/#contact"
              className="rounded-full bg-[var(--acid)] px-4 py-1.5 font-mono text-[10.5px] font-black uppercase text-[#060608]"
            >
              Book Architecture Audit ↗
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1320px] px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-12 border-b border-[var(--line)] pb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--acid)]/30 bg-[var(--acid)]/10 px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--acid)]">
            <Calculator className="h-3.5 w-3.5" />
            <span>Interactive Engineering &amp; UAE Business Calculators</span>
          </div>
          <h1 className="m-0 text-[clamp(34px,5.2vw,72px)] font-extrabold leading-[0.98] tracking-[-0.045em]">
            UAE Enterprise ROI, VAT 201 &amp;{' '}
            <span className="hero-gradient-text font-serif font-normal italic">
              Architecture Tools.
            </span>
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text-soft)]">
            Free interactive calculators and developer utilities built by{' '}
            <strong className="text-[var(--page-text)]">{SITE_CONFIG.name}</strong> to help UAE
            business owners, CTOs, and engineering teams quantify SaaS consolidation savings, 3CX
            auto-dialer revenue recovery, UAE FTA VAT 201 filings, and webhook cryptography.
          </p>
        </div>

        {/* 2x2 Grid of Interactive Calculators */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* TOOL 1: Multi-Company SaaS & CRM Consolidation ROI Calculator */}
          <SpotlightCard className="p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--acid)]">
                <DollarSign className="h-4 w-4" />
                <span>01 / Multi-Company SaaS &amp; CRM Savings Calculator</span>
              </span>
              <span className="rounded-full bg-[var(--acid)]/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[var(--acid)]">
                EBMS 80% Benchmark
              </span>
            </div>

            <h2 className="m-0 mb-2 text-2xl font-extrabold">
              How Much Can Your Group Save by Consolidating CRM &amp; SaaS?
            </h2>
            <p className="m-0 mb-6 text-xs leading-relaxed text-[var(--text-soft)]">
              Based on our real Dubai deployment unifying 9 sister companies and 105 users onto one
              white-label GoHighLevel OAuth 2.0 + Node.js foundation.
            </p>

            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-xs font-bold">
                  <span>Sister Companies / Branches</span>
                  <span className="font-mono text-[var(--acid)]">{companyCount} Companies</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={companyCount}
                  onChange={(e) => setCompanyCount(Number(e.target.value))}
                  className="w-full accent-[#c8ff3d]"
                />
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs font-bold">
                  <span>Total Internal Staff Users</span>
                  <span className="font-mono text-[var(--acid)]">{staffUsers} Users</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={400}
                  step={5}
                  value={staffUsers}
                  onChange={(e) => setStaffUsers(Number(e.target.value))}
                  className="w-full accent-[#c8ff3d]"
                />
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs font-bold">
                  <span>Avg. Monthly SaaS / CRM Spend per Company (AED)</span>
                  <span className="font-mono text-[var(--acid)]">
                    AED {monthlySpendPerCompanyAed.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={15000}
                  step={250}
                  value={monthlySpendPerCompanyAed}
                  onChange={(e) => setMonthlySpendPerCompanyAed(Number(e.target.value))}
                  className="w-full accent-[#c8ff3d]"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-[var(--acid)]/35 bg-[var(--acid)]/[0.06] p-4">
              <div>
                <div className="font-mono text-[10px] uppercase text-[var(--text-soft)]">
                  Estimated Annual Savings
                </div>
                <div className="mt-1 text-2xl font-black text-[var(--acid)]">
                  AED {saasRoi.annualSavingsAed.toLocaleString()}
                </div>
                <div className="font-mono text-[10px] text-[var(--text-faint)]">
                  (~${saasRoi.annualSavingsUsd.toLocaleString()} USD / yr)
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase text-[var(--text-soft)]">
                  Admin Hours Saved / Mo
                </div>
                <div className="mt-1 text-2xl font-black text-[var(--cyan)]">
                  {saasRoi.hoursSavedPerMonth.toLocaleString()} hrs
                </div>
                <div className="font-mono text-[10px] text-[var(--text-faint)]">
                  Zero manual cross-entry
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Link
                href="/solutions/gohighlevel-zoho-crm-automation-expert-dubai"
                className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[var(--acid)] hover:underline"
              >
                <span>See Our Multi-Tenant CRM Architecture</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </SpotlightCard>

          {/* TOOL 2: 3CX Speed-to-Lead & AI Auto-Dialer Revenue Calculator */}
          <SpotlightCard className="p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--cyan)]">
                <PhoneCall className="h-4 w-4" />
                <span>02 / 3CX AI Auto-Dialer Revenue Estimator</span>
              </span>
              <span className="rounded-full bg-[var(--cyan)]/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[var(--cyan)]">
                450ms Bridge
              </span>
            </div>

            <h2 className="m-0 mb-2 text-2xl font-extrabold">
              Speed-to-Lead Revenue Recovery Calculator
            </h2>
            <p className="m-0 mb-6 text-xs leading-relaxed text-[var(--text-soft)]">
              Bridging website leads to 3CX PBX sales extensions in 450ms (vs. 30-min manual dialing)
              typically lifts lead-to-deal conversion by 35–45%.
            </p>

            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-xs font-bold">
                  <span>Monthly Inbound Leads</span>
                  <span className="font-mono text-[var(--cyan)]">{monthlyLeads} Leads/mo</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={3000}
                  step={50}
                  value={monthlyLeads}
                  onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                  className="w-full accent-[#38bdf8]"
                />
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs font-bold">
                  <span>Average Deal / Client Value (AED)</span>
                  <span className="font-mono text-[var(--cyan)]">
                    AED {avgDealValueAed.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={1500}
                  max={100000}
                  step={1500}
                  value={avgDealValueAed}
                  onChange={(e) => setAvgDealValueAed(Number(e.target.value))}
                  className="w-full accent-[#38bdf8]"
                />
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs font-bold">
                  <span>Current Lead Close Rate (%)</span>
                  <span className="font-mono text-[var(--cyan)]">{currentCloseRate}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={0.5}
                  value={currentCloseRate}
                  onChange={(e) => setCurrentCloseRate(Number(e.target.value))}
                  className="w-full accent-[#38bdf8]"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-[var(--cyan)]/35 bg-[var(--cyan)]/[0.06] p-4">
              <div>
                <div className="font-mono text-[10px] uppercase text-[var(--text-soft)]">
                  Recovered Monthly Revenue
                </div>
                <div className="mt-1 text-2xl font-black text-[var(--cyan)]">
                  +AED {dialerRoi.extraMonthlyRevAed.toLocaleString()}
                </div>
                <div className="font-mono text-[10px] text-[var(--text-faint)]">
                  Close rate: {currentCloseRate}% → {dialerRoi.boostedCloseRate}%
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase text-[var(--text-soft)]">
                  Annual Revenue Lift
                </div>
                <div className="mt-1 text-2xl font-black text-[var(--acid)]">
                  +AED {dialerRoi.extraAnnualRevAed.toLocaleString()}
                </div>
                <div className="font-mono text-[10px] text-[var(--text-faint)]">
                  100% CRM call attribution
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Link
                href="/solutions/3cx-cloud-pbx-ai-auto-dialer-integration-uae"
                className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[var(--cyan)] hover:underline"
              >
                <span>Explore 3CX Auto-Dialer Integration</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </SpotlightCard>

          {/* TOOL 3: UAE FTA VAT 201 Instant Tax & Invoice Calculator */}
          <SpotlightCard className="p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--acid)]">
                <Receipt className="h-4 w-4" />
                <span>03 / UAE FTA VAT 201 Tax Return Calculator</span>
              </span>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                5% UAE FTA Standard
              </span>
            </div>

            <h2 className="m-0 mb-2 text-2xl font-extrabold">
              UAE VAT 201 Box &amp; Net Tax Payable Calculator (AED)
            </h2>
            <p className="m-0 mb-6 text-xs leading-relaxed text-[var(--text-soft)]">
              Instant quarterly/monthly UAE VAT 201 calculation engine modeled on our Multi-Tenant
              Accounting &amp; UAE VAT 201 SaaS platform.
            </p>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              <div>
                <label className="mb-1 block font-mono text-[10px] font-bold uppercase text-[var(--acid)]">
                  Box 1: Standard Supplies (5%)
                </label>
                <input
                  type="number"
                  value={standardSuppliesAed}
                  onChange={(e) => setStandardSuppliesAed(Number(e.target.value) || 0)}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-3 py-2.5 font-mono text-xs text-[var(--page-text)]"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[10px] font-bold uppercase text-[var(--cyan)]">
                  Box 4: Zero-Rated (0%)
                </label>
                <input
                  type="number"
                  value={zeroRatedSuppliesAed}
                  onChange={(e) => setZeroRatedSuppliesAed(Number(e.target.value) || 0)}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-3 py-2.5 font-mono text-xs text-[var(--page-text)]"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[10px] font-bold uppercase text-emerald-400">
                  Box 9: Standard Expenses (5%)
                </label>
                <input
                  type="number"
                  value={recoverableExpensesAed}
                  onChange={(e) => setRecoverableExpensesAed(Number(e.target.value) || 0)}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-3 py-2.5 font-mono text-xs text-[var(--page-text)]"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-card)] p-4 font-mono">
              <div>
                <div className="text-[10px] text-[var(--text-faint)]">Output VAT (5%)</div>
                <div className="mt-1 text-sm font-bold text-[var(--page-text)]">
                  AED {vatSummary.outputVatAed.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--text-faint)]">Input VAT (Recoverable)</div>
                <div className="mt-1 text-sm font-bold text-emerald-400">
                  -AED {vatSummary.inputVatAed.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--acid)]">Box 14: Net Tax Due</div>
                <div className="mt-1 text-base font-black text-[var(--acid)]">
                  AED {vatSummary.netVatPayableAed.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Link
                href="/projects/accounting"
                className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[var(--acid)] hover:underline"
              >
                <span>Inspect UAE VAT 201 Accounting SaaS Blueprint</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </SpotlightCard>

          {/* TOOL 4: Live Webhook HMAC-SHA256 Signature Generator */}
          <SpotlightCard className="p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--cyan)]">
                <ShieldCheck className="h-4 w-4" />
                <span>04 / Webhook HMAC-SHA256 Signature Tester</span>
              </span>
              <span className="rounded-full bg-[var(--acid)]/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[var(--acid)]">
                Stripe / GHL v2 Security
              </span>
            </div>

            <h2 className="m-0 mb-2 text-2xl font-extrabold">
              Cryptographic Webhook Signature Generator
            </h2>
            <p className="m-0 mb-5 text-xs leading-relaxed text-[var(--text-soft)]">
              Test HMAC-SHA256 webhook verification payloads for Stripe, GoHighLevel API v2, and
              WATI integrations directly in your browser using Web Crypto.
            </p>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block font-mono text-[10px] font-bold uppercase text-[var(--acid)]">
                  Endpoint Signing Secret
                </label>
                <input
                  type="text"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-3.5 py-2 font-mono text-xs text-[var(--page-text)]"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-[10px] font-bold uppercase text-[var(--cyan)]">
                  JSON Webhook Body Payload
                </label>
                <textarea
                  rows={2}
                  value={webhookPayload}
                  onChange={(e) => setWebhookPayload(e.target.value)}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-3.5 py-2 font-mono text-xs text-[var(--page-text)]"
                />
              </div>

              <div className="rounded-2xl border border-[var(--line)] bg-[#08090e] p-3.5 font-mono">
                <div className="mb-1 flex items-center justify-between text-[10px] text-white/50">
                  <span>X-HMAC-Signature (SHA-256 Hex)</span>
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(hmacSignature);
                      setCopiedHmac(true);
                      window.setTimeout(() => setCopiedHmac(false), 1800);
                    }}
                    className="inline-flex items-center gap-1 text-[#c8ff3d] hover:underline cursor-pointer"
                  >
                    {copiedHmac ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedHmac ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="break-all text-xs font-bold text-[#c8ff3d]">
                  {hmacSignature || 'Computing SHA-256...'}
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* High-Intent UAE Solutions Directory Cards */}
        <section className="mt-16 border-t border-[var(--line)] pt-12">
          <div className="mb-6">
            <div className="mb-1 font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-[var(--acid)]">
              <Sparkles className="mr-1 inline h-3.5 w-3.5" />
              UAE Enterprise Consulting &amp; Architecture Services
            </div>
            <h2 className="m-0 text-3xl font-extrabold tracking-[-0.03em]">
              Dedicated UAE Solution Blueprints
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {UAE_SOLUTIONS.map((sol) => (
              <Link
                key={sol.slug}
                href={`/solutions/${sol.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 transition-all hover:-translate-y-1 hover:border-[var(--acid)]"
              >
                <div>
                  <div className="mb-2 font-mono text-[10px] font-bold uppercase text-[var(--acid)]">
                    Dubai · Abu Dhabi · UAE
                  </div>
                  <h3 className="m-0 mb-2 text-base font-extrabold text-[var(--page-text)] group-hover:text-[var(--acid)]">
                    {sol.title}
                  </h3>
                  <p className="m-0 line-clamp-3 text-xs leading-relaxed text-[var(--text-soft)]">
                    {sol.summary}
                  </p>
                </div>
                <div className="mt-4 inline-flex items-center gap-1 font-mono text-[10.5px] font-bold uppercase text-[var(--acid)]">
                  <span>View Solution</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
