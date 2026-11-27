import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Calculator,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { TAKAFUL_PRODUCTS } from '../data/pqfsData';
import { FamilyProductCategory, TakafulProduct } from '../types/pqfs';
import { ProductIcon } from './TakafulWheel';
import { PQ_EASE, PqCategoryReveal, PqSelect } from './MotionPrimitives';

const CALC_CATEGORY_ORDER: Record<FamilyProductCategory, number> = {
  all: 0,
  'savings-retirement': 1,
  'health-group': 2,
};

interface ContributionCalculatorViewProps {
  calcProductId: string;
  onCalcProductIdChange: (id: string) => void;
  calcMonthlyPkr: number;
  onCalcMonthlyPkrChange: (val: number) => void;
  calcYears: number;
  onCalcYearsChange: (val: number) => void;
  onBack: () => void;
  onSelectProduct: (product: TakafulProduct) => void;
  onStartApplication: (product: TakafulProduct) => void;
}

const AMOUNT_MIN = 3500;
const AMOUNT_MAX = 50000;
const AMOUNT_STEP = 500;
const AMOUNT_PRESETS = [5000, 10000, 20000, 35000, 50000];

const TERM_MIN = 5;
const TERM_MAX = 25;
const TERM_PRESETS = [5, 10, 15, 20, 25];

