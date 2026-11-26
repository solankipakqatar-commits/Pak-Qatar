import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

export const OFFICIAL_PQ_LOGO_SRC = '/assets/aistudio/logos-02_d97bc6f0.png';
export const OFFICIAL_PQ_ORNAMENT_SRC = '/assets/aistudio/elements-04-03_3fbb8977.png';
export const OFFICIAL_PQ_ANIMATED_LOGO_SRC = '/assets/aistudio/logos-02_2e65b69a.png';
export const OFFICIAL_PQ_LOADING_VIDEO_SRC =
  '/assets/aistudio/3584df8a11f018e3c47a430562f42bde_3fabeec8.mp4';

let cachedVideoObjectUrl: string | null = null;
let videoPreloadPromise: Promise<string | null> | null = null;

function verifyVideoDecodable(src: string): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();
  return new Promise((resolve) => {
    const probe = document.createElement('video');
    probe.muted = true;
    probe.playsInline = true;
    probe.preload = 'auto';

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      probe.removeAttribute('src');
      probe.load();
      resolve();
    };

    const timeoutId = window.setTimeout(finish, 3000);
    const done = () => {
      window.clearTimeout(timeoutId);
      finish();
    };

    probe.onloadeddata = done;
    probe.oncanplay = done;
    probe.onerror = done;
    probe.src = src;
    probe.load();
  });
}

function preloadLoadingVideo(): Promise<string | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (cachedVideoObjectUrl) return Promise.resolve(cachedVideoObjectUrl);
  if (videoPreloadPromise) return videoPreloadPromise;

  videoPreloadPromise = fetch(OFFICIAL_PQ_LOADING_VIDEO_SRC)
    .then((res) => (res.ok ? res.blob() : null))
    .then(async (blob) => {
      if (!blob) {
        videoPreloadPromise = null;
        return null;
      }
      const objectUrl = URL.createObjectURL(blob);
      await verifyVideoDecodable(objectUrl);
      cachedVideoObjectUrl = objectUrl;
      return cachedVideoObjectUrl;
    })
    .catch(() => {
      videoPreloadPromise = null;
      return null;
    });

  return videoPreloadPromise;
}

interface SeparatedLogoLayers {
  ringUrl: string;
  centerUrl: string;
  greenWaveUrl: string;
  burgundyWaveUrl: string;
}

const CIRCLE_SX = 78;
const CIRCLE_SY = 26;
const CIRCLE_SIZE = 341;
const CIRCLE_CENTER_X = 248.5 - CIRCLE_SX; // 170.5 inside 341x341 crop
const CIRCLE_CENTER_Y = 196 - CIRCLE_SY; // 170 inside 341x341 crop
const CENTER_RING_SPLIT_RADIUS = 102; // Empty radial gap exists at r = 101..103
const CIRCLE_MAX_ORIG_Y = 363; // Empty horizontal gap exists at y = 363..366

const WAVE_SX = 48;
const WAVE_SY = 360;
const WAVE_WIDTH = 401;
const WAVE_HEIGHT = 48;
const WAVE_MIN_ORIG_Y = 364;

let cachedLogoLayers: SeparatedLogoLayers | null = null;
let logoLayersPromise: Promise<SeparatedLogoLayers | null> | null = null;

function createCanvasFromImageData(
  width: number,
  height: number,
  data: Uint8ClampedArray
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const imgData = ctx.createImageData(width, height);
  imgData.data.set(data);
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}

