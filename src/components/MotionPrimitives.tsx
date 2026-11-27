import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, ChevronDown } from 'lucide-react';

export const PQ_EASE = [0.16, 1, 0.3, 1] as const;
export const PQ_SWEEP_EASE = [0.22, 1, 0.36, 1] as const;

export type TransitionDirection = 'forward' | 'back';

interface TransitionTriggerOptions {
  direction?: TransitionDirection;
  scrollToTop?: boolean;
}

interface ScreenTransitionContextValue {
  isTransitioning: boolean;
  direction: TransitionDirection;
  triggerTransition: (action: () => void, options?: TransitionTriggerOptions) => void;
}

const ScreenTransitionContext = createContext<ScreenTransitionContextValue>({
  isTransitioning: false,
  direction: 'forward',
  triggerTransition: (action) => action(),
});

export function useScreenTransition() {
  return useContext(ScreenTransitionContext);
}

interface SweepState {
  id: number;
  direction: TransitionDirection;
}

/**
 * Coordinates the Pak-Qatar Three-Line Sweep Transition (#A32035, #F5B335, #007A48)
 * across all screen, menu, product, and sub-view navigations while locking repeated taps.
 */
export const ScreenTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const prefersReduced = useReducedMotion();
  const [sweep, setSweep] = useState<SweepState | null>(null);
  const [direction, setDirection] = useState<TransitionDirection>('forward');

  const inFlightRef = useRef(false);
  const midTimerRef = useRef<number | null>(null);
  const endTimerRef = useRef<number | null>(null);
  const sweepIdRef = useRef(0);

  useEffect(() => {
    return () => {
      if (midTimerRef.current !== null) window.clearTimeout(midTimerRef.current);
      if (endTimerRef.current !== null) window.clearTimeout(endTimerRef.current);
    };
  }, []);

  const triggerTransition = useCallback(
    (action: () => void, options?: TransitionTriggerOptions) => {
      if (inFlightRef.current) return;
      const nextDir: TransitionDirection = options?.direction ?? 'forward';
      const shouldResetScroll = options?.scrollToTop !== false;

      setDirection(nextDir);

      if (prefersReduced) {
        inFlightRef.current = true;
        action();
        if (shouldResetScroll && typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'auto' });
        }
        endTimerRef.current = window.setTimeout(() => {
          inFlightRef.current = false;
          endTimerRef.current = null;
        }, 120);
        return;
      }

      inFlightRef.current = true;
      sweepIdRef.current += 1;
      const currentId = sweepIdRef.current;
      setSweep({ id: currentId, direction: nextDir });

      midTimerRef.current = window.setTimeout(() => {
        midTimerRef.current = null;
        action();
        if (shouldResetScroll && typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'auto' });
        }
      }, 175);

      endTimerRef.current = window.setTimeout(() => {
        endTimerRef.current = null;
        inFlightRef.current = false;
        setSweep((prev) => (prev?.id === currentId ? null : prev));
      }, 450);
    },
    [prefersReduced]
  );

  const isForward = (sweep?.direction ?? 'forward') === 'forward';
  const lineStartX = isForward ? '-105%' : '105%';
  const lineEndX = isForward ? '105%' : '-105%';

  const lines = [
    {
      id: 'burgundy',
      color: '#A32035',
      glow: 'rgba(163, 32, 53, 0.28)',
      delay: 0,
      widthClass: 'w-[78%] sm:w-[68%]',
    },
    {
      id: 'yellow',
      color: '#F5B335',
      glow: 'rgba(245, 179, 53, 0.34)',
      delay: 0.045,
      widthClass: 'w-[86%] sm:w-[74%]',
    },
    {
      id: 'green',
      color: '#007A48',
      glow: 'rgba(0, 122, 72, 0.28)',
      delay: 0.09,
      widthClass: 'w-[78%] sm:w-[68%]',
    },
  ];

  return (
    <ScreenTransitionContext.Provider
      value={{
        isTransitioning: Boolean(sweep),
        direction,
        triggerTransition,
      }}
    >
      {children}

      {/* Three-Line Side Sweep Overlay */}
      <AnimatePresence>
        {sweep && (
          <motion.div
            key={sweep.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14, ease: PQ_EASE }}
            aria-hidden="true"
            className="fixed inset-0 z-[60] pointer-events-auto flex flex-col items-center justify-center overflow-hidden select-none"
          >
            {/* Subtle soft neutral veil so screen swap is crisp without heavy flash */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.72, 0.72, 0] }}
              transition={{ duration: 0.43, times: [0, 0.35, 0.58, 1], ease: PQ_EASE }}
              className="absolute inset-0 bg-[#F7F5F2]/90 backdrop-blur-[2px]"
            />

            {/* Three Parallel Slim Brand Lines Sweeping Smoothly Across the Screen */}
            <div className="relative z-10 w-full flex flex-col items-center gap-[9px]">
              {lines.map((line) => (
                <div key={line.id} className="w-full flex justify-center overflow-hidden h-[5px] items-center">
                  <motion.div
                    initial={{ x: lineStartX, opacity: 0.35 }}
                    animate={{ x: lineEndX, opacity: [0.4, 1, 1, 0.35] }}
                    transition={{
                      duration: 0.36,
                      delay: line.delay,
                      ease: PQ_SWEEP_EASE,
                    }}
                    className={`${line.widthClass} h-[3px] rounded-full will-change-transform`}
                    style={{
                      background: isForward
                        ? `linear-gradient(90deg, transparent 0%, ${line.color} 18%, ${line.color} 84%, transparent 100%)`
                        : `linear-gradient(270deg, transparent 0%, ${line.color} 18%, ${line.color} 84%, transparent 100%)`,
                      boxShadow: `0 0 10px ${line.glow}`,
                    }}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenTransitionContext.Provider>
  );
};

interface PqDirectionalSwapProps {
  swapKey: string;
  direction?: TransitionDirection;
  className?: string;
  children: React.ReactNode;
}

/**
 * Mobile-grade side-to-side screen transition with gentle scale and opacity reveal.
 */
export const PqDirectionalSwap: React.FC<PqDirectionalSwapProps> = ({
  swapKey,
  direction = 'forward',
  className = '',
  children,
}) => {
  const prefersReduced = useReducedMotion();
  const enterX = direction === 'forward' ? 24 : -24;
  const exitX = direction === 'forward' ? -18 : 18;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={swapKey}
        initial={
          prefersReduced ? { opacity: 0 } : { opacity: 0, x: enterX, scale: 0.99 }
        }
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={
          prefersReduced ? { opacity: 0 } : { opacity: 0, x: exitX, scale: 0.992 }
        }
        transition={{ duration: prefersReduced ? 0.14 : 0.28, ease: PQ_EASE }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

interface PqModalProps {
  open: boolean;
  onClose?: () => void;
  variant?: 'dialog' | 'sheet';
  ariaLabel?: string;
  children: React.ReactNode;
}

/**
 * Shared smooth backdrop + dialog/sheet modal transition used consistently across the app.
 */
export const PqModal: React.FC<PqModalProps> = ({
  open,
  onClose,
  variant = 'dialog',
  ariaLabel,
  children,
}) => {
  const prefersReduced = useReducedMotion();

  const cardInitial = prefersReduced
    ? { opacity: 0 }
    : variant === 'sheet'
      ? { opacity: 0, y: 28, scale: 0.99 }
      : { opacity: 0, y: 12, scale: 0.96 };

  const cardExit = prefersReduced
    ? { opacity: 0 }
    : variant === 'sheet'
      ? { opacity: 0, y: 20, scale: 0.99 }
      : { opacity: 0, y: 8, scale: 0.97 };

  return (
    <AnimatePresence>
      {open && (
        <div
          className={`fixed inset-0 z-50 flex justify-center ${
            variant === 'sheet'
              ? 'items-end sm:items-center p-0 sm:p-4'
              : 'items-center p-4'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: PQ_EASE }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            aria-hidden="true"
          />
          <motion.div
            initial={cardInitial}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={cardExit}
            transition={{ duration: 0.24, ease: PQ_EASE }}
            className="relative z-10 w-full flex justify-center pointer-events-none"
          >
            <div className="pointer-events-auto w-full flex justify-center">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface PqDrawerProps {
  open: boolean;
  onClose: () => void;
  ariaLabel?: string;
  children: React.ReactNode;
}

/**
 * Smooth slide-in side drawer with backdrop fade for mobile navigation menus.
 */
export const PqDrawer: React.FC<PqDrawerProps> = ({
  open,
  onClose,
  ariaLabel,
  children,
}) => {
  const prefersReduced = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: PQ_EASE }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            aria-hidden="true"
          />
          <motion.div
            initial={prefersReduced ? { opacity: 0 } : { x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: 0.26, ease: PQ_EASE }}
            className="relative z-10 h-full"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface PqAccordionPanelProps {
  open: boolean;
  children: React.ReactNode;
}

/**
 * Smooth height & opacity transition for FAQs and collapsible content blocks.
 */
export const PqAccordionPanel: React.FC<PqAccordionPanelProps> = ({ open, children }) => {
  const prefersReduced = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.24, ease: PQ_EASE }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface PqTabSwapProps {
  swapKey: string;
  direction?: TransitionDirection;
  className?: string;
  children: React.ReactNode;
}

/**
 * Consistent layered fade, subtle slide, and gentle scale transition when switching tabs, steps, or PQFTL sections.
 */
export const PqTabSwap: React.FC<PqTabSwapProps> = ({
  swapKey,
  direction = 'forward',
  className = '',
  children,
}) => {
  const prefersReduced = useReducedMotion();
  const offset = direction === 'forward' ? 12 : -12;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={swapKey}
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: offset, y: 4, scale: 0.992 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -offset * 0.7, y: -3, scale: 0.994 }}
        transition={{ duration: prefersReduced ? 0.14 : 0.24, ease: PQ_EASE }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export interface PqSelectOption {
  value: string;
  label: string;
  subLabel?: string;
}

interface PqSelectProps {
  id?: string;
  ariaLabel?: string;
  value: string;
  onChange: (value: string) => void;
  options: PqSelectOption[];
  className?: string;
  buttonClassName?: string;
}

/**
 * Animated accessible dropdown selector replacing raw native selects for polished open/close motion.
 */
export const PqSelect: React.FC<PqSelectProps> = ({
  id,
  ariaLabel,
  value,
  onChange,
  options,
  className = '',
  buttonClassName = '',
}) => {
  const [open, setOpen] = useState(false);
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find((opt) => opt.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        id={id}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl border text-left flex items-center justify-between gap-2 transition-colors ${
          open
            ? 'border-[#A32035] bg-white ring-2 ring-[#A32035]/10'
            : 'border-[#E5E7EB] bg-white hover:border-[#A32035]/60'
        } ${buttonClassName}`}
      >
        <span className="truncate text-xs sm:text-sm font-medium text-[#1E2022]">
          {selectedOption?.label ?? ''}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#5C6066] shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180 text-[#A32035]' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label={ariaLabel}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: PQ_EASE }}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 rounded-2xl border border-[#E5E7EB] bg-white shadow-xl py-1.5 max-h-60 overflow-y-auto"
          >
            {options.map((opt) => {
              const selected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full min-h-[40px] px-3.5 py-2 text-left text-xs sm:text-sm flex items-center justify-between gap-2 transition-colors ${
                    selected
                      ? 'bg-[#EAF3EE] text-[#007A48] font-semibold'
                      : 'text-[#1E2022] hover:bg-[#F7F5F2]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="truncate">{opt.label}</div>
                    {opt.subLabel && (
                      <div className="text-[11px] text-[#5C6066] truncate">{opt.subLabel}</div>
                    )}
                  </div>
                  {selected && <Check className="w-4 h-4 text-[#007A48] shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const PqStaggerGroup: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = '', children }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.045,
        },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const PqStaggerItem: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = '', children }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 8 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.26, ease: PQ_EASE },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);
