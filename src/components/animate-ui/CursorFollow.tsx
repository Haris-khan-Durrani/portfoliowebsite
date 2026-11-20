'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function CursorFollow() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const smoothX = useSpring(mouseX, { stiffness: 320, damping: 28, mass: 0.4 });
  const smoothY = useSpring(mouseY, { stiffness: 320, damping: 28, mass: 0.4 });

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || reduced || window.innerWidth < 1024) return;

    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);

      const target = e.target as HTMLElement | null;
      const isClickable = Boolean(
        target?.closest('a, button, input, textarea, [data-interactive="true"]')
      );
      setInteractive(isClickable);
    };

    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: smoothX,
        y: smoothY,
      }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: interactive ? 1.65 : 1,
      }}
      transition={{ duration: 0.18 }}
      className="pointer-events-none fixed left-0 top-0 z-[120] hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--acid)]/70 bg-[var(--acid)]/10 backdrop-blur-[1px] lg:block"
    >
      <div className="h-6 w-6 rounded-full" />
    </motion.div>
  );
}
