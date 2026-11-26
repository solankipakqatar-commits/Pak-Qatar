import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Calculator,
  ClipboardList,
  CreditCard,
  HelpCircle,
  Home,
  LayoutGrid,
  LogIn,
  Menu,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import {
  AppNotification,
  AuthScreen,
  ContributionPayment,
  FamilyMember,
  FundHolding,
  LanguageCode,
  MoreSubSection,
  NavTab,
  ProtectionSubTab,
  SupportComplaint,
  TakafulCertificate,
  TakafulClaim,
  TakafulEntity,
  TakafulProduct,
} from './types/pqfs';
import {
  DEMO_CERTIFICATES,
  DEMO_CLAIMS,
  DEMO_COMPLAINTS,
  DEMO_CUSTOMER,
  DEMO_FAMILY_MEMBERS,
  DEMO_FUND_HOLDINGS,
  DEMO_NOTIFICATIONS,
  DEMO_PAYMENTS,
  PQFS_VERIFIED_CONTACT,
} from './data/pqfsData';
import { PakQatarLogo, SplashScreen } from './components/BrandAssets';
import {
  BiometricSetupView,
  LoginView,
  RegisterView,
  WelcomeView,
} from './components/AuthViews';
import {
  CustomerDashboardView,
  GuestHomeSection,
  GuestHomeView,
  ProductApplicationFlow,
  ProductDetailView,
} from './components/HomeAndDiscovery';
import { ProtectionAndInvestmentsView } from './components/ProtectionAndInvestments';
import { PaymentsView } from './components/PaymentsView';
import { ClaimsView } from './components/ClaimsView';
import { FamilyAndElaajView } from './components/FamilyAndElaajView';
import { MoreShariahSupportView } from './components/MoreShariahSupportView';

const NAV_ITEMS: { id: NavTab; label: string; urLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Home', urLabel: 'ہوم', icon: Home },
  { id: 'protection', label: 'My Protection', urLabel: 'تحفظ', icon: ShieldCheck },
  { id: 'claims', label: 'Claims', urLabel: 'کلیمز', icon: ClipboardList },
  { id: 'payments', label: 'Payments', urLabel: 'ادائیگیاں', icon: CreditCard },
  { id: 'family', label: 'My Family', urLabel: 'خاندان', icon: Users },
  { id: 'more', label: 'More', urLabel: 'مزید', icon: LayoutGrid },
];

