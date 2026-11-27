import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowLeftRight,
  BadgeCheck,
  Building2,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FilePenLine,
  Globe,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
  Scale,
  Search,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import {
  DEMO_AGENTS,
  DEMO_BRANCHES,
  PQFS_VERIFIED_CONTACT,
  TAKAFUL_PRODUCTS,
} from '../data/pqfsData';
import { FamilyProductCategory, TakafulProduct } from '../types/pqfs';
import { ensureLoadingAssetsReady, ProcessingOverlay } from './BrandAssets';
import { ProductIcon, TakafulWheel } from './TakafulWheel';
import {
  PQ_EASE,
  PqAccordionPanel,
  PqCategoryReveal,
  PqSelect,
  PqTabSwap,
  TransitionDirection,
} from './MotionPrimitives';

const GUEST_CATEGORY_ORDER: Record<FamilyProductCategory, number> = {
  all: 0,
  'savings-retirement': 1,
  'health-group': 2,
};

/* ============================================================================
 * 1. Dedicated Destination: Family Takaful Products (360° Product Dial)
 * ========================================================================== */

interface GuestProductsScreenProps {
  wheelCategory: FamilyProductCategory;
  onWheelCategoryChange: (category: FamilyProductCategory) => void;
  onBack: () => void;
  onOpenCompare: () => void;
  onOpenCalculator: (product: TakafulProduct) => void;
  onSelectProduct: (product: TakafulProduct) => void;
  onStartApplication: (product: TakafulProduct) => void;
}

export const GuestProductsScreen: React.FC<GuestProductsScreenProps> = ({
  wheelCategory,
  onWheelCategoryChange,
  onBack,
  onOpenCompare,
  onOpenCalculator,
  onSelectProduct,
  onStartApplication,
}) => {
  const prefersReduced = useReducedMotion();
  const activeCategoryDefault =
    wheelCategory === 'all'
      ? TAKAFUL_PRODUCTS[0]
      : TAKAFUL_PRODUCTS.find((p) => p.category === wheelCategory) ?? TAKAFUL_PRODUCTS[0];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium text-[#5C6066] hover:text-[#A32035] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Plans</span>
        </button>

        <button
          type="button"
          onClick={onOpenCompare}
          className="min-h-[40px] px-3.5 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#A32035] text-xs font-semibold text-[#1E2022] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
        >
          <Scale className="w-3.5 h-3.5 text-[#A32035]" />
          <span>Compare Plans</span>
        </button>
      </div>

      {/* Original Centered 360° Product Dial Showcase */}
      <motion.section
        initial={prefersReduced ? false : { opacity: 0, scale: 0.975, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: prefersReduced ? 0.12 : 0.32, ease: PQ_EASE }}
        className="rounded-3xl border border-[#007A48]/20 bg-[#EAF3EE] p-4 sm:p-7 will-change-transform"
      >
        <div className="mb-5">
          <div className="text-xs font-semibold text-[#007A48]">
            Pak-Qatar Family Takaful Limited (PQFTL)
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#A32035] mt-1">
            Family Takaful Products &amp; 360° Selector
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5C6066] leading-relaxed max-w-2xl">
            Rotate or swipe the dial, filter by category, and tap any highlighted PQFTL plan to explore Shariah-compliant savings, child education, retirement, Elaaj health, and corporate group solutions.
          </p>
        </div>

        <TakafulWheel
          category={wheelCategory}
          onCategoryChange={onWheelCategoryChange}
          onSelectProduct={onSelectProduct}
        />
      </motion.section>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => onOpenCalculator(activeCategoryDefault)}
          className="flex-1 min-h-[48px] px-5 rounded-full border border-[#A32035] bg-white hover:bg-[#EAF3EE] text-[#A32035] text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Calculator className="w-4 h-4" />
          <span>Contribution Calculator</span>
        </button>
        <button
          type="button"
          onClick={() => onStartApplication(activeCategoryDefault)}
          className="flex-1 min-h-[48px] px-5 rounded-full bg-[#A32035] hover:opacity-90 text-white text-sm font-semibold flex items-center justify-between transition-opacity"
        >
          <FilePenLine className="w-4 h-4 shrink-0" />
          <span>Start an Application</span>
          <ChevronRight className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </div>
  );
};

/* ============================================================================
 * 2. Dedicated Destination: Compare Plans Matrix
 * ========================================================================== */

interface GuestCompareScreenProps {
  onBack: () => void;
  onOpenProducts: () => void;
  onSelectProduct: (product: TakafulProduct) => void;
  onStartApplication: (product: TakafulProduct) => void;
  onOpenShariah: () => void;
  onOpenContact: () => void;
}

