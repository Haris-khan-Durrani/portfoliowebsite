'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Calculator, Menu, Terminal, X } from 'lucide-react';
import { NAV_ITEMS, SITE_CONFIG } from '@/data/portfolio';
import { ThemeTogglerButton } from '@/components/animate-ui/ThemeTogglerButton';
import { cn } from '@/lib/utils';

interface NavbarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  activeSection: string;
  dubaiTime: string;
  onFocusTerminal: () => void;
}

export function Navbar({
  theme,
  onToggleTheme,
  activeSection,
  dubaiTime,
  onFocusTerminal,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const topbarItems = NAV_ITEMS.filter((item) => !item.hideInTopbar);

  return (
    <>
      <header
        id="topbar"
        className={cn(
          'fixed left-1/2 top-3.5 z-[80] flex h-[58px] w-[min(1360px,calc(100%-clamp(16px,3vw,40px)))] -translate-x-1/2 items-center justify-between gap-3 rounded-full border border-[var(--header-border)] bg-[var(--header-bg)] px-3 pl-3.5 text-[var(--header-text)] backdrop-blur-2xl transition-all duration-300 sm:pl-4',
          scrolled
            ? 'shadow-[0_22px_54px_-12px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.1)]'
            : 'shadow-[0_16px_42px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]'
        )}
      >
        {/* Left Executive Brand Lockup — Never Truncates or Wraps Awkwardly */}
        <a
          href="#hero"
          aria-label="Haris Khan Durrani — Home"
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px] border border-[var(--acid)]/45 bg-gradient-to-br from-[var(--acid)]/20 to-[var(--cyan)]/15 font-mono text-[11px] font-black text-[var(--acid)] shadow-[0_0_18px_rgba(200,255,61,0.2)] transition-transform duration-300 group-hover:scale-105">
            {SITE_CONFIG.initials}
          </span>
          <span className="flex flex-col justify-center leading-none">
            <span className="whitespace-nowrap text-[13.5px] font-extrabold tracking-[-0.015em] text-[var(--page-text)]">
              {SITE_CONFIG.name}
            </span>
            <span className="mt-1 hidden whitespace-nowrap font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--text-faint)] sm:block">
              {SITE_CONFIG.shortRole}
            </span>
          </span>
        </a>

        {/* Center Desktop Nav — Crisp Single-Line Pill with Gliding Highlight */}
        <nav
          aria-label="Primary navigation"
          onMouseLeave={() => setHoveredId(null)}
          className="hidden items-center gap-0.5 rounded-full border border-[var(--line-subtle)] bg-[var(--page-text)]/[0.03] p-1 lg:flex"
        >
          {topbarItems.map((item) => {
            const isHighlighted = hoveredId ? hoveredId === item.id : activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onMouseEnter={() => setHoveredId(item.id)}
                className={cn(
                  'relative z-10 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.01em] transition-colors',
                  isHighlighted
                    ? 'text-[var(--page-text)]'
                    : 'text-[var(--text-soft)] hover:text-[var(--page-text)]'
                )}
              >
                {isHighlighted && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 -z-10 rounded-full border border-[var(--line)] bg-[var(--page-text)]/[0.09]"
                  />
                )}
                <span>{item.label}</span>
                {'badge' in item && item.badge && (
                  <span className="rounded-full bg-[var(--acid)]/15 px-1.5 py-0.2 font-mono text-[9.5px] font-bold text-[var(--acid)]">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}

          <span className="mx-1 h-3.5 w-[1px] bg-[var(--line)]" aria-hidden="true" />

          <a
            href="/tools"
            className="relative z-10 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[var(--acid)]/10 px-3 py-1.5 text-[11.5px] font-bold tracking-[0.01em] text-[var(--acid)] transition-all hover:bg-[var(--acid)]/20"
          >
            <Calculator className="h-3 w-3" />
            <span>Tools</span>
          </a>
        </nav>

        {/* Right Actions — Availability, Terminal, Theme & Consult CTA */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-2 whitespace-nowrap rounded-full border border-[var(--line)] bg-[var(--page-text)]/[0.03] px-3 py-1.5 font-mono text-[10.5px] text-[var(--text-soft)] xl:inline-flex">
            <span className="status-dot-pulse h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>{SITE_CONFIG.availability}</span>
          </div>

          <button
            type="button"
            onClick={onFocusTerminal}
            aria-label="Launch Interactive System Terminal"
            title="Launch Interactive Terminal"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-transparent text-[var(--page-text)] transition-all hover:-translate-y-0.5 hover:border-[var(--acid)] hover:bg-[var(--acid)] hover:text-[#060608] cursor-pointer"
          >
            <Terminal className="h-4 w-4" />
          </button>

          <ThemeTogglerButton theme={theme} onToggle={onToggleTheme} />

          <a
            href="#contact"
            className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-br from-[#c8ff3d] to-[#a5ea10] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#060608] shadow-[0_4px_18px_rgba(200,255,61,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_26px_rgba(200,255,61,0.45)] sm:inline-flex"
          >
            <span>Consult</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-transparent text-[var(--page-text)] transition-colors hover:border-[var(--acid)] hover:text-[var(--acid)] lg:hidden cursor-pointer"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu with Animate UI Spring Reveal */}
      <AnimatePresence>
        {menuOpen && (
          <div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed inset-0 z-[75] lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />
            <motion.aside
              initial={{ opacity: 0, y: -18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              className="absolute left-3.5 right-3.5 top-[82px] max-h-[calc(100svh-100px)] overflow-y-auto rounded-[24px] border border-[var(--header-border)] bg-[var(--surface-card)] p-5 text-[var(--header-text)] shadow-[0_32px_90px_rgba(0,0,0,0.75)]"
            >
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3.5 font-mono text-[11px] font-bold text-[var(--acid)]">
                <span>HARIS KHAN DURRANI</span>
                <span className="tabular-nums">{dubaiTime}</span>
              </div>

              <nav className="my-3 flex flex-col">
                {NAV_ITEMS.map((item, idx) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * idx }}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-[50px] items-center justify-between border-b border-[var(--line-subtle)] text-[17px] font-extrabold uppercase tracking-[-0.02em] text-[var(--page-text)] transition-colors hover:text-[var(--acid)]"
                  >
                    <span>{item.mobileTitle}</span>
                    <span className="font-mono text-[10.5px] font-bold text-[var(--acid)]">
                      {item.mobileIndex}
                    </span>
                  </motion.a>
                ))}
                <a
                  href="/tools"
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-[50px] items-center justify-between border-b border-[var(--line-subtle)] text-[17px] font-extrabold uppercase tracking-[-0.02em] text-[var(--acid)] transition-colors"
                >
                  <span>UAE ROI Calculators</span>
                  <span className="font-mono text-[10.5px] font-bold text-[var(--acid)]">
                    TOOLS ↗
                  </span>
                </a>
                <a
                  href="/blog"
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-[50px] items-center justify-between border-b border-[var(--line-subtle)] text-[17px] font-extrabold uppercase tracking-[-0.02em] text-[var(--cyan)] transition-colors"
                >
                  <span>Architecture Journal</span>
                  <span className="font-mono text-[10.5px] font-bold text-[var(--cyan)]">
                    BLOG ↗
                  </span>
                </a>
              </nav>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                <a
                  href={SITE_CONFIG.phoneHref}
                  className="font-mono text-xs text-[var(--text-soft)] hover:text-[var(--acid)]"
                >
                  {SITE_CONFIG.phone}
                </a>
                <div className="flex items-center gap-3">
                  <a
                    href={SITE_CONFIG.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs font-bold text-[var(--acid)]"
                  >
                    GitHub ↗
                  </a>
                  <a
                    href="#contact"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full bg-[var(--acid)] px-4 py-2 text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-[#060608]"
                  >
                    Consult ↗
                  </a>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
