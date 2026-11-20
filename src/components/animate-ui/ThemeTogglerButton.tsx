'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeTogglerButtonProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
  className?: string;
}

export function ThemeTogglerButton({ theme, onToggle, className }: ThemeTogglerButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ y: -1.5, scale: 1.04 }}
      whileTap={{ scale: 0.92 }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={cn(
        'relative grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] bg-transparent text-[var(--page-text)] transition-colors hover:border-[var(--acid)] hover:bg-[var(--acid)] hover:text-[#060608] cursor-pointer',
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <Moon className="h-4 w-4" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <Sun className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