export function getSeparatedLogoLayers(): Promise<SeparatedLogoLayers | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (cachedLogoLayers) return Promise.resolve(cachedLogoLayers);
  if (logoLayersPromise) return logoLayersPromise;

  logoLayersPromise = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const srcCanvas = document.createElement('canvas');
        srcCanvas.width = img.naturalWidth || 482;
        srcCanvas.height = img.naturalHeight || 423;
        const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true });
        if (!srcCtx) {
          logoLayersPromise = null;
          resolve(null);
          return;
        }
        srcCtx.drawImage(img, 0, 0);

        // 1. Extract 341x341 centered circle & separate fixed Pak-Qatar center from outer spinning ring
        const circlePixels = srcCtx.getImageData(
          CIRCLE_SX,
          CIRCLE_SY,
          CIRCLE_SIZE,
          CIRCLE_SIZE
        ).data;
        const ringData = new Uint8ClampedArray(circlePixels.length);
        const centerData = new Uint8ClampedArray(circlePixels.length);

        for (let py = 0; py < CIRCLE_SIZE; py++) {
          const origY = CIRCLE_SY + py;
          if (origY > CIRCLE_MAX_ORIG_Y) continue;
          const dy = py - CIRCLE_CENTER_Y;

          for (let px = 0; px < CIRCLE_SIZE; px++) {
            const idx = (py * CIRCLE_SIZE + px) * 4;
            const alpha = circlePixels[idx + 3];
            if (alpha === 0) continue;

            const dx = px - CIRCLE_CENTER_X;
            const dist = Math.hypot(dx, dy);
            const target = dist < CENTER_RING_SPLIT_RADIUS ? centerData : ringData;
            target[idx] = circlePixels[idx];
            target[idx + 1] = circlePixels[idx + 1];
            target[idx + 2] = circlePixels[idx + 2];
            target[idx + 3] = alpha;
          }
        }

        // 2. Extract 401x48 bottom ribbons & separate green vs burgundy waving shapes
        const wavePixels = srcCtx.getImageData(
          WAVE_SX,
          WAVE_SY,
          WAVE_WIDTH,
          WAVE_HEIGHT
        ).data;
        const greenWaveData = new Uint8ClampedArray(wavePixels.length);
        const burgundyWaveData = new Uint8ClampedArray(wavePixels.length);

        for (let py = 0; py < WAVE_HEIGHT; py++) {
          const origY = WAVE_SY + py;
          if (origY < WAVE_MIN_ORIG_Y) continue;

          for (let px = 0; px < WAVE_WIDTH; px++) {
            const idx = (py * WAVE_WIDTH + px) * 4;
            const alpha = wavePixels[idx + 3];
            if (alpha === 0) continue;

            const r = wavePixels[idx];
            const g = wavePixels[idx + 1];
            const target = g >= r ? greenWaveData : burgundyWaveData;
            target[idx] = r;
            target[idx + 1] = g;
            target[idx + 2] = wavePixels[idx + 2];
            target[idx + 3] = alpha;
          }
        }

        const result: SeparatedLogoLayers = {
          ringUrl: createCanvasFromImageData(CIRCLE_SIZE, CIRCLE_SIZE, ringData),
          centerUrl: createCanvasFromImageData(CIRCLE_SIZE, CIRCLE_SIZE, centerData),
          greenWaveUrl: createCanvasFromImageData(WAVE_WIDTH, WAVE_HEIGHT, greenWaveData),
          burgundyWaveUrl: createCanvasFromImageData(WAVE_WIDTH, WAVE_HEIGHT, burgundyWaveData),
        };

        if (
          result.ringUrl &&
          result.centerUrl &&
          result.greenWaveUrl &&
          result.burgundyWaveUrl
        ) {
          cachedLogoLayers = result;
          resolve(result);
        } else {
          logoLayersPromise = null;
          resolve(null);
        }
      } catch {
        logoLayersPromise = null;
        resolve(null);
      }
    };
    img.onerror = () => {
      logoLayersPromise = null;
      resolve(null);
    };
    img.src = OFFICIAL_PQ_ANIMATED_LOGO_SRC;
  });

  return logoLayersPromise;
}

export async function ensureLoadingAssetsReady(): Promise<void> {
  await Promise.all([preloadLoadingVideo(), getSeparatedLogoLayers()]);
}

if (typeof window !== 'undefined') {
  void ensureLoadingAssetsReady();
}

interface LoadingVideoBackgroundProps {
  onVideoReady?: () => void;
}

/**
 * Full-screen object-cover video background shared across all loading screens.
 * Pre-cached in memory so every 2-second transition plays immediately with zero white background.
 */
