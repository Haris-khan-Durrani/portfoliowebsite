'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'motion/react';
import { getProjectBySlug, type ProjectItem } from '@/data/portfolio';
import { CursorFollow } from '@/components/animate-ui/CursorFollow';
import { Navbar } from '@/components/sections/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { DossiersSection } from '@/components/sections/DossiersSection';
import { CodePlaygroundSection } from '@/components/sections/CodePlaygroundSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SkillsMarqueeSection } from '@/components/sections/SkillsMarqueeSection';
import { ArchitectureSection } from '@/components/sections/ArchitectureSection';
import { TerminalSection } from '@/components/sections/TerminalSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { FloatingDock } from '@/components/sections/FloatingDock';
import { BlueprintModal } from '@/components/sections/BlueprintModal';
import { Footer } from '@/components/sections/Footer';

const CyberneticCoreCanvas = dynamic(
  () => import('@/components/three/CyberneticCoreCanvas'),
  { ssr: false }
);

const TRACKED_SECTIONS = [
  'hero',
  'experience',
  'dossiers',
  'codeplay',
  'work',
  'skills',
  'architecture',
  'terminal',
  'contact',
];

function formatDubaiTime(): string {
  const now = new Date();
  return (
    now.toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Dubai',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }) + ' GST'
  );
}

export function PortfolioShell() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [dubaiTime, setDubaiTime] = useState<string>('--:--:-- GST');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [activeBlueprint, setActiveBlueprint] = useState<ProjectItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const terminalInputRef = useRef<HTMLInputElement | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  // Sync initial theme from DOM / localStorage
  useEffect(() => {
    const domTheme = document.documentElement.dataset.theme;
    if (domTheme === 'light' || domTheme === 'dark') {
      setTheme(domTheme);
    } else {
      const saved = window.localStorage.getItem('hkd-theme');
      const resolved: 'dark' | 'light' =
        saved === 'light' || saved === 'dark' ? saved : 'dark';
      document.documentElement.dataset.theme = resolved;
      setTheme(resolved);
    }
  }, []);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: 'dark' | 'light' = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      window.localStorage.setItem('hkd-theme', next);
      const themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) {
        themeMeta.setAttribute('content', next === 'light' ? '#f5f5f0' : '#060608');
      }
      return next;
    });
  }, []);

  // Live Dubai GST Clock
  useEffect(() => {
    setDubaiTime(formatDubaiTime());
    const interval = window.setInterval(() => {
      setDubaiTime(formatDubaiTime());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  // Scroll Progress & Active Section Observer
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        docHeight > 0 ? Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100))) : 0;
      setScrollProgress(progress);

      let current = 'hero';
      for (const id of TRACKED_SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.42 && rect.bottom >= window.innerHeight * 0.16) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleOpenBlueprint = useCallback((projectId: string) => {
    const found = getProjectBySlug(projectId);
    if (found) setActiveBlueprint(found);
  }, []);

  const handleShowToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2600);
  }, []);

  const handleFocusTerminal = useCallback(() => {
    const section = document.getElementById('terminal');
    section?.scrollIntoView({ behavior: 'smooth' });
    window.setTimeout(() => terminalInputRef.current?.focus(), 450);
  }, []);

  return (
    <>
      {/* Top Scroll Progress Micro Bar */}
      <div
        aria-hidden="true"
        className="fixed left-0 top-0 z-[95] h-[2px] bg-gradient-to-r from-[var(--acid)] to-[var(--cyan)] shadow-[0_0_12px_var(--acid-glow)] transition-[width] duration-100 ease-linear"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* 3D Three.js Cybernetic Architecture Core & Atmospheric Layers */}
      <CyberneticCoreCanvas theme={theme} />
      <div className="webgl-fade" aria-hidden="true" />
      <div className="arch-grid-bg" aria-hidden="true" />
      <div className="grain-overlay" aria-hidden="true" />

      {/* Desktop Animate UI Precision Cursor */}
      <CursorFollow />

      {/* Floating Capsule Navigation */}
      <Navbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        activeSection={activeSection}
        dubaiTime={dubaiTime}
        onFocusTerminal={handleFocusTerminal}
      />

      {/* Main Content Landmarks */}
      <main id="main-content" className="relative z-10">
        <HeroSection theme={theme} dubaiTime={dubaiTime} onOpenBlueprint={handleOpenBlueprint} />
        <ExperienceSection />
        <DossiersSection onOpenBlueprint={handleOpenBlueprint} />
        <CodePlaygroundSection onShowToast={handleShowToast} />
        <ProjectsSection onOpenBlueprint={handleOpenBlueprint} />
        <SkillsMarqueeSection />
        <ArchitectureSection />
        <TerminalSection inputRef={terminalInputRef} onOpenBlueprint={handleOpenBlueprint} />
        <ContactSection onShowToast={handleShowToast} />
      </main>

      {/* React Bits Floating Scroll Dock */}
      <FloatingDock scrollProgress={scrollProgress} activeSection={activeSection} />

      {/* Footer */}
      <Footer />

      {/* System Blueprint Modal Dialog */}
      <BlueprintModal project={activeBlueprint} onClose={() => setActiveBlueprint(null)} />

      {/* Animate UI Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="fixed bottom-6 right-6 z-[150] rounded-full bg-[var(--acid)] px-5 py-3 text-[11px] font-black uppercase tracking-[0.12em] text-[#060608] shadow-[0_12px_36px_var(--acid-glow)]"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
