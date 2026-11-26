import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Fingerprint,
  Globe,
  HelpCircle,
  Lock,
  ScanFace,
  ShieldCheck,
  Smartphone,
  User,
} from 'lucide-react';
import { LanguageCode } from '../types/pqfs';
import { DEMO_CUSTOMER, PQFS_VERIFIED_CONTACT } from '../data/pqfsData';
import { PakQatarLogo } from './BrandAssets';
import { PqTabSwap } from './MotionPrimitives';

interface WelcomeViewProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onExploreGuest: () => void;
  onGoLogin: () => void;
  onGoRegister: () => void;
  onOpenContact: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  language,
  onLanguageChange,
  onExploreGuest,
  onGoLogin,
  onGoRegister,
  onOpenContact,
}) => {
  return (
    <div className="min-h-screen bg-[#F7F5F2] flex flex-col justify-between relative overflow-hidden">
      {/* Main Centered Mobile-First Welcome Card Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-8 max-w-md w-full mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-sm text-center"
        >
          {/* Official Pak-Qatar Logo */}
          <div className="flex justify-center pt-1 pb-4">
            <PakQatarLogo variant="full" />
          </div>

          <h1 className="mt-2 text-2xl sm:text-[28px] font-bold text-[#1E2022] leading-tight text-balance">
            {language === 'ur' ? (
              <>
                آپ کا تکافل، <span className="text-[#A32035]">اب سادہ</span>
              </>
            ) : (
              <>
                Your Takaful,
                <br />
                <span className="text-[#A32035]">Made Simple.</span>
              </>
            )}
          </h1>
          <p className="mt-2.5 text-sm text-[#5C6066]">
            {language === 'ur'
              ? 'اپنی تکافل خدمات آسانی سے دریافت کریں۔'
              : 'Explore your Takaful services with ease.'}
          </p>

          {/* Reference Screen 1 Dual Stacked Action Buttons */}
          <div className="mt-7 space-y-3">
            <button
              type="button"
              onClick={onExploreGuest}
              className="w-full min-h-[50px] px-4 rounded-2xl border border-[#A32035] bg-white hover:bg-[#EAF3EE] text-[#A32035] text-sm font-semibold flex items-center justify-between transition-colors"
            >
              <span className="inline-flex items-center gap-2.5">
                <User className="w-4 h-4 shrink-0" />
                <span>{language === 'ur' ? 'مہمان کے طور پر دیکھیں' : 'Explore as Guest'}</span>
              </span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              type="button"
              onClick={onGoLogin}
              className="w-full min-h-[50px] px-4 rounded-2xl bg-[#A32035] hover:opacity-90 text-white text-sm font-semibold flex items-center justify-between transition-opacity"
            >
              <span className="inline-flex items-center gap-2.5">
                <Lock className="w-4 h-4 shrink-0" />
                <span>{language === 'ur' ? 'کسٹمر لاگ ان' : 'Customer Login'}</span>
              </span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </button>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={onGoRegister}
              className="min-h-[40px] text-xs font-semibold text-[#007A48] hover:underline"
            >
              New Customer? Register
            </button>
          </div>

          {/* Reference Screen 1 Footer Utility Bar */}
          <div className="mt-5 pt-4 border-t border-[#E5E7EB] flex items-center justify-between gap-2 text-xs text-[#5C6066]">
            <button
              type="button"
              onClick={onOpenContact}
              className="min-h-[40px] inline-flex items-center gap-1.5 text-[#1E2022] hover:text-[#A32035] font-medium"
            >
              <HelpCircle className="w-4 h-4 text-[#A32035]" />
              <span>Help / Contact Us</span>
            </button>

            <div className="inline-flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#007A48]" />
              <div className="inline-flex p-0.5 rounded-lg bg-[#EAF3EE] border border-[#007A48]/20">
                <button
                  type="button"
                  onClick={() => onLanguageChange('en')}
                  className={`min-h-[28px] px-2 text-[11px] font-medium rounded-md transition-colors ${
                    language === 'en' ? 'bg-white text-[#A32035] shadow-xs' : 'text-[#5C6066]'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange('ur')}
                  className={`min-h-[28px] px-2 text-[11px] font-medium rounded-md transition-colors ${
                    language === 'ur' ? 'bg-white text-[#A32035] shadow-xs' : 'text-[#5C6066]'
                  }`}
                >
                  اردو
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-4 text-[11px] text-[#5C6066] text-center">
          {PQFS_VERIFIED_CONTACT.companyGroup} · Demo Experience
        </div>
      </div>

      {/* Subtle Flowing Bottom Brand Wave (Burgundy #A32035 & Green #007A48 matching Screen 1) */}
      <div
        className="w-full h-12 sm:h-16 relative overflow-hidden pointer-events-none select-none leading-none"
        aria-hidden="true"
      >
        {/* Seamless Primary Burgundy Wave (#A32035) */}
        <svg
          viewBox="0 0 2880 84"
          className="pq-wave-burgundy absolute inset-y-0 left-0 w-[200%] h-full block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 38 C240 68, 480 68, 720 38 C960 8, 1200 8, 1440 38 C1680 68, 1920 68, 2160 38 C2400 8, 2640 8, 2880 38 L2880 88 L0 88 Z"
            fill="#A32035"
          />
        </svg>

        {/* Seamless Counter-Flowing Green Crest Wave (#007A48) with Natural Blend */}
        <div
          className="pq-wave-green-swell absolute inset-0"
          style={{
            WebkitMaskImage:
              'linear-gradient(90deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.28) 34%, rgba(0,0,0,0.88) 68%, rgba(0,0,0,1) 100%)',
            maskImage:
              'linear-gradient(90deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.28) 34%, rgba(0,0,0,0.88) 68%, rgba(0,0,0,1) 100%)',
          }}
        >
          <svg
            viewBox="0 0 2880 84"
            className="pq-wave-green-drift absolute inset-y-0 left-0 w-[200%] h-full block"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="pq-green-blend" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#007A48" stopOpacity="0.82" />
                <stop offset="55%" stopColor="#007A48" stopOpacity="0.96" />
                <stop offset="100%" stopColor="#007A48" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              d="M0 46 C240 12, 480 12, 720 46 C960 76, 1200 76, 1440 46 C1680 12, 1920 12, 2160 46 C2400 76, 2640 76, 2880 46 L2880 88 L0 88 Z"
              fill="url(#pq-green-blend)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

interface LoginViewProps {
  biometricEnabled: boolean;
  onBack: () => void;
  onLoginSuccess: () => void;
  onGoRegister: () => void;
  onOpenContact: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  biometricEnabled,
  onBack,
  onLoginSuccess,
  onGoRegister,
  onOpenContact,
}) => {
  const [identifier, setIdentifier] = useState(DEMO_CUSTOMER.customerId);
  const [password, setPassword] = useState('PQFS@Demo2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || password.length < 6) {
      setError('Please enter your Mobile Number or Customer ID and password (min. 6 characters).');
      return;
    }
    setError('');
    onLoginSuccess();
  };

  const triggerBiometric = () => {
    setError('');
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#EAF3EE] flex flex-col justify-center px-4 py-6 sm:px-6">
      <div className="max-w-md w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-7 shadow-sm"
        >
          {/* Reference Screen 4 Top Bar: Back arrow + Centered Official Logo */}
          <div className="relative flex items-center justify-center min-h-[44px]">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to Welcome"
              className="absolute left-0 min-h-[44px] min-w-[44px] flex items-center justify-start text-[#A32035] hover:opacity-80"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <PakQatarLogo variant="medium" />
          </div>

          <PqTabSwap swapKey={forgotMode ? 'forgot' : 'login'}>
            {!forgotMode ? (
              <div>
              <div className="text-center mt-5">
                <h1 className="text-2xl font-bold text-[#1E2022]">
                  Welcome <span className="text-[#A32035]">Back</span>
                </h1>
                <p className="mt-1 text-xs text-[#5C6066]">
                  Sign in to access your Takaful account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-[#5C6066] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="pq-id"
                    aria-label="Mobile Number or Customer ID"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Mobile Number or Customer ID"
                    className="w-full min-h-[48px] pl-10 pr-3.5 rounded-2xl border border-[#E5E7EB] bg-white text-sm text-[#1E2022] focus:outline-none focus:border-[#A32035]"
                  />
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-[#5C6066] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="pq-pw"
                    aria-label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full min-h-[48px] pl-10 pr-11 rounded-2xl border border-[#E5E7EB] bg-white text-sm text-[#1E2022] focus:outline-none focus:border-[#A32035]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] flex items-center justify-center text-[#5C6066] hover:text-[#1E2022]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Forgot Password + Outlined New Customer? Register pill matching Screen 4 */}
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotMode(true);
                      setResetSent(false);
                    }}
                    className="text-xs font-medium text-[#A32035] hover:underline min-h-[36px]"
                  >
                    Forgot Password?
                  </button>
                  <button
                    type="button"
                    onClick={onGoRegister}
                    className="min-h-[36px] px-3 rounded-full border border-[#A32035] text-[11px] font-semibold text-[#A32035] hover:bg-[#EAF3EE] transition-colors whitespace-nowrap"
                  >
                    New Customer? Register
                  </button>
                </div>

                {error && (
                  <p className="text-xs font-medium text-[#A32035]" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full min-h-[48px] px-5 rounded-full bg-[#A32035] hover:opacity-90 text-white text-sm font-semibold transition-opacity flex items-center justify-between"
                >
                  <span className="w-4" aria-hidden="true" />
                  <span>Login</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>

              {/* Biometric Access Row matching Screen 4 */}
              <div className="mt-5">
                <div className="flex items-center gap-3 text-xs text-[#5C6066]">
                  <div className="flex-1 h-px bg-[#E5E7EB]" />
                  <span>or</span>
                  <div className="flex-1 h-px bg-[#E5E7EB]" />
                </div>
                <div className="text-center text-xs font-semibold text-[#1E2022] mt-2.5 mb-3">
                  {biometricEnabled ? 'Login with Biometric' : 'Quick Demo Biometric'}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={triggerBiometric}
                    className="min-h-[64px] p-3 rounded-2xl border border-[#E5E7EB] bg-[#F7F5F2] hover:border-[#A32035] text-xs font-medium text-[#1E2022] flex flex-col items-center justify-center gap-1.5 transition-colors"
                  >
                    <ScanFace className="w-5 h-5 text-[#A32035]" />
                    <span>Face ID</span>
                  </button>
                  <button
                    type="button"
                    onClick={triggerBiometric}
                    className="min-h-[64px] p-3 rounded-2xl border border-[#E5E7EB] bg-[#F7F5F2] hover:border-[#007A48] text-xs font-medium text-[#1E2022] flex flex-col items-center justify-center gap-1.5 transition-colors"
                  >
                    <Fingerprint className="w-5 h-5 text-[#007A48]" />
                    <span>Fingerprint</span>
                  </button>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E5E7EB] flex items-center justify-center gap-3 text-xs">
                <span className="text-[#5C6066]">Need Help?</span>
                <span className="text-[#E5E7EB]" aria-hidden="true">|</span>
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="font-semibold text-[#A32035] hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Contact Us</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <h2 className="text-xl font-bold text-[#1E2022]">Reset Password</h2>
              <p className="mt-1 text-sm text-[#5C6066]">
                Enter your registered mobile number to receive a verification OTP (Demo).
              </p>
              <div className="mt-4 space-y-3">
                <input
                  type="tel"
                  defaultValue={DEMO_CUSTOMER.mobile}
                  className="w-full min-h-[46px] px-3.5 rounded-2xl border border-[#E5E7EB] text-sm"
                  placeholder="03XX-XXXXXXX"
                />
                {resetSent && (
                  <p className="text-xs font-medium text-[#007A48]">
                    Demo password reset OTP dispatched to {DEMO_CUSTOMER.mobile}.
                  </p>
                )}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotMode(false)}
                    className="flex-1 min-h-[44px] rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#1E2022]"
                  >
                    Back to Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetSent(true)}
                    className="flex-1 min-h-[44px] rounded-xl bg-[#A32035] text-white text-sm font-medium"
                  >
                    Send OTP
                  </button>
                </div>
              </div>
            </div>
          )}
          </PqTabSwap>
        </motion.div>
      </div>

    </div>
  );
};

interface RegisterViewProps {
  pendingApplicationProductName?: string | null;
  onBack: () => void;
  onCompleteToBiometric: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  pendingApplicationProductName,
  onBack,
  onCompleteToBiometric,
}) => {
  // Step 1 mirrors Screen 5 ("Create Your Account": CNIC + Mobile + Create Password),
  // followed smoothly by OTP (Step 2), Confirm Password (Step 3), and Confirmation (Step 4).
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [cnic, setCnic] = useState('42101-5839201-3');
  const [mobile, setMobile] = useState('0300-8241905');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('123456');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(45);

  useEffect(() => {
    if (step !== 2 || countdown <= 0) return;
    const timer = window.setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [step, countdown]);

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (cnic.replace(/\D/g, '').length !== 13) {
        setError('Please enter a valid 13-digit CNIC (e.g., 42101-5839201-3).');
        return;
      }
      if (mobile.replace(/\D/g, '').length < 10) {
        setError('Please enter a valid Pakistani mobile number.');
        return;
      }
      if (password.length < 8) {
        setError('Please create a password of at least 8 characters.');
        return;
      }
      setCountdown(45);
      setStep(2);
    } else if (step === 2) {
      if (otp.trim().length !== 6) {
        setError('Enter the 6-digit verification code (Demo OTP: 123456).');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter to confirm.');
        return;
      }
      setStep(4);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAF3EE] flex flex-col justify-center px-4 py-6 sm:px-6">
      <div className="max-w-md w-full mx-auto">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-7 shadow-sm"
        >
          {/* Reference Screen 5 Header: Back Arrow + Centered Official Logo */}
          <div className="relative flex items-center justify-center min-h-[44px]">
            <button
              type="button"
              onClick={() => (step > 1 && step < 4 ? setStep((s) => (s - 1) as typeof step) : onBack())}
              aria-label="Back"
              className="absolute left-0 min-h-[44px] min-w-[44px] flex items-center justify-start text-[#A32035] hover:opacity-80"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <PakQatarLogo variant="medium" />
          </div>

          {pendingApplicationProductName && (
            <div className="mt-3 p-3 rounded-xl bg-[#EAF3EE] border border-[#007A48]/20 text-xs text-[#1E2022] text-center">
              Registering to apply for{' '}
              <span className="font-semibold text-[#A32035]">{pendingApplicationProductName}</span>
            </div>
          )}

          {/* Progress Dots */}
          <div className="mt-4 grid grid-cols-4 gap-1.5" aria-label={`Registration step ${step} of 4`}>
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-colors ${
                  idx <= step ? 'bg-[#A32035]' : 'bg-[#E5E7EB]'
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="mt-5">
              <div className="text-center">
                <h1 className="text-xl font-bold text-[#A32035]">Create Your Account</h1>
                <p className="mt-1 text-xs text-[#5C6066]">Let&apos;s get you started.</p>
              </div>

              <div className="mt-5 space-y-3.5">
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-[#5C6066] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-cnic"
                    aria-label="CNIC Number"
                    type="text"
                    inputMode="numeric"
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    placeholder="CNIC Number (42101-5839201-3)"
                    className="w-full min-h-[48px] pl-10 pr-3.5 rounded-2xl border border-[#E5E7EB] bg-white text-sm tabular-nums focus:outline-none focus:border-[#A32035]"
                  />
                </div>

                <div className="relative">
                  <Smartphone className="w-4 h-4 text-[#5C6066] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-mob"
                    aria-label="Mobile Number"
                    type="tel"
                    inputMode="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Mobile Number"
                    className="w-full min-h-[48px] pl-10 pr-3.5 rounded-2xl border border-[#E5E7EB] bg-white text-sm tabular-nums focus:outline-none focus:border-[#A32035]"
                  />
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-[#5C6066] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-pw1"
                    aria-label="Create Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create Password (min. 8 characters)"
                    className="w-full min-h-[48px] pl-10 pr-11 rounded-2xl border border-[#E5E7EB] bg-white text-sm focus:outline-none focus:border-[#A32035]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] flex items-center justify-center text-[#5C6066]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mt-5">
              <div className="text-center">
                <h1 className="text-xl font-bold text-[#A32035]">Verify OTP</h1>
                <p className="mt-1 text-xs text-[#5C6066]">
                  Enter the 6-digit code sent to <span className="font-semibold text-[#1E2022]">{mobile}</span>. (Demo OTP:{' '}
                  <span className="font-semibold text-[#007A48]">123456</span>)
                </p>
              </div>
              <input
                id="reg-otp"
                aria-label="6-Digit OTP"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-5 w-full min-h-[50px] px-4 rounded-2xl border border-[#E5E7EB] text-center text-lg font-bold tracking-[0.35em] tabular-nums focus:outline-none focus:border-[#A32035]"
              />
              <div className="mt-3 flex items-center justify-between text-xs text-[#5C6066]">
                <span className="tabular-nums">
                  {countdown > 0 ? `Resend available in ${countdown}s` : 'You can resend now'}
                </span>
                <button
                  type="button"
                  disabled={countdown > 0}
                  onClick={() => setCountdown(45)}
                  className="font-medium text-[#A32035] disabled:text-[#9CA3AF]"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="mt-5">
              <div className="text-center">
                <h1 className="text-xl font-bold text-[#A32035]">Confirm Password</h1>
                <p className="mt-1 text-xs text-[#5C6066]">
                  Re-enter your password to complete your account registration.
                </p>
              </div>
              <input
                id="reg-pw2"
                aria-label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="mt-5 w-full min-h-[48px] px-4 rounded-2xl border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#A32035]"
              />
            </div>
          )}

          {step === 4 && (
            <div className="mt-6 text-center py-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#EAF3EE] text-[#007A48] flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="mt-4 text-xl font-bold text-[#1E2022]">Account Created (Demo)</h1>
              <p className="mt-1.5 text-sm text-[#5C6066]">
                Your digital PQFS profile for CNIC <span className="font-medium text-[#1E2022]">42101-•••••••-3</span> is ready.
              </p>
              <div className="mt-4 p-3 rounded-xl bg-[#F7F5F2] border border-[#E5E7EB] text-xs text-[#5C6066]">
                Reference ID: <span className="font-semibold text-[#1E2022]">REG-PQF-2026-8410</span>
              </div>
              <button
                type="button"
                onClick={onCompleteToBiometric}
                className="mt-6 w-full min-h-[48px] px-5 rounded-full bg-[#A32035] hover:opacity-90 text-white text-sm font-semibold flex items-center justify-between"
              >
                <span className="w-4" aria-hidden="true" />
                <span>Continue to Biometrics</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {error && (
            <p className="mt-3 text-xs font-medium text-[#A32035]" role="alert">
              {error}
            </p>
          )}

          {step < 4 && (
            <>
              <button
                type="button"
                onClick={handleNext}
                className="mt-6 w-full min-h-[48px] px-5 rounded-full bg-[#A32035] hover:opacity-90 text-white text-sm font-semibold flex items-center justify-between"
              >
                <span className="w-4" aria-hidden="true" />
                <span>{step === 1 ? 'Register' : step === 3 ? 'Create Account' : 'Verify & Continue'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Security assurance card matching Screen 5 bottom */}
              <div className="mt-4 p-3.5 rounded-2xl bg-[#EAF3EE] border border-[#007A48]/20 flex items-center justify-center gap-2 text-xs text-[#1E2022]">
                <ShieldCheck className="w-4 h-4 text-[#007A48] shrink-0" />
                <span>Your information is secure and confidential.</span>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

interface BiometricSetupViewProps {
  onEnable: () => void;
  onSkip: () => void;
}

export const BiometricSetupView: React.FC<BiometricSetupViewProps> = ({ onEnable, onSkip }) => {
  const [selectedType, setSelectedType] = useState<'face' | 'finger'>('finger');

  return (
    <div className="min-h-screen bg-[#EAF3EE] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="max-w-md w-full bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-sm text-center"
      >
        {/* Reference Screen 6 Top Circular Burgundy Fingerprint Emblem */}
        <div className="w-24 h-24 mx-auto rounded-full bg-[#F7F5F2] border border-[#E5E7EB] flex items-center justify-center">
          <Fingerprint className="w-12 h-12 text-[#A32035]" />
        </div>

        <h1 className="mt-5 text-xl font-bold text-[#1E2022]">Enable Biometric Login</h1>
        <p className="mt-2 text-xs text-[#5C6066] leading-relaxed max-w-xs mx-auto">
          For faster and more secure access, enable Face ID and/or Fingerprint. Optional and changeable anytime.
        </p>

        {/* Reference Screen 6 Vertical Biometric Options */}
        <div className="mt-6 space-y-2.5 text-left">
          <button
            type="button"
            onClick={() => setSelectedType('face')}
            className={`pq-card-interactive w-full min-h-[52px] px-4 rounded-2xl border flex items-center justify-between transition-colors ${
              selectedType === 'face'
                ? 'border-[#A32035] bg-[#EAF3EE] text-[#1E2022]'
                : 'border-[#E5E7EB] bg-[#F7F5F2] text-[#1E2022]'
            }`}
          >
            <span className="inline-flex items-center gap-3">
              <ScanFace className="w-5 h-5 text-[#A32035]" />
              <span className="text-sm font-semibold">Face ID</span>
            </span>
            {selectedType === 'face' && (
              <span className="w-2.5 h-2.5 rounded-full bg-[#F5B335] border border-[#A32035]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('finger')}
            className={`pq-card-interactive w-full min-h-[52px] px-4 rounded-2xl border flex items-center justify-between transition-colors ${
              selectedType === 'finger'
                ? 'border-[#A32035] bg-[#EAF3EE] text-[#1E2022]'
                : 'border-[#E5E7EB] bg-[#F7F5F2] text-[#1E2022]'
            }`}
          >
            <span className="inline-flex items-center gap-3">
              <Fingerprint className="w-5 h-5 text-[#A32035]" />
              <span className="text-sm font-semibold">Fingerprint</span>
            </span>
            {selectedType === 'finger' && (
              <span className="w-2.5 h-2.5 rounded-full bg-[#F5B335] border border-[#A32035]" />
            )}
          </button>
        </div>

        <div className="mt-6 space-y-2">
          <button
            type="button"
            onClick={onEnable}
            className="w-full min-h-[48px] px-5 rounded-full bg-[#A32035] hover:opacity-90 text-white text-sm font-semibold flex items-center justify-between"
          >
            <span className="w-4" aria-hidden="true" />
            <span>Enable</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="w-full min-h-[42px] text-xs font-semibold text-[#A32035] hover:underline"
          >
            Skip for Now
          </button>
        </div>
      </motion.div>
    </div>
  );
};
