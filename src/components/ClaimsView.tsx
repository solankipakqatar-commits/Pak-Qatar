import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FilePlus2,
  PhoneCall,
  Search,
  Upload,
} from 'lucide-react';
import { ClaimStage, TakafulCertificate, TakafulClaim } from '../types/pqfs';
import { ensureLoadingAssetsReady, ProcessingOverlay } from './BrandAssets';
import {
  PQ_EASE,
  PqSelect,
  PqStaggerGroup,
  PqStaggerItem,
  PqTabSwap,
  TransitionDirection,
} from './MotionPrimitives';

const CLAIM_STAGES: ClaimStage[] = [
  'Submitted',
  'Documents Review',
  'Under Assessment',
  'Decision',
  'Completed',
];

interface ClaimsViewProps {
  isAuthenticated: boolean;
  maskSensitive: boolean;
  certificates: TakafulCertificate[];
  claims: TakafulClaim[];
  startSubmitOpen: boolean;
  onSetStartSubmitOpen: (open: boolean) => void;
  onClaimSubmitted: (newClaim: TakafulClaim) => void;
  onRequireLogin: () => void;
  onOpenSupport: () => void;
}

export const ClaimsView: React.FC<ClaimsViewProps> = ({
  isAuthenticated,
  maskSensitive,
  certificates,
  claims,
  startSubmitOpen,
  onSetStartSubmitOpen,
  onClaimSubmitted,
  onRequireLogin,
  onOpenSupport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCertId, setSelectedCertId] = useState(
    certificates.find((c) => c.status === 'Active')?.id ?? certificates[0]?.id ?? ''
  );
  const [claimType, setClaimType] = useState('Hospitalization / Medical Reimbursement');
  const [incidentDate, setIncidentDate] = useState('2026-11-20');
  const [estimatedAmount, setEstimatedAmount] = useState('35000');
  const [summary, setSummary] = useState('');
  const [attachedDocs, setAttachedDocs] = useState<string[]>([
    'CNIC Copy (Verified Profile).pdf',
    'Hospital Discharge Summary & Itemized Bills.pdf',
  ]);
  const [submitStep, setSubmitStep] = useState<'details' | 'review' | 'done'>('details');
  const [stepDir, setStepDir] = useState<TransitionDirection>('forward');
  const [processing, setProcessing] = useState(false);
  const [newClaimRef, setNewClaimRef] = useState('');

  const formatMoney = (v: number) => (maskSensitive ? 'PKR •••••••' : `PKR ${v.toLocaleString()}`);

  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl border border-[#007A48]/20 bg-[#EAF3EE] p-8 text-center">
        <ClipboardList className="w-10 h-10 text-[#A32035] mx-auto" />
        <h1 className="mt-3 text-lg font-bold text-[#1E2022]">Claims Centre</h1>
        <p className="mt-1.5 text-sm text-[#5C6066] max-w-md mx-auto">
          Sign in to submit Family Takaful and Elaaj Health claims, upload supporting documents, and follow the 5-stage claim assessment timeline.
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

  const activeCerts = certificates.filter((c) => c.status === 'Active');
  const selectedCert = activeCerts.find((c) => c.id === selectedCertId) ?? activeCerts[0];

  const filteredClaims = claims.filter((c) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      c.referenceNumber.toLowerCase().includes(q) ||
      c.productName.toLowerCase().includes(q) ||
      c.claimType.toLowerCase().includes(q)
    );
  });

  const handleToggleDoc = (docName: string) => {
    setAttachedDocs((prev) =>
      prev.includes(docName) ? prev.filter((d) => d !== docName) : [...prev, docName]
    );
  };

  const handleSubmitClaim = () => {
    if (!selectedCert || processing) return;
    void ensureLoadingAssetsReady().then(() => {
      setProcessing(true);
      window.setTimeout(() => {
        const ref = `CLM-PQF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const created: TakafulClaim = {
          id: `clm-${Date.now()}`,
          referenceNumber: ref,
          certificateNumber: selectedCert.certificateNumber,
          productName: selectedCert.productName,
          entity: selectedCert.entity,
          claimType,
          incidentDate,
          submittedDate: '26 Nov 2026',
          estimatedAmountPkr: Math.max(1000, Number(estimatedAmount) || 0),
          currentStage: 'Submitted',
          summary:
            summary.trim() ||
            `Demonstration claim submitted for ${selectedCert.productName} (${claimType}).`,
          documents: attachedDocs,
          lastUpdatedNote: 'Claim intake logged in demonstration mode; queued for document review.',
        };
        onClaimSubmitted(created);
        setNewClaimRef(ref);
        setProcessing(false);
        setStepDir('forward');
        setSubmitStep('done');
      }, 2000);
    });
  };

  // Guided Journey 4 Claim Submission Flow
  if (startSubmitOpen) {
    return (
      <div className="max-w-xl mx-auto pb-10">
        <ProcessingOverlay
          visible={processing}
          title="Processing Your Request"
          subtitle="Logging claim reference and attaching supporting documents..."
        />

        {submitStep !== 'done' && (
          <button
            type="button"
            onClick={() => {
              if (submitStep === 'review') {
                setStepDir('back');
                setSubmitStep('details');
              } else {
                onSetStartSubmitOpen(false);
              }
            }}
            className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium text-[#5C6066] hover:text-[#A32035] mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{submitStep === 'review' ? 'Edit Claim Details' : 'Back to Claims Centre'}</span>
          </button>
        )}

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
          <div className="text-xs font-semibold text-[#A32035]">Demo Claims Submission</div>
          <h1 className="mt-1 text-xl font-bold text-[#1E2022]">
            {submitStep === 'done' ? 'Claim Submitted (Demo)' : 'Submit a Takaful Claim'}
          </h1>

          <PqTabSwap swapKey={submitStep} direction={stepDir}>
          {submitStep === 'details' && (
            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E2022] mb-1">
                  Select Certificate
                </label>
                <PqSelect
                  ariaLabel="Select Certificate"
                  value={selectedCertId}
                  onChange={setSelectedCertId}
                  options={activeCerts.map((c) => ({
                    value: c.id,
                    label: `${c.productName} (${c.certificateNumber})`,
                  }))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2022] mb-1">
                  Claim Category
                </label>
                <PqSelect
                  ariaLabel="Claim Category"
                  value={claimType}
                  onChange={setClaimType}
                  options={[
                    { value: 'Hospitalization / Medical Reimbursement', label: 'Hospitalization / Medical Reimbursement' },
                    { value: 'Critical Illness / Surgical Care', label: 'Critical Illness / Surgical Care' },
                    { value: 'Accidental Injury Benefit', label: 'Accidental Injury Benefit' },
                    { value: 'Maturity / Partial Benefit Claim', label: 'Maturity / Partial Benefit Claim' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E2022] mb-1">
                    Incident / Admission Date
                  </label>
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-[#E5E7EB] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E2022] mb-1">
                    Estimated Claim Amount (PKR)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    value={estimatedAmount}
                    onChange={(e) => setEstimatedAmount(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-[#E5E7EB] text-xs tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2022] mb-1">
                  Incident Summary
                </label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Describe hospitalization, medical care, or claim details..."
                  className="w-full p-3 rounded-xl border border-[#E5E7EB] text-xs focus:outline-none focus:border-[#A32035]"
                />
              </div>

              <div>
                <div className="text-xs font-semibold text-[#1E2022] mb-2">
                  Required Documents Checklist (Demo Upload)
                </div>
                <div className="space-y-2">
                  {[
                    'CNIC Copy (Verified Profile).pdf',
                    'Hospital Discharge Summary & Itemized Bills.pdf',
                    'Lab Reports & Supporting Records.zip',
                  ].map((doc) => {
                    const checked = attachedDocs.includes(doc);
                    return (
                      <button
                        key={doc}
                        type="button"
                        onClick={() => handleToggleDoc(doc)}
                        className={`w-full min-h-[42px] px-3.5 rounded-xl border text-left text-xs flex items-center justify-between transition-colors ${
                          checked
                            ? 'border-[#007A48] bg-[#007A48]/5 text-[#1E2022]'
                            : 'border-[#E5E7EB] text-[#5C6066]'
                        }`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Upload className="w-3.5 h-3.5 text-[#007A48]" />
                          <span>{doc}</span>
                        </span>
                        <span className="font-semibold text-[#007A48]">
                          {checked ? 'Attached' : 'Attach'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                disabled={attachedDocs.length === 0}
                onClick={() => {
                  setStepDir('forward');
                  setSubmitStep('review');
                }}
                className="w-full min-h-[48px] rounded-xl bg-[#A32035] hover:opacity-90 disabled:opacity-50 text-white text-sm font-medium"
              >
                Review Claim Submission
              </button>
            </div>
          )}

          {submitStep === 'review' && selectedCert && (
            <div className="mt-5 space-y-4">
              <div className="p-4 rounded-2xl bg-[#F6F6F7] border border-[#E5E7EB] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#5C6066]">Certificate</span>
                  <span className="font-semibold text-[#1E2022]">{selectedCert.certificateNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6066]">Claim Type</span>
                  <span className="font-semibold text-[#1E2022]">{claimType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6066]">Incident Date</span>
                  <span className="font-semibold text-[#1E2022]">{incidentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6066]">Estimated Amount</span>
                  <span className="font-bold text-[#A32035] tabular-nums">
                    PKR {Number(estimatedAmount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6066]">Documents Attached</span>
                  <span className="font-semibold text-[#007A48]">{attachedDocs.length} files</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSubmitClaim}
                className="w-full min-h-[48px] rounded-xl bg-[#A32035] hover:opacity-90 text-white text-sm font-medium"
              >
                Confirm & Submit Claim (Demo)
              </button>
            </div>
          )}

          {submitStep === 'done' && (
            <div className="mt-5 text-center py-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#007A48]/10 text-[#007A48] flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="mt-3 text-sm text-[#5C6066]">
                Your demonstration claim is now visible in Track Claim with live stage progression.
              </p>
              <div className="mt-4 p-3.5 rounded-xl bg-[#F6F6F7] border border-[#E5E7EB] text-xs">
                Claim Reference:{' '}
                <span className="font-bold text-[#1E2022] tabular-nums">{newClaimRef}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubmitStep('details');
                  onSetStartSubmitOpen(false);
                }}
                className="mt-5 w-full min-h-[48px] rounded-xl bg-[#A32035] text-white text-sm font-medium"
              >
                Track Claim Status
              </button>
            </div>
          )}
          </PqTabSwap>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1E2022]">Claims Centre</h1>
          <p className="text-xs text-[#5C6066] mt-0.5">
            Submit claims, upload documents, and track assessment progress (Demonstration Statuses).
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSubmitStep('details');
            onSetStartSubmitOpen(true);
          }}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#A32035] hover:opacity-90 text-white text-xs font-medium inline-flex items-center gap-1.5"
        >
          <FilePlus2 className="w-4 h-4" />
          <span>Submit a Claim</span>
        </button>
      </div>

      {/* Search / Track by Reference */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#5C6066] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Claim Reference (e.g., CLM-PQF-2026-1042) or product..."
          className="w-full min-h-[46px] pl-10 pr-4 rounded-xl border border-[#E5E7EB] bg-white text-xs text-[#1E2022] focus:outline-none focus:border-[#A32035]"
        />
      </div>

      {/* Claims Cards with 5-Stage Visual Timeline */}
      <div className="space-y-4">
        {filteredClaims.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center text-sm text-[#5C6066]">
            No claims matched your search.
          </div>
        ) : (
          <PqStaggerGroup className="space-y-4">
            {filteredClaims.map((claim) => {
              const stageIndex = CLAIM_STAGES.indexOf(claim.currentStage);
              return (
                <PqStaggerItem key={claim.id}>
                  <div className="pq-card-interactive rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold text-[#A32035]">
                          Family Takaful · PQFTL · {claim.referenceNumber}
                        </div>
                        <h2 className="text-base font-bold text-[#1E2022] mt-0.5">{claim.claimType}</h2>
                        <div className="text-xs text-[#5C6066] mt-0.5">
                          {claim.productName} · Submitted {claim.submittedDate}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-[#5C6066]">Estimated / Settled</div>
                        <div className="text-sm font-bold text-[#1E2022] tabular-nums">
                          {formatMoney(claim.approvedAmountPkr ?? claim.estimatedAmountPkr)}
                        </div>
                      </div>
                    </div>

                    {/* 5-Stage Visual Claim Timeline */}
                    <div className="pt-2">
                      <div className="grid grid-cols-5 gap-1.5">
                        {CLAIM_STAGES.map((stage, idx) => {
                          const reached = idx <= stageIndex;
                          const isCurrent = idx === stageIndex;
                          const fillColor =
                            stage === 'Completed'
                              ? 'bg-[#007A48]'
                              : isCurrent
                                ? 'bg-[#F5B335]'
                                : 'bg-[#A32035]';
                          return (
                            <div key={stage} className="flex flex-col items-start">
                              <div className="w-full h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
                                {reached && (
                                  <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{
                                      duration: 0.35,
                                      delay: idx * 0.06,
                                      ease: PQ_EASE,
                                    }}
                                    style={{ transformOrigin: 'left center' }}
                                    className={`w-full h-full rounded-full ${fillColor}`}
                                  />
                                )}
                              </div>
                              <span
                                className={`mt-1.5 text-[10px] leading-tight font-medium ${
                                  isCurrent
                                    ? 'text-[#1E2022] font-bold'
                                    : reached
                                      ? 'text-[#5C6066]'
                                      : 'text-[#9CA3AF]'
                                }`}
                              >
                                {stage}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F6F6F7] text-xs text-[#5C6066]">
                      <span className="font-semibold text-[#1E2022]">Latest Update: </span>
                      {claim.lastUpdatedNote}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5C6066]">
                      <span className="inline-flex items-center gap-1.5">
                        <FileCheck2 className="w-3.5 h-3.5 text-[#007A48]" />
                        <span>{claim.documents.length} documents on file</span>
                      </span>
                      <button
                        type="button"
                        onClick={onOpenSupport}
                        className="font-medium text-[#A32035] hover:underline inline-flex items-center gap-1"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Claims Support</span>
                      </button>
                    </div>
                  </div>
                </PqStaggerItem>
              );
            })}
          </PqStaggerGroup>
        )}
      </div>
    </div>
  );
};
