'use client';

import { useState, type FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2, ClipboardCheck, Copy, Mail, Send } from 'lucide-react';
import { SITE_CONFIG } from '@/data/portfolio';
import { DecryptedText } from '@/components/reactbits/DecryptedText';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { LiquidButton } from '@/components/animate-ui/LiquidButton';

interface ContactSectionProps {
  onShowToast: (message: string) => void;
}

export function ContactSection({ onShowToast }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<{
    ok: boolean;
    referenceId?: string;
    mailtoUrl?: string;
    detail: string;
  } | null>(null);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.email);
      setCopiedEmail(true);
      onShowToast('Email copied to clipboard!');
      window.setTimeout(() => setCopiedEmail(false), 2400);
    } catch {
      onShowToast(SITE_CONFIG.email);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setSubmitting(true);
    setDispatchResult(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setDispatchResult({
          ok: true,
          referenceId: data.referenceId,
          mailtoUrl: data.mailtoUrl,
          detail: data.message,
        });
        onShowToast('Dispatch validated & queued!');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setDispatchResult({
          ok: false,
          detail: data.error || 'Unable to process dispatch. Please email directly.',
        });
      }
    } catch {
      const fallbackUrl = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(message)}`;
      setDispatchResult({
        ok: true,
        mailtoUrl: fallbackUrl,
        detail: 'Ready to send via your email client.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative bg-[var(--page-bg)] px-[clamp(16px,4vw,72px)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--acid)]">
          <DecryptedText text="08 / Engage & Collaborate" />
        </div>

        <h2
          id="contact-title"
          className="m-0 text-[clamp(46px,9.5vw,144px)] font-black uppercase leading-[0.86] tracking-[-0.065em] text-[var(--page-text)]"
        >
          Let&apos;s build
          <br />
          <span className="contact-outline">something</span>
          <br />
          serious.
        </h2>

        <div className="mt-12 grid grid-cols-1 items-start gap-10 border-t border-[var(--line)] pt-10 lg:mt-16 lg:grid-cols-12 lg:gap-12 lg:pt-12">
          {/* Direct Channels Column */}
          <div className="lg:col-span-7">
            <p className="mb-8 max-w-[580px] text-[15.5px] leading-[1.7] text-[var(--text-soft)] sm:text-base">
              {SITE_CONFIG.contactIntro}
            </p>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <a href={SITE_CONFIG.phoneHref} className="block">
                <SpotlightCard className="rounded-[18px] p-5 hover:-translate-y-0.5 hover:border-[var(--acid)]">
                  <small className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                    Direct Phone / WhatsApp
                  </small>
                  <strong className="block text-[14px] font-extrabold text-[var(--page-text)]">
                    {SITE_CONFIG.phone}
                  </strong>
                </SpotlightCard>
              </a>

              <a href={`mailto:${SITE_CONFIG.email}`} className="block">
                <SpotlightCard className="rounded-[18px] p-5 hover:-translate-y-0.5 hover:border-[var(--acid)]">
                  <small className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                    Direct Email
                  </small>
                  <strong className="block break-all text-[14px] font-extrabold text-[var(--page-text)]">
                    {SITE_CONFIG.email}
                  </strong>
                </SpotlightCard>
              </a>

              <a
                href={SITE_CONFIG.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <SpotlightCard className="rounded-[18px] p-5 hover:-translate-y-0.5 hover:border-[var(--acid)]">
                  <small className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                    LinkedIn Network
                  </small>
                  <strong className="block text-[14px] font-extrabold text-[var(--page-text)]">
                    {SITE_CONFIG.linkedinHandle} ↗
                  </strong>
                </SpotlightCard>
              </a>

              <a
                href={SITE_CONFIG.github}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <SpotlightCard className="rounded-[18px] p-5 hover:-translate-y-0.5 hover:border-[var(--acid)]">
                  <small className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                    GitHub Profile
                  </small>
                  <strong className="block text-[14px] font-extrabold text-[var(--page-text)]">
                    {SITE_CONFIG.githubHandle} ↗
                  </strong>
                </SpotlightCard>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="block text-left cursor-pointer"
              >
                <SpotlightCard className="rounded-[18px] p-5 hover:-translate-y-0.5 hover:border-[var(--acid)]">
                  <small className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                    Quick Copy
                  </small>
                  <strong className="inline-flex items-center gap-2 text-[14px] font-extrabold text-[var(--page-text)]">
                    {copiedEmail ? (
                      <>
                        <ClipboardCheck className="h-4 w-4 text-[var(--acid)]" />
                        <span>Email Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 text-[var(--acid)]" />
                        <span>Click to Copy Email</span>
                      </>
                    )}
                  </strong>
                </SpotlightCard>
              </button>

              <SpotlightCard className="rounded-[18px] p-5">
                <small className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                  Location &amp; Domain
                </small>
                <strong className="block text-[14px] font-extrabold text-[var(--page-text)]">
                  Dubai, UAE · {SITE_CONFIG.domain}
                </strong>
              </SpotlightCard>
            </div>
          </div>

          {/* Consultation Dispatch Form powered by Node.js /api/contact */}
          <div className="lg:col-span-5">
            <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_28px_80px_var(--shadow)] sm:p-9">
              <h3 className="m-0 mb-3 text-xl font-black uppercase tracking-[-0.02em] text-[var(--page-text)]">
                Start a Conversation
              </h3>
              <p className="mb-6 text-xs leading-relaxed text-[var(--text-soft)]">
                Have an enterprise project or leadership opportunity in mind? Send a direct dispatch
                to my inbox.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contactName"
                      className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]"
                    >
                      Your Name
                    </label>
                    <input
                      id="contactName"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex / CTO"
                      className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-3 text-sm text-[var(--page-text)] placeholder:text-[var(--text-faint)] focus:border-[var(--acid)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contactEmail"
                      className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]"
                    >
                      Work Email
                    </label>
                    <input
                      id="contactEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-3 text-sm text-[var(--page-text)] placeholder:text-[var(--text-faint)] focus:border-[var(--acid)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subjectField"
                    className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]"
                  >
                    Subject / Topic *
                  </label>
                  <input
                    id="subjectField"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Solution Architecture / CRM & Telephony Project"
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-3 text-sm text-[var(--page-text)] placeholder:text-[var(--text-faint)] focus:border-[var(--acid)] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="msgField"
                    className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]"
                  >
                    Project Context &amp; Objectives *
                  </label>
                  <textarea
                    id="msgField"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about your business goals, timeline, and current system bottlenecks..."
                    className="w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-3 text-sm text-[var(--page-text)] placeholder:text-[var(--text-faint)] focus:border-[var(--acid)] focus:outline-none"
                  />
                </div>

                <LiquidButton
                  type="submit"
                  disabled={submitting}
                  variant="primary"
                  className="w-full justify-center py-3.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{submitting ? 'Dispatching...' : 'Send Dispatch'}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </LiquidButton>

                {dispatchResult && (
                  <div
                    role="status"
                    className={`rounded-2xl border p-4 text-xs ${
                      dispatchResult.ok
                        ? 'border-[var(--acid)]/40 bg-[var(--acid)]/[0.08] text-[var(--page-text)]'
                        : 'border-red-500/40 bg-red-500/10 text-red-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {dispatchResult.ok && (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--acid)]" />
                      )}
                      <div className="space-y-2">
                        <p className="m-0 font-semibold">{dispatchResult.detail}</p>
                        {dispatchResult.referenceId && (
                          <div className="font-mono text-[10px] text-[var(--text-faint)]">
                            REF: {dispatchResult.referenceId}
                          </div>
                        )}
                        {dispatchResult.mailtoUrl && (
                          <a
                            href={dispatchResult.mailtoUrl}
                            className="inline-flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] text-[var(--acid)] underline underline-offset-4"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            <span>Open in Mail App ↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
