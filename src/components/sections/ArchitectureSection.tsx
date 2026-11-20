'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ARCHITECTURE_LAYERS, SITE_CONFIG } from '@/data/portfolio';
import { DecryptedText } from '@/components/reactbits/DecryptedText';

gsap.registerPlugin(ScrollTrigger);

export function ArchitectureSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('[data-pillar-row]'), {
        y: 26,
        opacity: 0,
        duration: 0.7,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el.querySelector('[data-pillar-list]'),
          start: 'top 84%',
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="architecture"
      aria-labelledby="architecture-title"
      className="relative border-b border-[var(--line)] bg-[var(--surface)] px-[clamp(16px,4vw,72px)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-14 grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--acid)]">
              <DecryptedText text="06 / System Architecture" />
            </div>
            <h2
              id="architecture-title"
              className="m-0 text-[clamp(34px,5.2vw,68px)] font-black uppercase leading-[0.94] tracking-[-0.045em] text-[var(--page-text)]"
            >
              The Full-Stack
              <br />
              <span className="text-[var(--acid)]">Spectrum.</span>
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-6">
            <p className="m-0 text-base leading-relaxed text-[var(--text-soft)]">
              {SITE_CONFIG.architectureIntro}
            </p>
          </div>
        </div>

        <div data-pillar-list className="border-t border-[var(--line)]">
          {ARCHITECTURE_LAYERS.map((layer) => (
            <div
              key={layer.index}
              data-pillar-row
              className="group relative isolate grid grid-cols-1 items-center gap-4 overflow-hidden border-b border-[var(--line)] px-3 py-7 transition-colors duration-300 sm:px-5 lg:grid-cols-[90px_1.05fr_1.55fr_auto] lg:gap-6 lg:py-9"
            >
              {/* Acid Lime Sweep Fill */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 translate-y-[102%] bg-[var(--acid)] transition-transform duration-500 ease-[cubic-bezier(0.2,0.9,0.3,1)] group-hover:translate-y-0"
              />

              <div className="font-mono text-[11px] font-bold text-[var(--text-faint)] transition-colors group-hover:text-[#060608]/75">
                {layer.index}
              </div>

              <h3 className="m-0 text-[clamp(22px,2.8vw,40px)] font-black uppercase leading-[1.05] tracking-[-0.04em] text-[var(--page-text)] transition-colors group-hover:text-[#060608]">
                {layer.title}
              </h3>

              <div>
                <p className="m-0 text-[13.5px] leading-[1.65] text-[var(--text-soft)] transition-colors group-hover:text-[#060608]/85">
                  {layer.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {layer.highlights.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[var(--line)] bg-[var(--surface-card)] px-2.5 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.06em] text-[var(--text-faint)] transition-colors group-hover:border-[#060608]/25 group-hover:bg-[#060608]/10 group-hover:text-[#060608]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--acid)] transition-colors group-hover:text-[#060608]">
                {layer.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
