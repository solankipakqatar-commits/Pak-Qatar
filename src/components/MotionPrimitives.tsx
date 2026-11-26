import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

export const PQ_EASE = [0.16, 1, 0.3, 1] as const;

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
          transition={{ duration: 0.22, ease: PQ_EASE }}
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
  className?: string;
  children: React.ReactNode;
}

/**
 * Consistent subtle fade & lift transition when switching tabs, steps, or PQFTL/PQGTL sections.
 */
export const PqTabSwap: React.FC<PqTabSwapProps> = ({
  swapKey,
  className = '',
  children,
}) => {
  const prefersReduced = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={swapKey}
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: PQ_EASE }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
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