const LoadingVideoBackground: React.FC<LoadingVideoBackgroundProps> = ({ onVideoReady }) => {
  const [videoSrc] = useState<string>(
    () => cachedVideoObjectUrl ?? OFFICIAL_PQ_LOADING_VIDEO_SRC
  );
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readyNotifiedRef = useRef(false);

  const notifyReadyAndPlay = (el: HTMLVideoElement | null) => {
    if (!el) return;
    if (!readyNotifiedRef.current && el.readyState >= 2) {
      readyNotifiedRef.current = true;
      onVideoReady?.();
    }
    try {
      const playPromise = el.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    } catch {
      // ignore autoplay restriction edge cases
    }
  };

  useEffect(() => {
    if (!cachedVideoObjectUrl) {
      void preloadLoadingVideo();
    }
    const el = videoRef.current;
    if (el) {
      try {
        el.currentTime = 0;
      } catch {
        // ignore if metadata not yet loaded
      }
      notifyReadyAndPlay(el);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#0C1713] pointer-events-none select-none"
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => notifyReadyAndPlay(videoRef.current)}
        onCanPlay={() => notifyReadyAndPlay(videoRef.current)}
        onPlaying={() => notifyReadyAndPlay(videoRef.current)}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
};

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
      className={`inline-flex items-center justify-center bg-transparent select-none shrink-0 ${paddingClasses[variant]} ${className}`}
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
 * Official Pak-Qatar loading emblem using the exact supplied logos-02_2e65b69a.png asset:
 * - Transparent backdrop so the loading video shows directly behind both logo & spinning ring
 * - Official green calligraphy center logo stays fixed and clearly visible
 * - Surrounding circular ornamental ring spins smoothly around it
 * - Burgundy (#A32035) and green (#007A48) shapes below wave gently
 */
export const IslamicOrnamentalMotif: React.FC<OrnamentProps> = ({
  size = 180,
  animate = true,
  className = '',
}) => {
  const [layers, setLayers] = useState<SeparatedLogoLayers | null>(() => cachedLogoLayers);
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animate && !prefersReducedMotion;

  useEffect(() => {
    let active = true;
    if (!layers) {
      void getSeparatedLogoLayers().then((res) => {
        if (active && res) setLayers(res);
      });
    }
    return () => {
      active = false;
    };
  }, [layers]);

  const waveWidth = Math.round(size * (WAVE_WIDTH / CIRCLE_SIZE));
  const waveHeight = Math.round(size * (WAVE_HEIGHT / CIRCLE_SIZE));
  const emblemStrokeContrastStyle: React.CSSProperties = {
    filter:
      'drop-shadow(0 0 1.5px rgba(255,255,255,0.92)) drop-shadow(0 2px 10px rgba(0,0,0,0.65))',
  };

  if (!layers) {
    return (
      <div
        className={`relative inline-flex items-center justify-center bg-transparent select-none ${className}`}
        style={{ width: Math.round(size * (482 / CIRCLE_SIZE)), minHeight: size }}
      >
        <img
          src={OFFICIAL_PQ_ANIMATED_LOGO_SRC}
          alt="Pak-Qatar Family Takaful"
          referrerPolicy="no-referrer"
          style={emblemStrokeContrastStyle}
          className="w-full h-auto object-contain block"
        />
      </div>
    );
  }

  return (
    <motion.div
      className={`relative inline-flex flex-col items-center justify-center bg-transparent select-none ${className}`}
      initial={shouldAnimate ? { opacity: 0, scale: 0.96 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Circular ornamental ring rotating around fixed center logo */}
      <div
        className="relative shrink-0 bg-transparent"
        style={{ width: size, height: size }}
      >
        <motion.img
          src={layers.ringUrl}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          animate={shouldAnimate ? { rotate: 360 } : undefined}
          transition={
            shouldAnimate
              ? {
                  duration: 9,
                  repeat: Infinity,
                  ease: 'linear',
                }
              : undefined
          }
          style={emblemStrokeContrastStyle}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none origin-center will-change-transform"
        />

        <img
          src={layers.centerUrl}
          alt="Pak-Qatar Family Takaful"
          referrerPolicy="no-referrer"
          style={emblemStrokeContrastStyle}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      </div>

      {/* Waving burgundy (#A32035) and green (#007A48) curved ribbons underneath */}
      <div
        className="relative shrink-0 -mt-[2px] overflow-visible bg-transparent"
        style={{ width: waveWidth, height: waveHeight }}
        aria-hidden="true"
      >
        <img
          src={layers.burgundyWaveUrl}
          alt=""
          referrerPolicy="no-referrer"
          style={emblemStrokeContrastStyle}
          className={`absolute inset-0 w-full h-full object-contain pointer-events-none ${
            shouldAnimate ? 'pq-ribbon-wave-burgundy' : ''
          }`}
        />
        <img
          src={layers.greenWaveUrl}
          alt=""
          referrerPolicy="no-referrer"
          style={emblemStrokeContrastStyle}
          className={`absolute inset-0 w-full h-full object-contain pointer-events-none ${
            shouldAnimate ? 'pq-ribbon-wave-green' : ''
          }`}
        />
      </div>
    </motion.div>
  );
};

interface NavigationLoadingOverlayProps {
  visible: boolean;
}

/**
 * Unified 2-second loading transition shown consistently across all screen-to-screen navigations.
 */
export const NavigationLoadingOverlay: React.FC<NavigationLoadingOverlayProps> = ({ visible }) => {
  useEffect(() => {
    void ensureLoadingAssetsReady();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="pqfs-nav-loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-[#0C1713] flex flex-col items-center justify-center px-6 text-center overflow-hidden"
          role="status"
          aria-live="polite"
          aria-label="Loading screen"
        >
          <LoadingVideoBackground />
          <div className="relative z-10 flex items-center justify-center bg-transparent">
            <IslamicOrnamentalMotif size={184} animate className="relative z-10" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(12);
  const [assetsReady, setAssetsReady] = useState(() => Boolean(cachedVideoObjectUrl));
  const [videoDecoded, setVideoDecoded] = useState(false);

  useEffect(() => {
    let active = true;
    void ensureLoadingAssetsReady().then(() => {
      if (active) setAssetsReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!assetsReady || !videoDecoded) return;

    const t1 = window.setTimeout(() => setProgress(58), 450);
    const t2 = window.setTimeout(() => setProgress(94), 1200);
    const t3 = window.setTimeout(() => onComplete(), 2000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [assetsReady, videoDecoded, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0C1713] flex flex-col items-center justify-between px-6 py-10 overflow-hidden">
      {assetsReady && <LoadingVideoBackground onVideoReady={() => setVideoDecoded(true)} />}

      {assetsReady && videoDecoded && (
        <>
          <div className="relative z-10 text-xs font-medium text-white/95 tracking-wide drop-shadow-xs">
            Simple · Seamless · Secure · Shariah-Conscious
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center bg-transparent">
            <IslamicOrnamentalMotif size={192} animate className="relative z-10" />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="mt-8 px-5 py-2.5 rounded-2xl bg-[#0C1713]/55 backdrop-blur-xs border border-white/15 flex flex-col items-center"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#F5B335]">
                Pak-Qatar Family Takaful
              </p>
              <p className="mt-1 text-[15px] font-medium text-white">Your Takaful, Made Simple.</p>
            </motion.div>
          </div>

          <div className="relative z-10 w-full max-w-xs flex flex-col items-center gap-3">
            <div className="w-full h-1 bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F5B335] transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <button
              type="button"
              onClick={onComplete}
              className="min-h-[44px] px-4 text-xs font-medium text-white/95 hover:text-[#F5B335] transition-colors"
            >
              Continue
            </button>
          </div>
        </>
      )}
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
      className="fixed inset-0 z-50 bg-[#0C1713] flex flex-col items-center justify-center px-6 text-center overflow-hidden"
      role="status"
      aria-live="polite"
    >
      <LoadingVideoBackground />

      <div className="relative z-10 flex items-center justify-center mb-8 bg-transparent">
        <IslamicOrnamentalMotif size={172} animate className="relative z-10" />
      </div>

      <div className="relative z-10 px-5 py-3 rounded-2xl bg-[#0C1713]/55 backdrop-blur-xs border border-white/15 max-w-xs">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-white/90">{subtitle}</p>
      </div>
    </div>
  );
};
