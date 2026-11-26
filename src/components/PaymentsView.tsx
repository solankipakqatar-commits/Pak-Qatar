import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Download,
  Info,
  Receipt,
  ShieldCheck,
} from 'lucide-react';
import { ContributionPayment } from '../types/pqfs';
import { DEMO_CUSTOMER } from '../data/pqfsData';
import { PakQatarLogo, ProcessingOverlay } from './BrandAssets';

interface PaymentsViewProps {
  isAuthenticated: boolean;
  maskSensitive: boolean;
  payments: ContributionPayment[];
  activePayTarget: ContributionPayment | null;
  onSelectPayTarget: (payment: ContributionPayment | null) => void;
  onPaymentCompleted: (paymentId: string, method: string, newRef: string) => void;
  onRequireLogin: () => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  isAuthenticated,
  maskSensitive,
  payments,
  activePayTarget,
  onSelectPayTarget,
  onPaymentCompleted,
  onRequireLogin,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('Raast Instant Transfer (Demo)');
  const [payStep, setPayStep] = useState<'review' | 'confirm' | 'result'>('review');
  const [processing, setProcessing] = useState(false);
  const [completedRef, setCompletedRef] = useState('');
  const [receiptModal, setReceiptModal] = useState<ContributionPayment | null>(null);

