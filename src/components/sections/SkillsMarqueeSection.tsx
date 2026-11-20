'use client';

import { SKILLS_ROW_1, SKILLS_ROW_2 } from '@/data/portfolio';
import { DecryptedText } from '@/components/reactbits/DecryptedText';

function SkillPill({ label }: { label: string }) {
  return (
    <span className="flex min-w-max items-center gap-2.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-3.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--page-text)] shadow-[0_6px_24px_var(--shadow)] transition-all duration-250 hover:-translate-y-0.5 hover:border-[var(--acid)] hover:bg-[var(--acid)] hover:text-[#060608]">
      <span
        aria-hidden="true"
        className="h-[7px] w-[7px] rounded-full bg-[var(--acid)] shadow-[0_0_12px_var(--acid)]"
      />
      {label}
    </span>
  );
}

export function SkillsMarqueeSection() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="marquee-group relative overflow-hidden border-b border-[var(--line)] bg-[var(--page-bg)] py-20 sm:py-28"
    >
      <div className="mx-auto mb-10 max-w-[1360px] px-[clamp(16px,4vw,72px)] sm:mb-12">
        <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--acid)]">
          <DecryptedText text="05 / Technical Stack" />
        </div>
        <h2
          id="skills-title"
          className="m-0 text-[clamp(28px,4.2vw,54px)] font-black uppercase tracking-[-0.03em] text-[var(--page-text)]"
        >
          Battle-tested across every layer.
        </h2>
      </div>

      {/* Marquee Row 1 */}
      <div className="marquee-mask flex w-full overflow-hidden py-2.5">
        <div className="marquee-track-left flex w-max flex-none">
          <div className="flex gap-3 pr-3">
            {SKILLS_ROW_1.map((skill) => (
              <SkillPill key={`r1a-${skill}`} label={skill} />
            ))}
          </div>
          <div className="flex gap-3 pr-3" aria-hidden="true">
            {SKILLS_ROW_1.map((skill) => (
              <SkillPill key={`r1b-${skill}`} label={skill} />
            ))}
          </div>
        </div>
      </div>

      {/* Marquee Row 2 (Reverse) */}
      <div className="marquee-mask mt-1 flex w-full overflow-hidden py-2.5">
        <div className="marquee-track-right flex w-max flex-none">
          <div className="flex gap-3 pr-3">
            {SKILLS_ROW_2.map((skill) => (
              <SkillPill key={`r2a-${skill}`} label={skill} />
            ))}
          </div>
          <div className="flex gap-3 pr-3" aria-hidden="true">
            {SKILLS_ROW_2.map((skill) => (
              <SkillPill key={`r2b-${skill}`} label={skill} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