export default function App() {
  const [screen, setScreen] = useState<AuthScreen>('splash');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [maskSensitive, setMaskSensitive] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  // Domain states
  const [wheelEntity, setWheelEntity] = useState<TakafulEntity>('family');
  const [selectedProduct, setSelectedProduct] = useState<TakafulProduct | null>(null);
  const [applyingProduct, setApplyingProduct] = useState<TakafulProduct | null>(null);
  const [pendingAppAfterAuth, setPendingAppAfterAuth] = useState<TakafulProduct | null>(null);

  const [protectionSubTab, setProtectionSubTab] = useState<ProtectionSubTab>('explore');
  const [selectedCertModal, setSelectedCertModal] = useState<TakafulCertificate | null>(null);

  const [certificates] = useState<TakafulCertificate[]>(DEMO_CERTIFICATES);
  const [funds, setFunds] = useState<FundHolding[]>(DEMO_FUND_HOLDINGS);
  const [payments, setPayments] = useState<ContributionPayment[]>(DEMO_PAYMENTS);
  const [activePayTarget, setActivePayTarget] = useState<ContributionPayment | null>(null);

  const [claims, setClaims] = useState<TakafulClaim[]>(DEMO_CLAIMS);
  const [claimSubmitOpen, setClaimSubmitOpen] = useState(false);

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(DEMO_FAMILY_MEMBERS);
  const [familyMode, setFamilyMode] = useState<'family' | 'elaaj'>('family');

  const [moreSubSection, setMoreSubSection] = useState<MoreSubSection>('hub');
  const [complaints, setComplaints] = useState<SupportComplaint[]>(DEMO_COMPLAINTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(DEMO_NOTIFICATIONS);

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [guestSection, setGuestSection] = useState<GuestHomeSection>('overview');
  const [guestMenuOpen, setGuestMenuOpen] = useState(false);

  const handleOpenProduct = (product: TakafulProduct) => {
    setSelectedProduct(product);
    setApplyingProduct(null);
  };

  const handleApplyNow = (product: TakafulProduct) => {
    if (!isAuthenticated) {
      // Journey 1: Guest -> Apply Now -> Registration -> OTP -> Application Form
      setPendingAppAfterAuth(product);
      setScreen('register');
    } else {
      setApplyingProduct(product);
      setSelectedProduct(null);
    }
  };

  const completeAuthIntoApp = () => {
    setIsAuthenticated(true);
    setScreen('app');
    if (pendingAppAfterAuth) {
      setApplyingProduct(pendingAppAfterAuth);
      setSelectedProduct(null);
      setPendingAppAfterAuth(null);
      setActiveTab('protection');
    } else {
      setActiveTab('home');
    }
  };

  const handlePaymentCompleted = (paymentId: string, method: string, newRef: string) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: 'Settled',
              paidDate: '26 Nov 2026',
              paymentMethod: method,
              referenceNumber: newRef,
            }
          : p
      )
    );
  };

  const handleUpdateFamilyMember = (id: string, sharePercent: number) => {
    setFamilyMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, sharePercent } : m))
    );
  };

  const handleTabSelect = (tab: NavTab) => {
    setActiveTab(tab);
    setSelectedProduct(null);
    setApplyingProduct(null);
    if (tab !== 'more') setMoreSubSection('hub');
    if (tab !== 'payments') setActivePayTarget(null);
    if (tab !== 'claims') setClaimSubmitOpen(false);
  };

  const openShariahFromAnywhere = () => {
    setSelectedProduct(null);
    setApplyingProduct(null);
    setActiveTab('more');
    setMoreSubSection('shariah');
  };

  const openSupportFromAnywhere = () => {
    setSelectedProduct(null);
    setApplyingProduct(null);
    setActiveTab('more');
    setMoreSubSection('support');
  };

  if (screen === 'splash') {
    return <SplashScreen onComplete={() => setScreen('welcome')} />;
  }

  if (screen === 'welcome') {
    return (
      <>
        <WelcomeView
          language={language}
          onLanguageChange={setLanguage}
          onExploreGuest={() => {
            setIsAuthenticated(false);
            setGuestSection('overview');
            setActiveTab('home');
            setScreen('app');
          }}
          onGoLogin={() => setScreen('login')}
          onGoRegister={() => {
            setPendingAppAfterAuth(null);
            setScreen('register');
          }}
          onOpenContact={() => setContactModalOpen(true)}
        />
        {contactModalOpen && (
          <ContactQuickModal onClose={() => setContactModalOpen(false)} />
        )}
      </>
    );
  }

  if (screen === 'login') {
    return (
      <>
        <LoginView
          biometricEnabled={biometricEnabled}
          onBack={() => setScreen('welcome')}
          onLoginSuccess={completeAuthIntoApp}
          onGoRegister={() => setScreen('register')}
          onOpenContact={() => setContactModalOpen(true)}
        />
        {contactModalOpen && (
          <ContactQuickModal onClose={() => setContactModalOpen(false)} />
        )}
      </>
    );
  }

  if (screen === 'register') {
    return (
      <RegisterView
        pendingApplicationProductName={pendingAppAfterAuth?.name ?? null}
        onBack={() => {
          if (pendingAppAfterAuth) {
            setScreen('app');
          } else {
            setScreen('welcome');
          }
        }}
        onCompleteToBiometric={() => setScreen('biometric')}
      />
    );
  }

  if (screen === 'biometric') {
    return (
      <BiometricSetupView
        onEnable={() => {
          setBiometricEnabled(true);
          completeAuthIntoApp();
        }}
        onSkip={() => {
          setBiometricEnabled(false);
          completeAuthIntoApp();
        }}
      />
    );
  }

  // Main Application Shell (Responsive Mobile-First + Full Desktop Sidebar Layout)
  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#1E2022] flex flex-col lg:flex-row">
      {/* Desktop Navigation Rail */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 border-r border-[#E5E7EB] bg-white px-4 py-6 justify-between sticky top-0 h-screen">
        <div>
          <div className="px-2 py-1 flex justify-start">
            <PakQatarLogo variant="medium" />
          </div>

          <div className="mt-5 px-3 py-2.5 rounded-2xl bg-[#EAF3EE] border border-[#007A48]/20 text-xs">
            {isAuthenticated ? (
              <div>
                <div className="font-semibold text-[#007A48]">Customer Mode (Demo)</div>
                <div className="font-bold text-[#1E2022] mt-0.5">{DEMO_CUSTOMER.fullName}</div>
                <div className="text-[11px] text-[#5C6066]">{DEMO_CUSTOMER.customerId}</div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-semibold text-[#A32035]">Guest Discovery</div>
                  <div className="text-[11px] text-[#5C6066]">Browse Takaful Plans</div>
                </div>
                <button
                  type="button"
                  onClick={() => setScreen('login')}
                  className="min-h-[34px] px-2.5 rounded-lg bg-[#A32035] text-white text-[11px] font-medium whitespace-nowrap"
                >
                  Login
                </button>
              </div>
            )}
          </div>

          <nav className="mt-6 space-y-1" aria-label="Primary Navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabSelect(item.id)}
                  className={`w-full min-h-[44px] px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
                    isActive
                      ? 'bg-[#A32035] text-white'
                      : 'text-[#1E2022] hover:bg-[#EAF3EE] hover:text-[#007A48]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">
                    {language === 'ur' ? item.urLabel : item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-2 space-y-2 text-[11px] text-[#5C6066]">
          <button
            type="button"
            onClick={() => setContactModalOpen(true)}
            className="w-full min-h-[40px] px-3 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#1E2022] hover:border-[#A32035] flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#A32035]" />
            <span>PQFS Helpline</span>
          </button>
          <div className="text-center">Demo Build · Illustrative Data</div>
        </div>
      </aside>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Compact Mobile Top App Bar (56px) */}
        <header className="lg:hidden sticky top-0 z-30 h-[56px] px-4 bg-white border-b-2 border-[#F5B335]/60 flex items-center justify-between">
          {!isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => setScreen('login')}
                className="min-h-[36px] px-2.5 rounded-lg border border-[#A32035] text-[#A32035] text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
              <PakQatarLogo variant="compact" />
              <button
                type="button"
                onClick={() => setGuestMenuOpen(true)}
                aria-label="Open menu"
                className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-end text-[#A32035]"
              >
                <Menu className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <PakQatarLogo variant="compact" />
              <button
                type="button"
                onClick={openSupportFromAnywhere}
                aria-label="Customer Support"
                className="min-h-[40px] min-w-[40px] rounded-xl flex items-center justify-center text-[#5C6066] hover:text-[#A32035]"
              >
                <PhoneCall className="w-4 h-4" />
              </button>
            </>
          )}
        </header>

        {/* Scrollable Content Viewport */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-24 lg:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${selectedProduct?.id ?? ''}-${applyingProduct?.id ?? ''}-${moreSubSection}`}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {applyingProduct ? (
                <ProductApplicationFlow
                  product={applyingProduct}
                  isAuthenticated={isAuthenticated}
                  onBack={() => setApplyingProduct(null)}
                  onSubmitted={() => {}}
                />
              ) : selectedProduct ? (
                <ProductDetailView
                  product={selectedProduct}
                  onBack={() => setSelectedProduct(null)}
                  onApplyNow={handleApplyNow}
                  onOpenShariah={openShariahFromAnywhere}
                />
              ) : (
                <>
                  {activeTab === 'home' &&
                    (!isAuthenticated ? (
                      <GuestHomeView
                        language={language}
                        guestSection={guestSection}
                        onGuestSectionChange={setGuestSection}
                        wheelEntity={wheelEntity}
                        onWheelEntityChange={setWheelEntity}
                        onSelectProduct={handleOpenProduct}
                        onOpenShariah={openShariahFromAnywhere}
                        onOpenSupport={openSupportFromAnywhere}
                        onStartApplication={handleApplyNow}
                        onBackToWelcome={() => setScreen('welcome')}
                      />
                    ) : (
                      <CustomerDashboardView
                        language={language}
                        maskSensitive={maskSensitive}
                        certificates={certificates}
                        payments={payments}
                        claims={claims}
                        notifications={notifications}
                        onMarkAllRead={() =>
                          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
                        }
                        onNavigateTab={(tab) => {
                          if (tab === 'protection') setProtectionSubTab('explore');
                          handleTabSelect(tab);
                        }}
                        onOpenCertificatesList={() => {
                          setProtectionSubTab('certificates');
                          setSelectedProduct(null);
                          setApplyingProduct(null);
                          setActiveTab('protection');
                        }}
                        onOpenInvestments={() => {
                          setProtectionSubTab('investments');
                          setSelectedProduct(null);
                          setApplyingProduct(null);
                          setActiveTab('protection');
                        }}
                        onOpenSupport={openSupportFromAnywhere}
                        onPayDue={(pay) => {
                          setActivePayTarget(pay);
                          setActiveTab('payments');
                        }}
                        onOpenCertificate={(cert) => {
                          setActiveTab('protection');
                          setProtectionSubTab('certificates');
                          setSelectedCertModal(cert);
                        }}
                        onOpenElaajCard={() => {
                          setFamilyMode('elaaj');
                          setActiveTab('family');
                        }}
                      />
                    ))}

                  {activeTab === 'protection' && (
                    <ProtectionAndInvestmentsView
                      isAuthenticated={isAuthenticated}
                      maskSensitive={maskSensitive}
                      subTab={protectionSubTab}
                      onSubTabChange={setProtectionSubTab}
                      wheelEntity={wheelEntity}
                      onWheelEntityChange={setWheelEntity}
                      onSelectProduct={handleOpenProduct}
                      certificates={certificates}
                      funds={funds}
                      onUpdateFunds={setFunds}
                      onRequireLogin={() => setScreen('login')}
                      selectedCertModal={selectedCertModal}
                      onSelectCertModal={setSelectedCertModal}
                    />
                  )}

                  {activeTab === 'claims' && (
                    <ClaimsView
                      isAuthenticated={isAuthenticated}
                      maskSensitive={maskSensitive}
                      certificates={certificates}
                      claims={claims}
                      startSubmitOpen={claimSubmitOpen}
                      onSetStartSubmitOpen={setClaimSubmitOpen}
                      onClaimSubmitted={(newClaim) => setClaims((prev) => [newClaim, ...prev])}
                      onRequireLogin={() => setScreen('login')}
                      onOpenSupport={openSupportFromAnywhere}
                    />
                  )}

                  {activeTab === 'payments' && (
                    <PaymentsView
                      isAuthenticated={isAuthenticated}
                      maskSensitive={maskSensitive}
                      payments={payments}
                      activePayTarget={activePayTarget}
                      onSelectPayTarget={setActivePayTarget}
                      onPaymentCompleted={handlePaymentCompleted}
                      onRequireLogin={() => setScreen('login')}
                    />
                  )}

                  {activeTab === 'family' && (
                    <FamilyAndElaajView
                      key={familyMode}
                      isAuthenticated={isAuthenticated}
                      initialMode={familyMode}
                      familyMembers={familyMembers}
                      onUpdateFamilyMember={handleUpdateFamilyMember}
                      onRequireLogin={() => setScreen('login')}
                      onGoToClaims={() => {
                        setClaimSubmitOpen(true);
                        setActiveTab('claims');
                      }}
                    />
                  )}

                  {activeTab === 'more' && (
                    <MoreShariahSupportView
                      isAuthenticated={isAuthenticated}
                      subSection={moreSubSection}
                      onSubSectionChange={setMoreSubSection}
                      language={language}
                      onLanguageChange={setLanguage}
                      maskSensitive={maskSensitive}
                      onToggleMask={() => setMaskSensitive((m) => !m)}
                      biometricEnabled={biometricEnabled}
                      onToggleBiometric={() => setBiometricEnabled((b) => !b)}
                      complaints={complaints}
                      onAddComplaint={(c) => setComplaints((prev) => [c, ...prev])}
                      onReplaySplash={() => setScreen('splash')}
                      onLogoutOrLogin={() => {
                        if (isAuthenticated) {
                          setIsAuthenticated(false);
                          setActiveTab('home');
                          setScreen('welcome');
                        } else {
                          setScreen('login');
                        }
                      }}
                    />
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar: 4-tab Guest Mode (Screen 2) vs 6-tab Customer Mode */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-[#F5B335]/70 pb-safe"
      >
        {!isAuthenticated ? (
          <div className="grid grid-cols-4 items-center h-[60px]">
            <button
              type="button"
              onClick={() => {
                setSelectedProduct(null);
                setApplyingProduct(null);
                setGuestSection('overview');
                setActiveTab('home');
              }}
              className={`h-full flex flex-col items-center justify-center gap-0.5 px-1 transition-colors ${
                activeTab === 'home' && guestSection === 'overview'
                  ? 'text-[#A32035]'
                  : 'text-[#5C6066]'
              }`}
            >
              <Home className="w-[19px] h-[19px]" />
              <span className="text-[11px] font-medium leading-tight">
                {language === 'ur' ? 'ہوم' : 'Home'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedProduct(null);
                setApplyingProduct(null);
                setGuestSection('calculator');
                setActiveTab('home');
              }}
              className={`h-full flex flex-col items-center justify-center gap-0.5 px-1 transition-colors ${
                activeTab === 'home' && guestSection === 'calculator'
                  ? 'text-[#A32035]'
                  : 'text-[#5C6066]'
              }`}
            >
              <Calculator className="w-[19px] h-[19px]" />
              <span className="text-[11px] font-medium leading-tight">
                {language === 'ur' ? 'کیلکولیٹر' : 'Calculator'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedProduct(null);
                setApplyingProduct(null);
                setGuestSection('faqs');
                setActiveTab('home');
              }}
              className={`h-full flex flex-col items-center justify-center gap-0.5 px-1 transition-colors ${
                activeTab === 'home' && guestSection === 'faqs'
                  ? 'text-[#A32035]'
                  : 'text-[#5C6066]'
              }`}
            >
              <HelpCircle className="w-[19px] h-[19px]" />
              <span className="text-[11px] font-medium leading-tight">FAQs</span>
            </button>

            <button
              type="button"
              onClick={openSupportFromAnywhere}
              className={`h-full flex flex-col items-center justify-center gap-0.5 px-1 transition-colors ${
                activeTab === 'more' && moreSubSection === 'support'
                  ? 'text-[#A32035]'
                  : 'text-[#5C6066]'
              }`}
            >
              <PhoneCall className="w-[19px] h-[19px]" />
              <span className="text-[11px] font-medium leading-tight">
                {language === 'ur' ? 'رابطہ' : 'Contact'}
              </span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-6 items-center h-[60px]">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabSelect(item.id)}
                  className={`h-full flex flex-col items-center justify-center gap-0.5 px-1 transition-colors ${
                    isActive ? 'text-[#A32035]' : 'text-[#5C6066]'
                  }`}
                >
                  <Icon className="w-[19px] h-[19px]" />
                  <span className="text-[10px] font-medium leading-tight truncate max-w-full">
                    {language === 'ur' ? item.urLabel : item.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </nav>

      {/* Guest Hamburger Drawer (Screen 2 top-right menu) */}
      {guestMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end lg:hidden">
          <div className="w-72 max-w-[85vw] bg-white h-full p-5 flex flex-col justify-between border-l border-[#E5E7EB]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
                <PakQatarLogo variant="compact" />
                <button
                  type="button"
                  onClick={() => setGuestMenuOpen(false)}
                  aria-label="Close menu"
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center text-[#5C6066]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setGuestMenuOpen(false);
                    setGuestSection('overview');
                    handleTabSelect('protection');
                    setProtectionSubTab('explore');
                  }}
                  className="w-full min-h-[44px] px-3 rounded-xl hover:bg-[#EAF3EE] text-left text-sm font-medium text-[#1E2022] flex items-center gap-3"
                >
                  <Sparkles className="w-4 h-4 text-[#007A48]" />
                  <span>360° Takaful Product Dial</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGuestMenuOpen(false);
                    openShariahFromAnywhere();
                  }}
                  className="w-full min-h-[44px] px-3 rounded-xl hover:bg-[#EAF3EE] text-left text-sm font-medium text-[#1E2022] flex items-center gap-3"
                >
                  <ShieldCheck className="w-4 h-4 text-[#007A48]" />
                  <span>Shariah Transparency</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGuestMenuOpen(false);
                    openSupportFromAnywhere();
                  }}
                  className="w-full min-h-[44px] px-3 rounded-xl hover:bg-[#EAF3EE] text-left text-sm font-medium text-[#1E2022] flex items-center gap-3"
                >
                  <PhoneCall className="w-4 h-4 text-[#A32035]" />
                  <span>Branches &amp; Support</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => {
                  setGuestMenuOpen(false);
                  setScreen('login');
                }}
                className="w-full min-h-[44px] rounded-full bg-[#A32035] text-white text-sm font-semibold"
              >
                Customer Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setGuestMenuOpen(false);
                  setScreen('register');
                }}
                className="w-full min-h-[44px] rounded-full border border-[#A32035] text-[#A32035] text-sm font-semibold"
              >
                New Customer? Register
              </button>
            </div>
          </div>
        </div>
      )}

      {contactModalOpen && (
        <ContactQuickModal onClose={() => setContactModalOpen(false)} />
      )}
    </div>
  );
}

function ContactQuickModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E5E7EB] shadow-lg">
        <div className="text-xs font-semibold text-[#007A48]">Pak-Qatar Financial Services</div>
        <h2 className="mt-1 text-lg font-bold text-[#1E2022]">Contact & Support</h2>
        <div className="mt-4 space-y-2.5 text-xs text-[#5C6066]">
          <div>
            <span className="font-semibold text-[#1E2022]">UAN Helpline: </span>
            {PQFS_VERIFIED_CONTACT.uan}
          </div>
          <div>
            <span className="font-semibold text-[#1E2022]">Email: </span>
            {PQFS_VERIFIED_CONTACT.email}
          </div>
          <div>
            <span className="font-semibold text-[#1E2022]">Website: </span>
            {PQFS_VERIFIED_CONTACT.website}
          </div>
          <div>
            <span className="font-semibold text-[#1E2022]">Head Office: </span>
            {PQFS_VERIFIED_CONTACT.headOffice}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full min-h-[44px] rounded-xl bg-[#A32035] text-white text-xs font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}