export const ContributionCalculatorView: React.FC<ContributionCalculatorViewProps> = ({
  calcProductId,
  onCalcProductIdChange,
  calcMonthlyPkr,
  onCalcMonthlyPkrChange,
  calcYears,
  onCalcYearsChange,
  onBack,
  onSelectProduct,
  onStartApplication,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<FamilyProductCategory>('all');
  const [categoryDirection, setCategoryDirection] = useState<number>(1);

  const calcProduct =
    TAKAFUL_PRODUCTS.find((p) => p.id === calcProductId) ?? TAKAFUL_PRODUCTS[0];
  const isInvestmentLinked = calcProduct.isInvestmentLinked;

  const filteredProducts = useMemo(() => {
    if (categoryFilter === 'all') return TAKAFUL_PRODUCTS;
    return TAKAFUL_PRODUCTS.filter((p) => p.category === categoryFilter);
  }, [categoryFilter]);

  const handleCategoryFilterChange = (nextFilter: FamilyProductCategory) => {
    setCategoryDirection(
      CALC_CATEGORY_ORDER[nextFilter] >= CALC_CATEGORY_ORDER[categoryFilter] ? 1 : -1
    );
    setCategoryFilter(nextFilter);
    if (nextFilter !== 'all' && calcProduct.category !== nextFilter) {
      const firstMatch = TAKAFUL_PRODUCTS.find((p) => p.category === nextFilter);
      if (firstMatch) onCalcProductIdChange(firstMatch.id);
    }
  };

  // Multi-year projection for unit-linked savings/retirement; annual schedule for health/group protection
  const totalIllustrativeContribution = isInvestmentLinked
    ? calcMonthlyPkr * 12 * calcYears
    : calcMonthlyPkr;
  const illustrativeProjectionLow = Math.round(totalIllustrativeContribution * 1.18);
  const illustrativeProjectionMid = Math.round(totalIllustrativeContribution * 1.38);

  const lowSurplus = illustrativeProjectionLow - totalIllustrativeContribution;
  const midSurplus = illustrativeProjectionMid - totalIllustrativeContribution;

  const amountPct = Math.max(
    0,
    Math.min(100, ((calcMonthlyPkr - AMOUNT_MIN) / (AMOUNT_MAX - AMOUNT_MIN)) * 100)
  );
  const termPct = Math.max(
    0,
    Math.min(100, ((calcYears - TERM_MIN) / (TERM_MAX - TERM_MIN)) * 100)
  );

  const paidBarPct =
    illustrativeProjectionMid > 0
      ? Math.round((totalIllustrativeContribution / illustrativeProjectionMid) * 100)
      : 100;
  const lowBarPct =
    illustrativeProjectionMid > 0
      ? Math.round((illustrativeProjectionLow / illustrativeProjectionMid) * 100)
      : 100;

  const chartGeometry = useMemo(() => {
    const w = 360;
    const h = 148;
    const padL = 14;
    const padR = 14;
    const padT = 16;
    const padB = 26;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;
    const steps = 8;
    const maxY = Math.max(1, illustrativeProjectionMid);

    const paidPts: Array<{ x: number; y: number }> = [];
    const lowPts: Array<{ x: number; y: number }> = [];
    const midPts: Array<{ x: number; y: number }> = [];

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = padL + t * plotW;
      const paidVal = totalIllustrativeContribution * t;
      const lowVal = paidVal * (1 + 0.18 * Math.pow(t, 1.35));
      const midVal = paidVal * (1 + 0.38 * Math.pow(t, 1.35));

      paidPts.push({ x, y: padT + plotH - (paidVal / maxY) * plotH });
      lowPts.push({ x, y: padT + plotH - (lowVal / maxY) * plotH });
      midPts.push({ x, y: padT + plotH - (midVal / maxY) * plotH });
    }

    const toPolyline = (pts: Array<{ x: number; y: number }>) =>
      pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

    const midAreaPath = [
      `M ${midPts[0].x.toFixed(1)} ${(padT + plotH).toFixed(1)}`,
      ...midPts.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`),
      `L ${midPts[midPts.length - 1].x.toFixed(1)} ${(padT + plotH).toFixed(1)}`,
      'Z',
    ].join(' ');

    const lowAreaPath = [
      `M ${lowPts[0].x.toFixed(1)} ${(padT + plotH).toFixed(1)}`,
      ...lowPts.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`),
      `L ${lowPts[lowPts.length - 1].x.toFixed(1)} ${(padT + plotH).toFixed(1)}`,
      'Z',
    ].join(' ');

    return {
      w,
      h,
      padL,
      padR,
      padT,
      plotW,
      plotH,
      paidLine: toPolyline(paidPts),
      lowLine: toPolyline(lowPts),
      midLine: toPolyline(midPts),
      midAreaPath,
      lowAreaPath,
      endPaid: paidPts[paidPts.length - 1],
      endLow: lowPts[lowPts.length - 1],
      endMid: midPts[midPts.length - 1],
    };
  }, [totalIllustrativeContribution, illustrativeProjectionMid]);

  const stepAmount = (delta: number) => {
    const next = Math.max(AMOUNT_MIN, Math.min(AMOUNT_MAX, calcMonthlyPkr + delta));
    onCalcMonthlyPkrChange(next);
  };

  const stepYears = (delta: number) => {
    const next = Math.max(TERM_MIN, Math.min(TERM_MAX, calcYears + delta));
    onCalcYearsChange(next);
  };

  return (
    <div className="space-y-5 pb-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium text-[#5C6066] hover:text-[#A32035] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Plans</span>
        </button>

        <div className="text-xs font-medium text-[#5C6066] hidden sm:block">
          Shariah-Conscious Planning · PQFTL Illustrative Estimator
        </div>
      </div>

      {/* Elevated Financial Planner Header Strip */}
      <section className="rounded-3xl border border-[#007A48]/20 bg-[#EAF3EE] px-5 py-5 sm:px-7 sm:py-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#007A48] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#007A48]">
                Pak-Qatar Family Takaful Planner
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1E2022] tracking-tight mt-0.5">
                Contribution Calculator
              </h1>
              <p className="text-xs sm:text-sm text-[#5C6066] mt-0.5">
                Configure your Family Takaful plan, contribution level, and horizon to preview illustrative outcomes.
              </p>
            </div>
          </div>

          {/* PQFTL Category Segmented Control */}
          <div
            className="inline-flex p-1 rounded-xl bg-white border border-[#E5E7EB] self-start sm:self-center shrink-0 max-w-full overflow-x-auto no-scrollbar"
            role="tablist"
            aria-label="Filter calculator plans by Family Takaful category"
          >
            {(
              [
                { key: 'all', label: 'All Plans', activeBg: 'bg-[#1E2022]', hoverText: 'hover:text-[#1E2022]' },
                { key: 'savings-retirement', label: 'Savings & Retirement', activeBg: 'bg-[#A32035]', hoverText: 'hover:text-[#A32035]' },
                { key: 'health-group', label: 'Health & Group', activeBg: 'bg-[#007A48]', hoverText: 'hover:text-[#007A48]' },
              ] as const
            ).map((opt) => {
              const active = categoryFilter === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleCategoryFilterChange(opt.key)}
                  className={`relative min-h-[38px] px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                    active ? 'text-white' : `text-[#5C6066] ${opt.hoverText}`
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="calc-category-pill"
                      transition={{ duration: 0.24, ease: PQ_EASE }}
                      className={`absolute inset-0 rounded-lg ${opt.activeBg}`}
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Interactive Workbench: Left Configuration Studio / Right Visual Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT COLUMN: Configuration Controls */}
        <section className="lg:col-span-6 rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Step 1: Select Product */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <label
                  htmlFor="calc-prod-tab"
                  className="text-xs font-bold text-[#1E2022] tracking-wide"
                >
                  01. Select Family Takaful Plan
                </label>
                <span className="text-[11px] font-semibold text-[#A32035]">
                  PQFTL · Family Takaful
                </span>
              </div>

              <PqSelect
                id="calc-prod-tab"
                ariaLabel="Select Family Takaful Plan"
                value={calcProductId}
                onChange={onCalcProductIdChange}
                options={filteredProducts.map((p) => ({
                  value: p.id,
                  label: p.name,
                  subLabel: p.isInvestmentLinked ? 'Unit-Linked PIA' : 'Mutual Waqf Protection',
                }))}
                buttonClassName="bg-[#F7F5F2] min-h-[46px] font-semibold"
              />

              <PqCategoryReveal
                swapKey={`${categoryFilter}-${calcProduct.id}`}
                direction={categoryDirection}
              >
                <div className="mt-3 p-3.5 rounded-2xl bg-[#F7F5F2] border border-[#E5E7EB]/80 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#A32035]/10 text-[#A32035] flex items-center justify-center shrink-0 transition-colors duration-300">
                    <ProductIcon iconKey={calcProduct.iconKey} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-[#1E2022] truncate">
                      {calcProduct.name}
                    </div>
                    <p className="text-[11px] text-[#5C6066] mt-0.5 leading-snug">
                      {calcProduct.mainBenefit}
                    </p>
                  </div>
                </div>
              </PqCategoryReveal>
            </div>

            {/* Step 2: Contribution Amount */}
            <div className="pt-4 border-t border-[#E5E7EB]">
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div>
                  <span className="text-xs font-bold text-[#1E2022]">
                    02. {isInvestmentLinked ? 'Monthly Contribution' : 'Annual Contribution'}
                  </span>
                  <div className="text-[11px] text-[#5C6066]">
                    Schedule: {calcProduct.illustrativeFrequency}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => stepAmount(-AMOUNT_STEP)}
                    disabled={calcMonthlyPkr <= AMOUNT_MIN}
                    aria-label="Decrease contribution by PKR 500"
                    className="min-h-[40px] min-w-[40px] rounded-xl border border-[#E5E7EB] bg-[#F7F5F2] hover:border-[#A32035] hover:text-[#A32035] disabled:opacity-40 flex items-center justify-center text-[#1E2022] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <div className="px-3 py-1.5 rounded-xl bg-[#EAF3EE] border border-[#007A48]/20 text-right min-w-[116px]">
                    <div className="text-[10px] font-medium text-[#5C6066] leading-none">
                      Selected
                    </div>
                    <div className="text-base font-bold text-[#A32035] tabular-nums leading-tight mt-0.5">
                      PKR {calcMonthlyPkr.toLocaleString()}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => stepAmount(AMOUNT_STEP)}
                    disabled={calcMonthlyPkr >= AMOUNT_MAX}
                    aria-label="Increase contribution by PKR 500"
                    className="min-h-[40px] min-w-[40px] rounded-xl border border-[#E5E7EB] bg-[#F7F5F2] hover:border-[#A32035] hover:text-[#A32035] disabled:opacity-40 flex items-center justify-center text-[#1E2022] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="relative pt-1 pb-2">
                <div className="absolute left-0 right-0 top-[14px] h-2 rounded-full bg-[#E5E7EB] overflow-hidden pointer-events-none">
                  <div
                    className="h-full rounded-full bg-[#A32035] transition-all duration-150"
                    style={{ width: `${amountPct}%` }}
                  />
                </div>
                <input
                  type="range"
                  aria-label={
                    isInvestmentLinked ? 'Monthly Contribution in PKR' : 'Annual Contribution in PKR'
                  }
                  min={AMOUNT_MIN}
                  max={AMOUNT_MAX}
                  step={AMOUNT_STEP}
                  value={calcMonthlyPkr}
                  onChange={(e) => onCalcMonthlyPkrChange(Number(e.target.value))}
                  className="relative z-10 pq-range pq-range-burgundy"
                />
                <div className="flex justify-between text-[11px] text-[#5C6066] tabular-nums mt-0.5">
                  <span>PKR 3,500</span>
                  <span>PKR 25,000</span>
                  <span>PKR 50,000</span>
                </div>
              </div>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {AMOUNT_PRESETS.map((preset) => {
                  const active = calcMonthlyPkr === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => onCalcMonthlyPkrChange(preset)}
                      className={`min-h-[36px] px-2.5 rounded-lg text-xs font-semibold tabular-nums border transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-[#A32035] text-white border-[#A32035]'
                          : 'bg-[#F7F5F2] text-[#1E2022] border-[#E5E7EB] hover:border-[#007A48]'
                      }`}
                    >
                      PKR {preset.toLocaleString()}
                    </button>
                  );
                })}
              </div>

              {calcMonthlyPkr < calcProduct.illustrativeMinContributionPkr && (
                <p className="mt-2 text-[11px] font-medium text-[#A32035]">
                  Note: Illustrative minimum for {calcProduct.name} starts from PKR{' '}
                  {calcProduct.illustrativeMinContributionPkr.toLocaleString()}.
                </p>
              )}
            </div>

            {/* Step 3: Illustrative Term or Annual Health/Group Waqf Schedule */}
            <AnimatePresence mode="wait" initial={false}>
              {isInvestmentLinked ? (
                <motion.div
                  key="step3-pia"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22, ease: PQ_EASE }}
                  className="pt-4 border-t border-[#E5E7EB]"
                >
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <div>
                      <span className="text-xs font-bold text-[#1E2022]">03. Illustrative Term</span>
                      <div className="text-[11px] text-[#5C6066]">
                        Multi-year Family Takaful horizon
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => stepYears(-1)}
                        disabled={calcYears <= TERM_MIN}
                        aria-label="Decrease term by 1 year"
                        className="min-h-[40px] min-w-[40px] rounded-xl border border-[#E5E7EB] bg-[#F7F5F2] hover:border-[#007A48] hover:text-[#007A48] disabled:opacity-40 flex items-center justify-center text-[#1E2022] transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <div className="px-3 py-1.5 rounded-xl bg-[#EAF3EE] border border-[#007A48]/20 text-right min-w-[92px]">
                        <div className="text-[10px] font-medium text-[#5C6066] leading-none">
                          Horizon
                        </div>
                        <div className="text-base font-bold text-[#007A48] tabular-nums leading-tight mt-0.5">
                          {calcYears} Years
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => stepYears(1)}
                        disabled={calcYears >= TERM_MAX}
                        aria-label="Increase term by 1 year"
                        className="min-h-[40px] min-w-[40px] rounded-xl border border-[#E5E7EB] bg-[#F7F5F2] hover:border-[#007A48] hover:text-[#007A48] disabled:opacity-40 flex items-center justify-center text-[#1E2022] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="relative pt-1 pb-2">
                    <div className="absolute left-0 right-0 top-[14px] h-2 rounded-full bg-[#E5E7EB] overflow-hidden pointer-events-none">
                      <div
                        className="h-full rounded-full bg-[#007A48] transition-all duration-150"
                        style={{ width: `${termPct}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      aria-label="Illustrative Term in Years"
                      min={TERM_MIN}
                      max={TERM_MAX}
                      step={1}
                      value={calcYears}
                      onChange={(e) => onCalcYearsChange(Number(e.target.value))}
                      className="relative z-10 pq-range pq-range-green"
                    />
                    <div className="flex justify-between text-[11px] text-[#5C6066] tabular-nums mt-0.5">
                      <span>5 Years</span>
                      <span>15 Years</span>
                      <span>25 Years</span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {TERM_PRESETS.map((yr) => {
                      const active = calcYears === yr;
                      return (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => onCalcYearsChange(yr)}
                          className={`min-h-[36px] px-3 rounded-lg text-xs font-semibold tabular-nums border transition-colors whitespace-nowrap ${
                            active
                              ? 'bg-[#007A48] text-white border-[#007A48]'
                              : 'bg-[#F7F5F2] text-[#1E2022] border-[#E5E7EB] hover:border-[#007A48]'
                          }`}
                        >
                          {yr} Years
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step3-waqf-protection"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22, ease: PQ_EASE }}
                  className="pt-4 border-t border-[#E5E7EB]"
                >
                  <div className="p-4 rounded-2xl bg-[#F7F5F2] border border-[#E5E7EB]">
                    <div className="text-xs font-bold text-[#1E2022]">
                      03. Annual Family Health &amp; Group Protection Cycle
                    </div>
                    <p className="mt-1 text-xs text-[#5C6066] leading-relaxed">
                      PQFTL Health and Corporate Group plans operate on an annual mutual Waqf protection schedule ({calcProduct.illustrativeFrequency}) focused on hospitalization and protection benefits rather than unit accumulation.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* RIGHT COLUMN: Prominent Results, Charts & Actions */}
        <section className="lg:col-span-6 flex flex-col gap-4">
          <PqCategoryReveal
            swapKey={`${categoryFilter}-${calcProduct.id}-${calcProduct.isInvestmentLinked}`}
            direction={categoryDirection}
          >
            <div className="rounded-3xl bg-[#007A48] text-white p-5 sm:p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-[#F5B335]" aria-hidden="true" />

              <svg
                viewBox="0 0 180 180"
                className="absolute -right-8 -top-8 w-44 h-44 text-white/10 pointer-events-none"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="90" cy="90" r="76" stroke="currentColor" strokeWidth="1" />
                <rect
                  x="36"
                  y="36"
                  width="108"
                  height="108"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <rect
                  x="36"
                  y="36"
                  width="108"
                  height="108"
                  transform="rotate(45 90 90)"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>

              <div className="relative z-10">
                <div className="text-xs font-medium text-white/85">
                  PQFTL · Family Takaful ·{' '}
                  {isInvestmentLinked
                    ? `${calcYears}-Year Projection`
                    : calcProduct.illustrativeFrequency}
                </div>

                {isInvestmentLinked ? (
                  <>
                    <div className="mt-2.5 text-xs font-semibold text-[#F5B335]">
                      Illustrative Range (Non-Guaranteed)
                    </div>
                    <div className="mt-1 text-2xl sm:text-[30px] font-bold text-white tabular-nums tracking-tight leading-tight">
                      PKR {illustrativeProjectionLow.toLocaleString()} –{' '}
                      {illustrativeProjectionMid.toLocaleString()}
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/15 grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[11px] text-white/80">Total Paid (Illustrative)</div>
                        <div className="text-base sm:text-lg font-bold text-white tabular-nums mt-0.5">
                          PKR {totalIllustrativeContribution.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-white/80">
                          Illustrative Growth Band
                        </div>
                        <div className="text-base sm:text-lg font-bold text-[#F5B335] tabular-nums mt-0.5">
                          +{lowSurplus.toLocaleString()} to +{midSurplus.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-2.5 text-xs font-semibold text-[#F5B335]">
                      Annual Waqf Contribution (Illustrative)
                    </div>
                    <div className="mt-1 text-2xl sm:text-[32px] font-bold text-white tabular-nums tracking-tight leading-tight">
                      PKR {totalIllustrativeContribution.toLocaleString()}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/15 flex items-start gap-2.5 text-xs text-white/90 leading-relaxed">
                      <ShieldCheck className="w-4 h-4 text-[#F5B335] shrink-0 mt-0.5" />
                      <span>
                        Pure Family Health &amp; Group Waqf protection without investment unit accumulation.
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </PqCategoryReveal>

          {/* Visual Analytics & Milestones Card */}
          <div className="rounded-3xl border border-[#007A48]/20 bg-[#EAF3EE] p-5 flex-1 flex flex-col justify-between space-y-4">
            {isInvestmentLinked ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-[#1E2022]">
                      Illustrative Contribution &amp; Projection Visual
                    </h2>
                    <p className="text-[11px] text-[#5C6066]">
                      Comparing paid contributions against non-guaranteed scenarios
                    </p>
                  </div>
                  <TrendingUp className="w-4 h-4 text-[#007A48] shrink-0" />
                </div>

                <div className="space-y-2.5 bg-white rounded-2xl border border-[#E5E7EB] p-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-[#1E2022]">
                        Total Paid (Illustrative)
                      </span>
                      <span className="font-bold text-[#A32035] tabular-nums">
                        PKR {totalIllustrativeContribution.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#F7F5F2] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${paidBarPct}%` }}
                        transition={{ duration: 0.38, ease: PQ_EASE }}
                        className="h-full rounded-full bg-[#A32035]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-[#1E2022]">
                        Illustrative Low Projection
                      </span>
                      <span className="font-bold text-[#007A48] tabular-nums">
                        PKR {illustrativeProjectionLow.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#F7F5F2] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${lowBarPct}%` }}
                        transition={{ duration: 0.42, ease: PQ_EASE }}
                        className="h-full rounded-full bg-[#007A48]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-[#1E2022]">
                        Illustrative Moderate Projection
                      </span>
                      <span className="font-bold text-[#1E2022] tabular-nums">
                        PKR {illustrativeProjectionMid.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#F7F5F2] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.46, ease: PQ_EASE }}
                        className="h-full rounded-full bg-[#F5B335]"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3.5">
                  <div className="flex items-center justify-between text-[11px] text-[#5C6066] mb-1.5">
                    <span className="font-semibold text-[#1E2022]">
                      {calcYears}-Year Cumulative Trajectory
                    </span>
                    <span className="tabular-nums">
                      Year 1 → Year {calcYears}
                    </span>
                  </div>

                  <svg
                    viewBox={`0 0 ${chartGeometry.w} ${chartGeometry.h}`}
                    className="w-full h-36 overflow-visible"
                    role="img"
                    aria-label="Illustrative projection curve across selected policy term"
                  >
                    <defs>
                      <linearGradient id="pqCalcMidGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F5B335" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#F5B335" stopOpacity="0.02" />
                      </linearGradient>
                      <linearGradient id="pqCalcLowGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#007A48" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#007A48" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>

                    {[0.25, 0.5, 0.75, 1].map((frac) => {
                      const y = chartGeometry.padT + chartGeometry.plotH * (1 - frac);
                      return (
                        <line
                          key={frac}
                          x1={chartGeometry.padL}
                          y1={y}
                          x2={chartGeometry.w - chartGeometry.padR}
                          y2={y}
                          stroke="#E5E7EB"
                          strokeDasharray="3 3"
                          strokeWidth="1"
                        />
                      );
                    })}

                    <path d={chartGeometry.midAreaPath} fill="url(#pqCalcMidGrad)" />
                    <path d={chartGeometry.lowAreaPath} fill="url(#pqCalcLowGrad)" />

                    <motion.polyline
                      key={`paid-${calcProduct.id}-${calcYears}`}
                      initial={{ pathLength: 0, opacity: 0.4 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.45, ease: PQ_EASE }}
                      points={chartGeometry.paidLine}
                      fill="none"
                      stroke="#A32035"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                    />
                    <motion.polyline
                      key={`low-${calcProduct.id}-${calcYears}`}
                      initial={{ pathLength: 0, opacity: 0.4 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.52, ease: PQ_EASE }}
                      points={chartGeometry.lowLine}
                      fill="none"
                      stroke="#007A48"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    <motion.polyline
                      key={`mid-${calcProduct.id}-${calcYears}`}
                      initial={{ pathLength: 0, opacity: 0.4 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.58, ease: PQ_EASE }}
                      points={chartGeometry.midLine}
                      fill="none"
                      stroke="#F5B335"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />

                    <circle
                      cx={chartGeometry.endPaid.x}
                      cy={chartGeometry.endPaid.y}
                      r="3.5"
                      fill="#A32035"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={chartGeometry.endLow.x}
                      cy={chartGeometry.endLow.y}
                      r="4"
                      fill="#007A48"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={chartGeometry.endMid.x}
                      cy={chartGeometry.endMid.y}
                      r="4"
                      fill="#F5B335"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />

                    <text
                      x={chartGeometry.padL}
                      y={chartGeometry.h - 4}
                      fontSize="10"
                      fill="#5C6066"
                    >
                      Start
                    </text>
                    <text
                      x={chartGeometry.padL + chartGeometry.plotW / 2}
                      y={chartGeometry.h - 4}
                      fontSize="10"
                      textAnchor="middle"
                      fill="#5C6066"
                    >
                      Year {Math.round(calcYears / 2)}
                    </text>
                    <text
                      x={chartGeometry.w - chartGeometry.padR}
                      y={chartGeometry.h - 4}
                      fontSize="10"
                      fontWeight="700"
                      textAnchor="end"
                      fill="#1E2022"
                    >
                      Year {calcYears}
                    </text>
                  </svg>

                  <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#5C6066]">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-0.5 bg-[#A32035] inline-block" />
                      Paid
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#007A48] inline-block" />
                      Low Band
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#F5B335] inline-block" />
                      Moderate Band
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[#1E2022]">
                    Mutual Waqf Protection Breakdown
                  </h2>
                  <ShieldCheck className="w-4 h-4 text-[#007A48]" />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#F7F5F2]">
                    <div className="text-[11px] text-[#5C6066]">Annual Rate</div>
                    <div className="font-bold text-[#1E2022] tabular-nums mt-0.5">
                      PKR {calcMonthlyPkr.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F7F5F2]">
                    <div className="text-[11px] text-[#5C6066]">Illustrative Min</div>
                    <div className="font-bold text-[#007A48] tabular-nums mt-0.5">
                      PKR {calcProduct.illustrativeMinContributionPkr.toLocaleString()}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#5C6066] leading-relaxed">
                  {calcProduct.contributionInfo}
                </p>
              </div>
            )}

            <p className="text-[11px] text-[#5C6066] leading-relaxed">
              Demonstration figures do not represent guaranteed returns or official underwriting offers.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => onSelectProduct(calcProduct)}
                className="flex-1 min-h-[48px] px-4 rounded-full border border-[#A32035] text-[#A32035] hover:bg-[#A32035]/5 bg-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                View Plan Details
              </button>
              <button
                type="button"
                onClick={() => onStartApplication(calcProduct)}
                className="flex-1 min-h-[48px] px-5 rounded-full bg-[#A32035] hover:opacity-90 text-white text-sm font-semibold flex items-center justify-between transition-opacity whitespace-nowrap"
              >
                <span className="w-4" aria-hidden="true" />
                <span>Start an Application</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
