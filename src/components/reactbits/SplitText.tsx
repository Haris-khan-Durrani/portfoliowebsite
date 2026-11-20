'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  triggerOnScroll?: boolean;
  highlightWord?: string;
  highlightClassName?: string;
}

export function SplitText({
  text,
  className,
  delay = 0.08,
  stagger = 0.045,
  triggerOnScroll = false,
  highlightWord,
  highlightClassName,
}: SplitTextProps) {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const words = text.split(' ');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const spans = el.querySelectorAll<HTMLSpanElement>('[data-split-word]');
    const masks = el.querySelectorAll<HTMLSpanElement>('[data-split-mask]');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        spans,
        {
          yPercent: 110,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.82,
          delay: triggerOnScroll ? 0 : delay,
          stagger,
          ease: 'power4.out',
          onComplete: () => {
            // Release overflow mask after entrance so italic serifs never clip
            gsap.set(masks, { overflow: 'visible' });
          },
          ...(triggerOnScroll
            ? {
                scrollTrigger: {
                  trigger: el,
                  start: 'top 88%',
                  once: true,
                },
              }
            : {}),
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay, stagger, triggerOnScroll]);

  return (
    <span ref={containerRef} className={cn('inline-flex flex-wrap items-baseline gap-x-[0.24em]', className)}>
      {words.map((word, idx) => {
        const clean = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const isHighlighted = highlightWord && clean === highlightWord.toLowerCase();

        return (
          <span
            key={`${word}-${idx}`}
            data-split-mask
            className="inline-block overflow-hidden py-[0.06em]"
          >
            <span
              data-split-word
              className={cn(
                'inline-block will-change-transform',
                isHighlighted && highlightClassName
              )}
            >
              {word}
            </span>
          </span>
        );
      })}
    </span>
  );
}
