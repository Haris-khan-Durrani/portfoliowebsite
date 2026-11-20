'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface LiquidButtonProps {
  children: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function LiquidButton({
  children,
  href,
  target,
  rel,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  className,
}: LiquidButtonProps) {
  const baseClasses = cn(
    'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 py-3.5 text-[11px] font-extrabold uppercase tracking-[0.12em] transition-all duration-300 select-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed',
    variant === 'primary'
      ? 'bg-gradient-to-br from-[#c8ff3d] to-[#a5ea10] text-[#060608] shadow-[0_8px_28px_rgba(200,255,61,0.28)] hover:shadow-[0_14px_38px_rgba(200,255,61,0.45)]'
      : 'border border-[var(--line)] bg-[var(--surface)]/80 text-[var(--page-text)] backdrop-blur-md hover:border-[var(--acid)] hover:text-[var(--acid)]',
    className
  );

  const innerContent = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] transition-transform duration-700 ease-out group-hover:translate-x-[130%]',
          variant === 'primary'
            ? 'bg-gradient-to-r from-transparent via-white/45 to-transparent'
            : 'bg-gradient-to-r from-transparent via-[var(--acid)]/20 to-transparent'
        )}
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
        className={baseClasses}
      >
        {innerContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      className={baseClasses}
    >
      {innerContent}
    </motion.button>
  );
}
