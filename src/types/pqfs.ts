export type TakafulEntity = 'family' | 'general';

export type NavTab = 'home' | 'protection' | 'claims' | 'payments' | 'family' | 'more';

export type LanguageCode = 'en' | 'ur';

export type AuthScreen = 'splash' | 'welcome' | 'login' | 'register' | 'biometric' | 'app';

export type ProtectionSubTab = 'explore' | 'certificates' | 'investments';

export type MoreSubSection = 'hub' | 'shariah' | 'support' | 'services' | 'security';

export type ClaimStage =
  | 'Submitted'
  | 'Documents Review'
  | 'Under Assessment'
  | 'Decision'
  | 'Completed';

export interface TakafulProduct {
  id: string;
  entity: TakafulEntity;
  companyName: string;
  name: string;
  shortTagline: string;
  mainBenefit: string;
  iconKey:
    | 'shield'
    | 'graduation'
    | 'landmark'
    | 'heart'
    | 'car'
    | 'home'
    | 'plane'
    | 'briefcase'
    | 'umbrella'
    | 'building';
  overview: string;
  eligibility: string[];
  coverageInfo: string[];
  contributionInfo: string;
  illustrativeMinContributionPkr: number;
  illustrativeFrequency: string;
  keyConditions: string[];
  faqs: { q: string; a: string }[];
  documents: string[];
  isInvestmentLinked: boolean;
}

export interface TakafulCertificate {
  id: string;
  certificateNumber: string;
  entity: TakafulEntity;
  companyLabel: string;
  productId: string;
  productName: string;
  status: 'Active' | 'Expired';
  issueDate: string;
  maturityOrRenewalDate: string;
  coveredBenefitPkr: number;
  contributionAmountPkr: number;
  frequency: 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual';
  nextDueDate: string;
  participantInvestmentAccountPkr?: number;
  tabarruAllocationNote: string;
  nomineeName: string;
  coveredAssetOrPlan: string;
}

export interface FundHolding {
  id: string;
  fundName: string;
  riskProfile: 'Conservative' | 'Balanced' | 'Growth';
  allocationPercent: number;
  units: number;
  navPkr: number;
  valuationDate: string;
  valuePkr: number;
  ytdIllustrativeChange: string;
  historyPoints: { month: string; nav: number }[];
}

export interface ContributionPayment {
  id: string;
  referenceNumber: string;
  certificateNumber: string;
  productName: string;
  entity: TakafulEntity;
  dueDate: string;
  paidDate?: string;
  amountPkr: number;
  status: 'Due' | 'Settled' | 'Scheduled';
  paymentMethod?: string;
  allocationBreakdown: {
    investmentPortionPkr: number;
    tabarruWaqfPortionPkr: number;
    wakalahFeePkr: number;
  };
}

export interface TakafulClaim {
  id: string;
  referenceNumber: string;
  certificateNumber: string;
  productName: string;
  entity: TakafulEntity;
  claimType: string;
  incidentDate: string;
  submittedDate: string;
  estimatedAmountPkr: number;
  approvedAmountPkr?: number;
  currentStage: ClaimStage;
  summary: string;
  documents: string[];
  lastUpdatedNote: string;
}

export interface FamilyMember {
  id: string;
  initials: string;
  fullName: string;
  relationship: 'Self (Participant)' | 'Son' | 'Father' | 'Brother';
  role: 'Primary Participant' | 'Covered Dependent' | 'Beneficiary / Nominee';
  dateOfBirth: string;
  certificateNumbers: string[];
  elaajCovered: boolean;
  sharePercent?: number;
}

export interface ElaajProvider {
  id: string;
  name: string;
  type: 'Hospital' | 'Specialist Physician' | 'Diagnostic Centre';
  city: 'Karachi' | 'Lahore' | 'Islamabad' | 'Rawalpindi';
  specialty: string;
  address: string;
  panelType: 'Cashless & Reimbursement (Demo)' | 'Reimbursement Support (Demo)';
  phone: string;
}

export interface SupportComplaint {
  id: string;
  ticketNumber: string;
  category: string;
  subject: string;
  submittedDate: string;
  status: 'In Review (Demo)' | 'Assigned to Desk (Demo)' | 'Resolved (Demo)';
  summary: string;
}

export interface AppNotification {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  entity?: TakafulEntity;
  read: boolean;
}
