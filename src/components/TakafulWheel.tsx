import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  HeartPulse,
  Landmark,
  LayoutGrid,
  RotateCw,
  ShieldCheck,
} from 'lucide-react';
import { FamilyProductCategory, TakafulProduct } from '../types/pqfs';
import { TAKAFUL_PRODUCTS } from '../data/pqfsData';
import { PQ_EASE, PqStaggerGroup, PqStaggerItem } from './MotionPrimitives';

const REFERENCE_MAN_SRC = '/assets/aistudio/Always_Remember_Your_Afterlife__9a147a72.jpg';

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
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);

  useEffect(() => {
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
      setProcessedUrl(canvas.toDataURL('image/png'));
    };

    return () => {
      cancelled = true;
    };
  }, []);

  if (!processedUrl) {
    return <div className="w-[104px] h-[104px] sm:w-[118px] sm:h-[118px] rounded-full bg-[#007A48]" />;
  }

  return (
    <img
      src={processedUrl}
      alt="Participant in white clothing viewed from above looking at mobile phone"
      className="w-[108px] h-[108px] sm:w-[122px] sm:h-[122px] rounded-full object-contain pointer-events-none select-none"
    />
  );
};

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

  const [viewMode, setViewMode] = useState<'wheel' | 'list'>('wheel');
  const [rotationDeg, setRotationDeg] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const wheelRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    active: boolean;
    lastAngle: number;
    lastTime: number;
    velocityDegPerMs: number;
    totalMovedDeg: number;
  }>({
    active: false,
    lastAngle: 0,
    lastTime: 0,
    velocityDegPerMs: 0,
    totalMovedDeg: 0,
  });

  const stepAngle = 360 / products.length;

  useEffect(() => {
    setSelectedIndex(0);
    setRotationDeg(0);
  }, [activeCategory]);

  const normalizeAngle = (deg: number) => ((deg % 360) + 360) % 360;

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

  const snapToNearest = useCallback(
    (currentRot: number, velocity: number) => {
      const projectedRot = currentRot + Math.max(-110, Math.min(110, velocity * 210));
      const nearestIdx = computeNearestIndex(projectedRot);
      const targetBase = -nearestIdx * stepAngle;
      const k = Math.round((projectedRot - targetBase) / 360);
      const finalRot = targetBase + k * 360;
      setRotationDeg(finalRot);
      setSelectedIndex(nearestIdx);
    },
    [computeNearestIndex, stepAngle]
  );

  const rotateToProductIndex = (idx: number) => {
    const targetBase = -idx * stepAngle;
    const k = Math.round((rotationDeg - targetBase) / 360);
    const nextRot = targetBase + k * 360;
    setRotationDeg(nextRot);
    setSelectedIndex(idx);
  };

  const stepBy = (direction: -1 | 1) => {
    const nextIdx = (selectedIndex + direction + products.length) % products.length;
    rotateToProductIndex(nextIdx);
  };

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
    e.currentTarget.setPointerCapture(e.pointerId);
    const angle = getPointerAngle(e.clientX, e.clientY);
    dragStateRef.current = {
      active: true,
      lastAngle: angle,
      lastTime: performance.now(),
      velocityDegPerMs: 0,
      totalMovedDeg: 0,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.active) return;
    const now = performance.now();
    const angle = getPointerAngle(e.clientX, e.clientY);
    let delta = angle - dragStateRef.current.lastAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    const dt = Math.max(8, now - dragStateRef.current.lastTime);
    const instVel = delta / dt;
    dragStateRef.current.velocityDegPerMs =
      dragStateRef.current.velocityDegPerMs * 0.4 + instVel * 0.6;
    dragStateRef.current.lastAngle = angle;
    dragStateRef.current.lastTime = now;
    dragStateRef.current.totalMovedDeg += Math.abs(delta);

    setRotationDeg((prev) => {
      const next = prev + delta;
      setSelectedIndex(computeNearestIndex(next));
      return next;
    });
  };

  const handlePointerUp = () => {
    if (!dragStateRef.current.active) return;
    const velocity = dragStateRef.current.velocityDegPerMs;
    dragStateRef.current.active = false;
    setIsDragging(false);
    snapToNearest(rotationDeg, velocity);
  };

  const activeAccentHex = '#A32035';
  const activeProduct = products[selectedIndex] ?? products[0];

  const buildLabelArcPath = (index: number) => {
    const centerDeg = index * stepAngle;
    const spanDeg = Math.min(54, Math.max(30, stepAngle * 0.78));
    const isBottomHalf = (() => {
      const normalized = normalizeAngle(centerDeg + rotationDeg);
      return normalized > 98 && normalized < 262;
    })();
    const radius = isBottomHalf ? 156 : 145;

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

  const handleSegmentClick = (e: React.MouseEvent, product: TakafulProduct, index: number) => {
    e.stopPropagation();
    if (dragStateRef.current.totalMovedDeg < 8) {
      if (index === selectedIndex) {
        onSelectProduct(product);
      } else {
        rotateToProductIndex(index);
      }
    }
  };

  return (
    <section aria-label="360 Degree Rotating Family Takaful Product Selector" className="w-full">
      {/* PQFTL Category Segmentation & View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
        <div
          className="inline-flex p-1 rounded-xl bg-[#F4F4F5] border border-[#E5E7EB] max-w-full overflow-x-auto no-scrollbar"
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
                className={`relative min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors duration-200 shrink-0 ${
                  active
                    ? 'text-white'
                    : 'text-[#5C6066] hover:text-[#1E2022]'
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

        <button
          type="button"
          onClick={() => setViewMode((m) => (m === 'wheel' ? 'list' : 'wheel'))}
          className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#1E2022] hover:border-[#A32035] hover:text-[#A32035] transition-colors duration-300 whitespace-nowrap"
        >
          {viewMode === 'wheel' ? (
            <>
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>View All Products</span>
            </>
          ) : (
            <>
              <RotateCw className="w-3.5 h-3.5" />
              <span>360° Wheel View</span>
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {viewMode === 'list' ? (
          <motion.div
            key={`list-${activeCategory}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: PQ_EASE }}
          >
            <PqStaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {products.map((product) => (
                <PqStaggerItem key={product.id}>
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    className="pq-card-interactive w-full h-full text-left p-4 rounded-2xl border border-[#E5E7EB] bg-white hover:border-[#A32035] flex items-start gap-3.5 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#A32035]/10 text-[#A32035] flex items-center justify-center shrink-0 transition-colors duration-300">
                      <ProductIcon iconKey={product.iconKey} className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-medium text-[#5C6066]">
                        {product.category === 'savings-retirement'
                          ? 'PQFTL · Savings & Retirement'
                          : 'PQFTL · Health & Corporate Group'}
                      </div>
                      <h4 className="text-[15px] font-semibold text-[#1E2022] group-hover:text-[#A32035] transition-colors duration-300 mt-0.5">
                        {product.name}
                      </h4>
                      <p className="text-xs text-[#5C6066] mt-1 line-clamp-2">{product.shortTagline}</p>
                      <div className="mt-2.5 text-xs font-medium text-[#A32035] inline-flex items-center gap-1 transition-colors duration-300">
                        <span>Explore Product</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </button>
                </PqStaggerItem>
              ))}
            </PqStaggerGroup>
          </motion.div>
        ) : (
          <motion.div
            key={`wheel-view-${activeCategory}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.24, ease: PQ_EASE }}
            className="flex flex-col items-center py-1"
          >
            {/* Signature Reference-Matched #007A48 Circular Dial */}
            <div className="w-full max-w-[440px] mx-auto flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-xs text-[#5C6066] mb-2 px-1">
                <span>Rotate the green dial or tap any plan</span>
                <span className="tabular-nums font-medium text-[#1E2022]">
                  {selectedIndex + 1} / {products.length}
                </span>
              </div>

              <div className="relative flex items-center justify-center w-full max-w-[360px] sm:max-w-[404px] aspect-square mx-auto select-none">
                {/* Top Active Pointer Indicator */}
                <div
                  className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center"
                  aria-hidden="true"
                >
                  <div
                    className="w-3.5 h-3.5 rotate-45 border-2 border-white shadow-xs transition-colors duration-300"
                    style={{ backgroundColor: activeAccentHex }}
                  />
                </div>

                {/* Main #007A48 Circular Container */}
                <div
                  ref={wheelRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className="relative w-full h-full rounded-full touch-none cursor-grab active:cursor-grabbing overflow-hidden shadow-md bg-[#007A48]"
                  role="listbox"
                  aria-label="Rotating Pak-Qatar Family Takaful circular dial"
                >
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
                      strokeOpacity="0.22"
                      strokeWidth="1.2"
                    />
                    <circle
                      cx="190"
                      cy="190"
                      r="86"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeOpacity="0.1"
                      strokeWidth="1"
                    />
                  </svg>

                  {/* Rotating Ring */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      transform: `rotate(${rotationDeg}deg)`,
                      transition: isDragging
                        ? 'none'
                        : 'transform 560ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <svg viewBox="0 0 380 380" className="w-full h-full">
                      <defs>
                        {products.map((product, index) => (
                          <path
                            key={`arc-${product.id}`}
                            id={`dial-arc-${activeCategory}-${product.id}`}
                            d={buildLabelArcPath(index)}
                          />
                        ))}
                      </defs>

                      {products.map((product, index) => {
                        if (index === selectedIndex) return null;
                        return (
                          <path
                            key={`wedge-inactive-${product.id}`}
                            d={buildSegmentWedgePath(index)}
                            fill="#00462A"
                            className="cursor-pointer"
                            style={{
                              transition: 'fill 320ms cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                            onClick={(e) => handleSegmentClick(e, product, index)}
                          />
                        );
                      })}

                      {products.map((product, index) => {
                        if (index !== selectedIndex) return null;
                        return (
                          <path
                            key={`wedge-active-${product.id}`}
                            d={buildSegmentWedgePath(index)}
                            fill={activeAccentHex}
                            stroke="#FFFFFF"
                            strokeWidth="1.4"
                            strokeOpacity="0.72"
                            className="cursor-pointer"
                            style={{
                              transition:
                                'fill 320ms cubic-bezier(0.16, 1, 0.3, 1), stroke-opacity 320ms ease',
                            }}
                            onClick={(e) => handleSegmentClick(e, product, index)}
                          />
                        );
                      })}

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
                            className="cursor-pointer"
                            onClick={(e) => handleSegmentClick(e, product, index)}
                          >
                            <circle
                              cx={190 + 148 * Math.cos(rad)}
                              cy={190 + 148 * Math.sin(rad)}
                              r={compactLabels ? '28' : '34'}
                              fill="transparent"
                            />
                            {isActive && (
                              <circle
                                cx={190 + rDot * Math.cos(rad)}
                                cy={190 + rDot * Math.sin(rad)}
                                r="3.5"
                                fill="#F5B335"
                              />
                            )}
                            <text
                              fill="#FFFFFF"
                              fillOpacity={isActive ? 1 : 0.78}
                              fontSize={
                                compactLabels
                                  ? isActive
                                    ? '9.5'
                                    : '8.4'
                                  : isActive
                                    ? '12.5'
                                    : '11.5'
                              }
                              fontWeight={isActive ? '700' : '600'}
                              letterSpacing={compactLabels ? '0.04em' : '0.06em'}
                            >
                              <textPath
                                href={`#dial-arc-${activeCategory}-${product.id}`}
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

                  {/* Inner Central Area */}
                  <div className="absolute inset-[19.5%] z-20 rounded-full flex flex-col items-center justify-center text-center px-3 pointer-events-none">
                    <div className="-mt-3 flex items-center justify-center">
                      <CentralManFigure />
                    </div>

                    <div className="-mt-1 max-w-[186px]">
                      <div className="text-[12px] sm:text-[13px] font-bold text-white leading-tight line-clamp-1">
                        {activeProduct.name}
                      </div>
                      <p className="mt-0.5 text-[10px] text-white/90 leading-snug line-clamp-2">
                        {activeProduct.shortTagline}
                      </p>
                      <button
                        type="button"
                        data-hub-cta="true"
                        onClick={() => onSelectProduct(activeProduct)}
                        className="pointer-events-auto mt-1.5 min-h-[28px] px-3 py-0.5 rounded-full bg-white hover:bg-[#F5B335] text-[#A32035] hover:text-[#1E2022] text-[10px] font-bold whitespace-nowrap transition-colors duration-300 shadow-xs"
                      >
                        Open Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accessible Keyboard / Step Controls */}
              <div className="mt-3.5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => stepBy(-1)}
                  aria-label="Rotate dial anticlockwise to previous product"
                  className="min-h-[44px] min-w-[44px] rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center text-[#1E2022] hover:border-[#A32035] hover:text-[#A32035] transition-colors duration-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  {products.map((p, idx) => (
                    <span
                      key={p.id}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === selectedIndex ? 'w-5 bg-[#A32035]' : 'w-1.5 bg-[#D1D5DB]'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => stepBy(1)}
                  aria-label="Rotate dial clockwise to next product"
                  className="min-h-[44px] min-w-[44px] rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center text-[#1E2022] hover:border-[#A32035] hover:text-[#A32035] transition-colors duration-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
