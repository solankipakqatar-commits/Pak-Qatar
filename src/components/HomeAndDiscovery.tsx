import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Coins,
  CreditCard,
  FilePenLine,
  FileText,
  Headphones,
  HeartPulse,
  HelpCircle,
  PhoneCall,
  Scale,
  Shield,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  AppNotification,
  ContributionPayment,
  LanguageCode,
  NavTab,
  TakafulCertificate,
  TakafulClaim,
  TakafulEntity,
  TakafulProduct,
} from '../types/pqfs';
import { DEMO_CUSTOMER, TAKAFUL_PRODUCTS } from '../data/pqfsData';
import { ProductIcon, TakafulWheel } from './TakafulWheel';
import { ensureLoadingAssetsReady, PakQatarLogo, ProcessingOverlay } from './BrandAssets';
import { ContributionCalculatorView } from './ContributionCalculatorView';
import {
  PqAccordionPanel,
  PqModal,
  PqStaggerGroup,
  PqStaggerItem,
  PqTabSwap,
} from './MotionPrimitives';

export type GuestHomeSection = 'overview' | 'calculator' | 'faqs';

interface GuestHomeViewProps {
  language: LanguageCode;
  guestSection: GuestHomeSection;
  onGuestSectionChange: (section: GuestHomeSection) => void;
  wheelEntity: TakafulEntity;
  onWheelEntityChange: (entity: TakafulEntity) => void;
  onSelectProduct: (product: TakafulProduct) => void;
  onOpenShariah: () => void;
  onOpenSupport: () => void;
  onStartApplication: (product: TakafulProduct) => void;
  onBackToWelcome: () => void;
}

