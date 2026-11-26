import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Briefcase,
  Building2,
  Car,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  LayoutGrid,
  Plane,
  RotateCw,
  ShieldCheck,
  Umbrella,
} from 'lucide-react';
import { TakafulEntity, TakafulProduct } from '../types/pqfs';
import { TAKAFUL_PRODUCTS } from '../data/pqfsData';
import { PQ_EASE } from './MotionPrimitives';

const REFERENCE_MAN_SRC = '/assets/aistudio/Always_Remember_Your_Afterlife__9a147a72.jpg';

const SHORT_RING_LABELS: Record<string, string> = {
  'ft-family-savings': 'FAMILY SAVINGS',
  'ft-child-education': 'CHILD EDUCATION',
  'ft-retirement-wealth': 'RETIREMENT PLAN',
  'ft-health-elaaj': 'ELAAJ HEALTH',
  'ft-group-family': 'GROUP TAKAFUL',
  'gt-motor': 'MOTOR TAKAFUL',
  'gt-home-fire': 'HOME & FIRE',
  'gt-travel': 'TRAVEL & UMRAH',
  'gt-healthcare-corp': 'ACCIDENT & HEALTH',
  'gt-marine-sme': 'MARINE & SME',
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
    case 'car':
      return <Car className={className} />;
    case 'home':
      return <Home className={className} />;
    case 'plane':
      return <Plane className={className} />;
    case 'briefcase':
      return <Briefcase className={className} />;
    case 'umbrella':
      return <Umbrella className={className} />;
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

      // Crop cleanly around the central figure & cast shadow (~31%..69% of source square)
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

          // Soft circular feather so figure blends seamlessly into #007A48 inner dial
          const edgeAlpha = dist >= 0.96 ? 0 : dist <= 0.68 ? 1 : 1 - (dist - 0.68) / 0.28;

          // Identify saturated orange/red dial floor while protecting neutral white shirt, dark clothing & hair
          const rMinusB = r - b;
          const rMinusG = r - g;
          const orangeStrength =
            Math.max(0, Math.min(1, (rMinusB - 48) / 42)) *
            Math.max(0, Math.min(1, (rMinusG - 28) / 34));

          if (orangeStrength > 0.02) {
            // Preserve relative shadow luminance of the reference floor on #007A48 (0, 122, 72)
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
  entity: TakafulEntity;
  onEntityChange: (entity: TakafulEntity) => void;
  onSelectProduct: (product: TakafulProduct) => void;
}

export const TakafulWheel: React.FC<TakafulWheelProps> = ({
  entity,
  onEntityChange,
  onSelectProduct,
}) => {
  const products = useMemo(
    () => TAKAFUL_PRODUCTS.filter((p) => p.entity === entity),
    [entity]
  );

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
  }, [entity]);

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
    setRotationDeg(targetBase + k * 360);
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

  const isFamily = entity === 'family';
  const activeAccentHex = isFamily ? '#A32035' : '#007A48';
  const activeProduct = products[selectedIndex] ?? products[0];

  // Helper to build curved SVG circular arc path for each product label along the outer ring
  const buildLabelArcPath = (index: number) => {
    const centerDeg = index * stepAngle; // 0 = top (12 o'clock)
    const spanDeg = 54;
    const isBottomHalf = (() => {
      const normalized = normalizeAngle(centerDeg + rotationDeg);
      return normalized > 98 && normalized < 262;
    })();
    const radius = isBottomHalf ? 156 : 145;

    // Keep bottom labels right-side up cleanly so text stays legible while rotating
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

  // Helper to build annular wedge path for each product segment on the outer dial ring
  const buildSegmentWedgePath = (index: number) => {
    const centerDeg = index * stepAngle;
    const startDeg = centerDeg - stepAngle / 2;
    const endDeg = centerDeg + stepAngle / 2;
    const rInner = 116.5;
    const rOuter = 180.7;

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
      `A ${rOuter} ${rOuter} 0 0 1 ${oEnd.x.toFixed(2)} ${oEnd.y.toFixed(2)}`,
      `L ${iEnd.x.toFixed(2)} ${iEnd.y.toFixed(2)}`,
      `A ${rInner} ${rInner} 0 0 0 ${iStart.x.toFixed(2)} ${iStart.y.toFixed(2)}`,
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
    <section aria-label="360 Degree Rotating Takaful Product Selector" className="w-full">
      {/* Category separation & View toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div
          className="inline-flex p-1 rounded-xl bg-[#F4F4F5] border border-[#E5E7EB]"
          role="tablist"
          aria-label="Takaful Company Catalogue"
        >
          <button
            type="button"
            role="tab"
            aria-selected={isFamily}
            onClick={() => onEntityChange('family')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
              isFamily
                ? 'bg-[#A32035] text-white shadow-sm'
                : 'text-[#5C6066] hover:text-[#1E2022]'
            }`}
          >
            Family Takaful (PQFTL)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isFamily}
            onClick={() => onEntityChange('general')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
              !isFamily
                ? 'bg-[#007A48] text-white shadow-sm'
                : 'text-[#5C6066] hover:text-[#1E2022]'
            }`}
          >
            General Takaful (PQGTL)
          </button>
        </div>

        <button
          type="button"
          onClick={() => setViewMode((m) => (m === 'wheel' ? 'list' : 'wheel'))}
          className={`min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#1E2022] transition-colors duration-300 whitespace-nowrap ${
            isFamily
              ? 'hover:border-[#A32035] hover:text-[#A32035]'
              : 'hover:border-[#007A48] hover:text-[#007A48]'
          }`}
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
            key={`list-${entity}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: PQ_EASE }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => onSelectProduct(product)}
                className={`pq-card-interactive text-left p-4 rounded-2xl border border-[#E5E7EB] bg-white flex items-start gap-3.5 group ${
                  isFamily ? 'hover:border-[#A32035]' : 'hover:border-[#007A48]'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    isFamily
                      ? 'bg-[#A32035]/10 text-[#A32035]'
                      : 'bg-[#007A48]/10 text-[#007A48]'
                  }`}
                >
                  <ProductIcon iconKey={product.iconKey} className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-medium text-[#5C6066]">
                    {isFamily ? 'PQFTL · Family Takaful' : 'PQGTL · General Takaful'}
                  </div>
                  <h4
                    className={`text-[15px] font-semibold text-[#1E2022] transition-colors duration-300 mt-0.5 ${
                      isFamily ? 'group-hover:text-[#A32035]' : 'group-hover:text-[#007A48]'
                    }`}
                  >
                    {product.name}
                  </h4>
                  <p className="text-xs text-[#5C6066] mt-1 line-clamp-2">{product.shortTagline}</p>
                  <div
                    className={`mt-2.5 text-xs font-medium inline-flex items-center gap-1 transition-colors duration-300 ${
                      isFamily ? 'text-[#A32035]' : 'text-[#007A48]'
                    }`}
                  >
                    <span>Explore Product</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="wheel-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.24, ease: PQ_EASE }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
          >
          {/* Signature Reference-Matched #007A48 Circular Dial */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs text-[#5C6066] mb-2 px-1">
              <span>Rotate the green dial or tap any product name</span>
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
                aria-label="Rotating Pak-Qatar Takaful circular dial"
              >
                {/* Static Crisp White Outer Border & Subtle Inner Concentric Circles (matching reference proportions) */}
                <svg
                  viewBox="0 0 380 380"
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  aria-hidden="true"
                >
                  {/* Crisp outer white circular border */}
                  <circle
                    cx="190"
                    cy="190"
                    r="182"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2.6"
                    strokeOpacity="0.95"
                  />
                  {/* Subtle concentric inner circular areas */}
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

                {/* Rotating Ring: Entity-Colored Selected Wedge + Radial Division Ticks + Clean White Curved Product Labels */}
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
                          id={`dial-arc-${entity}-${product.id}`}
                          d={buildLabelArcPath(index)}
                        />
                      ))}
                    </defs>

                    {/* Inactive Outer Ring Wedges (deeper green-slate base so active #A32035 / #007A48 segment pops clearly) */}
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

                    {/* Active Selected Dial Segment: Burgundy (#A32035) for PQFTL, Green (#007A48) for PQGTL */}
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

                    {/* 5 Radial Division Ticks between products (like reference orange/gold dashes) */}
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

                    {/* Active Dot Indicator & Crisp Curved Product Labels */}
                    {products.map((product, index) => {
                      const isActive = index === selectedIndex;
                      const arcDeg = index * stepAngle;
                      const rDot = 169;
                      const rad = ((arcDeg - 90) * Math.PI) / 180;
                      const labelText = SHORT_RING_LABELS[product.id] ?? product.name.toUpperCase();

                      return (
                        <g
                          key={product.id}
                          className="cursor-pointer"
                          onClick={(e) => handleSegmentClick(e, product, index)}
                        >
                          {/* Transparent generous hit wedge */}
                          <circle
                            cx={190 + 148 * Math.cos(rad)}
                            cy={190 + 148 * Math.sin(rad)}
                            r="34"
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
                            fontSize={isActive ? '12.5' : '11.5'}
                            fontWeight={isActive ? '700' : '600'}
                            letterSpacing="0.06em"
                          >
                            <textPath
                              href={`#dial-arc-${entity}-${product.id}`}
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

                {/* Inner Central Area: Preserved Overhead Man Figure + Active Product Name & Short Description */}
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
                      className={`pointer-events-auto mt-1.5 min-h-[28px] px-3 py-0.5 rounded-full bg-white hover:bg-[#F5B335] hover:text-[#1E2022] text-[10px] font-bold whitespace-nowrap transition-colors duration-300 shadow-xs ${
                        isFamily ? 'text-[#A32035]' : 'text-[#007A48]'
                      }`}
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
                className={`min-h-[44px] min-w-[44px] rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center text-[#1E2022] transition-colors duration-300 ${
                  isFamily
                    ? 'hover:border-[#A32035] hover:text-[#A32035]'
                    : 'hover:border-[#007A48] hover:text-[#007A48]'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5" aria-hidden="true">
                {products.map((p, idx) => (
                  <span
                    key={p.id}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === selectedIndex
                        ? isFamily
                          ? 'w-5 bg-[#A32035]'
                          : 'w-5 bg-[#007A48]'
                        : 'w-1.5 bg-[#D1D5DB]'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => stepBy(1)}
                aria-label="Rotate dial clockwise to next product"
                className={`min-h-[44px] min-w-[44px] rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-center text-[#1E2022] transition-colors duration-300 ${
                  isFamily
                    ? 'hover:border-[#A32035] hover:text-[#A32035]'
                    : 'hover:border-[#007A48] hover:text-[#007A48]'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Synchronized Selected Product Details Card */}
          <div
            className={`lg:col-span-5 rounded-2xl border bg-white p-5 transition-colors duration-300 ${
              isFamily ? 'border-[#A32035]/25' : 'border-[#007A48]/25'
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${entity}-${activeProduct.id}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: PQ_EASE }}
              >
                <div
                  className={`text-xs font-semibold transition-colors duration-300 ${
                    isFamily ? 'text-[#A32035]' : 'text-[#007A48]'
                  }`}
                >
                  {activeProduct.companyName}
                </div>
                <h3 className="text-lg font-bold text-[#1E2022] mt-1">{activeProduct.name}</h3>
                <p className="text-sm text-[#5C6066] mt-2 leading-relaxed">
                  {activeProduct.shortTagline}
                </p>

                <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-2.5">
                  <div>
                    <div className="text-[11px] font-semibold text-[#1E2022]">Primary Benefit</div>
                    <div className="text-xs text-[#5C6066] mt-0.5">{activeProduct.mainBenefit}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <div className="text-[11px] text-[#5C6066]">Illustrative From</div>
                      <div className="text-sm font-bold text-[#1E2022] tabular-nums">
                        PKR {activeProduct.illustrativeMinContributionPkr.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#5C6066]">Schedule</div>
                      <div className="text-xs font-medium text-[#1E2022] mt-0.5">
                        {activeProduct.illustrativeFrequency}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => onSelectProduct(activeProduct)}
                    className={`flex-1 min-h-[44px] px-4 py-2.5 rounded-xl hover:opacity-90 text-white text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      isFamily ? 'bg-[#A32035]' : 'bg-[#007A48]'
                    }`}
                  >
                    Explore Product Details
                  </button>
                </div>
                <p className="mt-3 text-[11px] text-[#5C6066]">
                  Illustrative product summary · Subject to official PMD terms.
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
