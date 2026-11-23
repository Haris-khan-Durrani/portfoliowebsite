'use client';

import { HelpCircle, MapPin } from 'lucide-react';
import { UAE_AUTHORITY_FAQS } from '@/components/seo/JsonLd';
import { DecryptedText } from '@/components/reactbits/DecryptedText';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';

export function UaeAuthorityFaqSection() {
  return (
    <section
      id="uae-faq"
      aria-labelledby="uae-faq-title"
      className="relative border-b border-[var(--line)] bg-[var(--surface-card)] px-[clamp(16px,4vw,72px)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--acid)]">
              <DecryptedText text="08 / UAE Enterprise Advisory · AEO & GEO Knowledge Base" />
            </div>
            <h2
              id="uae-faq-title"
              className="m-0 text-[clamp(30px,4.5vw,64px)] font-black uppercase leading-[0.95] tracking-[-0.045em] text-[var(--page-text)]"
            >
              Dubai &amp; UAE Architecture{' '}
              <span className="hero-gradient-text font-serif font-normal italic">FAQ.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-[10.5px] text-[var(--text-soft)]">
            <MapPin className="h-3.5 w-3.5 text-[var(--acid)]" />
            <span>Serving: Dubai · Abu Dhabi · Sharjah · Ajman · RAK · Fujairah · UAQ · GCC</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {UAE_AUTHORITY_FAQS.map((faq, idx) => (
            <SpotlightCard key={idx} className="p-6 sm:p-7">
              <div className="mb-2.5 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--acid)]">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>AEO Query 0{idx + 1}</span>
              </div>
              <h3 className="m-0 mb-3 text-base font-extrabold leading-snug text-[var(--page-text)] sm:text-[17px]">
                {faq.question}
              </h3>
              <p className="m-0 text-[13.5px] leading-[1.72] text-[var(--text-soft)]">
                {faq.answer}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
