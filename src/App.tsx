import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
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
  FamilyProductCategory,
  TakafulCertificate,
  TakafulClaim,
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
import {
  ensureLoadingAssetsReady,
  NavigationLoadingOverlay,
  PakQatarLogo,
  SplashScreen,
} from './components/BrandAssets';
import {
  BiometricSetupView,
  LoginView,
  RegisterView,
  WelcomeView,
} from './components/AuthViews';
import {
  CustomerDashboardView,
  GuestApplySeed,
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
import {
  AssistantNavigationAction,
  PakQatarAssistant,
} from './components/PakQatarAssistant';
import {
  PQ_EASE,
  PqDirectionalSwap,
  PqDrawer,
  PqModal,
  ScreenTransitionProvider,
  TransitionDirection,
  useScreenTransition,
} from './components/MotionPrimitives';

const NAV_ITEMS: {
  id: NavTab;
  label: string;
  urLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'home', label: 'Home', urLabel: 'ہوم', icon: Home },
  { id: 'protection', label: 'My Protection', urLabel: 'تحفظ', icon: ShieldCheck },
  { id: 'claims', label: 'Claims', urLabel: 'کلیمز', icon: ClipboardList },
  { id: 'payments', label: 'Payments', urLabel: 'ادائیگیاں', icon: CreditCard },
  { id: 'family', label: 'My Family', urLabel: 'خاندان', icon: Users },
  { id: 'more', label: 'More', urLabel: 'مزید', icon: LayoutGrid },
];

