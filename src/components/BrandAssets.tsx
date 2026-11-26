import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const OFFICIAL_PQ_LOGO_SRC = '/assets/aistudio/logos-02_d97bc6f0.png';

interface LogoProps {
  variant?: 'splash' | 'full' | 'medium' | 'compact';
  className?: string;
}

export const PakQatarLogo: React.FC<LogoProps> = ({ variant = 'full', className = '' }) => {
  const sizeClasses: Record<NonNullable<LogoProps['variant']>, string> = {
    splash: 'h-28 sm:h-32',
    full: 'h-16 sm:h-20',
    medium: 'h-12 sm:h-14',
    compact: 'h-9 sm:h-10',
  };

  const paddingClasses: Record<NonNullable<LogoProps['variant']>, string> = {
    splash: 'p-2',
    full: 'p-1.5',
    medium: 'p-1',
    compact: 'py-0.5 px-1',
  };

  return (
    <div
      className={`inline-flex items-center justify-center bg-white/0 select-none shrink-0 ${paddingClasses[variant]} ${className}`}
    >
      <img
        src={OFFICIAL_PQ_LOGO_SRC}
        alt="Pak-Qatar Family Takaful"
        referrerPolicy="no-referrer"
        className={`${sizeClasses[variant]} w-auto max-w-full object-contain block`}
      />
    </div>
  );
};

interface OrnamentProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

/**
 * Circular Islamic geometric 12-fold rosette motif used selectively for
 * initial splash launch, authentication loading, and financial transaction processing.
 */
export const IslamicOrnamentalMotif: React.FC<OrnamentProps> = ({
  size = 180,
  animate = true,
  className = '',
}) => {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  const innerPetals = Array.from({ length: 12 }, (_, i) => i * 30 + 15);

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      initial={animate ? { opacity: 0, scale: 0.92 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        animate={animate ? { rotate: 360 } : undefined}
        transition={
          animate
            ? {
                duration: 42,
                repeat: Infinity,
                ease: 'linear',
              }
            : undefined
        }
      >
        {/* Outer fine double ring */}
        <circle cx="120" cy="120" r="112" stroke="#A32035" strokeWidth="1.2" strokeOpacity="0.35" />
        <circle
          cx="120"
          cy="120"
          r="105"
          stroke="#F5B335"
          strokeWidth="1.2"
          strokeDasharray="3 5"
          strokeOpacity="0.85"
        />
        <circle cx="120" cy="120" r="96" stroke="#007A48" strokeWidth="0.9" strokeOpacity="0.3" />

        {/* 12-fold outer pointed Islamic arches */}
        {petals.map((angle) => (
          <g key={`outer-${angle}`} transform={`rotate(${angle} 120 120)`}>
            <path
              d="M120 18 C127 32, 134 45, 120 62 C106 45, 113 32, 120 18 Z"
              stroke="#A32035"
              strokeWidth="1.25"
              fill="#A32035"
              fillOpacity="0.04"
            />
            <circle cx="120" cy="28" r="2" fill="#F5B335" />
          </g>
        ))}

        {/* Interlocking 12-fold geometric lattice */}
        {innerPetals.map((angle) => (
          <g key={`inner-${angle}`} transform={`rotate(${angle} 120 120)`}>
            <path
              d="M120 38 L128 60 L120 82 L112 60 Z"
              stroke="#007A48"
              strokeWidth="1.1"
              strokeOpacity="0.65"
              fill="none"
            />
            <line
              x1="120"
              y1="26"
              x2="120"
              y2="40"
              stroke="#F5B335"
              strokeWidth="1.1"
              strokeOpacity="0.7"
            />
          </g>
        ))}

        {/* Inner rosette star */}
        <circle cx="120" cy="120" r="56" stroke="#A32035" strokeWidth="1.2" strokeOpacity="0.5" />
        <circle cx="120" cy="120" r="44" stroke="#F5B335" strokeWidth="1.1" strokeOpacity="0.7" />
        <path
          d="M120 76 L131 102 L159 102 L136 118 L145 145 L120 129 L95 145 L104 118 L81 102 L109 102 Z"
          stroke="#A32035"
          strokeWidth="1.15"
          strokeOpacity="0.45"
          fill="#007A48"
          fillOpacity="0.05"
        />
        <circle cx="120" cy="120" r="22" stroke="#007A48" strokeWidth="1.2" strokeOpacity="0.5" fill="#FFFFFF" />
      </motion.svg>
    </motion.div>
  );
};

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const t1 = window.setTimeout(() => setProgress(58), 450);
    const t2 = window.setTimeout(() => setProgress(94), 1150);
    const t3 = window.setTimeout(() => onComplete(), 1950);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-between px-6 py-10">
      <div className="text-xs font-medium text-[#5C6066] tracking-wide">
        Simple · Seamless · Secure · Shariah-Conscious
      </div>

      <div className="relative flex flex-col items-center justify-center my-auto text-center">
        <IslamicOrnamentalMotif size={156} animate />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-7 flex flex-col items-center"
        >
          <PakQatarLogo variant="splash" />
          <p className="mt-4 text-[15px] font-medium text-[#1E2022]">Your Takaful, Made Simple.</p>
        </motion.div>
      </div>

      <div className="w-full max-w-xs flex flex-col items-center gap-3">
        <div className="w-full h-1 bg-[#F4F4F5] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#A32035] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <button
          type="button"
          onClick={onComplete}
          className="min-h-[44px] px-4 text-xs font-medium text-[#5C6066] hover:text-[#A32035] transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

interface ProcessingOverlayProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({
  visible,
  title = 'Processing Your Request',
  subtitle = 'Verifying Shariah-compliant transaction details securely...',
}) => {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center px-6 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex items-center justify-center mb-6">
        <IslamicOrnamentalMotif size={156} animate />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-[#007A48]" />
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold text-[#1E2022]">{title}</h2>
      <p className="mt-1.5 text-sm text-[#5C6066] max-w-xs">{subtitle}</p>
    </div>
  );
};
