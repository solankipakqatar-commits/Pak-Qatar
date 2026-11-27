import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  HeartPulse,
  Landmark,
  ShieldCheck,
} from 'lucide-react';
import { FamilyProductCategory, TakafulProduct } from '../types/pqfs';
import { TAKAFUL_PRODUCTS } from '../data/pqfsData';
import {
  PQ_CATEGORY_ENTER_S,
  PQ_CATEGORY_EXIT_EASE,
  PQ_CATEGORY_EXIT_S,
  PQ_EASE,
} from './MotionPrimitives';

const REFERENCE_MAN_SRC = '/assets/aistudio/Always_Remember_Your_Afterlife__9a147a72.jpg';

const CATEGORY_ORDER: Record<FamilyProductCategory, number> = {
  all: 0,
  'savings-retirement': 1,
  'health-group': 2,
};

let cachedProcessedManUrl: string | null = null;

const SHORT_RING_LABELS: Record<string, string> = {
  'ft-family-savings': 'FAMILY SAVINGS',
  'ft-child-education': 'CHILD EDUCATION',
  'ft-mahana-bachat': 'MAHANA BACHAT',
  'ft-retirement-wealth': 'RETIREMENT PLAN',
  'ft-lifetime-kafalat': 'KAFALAT PLAN',
  'ft-vps-pension': 'VPS PENSION',
  'ft-health-elaaj': 'ELAAJ HEALTH',
  'ft-group-family': 'GROUP FAMILY',
  'ft-group-health': 'GROUP HEALTH',
};

export function ProductIcon({
  iconKey,
  className = 'w-5 h-5',
}: {
  iconKey: TakafulProduct['iconKey'];
  className?: string;
}) {
  switch (iconKey) {
    case 'shield':
      return <ShieldCheck className={className} />;
    case 'graduation':
      return <GraduationCap className={className} />;
    case 'landmark':
      return <Landmark className={className} />;
    case 'heart':
      return <HeartPulse className={className} />;
    case 'briefcase':
      return <Briefcase className={className} />;
    case 'building':
      return <Building2 className={className} />;
  }
}

/**
 * Extracts the exact overhead photograph of the man in white clothing looking at his phone
 * from the reference image and maps only the orange/red dial backdrop onto Pak-Qatar Green (#007A48),
 * preserving his pose, white shirt, dark trousers, hair, shoes, and cast shadow.
 */
const CentralManFigure: React.FC = () => {
  const [processedUrl, setProcessedUrl] = useState<string | null>(() => cachedProcessedManUrl);

  useEffect(() => {
    if (cachedProcessedManUrl) return;
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = REFERENCE_MAN_SRC;

    img.onload = () => {
      if (cancelled) return;
      const size = 240;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const sx = img.width * 0.305;
      const sy = img.height * 0.305;
      const sSize = img.width * 0.39;
      ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size);
      const d = imageData.data;
      const half = size / 2;

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const i = (y * size + x) * 4;
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];

          const dx = (x - half) / half;
          const dy = (y - half) / half;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const edgeAlpha = dist >= 0.96 ? 0 : dist <= 0.68 ? 1 : 1 - (dist - 0.68) / 0.28;

          const rMinusB = r - b;
          const rMinusG = r - g;
          const orangeStrength =
            Math.max(0, Math.min(1, (rMinusB - 48) / 42)) *
            Math.max(0, Math.min(1, (rMinusG - 28) / 34));

          if (orangeStrength > 0.02) {
            const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            const shade = Math.max(0.54, Math.min(1.04, lum / 0.52));
            const targetR = 0;
            const targetG = Math.round(122 * shade);
            const targetB = Math.round(72 * shade);

            d[i] = Math.round(r * (1 - orangeStrength) + targetR * orangeStrength);
            d[i + 1] = Math.round(g * (1 - orangeStrength) + targetG * orangeStrength);
            d[i + 2] = Math.round(b * (1 - orangeStrength) + targetB * orangeStrength);
          }

          d[i + 3] = Math.round(255 * edgeAlpha);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const url = canvas.toDataURL('image/png');
      cachedProcessedManUrl = url;
      setProcessedUrl(url);
    };

    return () => {
      cancelled = true;
    };
  }, []);

  if (!processedUrl) {
    return (
      <div className="w-[47%] aspect-square max-w-[122px] max-h-[122px] rounded-full bg-[#007A48] shrink-0" />
    );
  }

  return (
    <img
      src={processedUrl}
      alt="Participant in white clothing viewed from above looking at mobile phone"
      className="w-[47%] aspect-square max-w-[122px] max-h-[122px] rounded-full object-contain pointer-events-none select-none shrink-0"
    />
  );
};