  const formatMoney = (v: number) => (maskSensitive ? 'PKR •••••••' : `PKR ${v.toLocaleString()}`);

  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl border border-[#007A48]/20 bg-[#EAF3EE] p-8 text-center">
        <CreditCard className="w-10 h-10 text-[#A32035] mx-auto" />
        <h1 className="mt-3 text-lg font-bold text-[#1E2022]">Contributions & Payments</h1>
        <p className="mt-1.5 text-sm text-[#5C6066] max-w-md mx-auto">
          Sign in to review upcoming Takaful contributions, inspect Tabarru and investment breakdowns, pay dues, and download receipts.
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

  const upcoming = payments.filter((p) => p.status !== 'Settled');
  const history = payments.filter((p) => p.status === 'Settled');
  const totalDuePkr = upcoming.reduce((sum, p) => sum + p.amountPkr, 0);

  const handleConfirmPayment = () => {
    if (!activePayTarget) return;
    setProcessing(true);
    window.setTimeout(() => {
      const ref = `TXN-PQF-${Math.floor(1000000 + Math.random() * 9000000)}`;
      setCompletedRef(ref);
      onPaymentCompleted(activePayTarget.id, selectedMethod, ref);
      setProcessing(false);
      setPayStep('result');
    }, 1500);
  };

  // Active Journey 3 Payment Checkout Flow
  if (activePayTarget) {
    return (
      <div className="max-w-xl mx-auto pb-10">
        <ProcessingOverlay
          visible={processing}
          title="Processing Your Contribution"
          subtitle="Allocating Tabarru, Wakalah, and investment units (Demo)..."
        />

        {payStep !== 'result' && (
          <button
            type="button"
            onClick={() => {
              if (payStep === 'confirm') setPayStep('review');
              else onSelectPayTarget(null);
            }}
            className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium text-[#5C6066] hover:text-[#A32035] mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{payStep === 'confirm' ? 'Back to Review' : 'Back to Payments'}</span>
          </button>
        )}

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
          <div className="text-xs font-semibold text-[#A32035]">
            {activePayTarget.entity === 'family'
              ? 'Family Takaful Contribution · PQFTL'
              : 'General Takaful Contribution · PQGTL'}
          </div>
          <h1 className="mt-1 text-xl font-bold text-[#1E2022]">
            {payStep === 'result' ? 'Contribution Paid (Demo)' : 'Pay Contribution'}
          </h1>

          {payStep === 'review' && (
            <div className="mt-5 space-y-5">
              <div className="p-4 rounded-2xl bg-[#F6F6F7] border border-[#E5E7EB] space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#5C6066]">Product</span>
                  <span className="font-semibold text-[#1E2022]">{activePayTarget.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6066]">Certificate No.</span>
                  <span className="font-semibold text-[#1E2022] tabular-nums">
                    {activePayTarget.certificateNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6066]">Due Date</span>
                  <span className="font-semibold text-[#A32035]">{activePayTarget.dueDate}</span>
                </div>
                <div className="pt-2 border-t border-[#E5E7EB] flex justify-between text-sm">
                  <span className="font-semibold text-[#1E2022]">Total Contribution</span>
                  <span className="font-bold text-[#1E2022] tabular-nums">
                    PKR {activePayTarget.amountPkr.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Transparent Takaful Allocation Breakdown */}
              <div>
                <h2 className="text-xs font-bold text-[#1E2022] mb-2">
                  Shariah Allocation Breakdown (Illustrative)
                </h2>
                <div className="space-y-1.5 text-xs text-[#5C6066] p-3.5 rounded-2xl border border-[#E5E7EB]">
                  <div className="flex justify-between">
                    <span>Participant Investment Account (PIA)</span>
                    <span className="font-semibold text-[#007A48] tabular-nums">
                      PKR {activePayTarget.allocationBreakdown.investmentPortionPkr.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tabarru / Waqf Mutual Pool</span>
                    <span className="font-semibold text-[#1E2022] tabular-nums">
                      PKR {activePayTarget.allocationBreakdown.tabarruWaqfPortionPkr.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wakalah Management Fee</span>
                    <span className="font-semibold text-[#1E2022] tabular-nums">
                      PKR {activePayTarget.allocationBreakdown.wakalahFeePkr.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Demo Payment Method Selection */}
              <div>
                <h2 className="text-xs font-bold text-[#1E2022] mb-2">
                  Select Payment Method (Demo Channel)
                </h2>
                <div className="space-y-2">
                  {[
                    'Raast Instant Transfer (Demo)',
                    '1Link Bill Payment (Demo)',
                    'Islamic Bank Debit Card (Demo)',
                  ].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setSelectedMethod(method)}
                      className={`w-full min-h-[46px] px-4 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-colors ${
                        selectedMethod === method
                          ? 'border-[#A32035] bg-[#A32035]/5 text-[#A32035]'
                          : 'border-[#E5E7EB] text-[#1E2022]'
                      }`}
                    >
                      <span>{method}</span>
                      {selectedMethod === method && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPayStep('confirm')}
                className="w-full min-h-[48px] rounded-xl bg-[#A32035] hover:opacity-90 text-white text-sm font-medium"
              >
                Continue to Confirmation
              </button>
            </div>
          )}

          {payStep === 'confirm' && (
            <div className="mt-5 space-y-4">
              <div className="p-4 rounded-2xl bg-[#F6F6F7] border border-[#E5E7EB] space-y-2 text-xs">
                <div className="font-bold text-[#1E2022]">Final Transaction Confirmation</div>
                <p className="text-[#5C6066]">
                  Please confirm you wish to simulate paying{' '}
                  <span className="font-bold text-[#1E2022]">
                    PKR {activePayTarget.amountPkr.toLocaleString()}
                  </span>{' '}
                  via <span className="font-semibold text-[#1E2022]">{selectedMethod}</span>.
                </p>
              </div>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setPayStep('review')}
                  className="flex-1 min-h-[46px] rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#1E2022]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="flex-1 min-h-[46px] rounded-xl bg-[#A32035] hover:opacity-90 text-white text-xs font-medium"
                >
                  Confirm & Pay
                </button>
              </div>
            </div>
          )}

          {payStep === 'result' && (
            <div className="mt-5 text-center py-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#007A48]/10 text-[#007A48] flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="mt-3 text-sm text-[#5C6066]">
                Simulated contribution transaction settled cleanly.
              </p>
              <div className="mt-4 p-4 rounded-2xl bg-[#F6F6F7] border border-[#E5E7EB] text-xs space-y-1.5 text-left">
                <div className="flex justify-between">
                  <span className="text-[#5C6066]">Reference Number</span>
                  <span className="font-bold text-[#1E2022] tabular-nums">{completedRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6066]">Method</span>
                  <span className="font-medium text-[#1E2022]">{selectedMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6066]">Amount Paid</span>
                  <span className="font-bold text-[#007A48] tabular-nums">
                    PKR {activePayTarget.amountPkr.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="mt-5 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const updatedItem = payments.find((p) => p.id === activePayTarget.id) ?? {
                      ...activePayTarget,
                      referenceNumber: completedRef,
                      status: 'Settled' as const,
                      paidDate: '26 Nov 2026',
                      paymentMethod: selectedMethod,
                    };
                    setReceiptModal(updatedItem);
                  }}
                  className="flex-1 min-h-[44px] rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#1E2022] inline-flex items-center justify-center gap-1.5"
                >
                  <Receipt className="w-4 h-4 text-[#A32035]" />
                  <span>View Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPayStep('review');
                    onSelectPayTarget(null);
                  }}
                  className="flex-1 min-h-[44px] rounded-xl bg-[#A32035] text-white text-xs font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1E2022]">Contributions & Payments</h1>
        <p className="text-xs text-[#5C6066] mt-0.5">
          Manage due contributions, understand allocation components, and download payment receipts.
        </p>
      </div>

      {/* Educational Distinction Note: Contribution vs Payment vs Investment Value */}
      <div className="rounded-2xl border border-[#007A48]/20 bg-[#EAF3EE] p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#007A48] shrink-0 mt-0.5" />
        <div className="text-xs text-[#5C6066] leading-relaxed">
          <span className="font-semibold text-[#1E2022]">Understanding Your Figures: </span>
          Your <span className="font-medium text-[#1E2022]">Contribution</span> is your scheduled Takaful amount;{' '}
          <span className="font-medium text-[#1E2022]">Payments</span> are settled transactions; and{' '}
          <span className="font-medium text-[#1E2022]">Investment Value</span> (for Family Takaful PIA plans) reflects market units net of Tabarru and Wakalah.
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <div className="text-xs text-[#5C6066]">Upcoming Scheduled / Due</div>
          <div className="mt-1 text-2xl font-bold text-[#A32035] tabular-nums">
            {formatMoney(totalDuePkr)}
          </div>
          <div className="mt-1 text-[11px] text-[#5C6066] tabular-nums">
            {upcoming.length} upcoming installment{upcoming.length === 1 ? '' : 's'}
          </div>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <div className="text-xs text-[#5C6066]">Settled Receipts Available</div>
          <div className="mt-1 text-2xl font-bold text-[#007A48] tabular-nums">
            {history.length} Transactions
          </div>
          <div className="mt-1 text-[11px] text-[#5C6066]">
            Demo payment history across PQFTL & PQGTL
          </div>
        </div>
      </div>

      {/* Upcoming Contributions */}
      <section>
        <h2 className="text-base font-bold text-[#1E2022] mb-3">Upcoming Contributions</h2>
        {upcoming.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 text-center text-xs text-[#007A48] font-medium">
            All upcoming contributions have been settled.
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="text-xs font-semibold text-[#A32035]">
                    {item.entity === 'family' ? 'Family Takaful · PQFTL' : 'General Takaful · PQGTL'} · Due{' '}
                    {item.dueDate}
                  </div>
                  <div className="text-sm font-bold text-[#1E2022] mt-0.5">{item.productName}</div>
                  <div className="text-xs text-[#5C6066] mt-0.5 tabular-nums">
                    Certificate: {item.certificateNumber} · Status: {item.status}
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-base font-bold text-[#1E2022] tabular-nums">
                    {formatMoney(item.amountPkr)}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPayStep('review');
                      onSelectPayTarget(item);
                    }}
                    className="min-h-[42px] px-4 py-2 rounded-xl bg-[#A32035] hover:opacity-90 text-white text-xs font-medium whitespace-nowrap"
                  >
                    Pay Contribution
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contribution & Payment History */}
      <section>
        <h2 className="text-base font-bold text-[#1E2022] mb-3">Payment History</h2>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white divide-y divide-[#E5E7EB]">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="text-xs font-bold text-[#1E2022]">{item.productName}</div>
                <div className="text-[11px] text-[#5C6066] mt-0.5 tabular-nums">
                  {item.referenceNumber} · Paid {item.paidDate} · {item.paymentMethod}
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-[#007A48] tabular-nums">
                    {formatMoney(item.amountPkr)}
                  </div>
                  <div className="text-[11px] text-[#007A48]">Settled</div>
                </div>
                <button
                  type="button"
                  onClick={() => setReceiptModal(item)}
                  className="min-h-[40px] px-3 rounded-xl border border-[#E5E7EB] hover:border-[#A32035] text-xs font-medium text-[#1E2022] inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Receipt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Digital Receipt Modal */}
      {receiptModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E5E7EB] shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] gap-3">
              <div>
                <div className="text-xs font-semibold text-[#007A48]">
                  Contribution Receipt (Demo)
                </div>
                <h3 className="text-base font-bold text-[#1E2022]">{receiptModal.referenceNumber}</h3>
              </div>
              <PakQatarLogo variant="compact" />
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5C6066]">Participant</span>
                <span className="font-semibold text-[#1E2022]">{DEMO_CUSTOMER.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C6066]">Certificate</span>
                <span className="font-semibold text-[#1E2022] tabular-nums">
                  {receiptModal.certificateNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C6066]">Product</span>
                <span className="font-semibold text-[#1E2022]">{receiptModal.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C6066]">Paid Date</span>
                <span className="font-semibold text-[#1E2022]">{receiptModal.paidDate ?? '26 Nov 2026'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C6066]">Channel</span>
                <span className="font-semibold text-[#1E2022]">{receiptModal.paymentMethod}</span>
              </div>
              <div className="pt-2 border-t border-[#E5E7EB] flex justify-between text-sm">
                <span className="font-bold text-[#1E2022]">Total Settled</span>
                <span className="font-bold text-[#007A48] tabular-nums">
                  PKR {receiptModal.amountPkr.toLocaleString()}
                </span>
              </div>
            </div>
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
                onClick={() => setReceiptModal(null)}
                className="flex-1 min-h-[44px] rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#1E2022]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
