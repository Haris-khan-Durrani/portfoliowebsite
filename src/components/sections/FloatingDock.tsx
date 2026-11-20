'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingDockProps {
  scrollProgress: number;
  activeSection: string;
}

const DOCK_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'experience', label: 'Experience' },
  { id: 'dossiers', label: 'Blueprints' },
  { id: 'work', label: 'Systems' },
  { id: 'codeplay', label: 'Code' },
  { id: 'terminal', label: 'Shell' },
  { id: 'contact', label: 'Contact' },
];

export function FloatingDock({ scrollProgress, activeSection }: FloatingDockProps) {
  // Never overlap the Hero section at top of page — glide in cleanly once scrolling starts
  const showDock = scrollProgress >= 6;

  return (
    <>
      {/* Desktop Floating Scroll Progress Dock (React Bits Magnification Style) */}
      <AnimatePresence>
        {showDock && (
          <motion.nav
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            aria-label="Quick Section Navigation"
            className="fixed bottom-5 left-1/2 z-[70] hidden -translate-x-1/2 items-center gap-2 rounded-full border border-[var(--header-border)] bg-[var(--header-bg)] py-1.5 pl-4 pr-2.5 shadow-[0_22px_50px_-10px_rgba(0,0,0,0.7)] backdrop-blur-2xl lg:flex"
          >
            <div className="mr-1 flex items-center gap-2 border-r border-[var(--line)] pr-3.5 font-mono text-[10px] text-[var(--text-soft)]">
              <div className="h-1 w-11 overflow-hidden rounded-full bg-[var(--line)]">
                <div
                  className="h-full bg-[var(--acid)] transition-[width] duration-100 ease-linear"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
              <span className="w-7 text-right tabular-nums">{scrollProgress}%</span>
            </div>

            <div className="flex items-center gap-0.5">
              {DOCK_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    whileHover={{ y: -3, scale: 1.07 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                    className={cn(
                      'relative rounded-full px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.06em] transition-colors',
                      isActive
                        ? 'text-[#060608]'
                        : 'text-[var(--text-soft)] hover:bg-[var(--page-text)]/[0.08] hover:text-[var(--page-text)]'
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="dock-active-pill"
                        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                        className="absolute inset-0 -z-10 rounded-full bg-[var(--acid)]"
                      />
                    )}
                    {item.label}
                  </motion.a>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Compact Scroll Telemetry + Back-to-Top Pill */}
      <AnimatePresence>
        {scrollProgress > 8 && (
          <motion.a
            href="#hero"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            aria-label="Scroll back to top"
            className="fixed bottom-4 right-4 z-[70] inline-flex items-center gap-2 rounded-full border border-[var(--header-border)] bg-[var(--header-bg)] px-3.5 py-2 font-mono text-[10.5px] font-bold text-[var(--page-text)] shadow-[0_14px_36px_rgba(0,0,0,0.6)] backdrop-blur-xl lg:hidden"
          >
            <span className="tabular-nums text-[var(--acid)]">{scrollProgress}%</span>
            <ArrowUp className="h-3.5 w-3.5 text-[var(--acid)]" />
          </motion.a>
        )}
      </AnimatePresence>
    </>
  );
}