interface DialRingLayerProps {
  categoryKey: FamilyProductCategory;
  categoryDirection: 1 | -1;
  products: TakafulProduct[];
  selectedIndex: number;
  rotationDeg: number;
  activeAccentHex: string;
  prefersReducedMotion: boolean;
  onSegmentClick: (e: React.MouseEvent, product: TakafulProduct, index: number) => void;
}

const normalizeAngle = (deg: number) => ((deg % 360) + 360) % 360;

/**
 * Snapshot ring layer receiving its category's own products, angles, and selection state so
 * outgoing category rings preserve exact geometry while folding cleanly out before the next enters.
 */
const DialRingLayer: React.FC<DialRingLayerProps> = memo(
  ({
    categoryKey,
    categoryDirection,
    products,
    selectedIndex,
    rotationDeg,
    activeAccentHex,
    prefersReducedMotion,
    onSegmentClick,
  }) => {
    const stepAngle = 360 / products.length;

    const buildLabelArcPath = (index: number) => {
      const centerDeg = index * stepAngle;
      const spanDeg = Math.min(62, Math.max(36, stepAngle * 0.9));
      const isBottomHalf = (() => {
        const normalized = normalizeAngle(centerDeg + rotationDeg);
        return normalized > 96 && normalized < 264;
      })();
      const radius = isBottomHalf ? 155 : 146;

      const startAngle = isBottomHalf ? centerDeg + spanDeg / 2 : centerDeg - spanDeg / 2;
      const endAngle = isBottomHalf ? centerDeg - spanDeg / 2 : centerDeg + spanDeg / 2;
      const sweepFlag = isBottomHalf ? 0 : 1;

      const toXY = (deg: number) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        return {
          x: 190 + radius * Math.cos(rad),
          y: 190 + radius * Math.sin(rad),
        };
      };

      const p1 = toXY(startAngle);
      const p2 = toXY(endAngle);
      return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${radius} ${radius} 0 0 ${sweepFlag} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    };

    const buildSegmentWedgePath = (index: number) => {
      const centerDeg = index * stepAngle;
      const startDeg = centerDeg - stepAngle / 2;
      const endDeg = centerDeg + stepAngle / 2;
      const rInner = 116.5;
      const rOuter = 180.7;
      const largeArc = endDeg - startDeg > 180 ? 1 : 0;

      const toXY = (deg: number, radius: number) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        return {
          x: 190 + radius * Math.cos(rad),
          y: 190 + radius * Math.sin(rad),
        };
      };

      const oStart = toXY(startDeg, rOuter);
      const oEnd = toXY(endDeg, rOuter);
      const iEnd = toXY(endDeg, rInner);
      const iStart = toXY(startDeg, rInner);

      return [
        `M ${oStart.x.toFixed(2)} ${oStart.y.toFixed(2)}`,
        `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${oEnd.x.toFixed(2)} ${oEnd.y.toFixed(2)}`,
        `L ${iEnd.x.toFixed(2)} ${iEnd.y.toFixed(2)}`,
        `A ${rInner} ${rInner} 0 ${largeArc} 0 ${iStart.x.toFixed(2)} ${iStart.y.toFixed(2)}`,
        'Z',
      ].join(' ');
    };

    return (
      <motion.div
        custom={{ reduced: prefersReducedMotion, dir: categoryDirection }}
        variants={{
          enter: ({ reduced, dir }: { reduced: boolean; dir: 1 | -1 }) =>
            reduced ? { opacity: 0 } : { opacity: 0, scale: 0.935, rotate: dir * 9 },
          center: ({ reduced }: { reduced: boolean; dir: 1 | -1 }) => ({
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: {
              duration: reduced ? 0.12 : PQ_CATEGORY_ENTER_S,
              ease: PQ_EASE,
            },
          }),
          exit: ({ reduced, dir }: { reduced: boolean; dir: 1 | -1 }) =>
            reduced
              ? { opacity: 0, transition: { duration: 0.08 } }
              : {
                  opacity: 0,
                  scale: 0.955,
                  rotate: -dir * 7,
                  transition: {
                    duration: PQ_CATEGORY_EXIT_S,
                    ease: PQ_CATEGORY_EXIT_EASE,
                  },
                },
        }}
        initial="enter"
        animate="center"
        exit="exit"
        className="absolute inset-0 rounded-full will-change-transform"
      >
        <div
          className="absolute inset-0 rounded-full will-change-transform"
          style={{
            transform: `rotate(${rotationDeg}deg)`,
          }}
        >
          <svg viewBox="0 0 380 380" className="w-full h-full">
            <defs>
              {products.map((product, index) => (
                <path
                  key={`arc-${product.id}`}
                  id={`dial-arc-${categoryKey}-${product.id}`}
                  d={buildLabelArcPath(index)}
                />
              ))}
            </defs>

            {/* Inactive Dark Emerald Segments */}
            {products.map((product, index) => {
              if (index === selectedIndex) return null;
              return (
                <path
                  key={`wedge-inactive-${product.id}`}
                  d={buildSegmentWedgePath(index)}
                  fill="#00462A"
                  className="cursor-pointer hover:fill-[#005835]"
                  style={{
                    transition: 'fill 260ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onClick={(e) => onSegmentClick(e, product, index)}
                />
              );
            })}

            {/* Active Burgundy Highlight Wedge */}
            {products.map((product, index) => {
              if (index !== selectedIndex) return null;
              return (
                <path
                  key={`wedge-active-${product.id}`}
                  d={buildSegmentWedgePath(index)}
                  fill={activeAccentHex}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeOpacity="0.78"
                  className="cursor-pointer"
                  style={{
                    transition:
                      'fill 260ms cubic-bezier(0.16, 1, 0.3, 1), stroke-opacity 260ms ease',
                  }}
                  onClick={(e) => onSegmentClick(e, product, index)}
                />
              );
            })}

            {/* Gold Segment Dividers */}
            {products.map((product, index) => {
              const divAngleDeg = index * stepAngle + stepAngle / 2;
              const rad = ((divAngleDeg - 90) * Math.PI) / 180;
              const r1 = 136;
              const r2 = 158;
              return (
                <line
                  key={`div-${product.id}`}
                  x1={190 + r1 * Math.cos(rad)}
                  y1={190 + r1 * Math.sin(rad)}
                  x2={190 + r2 * Math.cos(rad)}
                  y2={190 + r2 * Math.sin(rad)}
                  stroke="#F5B335"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeOpacity="0.92"
                  className="pointer-events-none"
                />
              );
            })}

            {/* Curved Gill Sans Plan Labels + Gold Active Marker */}
            {products.map((product, index) => {
              const isActive = index === selectedIndex;
              const arcDeg = index * stepAngle;
              const rDot = 169;
              const rad = ((arcDeg - 90) * Math.PI) / 180;
              const labelText = SHORT_RING_LABELS[product.id] ?? product.name.toUpperCase();
              const compactLabels = products.length > 6;

              return (
                <g
                  key={product.id}
                  role="option"
                  aria-selected={isActive}
                  className="cursor-pointer"
                  onClick={(e) => onSegmentClick(e, product, index)}
                >
                  <circle
                    cx={190 + 148 * Math.cos(rad)}
                    cy={190 + 148 * Math.sin(rad)}
                    r={compactLabels ? '30' : '36'}
                    fill="transparent"
                  />
                  {isActive && (
                    <circle
                      cx={190 + rDot * Math.cos(rad)}
                      cy={190 + rDot * Math.sin(rad)}
                      r="3.6"
                      fill="#F5B335"
                    />
                  )}
                  <text
                    fill="#FFFFFF"
                    fillOpacity={isActive ? 1 : 0.84}
                    fontSize={
                      compactLabels
                        ? isActive
                          ? '8.9'
                          : '8.1'
                        : isActive
                          ? '11.8'
                          : '10.8'
                    }
                    fontWeight={isActive ? '700' : '600'}
                    letterSpacing={compactLabels ? '0.03em' : '0.05em'}
                    style={{
                      fontFamily:
                        '"Gill Sans", "Gill Sans MT", "Cabin", -apple-system, BlinkMacSystemFont, sans-serif',
                    }}
                  >
                    <textPath
                      href={`#dial-arc-${categoryKey}-${product.id}`}
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      {labelText}
                    </textPath>
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </motion.div>
    );
  }
);
DialRingLayer.displayName = 'DialRingLayer';

interface TakafulWheelProps {
  category?: FamilyProductCategory;
  onCategoryChange?: (category: FamilyProductCategory) => void;
  onSelectProduct: (product: TakafulProduct) => void;
}

export const TakafulWheel: React.FC<TakafulWheelProps> = ({
  category,
  onCategoryChange,
  onSelectProduct,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [internalCategory, setInternalCategory] = useState<FamilyProductCategory>('all');
  const activeCategory = category ?? internalCategory;
  const handleCategorySelect = (nextCat: FamilyProductCategory) => {
    if (onCategoryChange) onCategoryChange(nextCat);
    else setInternalCategory(nextCat);
  };

  const products = useMemo(() => {
    if (activeCategory === 'all') return TAKAFUL_PRODUCTS;
    return TAKAFUL_PRODUCTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const [rotationDeg, setRotationDeg] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [prevCategoryState, setPrevCategoryState] = useState<{
    cat: FamilyProductCategory;
    dir: 1 | -1;
  }>({ cat: activeCategory, dir: 1 });

  if (prevCategoryState.cat !== activeCategory) {
    const nextDir: 1 | -1 =
      CATEGORY_ORDER[activeCategory] >= CATEGORY_ORDER[prevCategoryState.cat] ? 1 : -1;
    setPrevCategoryState({ cat: activeCategory, dir: nextDir });
    setSelectedIndex(0);
    setRotationDeg(0);
  }
  const categoryDirection = prevCategoryState.dir;

  const wheelRef = useRef<HTMLDivElement | null>(null);
  const latestRotationRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const dragStateRef = useRef<{
    active: boolean;
    pointerId: number | null;
    captured: boolean;
    lastAngle: number;
    lastTime: number;
    velocityDegPerMs: number;
    totalMovedDeg: number;
  }>({
    active: false,
    pointerId: null,
    captured: false,
    lastAngle: 0,
    lastTime: 0,
    velocityDegPerMs: 0,
    totalMovedDeg: 0,
  });

  const stepAngle = 360 / products.length;

  const cancelSpinAnimation = useCallback(() => {
    if (rafIdRef.current !== null) {
      window.cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => cancelSpinAnimation();
  }, [cancelSpinAnimation]);

  useEffect(() => {
    cancelSpinAnimation();
    latestRotationRef.current = 0;
  }, [activeCategory, cancelSpinAnimation]);

  const computeNearestIndex = useCallback(
    (rot: number) => {
      const targetBase = normalizeAngle(-rot);
      let bestIdx = 0;
      let bestDiff = 360;
      for (let i = 0; i < products.length; i++) {
        const nodeBase = i * stepAngle;
        let diff = Math.abs(targetBase - nodeBase);
        if (diff > 180) diff = 360 - diff;
        if (diff < bestDiff) {
          bestDiff = diff;
          bestIdx = i;
        }
      }
      return bestIdx;
    },
    [products.length, stepAngle]
  );

  const animateRotationTo = useCallback(
    (targetRot: number, targetIdx: number, durationMs: number) => {
      cancelSpinAnimation();
      const startRot = latestRotationRef.current;
      const deltaRot = targetRot - startRot;

      if (prefersReducedMotion || Math.abs(deltaRot) < 0.05) {
        latestRotationRef.current = targetRot;
        setRotationDeg(targetRot);
        setSelectedIndex(targetIdx);
        return;
      }

      const startTime = performance.now();
      const stepFrame = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / durationMs);
        // Smooth natural deceleration curve (easeOutQuart)
        const eased = 1 - Math.pow(1 - t, 4);
        const current = startRot + deltaRot * eased;

        latestRotationRef.current = current;
        setRotationDeg(current);
        setSelectedIndex(computeNearestIndex(current));

        if (t < 1) {
          rafIdRef.current = window.requestAnimationFrame(stepFrame);
        } else {
          rafIdRef.current = null;
          latestRotationRef.current = targetRot;
          setRotationDeg(targetRot);
          setSelectedIndex(targetIdx);
        }
      };

      rafIdRef.current = window.requestAnimationFrame(stepFrame);
    },
    [cancelSpinAnimation, computeNearestIndex, prefersReducedMotion]
  );

  const snapToNearest = useCallback(
    (currentRot: number, velocityDegPerMs: number) => {
      const clampedVel = Math.max(-1.6, Math.min(1.6, velocityDegPerMs));
      const inertiaTravel = Math.max(-180, Math.min(180, clampedVel * 260));
      const projectedRot = currentRot + inertiaTravel;
      const nearestIdx = computeNearestIndex(projectedRot);
      const targetBase = -nearestIdx * stepAngle;
      const k = Math.round((projectedRot - targetBase) / 360);
      const finalRot = targetBase + k * 360;
      const distance = Math.abs(finalRot - currentRot);
      const durationMs = Math.min(720, Math.max(320, 320 + distance * 1.9));
      animateRotationTo(finalRot, nearestIdx, durationMs);
    },
    [animateRotationTo, computeNearestIndex, stepAngle]
  );

  const rotateToProductIndex = useCallback(
    (idx: number) => {
      const targetBase = -idx * stepAngle;
      const currentRot = latestRotationRef.current;
      const k = Math.round((currentRot - targetBase) / 360);
      const nextRot = targetBase + k * 360;
      const distance = Math.abs(nextRot - currentRot);
      const durationMs = Math.min(620, Math.max(340, 300 + distance * 1.6));
      animateRotationTo(nextRot, idx, durationMs);
    },
    [animateRotationTo, stepAngle]
  );

  const stepBy = useCallback(
    (direction: -1 | 1) => {
      const nextIdx = (selectedIndex + direction + products.length) % products.length;
      rotateToProductIndex(nextIdx);
    },
    [products.length, rotateToProductIndex, selectedIndex]
  );

  const getPointerAngle = (clientX: number, clientY: number) => {
    const el = wheelRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button[data-hub-cta="true"]')) return;
    cancelSpinAnimation();
    const angle = getPointerAngle(e.clientX, e.clientY);
    dragStateRef.current = {
      active: true,
      pointerId: e.pointerId,
      captured: false,
      lastAngle: angle,
      lastTime: performance.now(),
      velocityDegPerMs: 0,
      totalMovedDeg: 0,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag.active) return;

    const now = performance.now();
    const angle = getPointerAngle(e.clientX, e.clientY);
    let delta = angle - drag.lastAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    drag.totalMovedDeg += Math.abs(delta);
    if (!drag.captured && drag.totalMovedDeg > 2.5) {
      drag.captured = true;
      setIsDragging(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignore capture failures on synthetic pointer events
      }
    }

    const dt = Math.max(8, now - drag.lastTime);
    const instVel = Math.max(-2.2, Math.min(2.2, delta / dt));
    drag.velocityDegPerMs = drag.velocityDegPerMs * 0.35 + instVel * 0.65;
    drag.lastAngle = angle;
    drag.lastTime = now;

    if (drag.captured) {
      const next = latestRotationRef.current + delta;
      latestRotationRef.current = next;
      setRotationDeg(next);
      setSelectedIndex(computeNearestIndex(next));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag.active) return;

    const wasCaptured = drag.captured;
    const velocity = drag.velocityDegPerMs;
    drag.active = false;
    drag.captured = false;
    drag.pointerId = null;
    setIsDragging(false);

    if (wasCaptured) {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignore release failures
      }
      snapToNearest(latestRotationRef.current, velocity);
    }
  };

  const activeAccentHex = '#A32035';
  const safeSelectedIndex = Math.min(selectedIndex, Math.max(0, products.length - 1));
  const activeProduct = products[safeSelectedIndex] ?? products[0];

  const handleSegmentClick = useCallback(
    (e: React.MouseEvent, product: TakafulProduct, index: number) => {
      e.stopPropagation();
      if (dragStateRef.current.totalMovedDeg < 4) {
        if (index === safeSelectedIndex) {
          onSelectProduct(product);
        } else {
          rotateToProductIndex(index);
        }
      }
    },
    [onSelectProduct, rotateToProductIndex, safeSelectedIndex]
  );

  const handleWheelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepBy(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepBy(-1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      if ((e.target as HTMLElement).closest('button')) return;
      e.preventDefault();
      onSelectProduct(activeProduct);
    }
  };

  return (
    <section
      aria-label="360 Degree Rotating Family Takaful Product Selector"
      className="w-full min-w-0 flex flex-col items-center"
    >
      {/* PQFTL Category Filter Bar */}
      <div className="w-full flex justify-center mb-4 px-1">
        <div
          className="inline-flex flex-wrap sm:flex-nowrap justify-center gap-0.5 p-1 rounded-xl bg-white border border-[#E5E7EB] max-w-full"
          role="tablist"
          aria-label="Family Takaful Plan Categories"
        >
          {(
            [
              { key: 'all', label: 'All Family Plans' },
              { key: 'savings-retirement', label: 'Savings & Retirement' },
              { key: 'health-group', label: 'Health & Group' },
            ] as const
          ).map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleCategorySelect(cat.key)}
                className={`relative min-h-[36px] sm:min-h-[38px] px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-colors duration-200 shrink-0 ${
                  active ? 'text-white' : 'text-[#5C6066] hover:text-[#1E2022]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="wheel-category-pill"
                    transition={{ duration: 0.24, ease: PQ_EASE }}
                    className="absolute inset-0 rounded-lg bg-[#A32035] shadow-sm"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Signature Centered #007A48 Circular Dial */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.968, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0.12 : 0.32, ease: PQ_EASE }}
        className="w-full min-w-0 flex flex-col items-center py-1 will-change-transform"
      >
        <div className="w-full min-w-0 max-w-[440px] mx-auto flex flex-col items-center">
          <div className="w-full flex items-center justify-between gap-2 text-[11px] sm:text-xs text-[#5C6066] mb-2 px-1">
            <span className="truncate">Swipe to rotate or tap any plan</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={activeCategory}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: prefersReducedMotion ? 0.1 : PQ_CATEGORY_ENTER_S,
                    ease: PQ_EASE,
                  },
                }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0, transition: { duration: 0.08 } }
                    : {
                        opacity: 0,
                        y: -3,
                        transition: {
                          duration: PQ_CATEGORY_EXIT_S,
                          ease: PQ_CATEGORY_EXIT_EASE,
                        },
                      }
                }
                className="tabular-nums font-semibold text-[#1E2022] inline-block shrink-0"
              >
                {safeSelectedIndex + 1} / {products.length}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="w-full pt-3 pb-1 px-2 sm:px-3">
            <div
              className="relative flex items-center justify-center w-full aspect-square mx-auto select-none"
              style={{
                maxWidth: 'min(100%, clamp(228px, min(56vh, calc(100vh - 265px)), 404px))',
              }}
            >
              {/* Top Active Burgundy Pointer */}
              <div
                className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center"
                aria-hidden="true"
              >
                <div
                  className="w-3.5 h-3.5 rotate-45 border-2 border-white shadow-xs transition-colors duration-300"
                  style={{ backgroundColor: activeAccentHex }}
                />
              </div>

            {/* Steady Outer #007A48 Circular Frame Container */}
            <div
              ref={wheelRef}
              tabIndex={0}
              onKeyDown={handleWheelKeyDown}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={`relative w-full h-full rounded-full touch-none overflow-hidden shadow-md bg-[#007A48] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B335] ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              role="listbox"
              aria-label="Rotating Pak-Qatar Family Takaful circular dial"
            >
              {/* Static Decorative Framing Rings — Remain Steady During Category Switch */}
              <svg
                viewBox="0 0 380 380"
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                aria-hidden="true"
              >
                <circle
                  cx="190"
                  cy="190"
                  r="182"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.6"
                  strokeOpacity="0.95"
                />
                <circle
                  cx="190"
                  cy="190"
                  r="116"
                  fill="#007A48"
                  fillOpacity="0.45"
                  stroke="#FFFFFF"
                  strokeOpacity="0.24"
                  strokeWidth="1.2"
                />
                <circle
                  cx="190"
                  cy="190"
                  r="86"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeOpacity="0.12"
                  strokeWidth="1"
                />
              </svg>

              {/* Rotating Ring Layer — Unfolds & Settles Smoothly Inside Steady Outer Dial Frame */}
              <AnimatePresence mode="wait" custom={{ reduced: Boolean(prefersReducedMotion), dir: categoryDirection }} initial={false}>
                <DialRingLayer
                  key={activeCategory}
                  categoryKey={activeCategory}
                  categoryDirection={categoryDirection}
                  products={products}
                  selectedIndex={safeSelectedIndex}
                  rotationDeg={rotationDeg}
                  activeAccentHex={activeAccentHex}
                  prefersReducedMotion={Boolean(prefersReducedMotion)}
                  onSegmentClick={handleSegmentClick}
                />
              </AnimatePresence>

              {/* Inner Central Hub — Portrait Stays Steady While Active Plan Label Flows Smoothly */}
              <div className="absolute inset-[19.5%] z-20 rounded-full overflow-hidden flex flex-col items-center justify-center text-center px-[7%] py-[5%] pointer-events-none">
                <div className="w-full flex items-center justify-center">
                  <CentralManFigure />
                </div>

                <AnimatePresence mode="wait" custom={categoryDirection} initial={false}>
                  <motion.div
                    key={activeCategory}
                    custom={categoryDirection}
                    variants={{
                      enter: (dir: number) =>
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: 6, x: dir * 6, scale: 0.96 },
                      center: {
                        opacity: 1,
                        y: 0,
                        x: 0,
                        scale: 1,
                        transition: {
                          duration: prefersReducedMotion ? 0.1 : PQ_CATEGORY_ENTER_S,
                          ease: PQ_EASE,
                        },
                      },
                      exit: (dir: number) =>
                        prefersReducedMotion
                          ? { opacity: 0, transition: { duration: 0.08 } }
                          : {
                              opacity: 0,
                              y: -4,
                              x: -dir * 5,
                              scale: 0.96,
                              transition: {
                                duration: PQ_CATEGORY_EXIT_S,
                                ease: PQ_CATEGORY_EXIT_EASE,
                              },
                            },
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="mt-0.5 w-full max-w-[92%] mx-auto"
                  >
                    <div className="text-[10.5px] min-[380px]:text-[11.5px] sm:text-[13px] font-bold text-white leading-[1.18] line-clamp-2">
                      {activeProduct.name}
                    </div>
                    <button
                      type="button"
                      data-hub-cta="true"
                      onClick={() => onSelectProduct(activeProduct)}
                      className="pointer-events-auto mt-1.5 sm:mt-2 min-h-[26px] sm:min-h-[30px] px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-white hover:bg-[#F5B335] text-[#A32035] hover:text-[#1E2022] text-[9.5px] sm:text-[10px] font-bold whitespace-nowrap transition-colors duration-200 shadow-xs"
                    >
                      Open Details
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
          </div>

          {/* Accessible Step Controls */}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => stepBy(-1)}
              aria-label="Rotate dial anticlockwise to previous product"
              className="min-h-[44px] min-w-[44px] rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center text-[#1E2022] hover:border-[#A32035] hover:text-[#A32035] transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeCategory}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: prefersReducedMotion ? 0.1 : PQ_CATEGORY_ENTER_S,
                    ease: PQ_EASE,
                  },
                }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0, transition: { duration: 0.08 } }
                    : {
                        opacity: 0,
                        scale: 0.94,
                        transition: {
                          duration: PQ_CATEGORY_EXIT_S,
                          ease: PQ_CATEGORY_EXIT_EASE,
                        },
                      }
                }
                className="flex items-center gap-1.5"
                aria-hidden="true"
              >
                {products.map((p, idx) => (
                  <span
                    key={p.id}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === safeSelectedIndex ? 'w-5 bg-[#A32035]' : 'w-1.5 bg-[#D1D5DB]'
                    }`}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
            <button
              type="button"
              onClick={() => stepBy(1)}
              aria-label="Rotate dial clockwise to next product"
              className="min-h-[44px] min-w-[44px] rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center text-[#1E2022] hover:border-[#A32035] hover:text-[#A32035] transition-colors duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
