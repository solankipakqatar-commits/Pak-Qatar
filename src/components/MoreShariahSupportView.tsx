import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  Building,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Globe,
  Headphones,
  Lock,
  LogOut,
  MapPin,
  MessageCircle,
  PhoneCall,
  RotateCcw,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { LanguageCode, MoreSubSection, SupportComplaint } from '../types/pqfs';
import {
  DEMO_AGENTS,
  DEMO_BRANCHES,
  EXISTING_VS_PROPOSED_SERVICES,
  PQFS_VERIFIED_CONTACT,
  SHARIAH_MODULES,
} from '../data/pqfsData';
import { PQ_EASE, PqTabSwap } from './MotionPrimitives';

interface MoreViewProps {
  isAuthenticated: boolean;
  subSection: MoreSubSection;
  onSubSectionChange: (sub: MoreSubSection) => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  maskSensitive: boolean;
  onToggleMask: () => void;
  biometricEnabled: boolean;
  onToggleBiometric: () => void;
  complaints: SupportComplaint[];
  onAddComplaint: (c: SupportComplaint) => void;
  onReplaySplash: () => void;
  onLogoutOrLogin: () => void;
}

export const MoreShariahSupportView: React.FC<MoreViewProps> = ({
  isAuthenticated,
  subSection,
  onSubSectionChange,
  language,
  onLanguageChange,
  maskSensitive,
  onToggleMask,
  biometricEnabled,
  onToggleBiometric,
  complaints,
  onAddComplaint,
  onReplaySplash,
  onLogoutOrLogin,
}) => {
  const [selectedShariahId, setSelectedShariahId] = useState(SHARIAH_MODULES[0].id);
  const [agentQuery, setAgentQuery] = useState('PQF-AGT-1042');
  const [agentResult, setAgentResult] = useState<(typeof DEMO_AGENTS)[0] | null>(DEMO_AGENTS[0]);
  const [agentChecked, setAgentChecked] = useState(false);

  const [compCategory, setCompCategory] = useState('Contribution / Allocation Query');
  const [compSubject, setCompSubject] = useState('');
  const [compMessage, setCompMessage] = useState('');
  const [compSubmittedRef, setCompSubmittedRef] = useState<string | null>(null);

  const activeShariah =
    SHARIAH_MODULES.find((m) => m.id === selectedShariahId) ?? SHARIAH_MODULES[0];

  const handleVerifyAgent = () => {
    const q = agentQuery.trim().toUpperCase();
    const match = DEMO_AGENTS.find((a) => a.code === q) ?? null;
    setAgentResult(match);
    setAgentChecked(true);
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compSubject.trim()) return;
    const ticket = `GRV-PQF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    onAddComplaint({
      id: `cmp-${Date.now()}`,
      ticketNumber: ticket,
      category: compCategory,
      subject: compSubject.trim(),
      submittedDate: '26 Nov 2026',
      status: 'In Review (Demo)',
      summary: compMessage.trim() || 'Submitted via mobile support centre.',
    });
    setCompSubmittedRef(ticket);
    setCompSubject('');
    setCompMessage('');
  };

  const renderSection = () => {
    if (subSection === 'shariah') {
      return (
        <div className="space-y-6 pb-8">
        <button
          type="button"
          onClick={() => onSubSectionChange('hub')}
          className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium text-[#5C6066] hover:text-[#A32035]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to More</span>
        </button>

        <div>
          <div className="text-xs font-semibold text-[#007A48]">Shariah Transparency Centre</div>
          <h1 className="mt-1 text-2xl font-bold text-[#1E2022]">How Pak-Qatar Takaful Works</h1>
          <p className="mt-1 text-xs text-[#5C6066]">
            Clear structural overview of Waqf, Tabarru, Wakalah, and Participant Funds.
          </p>
        </div>

        {/* Simple Visual Flow Diagram: How Takaful Works */}
        <section className="rounded-3xl border border-[#007A48]/20 bg-[#EAF3EE] p-5">
          <h2 className="text-sm font-bold text-[#1E2022] mb-3">
            Waqf-Wakalah Flow Structure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-4">
              <div className="font-bold text-[#A32035]">01. Participant Contribution</div>
              <p className="text-[#5C6066] mt-1 leading-relaxed">
                Member pays scheduled contribution free of interest (Riba) or speculative risk (Gharar).
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-4">
              <div className="font-bold text-[#007A48]">02. Waqf & Wakalah Separation</div>
              <p className="text-[#5C6066] mt-1 leading-relaxed">
                Disclosed Wakalah fee covers administration; Tabarru enters the Waqf mutual risk pool; investment units enter PIA (for Family savings plans).
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-4">
              <div className="font-bold text-[#1E2022]">03. Claims & Surplus Governance</div>
              <p className="text-[#5C6066] mt-1 leading-relaxed">
                Claims are paid from the Waqf pool; any net surplus after reserves is governed by Shariah Supervisory Board rules.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Shariah Topic Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 space-y-2">
            {SHARIAH_MODULES.map((mod) => (
              <button
                key={mod.id}
                type="button"
                onClick={() => setSelectedShariahId(mod.id)}
                className={`w-full min-h-[48px] px-4 py-3 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                  selectedShariahId === mod.id
                    ? 'border-[#007A48] bg-[#007A48] text-white'
                    : 'border-[#E5E7EB] bg-white text-[#1E2022] hover:border-[#007A48]'
                }`}
              >
                <span>{mod.title}</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            ))}
          </div>

          <div className="lg:col-span-7 rounded-3xl border border-[#E5E7EB] bg-white p-6">
            <PqTabSwap swapKey={activeShariah.id}>
              <div>
                <div className="text-xs font-semibold text-[#007A48]">Educational Guide</div>
                <h2 className="mt-1 text-xl font-bold text-[#1E2022]">{activeShariah.title}</h2>
                <p className="mt-2.5 text-sm text-[#5C6066] leading-relaxed">{activeShariah.summary}</p>
                <ul className="mt-4 space-y-2 text-xs text-[#1E2022]">
                  {activeShariah.keyPoints.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#007A48] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </PqTabSwap>
          </div>
        </div>
      </div>
    );
    }

    if (subSection === 'support') {
    return (
      <div className="space-y-6 pb-8">
        <button
          type="button"
          onClick={() => onSubSectionChange('hub')}
          className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium text-[#5C6066] hover:text-[#A32035]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to More</span>
        </button>

        <div>
          <h1 className="text-2xl font-bold text-[#1E2022]">Customer Support Centre</h1>
          <p className="text-xs text-[#5C6066] mt-0.5">
            Official contact channels, complaint tracking, branch locator, and agent verification.
          </p>
        </div>

        {/* Official Contact Details */}
        <section className="rounded-3xl border border-[#007A48]/20 bg-[#EAF3EE] p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="font-semibold text-[#A32035]">Call Support (UAN)</div>
            <div className="text-sm font-bold text-[#1E2022] mt-1">{PQFS_VERIFIED_CONTACT.uan}</div>
            <a
              href="tel:+9221111825238"
              className="mt-2 inline-flex items-center gap-1.5 font-medium text-[#A32035] hover:underline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Helpline</span>
            </a>
          </div>
          <div>
            <div className="font-semibold text-[#007A48]">WhatsApp & Email</div>
            <div className="text-sm font-bold text-[#1E2022] mt-1">{PQFS_VERIFIED_CONTACT.email}</div>
            <div className="mt-1 text-[#5C6066] inline-flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-[#007A48]" />
              <span>{PQFS_VERIFIED_CONTACT.whatsappInfo}</span>
            </div>
          </div>
          <div>
            <div className="font-semibold text-[#1E2022]">Head Office</div>
            <div className="text-[#5C6066] mt-1 leading-relaxed">
              {PQFS_VERIFIED_CONTACT.headOffice}
            </div>
          </div>
        </section>

        {/* Submit & Track Complaint + Agent Verification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <form
            onSubmit={handleSubmitComplaint}
            className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-3"
          >
            <h2 className="text-base font-bold text-[#1E2022]">Submit a Complaint / Grievance</h2>
            <select
              value={compCategory}
              onChange={(e) => setCompCategory(e.target.value)}
              className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5E7EB] text-xs bg-white"
            >
              <option>Contribution / Allocation Query</option>
              <option>Claims Processing Delay</option>
              <option>Statement & Certificate Issuance</option>
              <option>General Service Feedback</option>
            </select>
            <input
              type="text"
              value={compSubject}
              onChange={(e) => setCompSubject(e.target.value)}
              placeholder="Subject..."
              className="w-full min-h-[42px] px-3 rounded-xl border border-[#E5E7EB] text-xs"
            />
            <textarea
              rows={2}
              value={compMessage}
              onChange={(e) => setCompMessage(e.target.value)}
              placeholder="Provide details (demo submission)..."
              className="w-full p-3 rounded-xl border border-[#E5E7EB] text-xs"
            />
            <AnimatePresence>
              {compSubmittedRef && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: PQ_EASE }}
                  className="text-xs font-semibold text-[#007A48]"
                >
                  Demo Ticket Logged: {compSubmittedRef}
                </motion.p>
              )}
            </AnimatePresence>
            <button
              type="submit"
              className="w-full min-h-[44px] rounded-xl bg-[#A32035] text-white text-xs font-medium"
            >
              Submit Complaint
            </button>

            <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
              <div className="text-xs font-bold text-[#1E2022]">Recent Tickets</div>
              {complaints.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-[#F6F6F7] text-xs">
                  <div className="flex justify-between font-semibold">
                    <span>{c.ticketNumber}</span>
                    <span className="text-[#007A48]">{c.status}</span>
                  </div>
                  <div className="text-[#5C6066] mt-0.5">{c.subject}</div>
                </div>
              ))}
            </div>
          </form>

          <div className="space-y-5">
            {/* Agent Verification */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-3">
              <h2 className="text-base font-bold text-[#1E2022]">Agent Verification (Demo)</h2>
              <p className="text-xs text-[#5C6066]">
                Verify consultant credentials by entering an illustrative code (try{' '}
                <span className="font-semibold text-[#1E2022]">PQF-AGT-1042</span> or{' '}
                <span className="font-semibold text-[#1E2022]">PQG-AGT-2088</span>).
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={agentQuery}
                  onChange={(e) => setAgentQuery(e.target.value)}
                  className="flex-1 min-h-[42px] px-3 rounded-xl border border-[#E5E7EB] text-xs"
                />
                <button
                  type="button"
                  onClick={handleVerifyAgent}
                  className="min-h-[42px] px-4 rounded-xl bg-[#007A48] text-white text-xs font-medium"
                >
                  Verify
                </button>
              </div>
              <AnimatePresence mode="wait">
                {agentResult ? (
                  <motion.div
                    key={agentResult.code}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22, ease: PQ_EASE }}
                    className="p-3 rounded-xl bg-[#F6F6F7] border border-[#E5E7EB] text-xs space-y-1"
                  >
                    <div className="font-bold text-[#1E2022] inline-flex items-center gap-1.5">
                      <BadgeCheck className="w-4 h-4 text-[#007A48]" />
                      <span>{agentResult.name}</span>
                    </div>
                    <div className="text-[#5C6066]">
                      {agentResult.entity} · {agentResult.region}
                    </div>
                    <div className="text-[#007A48] font-medium">{agentResult.status}</div>
                  </motion.div>
                ) : (
                  agentChecked && (
                    <motion.div
                      key="not-found"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22, ease: PQ_EASE }}
                      className="text-xs text-[#A32035] font-medium"
                    >
                      No matching consultant found in demonstration registry.
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </div>

            {/* Branch Directory */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-3">
              <h2 className="text-base font-bold text-[#1E2022]">Branch Directory</h2>
              <div className="divide-y divide-[#E5E7EB]">
                {DEMO_BRANCHES.map((b) => (
                  <div key={b.branch} className="py-2.5 text-xs">
                    <div className="font-bold text-[#1E2022] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#A32035]" />
                      <span>{b.branch}</span>
                    </div>
                    <div className="text-[#5C6066] mt-0.5">{b.address}</div>
                    <div className="text-[11px] text-[#007A48] mt-0.5">{b.hours}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    }

    if (subSection === 'services') {
      return (
        <div className="space-y-6 pb-8">
          <button
            type="button"
            onClick={() => onSubSectionChange('hub')}
            className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium text-[#5C6066] hover:text-[#A32035]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to More</span>
          </button>

          <div>
            <h1 className="text-2xl font-bold text-[#1E2022]">PQFS Services Transparency Map</h1>
            <p className="text-xs text-[#5C6066] mt-0.5">
              Distinguishing existing PQFS digital portal services from proposed mobile application capabilities.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white divide-y divide-[#E5E7EB]">
            {EXISTING_VS_PROPOSED_SERVICES.map((row) => (
              <div key={row.service} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="font-bold text-[#1E2022]">{row.service}</span>
                <span className="font-medium text-[#007A48]">{row.status}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Main More Hub
    return (
      <div className="space-y-6 pb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1E2022]">More, Shariah & Support</h1>
          <p className="text-xs text-[#5C6066] mt-0.5">
            Shariah governance education, official support services, and privacy preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => onSubSectionChange('shariah')}
            className="pq-card-interactive text-left p-5 rounded-2xl border border-[#E5E7EB] bg-white hover:border-[#007A48] transition-colors"
          >
            <Scale className="w-6 h-6 text-[#007A48]" />
            <h2 className="mt-3 text-base font-bold text-[#1E2022]">Shariah Centre</h2>
            <p className="mt-1 text-xs text-[#5C6066]">
              Explore Waqf, Tabarru, Wakalah, and Shariah governance principles.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onSubSectionChange('support')}
            className="pq-card-interactive text-left p-5 rounded-2xl border border-[#E5E7EB] bg-white hover:border-[#A32035] transition-colors"
          >
            <Headphones className="w-6 h-6 text-[#A32035]" />
            <h2 className="mt-3 text-base font-bold text-[#1E2022]">Customer Support</h2>
            <p className="mt-1 text-xs text-[#5C6066]">
              Helpline, WhatsApp self-service, complaints, branches, and agent lookup.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onSubSectionChange('services')}
            className="pq-card-interactive text-left p-5 rounded-2xl border border-[#E5E7EB] bg-white hover:border-[#A32035] transition-colors"
          >
            <Building className="w-6 h-6 text-[#F5B335]" />
            <h2 className="mt-3 text-base font-bold text-[#1E2022]">PQFS Services Map</h2>
            <p className="mt-1 text-xs text-[#5C6066]">
              Compare existing PQFS portal services with proposed mobile capabilities.
            </p>
          </button>
        </div>

      {/* Security & Preferences */}
      <section className="rounded-2xl border border-[#E5E7EB] bg-white divide-y divide-[#E5E7EB]">
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {maskSensitive ? (
              <EyeOff className="w-4 h-4 text-[#A32035]" />
            ) : (
              <Eye className="w-4 h-4 text-[#007A48]" />
            )}
            <div>
              <div className="text-sm font-semibold text-[#1E2022]">Mask Sensitive Figures & CNIC</div>
              <div className="text-xs text-[#5C6066]">
                Hide balances and CNIC digits when viewing in public
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleMask}
            className={`min-h-[38px] px-3.5 rounded-xl text-xs font-medium ${
              maskSensitive ? 'bg-[#A32035] text-white' : 'bg-[#F4F4F5] text-[#1E2022]'
            }`}
          >
            {maskSensitive ? 'Masked' : 'Visible'}
          </button>
        </div>

        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-[#007A48]" />
            <div>
              <div className="text-sm font-semibold text-[#1E2022]">Biometric Quick Access</div>
              <div className="text-xs text-[#5C6066]">Optional Face ID / Fingerprint sign-in</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleBiometric}
            className={`min-h-[38px] px-3.5 rounded-xl text-xs font-medium ${
              biometricEnabled ? 'bg-[#007A48] text-white' : 'bg-[#F4F4F5] text-[#1E2022]'
            }`}
          >
            {biometricEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-[#A32035]" />
            <div>
              <div className="text-sm font-semibold text-[#1E2022]">Language Preference</div>
              <div className="text-xs text-[#5C6066]">Switch primary greeting & labels</div>
            </div>
          </div>
          <div className="inline-flex p-0.5 rounded-lg bg-[#F4F4F5] border border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`min-h-[34px] px-3 rounded-md text-xs font-medium ${
                language === 'en' ? 'bg-white text-[#A32035] shadow-sm' : 'text-[#5C6066]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('ur')}
              className={`min-h-[34px] px-3 rounded-md text-xs font-medium ${
                language === 'ur' ? 'bg-white text-[#A32035] shadow-sm' : 'text-[#5C6066]'
              }`}
            >
              اردو
            </button>
          </div>
        </div>

        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-4 h-4 text-[#5C6066]" />
            <div>
              <div className="text-sm font-semibold text-[#1E2022]">Islamic Ornamental Splash</div>
              <div className="text-xs text-[#5C6066]">Replay initial PQFS launch experience</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onReplaySplash}
            className="min-h-[38px] px-3.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#1E2022]"
          >
            Replay
          </button>
        </div>

        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4 text-[#A32035]" />
            <div>
              <div className="text-sm font-semibold text-[#1E2022]">
                {isAuthenticated ? 'Sign Out to Welcome / Guest' : 'Sign In as Customer'}
              </div>
              <div className="text-xs text-[#5C6066]">
                {isAuthenticated
                  ? 'Return to welcome screen or guest mode'
                  : 'Access demo customer portfolio'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogoutOrLogin}
            className="min-h-[38px] px-3.5 rounded-xl bg-[#A32035] text-white text-xs font-medium"
          >
            {isAuthenticated ? 'Sign Out' : 'Login'}
          </button>
        </div>
      </section>
    </div>
    );
  };

  return <PqTabSwap swapKey={subSection}>{renderSection()}</PqTabSwap>;
};
