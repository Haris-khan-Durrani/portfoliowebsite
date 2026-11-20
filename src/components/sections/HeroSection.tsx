'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'motion/react';
import gsap from 'gsap';
import { ArrowDown, ArrowUpRight, Github, MapPin } from 'lucide-react';
import { HERO_STATS, SITE_CONFIG } from '@/data/portfolio';
import { Magnet } from '@/components/reactbits/Magnet';
import { SlidingNumber } from '@/components/animate-ui/SlidingNumber';
import { LiquidButton } from '@/components/animate-ui/LiquidButton';

const HeroSculpture3D = dynamic(
  () => import('@/components/three/HeroSculpture3D').then((m) => m.HeroSculpture3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] w-full items-center justify-center sm:h-[470px] lg:h-[530px]">
        <div className="h-40 w-40 animate-pulse rounded-3xl border border-[var(--acid)]/25 bg-[radial-gradient(circle,rgba(200,255,61,0.12),transparent_70%)]" />
      </div>
    ),
  }
);

const ROTATING_DOMAINS = [
  'Enterprise SaaS & ERP',
  'GoHighLevel OAuth v2',
  '3CX AI Telephony PBX',
  'Multi-Tenant Cloud Ops',
];

interface HeroSectionProps {
  theme: 'dark' | 'light';
  dubaiTime: string;
  onOpenBlueprint: (projectId: string) => void;
}