export const GuestHomeView: React.FC<GuestHomeViewProps> = ({
  language,
  guestSection,
  onGuestSectionChange,
  wheelEntity,
  onWheelEntityChange,
  onSelectProduct,
  onOpenShariah,
  onOpenSupport,
  onStartApplication,
  onBackToWelcome,
}) => {
  const [compareIds, setCompareIds] = useState<[string, string]>([
    'ft-family-savings',
    'ft-child-education',
  ]);
  const [calcProductId, setCalcProductId] = useState<string>('ft-family-savings');
  const [calcMonthlyPkr, setCalcMonthlyPkr] = useState<number>(10000);
  const [calcYears, setCalcYears] = useState<number>(15);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const compareA = TAKAFUL_PRODUCTS.find((p) => p.id === compareIds[0]) ?? TAKAFUL_PRODUCTS[0];
  const compareB = TAKAFUL_PRODUCTS.find((p) => p.id === compareIds[1]) ?? TAKAFUL_PRODUCTS[1];

  const guestFaqs = [
    {
      q: 'How is Pak-Qatar Family Takaful separate from General Takaful?',
      a: 'Pak-Qatar Family Takaful Limited (PQFTL) provides long-term protection, education, retirement, and health plans, whereas Pak-Qatar General Takaful Limited (PQGTL) covers motor, property, travel, and commercial risks. Their funds and certificates remain strictly separate.',
    },
    {
      q: 'Are the contribution amounts shown here final quotes?',
      a: 'No. Figures shown in guest discovery and the calculator are illustrative demonstration numbers only. Final contributions are issued after formal underwriting.',
    },
    {
      q: 'Can I explore products before registering?',
      a: 'Yes. You can rotate the 360° Product Selector, compare plans, read Shariah information, and estimate contributions before starting an application.',
    },
    {
      q: 'How do Waqf, Tabarru, and Wakalah work in Takaful?',
      a: 'Participants contribute into a Shariah-governed Waqf risk pool (Tabarru) for mutual assistance, while Pak-Qatar serves as Wakil under a transparent Wakalah fee structure. Separate Family Takaful plans also allocate units into your Participant Investment Account (PIA).',
    },
  ];

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderGuestContent = () => {
    if (guestSection === 'calculator') {
      return (
        <ContributionCalculatorView
          calcProductId={calcProductId}
          onCalcProductIdChange={setCalcProductId}
          calcMonthlyPkr={calcMonthlyPkr}
          onCalcMonthlyPkrChange={setCalcMonthlyPkr}
          calcYears={calcYears}
          onCalcYearsChange={setCalcYears}
          onBack={() => onGuestSectionChange('overview')}
          onSelectProduct={onSelectProduct}
          onStartApplication={onStartApplication}
        />
      );
    }

    if (guestSection === 'faqs') {
      return (
        <div className="space-y-6 pb-10 max-w-3xl mx-auto">
          <button
            type="button"
            onClick={() => onGuestSectionChange('overview')}
            className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium text-[#5C6066] hover:text-[#A32035]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explore Plans</span>
          </button>

          <section className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
            <h1 className="text-xl font-bold text-[#1E2022] mb-1">Frequently Asked Questions</h1>
            <p className="text-xs text-[#5C6066] mb-4">
              Clear answers about Family Takaful, General Takaful, and our Shariah model.
            </p>
            <div className="divide-y divide-[#E5E7EB]">
              {guestFaqs.map((item, idx) => (
                <div key={item.q} className="py-2.5">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                    className="w-full min-h-[44px] flex items-center justify-between gap-3 text-left text-sm font-semibold text-[#1E2022]"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#5C6066] shrink-0 transition-transform duration-200 ${
                        openFaqIdx === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <PqAccordionPanel open={openFaqIdx === idx}>
                    <p className="pb-2 text-xs text-[#5C6066] leading-relaxed">{item.a}</p>
                  </PqAccordionPanel>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[#007A48]/20 bg-[#EAF3EE] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#007A48]">Shariah Transparency</div>
              <h2 className="mt-1 text-base font-bold text-[#1E2022]">
                Understand Waqf, Tabarru &amp; Wakalah
              </h2>
              <p className="mt-1 text-xs text-[#5C6066] max-w-lg">
                Explore how cooperative participant funds are structured and reviewed under Shariah governance.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={onOpenShariah}
                className="min-h-[44px] px-4 rounded-xl bg-[#007A48] hover:opacity-90 text-white text-xs font-semibold"
              >
                Open Shariah Centre
              </button>
              <button
                type="button"
                onClick={onOpenSupport}
                className="min-h-[44px] px-4 rounded-xl bg-white border border-[#E5E7EB] text-xs font-semibold text-[#1E2022]"
              >
                Contact Us
              </button>
            </div>
          </section>
        </div>
      );
    }

    return (
      <div className="space-y-8 pb-8">
      {/* Screen 2 Reference Guest Home Hero + Action Menu List */}
      <section className="max-w-xl mx-auto lg:max-w-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div>
              <div className="text-xs font-semibold text-[#007A48] mb-1">
                {language === 'ur' ? 'السلام علیکم · مہمان رسائی' : 'Assalam-o-Alaikum · Guest Exploration'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1E2022] leading-tight">
                Explore Our{' '}
                <span className="text-[#A32035]">Takaful Plans</span>
              </h1>
              <p className="mt-2 text-sm text-[#5C6066] leading-relaxed">
                Learn, compare and find the right plan for you and your family.
              </p>
            </div>

            {/* 5 Vertical White Action Cards matching Screen 2 */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => scrollToElement('guest-360-wheel')}
                className="pq-card-interactive w-full min-h-[56px] px-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#A32035] shadow-2xs flex items-center justify-between gap-3 transition-colors text-left"
              >
                <span className="inline-flex items-center gap-3 min-w-0">
                  <ShieldCheck className="w-5 h-5 text-[#A32035] shrink-0" />
                  <span className="text-sm font-semibold text-[#1E2022] truncate">
                    Family &amp; General Takaful Products
                  </span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#5C6066] shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => scrollToElement('guest-compare')}
                className="pq-card-interactive w-full min-h-[56px] px-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#A32035] shadow-2xs flex items-center justify-between gap-3 transition-colors text-left"
              >
                <span className="inline-flex items-center gap-3 min-w-0">
                  <Scale className="w-5 h-5 text-[#A32035] shrink-0" />
                  <span className="text-sm font-semibold text-[#1E2022] truncate">
                    Compare Plans
                  </span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#5C6066] shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => onGuestSectionChange('calculator')}
                className="pq-card-interactive w-full min-h-[56px] px-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#A32035] shadow-2xs flex items-center justify-between gap-3 transition-colors text-left"
              >
                <span className="inline-flex items-center gap-3 min-w-0">
                  <Calculator className="w-5 h-5 text-[#A32035] shrink-0" />
                  <span className="text-sm font-semibold text-[#1E2022] truncate">
                    Contribution Calculator
                  </span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#5C6066] shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => onGuestSectionChange('faqs')}
                className="pq-card-interactive w-full min-h-[56px] px-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#A32035] shadow-2xs flex items-center justify-between gap-3 transition-colors text-left"
              >
                <span className="inline-flex items-center gap-3 min-w-0">
                  <HelpCircle className="w-5 h-5 text-[#A32035] shrink-0" />
                  <span className="text-sm font-semibold text-[#1E2022] truncate">
                    FAQs
                  </span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#5C6066] shrink-0" />
              </button>

              <button
                type="button"
                onClick={onOpenSupport}
                className="pq-card-interactive w-full min-h-[56px] px-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#A32035] shadow-2xs flex items-center justify-between gap-3 transition-colors text-left"
              >
                <span className="inline-flex items-center gap-3 min-w-0">
                  <Headphones className="w-5 h-5 text-[#A32035] shrink-0" />
                  <span className="text-sm font-semibold text-[#1E2022] truncate">
                    Contact Us
                  </span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#5C6066] shrink-0" />
              </button>
            </div>

            {/* Start an Application CTA + Back to Home matching Screen 2 */}
            <div className="pt-1 space-y-2.5 text-center">
              <button
                type="button"
                onClick={() => onStartApplication(TAKAFUL_PRODUCTS[0])}
                className="w-full min-h-[50px] px-5 rounded-full bg-[#A32035] hover:opacity-90 text-white text-sm font-semibold flex items-center justify-between transition-opacity"
              >
                <FilePenLine className="w-4 h-4 shrink-0" />
                <span>Start an Application</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>

              <button
                type="button"
                onClick={onBackToWelcome}
                className="min-h-[36px] text-xs font-semibold text-[#A32035] underline underline-offset-4 hover:opacity-80"
              >
                Back to Home
              </button>
            </div>
          </div>

          {/* Signature 360° Rotating Takaful Product Selector in #EAF3EE */}
          <div
            id="guest-360-wheel"
            className="lg:col-span-6 rounded-3xl border border-[#007A48]/20 bg-[#EAF3EE] p-5 sm:p-6 scroll-mt-16"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-[#A32035] text-balance">
                  Explore Your Takaful Options
                </h2>
                <p className="mt-1 text-xs text-[#5C6066] leading-relaxed max-w-lg">
                  Discover a range of Family and General Takaful solutions designed to meet your protection and financial planning needs.
                </p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onWheelEntityChange('family')}
                  className={`min-h-[34px] px-3 rounded-lg text-xs font-semibold border transition-colors ${
                    wheelEntity === 'family'
                      ? 'bg-[#A32035] text-white border-[#A32035]'
                      : 'bg-white text-[#1E2022] border-[#E5E7EB]'
                  }`}
                >
                  Family
                </button>
                <button
                  type="button"
                  onClick={() => onWheelEntityChange('general')}
                  className={`min-h-[34px] px-3 rounded-lg text-xs font-semibold border transition-colors ${
                    wheelEntity === 'general'
                      ? 'bg-[#007A48] text-white border-[#007A48]'
                      : 'bg-white text-[#1E2022] border-[#E5E7EB]'
                  }`}
                >
                  General
                </button>
              </div>
            </div>

            <TakafulWheel
              entity={wheelEntity}
              onEntityChange={onWheelEntityChange}
              onSelectProduct={onSelectProduct}
            />
          </div>
        </div>
      </section>

      {/* Compare Plans & Shariah Transparency */}
      <div id="guest-compare" className="grid grid-cols-1 lg:grid-cols-12 gap-6 scroll-mt-16">
        <section className="lg:col-span-7 rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#1E2022]">Compare Plans</h2>
              <p className="text-xs text-[#5C6066]">Side-by-side illustrative comparison</p>
            </div>
            <Scale className="w-5 h-5 text-[#A32035]" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <select
              aria-label="First plan to compare"
              value={compareIds[0]}
              onChange={(e) => setCompareIds([e.target.value, compareIds[1]])}
              className="min-h-[42px] px-2.5 rounded-xl border border-[#E5E7EB] bg-[#F7F5F2] text-xs font-medium text-[#1E2022]"
            >
              {TAKAFUL_PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              aria-label="Second plan to compare"
              value={compareIds[1]}
              onChange={(e) => setCompareIds([compareIds[0], e.target.value])}
              className="min-h-[42px] px-2.5 rounded-xl border border-[#E5E7EB] bg-[#F7F5F2] text-xs font-medium text-[#1E2022]"
            >
              {TAKAFUL_PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <PqTabSwap swapKey={`${compareA.id}-${compareB.id}`}>
            <div className="divide-y divide-[#E5E7EB] text-xs">
              <div className="py-2.5 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[#5C6066]">Company</div>
                  <div className="font-semibold text-[#1E2022] mt-0.5">
                    {compareA.entity === 'family' ? 'PQFTL (Family)' : 'PQGTL (General)'}
                  </div>
                </div>
                <div>
                  <div className="text-[#5C6066]">Company</div>
                  <div className="font-semibold text-[#1E2022] mt-0.5">
                    {compareB.entity === 'family' ? 'PQFTL (Family)' : 'PQGTL (General)'}
                  </div>
                </div>
              </div>
              <div className="py-2.5 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[#5C6066]">Illustrative From</div>
                  <div className="font-bold text-[#A32035] tabular-nums mt-0.5">
                    PKR {compareA.illustrativeMinContributionPkr.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[#5C6066]">Illustrative From</div>
                  <div className="font-bold text-[#007A48] tabular-nums mt-0.5">
                    PKR {compareB.illustrativeMinContributionPkr.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="py-2.5 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[#5C6066]">Structure</div>
                  <div className="font-medium text-[#1E2022] mt-0.5">
                    {compareA.isInvestmentLinked ? 'Unit-Linked PIA' : 'Pure Waqf Risk Pool'}
                  </div>
                </div>
                <div>
                  <div className="text-[#5C6066]">Structure</div>
                  <div className="font-medium text-[#1E2022] mt-0.5">
                    {compareB.isInvestmentLinked ? 'Unit-Linked PIA' : 'Pure Waqf Risk Pool'}
                  </div>
                </div>
              </div>
              <div className="pt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onSelectProduct(compareA)}
                  className="min-h-[42px] rounded-xl border border-[#E5E7EB] hover:border-[#A32035] font-medium text-[#1E2022]"
                >
                  View Plan A
                </button>
                <button
                  type="button"
                  onClick={() => onSelectProduct(compareB)}
                  className="min-h-[42px] rounded-xl border border-[#E5E7EB] hover:border-[#A32035] font-medium text-[#1E2022]"
                >
                  View Plan B
                </button>
              </div>
            </div>
          </PqTabSwap>
        </section>

        <section className="lg:col-span-5 rounded-3xl border border-[#007A48]/20 bg-[#EAF3EE] p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-[#007A48]">Shariah Transparency</div>
            <h2 className="mt-1 text-lg font-bold text-[#1E2022]">
              Understand Waqf, Tabarru &amp; Wakalah
            </h2>
            <p className="mt-2 text-sm text-[#5C6066] leading-relaxed">
              Learn how participant contributions operate inside our cooperative Takaful Waqf structure and how independent Shariah reviews safeguard compliance.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={onOpenShariah}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#007A48] hover:opacity-90 text-white text-xs font-medium transition-opacity"
            >
              Open Shariah Centre
            </button>
            <button
              type="button"
              onClick={onOpenSupport}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#A32035] text-xs font-medium text-[#1E2022] inline-flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#A32035]" />
              <span>Contact Us</span>
            </button>
          </div>
        </section>
      </div>
    </div>
    );
  };

  return <PqTabSwap swapKey={guestSection}>{renderGuestContent()}</PqTabSwap>;
};

interface CustomerDashboardViewProps {
  language: LanguageCode;
  maskSensitive: boolean;
  certificates: TakafulCertificate[];
  payments: ContributionPayment[];
  claims: TakafulClaim[];
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenCertificatesList: () => void;
  onOpenInvestments: () => void;
  onOpenSupport: () => void;
  onPayDue: (payment: ContributionPayment) => void;
  onOpenCertificate: (cert: TakafulCertificate) => void;
  onOpenElaajCard: () => void;
}

export const CustomerDashboardView: React.FC<CustomerDashboardViewProps> = ({
  language,
  maskSensitive,
  certificates,
  payments,
  claims,
  notifications,
  onMarkAllRead,
  onNavigateTab,
  onOpenCertificatesList,
  onOpenInvestments,
  onOpenSupport,
  onPayDue,
  onOpenCertificate,
  onOpenElaajCard,
}) => {
  const [notifOpen, setNotifOpen] = useState(false);

  const familyCerts = certificates.filter((c) => c.entity === 'family' && c.status === 'Active');
  const generalCerts = certificates.filter((c) => c.entity === 'general' && c.status === 'Active');

  const familyTotalInvestmentPkr = familyCerts.reduce(
    (sum, c) => sum + (c.participantInvestmentAccountPkr ?? 0),
    0
  );
  const familyTotalBenefitPkr = familyCerts.reduce((sum, c) => sum + c.coveredBenefitPkr, 0);
  const generalTotalBenefitPkr = generalCerts.reduce((sum, c) => sum + c.coveredBenefitPkr, 0);

  const nextDue =
    payments.find((p) => p.status === 'Due') ?? payments.find((p) => p.status === 'Scheduled');
  const activeClaims = claims.filter((c) => c.currentStage !== 'Completed');
  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatMoney = (val: number) =>
    maskSensitive ? 'PKR •••••••' : `PKR ${val.toLocaleString()}`;

  return (
    <div className="space-y-6 pb-8">
      {/* Screen 7 Top Greeting Header + Notification Bell */}
      <section className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E2022]">
            {language === 'ur' ? 'السلام علیکم!' : 'Assalam-o-Alaikum!'}
          </h1>
          <p className="mt-0.5 text-sm text-[#5C6066]">
            Here&apos;s your Takaful overview.
          </p>
          <div className="mt-1 text-[11px] text-[#5C6066] flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#1E2022]">{DEMO_CUSTOMER.fullName}</span>
            <span aria-hidden="true">·</span>
            <span>{DEMO_CUSTOMER.customerId}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#007A48] font-medium">Illustrative Demo Portfolio</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setNotifOpen(true)}
          aria-label="View notifications"
          className="relative min-h-[44px] min-w-[44px] rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#A32035] hover:border-[#A32035] shrink-0"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#A32035] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
              {unreadCount}
            </span>
          )}
        </button>
      </section>

      {/* Screen 7 Prominent Burgundy Hero Card: My Certificates */}
      <PqStaggerGroup className="space-y-6">
        <PqStaggerItem>
          <button
            type="button"
            onClick={onOpenCertificatesList}
            className="pq-card-interactive w-full text-left rounded-3xl bg-[#A32035] hover:opacity-95 p-5 sm:p-6 text-white flex items-center justify-between gap-4 transition-opacity shadow-xs"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-bold text-white">My Certificates</div>
                <div className="text-xs text-white/90 mt-0.5">
                  {familyCerts.length} Family Takaful · {generalCerts.length} General Takaful Active
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white shrink-0" />
          </button>
        </PqStaggerItem>

        {/* Screen 7 Clean 2x2 Quick Action Tile Grid */}
        <PqStaggerItem>
          <section aria-label="Customer Quick Services" className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <button
              type="button"
              onClick={onOpenInvestments}
              className="pq-card-interactive min-h-[104px] p-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#A32035] flex flex-col items-center justify-center gap-2.5 text-center transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F7F5F2] text-[#A32035] flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-[#1E2022]">Contributions</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('payments')}
              className="pq-card-interactive min-h-[104px] p-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#A32035] flex flex-col items-center justify-center gap-2.5 text-center transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F7F5F2] text-[#A32035] flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-[#1E2022]">Payments</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('claims')}
              className="pq-card-interactive min-h-[104px] p-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#A32035] flex flex-col items-center justify-center gap-2.5 text-center transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F7F5F2] text-[#A32035] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-[#1E2022]">Claims</span>
            </button>

            <button
              type="button"
              onClick={onOpenSupport}
              className="pq-card-interactive min-h-[104px] p-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#A32035] flex flex-col items-center justify-center gap-2.5 text-center transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F7F5F2] text-[#A32035] flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-[#1E2022]">Support</span>
            </button>
          </section>
        </PqStaggerItem>

        {/* Screen 7 Subtle Light Green Need Help Card */}
        <PqStaggerItem>
          <button
            type="button"
            onClick={onOpenSupport}
            className="pq-card-interactive w-full text-left rounded-2xl bg-[#EAF3EE] border border-[#007A48]/20 hover:border-[#007A48] p-4 flex items-center justify-between gap-3 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#007A48] flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#1E2022]">Need Help?</div>
                <div className="text-xs text-[#5C6066]">Contact Us · UAN, Branches &amp; Tickets</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#007A48] shrink-0" />
          </button>
        </PqStaggerItem>

        {/* Strictly Separated Company Portfolios: PQFTL vs PQGTL */}
        <PqStaggerItem>
          <section aria-label="Separated Takaful Portfolios">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-[#1E2022]">Separated Company Portfolios</h2>
              <span className="text-[11px] text-[#5C6066]">PQFTL &amp; PQGTL kept distinct</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Family Takaful (PQFTL) */}
              <div className="pq-card-interactive rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#A32035]">Family Takaful · PQFTL</span>
                  <span className="text-xs font-medium text-[#5C6066] tabular-nums">
                    {familyCerts.length} Active Certificates
                  </span>
                </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] text-[#5C6066]">Participant Investment Account</div>
                <div className="text-lg font-bold text-[#1E2022] tabular-nums mt-0.5">
                  {formatMoney(familyTotalInvestmentPkr)}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#5C6066]">Family Sum Covered</div>
                <div className="text-lg font-bold text-[#1E2022] tabular-nums mt-0.5">
                  {formatMoney(familyTotalBenefitPkr)}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={onOpenCertificatesList}
                className="text-xs font-semibold text-[#A32035] hover:underline inline-flex items-center gap-1"
              >
                <span>View Family Certificates</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onOpenElaajCard}
                className="text-xs font-semibold text-[#007A48] hover:underline inline-flex items-center gap-1"
              >
                <HeartPulse className="w-3.5 h-3.5" />
                <span>Elaaj Card</span>
              </button>
            </div>
          </div>

          {/* General Takaful (PQGTL) */}
          <div className="pq-card-interactive rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#007A48]">General Takaful · PQGTL</span>
              <span className="text-xs font-medium text-[#5C6066] tabular-nums">
                {generalCerts.length} Active Policy
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] text-[#5C6066]">Asset / Vehicle Protection</div>
                <div className="text-lg font-bold text-[#1E2022] tabular-nums mt-0.5">
                  {formatMoney(generalTotalBenefitPkr)}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#5C6066]">Next Renewal</div>
                <div className="text-sm font-bold text-[#1E2022] mt-1">
                  {generalCerts[0]?.maturityOrRenewalDate ?? '—'}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() =>
                  generalCerts[0]
                    ? onOpenCertificate(generalCerts[0])
                    : onOpenCertificatesList()
                }
                className="text-xs font-semibold text-[#007A48] hover:underline inline-flex items-center gap-1"
              >
                <span>View General Policy Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('protection')}
                className="text-xs font-semibold text-[#A32035] hover:underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F5B335]" />
                <span>360° Dial</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      </PqStaggerItem>

      {/* Next Due Date & Recent Activity */}
      <PqStaggerItem>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="pq-card-interactive lg:col-span-5 rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#1E2022]">Next Contribution Due</h2>
            {nextDue && (
              <span className="text-xs font-semibold text-[#A32035]">{nextDue.dueDate}</span>
            )}
          </div>
          {nextDue ? (
            <div className="mt-3">
              <div className="text-xs text-[#5C6066]">
                {nextDue.productName} · {nextDue.certificateNumber}
              </div>
              <div className="mt-2 text-2xl font-bold text-[#1E2022] tabular-nums">
                {formatMoney(nextDue.amountPkr)}
              </div>
              <p className="mt-1 text-[11px] text-[#5C6066]">
                Contribution includes Tabarru/Waqf, Wakalah fee, and unit allocation.
              </p>
              <button
                type="button"
                onClick={() => onPayDue(nextDue)}
                className="mt-4 w-full min-h-[44px] rounded-xl bg-[#A32035] hover:opacity-90 text-white text-xs font-medium transition-opacity"
              >
                Pay Now
              </button>
            </div>
          ) : (
            <p className="mt-3 text-xs text-[#007A48] font-medium">
              All scheduled contributions are settled.
            </p>
          )}
        </div>

        <div className="lg:col-span-7 rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#1E2022]">Claims Overview &amp; Recent Activity</h2>
            <button
              type="button"
              onClick={() => onNavigateTab('claims')}
              className="text-xs font-semibold text-[#A32035] hover:underline"
            >
              Claims Centre
            </button>
          </div>
          <div className="divide-y divide-[#E5E7EB]">
            {claims.slice(0, 2).map((claim) => (
              <div key={claim.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#1E2022] truncate">
                    {claim.claimType}
                  </div>
                  <div className="text-[11px] text-[#5C6066] mt-0.5">
                    {claim.referenceNumber} · {claim.submittedDate}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div
                    className={`text-xs font-semibold ${
                      claim.currentStage === 'Completed' ? 'text-[#007A48]' : 'text-[#A32035]'
                    }`}
                  >
                    {claim.currentStage}
                  </div>
                  <div className="text-[11px] text-[#5C6066] tabular-nums">
                    {formatMoney(claim.estimatedAmountPkr)}
                  </div>
                </div>
              </div>
            ))}
            {payments
              .filter((p) => p.status === 'Settled')
              .slice(0, 1)
              .map((pay) => (
                <div key={pay.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-[#1E2022]">
                      Contribution Settled · {pay.productName}
                    </div>
                    <div className="text-[11px] text-[#5C6066] mt-0.5">
                      {pay.referenceNumber} · Paid {pay.paidDate}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-[#007A48] tabular-nums shrink-0">
                    {formatMoney(pay.amountPkr)}
                  </div>
                </div>
              ))}
          </div>
          {activeClaims.length === 0 && (
            <p className="text-xs text-[#5C6066] mt-2">No pending active claims.</p>
          )}
        </div>
      </div>
      </PqStaggerItem>
      </PqStaggerGroup>

      {/* Notifications Drawer/Modal */}
      <PqModal
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        variant="sheet"
        ariaLabel="Notifications"
      >
        <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 border border-[#E5E7EB] max-h-[82vh] overflow-y-auto shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <h3 className="text-base font-bold text-[#1E2022]">Notifications</h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-xs font-medium text-[#A32035]"
              >
                Mark all read
              </button>
              <button
                type="button"
                onClick={() => setNotifOpen(false)}
                className="min-h-[36px] px-2.5 text-xs font-medium text-[#5C6066]"
              >
                Close
              </button>
            </div>
          </div>
          <div className="divide-y divide-[#E5E7EB]">
            {notifications.map((n) => (
              <div key={n.id} className="py-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#1E2022]">{n.title}</span>
                  {!n.read && (
                    <span className="text-[10px] font-semibold text-[#A32035]">Unread</span>
                  )}
                </div>
                <p className="text-xs text-[#5C6066] mt-1">{n.detail}</p>
                <div className="text-[11px] text-[#5C6066] mt-1">{n.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      </PqModal>
    </div>
  );
};

/**
 * Geometric Takaful Shield Emblem replacing any human/family silhouette
 * (strictly compliant: no women or human figures).
 */
const TakafulShieldEmblem: React.FC<{ entity: TakafulEntity }> = ({ entity }) => (
  <svg
    viewBox="0 0 120 128"
    className="w-28 h-28 sm:w-32 sm:h-32 mx-auto select-none"
    aria-hidden="true"
  >
    {/* Outer Burgundy Shield */}
    <path
      d="M60 6 L108 24 V60 C108 89 88 110 60 122 C32 110 12 89 12 60 V24 L60 6 Z"
      fill="#EAF3EE"
      stroke="#A32035"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    {/* Subtle Gold Inner Accent Line */}
    <path
      d="M60 15 L99 30 V59 C99 83 82 101 60 112 C38 101 21 83 21 59 V30 L60 15 Z"
      fill="#FFFFFF"
      stroke="#F5B335"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    {/* Protective Green Islamic Arch & Star Emblem */}
    <path
      d="M60 28 C74 38 83 49 83 63 C83 78 73 90 60 97 C47 90 37 78 37 63 C37 49 46 38 60 28 Z"
      fill={entity === 'family' ? '#A32035' : '#007A48'}
      fillOpacity="0.12"
      stroke="#007A48"
      strokeWidth="2.5"
    />
    {/* Central Geometric Check / Crest */}
    <path
      d="M47 64 L56 73 L74 53"
      fill="none"
      stroke="#007A48"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="60" cy="40" r="3.5" fill="#F5B335" />
  </svg>
);

interface ProductDetailViewProps {
  product: TakafulProduct;
  onBack: () => void;
  onApplyNow: (product: TakafulProduct) => void;
  onOpenShariah: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBack,
  onApplyNow,
  onOpenShariah,
}) => {
  const [docPreview, setDocPreview] = useState<string | null>(null);

  const keyBenefits = [
    product.mainBenefit,
    product.coverageInfo[0] ?? 'Shariah-governed cooperative Takaful structure',
    product.eligibility[0] ?? 'Transparent participant membership terms',
  ];

  const scrollToDetails = () => {
    const el = document.getElementById('product-full-details');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Reference Screen 3 Hero Card */}
      <div className="max-w-lg mx-auto lg:max-w-none bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs">
        {/* Screen 3 Top Bar: Back Arrow + Centered Official Logo */}
        <div className="relative flex items-center justify-center min-h-[44px] mb-4">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to Products"
            className="absolute left-0 min-h-[44px] min-w-[44px] flex items-center justify-start text-[#A32035] hover:opacity-80"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <PakQatarLogo variant="compact" />
        </div>

        <div className="text-center max-w-xl mx-auto">
          <div className="text-[11px] font-semibold text-[#007A48]">{product.companyName}</div>
          <h1 className="text-2xl font-bold text-[#A32035] mt-1">{product.name}</h1>
          <p className="text-sm text-[#5C6066] mt-1.5">{product.shortTagline}</p>

          {/* Geometric Shield Emblem (Zero human/female silhouettes) */}
          <div className="my-5">
            <TakafulShieldEmblem entity={product.entity} />
          </div>
        </div>

        {/* Key Benefits with Green Checkmarks matching Screen 3 */}
        <div className="max-w-md mx-auto">
          <h2 className="text-base font-bold text-[#1E2022] mb-2.5">Key Benefits</h2>
          <ul className="space-y-2.5">
            {keyBenefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5 text-sm text-[#1E2022]">
                <CheckCircle2 className="w-4 h-4 text-[#007A48] shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          {/* Screen 3 Dual Stacked Pill Buttons */}
          <div className="mt-6 space-y-2.5">
            <button
              type="button"
              onClick={() => onApplyNow(product)}
              className="w-full min-h-[48px] px-5 rounded-full bg-[#A32035] hover:opacity-90 text-white text-sm font-semibold flex items-center justify-between transition-opacity"
            >
              <span className="w-4" aria-hidden="true" />
              <span>Apply Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={scrollToDetails}
              className="w-full min-h-[48px] px-5 rounded-full border border-[#A32035] bg-white hover:bg-[#EAF3EE] text-[#A32035] text-sm font-semibold flex items-center justify-between transition-colors"
            >
              <span className="w-4" aria-hidden="true" />
              <span>Learn More</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Structured Sections */}
      <div id="product-full-details" className="grid grid-cols-1 lg:grid-cols-2 gap-5 scroll-mt-16">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-bold text-[#1E2022]">Product Overview</h2>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                product.entity === 'family'
                  ? 'bg-[#A32035] text-white'
                  : 'bg-[#007A48] text-white'
              }`}
            >
              <ProductIcon iconKey={product.iconKey} className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm text-[#5C6066] leading-relaxed">{product.overview}</p>

          <div>
            <h3 className="text-sm font-bold text-[#1E2022]">Eligibility</h3>
            <ul className="mt-1.5 space-y-1.5 text-xs text-[#5C6066]">
              {product.eligibility.map((e) => (
                <li key={e} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#007A48] shrink-0 mt-0.5" />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#1E2022]">Coverage Information</h3>
            <ul className="mt-1.5 space-y-1.5 text-xs text-[#5C6066]">
              {product.coverageInfo.map((c) => (
                <li key={c} className="flex items-start gap-2">
                  <Shield className="w-3.5 h-3.5 text-[#A32035] shrink-0 mt-0.5" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#1E2022]">Contribution Information</h2>
            <p className="mt-1.5 text-sm text-[#5C6066] leading-relaxed">
              {product.contributionInfo}
            </p>
            <div className="mt-2.5 p-3 rounded-xl bg-[#EAF3EE] border border-[#007A48]/20 flex items-center justify-between text-xs">
              <span className="text-[#5C6066]">Illustrative Minimum</span>
              <span className="font-bold text-[#1E2022] tabular-nums">
                PKR {product.illustrativeMinContributionPkr.toLocaleString()} ({product.illustrativeFrequency})
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#1E2022]">Key Conditions</h3>
            <ul className="mt-1.5 space-y-1.5 text-xs text-[#5C6066]">
              {product.keyConditions.map((k) => (
                <li key={k} className="flex items-start gap-2">
                  <span className="text-[#A32035] font-bold">·</span>
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#1E2022]">Relevant Documents</h3>
            <div className="mt-2 space-y-2">
              {product.documents.map((doc) => (
                <button
                  key={doc}
                  type="button"
                  onClick={() => setDocPreview(doc)}
                  className="pq-card-interactive w-full min-h-[42px] px-3 py-2 rounded-xl border border-[#E5E7EB] hover:border-[#A32035] flex items-center justify-between text-xs font-medium text-[#1E2022]"
                >
                  <span className="inline-flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#A32035]" />
                    <span>{doc}</span>
                  </span>
                  <span className="text-[#A32035]">Preview</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenShariah}
            className="w-full min-h-[42px] rounded-xl bg-[#EAF3EE] border border-[#007A48]/20 text-xs font-semibold text-[#007A48] hover:border-[#007A48]"
          >
            Read Shariah Structure (Waqf, Tabarru &amp; Wakalah)
          </button>
        </div>
      </div>

      {/* Product FAQs */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
        <h2 className="text-base font-bold text-[#1E2022] mb-3">Product FAQs</h2>
        <div className="space-y-3">
          {product.faqs.map((faq) => (
            <div key={faq.q} className="p-3.5 rounded-xl bg-[#F7F5F2]">
              <div className="text-xs font-bold text-[#1E2022]">{faq.q}</div>
              <p className="text-xs text-[#5C6066] mt-1 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <PqModal
        open={Boolean(docPreview)}
        onClose={() => setDocPreview(null)}
        ariaLabel={docPreview ?? 'Document Preview'}
      >
        <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E5E7EB] shadow-lg">
          <h3 className="text-base font-bold text-[#1E2022]">{docPreview}</h3>
          <p className="mt-2 text-xs text-[#5C6066] leading-relaxed">
            This is an illustrative document summary for {product.name} ({product.companyName}). Official Participant Membership Documents (PMD) and Shariah certificates are issued by Pak-Qatar upon formal underwriting approval.
          </p>
          <button
            type="button"
            onClick={() => setDocPreview(null)}
            className="mt-5 w-full min-h-[44px] rounded-xl bg-[#A32035] text-white text-sm font-medium"
          >
            Close Preview
          </button>
        </div>
      </PqModal>
    </div>
  );
};

interface ProductApplicationFlowProps {
  product: TakafulProduct;
  isAuthenticated: boolean;
  onBack: () => void;
  onSubmitted: (refNumber: string) => void;
}

export const ProductApplicationFlow: React.FC<ProductApplicationFlowProps> = ({
  product,
  isAuthenticated,
  onBack,
  onSubmitted,
}) => {
  const [applicantName, setApplicantName] = useState(
    isAuthenticated ? DEMO_CUSTOMER.fullName : 'Ahmed Tariq'
  );
  const [city, setCity] = useState('Karachi');
  const [contributionPkr, setContributionPkr] = useState(
    String(product.illustrativeMinContributionPkr)
  );
  const [nomineeOrAsset, setNomineeOrAsset] = useState(
    product.entity === 'family' ? 'Bilal Tariq (Son)' : 'Private Vehicle / Property (Demo)'
  );
  const [declared, setDeclared] = useState(true);
  const [step, setStep] = useState<'form' | 'review' | 'done'>('form');
  const [processing, setProcessing] = useState(false);
  const [appRef, setAppRef] = useState('');

  const handleConfirm = () => {
    if (processing) return;
    void ensureLoadingAssetsReady().then(() => {
      setProcessing(true);
      window.setTimeout(() => {
        const ref = `${product.entity === 'family' ? 'APP-PQF' : 'APP-PQG'}-2026-${Math.floor(
          1000 + Math.random() * 9000
        )}`;
        setAppRef(ref);
        setProcessing(false);
        setStep('done');
        onSubmitted(ref);
      }, 2000);
    });
  };

  return (
    <div className="max-w-xl mx-auto pb-10">
      <ProcessingOverlay
        visible={processing}
        title="Processing Your Request"
        subtitle={`Preparing illustrative application for ${product.name}...`}
      />

      {step !== 'done' && (
        <button
          type="button"
          onClick={() => (step === 'review' ? setStep('form') : onBack())}
          className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium text-[#5C6066] hover:text-[#A32035] mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{step === 'review' ? 'Edit Application' : 'Back to Product'}</span>
        </button>
      )}

      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
        <div className="text-xs font-semibold text-[#A32035]">{product.companyName}</div>
        <h1 className="text-xl font-bold text-[#1E2022] mt-1">
          {step === 'done' ? 'Application Submitted (Demo)' : `Apply: ${product.name}`}
        </h1>

        <PqTabSwap swapKey={step}>
          {step === 'form' && (
            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E2022] mb-1">
                  Applicant Full Name <span className="text-[#A32035]">*</span>
                </label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E5E7EB] text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E2022] mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-[#E5E7EB] text-sm bg-white"
                  >
                    <option>Karachi</option>
                    <option>Lahore</option>
                    <option>Islamabad</option>
                    <option>Rawalpindi</option>
                    <option>Multan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E2022] mb-1">
                    Illustrative Contribution (PKR)
                  </label>
                  <input
                    type="number"
                    min={product.illustrativeMinContributionPkr}
                    value={contributionPkr}
                    onChange={(e) => setContributionPkr(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E5E7EB] text-sm tabular-nums"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E2022] mb-1">
                  {product.entity === 'family' ? 'Beneficiary / Nominee' : 'Asset / Risk Description'}
                </label>
                <input
                  type="text"
                  value={nomineeOrAsset}
                  onChange={(e) => setNomineeOrAsset(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E5E7EB] text-sm"
                />
              </div>
              <label className="flex items-start gap-2.5 text-xs text-[#5C6066] cursor-pointer">
                <input
                  type="checkbox"
                  checked={declared}
                  onChange={(e) => setDeclared(e.target.checked)}
                  className="mt-0.5 accent-[#A32035] w-4 h-4"
                />
                <span>
                  I acknowledge this is an illustrative demonstration application and does not issue an active Takaful certificate without formal underwriting.
                </span>
              </label>
              <button
                type="button"
                disabled={!declared || !applicantName.trim()}
                onClick={() => setStep('review')}
                className="w-full min-h-[48px] rounded-xl bg-[#A32035] hover:opacity-90 disabled:opacity-50 text-white text-sm font-medium transition-opacity"
              >
                Review Application
              </button>
            </div>
          )}

          {step === 'review' && (
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-[#F7F5F2] border border-[#E5E7EB] p-4 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#5C6066]">Product</span>
                  <span className="font-semibold text-[#1E2022]">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6066]">Applicant</span>
                  <span className="font-semibold text-[#1E2022]">{applicantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6066]">City</span>
                  <span className="font-semibold text-[#1E2022]">{city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6066]">Illustrative Contribution</span>
                  <span className="font-bold text-[#A32035] tabular-nums">
                    PKR {Number(contributionPkr || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6066]">Nominee / Asset</span>
                  <span className="font-semibold text-[#1E2022]">{nomineeOrAsset}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleConfirm}
                className="w-full min-h-[48px] rounded-xl bg-[#A32035] hover:opacity-90 text-white text-sm font-medium transition-opacity"
              >
                Confirm &amp; Submit Demo Application
              </button>
            </div>
          )}

          {step === 'done' && (
            <div className="mt-5 text-center py-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#EAF3EE] text-[#007A48] flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="mt-3 text-sm text-[#5C6066]">
                Your demonstration proposal request has been logged for consultant &amp; underwriting follow-up.
              </p>
              <div className="mt-4 p-3.5 rounded-xl bg-[#F7F5F2] border border-[#E5E7EB] text-xs">
                Reference Number:{' '}
                <span className="font-bold text-[#1E2022] tabular-nums">{appRef}</span>
              </div>
              <button
                type="button"
                onClick={onBack}
                className="mt-6 w-full min-h-[48px] rounded-xl bg-[#A32035] text-white text-sm font-medium"
              >
                Return to Products
              </button>
            </div>
          )}
        </PqTabSwap>
      </div>
    </div>
  );
};
