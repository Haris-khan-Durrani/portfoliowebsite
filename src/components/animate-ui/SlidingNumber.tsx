'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

interface SlidingNumberProps {
  target: number;
  suffix?: string;
  duration?: number;
}

export function SlidingNumber({ target, suffix = '', duration = 1200 }: SlidingNumberProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!isInView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }

    let start: number | null = null;
    let rafId = 0;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min(1, (timestamp - start) / duration);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    setValue(0);
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix && <span className="text-[var(--acid)]">{suffix}</span>}
    </span>
  );
}