export function HeroSection({ theme, dubaiTime, onOpenBlueprint }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const [domainIndex, setDomainIndex] = useState(0);
  const [spotPos, setSpotPos] = useState({ x: 65, y: 38 });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDomainIndex((prev) => (prev + 1) % ROTATING_DOMAINS.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-hero-line]', {
        y: 38,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        delay: 0.06,
        ease: 'power4.out',
      });
      gsap.from('[data-hero-reveal]', {
        y: 22,
        opacity: 0,
        duration: 0.78,
        stagger: 0.08,
        delay: 0.22,
        ease: 'power3.out',
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotPos({ x, y });
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-labelledby="hero-title"
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden border-b border-[var(--line)] px-[clamp(16px,4vw,72px)] pb-7 pt-[92px] sm:pb-9 sm:pt-[104px]"
    >
      {/* Sculptural Diagonal Volumetric Light Rays + Cursor Spotlight */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -right-[10%] -top-[28%] h-[780px] w-[520px] rotate-[24deg] opacity-50 blur-3xl"
          style={{
            background:
              'linear-gradient(180deg, rgba(200,255,61,0.16) 0%, rgba(56,189,248,0.08) 48%, transparent 100%)',
          }}
        />
        <div
          className="absolute left-[14%] -top-[34%] h-[620px] w-[300px] rotate-[24deg] opacity-30 blur-3xl"
          style={{
            background: 'linear-gradient(180deg, rgba(56,189,248,0.14) 0%, transparent 80%)',
          }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(640px circle at ${spotPos.x}% ${spotPos.y}%, rgba(200, 255, 61, 0.065), transparent 55%)`,
          }}
        />
      </div>

      {/* Main Split Editorial + Studio-Lit 3D Sculpture Stage */}
      <div className="relative z-10 mx-auto my-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-8 py-4 lg:grid-cols-12 lg:gap-6">
        {/* LEFT COLUMN: Luxury Editorial Architecture Typography */}
        <div className="lg:col-span-6 xl:col-span-6">
          {/* Clean Architectural Eyebrow Strip (Zero Heavy Pill Clutter) */}
          <div
            data-hero-reveal
            className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[10.5px] tracking-[0.12em] text-[var(--text-soft)]"
          >
            <span className="inline-flex items-center gap-2 font-bold uppercase text-[var(--acid)]">
              <span className="status-dot-pulse h-2 w-2 rounded-full bg-emerald-400" />
              <MapPin className="h-3 w-3" />
              Dubai, UAE
            </span>
            <span className="h-3 w-px bg-[var(--line)]" aria-hidden="true" />
            <span className="uppercase text-[var(--text-soft)]">{SITE_CONFIG.subtitle}</span>
            <span className="hidden h-3 w-px bg-[var(--line)] sm:inline-block" aria-hidden="true" />
            <span
              suppressHydrationWarning
              className="hidden tabular-nums text-[var(--text-faint)] sm:inline-block"
            >
              {dubaiTime}
            </span>
          </div>

          {/* Sculptural 3-Line Editorial Display Headline (Mixed Geometric Sans + Expressive Instrument Serif Italic) */}
          <h1
            id="hero-title"
            className="m-0 font-sans text-[clamp(42px,4.8vw,74px)] font-extrabold leading-[1.01] tracking-[-0.045em] text-[var(--page-text)]"
          >
            <span data-hero-line className="block">
              I engineer
            </span>

            <span data-hero-line className="block">
              <span className="relative mr-[0.18em] inline-block align-baseline">
                <span className="hero-gradient-text font-serif text-[1.18em] font-normal italic tracking-[-0.02em]">
                  systems
                </span>
                {/* Hand-crafted Animated SVG Neon Accent Stroke */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 220 14"
                  fill="none"
                  className="pointer-events-none absolute -bottom-1 left-0 h-[10px] w-full overflow-visible"
                >
                  <motion.path
                    d="M2 10.5C58 2.5 148 1.5 218 8.5"
                    stroke="url(#heroUnderlineGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.05, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <defs>
                    <linearGradient id="heroUnderlineGrad" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#c8ff3d" />
                      <stop offset="1" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <span>that</span>
            </span>

            <span data-hero-line className="block sm:whitespace-nowrap">
              move businesses
              <span className="text-[var(--acid)]">.</span>
            </span>
          </h1>

          {/* Live Inline Focus Ticker (Airy, Hairline Editorial — No Boxy Pill Stack) */}
          <div
            data-hero-reveal
            className="mt-6 flex flex-wrap items-center gap-2.5 text-xs"
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-faint)]">
              Architecting
            </span>
            <span className="h-[1px] w-5 bg-[var(--acid)]/60" aria-hidden="true" />
            <span className="relative inline-flex h-5 min-w-[200px] items-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={ROTATING_DOMAINS[domainIndex]}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -16, opacity: 0 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  className="font-mono text-[11.5px] font-bold tracking-[0.06em] text-[var(--acid)]"
                >
                  {ROTATING_DOMAINS[domainIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>

          {/* Editorial Bio Copy with Subtle Accent Rule & Scannable Highlight Contrast */}
          <p
            data-hero-reveal
            className="mt-5 max-w-[560px] border-l-2 border-[var(--acid)]/55 pl-4 text-[clamp(14px,1.06vw,16px)] leading-[1.72] text-[var(--text-soft)]"
          >
            Technology leader and Senior Full-Stack Developer with{' '}
            <span className="font-semibold text-[var(--page-text)]">9+ years of experience</span>{' '}
            architecting{' '}
            <span className="font-semibold text-[var(--page-text)]">
              enterprise SaaS, ERP/CRM, and workflow automation platforms
            </span>{' '}
            that replace manual processes and scale across companies. Leading engineering and IT
            teams while remaining hands-on in{' '}
            <span className="font-medium text-[var(--page-text)]">
              React, Next.js, Node.js, PHP/Laravel, 3CX, and GoHighLevel
            </span>
            .
          </p>

          {/* Elevated Magnetic CTA Cluster */}
          <div data-hero-reveal className="mt-7 flex flex-wrap items-center gap-3">
            <Magnet>
              <LiquidButton href="#dossiers" variant="primary">
                <span>Inspect Blueprints</span>
                <ArrowDown className="h-3.5 w-3.5" />
              </LiquidButton>
            </Magnet>

            <Magnet>
              <LiquidButton href="#experience" variant="secondary">
                <span>Career Timeline</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </LiquidButton>
            </Magnet>

            <Magnet>
              <LiquidButton
                href={SITE_CONFIG.github}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </LiquidButton>
            </Magnet>
          </div>
        </div>

        {/* RIGHT COLUMN: Frameless Studio-Lit 3D Architectural Sculpture */}
        <div data-hero-reveal className="relative lg:col-span-6 xl:col-span-6">
          <HeroSculpture3D theme={theme} onOpenBlueprint={onOpenBlueprint} />
        </div>
      </div>

      {/* Bottom Architectural KPI Specification Rail */}
      <div
        data-hero-reveal
        className="relative z-10 mx-auto mt-4 w-full max-w-[1360px] border-t border-[var(--line)] pt-5"
      >
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          {HERO_STATS.map((stat, idx) => (
            <div
              key={stat.id}
              className="group flex items-baseline justify-between gap-3 border-l border-[var(--line-subtle)] pl-3.5 first:border-l-0 first:pl-0 sm:block sm:border-l sm:pl-5 sm:first:border-l-0 sm:first:pl-0"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[10px] text-[var(--text-faint)]">0{idx + 1}</span>
                <span className="text-[clamp(22px,2.2vw,30px)] font-black leading-none tracking-[-0.035em] text-[var(--page-text)]">
                  <SlidingNumber target={stat.target} suffix={stat.suffix} />
                </span>
              </div>
              <div className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-[var(--text-faint)] transition-colors group-hover:text-[var(--page-text)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