function AppContent() {
  const { direction, triggerTransition } = useScreenTransition();
  const [screen, setScreen] = useState<AuthScreen>('splash');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [maskSensitive, setMaskSensitive] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  // Centralized 2-second ornamental video loading state (used for auth & launch loading)
  const [navLoading, setNavLoading] = useState(false);
  const transitionTimerRef = useRef<number | null>(null);
  const transitionInFlightRef = useRef(false);

  // Domain states
  const [wheelCategory, setWheelCategory] = useState<FamilyProductCategory>('all');
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
  const [guestApplySeed, setGuestApplySeed] = useState<GuestApplySeed | null>(null);
  const [guestMenuOpen, setGuestMenuOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const navigateWithLines = useCallback(
    (action: () => void, dir: TransitionDirection = 'forward') => {
      if (transitionInFlightRef.current || transitionTimerRef.current !== null) {
        return;
      }
      triggerTransition(action, { direction: dir, scrollToTop: true });
    },
    [triggerTransition]
  );

  const navigateWithLoader = useCallback((action: () => void) => {
    if (transitionInFlightRef.current || transitionTimerRef.current !== null) {
      return;
    }
    transitionInFlightRef.current = true;
    void ensureLoadingAssetsReady().then(() => {
      if (!transitionInFlightRef.current) return;
      setNavLoading(true);
      transitionTimerRef.current = window.setTimeout(() => {
        transitionTimerRef.current = null;
        transitionInFlightRef.current = false;
        action();
        window.scrollTo({ top: 0, behavior: 'auto' });
        setNavLoading(false);
      }, 2000);
    });
  }, []);

  const handleOpenProduct = (product: TakafulProduct) => {
    navigateWithLines(() => {
      setSelectedProduct(product);
      setApplyingProduct(null);
    }, 'forward');
  };

  const handleGuestStartApplication = (
    product: TakafulProduct,
    seed?: Omit<GuestApplySeed, 'product'>
  ) => {
    navigateWithLines(() => {
      setGuestApplySeed({ product, ...seed });
      setSelectedProduct(null);
      setApplyingProduct(null);
      setActiveTab('home');
      setGuestSection('apply');
    }, 'forward');
  };

  const handleHandoffToRegister = (product: TakafulProduct) => {
    navigateWithLines(() => {
      setPendingAppAfterAuth(product);
      setScreen('register');
    }, 'forward');
  };

  const handleApplyNow = (product: TakafulProduct) => {
    if (!isAuthenticated) {
      handleGuestStartApplication(product);
      return;
    }
    navigateWithLines(() => {
      setApplyingProduct(product);
      setSelectedProduct(null);
    }, 'forward');
  };

  const completeAuthIntoApp = () => {
    void fetch('/api/auth/demo-session', { method: 'POST' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { token?: string } | null) => {
        if (data?.token) {
          setAuthToken(data.token);
        }
      })
      .catch(() => {
        // Fallback safely if server session route is offline
      });

    navigateWithLoader(() => {
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
    });
  };

  const handleAssistantNavigation = (action: AssistantNavigationAction) => {
    if (action === 'none') return;
    navigateWithLines(() => {
      setSelectedProduct(null);
      setApplyingProduct(null);

      switch (action) {
        case 'login':
          setScreen('login');
          break;
        case 'family-plans':
          setWheelCategory('all');
          if (!isAuthenticated) {
            setGuestSection('products');
            setActiveTab('home');
          } else {
            setProtectionSubTab('explore');
            setActiveTab('protection');
          }
          setScreen('app');
          break;
        case 'calculator':
          if (!isAuthenticated) {
            setGuestSection('calculator');
            setActiveTab('home');
          } else {
            setProtectionSubTab('explore');
            setActiveTab('protection');
          }
          setScreen('app');
          break;
        case 'shariah':
          setActiveTab('more');
          setMoreSubSection('shariah');
          setScreen('app');
          break;
        case 'certificates':
          setProtectionSubTab('certificates');
          setActiveTab('protection');
          setScreen('app');
          break;
        case 'payments':
          setActivePayTarget(null);
          setActiveTab('payments');
          setScreen('app');
          break;
        case 'claims':
          setClaimSubmitOpen(false);
          setActiveTab('claims');
          setScreen('app');
          break;
        case 'elaaj':
          setFamilyMode('elaaj');
          setActiveTab('family');
          setScreen('app');
          break;
        case 'support':
          if (!isAuthenticated) {
            setGuestSection('contact');
            setActiveTab('home');
          } else {
            setActiveTab('more');
            setMoreSubSection('support');
          }
          setScreen('app');
          break;
      }
    }, 'forward');
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
    if (
      screen === 'app' &&
      tab === activeTab &&
      !selectedProduct &&
      !applyingProduct &&
      (tab !== 'home' || isAuthenticated || guestSection === 'overview') &&
      (tab !== 'more' || moreSubSection === 'hub') &&
      (tab !== 'payments' || !activePayTarget) &&
      (tab !== 'claims' || !claimSubmitOpen)
    ) {
      return;
    }
    const prevIdx = NAV_ITEMS.findIndex((item) => item.id === activeTab);
    const nextIdx = NAV_ITEMS.findIndex((item) => item.id === tab);
    const navDir: TransitionDirection =
      tab === activeTab ? 'back' : nextIdx >= prevIdx ? 'forward' : 'back';

    navigateWithLines(() => {
      setActiveTab(tab);
      setSelectedProduct(null);
      setApplyingProduct(null);
      if (tab === 'home' && !isAuthenticated) setGuestSection('overview');
      if (tab !== 'more') setMoreSubSection('hub');
      if (tab !== 'payments') setActivePayTarget(null);
      if (tab !== 'claims') setClaimSubmitOpen(false);
    }, navDir);
  };

  const openShariahFromAnywhere = () => {
    if (
      screen === 'app' &&
      activeTab === 'more' &&
      moreSubSection === 'shariah' &&
      !selectedProduct &&
      !applyingProduct
    ) {
      return;
    }
    navigateWithLines(() => {
      setSelectedProduct(null);
      setApplyingProduct(null);
      setActiveTab('more');
      setMoreSubSection('shariah');
    }, 'forward');
  };

  const openSupportFromAnywhere = () => {
    if (
      screen === 'app' &&
      activeTab === 'more' &&
      moreSubSection === 'support' &&
      !selectedProduct &&
      !applyingProduct
    ) {
      return;
    }
    navigateWithLines(() => {
      setSelectedProduct(null);
      setApplyingProduct(null);
      setActiveTab('more');
      setMoreSubSection('support');
    }, 'forward');
  };

  const renderScreen = () => {
    if (screen === 'splash') {
      return <SplashScreen onComplete={() => setScreen('welcome')} />;
    }

    if (screen === 'welcome') {
      return (
        <WelcomeView
          language={language}
          onLanguageChange={setLanguage}
          onExploreGuest={() =>
            navigateWithLines(() => {
              setIsAuthenticated(false);
              setGuestApplySeed(null);
              setGuestSection('overview');
              setActiveTab('home');
              setScreen('app');
            }, 'forward')
          }
          onGoLogin={() => navigateWithLines(() => setScreen('login'), 'forward')}
          onGoRegister={() =>
            navigateWithLines(() => {
              setPendingAppAfterAuth(null);
              setScreen('register');
            }, 'forward')
          }
          onOpenContact={() => setContactModalOpen(true)}
        />
      );
    }

    if (screen === 'login') {
      return (
        <LoginView
          biometricEnabled={biometricEnabled}
          onBack={() => navigateWithLines(() => setScreen('welcome'), 'back')}
          onLoginSuccess={completeAuthIntoApp}
          onGoRegister={() => navigateWithLines(() => setScreen('register'), 'forward')}
          onOpenContact={() => setContactModalOpen(true)}
        />
      );
    }

    if (screen === 'register') {
      return (
        <RegisterView
          pendingApplicationProductName={pendingAppAfterAuth?.name ?? null}
          onBack={() =>
            navigateWithLines(() => {
              if (pendingAppAfterAuth) {
                setScreen('app');
              } else {
                setScreen('welcome');
              }
            }, 'back')
          }
          onCompleteToBiometric={() =>
            navigateWithLines(() => setScreen('biometric'), 'forward')
          }
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
                    onClick={() => navigateWithLines(() => setScreen('login'), 'forward')}
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
              <span>PQFTL Helpline</span>
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
                  onClick={() => navigateWithLines(() => setScreen('login'), 'forward')}
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
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-24 lg:pb-10 overflow-x-clip">
            <PqDirectionalSwap
              swapKey={`${activeTab}-${selectedProduct?.id ?? ''}-${applyingProduct?.id ?? ''}-${moreSubSection}-${guestSection}-${protectionSubTab}-${familyMode}`}
              direction={direction}
            >
              {applyingProduct ? (
                <ProductApplicationFlow
                  product={applyingProduct}
                  isAuthenticated={isAuthenticated}
                  onBack={() => navigateWithLines(() => setApplyingProduct(null), 'back')}
                  onSubmitted={() => {}}
                />
              ) : selectedProduct ? (
                <ProductDetailView
                  product={selectedProduct}
                  onBack={() => navigateWithLines(() => setSelectedProduct(null), 'back')}
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
                        onGuestSectionChange={(section) => {
                          if (section === guestSection) return;
                          navigateWithLines(
                            () => setGuestSection(section),
                            section === 'overview' ? 'back' : 'forward'
                          );
                        }}
                        wheelCategory={wheelCategory}
                        onWheelCategoryChange={setWheelCategory}
                        onSelectProduct={handleOpenProduct}
                        onOpenShariah={openShariahFromAnywhere}
                        onStartApplication={handleGuestStartApplication}
                        onHandoffToRegister={handleHandoffToRegister}
                        guestApplySeed={guestApplySeed}
                        onBackToWelcome={() =>
                          navigateWithLines(() => setScreen('welcome'), 'back')
                        }
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
                          if (tab === 'protection') {
                            navigateWithLines(() => {
                              setProtectionSubTab('explore');
                              setSelectedProduct(null);
                              setApplyingProduct(null);
                              setActiveTab('protection');
                            }, 'forward');
                            return;
                          }
                          handleTabSelect(tab);
                        }}
                        onOpenCertificatesList={() =>
                          navigateWithLines(() => {
                            setProtectionSubTab('certificates');
                            setSelectedProduct(null);
                            setApplyingProduct(null);
                            setActiveTab('protection');
                          }, 'forward')
                        }
                        onOpenInvestments={() =>
                          navigateWithLines(() => {
                            setProtectionSubTab('investments');
                            setSelectedProduct(null);
                            setApplyingProduct(null);
                            setActiveTab('protection');
                          }, 'forward')
                        }
                        onOpenSupport={openSupportFromAnywhere}
                        onPayDue={(pay) =>
                          navigateWithLines(() => {
                            setActivePayTarget(pay);
                            setActiveTab('payments');
                          }, 'forward')
                        }
                        onOpenCertificate={(cert) =>
                          navigateWithLines(() => {
                            setActiveTab('protection');
                            setProtectionSubTab('certificates');
                            setSelectedCertModal(cert);
                          }, 'forward')
                        }
                        onOpenElaajCard={() =>
                          navigateWithLines(() => {
                            setFamilyMode('elaaj');
                            setActiveTab('family');
                          }, 'forward')
                        }
                      />
                    ))}

                  {activeTab === 'protection' && (
                    <ProtectionAndInvestmentsView
                      isAuthenticated={isAuthenticated}
                      maskSensitive={maskSensitive}
                      subTab={protectionSubTab}
                      onSubTabChange={(nextTab) => {
                        if (nextTab === protectionSubTab) return;
                        const order: ProtectionSubTab[] = ['explore', 'certificates', 'investments'];
                        const nextDir =
                          order.indexOf(nextTab) >= order.indexOf(protectionSubTab)
                            ? 'forward'
                            : 'back';
                        navigateWithLines(() => setProtectionSubTab(nextTab), nextDir);
                      }}
                      wheelCategory={wheelCategory}
                      onWheelCategoryChange={setWheelCategory}
                      onSelectProduct={handleOpenProduct}
                      certificates={certificates}
                      funds={funds}
                      onUpdateFunds={setFunds}
                      onRequireLogin={() =>
                        navigateWithLines(() => setScreen('login'), 'forward')
                      }
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
                      onSetStartSubmitOpen={(open) => {
                        if (open === claimSubmitOpen) return;
                        navigateWithLines(
                          () => setClaimSubmitOpen(open),
                          open ? 'forward' : 'back'
                        );
                      }}
                      onClaimSubmitted={(newClaim) => setClaims((prev) => [newClaim, ...prev])}
                      onRequireLogin={() =>
                        navigateWithLines(() => setScreen('login'), 'forward')
                      }
                      onOpenSupport={openSupportFromAnywhere}
                    />
                  )}

                  {activeTab === 'payments' && (
                    <PaymentsView
                      isAuthenticated={isAuthenticated}
                      maskSensitive={maskSensitive}
                      payments={payments}
                      activePayTarget={activePayTarget}
                      onSelectPayTarget={(target) => {
                        if ((target?.id ?? null) === (activePayTarget?.id ?? null)) return;
                        navigateWithLines(
                          () => setActivePayTarget(target),
                          target ? 'forward' : 'back'
                        );
                      }}
                      onPaymentCompleted={handlePaymentCompleted}
                      onRequireLogin={() =>
                        navigateWithLines(() => setScreen('login'), 'forward')
                      }
                    />
                  )}

                  {activeTab === 'family' && (
                    <FamilyAndElaajView
                      key={familyMode}
                      isAuthenticated={isAuthenticated}
                      initialMode={familyMode}
                      mode={familyMode}
                      onModeChange={(nextMode) => {
                        if (nextMode === familyMode) return;
                        navigateWithLines(
                          () => setFamilyMode(nextMode),
                          nextMode === 'elaaj' ? 'forward' : 'back'
                        );
                      }}
                      familyMembers={familyMembers}
                      onUpdateFamilyMember={handleUpdateFamilyMember}
                      onRequireLogin={() =>
                        navigateWithLines(() => setScreen('login'), 'forward')
                      }
                      onGoToClaims={() =>
                        navigateWithLines(() => {
                          setClaimSubmitOpen(true);
                          setActiveTab('claims');
                        }, 'forward')
                      }
                    />
                  )}

                  {activeTab === 'more' && (
                    <MoreShariahSupportView
                      isAuthenticated={isAuthenticated}
                      subSection={moreSubSection}
                      onSubSectionChange={(nextSub) => {
                        if (nextSub === moreSubSection) return;
                        navigateWithLines(
                          () => setMoreSubSection(nextSub),
                          nextSub === 'hub' ? 'back' : 'forward'
                        );
                      }}
                      language={language}
                      onLanguageChange={setLanguage}
                      maskSensitive={maskSensitive}
                      onToggleMask={() => setMaskSensitive((m) => !m)}
                      biometricEnabled={biometricEnabled}
                      onToggleBiometric={() => setBiometricEnabled((b) => !b)}
                      complaints={complaints}
                      onAddComplaint={(c) => setComplaints((prev) => [c, ...prev])}
                      onReplaySplash={() => navigateWithLoader(() => setScreen('splash'))}
                      onLogoutOrLogin={() => {
                        if (isAuthenticated && authToken) {
                          void fetch('/api/auth/demo-session', {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${authToken}` },
                          }).catch(() => {});
                        }
                        if (isAuthenticated) {
                          navigateWithLoader(() => {
                            setIsAuthenticated(false);
                            setAuthToken(null);
                            setActiveTab('home');
                            setScreen('welcome');
                          });
                        } else {
                          navigateWithLines(() => setScreen('login'), 'forward');
                        }
                      }}
                    />
                  )}
                </>
              )}
            </PqDirectionalSwap>
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
                  if (
                    activeTab === 'home' &&
                    guestSection === 'overview' &&
                    !selectedProduct &&
                    !applyingProduct
                  ) {
                    return;
                  }
                  navigateWithLines(() => {
                    setSelectedProduct(null);
                    setApplyingProduct(null);
                    setGuestSection('overview');
                    setActiveTab('home');
                  }, 'back');
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
                  if (
                    activeTab === 'home' &&
                    guestSection === 'calculator' &&
                    !selectedProduct &&
                    !applyingProduct
                  ) {
                    return;
                  }
                  navigateWithLines(() => {
                    setSelectedProduct(null);
                    setApplyingProduct(null);
                    setGuestSection('calculator');
                    setActiveTab('home');
                  }, 'forward');
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
                  if (
                    activeTab === 'home' &&
                    guestSection === 'faqs' &&
                    !selectedProduct &&
                    !applyingProduct
                  ) {
                    return;
                  }
                  navigateWithLines(() => {
                    setSelectedProduct(null);
                    setApplyingProduct(null);
                    setGuestSection('faqs');
                    setActiveTab('home');
                  }, 'forward');
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
                onClick={() => {
                  if (
                    activeTab === 'home' &&
                    guestSection === 'contact' &&
                    !selectedProduct &&
                    !applyingProduct
                  ) {
                    return;
                  }
                  navigateWithLines(() => {
                    setSelectedProduct(null);
                    setApplyingProduct(null);
                    setGuestSection('contact');
                    setActiveTab('home');
                  }, 'forward');
                }}
                className={`h-full flex flex-col items-center justify-center gap-0.5 px-1 transition-colors ${
                  activeTab === 'home' && guestSection === 'contact'
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
        <PqDrawer
          open={guestMenuOpen}
          onClose={() => setGuestMenuOpen(false)}
          ariaLabel="Guest Menu"
        >
          <div className="w-72 max-w-[85vw] bg-white h-full p-5 flex flex-col justify-between border-l border-[#E5E7EB] shadow-xl">
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
                    navigateWithLines(() => {
                      setSelectedProduct(null);
                      setApplyingProduct(null);
                      setGuestSection('products');
                      setActiveTab('home');
                    }, 'forward');
                  }}
                  className="w-full min-h-[44px] px-3 rounded-xl hover:bg-[#EAF3EE] text-left text-sm font-medium text-[#1E2022] flex items-center gap-3"
                >
                  <Sparkles className="w-4 h-4 text-[#007A48]" />
                  <span>Family Takaful Products</span>
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
                    navigateWithLines(() => {
                      setSelectedProduct(null);
                      setApplyingProduct(null);
                      setGuestSection('contact');
                      setActiveTab('home');
                    }, 'forward');
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
                  navigateWithLines(() => setScreen('login'), 'forward');
                }}
                className="w-full min-h-[44px] rounded-full bg-[#A32035] text-white text-sm font-semibold"
              >
                Customer Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setGuestMenuOpen(false);
                  navigateWithLines(() => setScreen('register'), 'forward');
                }}
                className="w-full min-h-[44px] rounded-full border border-[#A32035] text-[#A32035] text-sm font-semibold"
              >
                New Customer? Register
              </button>
            </div>
          </div>
        </PqDrawer>
      </div>
    );
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={
            screen === 'splash'
              ? false
              : { opacity: 0, x: direction === 'forward' ? 20 : -20 }
          }
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction === 'forward' ? -16 : 16 }}
          transition={{ duration: 0.26, ease: PQ_EASE }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      <PqModal
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        ariaLabel="Contact and Support"
      >
        <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E5E7EB] shadow-lg">
          <div className="text-xs font-semibold text-[#007A48]">
            Pak-Qatar Family Takaful Limited (PQFTL)
          </div>
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
            onClick={() => setContactModalOpen(false)}
            className="mt-5 w-full min-h-[44px] rounded-xl bg-[#A32035] text-white text-xs font-medium"
          >
            Close
          </button>
        </div>
      </PqModal>

      <PakQatarAssistant
        visible={screen !== 'splash' && !navLoading}
        hasBottomNav={screen === 'app'}
        isAuthenticated={isAuthenticated}
        authToken={authToken}
        appLanguage={language}
        certificates={certificates}
        payments={payments}
        claims={claims}
        onNavigateAction={handleAssistantNavigation}
      />
      <NavigationLoadingOverlay visible={navLoading} />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ScreenTransitionProvider>
        <AppContent />
      </ScreenTransitionProvider>
    </MotionConfig>
  );
}
