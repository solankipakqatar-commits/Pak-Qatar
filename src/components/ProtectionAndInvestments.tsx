import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import {
  FundHolding,
  ProtectionSubTab,
  TakafulCertificate,
  TakafulEntity,
  TakafulProduct,
} from '../types/pqfs';
import { DEMO_CUSTOMER } from '../data/pqfsData';
import { TakafulWheel } from './TakafulWheel';
import { ensureLoadingAssetsReady, PakQatarLogo, ProcessingOverlay } from './BrandAssets';
import { PQ_EASE, PqModal, PqTabSwap } from './MotionPrimitives';

interface ProtectionAndInvestmentsProps {
  isAuthenticated: boolean;
  maskSensitive: boolean;
  subTab: ProtectionSubTab;
  onSubTabChange: (tab: ProtectionSubTab) => void;
  wheelEntity: TakafulEntity;
  onWheelEntityChange: (entity: TakafulEntity) => void;
  onSelectProduct: (product: TakafulProduct) => void;
  certificates: TakafulCertificate[];
  funds: FundHolding[];
  onUpdateFunds: (updated: FundHolding[]) => void;
  onRequireLogin: () => void;
  selectedCertModal: TakafulCertificate | null;
  onSelectCertModal: (cert: TakafulCertificate | null) => void;
}

