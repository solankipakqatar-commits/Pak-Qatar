import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  CheckCircle2,
  HeartPulse,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  Users,
} from 'lucide-react';
import { ElaajProvider, FamilyMember } from '../types/pqfs';
import { DEMO_CUSTOMER, DEMO_ELAAJ_PROVIDERS } from '../data/pqfsData';
import {
  PQ_EASE,
  PqModal,
  PqSelect,
  PqStaggerGroup,
  PqStaggerItem,
  PqTabSwap,
  useScreenTransition,
} from './MotionPrimitives';

interface FamilyAndElaajViewProps {
  isAuthenticated: boolean;
  initialMode: 'family' | 'elaaj';
  mode?: 'family' | 'elaaj';
  onModeChange?: (nextMode: 'family' | 'elaaj') => void;
  familyMembers: FamilyMember[];
  onUpdateFamilyMember: (id: string, sharePercent: number) => void;
  onRequireLogin: () => void;
  onGoToClaims: () => void;
}

export const FamilyAndElaajView: React.FC<FamilyAndElaajViewProps> = ({
  isAuthenticated,
  initialMode,
  mode,
  onModeChange,
  familyMembers,
  onUpdateFamilyMember,
  onRequireLogin,
  onGoToClaims,
}) => {
  const { direction } = useScreenTransition();
  const [localMode, setLocalMode] = useState<'family' | 'elaaj'>(initialMode);
  const subMode = mode ?? localMode;
  const setSubMode = (nextMode: 'family' | 'elaaj') => {
    if (onModeChange) onModeChange(nextMode);
    else setLocalMode(nextMode);
  };
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<ElaajProvider | null>(null);

  // Sensitive nominee update request with OTP gate
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [newShare, setNewShare] = useState('75');
  const [otpInput, setOtpInput] = useState('123456');
  const [otpError, setOtpError] = useState('');
  const [updateConfirmed, setUpdateConfirmed] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl border border-[#007A48]/20 bg-[#EAF3EE] p-8 text-center">
        <Users className="w-10 h-10 text-[#A32035] mx-auto" />
        <h1 className="mt-3 text-lg font-bold text-[#1E2022]">My Family & Elaaj Health</h1>
        <p className="mt-1.5 text-sm text-[#5C6066] max-w-md mx-auto">
          Sign in to manage covered family members, review beneficiary designations, access your Digital Elaaj Health Card, and search panel providers.
        </p>
        <button
          type="button"
          onClick={onRequireLogin}
          className="mt-5 min-h-[44px] px-6 py-2.5 rounded-xl bg-[#A32035] text-white text-sm font-medium"
        >
          Customer Login
        </button>
      </div>
    );
  }

  const filteredProviders = DEMO_ELAAJ_PROVIDERS.filter((p) => {
    if (cityFilter !== 'All' && p.city !== cityFilter) return false;
    if (typeFilter !== 'All' && p.type !== typeFilter) return false;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.specialty.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q)
    );
  });

  const handleSaveNomineeUpdate = () => {
    if (otpInput.trim() !== '123456') {
      setOtpError('Invalid OTP. Enter Demo OTP 123456 to authorize sensitive nominee changes.');
      return;
    }
    if (!editingMember) return;
    setOtpError('');
    onUpdateFamilyMember(editingMember.id, Math.min(100, Math.max(5, Number(newShare) || 50)));
    setUpdateConfirmed(true);
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1E2022]">My Family & Elaaj Health</h1>
          <p className="text-xs text-[#5C6066] mt-0.5">
            Beneficiaries, covered household members, and Elaaj healthcare support.
          </p>
        </div>

        <div className="inline-flex p-1 rounded-xl bg-[#F4F4F5] border border-[#E5E7EB]">
          {(
            [
              { key: 'family', label: 'Family & Nominees', activeText: 'text-[#A32035]' },
              { key: 'elaaj', label: 'Elaaj Health Services', activeText: 'text-[#007A48]' },
            ] as const
          ).map((item) => {
            const active = subMode === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSubMode(item.key)}
                className={`relative min-h-[40px] px-3.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  active ? item.activeText : 'text-[#5C6066] hover:text-[#1E2022]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="family-mode-pill"
                    transition={{ duration: 0.24, ease: PQ_EASE }}
                    className="absolute inset-0 rounded-lg bg-white shadow-sm"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <PqTabSwap swapKey={subMode} direction={direction}>
      {/* Sub-mode 1: My Family & Beneficiaries (Monogram-only non-human icons, strictly compliant) */}
      {subMode === 'family' && (
        <div className="space-y-4">
          <PqStaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {familyMembers.map((member) => (
              <PqStaggerItem key={member.id}>
              <div
                className="pq-card-interactive h-full rounded-2xl border border-[#E5E7EB] bg-white p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#A32035]/10 text-[#A32035] font-bold text-sm flex items-center justify-center shrink-0">
                      {member.initials}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#007A48]">{member.role}</div>
                      <h2 className="text-base font-bold text-[#1E2022]">{member.fullName}</h2>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#5C6066]">Relationship</span>
                      <span className="font-medium text-[#1E2022]">{member.relationship}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C6066]">Date of Birth</span>
                      <span className="font-medium text-[#1E2022]">{member.dateOfBirth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C6066]">Elaaj Covered</span>
                      <span className="font-semibold text-[#007A48]">
                        {member.elaajCovered ? 'Included' : 'Not Enrolled'}
                      </span>
                    </div>
                    {typeof member.sharePercent === 'number' && (
                      <div className="flex justify-between">
                        <span className="text-[#5C6066]">Nominee Share</span>
                        <span className="font-bold text-[#A32035] tabular-nums">
                          {member.sharePercent}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#E5E7EB] text-[11px] text-[#5C6066]">
                    Certificates: {member.certificateNumbers.join(' · ')}
                  </div>
                </div>

                {member.role !== 'Primary Participant' && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMember(member);
                      setNewShare(String(member.sharePercent ?? 50));
                      setOtpError('');
                      setUpdateConfirmed(false);
                    }}
                    className="mt-4 w-full min-h-[40px] rounded-xl border border-[#E5E7EB] hover:border-[#A32035] text-xs font-medium text-[#1E2022]"
                  >
                    Request Update (OTP Verified)
                  </button>
                )}
              </div>
              </PqStaggerItem>
            ))}
          </PqStaggerGroup>
        </div>
      )}

      {/* Sub-mode 2: Elaaj Health Services (Journey 5) */}
      {subMode === 'elaaj' && (
        <div className="space-y-6">
          {/* Digital Health Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="pq-card-interactive lg:col-span-6 rounded-3xl bg-[#A32035] text-white p-6 flex flex-col justify-between shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-semibold tracking-wider text-[#F5B335]">
                    PAK-QATAR ELAAJ DIGITAL HEALTH CARD
                  </div>
                  <div className="text-lg font-bold mt-1">{DEMO_CUSTOMER.fullName}</div>
                  <div className="text-xs text-white/80 mt-0.5">
                    {DEMO_CUSTOMER.elaajPlanName}
                  </div>
                </div>
                <HeartPulse className="w-7 h-7 text-[#F5B335] shrink-0" />
              </div>

              <div className="mt-6 pt-4 border-t border-white/20 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-white/70">Elaaj Card No.</div>
                  <div className="font-bold tabular-nums mt-0.5">{DEMO_CUSTOMER.elaajCardNumber}</div>
                </div>
                <div>
                  <div className="text-white/70">Covered Members</div>
                  <div className="font-bold tabular-nums mt-0.5">
                    {familyMembers.filter((m) => m.elaajCovered).length} Household Members
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-3xl border border-[#007A48]/20 bg-[#EAF3EE] p-5 flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-[#1E2022]">
                  Hospitalization & Reimbursement Assistance
                </h2>
                <p className="mt-1.5 text-xs text-[#5C6066] leading-relaxed">
                  Present your Digital Elaaj Card at applicable panel facilities or submit itemized discharge summaries for reimbursement review. Coverage entitlements follow your active certificate schedule.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={onGoToClaims}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#007A48] hover:opacity-90 text-white text-xs font-medium"
                >
                  Submit Reimbursement Claim
                </button>
                <div className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#F6F6F7] border border-[#E5E7EB] text-xs text-[#1E2022] inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#A32035]" />
                  <span>Helpline: (021) 111-825-238</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hospital & Doctor Search */}
          <section className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-[#1E2022]">
                  Hospital & Physician Directory
                </h2>
                <p className="text-xs text-[#5C6066]">
                  Illustrative panel directory for demonstration purposes only
                </p>
              </div>
              <Stethoscope className="w-5 h-5 text-[#007A48]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative sm:col-span-1">
                <Search className="w-4 h-4 text-[#5C6066] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hospital or doctor..."
                  className="w-full min-h-[42px] pl-9 pr-3 rounded-xl border border-[#E5E7EB] text-xs"
                />
              </div>
              <PqSelect
                ariaLabel="Filter by city"
                value={cityFilter}
                onChange={setCityFilter}
                options={[
                  { value: 'All', label: 'All Cities' },
                  { value: 'Karachi', label: 'Karachi' },
                  { value: 'Lahore', label: 'Lahore' },
                  { value: 'Islamabad', label: 'Islamabad' },
                ]}
              />
              <PqSelect
                ariaLabel="Filter by provider type"
                value={typeFilter}
                onChange={setTypeFilter}
                options={[
                  { value: 'All', label: 'All Providers' },
                  { value: 'Hospital', label: 'Hospitals' },
                  { value: 'Specialist Physician', label: 'Specialist Physicians' },
                  { value: 'Diagnostic Centre', label: 'Diagnostic Centres' },
                ]}
              />
            </div>

            <div className="divide-y divide-[#E5E7EB]">
              {filteredProviders.map((prov) => (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => setSelectedProvider(prov)}
                  className="w-full py-3.5 text-left flex items-center justify-between gap-3 hover:bg-[#F6F6F7] px-2 rounded-xl transition-colors"
                >
                  <div>
                    <div className="text-[11px] font-semibold text-[#007A48]">
                      {prov.type} · {prov.city}
                    </div>
                    <div className="text-sm font-bold text-[#1E2022] mt-0.5">{prov.name}</div>
                    <div className="text-xs text-[#5C6066] mt-0.5">{prov.specialty}</div>
                  </div>
                  <span className="text-xs font-medium text-[#A32035] shrink-0">Details</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
      </PqTabSwap>

      {/* Provider Details Modal */}
      <PqModal
        open={Boolean(selectedProvider)}
        onClose={() => setSelectedProvider(null)}
        ariaLabel={selectedProvider?.name ?? 'Provider Details'}
      >
        {selectedProvider && (
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E5E7EB] shadow-lg">
            <div className="text-xs font-semibold text-[#007A48]">
              {selectedProvider.type} · {selectedProvider.city}
            </div>
            <h3 className="mt-1 text-lg font-bold text-[#1E2022]">{selectedProvider.name}</h3>
            <div className="mt-4 space-y-2.5 text-xs text-[#5C6066]">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-[#A32035] shrink-0 mt-0.5" />
                <span>{selectedProvider.specialty}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#A32035] shrink-0 mt-0.5" />
                <span>{selectedProvider.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#007A48] shrink-0 mt-0.5" />
                <span>{selectedProvider.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#007A48] shrink-0 mt-0.5" />
                <span>{selectedProvider.panelType}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedProvider(null)}
              className="mt-5 w-full min-h-[44px] rounded-xl bg-[#A32035] text-white text-xs font-medium"
            >
              Close
            </button>
          </div>
        )}
      </PqModal>

      {/* Sensitive Nominee Update Modal with OTP Verification */}
      <PqModal
        open={Boolean(editingMember)}
        onClose={() => setEditingMember(null)}
        ariaLabel="Update Beneficiary Share"
      >
        {editingMember && (
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E5E7EB] shadow-lg">
            <PqTabSwap swapKey={updateConfirmed ? 'confirmed' : 'form'}>
              {!updateConfirmed ? (
                <>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#A32035]">
                    <UserCheck className="w-4 h-4" />
                    <span>Verification Required for Beneficiary Changes</span>
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-[#1E2022]">
                    Update Share: {editingMember.fullName}
                  </h3>
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1E2022] mb-1">
                        Proposed Beneficiary Share (%)
                      </label>
                      <input
                        type="number"
                        min={5}
                        max={100}
                        value={newShare}
                        onChange={(e) => setNewShare(e.target.value)}
                        className="w-full min-h-[44px] px-3 rounded-xl border border-[#E5E7EB] text-sm tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1E2022] mb-1">
                        Verification OTP (Demo OTP: 123456)
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="w-full min-h-[44px] px-3 rounded-xl border border-[#E5E7EB] text-sm tabular-nums"
                      />
                    </div>
                    {otpError && <p className="text-xs font-medium text-[#A32035]">{otpError}</p>}
                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingMember(null)}
                        className="flex-1 min-h-[44px] rounded-xl border border-[#E5E7EB] text-xs font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveNomineeUpdate}
                        className="flex-1 min-h-[44px] rounded-xl bg-[#A32035] text-white text-xs font-medium"
                      >
                        Verify & Submit
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-2">
                  <CheckCircle2 className="w-10 h-10 text-[#007A48] mx-auto" />
                  <h3 className="mt-3 text-base font-bold text-[#1E2022]">
                    Update Request Logged (Demo)
                  </h3>
                  <p className="mt-1 text-xs text-[#5C6066]">
                    Updated illustrative share for {editingMember.fullName} to {newShare}%.
                  </p>
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="mt-5 w-full min-h-[44px] rounded-xl bg-[#A32035] text-white text-xs font-medium"
                  >
                    Done
                  </button>
                </div>
              )}
            </PqTabSwap>
          </div>
        )}
      </PqModal>
    </div>
  );
};
