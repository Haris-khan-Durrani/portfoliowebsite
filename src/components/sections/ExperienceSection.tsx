'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EDUCATION_CREDENTIALS, EXPERIENCE_LIST, SITE_CONFIG } from '@/data/portfolio';
import { DecryptedText } from '@/components/reactbits/DecryptedText';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const spineProgressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    const spine = spineProgressRef.current;
    if (!el || !spine) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Draw timeline vertical spine downward on scroll
      gsap.fromTo(
        spine,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: {
            trigger: el.querySelector('[data-timeline-container]'),
            start: 'top 72%',
            end: 'bottom 80%',
            scrub: 0.6,
          },
        }
      );

      // Reveal timeline cards smoothly
      gsap.from(el.querySelectorAll('[data-timeline-card]'), {
        y: 32,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el.querySelector('[data-timeline-container]'),
          start: 'top 82%',
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      aria-labelledby="experience-title"
      className="relative border-b border-[var(--line)] bg-[var(--surface-card)] px-[clamp(16px,4vw,72px)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--acid)]">
              <DecryptedText text="01 / Career Journey & Leadership" />
            </div>
            <h2
              id="experience-title"
              className="m-0 text-[clamp(34px,5.6vw,84px)] font-black uppercase leading-[0.9] tracking-[-0.055em] text-[var(--page-text)]"
            >
              Professional Experience.
            </h2>
          </div>
          <p className="m-0 max-w-md text-sm leading-relaxed text-[var(--text-soft)]">
            {SITE_CONFIG.experienceIntro}
          </p>
        </div>

        <div data-timeline-container className="relative mt-14 max-w-[1200px] sm:mt-16">
          {/* Background track spine */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[11px] top-0 w-[2px] bg-[var(--line)] md:left-[23px]"
          />
          {/* GSAP Animated Acid Progress Spine */}
          <div
            ref={spineProgressRef}
            aria-hidden="true"
            className="absolute bottom-0 left-[11px] top-0 w-[2px] bg-gradient-to-b from-[var(--acid)] via-[var(--acid)]/70 to-[var(--cyan)] md:left-[23px]"
          />

          <div className="space-y-9 sm:space-y-11">
            {EXPERIENCE_LIST.map((exp) => (
              <div
                key={exp.id}
                data-timeline-card
                className="relative pl-9 sm:pl-12 md:pl-16"
              >
                <div
                  aria-hidden="true"
                  className={cn(
                    'absolute left-[3px] top-7 z-10 h-[18px] w-[18px] rounded-full border-[3px] border-[var(--acid)] bg-[var(--surface)] shadow-[0_0_16px_var(--acid)] md:left-[15px]',
                    exp.highlight && 'ring-4 ring-[var(--acid)]/20'
                  )}
                />

                <SpotlightCard
                  className={cn(
                    'p-6 shadow-[0_20px_50px_var(--shadow)] hover:-translate-y-1 hover:border-[var(--acid)]/45 sm:p-8 lg:p-10',
                    exp.highlight &&
                      'border-[var(--acid)]/35 bg-gradient-to-br from-[var(--acid)]/[0.04] via-[var(--surface)] to-[var(--surface)]'
                  )}
                >
                  <article>
                    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                      <h3 className="text-[clamp(22px,2.7vw,36px)] font-black uppercase leading-tight tracking-[-0.04em] text-[var(--page-text)]">
                        {exp.company}
                      </h3>
                      <span className="rounded-full border border-[var(--acid)]/30 bg-[var(--acid)]/[0.08] px-3.5 py-1 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-[var(--acid)]">
                        {exp.period}
                      </span>
                    </div>

                    <div className="mb-5 text-[14.5px] font-bold tracking-[-0.01em] text-[var(--cyan)]">
                      {exp.role}
                    </div>

                    <ul className="m-0 list-disc space-y-2.5 pl-5 text-[14px] leading-[1.7] text-[var(--text-soft)]">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-2.5 border-t border-[var(--line-subtle)] pt-5">
                      {exp.metrics.map((metric) => (
                        <span
                          key={metric.label}
                          className="rounded-full border border-[var(--line)] bg-[var(--surface-card)] px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.07em] text-[var(--page-text)]"
                        >
                          {metric.label}:{' '}
                          <strong className="text-[var(--acid)]">{metric.value}</strong>
                        </span>
                      ))}
                    </div>
                  </article>
                </SpotlightCard>
              </div>
            ))}

            {/* 5. Education & Credentials Card */}
            <div data-timeline-card className="relative pl-9 sm:pl-12 md:pl-16">
              <div
                aria-hidden="true"
                className="absolute left-[3px] top-7 z-10 h-[18px] w-[18px] rounded-full border-[3px] border-[var(--cyan)] bg-[var(--surface)] shadow-[0_0_16px_var(--cyan)] md:left-[15px]"
              />

              <SpotlightCard
                spotlightColor="rgba(56, 189, 248, 0.14)"
                className="p-6 shadow-[0_20px_50px_var(--shadow)] hover:border-[var(--cyan)]/45 sm:p-8 lg:p-10"
              >
                <article>
                  <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="text-[clamp(22px,2.7vw,36px)] font-black uppercase leading-tight tracking-[-0.04em] text-[var(--page-text)]">
                      Education &amp; Credentials
                    </h3>
                    <span className="rounded-full border border-[var(--cyan)]/35 bg-[var(--cyan)]/10 px-3.5 py-1 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-[var(--cyan)]">
                      ACADEMIC &amp; CERTIFIED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
                    {EDUCATION_CREDENTIALS.map((edu) => (
                      <div
                        key={edu.title}
                        className="rounded-2xl border border-[var(--line)] bg-[var(--surface-card)] p-4 transition-colors hover:border-[var(--acid)]/40"
                      >
                        <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                          {edu.category}
                        </span>
                        <h4 className="mb-1.5 text-base font-extrabold text-[var(--page-text)]">
                          {edu.title}
                        </h4>
                        <p className="m-0 text-xs leading-relaxed text-[var(--text-soft)]">
                          {edu.detail}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-t border-[var(--line-subtle)] pt-4 font-mono text-[11px] text-[var(--text-faint)]">
                    <span>LANGUAGES: {SITE_CONFIG.languages}</span>
                    <span>SECURITY: {SITE_CONFIG.securityPractices}</span>
                  </div>
                </article>
              </SpotlightCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