export const ProtectionAndInvestmentsView: React.FC<ProtectionAndInvestmentsProps> = ({
  isAuthenticated,
  maskSensitive,
  subTab,
  onSubTabChange,
  wheelEntity,
  onWheelEntityChange,
  onSelectProduct,
  certificates,
  funds,
  onUpdateFunds,
  onRequireLogin,
  selectedCertModal,
  onSelectCertModal,
}) => {
  const [certStatusFilter, setCertStatusFilter] = useState<'Active' | 'Expired'>('Active');
  const [certEntityFilter, setCertEntityFilter] = useState<'all' | 'family' | 'general'>('all');
  const [statementCert, setStatementCert] = useState<TakafulCertificate | null>(null);
  const [activeFundId, setActiveFundId] = useState<string>(funds[0]?.id ?? 'fund-balanced');

  // Investment Servicing Action Modals (Top-Up, Withdrawal, Fund Switch)
  const [invAction, setInvAction] = useState<'topup' | 'withdrawal' | 'switch' | null>(null);
  const [actionAmount, setActionAmount] = useState('10000');
  const [switchFromId, setSwitchFromId] = useState(funds[0]?.id ?? 'fund-balanced');
  const [switchToId, setSwitchToId] = useState(funds[2]?.id ?? 'fund-conservative');
  const [processing, setProcessing] = useState(false);
  const [actionResult, setActionResult] = useState<{
    title: string;
    reference: string;
    detail: string;
  } | null>(null);

  const formatMoney = (v: number) => (maskSensitive ? 'PKR •••••••' : `PKR ${v.toLocaleString()}`);

  const filteredCerts = certificates.filter((c) => {
    if (c.status !== certStatusFilter) return false;
    if (certEntityFilter !== 'all' && c.entity !== certEntityFilter) return false;
    return true;
  });

  const activeFund = funds.find((f) => f.id === activeFundId) ?? funds[0];
  const totalPortfolioValue = funds.reduce((s, f) => s + f.valuePkr, 0);

  const handleSubmitInvestmentAction = () => {
    if (processing) return;
    const amt = Math.max(1000, Number(actionAmount) || 0);
    void ensureLoadingAssetsReady().then(() => {
      setProcessing(true);
      window.setTimeout(() => {
        let updated = funds;
        let title = '';
        let detail = '';
        const ref = `INV-PQF-2026-${Math.floor(1000 + Math.random() * 9000)}`;

        if (invAction === 'topup') {
          updated = funds.map((f, idx) =>
            idx === 0
              ? {
                  ...f,
                  valuePkr: f.valuePkr + amt,
                  units: Number((f.units + amt / f.navPkr).toFixed(2)),
                }
              : f
          );
          title = 'Top-Up Request Recorded (Demo)';
          detail = `Illustrative Top-Up of PKR ${amt.toLocaleString()} allocated to ${funds[0].fundName}.`;
        } else if (invAction === 'withdrawal') {
          updated = funds.map((f, idx) =>
            idx === 0
              ? {
                  ...f,
                  valuePkr: Math.max(0, f.valuePkr - amt),
                  units: Math.max(0, Number((f.units - amt / f.navPkr).toFixed(2))),
                }
              : f
          );
          title = 'Partial Withdrawal Requested (Demo)';
          detail = `Illustrative withdrawal of PKR ${amt.toLocaleString()} queued for bank IBFT settlement.`;
        } else if (invAction === 'switch') {
          if (switchFromId !== switchToId) {
            updated = funds.map((f) => {
              if (f.id === switchFromId) {
                const newVal = Math.max(0, f.valuePkr - amt);
                return {
                  ...f,
                  valuePkr: newVal,
                  units: Number((newVal / f.navPkr).toFixed(2)),
                };
              }
              if (f.id === switchToId) {
                const newVal = f.valuePkr + amt;
                return {
                  ...f,
                  valuePkr: newVal,
                  units: Number((newVal / f.navPkr).toFixed(2)),
                };
              }
              return f;
            });
          }
          const fromName = funds.find((f) => f.id === switchFromId)?.fundName ?? '';
          const toName = funds.find((f) => f.id === switchToId)?.fundName ?? '';
          title = 'Fund Switch Submitted (Demo)';
          detail = `Illustrative switch of PKR ${amt.toLocaleString()} from ${fromName} to ${toName}.`;
        }

        onUpdateFunds(updated);
        setProcessing(false);
        setInvAction(null);
        setActionResult({ title, reference: ref, detail });
      }, 2000);
    });
  };

  return (
    <div className="space-y-6 pb-8">
      <ProcessingOverlay
        visible={processing}
        title="Processing Your Request"
        subtitle="Updating illustrative Family Takaful Participant Investment Account..."
      />

      {/* Section Header & Sub-Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1E2022]">My Protection & Products</h1>
          <p className="text-xs text-[#5C6066] mt-0.5">
            Discover Takaful plans, inspect certificates, and review investment funds.
          </p>
        </div>
        <div className="inline-flex p-1 rounded-xl bg-[#F4F4F5] border border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => onSubTabChange('explore')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              subTab === 'explore' ? 'bg-white text-[#A32035] shadow-sm' : 'text-[#5C6066]'
            }`}
          >
            360° Product Selector
          </button>
          <button
            type="button"
            onClick={() => onSubTabChange('certificates')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              subTab === 'certificates' ? 'bg-white text-[#A32035] shadow-sm' : 'text-[#5C6066]'
            }`}
          >
            My Certificates
          </button>
          <button
            type="button"
            onClick={() => onSubTabChange('investments')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              subTab === 'investments' ? 'bg-white text-[#A32035] shadow-sm' : 'text-[#5C6066]'
            }`}
          >
            Investment & Funds
          </button>
        </div>
      </div>

      <PqTabSwap swapKey={subTab}>
        {/* Sub-tab 1: 360° Wheel & Product Catalogue */}
        {subTab === 'explore' && (
          <div className="rounded-3xl border border-[#007A48]/20 bg-[#EAF3EE] p-5 sm:p-7">
            <TakafulWheel
              entity={wheelEntity}
              onEntityChange={onWheelEntityChange}
              onSelectProduct={onSelectProduct}
            />
          </div>
        )}

      {/* Sub-tab 2: My Certificates */}
      {subTab === 'certificates' && (
        <>
          {!isAuthenticated ? (
            <div className="rounded-3xl border border-[#007A48]/20 bg-[#EAF3EE] p-8 text-center">
              <ShieldCheck className="w-10 h-10 text-[#A32035] mx-auto" />
              <h2 className="mt-3 text-lg font-bold text-[#1E2022]">Customer Sign-In Required</h2>
              <p className="mt-1.5 text-sm text-[#5C6066] max-w-md mx-auto">
                Sign in to view your active and expired Family Takaful (PQFTL) and General Takaful (PQGTL) certificates.
              </p>
              <button
                type="button"
                onClick={onRequireLogin}
                className="mt-5 min-h-[44px] px-6 py-2.5 rounded-xl bg-[#A32035] text-white text-sm font-medium"
              >
                Customer Login
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Filter bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex p-1 rounded-xl bg-[#F4F4F5] border border-[#E5E7EB]">
                  {(['Active', 'Expired'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setCertStatusFilter(st)}
                      className={`min-h-[38px] px-3.5 rounded-lg text-xs font-medium transition-colors ${
                        certStatusFilter === st
                          ? 'bg-white text-[#1E2022] shadow-sm'
                          : 'text-[#5C6066]'
                      }`}
                    >
                      {st} Certificates
                    </button>
                  ))}
                </div>

                <div className="inline-flex p-1 rounded-xl bg-[#F4F4F5] border border-[#E5E7EB]">
                  {(
                    [
                      { key: 'all', label: 'All Companies' },
                      { key: 'family', label: 'Family (PQFTL)' },
                      { key: 'general', label: 'General (PQGTL)' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setCertEntityFilter(opt.key)}
                      className={`min-h-[38px] px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        certEntityFilter === opt.key
                          ? 'bg-white text-[#A32035] shadow-sm'
                          : 'text-[#5C6066]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <PqTabSwap swapKey={`${certStatusFilter}-${certEntityFilter}`}>
                {filteredCerts.length === 0 ? (
                  <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center text-sm text-[#5C6066]">
                    No {certStatusFilter.toLowerCase()} certificates found for the selected company filter.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCerts.map((cert) => (
                      <div
                        key={cert.id}
                        className="pq-card-interactive rounded-2xl border border-[#E5E7EB] bg-white p-5 flex flex-col justify-between"
                      >
                      <div>
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span
                            className={`font-bold ${
                              cert.entity === 'family' ? 'text-[#A32035]' : 'text-[#007A48]'
                            }`}
                          >
                            {cert.entity === 'family' ? 'Family Takaful · PQFTL' : 'General Takaful · PQGTL'}
                          </span>
                          <span
                            className={`font-semibold ${
                              cert.status === 'Active' ? 'text-[#007A48]' : 'text-[#5C6066]'
                            }`}
                          >
                            {cert.status}
                          </span>
                        </div>

                        <h3 className="mt-2 text-base font-bold text-[#1E2022]">{cert.productName}</h3>
                        <div className="mt-1 text-xs text-[#5C6066] tabular-nums">
                          Certificate No: {cert.certificateNumber} · Issued {cert.issueDate}
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#E5E7EB] grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <div className="text-[#5C6066]">Covered Benefit</div>
                            <div className="font-bold text-[#1E2022] tabular-nums mt-0.5">
                              {formatMoney(cert.coveredBenefitPkr)}
                            </div>
                          </div>
                          <div>
                            <div className="text-[#5C6066]">
                              {cert.entity === 'family' && cert.participantInvestmentAccountPkr
                                ? 'Investment Account (PIA)'
                                : 'Contribution'}
                            </div>
                            <div className="font-bold text-[#1E2022] tabular-nums mt-0.5">
                              {cert.entity === 'family' && cert.participantInvestmentAccountPkr
                                ? formatMoney(cert.participantInvestmentAccountPkr)
                                : `${formatMoney(cert.contributionAmountPkr)} (${cert.frequency})`}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectCertModal(cert)}
                          className="flex-1 min-h-[40px] px-3 rounded-xl bg-[#A32035] hover:opacity-90 text-white text-xs font-medium whitespace-nowrap"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatementCert(cert)}
                          className="min-h-[40px] px-3 rounded-xl border border-[#E5E7EB] hover:border-[#A32035] text-xs font-medium text-[#1E2022] inline-flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Certificate / Statement</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  </div>
                )}
              </PqTabSwap>
            </div>
          )}
        </>
      )}

      {/* Sub-tab 3: Investment & Fund Information (Journey 7) */}
      {subTab === 'investments' && (
        <>
          {!isAuthenticated ? (
            <div className="rounded-3xl border border-[#007A48]/20 bg-[#EAF3EE] p-8 text-center">
              <TrendingUp className="w-10 h-10 text-[#007A48] mx-auto" />
              <h2 className="mt-3 text-lg font-bold text-[#1E2022]">
                Family Takaful Investment Access
              </h2>
              <p className="mt-1.5 text-sm text-[#5C6066] max-w-md mx-auto">
                Sign in to inspect your Participant Investment Account (PIA), unit NAV valuations, fund switching, top-ups, and withdrawal requests.
              </p>
              <button
                type="button"
                onClick={onRequireLogin}
                className="mt-5 min-h-[44px] px-6 py-2.5 rounded-xl bg-[#A32035] text-white text-sm font-medium"
              >
                Customer Login
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Total PIA Summary & Servicing Actions */}
              <div className="rounded-3xl border border-[#007A48] bg-[#007A48] p-5 sm:p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-[#F5B335]">
                      Family Takaful Investment-Linked · PQFTL
                    </div>
                    <h2 className="mt-1 text-2xl font-bold text-white tabular-nums">
                      {formatMoney(totalPortfolioValue)}
                    </h2>
                    <div className="mt-1 text-xs text-white/85">
                      Participant Investment Account (PIA) Value · Valuation Date: 24 Nov 2026 (Illustrative)
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setInvAction('topup')}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-[#A32035] hover:opacity-90 text-white text-xs font-medium inline-flex items-center gap-1.5 border border-white/20"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      <span>Top-Up Contribution</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInvAction('switch')}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-white hover:border-[#F5B335] text-[#1E2022] text-xs font-medium inline-flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-4 h-4 text-[#007A48]" />
                      <span>Switch Fund</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInvAction('withdrawal')}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-white hover:border-[#F5B335] text-[#1E2022] text-xs font-medium inline-flex items-center gap-1.5"
                    >
                      <Wallet className="w-4 h-4 text-[#A32035]" />
                      <span>Withdrawal Request</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Fund Allocation & Unit Valuation Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7 space-y-3">
                  <h3 className="text-base font-bold text-[#1E2022]">Fund Allocation & Units</h3>
                  {funds.map((fund) => {
                    const isSelected = fund.id === activeFund.id;
                    return (
                      <button
                        key={fund.id}
                        type="button"
                        onClick={() => setActiveFundId(fund.id)}
                        className={`pq-card-interactive w-full text-left rounded-2xl border p-4 transition-colors ${
                          isSelected
                            ? 'border-[#A32035] bg-white shadow-sm'
                            : 'border-[#E5E7EB] bg-white hover:border-[#A32035]/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xs font-semibold text-[#007A48]">
                              {fund.riskProfile} Strategy · {fund.allocationPercent}% Target
                            </div>
                            <div className="text-sm font-bold text-[#1E2022] mt-0.5">
                              {fund.fundName}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-bold text-[#1E2022] tabular-nums">
                              {formatMoney(fund.valuePkr)}
                            </div>
                            <div className="text-[11px] text-[#007A48] font-medium mt-0.5">
                              {fund.ytdIllustrativeChange}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-2 text-xs text-[#5C6066] tabular-nums">
                          <span>Units: {fund.units.toLocaleString()}</span>
                          <span>NAV: PKR {fund.navPkr.toFixed(2)}</span>
                          <span>As of {fund.valuationDate}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Fund SVG Performance Chart & Statements */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                    <div className="text-xs font-semibold text-[#5C6066]">
                      Illustrative 6-Month NAV Trend
                    </div>
                    <h3 className="text-sm font-bold text-[#1E2022] mt-0.5">{activeFund.fundName}</h3>

                    <div className="mt-4">
                      <NavTrendChart points={activeFund.historyPoints} />
                    </div>

                    <p className="mt-3 text-[11px] text-[#5C6066] leading-relaxed">
                      Disclaimer: Unit values and NAV figures shown are illustrative demonstration data only. Past performance does not guarantee future returns.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                    <h3 className="text-sm font-bold text-[#1E2022]">Account Statements</h3>
                    <p className="text-xs text-[#5C6066] mt-1">
                      Review unit allocation, Tabarru deductions, and Wakalah disclosures.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatementCert(certificates[0])}
                      className="mt-3 w-full min-h-[42px] px-4 rounded-xl border border-[#E5E7EB] hover:border-[#A32035] text-xs font-medium text-[#1E2022] inline-flex items-center justify-center gap-2"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-[#A32035]" />
                      <span>View Illustrative Account Statement</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      </PqTabSwap>

      {/* Certificate Detail Modal */}
      <PqModal
        open={Boolean(selectedCertModal)}
        onClose={() => onSelectCertModal(null)}
        variant="sheet"
        ariaLabel={selectedCertModal?.productName ?? 'Certificate Details'}
      >
        {selectedCertModal && (
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-6 border border-[#E5E7EB] max-h-[88vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div>
                <div className="text-xs font-semibold text-[#A32035]">
                  {selectedCertModal.companyLabel}
                </div>
                <h3 className="text-lg font-bold text-[#1E2022] mt-0.5">
                  {selectedCertModal.productName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onSelectCertModal(null)}
                className="min-h-[40px] px-3 text-xs font-medium text-[#5C6066]"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#F6F6F7] border border-[#E5E7EB]">
                <div>
                  <div className="text-[#5C6066]">Certificate Number</div>
                  <div className="font-bold text-[#1E2022] tabular-nums mt-0.5">
                    {selectedCertModal.certificateNumber}
                  </div>
                </div>
                <div>
                  <div className="text-[#5C6066]">Status</div>
                  <div className="font-bold text-[#007A48] mt-0.5">{selectedCertModal.status}</div>
                </div>
                <div>
                  <div className="text-[#5C6066]">Issue Date</div>
                  <div className="font-semibold text-[#1E2022] mt-0.5">
                    {selectedCertModal.issueDate}
                  </div>
                </div>
                <div>
                  <div className="text-[#5C6066]">Maturity / Renewal</div>
                  <div className="font-semibold text-[#1E2022] mt-0.5">
                    {selectedCertModal.maturityOrRenewalDate}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between py-1.5 border-b border-[#E5E7EB]">
                  <span className="text-[#5C6066]">Covered Benefit</span>
                  <span className="font-bold text-[#1E2022] tabular-nums">
                    {formatMoney(selectedCertModal.coveredBenefitPkr)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#E5E7EB]">
                  <span className="text-[#5C6066]">Contribution Schedule</span>
                  <span className="font-semibold text-[#1E2022] tabular-nums">
                    {formatMoney(selectedCertModal.contributionAmountPkr)} · {selectedCertModal.frequency}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#E5E7EB]">
                  <span className="text-[#5C6066]">Nominee / Covered</span>
                  <span className="font-semibold text-[#1E2022]">{selectedCertModal.nomineeName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#E5E7EB]">
                  <span className="text-[#5C6066]">Covered Asset / Plan</span>
                  <span className="font-semibold text-[#1E2022]">
                    {selectedCertModal.coveredAssetOrPlan}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F6F6F7] text-[11px] text-[#5C6066]">
                {selectedCertModal.tabarruAllocationNote}
              </div>
            </div>

            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const target = selectedCertModal;
                  onSelectCertModal(null);
                  setStatementCert(target);
                }}
                className="flex-1 min-h-[44px] rounded-xl bg-[#A32035] text-white text-xs font-medium inline-flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Digital Certificate</span>
              </button>
            </div>
          </div>
        )}
      </PqModal>

      {/* Statement / Certificate Document Modal */}
      <PqModal
        open={Boolean(statementCert)}
        onClose={() => setStatementCert(null)}
        ariaLabel="Digital Document Preview"
      >
        {statementCert && (
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E5E7EB] shadow-lg">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
              <div>
                <div className="text-xs font-semibold text-[#007A48]">
                  Digital Document Preview · Demo Only
                </div>
                <h3 className="mt-1 text-base font-bold text-[#1E2022]">
                  {statementCert.productName}
                </h3>
              </div>
              <PakQatarLogo variant="compact" />
            </div>
            <div className="mt-3 p-4 rounded-2xl bg-[#F6F6F7] border border-[#E5E7EB] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5C6066]">Participant</span>
                <span className="font-semibold text-[#1E2022]">{DEMO_CUSTOMER.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C6066]">Certificate No.</span>
                <span className="font-semibold text-[#1E2022] tabular-nums">
                  {statementCert.certificateNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C6066]">Company</span>
                <span className="font-semibold text-[#1E2022]">
                  {statementCert.entity === 'family' ? 'PQFTL' : 'PQGTL'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C6066]">Generated Date</span>
                <span className="font-semibold text-[#1E2022]">26 Nov 2026</span>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-[#5C6066]">
              Demonstrative certificate & statement layout. Official signed documents are accessible through verified PQFS portals.
            </p>
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 min-h-[44px] rounded-xl bg-[#A32035] text-white text-xs font-medium"
              >
                Print / Save PDF
              </button>
              <button
                type="button"
                onClick={() => setStatementCert(null)}
                className="flex-1 min-h-[44px] rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#1E2022]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </PqModal>

      {/* Top-Up / Withdrawal / Fund Switch Modal */}
      <PqModal
        open={Boolean(invAction)}
        onClose={() => setInvAction(null)}
        variant="sheet"
        ariaLabel="Investment Request"
      >
        {invAction && (
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 border border-[#E5E7EB] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-base font-bold text-[#1E2022]">
                {invAction === 'topup'
                  ? 'Top-Up Contribution (Demo)'
                  : invAction === 'withdrawal'
                    ? 'Partial Withdrawal Request (Demo)'
                    : 'Fund Switching (Demo)'}
              </h3>
              <button
                type="button"
                onClick={() => setInvAction(null)}
                className="text-xs font-medium text-[#5C6066] min-h-[36px] px-2"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {invAction === 'switch' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E2022] mb-1">
                      Switch From Fund
                    </label>
                    <select
                      value={switchFromId}
                      onChange={(e) => setSwitchFromId(e.target.value)}
                      className="w-full min-h-[44px] px-3 rounded-xl border border-[#E5E7EB] text-xs bg-white"
                    >
                      {funds.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.fundName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E2022] mb-1">
                      Switch To Fund
                    </label>
                    <select
                      value={switchToId}
                      onChange={(e) => setSwitchToId(e.target.value)}
                      className="w-full min-h-[44px] px-3 rounded-xl border border-[#E5E7EB] text-xs bg-white"
                    >
                      {funds.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.fundName}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#1E2022] mb-1">
                  Amount (PKR)
                </label>
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  className="w-full min-h-[46px] px-3.5 rounded-xl border border-[#E5E7EB] text-sm font-bold tabular-nums"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#F6F6F7] text-[11px] text-[#5C6066]">
                This action updates your illustrative demonstration portfolio locally and issues a demo reference number.
              </div>

              <button
                type="button"
                onClick={handleSubmitInvestmentAction}
                className="w-full min-h-[48px] rounded-xl bg-[#A32035] hover:opacity-90 text-white text-sm font-medium"
              >
                Confirm & Submit Request
              </button>
            </div>
          </div>
        )}
      </PqModal>

      {/* Action Confirmation Modal */}
      <PqModal
        open={Boolean(actionResult)}
        onClose={() => setActionResult(null)}
        ariaLabel={actionResult?.title ?? 'Action Confirmation'}
      >
        {actionResult && (
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-[#E5E7EB] text-center shadow-lg">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#007A48]/10 text-[#007A48] flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="mt-3 text-base font-bold text-[#1E2022]">{actionResult.title}</h3>
            <p className="mt-1.5 text-xs text-[#5C6066]">{actionResult.detail}</p>
            <div className="mt-4 p-3 rounded-xl bg-[#F6F6F7] border border-[#E5E7EB] text-xs">
              Reference: <span className="font-bold text-[#1E2022]">{actionResult.reference}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionResult(null)}
              className="mt-5 w-full min-h-[44px] rounded-xl bg-[#A32035] text-white text-xs font-medium"
            >
              Done
            </button>
          </div>
        )}
      </PqModal>
    </div>
  );
};

function NavTrendChart({ points }: { points: { month: string; nav: number }[] }) {
  const min = Math.min(...points.map((p) => p.nav)) * 0.97;
  const max = Math.max(...points.map((p) => p.nav)) * 1.02;
  const width = 300;
  const height = 110;
  const padX = 14;
  const padY = 12;

  const coords = points.map((pt, idx) => {
    const x = padX + (idx / Math.max(1, points.length - 1)) * (width - padX * 2);
    const y = height - padY - ((pt.nav - min) / Math.max(1, max - min)) * (height - padY * 2);
    return { ...pt, x, y };
  });

  const polyline = coords.map((c) => `${c.x},${c.y}`).join(' ');
  const chartKey = points.map((p) => p.nav).join('-');

  return (
    <div>
      <svg key={chartKey} viewBox={`0 0 ${width} ${height}`} className="w-full h-28 overflow-visible">
        <motion.polyline
          fill="none"
          stroke="#007A48"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polyline}
          initial={{ pathLength: 0, opacity: 0.35 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.65, ease: PQ_EASE }}
        />
        {coords.map((c, idx) => (
          <motion.circle
            key={c.month}
            cx={c.x}
            cy={c.y}
            r="3.5"
            fill="#FFFFFF"
            stroke="#A32035"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.08 + idx * 0.06, ease: PQ_EASE }}
          />
        ))}
      </svg>
      <div className="flex justify-between px-2 text-[10px] font-medium text-[#5C6066]">
        {points.map((p) => (
          <span key={p.month}>{p.month}</span>
        ))}
      </div>
    </div>
  );
}