export const GuestCompareScreen: React.FC<GuestCompareScreenProps> = ({
  onBack,
  onOpenProducts,
  onSelectProduct,
  onStartApplication,
  onOpenShariah,
  onOpenContact,
}) => {
  const [compareCategory, setCompareCategory] = useState<FamilyProductCategory>('all');
  const [compareIds, setCompareIds] = useState<[string, string]>([
    'ft-family-savings',
    'ft-child-education',
  ]);

  const [compareDirection, setCompareDirection] = useState<number>(1);
  const categoryProducts = useMemo(() => {
    if (compareCategory === 'all') return TAKAFUL_PRODUCTS;
    return TAKAFUL_PRODUCTS.filter((p) => p.category === compareCategory);
  }, [compareCategory]);

  const handleCategorySwitch = (nextCat: FamilyProductCategory) => {
    setCompareDirection(
      GUEST_CATEGORY_ORDER[nextCat] >= GUEST_CATEGORY_ORDER[compareCategory] ? 1 : -1
    );
    setCompareCategory(nextCat);
    const list =
      nextCat === 'all'
        ? TAKAFUL_PRODUCTS
        : TAKAFUL_PRODUCTS.filter((p) => p.category === nextCat);
    if (list.length >= 2) {
      setCompareIds([list[0].id, list[1].id]);
    } else if (list.length === 1) {
      setCompareIds([list[0].id, list[0].id]);
    }
  };

  const compareA = TAKAFUL_PRODUCTS.find((p) => p.id === compareIds[0]) ?? categoryProducts[0];
  const compareB = TAKAFUL_PRODUCTS.find((p) => p.id === compareIds[1]) ?? categoryProducts[1] ?? categoryProducts[0];

  const selectOptions = categoryProducts.map((p) => ({
    value: p.id,
    label: p.name,
    subLabel:
      p.category === 'savings-retirement' ? 'Savings & Retirement' : 'Health & Group',
  }));

  const swapPlans = () => {
    setCompareIds([compareB.id, compareA.id]);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium text-[#5C6066] hover:text-[#A32035] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Plans</span>
        </button>

        <button
          type="button"
          onClick={onOpenProducts}
          className="min-h-[40px] px-3.5 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#A32035] text-xs font-semibold text-[#1E2022] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#A32035]" />
          <span>Explore All Plans</span>
        </button>
      </div>

      {/* Distinct Comparison Header with Category Selector */}
      <section className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-[#007A48]">
              PQFTL Side-by-Side Feature Matrix
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E2022] mt-1">
              Compare Family Takaful Plans
            </h1>
            <p className="text-xs sm:text-sm text-[#5C6066] mt-1 max-w-2xl">
              Filter by plan category, pick any two PQFTL plans, and review structure, illustrative contributions, eligibility, and covered benefits side by side.
            </p>
          </div>

          <div
            className="inline-flex p-1 rounded-xl bg-[#F4F4F5] border border-[#E5E7EB] self-start lg:self-auto max-w-full overflow-x-auto no-scrollbar"
            role="tablist"
            aria-label="Filter plans to compare by category"
          >
            {(
              [
                { key: 'all', label: 'All Categories' },
                { key: 'savings-retirement', label: 'Savings & Retirement' },
                { key: 'health-group', label: 'Health & Group' },
              ] as const
            ).map((cat) => {
              const active = compareCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleCategorySwitch(cat.key)}
                  className={`relative min-h-[38px] px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                    active ? 'text-white' : 'text-[#5C6066] hover:text-[#1E2022]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="compare-category-pill"
                      transition={{ duration: 0.22, ease: PQ_EASE }}
                      className="absolute inset-0 rounded-lg bg-[#A32035]"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dual Selector Bar */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
          <div className="md:col-span-5 space-y-1">
            <div className="text-[11px] font-semibold text-[#A32035]">Plan A</div>
            <PqSelect
              ariaLabel="First plan to compare"
              value={compareA.id}
              onChange={(val) => setCompareIds([val, compareB.id])}
              options={selectOptions}
              buttonClassName="bg-[#F7F5F2]"
            />
          </div>

          <div className="md:col-span-1 flex justify-center md:pt-4">
            <button
              type="button"
              onClick={swapPlans}
              aria-label="Swap Plan A and Plan B"
              className="min-h-[44px] min-w-[44px] rounded-xl border border-[#E5E7EB] bg-white hover:border-[#A32035] text-[#5C6066] hover:text-[#A32035] flex items-center justify-center transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          <div className="md:col-span-5 space-y-1">
            <div className="text-[11px] font-semibold text-[#007A48]">Plan B</div>
            <PqSelect
              ariaLabel="Second plan to compare"
              value={compareB.id}
              onChange={(val) => setCompareIds([compareA.id, val])}
              options={selectOptions}
              buttonClassName="bg-[#F7F5F2]"
            />
          </div>
        </div>
      </section>

      {/* Side-by-Side Structured Comparison Matrix */}
      <PqCategoryReveal
        swapKey={`${compareCategory}-${compareA.id}-${compareB.id}`}
        direction={compareDirection}
      >
        <section className="rounded-3xl border border-[#E5E7EB] bg-white overflow-hidden">
          {/* Column Headers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-[#E5E7EB]">
            <div className="p-5 bg-[#A32035]/5 sm:border-r border-[#E5E7EB]">
              <div className="text-[11px] font-semibold text-[#A32035]">Selected Plan A</div>
              <div className="mt-1 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#A32035] text-white flex items-center justify-center shrink-0">
                  <ProductIcon iconKey={compareA.iconKey} className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-[#1E2022] leading-tight">
                  {compareA.name}
                </h2>
              </div>
              <p className="text-xs text-[#5C6066] mt-2">{compareA.shortTagline}</p>
            </div>

            <div className="p-5 bg-[#EAF3EE]/60 border-t sm:border-t-0 border-[#E5E7EB]">
              <div className="text-[11px] font-semibold text-[#007A48]">Selected Plan B</div>
              <div className="mt-1 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#007A48] text-white flex items-center justify-center shrink-0">
                  <ProductIcon iconKey={compareB.iconKey} className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-[#1E2022] leading-tight">
                  {compareB.name}
                </h2>
              </div>
              <p className="text-xs text-[#5C6066] mt-2">{compareB.shortTagline}</p>
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="divide-y divide-[#E5E7EB] text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="p-4 sm:border-r border-[#E5E7EB]">
                <div className="text-[11px] font-semibold text-[#5C6066]">Category &amp; Model</div>
                <div className="mt-1 font-semibold text-[#1E2022]">
                  {compareA.category === 'savings-retirement' ? 'Savings & Retirement' : 'Health & Group'}
                  {' · '}
                  {compareA.isInvestmentLinked ? 'Unit-Linked PIA' : 'Pure Waqf Risk Pool'}
                </div>
              </div>
              <div className="p-4 border-t sm:border-t-0 border-[#E5E7EB]">
                <div className="text-[11px] font-semibold text-[#5C6066]">Category &amp; Model</div>
                <div className="mt-1 font-semibold text-[#1E2022]">
                  {compareB.category === 'savings-retirement' ? 'Savings & Retirement' : 'Health & Group'}
                  {' · '}
                  {compareB.isInvestmentLinked ? 'Unit-Linked PIA' : 'Pure Waqf Risk Pool'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="p-4 sm:border-r border-[#E5E7EB]">
                <div className="text-[11px] font-semibold text-[#5C6066]">Illustrative Contribution &amp; Schedule</div>
                <div className="mt-1 text-sm font-bold text-[#A32035] tabular-nums">
                  From PKR {compareA.illustrativeMinContributionPkr.toLocaleString()}
                </div>
                <div className="text-[#5C6066] mt-0.5">{compareA.illustrativeFrequency}</div>
              </div>
              <div className="p-4 border-t sm:border-t-0 border-[#E5E7EB]">
                <div className="text-[11px] font-semibold text-[#5C6066]">Illustrative Contribution &amp; Schedule</div>
                <div className="mt-1 text-sm font-bold text-[#007A48] tabular-nums">
                  From PKR {compareB.illustrativeMinContributionPkr.toLocaleString()}
                </div>
                <div className="text-[#5C6066] mt-0.5">{compareB.illustrativeFrequency}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="p-4 sm:border-r border-[#E5E7EB]">
                <div className="text-[11px] font-semibold text-[#5C6066]">Primary Benefit</div>
                <div className="mt-1 font-medium text-[#1E2022] leading-relaxed">
                  {compareA.mainBenefit}
                </div>
              </div>
              <div className="p-4 border-t sm:border-t-0 border-[#E5E7EB]">
                <div className="text-[11px] font-semibold text-[#5C6066]">Primary Benefit</div>
                <div className="mt-1 font-medium text-[#1E2022] leading-relaxed">
                  {compareB.mainBenefit}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="p-4 sm:border-r border-[#E5E7EB]">
                <div className="text-[11px] font-semibold text-[#5C6066] mb-1.5">Key Coverage Highlights</div>
                <ul className="space-y-1.5 text-[#1E2022]">
                  {compareA.coverageInfo.slice(0, 2).map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#A32035] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 border-t sm:border-t-0 border-[#E5E7EB]">
                <div className="text-[11px] font-semibold text-[#5C6066] mb-1.5">Key Coverage Highlights</div>
                <ul className="space-y-1.5 text-[#1E2022]">
                  {compareB.coverageInfo.slice(0, 2).map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#007A48] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="p-4 sm:border-r border-[#E5E7EB]">
                <div className="text-[11px] font-semibold text-[#5C6066]">Eligibility Summary</div>
                <div className="mt-1 text-[#1E2022] leading-relaxed">
                  {compareA.eligibility[0]}
                </div>
              </div>
              <div className="p-4 border-t sm:border-t-0 border-[#E5E7EB]">
                <div className="text-[11px] font-semibold text-[#5C6066]">Eligibility Summary</div>
                <div className="mt-1 text-[#1E2022] leading-relaxed">
                  {compareB.eligibility[0]}
                </div>
              </div>
            </div>

            {/* Side-by-Side CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 bg-[#F7F5F2]/60">
              <div className="p-4 sm:border-r border-[#E5E7EB] flex gap-2">
                <button
                  type="button"
                  onClick={() => onSelectProduct(compareA)}
                  className="flex-1 min-h-[44px] rounded-xl border border-[#A32035] bg-white hover:bg-[#EAF3EE] font-semibold text-[#A32035] transition-colors"
                >
                  View Plan A
                </button>
                <button
                  type="button"
                  onClick={() => onStartApplication(compareA)}
                  className="flex-1 min-h-[44px] rounded-xl bg-[#A32035] hover:opacity-90 font-semibold text-white transition-opacity"
                >
                  Apply Plan A
                </button>
              </div>
              <div className="p-4 border-t sm:border-t-0 border-[#E5E7EB] flex gap-2">
                <button
                  type="button"
                  onClick={() => onSelectProduct(compareB)}
                  className="flex-1 min-h-[44px] rounded-xl border border-[#007A48] bg-white hover:bg-[#EAF3EE] font-semibold text-[#007A48] transition-colors"
                >
                  View Plan B
                </button>
                <button
                  type="button"
                  onClick={() => onStartApplication(compareB)}
                  className="flex-1 min-h-[44px] rounded-xl bg-[#007A48] hover:opacity-90 font-semibold text-white transition-opacity"
                >
                  Apply Plan B
                </button>
              </div>
            </div>
          </div>
        </section>
      </PqCategoryReveal>

      {/* Shariah Context Footer Card */}
      <section className="rounded-3xl border border-[#007A48]/20 bg-[#EAF3EE] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-[#007A48]">Shariah Transparency</div>
          <h2 className="mt-1 text-base font-bold text-[#1E2022]">
            Compare Waqf Protection vs. Unit-Linked PIA
          </h2>
          <p className="mt-1 text-xs text-[#5C6066] max-w-xl leading-relaxed">
            Every Pak-Qatar Family Takaful certificate operates under our Waqf-Wakalah governance model reviewed by an independent Shariah Supervisory Board.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenShariah}
            className="min-h-[44px] px-4 rounded-xl bg-[#007A48] hover:opacity-90 text-white text-xs font-semibold whitespace-nowrap"
          >
            Open Shariah Centre
          </button>
          <button
            type="button"
            onClick={onOpenContact}
            className="min-h-[44px] px-4 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#A32035] text-xs font-semibold text-[#1E2022] inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#A32035]" />
            <span>Contact Us</span>
          </button>
        </div>
      </section>
    </div>
  );
};

/* ============================================================================
 * 3. Dedicated Destination: Searchable & Categorized FAQs Screen
 * ========================================================================== */

type FaqTopic = 'all' | 'plans' | 'shariah' | 'contributions';

interface GuestFaqItem {
  id: string;
  topic: Exclude<FaqTopic, 'all'>;
  topicLabel: string;
  q: string;
  a: string;
}

const VERIFIED_GUEST_FAQS: GuestFaqItem[] = [
  {
    id: 'faq-plans-offered',
    topic: 'plans',
    topicLabel: 'Plans & Savings',
    q: 'What Family Takaful plans does Pak-Qatar Family Takaful Limited (PQFTL) offer?',
    a: 'PQFTL offers Family Protection & Savings, Child Education Takaful, Mahana Bachat & Takaful Flexi, Retirement & Wealth Accumulation, Lifetime Kafalat Plan, Voluntary Pension Scheme (VPS), Individual & Family Elaaj Health, and Corporate Group Family & Health Takaful.',
  },
  {
    id: 'faq-explore-first',
    topic: 'plans',
    topicLabel: 'Plans & Savings',
    q: 'Can I explore products and estimate contributions before creating an account?',
    a: 'Yes. In Guest Exploration you can browse product cards, rotate the 360° Product Dial, compare any two PQFTL plans side by side, calculate illustrative contributions, and preview the step-by-step application journey before signing up.',
  },
  {
    id: 'faq-education-waiver',
    topic: 'plans',
    topicLabel: 'Plans & Savings',
    q: 'How does the Child Education Takaful Plan safeguard university milestones?',
    a: 'It pairs regular Shariah-compliant Participant Investment Account (PIA) growth with Waqf protection. Where Waiver of Contribution coverage applies, the Waqf pool continues funding scheduled contributions if an unforeseen event occurs to the parent/guardian.',
  },
  {
    id: 'faq-elaaj-care',
    topic: 'plans',
    topicLabel: 'Plans & Savings',
    q: 'What does Individual & Family Elaaj Health cover?',
    a: 'Elaaj Health provides inpatient hospitalization protection, panel cashless admission support where eligible, and reimbursement guidance across PQFTL’s network of panel hospitals and diagnostic centers.',
  },
  {
    id: 'faq-waqf-model',
    topic: 'shariah',
    topicLabel: 'Shariah & Waqf',
    q: 'How do Waqf, Tabarru, and Wakalah work in Family Takaful?',
    a: 'Participants contribute Tabarru into a Shariah-governed Waqf risk pool for mutual assistance among members, while Pak-Qatar Family Takaful acts as Wakeel under an explicitly disclosed Wakalah management fee structure.',
  },
  {
    id: 'faq-shariah-review',
    topic: 'shariah',
    topicLabel: 'Shariah & Waqf',
    q: 'Who oversees the Shariah compliance of Pak-Qatar Family Takaful investments?',
    a: 'PQFTL operations, Waqf deeds, product structures, and Shariah-screened investment universes (Islamic equity, sukuk, and money-market funds) undergo review and periodic compliance audits supervised by an independent Shariah Supervisory Board.',
  },
  {
    id: 'faq-illustrative-quotes',
    topic: 'contributions',
    topicLabel: 'Contributions & Claims',
    q: 'Are the contribution amounts and projections shown in the calculator final quotes?',
    a: 'No. Amounts and investment growth curves displayed in Guest Exploration and the Contribution Calculator are illustrative demonstration figures only. Official illustrations and terms are governed by the Participant Membership Document (PMD) after underwriting.',
  },
  {
    id: 'faq-topups-switching',
    topic: 'contributions',
    topicLabel: 'Contributions & Claims',
    q: 'Can participants adjust fund risk profiles or add top-up contributions?',
    a: 'Yes. Eligible unit-linked savings and retirement plans allow ad-hoc top-up contributions and switching between Conservative, Balanced, and Growth Shariah funds as life stages evolve.',
  },
];

interface GuestFaqsScreenProps {
  onBack: () => void;
  onOpenShariah: () => void;
  onOpenContact: () => void;
  onStartApplication: () => void;
}

export const GuestFaqsScreen: React.FC<GuestFaqsScreenProps> = ({
  onBack,
  onOpenShariah,
  onOpenContact,
  onStartApplication,
}) => {
  const [topic, setTopic] = useState<FaqTopic>('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(VERIFIED_GUEST_FAQS[0].id);

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VERIFIED_GUEST_FAQS.filter((item) => {
      if (topic !== 'all' && item.topic !== topic) return false;
      if (!q) return true;
      return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
    });
  }, [topic, query]);

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium text-[#5C6066] hover:text-[#A32035] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Plans</span>
        </button>

        <button
          type="button"
          onClick={onStartApplication}
          className="min-h-[40px] px-4 rounded-full bg-[#A32035] hover:opacity-90 text-xs font-semibold text-white inline-flex items-center gap-1.5 transition-opacity"
        >
          <FilePenLine className="w-3.5 h-3.5" />
          <span>Start an Application</span>
        </button>
      </div>

      {/* Knowledge Center Header + Search */}
      <section className="rounded-3xl border border-[#007A48]/20 bg-[#EAF3EE] p-5 sm:p-7 space-y-4">
        <div>
          <div className="text-xs font-semibold text-[#007A48]">
            Pak-Qatar Family Takaful Knowledge Base
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E2022] mt-1">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6066] mt-1">
            Clear answers about Family Takaful plans, Waqf-Wakalah governance, PIA savings, and contributions.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#5C6066] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions (e.g., Waqf, Education, Elaaj, VPS)..."
            aria-label="Search Frequently Asked Questions"
            className="w-full min-h-[46px] pl-10 pr-4 rounded-2xl border border-[#007A48]/20 bg-white text-sm text-[#1E2022] placeholder:text-[#5C6066] focus:outline-none focus:border-[#A32035]"
          />
        </div>

        <div
          className="inline-flex p-1 rounded-xl bg-white border border-[#E5E7EB] max-w-full overflow-x-auto no-scrollbar"
          role="tablist"
          aria-label="FAQ topic filter"
        >
          {(
            [
              { key: 'all', label: 'All Topics' },
              { key: 'plans', label: 'Plans & Savings' },
              { key: 'shariah', label: 'Shariah & Waqf' },
              { key: 'contributions', label: 'Contributions & Claims' },
            ] as const
          ).map((t) => {
            const active = topic === t.key;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTopic(t.key)}
                className={`relative min-h-[38px] px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                  active ? 'text-white' : 'text-[#5C6066] hover:text-[#1E2022]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="faq-topic-pill"
                    transition={{ duration: 0.22, ease: PQ_EASE }}
                    className="absolute inset-0 rounded-lg bg-[#A32035]"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Expandable Questions List */}
      <section className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        {filteredFaqs.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-sm font-semibold text-[#1E2022]">
              No matching questions found for &ldquo;{query}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setTopic('all');
              }}
              className="min-h-[42px] px-4 rounded-xl border border-[#A32035] text-xs font-semibold text-[#A32035]"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {filteredFaqs.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id} className="py-3">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full min-h-[46px] flex items-start justify-between gap-4 text-left"
                  >
                    <div>
                      <div className="text-[11px] font-semibold text-[#007A48]">
                        {item.topicLabel}
                      </div>
                      <div className="text-sm font-bold text-[#1E2022] mt-0.5 leading-snug">
                        {item.q}
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[#5C6066] shrink-0 mt-1 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#A32035]' : ''
                      }`}
                    />
                  </button>
                  <PqAccordionPanel open={isOpen}>
                    <p className="pt-2 pb-1 text-xs sm:text-sm text-[#5C6066] leading-relaxed">
                      {item.a}
                    </p>
                  </PqAccordionPanel>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Need Further Help Strip */}
      <section className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-[#A32035]">Direct Assistance</div>
          <h2 className="mt-0.5 text-base font-bold text-[#1E2022]">
            Need deeper Shariah details or consultant help?
          </h2>
          <p className="mt-1 text-xs text-[#5C6066]">
            Explore Waqf &amp; Tabarru governance or speak directly with Pak-Qatar support.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenShariah}
            className="min-h-[44px] px-4 rounded-xl bg-[#007A48] hover:opacity-90 text-white text-xs font-semibold whitespace-nowrap"
          >
            Open Shariah Centre
          </button>
          <button
            type="button"
            onClick={onOpenContact}
            className="min-h-[44px] px-4 rounded-xl border border-[#A32035] text-xs font-semibold text-[#A32035] hover:bg-[#EAF3EE] inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Contact Us</span>
          </button>
        </div>
      </section>
    </div>
  );
};

/* ============================================================================
 * 4. Dedicated Destination: Guest Contact & Branch Directory Screen
 * ========================================================================== */

interface GuestContactScreenProps {
  onBack: () => void;
  onStartApplication: () => void;
  onOpenFaqs: () => void;
}

export const GuestContactScreen: React.FC<GuestContactScreenProps> = ({
  onBack,
  onStartApplication,
  onOpenFaqs,
}) => {
  const [cityFilter, setCityFilter] = useState<'All' | 'Karachi' | 'Lahore' | 'Islamabad'>('All');
  const [agentQuery, setAgentQuery] = useState('PQF-AGT-1042');
  const [agentChecked, setAgentChecked] = useState(false);
  const [agentResult, setAgentResult] = useState<(typeof DEMO_AGENTS)[number] | null>(null);

  const branches = useMemo(() => {
    if (cityFilter === 'All') return DEMO_BRANCHES;
    return DEMO_BRANCHES.filter((b) => b.city === cityFilter);
  }, [cityFilter]);

  const handleVerifyAgent = () => {
    const match = DEMO_AGENTS.find(
      (a) => a.code.toLowerCase() === agentQuery.trim().toLowerCase()
    );
    setAgentResult(match ?? null);
    setAgentChecked(true);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium text-[#5C6066] hover:text-[#A32035] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Plans</span>
        </button>

        <button
          type="button"
          onClick={onStartApplication}
          className="min-h-[40px] px-4 rounded-full bg-[#A32035] hover:opacity-90 text-xs font-semibold text-white inline-flex items-center gap-1.5 transition-opacity"
        >
          <FilePenLine className="w-3.5 h-3.5" />
          <span>Start an Application</span>
        </button>
      </div>

      {/* Header */}
      <section className="rounded-3xl border border-[#007A48]/20 bg-[#EAF3EE] p-5 sm:p-7">
        <div className="text-xs font-semibold text-[#007A48]">
          {PQFS_VERIFIED_CONTACT.companyGroup}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1E2022] mt-1">
          Contact Pak-Qatar Support
        </h1>
        <p className="text-xs sm:text-sm text-[#5C6066] mt-1.5 max-w-2xl leading-relaxed">
          Reach verified PQFTL helpline specialists, inspect branch offices across Pakistan, or check active consultant credentials.
        </p>

        {/* Official Verified Contact Grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-4 flex flex-col justify-between gap-3">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#A32035]/10 text-[#A32035] flex items-center justify-center mb-2.5">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div className="font-semibold text-[#5C6066]">UAN Helpline</div>
              <div className="text-sm font-bold text-[#1E2022] mt-1 tabular-nums">
                {PQFS_VERIFIED_CONTACT.uan}
              </div>
            </div>
            <a
              href="tel:+9221111825238"
              className="min-h-[40px] px-3.5 rounded-xl bg-[#A32035] text-white font-semibold inline-flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Helpline</span>
            </a>
          </div>

          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-4 flex flex-col justify-between gap-3">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#007A48]/10 text-[#007A48] flex items-center justify-center mb-2.5">
                <Mail className="w-4 h-4" />
              </div>
              <div className="font-semibold text-[#5C6066]">Email &amp; Digital Desk</div>
              <div className="text-sm font-bold text-[#1E2022] mt-1 break-all">
                {PQFS_VERIFIED_CONTACT.email}
              </div>
              <div className="mt-1.5 text-[#5C6066] inline-flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#007A48] shrink-0" />
                <span>{PQFS_VERIFIED_CONTACT.whatsappInfo}</span>
              </div>
            </div>
            <a
              href={`mailto:${PQFS_VERIFIED_CONTACT.email}`}
              className="min-h-[40px] px-3.5 rounded-xl border border-[#007A48] text-[#007A48] hover:bg-[#EAF3EE] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Email</span>
            </a>
          </div>

          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-4 flex flex-col justify-between gap-3">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#F5B335]/20 text-[#1E2022] flex items-center justify-center mb-2.5">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="font-semibold text-[#5C6066]">Head Office &amp; Portal</div>
              <div className="text-xs text-[#1E2022] mt-1 leading-relaxed">
                {PQFS_VERIFIED_CONTACT.headOffice}
              </div>
            </div>
            <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-[#007A48] font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>{PQFS_VERIFIED_CONTACT.website}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Branch Locator + Agent Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Branch Locator */}
        <section className="lg:col-span-7 rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#1E2022]">Branch Offices</h2>
              <p className="text-xs text-[#5C6066] mt-0.5">
                Pak-Qatar Family Takaful customer service centers
              </p>
            </div>

            <div
              className="inline-flex p-1 rounded-xl bg-[#F4F4F5] border border-[#E5E7EB]"
              role="tablist"
              aria-label="Filter branch offices by city"
            >
              {(['All', 'Karachi', 'Lahore', 'Islamabad'] as const).map((city) => (
                <button
                  key={city}
                  type="button"
                  role="tab"
                  aria-selected={cityFilter === city}
                  onClick={() => setCityFilter(city)}
                  className={`min-h-[34px] px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    cityFilter === city
                      ? 'bg-white text-[#A32035] shadow-xs'
                      : 'text-[#5C6066] hover:text-[#1E2022]'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[#E5E7EB]">
            {branches.map((b) => (
              <div key={b.branch} className="py-3.5 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#A32035]/10 text-[#A32035] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#1E2022]">{b.branch}</div>
                  <div className="text-xs text-[#5C6066] mt-0.5 leading-relaxed">{b.address}</div>
                  <div className="text-[11px] font-medium text-[#007A48] mt-1">{b.hours}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Consultant Verification + Quick FAQ Link */}
        <div className="lg:col-span-5 space-y-5">
          <section className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6 space-y-3">
            <h2 className="text-base font-bold text-[#1E2022]">Consultant Verification (Demo)</h2>
            <p className="text-xs text-[#5C6066] leading-relaxed">
              Verify an authorized PQFTL consultant code (sample codes:{' '}
              <span className="font-semibold text-[#1E2022]">PQF-AGT-1042</span> or{' '}
              <span className="font-semibold text-[#1E2022]">PQF-AGT-2088</span>).
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={agentQuery}
                onChange={(e) => setAgentQuery(e.target.value)}
                aria-label="Consultant Code"
                className="flex-1 min-h-[44px] px-3.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#1E2022]"
              />
              <button
                type="button"
                onClick={handleVerifyAgent}
                className="min-h-[44px] px-4 rounded-xl bg-[#007A48] hover:opacity-90 text-white text-xs font-semibold transition-opacity"
              >
                Verify
              </button>
            </div>
            {agentResult ? (
              <div className="p-3.5 rounded-2xl bg-[#EAF3EE] border border-[#007A48]/20 text-xs space-y-1">
                <div className="font-bold text-[#1E2022] inline-flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-[#007A48]" />
                  <span>{agentResult.name}</span>
                </div>
                <div className="text-[#5C6066]">
                  {agentResult.entity} · {agentResult.region}
                </div>
                <div className="text-[#007A48] font-semibold">{agentResult.status}</div>
              </div>
            ) : (
              agentChecked && (
                <div className="text-xs text-[#A32035] font-medium">
                  No matching consultant found in demonstration registry.
                </div>
              )
            )}
          </section>

          <section className="rounded-3xl border border-[#A32035]/20 bg-white p-5 space-y-3">
            <div className="text-xs font-semibold text-[#A32035]">Quick Answers</div>
            <h3 className="text-sm font-bold text-[#1E2022]">Have a general question first?</h3>
            <p className="text-xs text-[#5C6066]">
              Browse our categorized FAQs for immediate guidance on plans, Waqf governance, and contributions.
            </p>
            <button
              type="button"
              onClick={onOpenFaqs}
              className="w-full min-h-[44px] rounded-xl border border-[#A32035] text-xs font-semibold text-[#A32035] hover:bg-[#EAF3EE] transition-colors"
            >
              Browse FAQs
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 5. Dedicated Destination: 4-Step Start an Application Journey
 * ========================================================================== */

interface GuestApplicationWizardProps {
  initialProduct?: TakafulProduct | null;
  initialMonthlyPkr?: number;
  initialYears?: number;
  onBack: () => void;
  onHandoffToRegister: (product: TakafulProduct) => void;
  onExploreProducts: () => void;
}

const WIZARD_STEPS = [
  { num: 1, title: 'Select Plan' },
  { num: 2, title: 'Contribution' },
  { num: 3, title: 'Applicant Info' },
  { num: 4, title: 'Review & Submit' },
] as const;

export const GuestApplicationWizard: React.FC<GuestApplicationWizardProps> = ({
  initialProduct,
  initialMonthlyPkr,
  initialYears,
  onBack,
  onHandoffToRegister,
  onExploreProducts,
}) => {
  const startingProduct = initialProduct ?? TAKAFUL_PRODUCTS[0];
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [stepDir, setStepDir] = useState<TransitionDirection>('forward');
  const [categoryFilter, setCategoryFilter] = useState<FamilyProductCategory>('all');
  const [categoryDirection, setCategoryDirection] = useState<number>(1);

  const handleWizardCategoryChange = (nextCat: FamilyProductCategory) => {
    setCategoryDirection(
      GUEST_CATEGORY_ORDER[nextCat] >= GUEST_CATEGORY_ORDER[categoryFilter] ? 1 : -1
    );
    setCategoryFilter(nextCat);
  };

  const [selectedPlanId, setSelectedPlanId] = useState<string>(startingProduct.id);
  const selectedPlan =
    TAKAFUL_PRODUCTS.find((p) => p.id === selectedPlanId) ?? TAKAFUL_PRODUCTS[0];

  const [frequency, setFrequency] = useState<'Monthly' | 'Quarterly' | 'Annual'>('Monthly');
  const [contributionPkr, setContributionPkr] = useState<string>(
    String(
      Math.max(
        startingProduct.illustrativeMinContributionPkr,
        initialMonthlyPkr ?? startingProduct.illustrativeMinContributionPkr
      )
    )
  );
  const [termYears, setTermYears] = useState<number>(initialYears ?? 15);

  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Karachi');
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeRelation, setNomineeRelation] = useState('Spouse');
  const [declared, setDeclared] = useState(true);

  const [processing, setProcessing] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const filteredPlans = useMemo(() => {
    if (categoryFilter === 'all') return TAKAFUL_PRODUCTS;
    return TAKAFUL_PRODUCTS.filter((p) => p.category === categoryFilter);
  }, [categoryFilter]);

  const handleChoosePlan = (plan: TakafulProduct) => {
    setSelectedPlanId(plan.id);
    const currentNum = Number(contributionPkr || 0);
    if (currentNum < plan.illustrativeMinContributionPkr) {
      setContributionPkr(String(plan.illustrativeMinContributionPkr));
    }
  };

  const goStep = (next: 1 | 2 | 3 | 4) => {
    setStepDir(next >= step ? 'forward' : 'back');
    setStep(next);
  };

  const parsedContribution = Math.max(
    selectedPlan.illustrativeMinContributionPkr,
    Number(contributionPkr || selectedPlan.illustrativeMinContributionPkr)
  );

  const canProceedStep3 =
    applicantName.trim().length >= 2 && phone.trim().length >= 7 && nomineeName.trim().length >= 2;

  const handleSubmitDemoRequest = () => {
    if (processing || !declared) return;
    void ensureLoadingAssetsReady().then(() => {
      setProcessing(true);
      window.setTimeout(() => {
        const ref = `APP-PQF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        setProcessing(false);
        setSubmittedRef(ref);
      }, 2000);
    });
  };

  return (
    <div className="space-y-5 pb-12 max-w-3xl mx-auto">
      <ProcessingOverlay
        visible={processing}
        title="Submitting Your Proposal Request"
        subtitle={`Preparing Pak-Qatar Family Takaful summary for ${selectedPlan.name}...`}
      />

      {!submittedRef && (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              if (step > 1) {
                goStep((step - 1) as 1 | 2 | 3 | 4);
              } else {
                onBack();
              }
            }}
            className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium text-[#5C6066] hover:text-[#A32035] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step > 1 ? 'Previous Step' : 'Back to Explore Plans'}</span>
          </button>

          <div className="text-xs font-semibold text-[#A32035] tabular-nums">
            Step {step} of 4
          </div>
        </div>
      )}

      {/* Flagship Burgundy Header & Progress Stepper */}
      <section className="rounded-3xl bg-[#A32035] text-white p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="h-1 w-24 rounded-full bg-[#F5B335] mb-3" aria-hidden="true" />
        <div className="text-xs font-semibold text-[#F5B335]">
          Pak-Qatar Family Takaful Limited (PQFTL)
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mt-1">
          {submittedRef ? 'Application Request Logged' : 'Start a Family Takaful Application'}
        </h1>
        <p className="text-xs sm:text-sm text-white/85 mt-1">
          {submittedRef
            ? 'Your illustrative Family Takaful proposal summary is ready for underwriting consultation.'
            : 'Complete four quick guided steps to configure your preferred plan and submit or register.'}
        </p>

        {!submittedRef && (
          <div className="mt-5 grid grid-cols-4 gap-2">
            {WIZARD_STEPS.map((s) => {
              const active = step === s.num;
              const completed = step > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  disabled={s.num > step}
                  onClick={() => {
                    if (s.num < step) goStep(s.num);
                  }}
                  className="text-left group disabled:cursor-default"
                >
                  <div
                    className={`h-1.5 rounded-full transition-colors duration-300 ${
                      completed
                        ? 'bg-[#007A48]'
                        : active
                          ? 'bg-[#F5B335]'
                          : 'bg-white/25'
                    }`}
                  />
                  <div
                    className={`mt-1.5 text-[11px] font-semibold truncate ${
                      active ? 'text-[#F5B335]' : completed ? 'text-white' : 'text-white/65'
                    }`}
                  >
                    {s.num}. {s.title}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Main Step Card */}
      <section className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-7">
        {submittedRef ? (
          <div className="text-center py-3 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#EAF3EE] text-[#007A48] flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1E2022]">
                Thank You, {applicantName.trim() || 'Participant'}
              </h2>
              <p className="mt-1.5 text-sm text-[#5C6066] max-w-md mx-auto leading-relaxed">
                Your illustrative proposal request for{' '}
                <span className="font-semibold text-[#1E2022]">{selectedPlan.name}</span> has been recorded for PQFTL consultant review.
              </p>
            </div>

            <div className="max-w-sm mx-auto rounded-2xl bg-[#F7F5F2] border border-[#E5E7EB] p-4 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-[#5C6066]">Reference Number</span>
                <span className="font-bold text-[#A32035] tabular-nums">{submittedRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C6066]">Selected Plan</span>
                <span className="font-semibold text-[#1E2022] text-right">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C6066]">Contribution</span>
                <span className="font-bold text-[#007A48] tabular-nums">
                  PKR {parsedContribution.toLocaleString()} ({frequency})
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => onHandoffToRegister(selectedPlan)}
                className="flex-1 min-h-[48px] px-4 rounded-full bg-[#A32035] hover:opacity-90 text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-opacity"
              >
                <UserCheck className="w-4 h-4" />
                <span>Create Customer Account</span>
              </button>
              <button
                type="button"
                onClick={onBack}
                className="flex-1 min-h-[48px] px-4 rounded-full border border-[#E5E7EB] hover:border-[#A32035] text-[#1E2022] text-xs sm:text-sm font-semibold transition-colors"
              >
                Back to Explore Plans
              </button>
            </div>
          </div>
        ) : (
          <PqTabSwap swapKey={`apply-step-${step}`} direction={stepDir}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-[#1E2022]">1. Choose a Family Takaful Plan</h2>
                    <p className="text-xs text-[#5C6066] mt-0.5">
                      Pick the PQFTL plan tailored to your household protection or savings goal.
                    </p>
                  </div>

                  <div className="inline-flex p-1 rounded-xl bg-[#F4F4F5] border border-[#E5E7EB]">
                    {(
                      [
                        { key: 'all', label: 'All' },
                        { key: 'savings-retirement', label: 'Savings' },
                        { key: 'health-group', label: 'Health & Group' },
                      ] as const
                    ).map((c) => {
                      const active = categoryFilter === c.key;
                      return (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() => handleWizardCategoryChange(c.key)}
                          className={`relative min-h-[34px] px-3 rounded-lg text-xs font-semibold transition-colors ${
                            active ? 'text-[#A32035]' : 'text-[#5C6066] hover:text-[#1E2022]'
                          }`}
                        >
                          {active && (
                            <motion.span
                              layoutId="wizard-category-pill"
                              transition={{ duration: 0.22, ease: PQ_EASE }}
                              className="absolute inset-0 rounded-lg bg-white shadow-xs"
                              aria-hidden="true"
                            />
                          )}
                          <span className="relative z-10">{c.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <PqCategoryReveal swapKey={categoryFilter} direction={categoryDirection}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredPlans.map((plan) => {
                      const active = plan.id === selectedPlan.id;
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => handleChoosePlan(plan)}
                          className={`pq-card-interactive p-4 rounded-2xl border text-left transition-colors flex items-start gap-3 ${
                            active
                              ? 'border-[#A32035] bg-[#EAF3EE]/60'
                              : 'border-[#E5E7EB] bg-white hover:border-[#A32035]'
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              active ? 'bg-[#A32035] text-white' : 'bg-[#F4F4F5] text-[#007A48]'
                            }`}
                          >
                            <ProductIcon iconKey={plan.iconKey} className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-[#1E2022] leading-snug">
                              {plan.name}
                            </div>
                            <div className="text-[11px] text-[#5C6066] mt-0.5 line-clamp-2">
                              {plan.shortTagline}
                            </div>
                            <div className="mt-2 text-[11px] font-bold text-[#007A48] tabular-nums">
                              From PKR {plan.illustrativeMinContributionPkr.toLocaleString()}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </PqCategoryReveal>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={onExploreProducts}
                    className="min-h-[48px] px-5 rounded-full border border-[#E5E7EB] hover:border-[#A32035] text-xs font-semibold text-[#1E2022] transition-colors"
                  >
                    Compare All Products First
                  </button>
                  <button
                    type="button"
                    onClick={() => goStep(2)}
                    className="flex-1 min-h-[48px] px-5 rounded-full bg-[#A32035] hover:opacity-90 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-opacity"
                  >
                    <span>Continue with {selectedPlan.name}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-[#1E2022]">
                    2. Coverage &amp; Contribution Preferences
                  </h2>
                  <p className="text-xs text-[#5C6066] mt-0.5">
                    Configure your illustrative payment schedule for{' '}
                    <span className="font-semibold text-[#A32035]">{selectedPlan.name}</span>.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-[#1E2022] mb-2">
                      Contribution Schedule
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Monthly', 'Quarterly', 'Annual'] as const).map((freq) => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => setFrequency(freq)}
                          className={`min-h-[44px] rounded-xl border text-xs font-semibold transition-colors ${
                            frequency === freq
                              ? 'border-[#A32035] bg-[#A32035] text-white'
                              : 'border-[#E5E7EB] bg-white text-[#1E2022] hover:border-[#A32035]'
                          }`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1E2022] mb-1.5">
                        Illustrative Contribution (PKR)
                      </label>
                      <input
                        type="number"
                        min={selectedPlan.illustrativeMinContributionPkr}
                        step={500}
                        value={contributionPkr}
                        onChange={(e) => setContributionPkr(e.target.value)}
                        className="w-full min-h-[46px] px-3.5 rounded-xl border border-[#E5E7EB] text-sm font-semibold tabular-nums focus:outline-none focus:border-[#A32035]"
                      />
                      <div className="mt-1 text-[11px] text-[#5C6066] tabular-nums">
                        Plan minimum: PKR {selectedPlan.illustrativeMinContributionPkr.toLocaleString()}
                      </div>
                    </div>

                    {selectedPlan.isInvestmentLinked ? (
                      <div>
                        <label className="block text-xs font-semibold text-[#1E2022] mb-1.5">
                          Target Plan Horizon
                        </label>
                        <PqSelect
                          ariaLabel="Target Plan Horizon"
                          value={String(termYears)}
                          onChange={(val) => setTermYears(Number(val))}
                          options={[
                            { value: '5', label: '5 Years' },
                            { value: '10', label: '10 Years' },
                            { value: '15', label: '15 Years' },
                            { value: '20', label: '20 Years' },
                            { value: '25', label: '25 Years' },
                          ]}
                        />
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-[#EAF3EE] border border-[#007A48]/20 p-3.5 text-xs">
                        <div className="font-semibold text-[#007A48]">Pure Waqf Annual Cover</div>
                        <p className="text-[#5C6066] mt-1 leading-relaxed">
                          Health and Group Family certificates operate on renewable annual Waqf coverage schedules.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => goStep(1)}
                    className="min-h-[48px] px-5 rounded-full border border-[#E5E7EB] text-xs font-semibold text-[#5C6066] hover:text-[#1E2022]"
                  >
                    Change Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => goStep(3)}
                    className="flex-1 min-h-[48px] px-5 rounded-full bg-[#A32035] hover:opacity-90 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-opacity"
                  >
                    <span>Next: Applicant Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-[#1E2022]">
                    3. Applicant &amp; Beneficiary Details
                  </h2>
                  <p className="text-xs text-[#5C6066] mt-0.5">
                    Enter contact details so a Pak-Qatar consultant can prepare your personalized illustration.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#1E2022] mb-1">
                      Applicant Full Name <span className="text-[#A32035]">*</span>
                    </label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g., Ahmed Tariq"
                      className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#A32035]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E2022] mb-1">
                      Mobile Number <span className="text-[#A32035]">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="03XX-XXXXXXX"
                      className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E5E7EB] text-sm tabular-nums focus:outline-none focus:border-[#A32035]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#1E2022] mb-1">City</label>
                    <PqSelect
                      ariaLabel="City"
                      value={city}
                      onChange={setCity}
                      options={[
                        { value: 'Karachi', label: 'Karachi' },
                        { value: 'Lahore', label: 'Lahore' },
                        { value: 'Islamabad', label: 'Islamabad' },
                        { value: 'Rawalpindi', label: 'Rawalpindi' },
                        { value: 'Multan', label: 'Multan' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E2022] mb-1">
                      Nominee Relationship
                    </label>
                    <PqSelect
                      ariaLabel="Nominee Relationship"
                      value={nomineeRelation}
                      onChange={setNomineeRelation}
                      options={[
                        { value: 'Spouse', label: 'Spouse' },
                        { value: 'Son', label: 'Son' },
                        { value: 'Daughter', label: 'Daughter' },
                        { value: 'Parent', label: 'Parent' },
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E2022] mb-1">
                    Beneficiary / Nominee Full Name <span className="text-[#A32035]">*</span>
                  </label>
                  <input
                    type="text"
                    value={nomineeName}
                    onChange={(e) => setNomineeName(e.target.value)}
                    placeholder="e.g., Bilal Tariq"
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#A32035]"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => goStep(2)}
                    className="min-h-[48px] px-5 rounded-full border border-[#E5E7EB] text-xs font-semibold text-[#5C6066]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={!canProceedStep3}
                    onClick={() => goStep(4)}
                    className="flex-1 min-h-[48px] px-5 rounded-full bg-[#A32035] hover:opacity-90 disabled:opacity-45 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-opacity"
                  >
                    <span>Review Application</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-[#1E2022]">
                    4. Review &amp; Submit Proposal Request
                  </h2>
                  <p className="text-xs text-[#5C6066] mt-0.5">
                    Verify your Family Takaful selection below or proceed with full account registration.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F7F5F2] border border-[#E5E7EB] p-4 space-y-2.5 text-xs">
                  <div className="flex justify-between gap-2">
                    <span className="text-[#5C6066]">PQFTL Plan</span>
                    <span className="font-bold text-[#1E2022] text-right">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#5C6066]">Contribution</span>
                    <span className="font-bold text-[#A32035] tabular-nums">
                      PKR {parsedContribution.toLocaleString()} · {frequency}
                    </span>
                  </div>
                  {selectedPlan.isInvestmentLinked && (
                    <div className="flex justify-between gap-2">
                      <span className="text-[#5C6066]">Target Term</span>
                      <span className="font-semibold text-[#1E2022] tabular-nums">{termYears} Years</span>
                    </div>
                  )}
                  <div className="flex justify-between gap-2">
                    <span className="text-[#5C6066]">Applicant</span>
                    <span className="font-semibold text-[#1E2022] text-right">
                      {applicantName} · {city}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#5C6066]">Mobile</span>
                    <span className="font-semibold text-[#1E2022] tabular-nums">{phone}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#5C6066]">Nominee</span>
                    <span className="font-semibold text-[#1E2022] text-right">
                      {nomineeName} ({nomineeRelation})
                    </span>
                  </div>
                </div>

                <label className="flex items-start gap-2.5 text-xs text-[#5C6066] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={declared}
                    onChange={(e) => setDeclared(e.target.checked)}
                    className="mt-0.5 accent-[#A32035] w-4 h-4 shrink-0"
                  />
                  <span>
                    I acknowledge this demonstration request logs an illustrative Family Takaful proposal and requires formal KYC and underwriting before certificate issuance.
                  </span>
                </label>

                <div className="pt-1 space-y-2.5">
                  <button
                    type="button"
                    disabled={!declared}
                    onClick={handleSubmitDemoRequest}
                    className="w-full min-h-[48px] px-5 rounded-full bg-[#A32035] hover:opacity-90 disabled:opacity-45 text-white text-sm font-semibold transition-opacity"
                  >
                    Submit Illustrative Application Request
                  </button>
                  <button
                    type="button"
                    onClick={() => onHandoffToRegister(selectedPlan)}
                    className="w-full min-h-[46px] px-5 rounded-full border border-[#007A48] bg-white hover:bg-[#EAF3EE] text-[#007A48] text-xs sm:text-sm font-semibold transition-colors"
                  >
                    Continue with Customer Account Registration
                  </button>
                </div>
              </div>
            )}
          </PqTabSwap>
        )}
      </section>
    </div>
  );
};
