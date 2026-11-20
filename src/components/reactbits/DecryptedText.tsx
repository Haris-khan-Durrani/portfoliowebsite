'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_+#>';

interface DecryptedTextProps {
  text: string;
  className?: string;
  speed?: number;
  animateOn?: 'view' | 'hover';
}

export function DecryptedText({
  text,
  className,
  speed = 28,
  animateOn = 'view',
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const hasPlayedRef = useRef(false);
  const elRef = useRef<HTMLSpanElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  const runDecrypt = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayText(text);
      return;
    }
    if (intervalRef.current) window.clearInterval(intervalRef.current);

    let iteration = 0;
    intervalRef.current = window.setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, idx) => {
            if (char === ' ' || char === '/' || char === '·') return char;
            if (idx < iteration) return text[idx];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      iteration += 1.25;
      if (iteration >= text.length) {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        setDisplayText(text);
      }
    }, speed);
  };

  useEffect(() => {
    if (animateOn !== 'view' || !elRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasPlayedRef.current) {
          hasPlayedRef.current = true;
          runDecrypt();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(elRef.current);
    return () => {
      observer.disconnect();
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, animateOn]);

  return (
    <span
      ref={elRef}
      onMouseEnter={animateOn === 'hover' ? runDecrypt : undefined}
      className={cn('inline-block', className)}
    >
      {displayText}
    </span>
  );
}
