import type {
  AppNotification,
  ContributionPayment,
  ElaajProvider,
  FamilyMember,
  FundHolding,
  SupportComplaint,
  TakafulCertificate,
  TakafulClaim,
  TakafulProduct,
} from '../types/pqfs.ts';

export const DEMO_CUSTOMER = {
  customerId: 'PQF-849201',
  fullName: 'Ahmed Tariq',
  initials: 'AT',
  maskedCnic: '42101-•••••••-3',
  fullCnicDemo: '42101-5839201-3',
  mobile: '0300-8241905',
  email: 'ahmed.tariq@demo-pqftl.example',
  city: 'Karachi',
  elaajCardNumber: 'ELJ-PQF-2026-4418',
  elaajPlanName: 'Elaaj Family Healthcare (Illustrative Demo)',
};

export const TAKAFUL_PRODUCTS: TakafulProduct[] = [
  // FAMILY TAKAFUL (PQFTL) — SAVINGS, EDUCATION & RETIREMENT
  {
    id: 'ft-family-savings',
    entity: 'family',
    category: 'savings-retirement',
    companyName: 'Pak-Qatar Family Takaful Limited (PQFTL)',
    name: 'Family Protection & Savings Plan',
    shortTagline: 'Shariah-compliant protection paired with long-term wealth accumulation.',
    mainBenefit: 'Dual Waqf risk protection and unit-linked investment accumulation',
    iconKey: 'shield',
    overview:
      'Illustrative Family Takaful profile combining Participant Risk Account (Waqf/Tabarru) protection with a Shariah-screened Participant Investment Account (PIA) designed for medium-to-long-term household financial resilience.',
    eligibility: [
      'Adult Pakistani residents aged 18 to 60 years (illustrative range)',
      'Valid CNIC / NICOP and active local mobile number',
      'Subject to standard underwriting and KYC verification',
    ],
    coverageInfo: [
      'Basic Sum Covered linked to chosen contribution multiple (illustrative)',
      'Participant Investment Account value payable on maturity or surrender per plan terms',
      'Optional riders such as Accidental Protection or Hospitalization support where applicable',
    ],
    contributionInfo:
      'Illustrative starting contribution from PKR 5,000/month. Actual schedules depend on age, term, and selected coverage.',
    illustrativeMinContributionPkr: 5000,
    illustrativeFrequency: 'Monthly / Quarterly / Annual',
    keyConditions: [
      'Demonstrative product figures; official terms are governed by the Participant Membership Document (PMD).',
      'Early encashment values depend on unit prices and applicable Wakalah/allocation rules.',
      'Past investment unit performance does not guarantee future returns.',
    ],
    faqs: [
      {
        q: 'How are my contributions separated under Takaful?',
        a: 'A portion is allocated as Tabarru into the Waqf pool for mutual protection, Wakalah covers management fees, and the remainder is invested in Shariah-compliant funds.',
      },
      {
        q: 'Can I make Top-Up contributions later?',
        a: 'Yes, eligible investment-linked plans allow ad-hoc top-up contributions subject to plan minimums.',
      },
    ],
    documents: [
      'Illustrative Benefit Illustration Sheet (Demo)',
      'Sample Participant Membership Terms Overview',
      'Shariah Compliance Basis Summary',
    ],
    isInvestmentLinked: true,
  },
  {
    id: 'ft-child-education',
    entity: 'family',
    category: 'savings-retirement',
    companyName: 'Pak-Qatar Family Takaful Limited (PQFTL)',
    name: 'Child Education Takaful Plan',
    shortTagline: 'Dedicated education milestone accumulation with parental protection.',
    mainBenefit: 'Structured milestone funding for higher education goals',
    iconKey: 'graduation',
    overview:
      'Illustrative savings and protection plan structured around higher-education timelines, helping guardians accumulate Shariah-compliant reserves while maintaining Waqf coverage continuity.',
    eligibility: [
      'Parent or legal guardian aged 20 to 55 years (illustrative)',
      'Child aged 0 to 14 years at plan commencement',
      'CNIC and child birth registration / B-Form required during full application',
    ],
    coverageInfo: [
      'Maturity milestone payout aligned to university entry age (illustrative)',
      'Waiver of contribution protection option in case of participant unforeseen event',
      'Flexible partial withdrawal support at designated educational stages',
    ],
    contributionInfo:
      'Illustrative starting contribution from PKR 4,500/month across 10–20 year terms.',
    illustrativeMinContributionPkr: 4500,
    illustrativeFrequency: 'Monthly / Annual',
    keyConditions: [
      'All projected education values shown in calculators are illustrative demonstrations only.',
      'Surplus distribution, if any, follows Shariah Supervisory Board guidelines.',
    ],
    faqs: [
      {
        q: 'What happens if the guardian faces an unforeseen event?',
        a: 'Where Waiver of Contribution protection applies, the Waqf pool continues funding future plan contributions per PMD terms.',
      },
    ],
    documents: [
      'Education Goal Planning Summary (Demo)',
      'Sample Waqf & Allocation Schedule',
    ],
    isInvestmentLinked: true,
  },
  {
    id: 'ft-mahana-bachat',
    entity: 'family',
    category: 'savings-retirement',
    companyName: 'Pak-Qatar Family Takaful Limited (PQFTL)',
    name: 'Mahana Bachat & Takaful Flexi Plan',
    shortTagline: 'Disciplined monthly savings paired with flexible Family Takaful cover.',
    mainBenefit: 'Accessible regular savings with customizable protection riders',
    iconKey: 'briefcase',
    overview:
      'An investment-linked regular savings Family Takaful solution from PQFTL designed for salaried individuals and families seeking structured monthly accumulation alongside comprehensive Waqf protection.',
    eligibility: [
      'Individuals aged 18 to 60 years with valid CNIC / NICOP',
      'Flexible term selection tailored to medium-term family goals',
    ],
    coverageInfo: [
      'Death and accidental protection benefit via the PQFTL Waqf risk pool',
      'Accumulated Participant Investment Account (PIA) balance payable at maturity',
      'Optional critical illness and hospitalization rider enhancements',
    ],
    contributionInfo:
      'Illustrative monthly savings starting from PKR 3,500/month; final illustrations are generated during formal underwriting.',
    illustrativeMinContributionPkr: 3500,
    illustrativeFrequency: 'Monthly / Quarterly / Annual',
    keyConditions: [
      'Investment unit growth depends on underlying Shariah-compliant fund performance.',
      'Official terms and surrender schedules are governed by the issued PMD.',
    ],
    faqs: [
      {
        q: 'Is Mahana Bachat & Takaful Flexi Plan Shariah-compliant?',
        a: 'Yes, all contributions follow PQFTL Waqf-Wakalah governance reviewed by the independent Shariah Supervisory Board.',
      },
    ],
    documents: [
      'Mahana Bachat Plan Overview (Demo)',
      'Waqf & Unit Allocation Summary',
    ],
    isInvestmentLinked: true,
  },
  {
    id: 'ft-retirement-wealth',
    entity: 'family',
    category: 'savings-retirement',
    companyName: 'Pak-Qatar Family Takaful Limited (PQFTL)',
    name: 'Retirement & Wealth Accumulation',
    shortTagline: 'Halal long-horizon retirement reserve with disciplined fund switching.',
    mainBenefit: 'Flexible Shariah-compliant fund allocation across life stages',
    iconKey: 'landmark',
    overview:
      'Illustrative retirement accumulation plan allowing participants to balance growth and capital preservation across Shariah-screened equity, sukuk, and money-market avenues.',
    eligibility: [
      'Individuals aged 22 to 58 years (illustrative)',
      'Minimum illustrative plan term of 10 years',
    ],
    coverageInfo: [
      'Accumulated Participant Investment Account payable as lump sum or structured drawdown (illustrative)',
      'Sum Covered protection throughout active contribution years',
    ],
    contributionInfo:
      'Illustrative starting contribution from PKR 7,500/month with optional annual indexation.',
    illustrativeMinContributionPkr: 7500,
    illustrativeFrequency: 'Monthly / Quarterly / Annual',
    keyConditions: [
      'Investment risk in unit-linked accounts is borne by the participant.',
      'Switch requests between Shariah funds are subject to valuation dates.',
    ],
    faqs: [
      {
        q: 'Can I shift to lower-risk funds closer to retirement?',
        a: 'Yes, fund switching lets you adjust allocation toward conservative Islamic income funds as your horizon shortens.',
      },
    ],
    documents: [
      'Illustrative Retirement Fund Guide (Demo)',
      'Unit-Linked Risk Disclosure Note',
    ],
    isInvestmentLinked: true,
  },
  {
    id: 'ft-lifetime-kafalat',
    entity: 'family',
    category: 'savings-retirement',
    companyName: 'Pak-Qatar Family Takaful Limited (PQFTL)',
    name: 'Lifetime Kafalat Plan',
    shortTagline: 'Shariah-compliant retirement income stream for post-career peace of mind.',
    mainBenefit: 'Structured post-retirement income planning with family security',
    iconKey: 'landmark',
    overview:
      'A dedicated PQFTL retirement and pension planning structure built to help participants transition accumulated halal savings into a dependable post-retirement income stream.',
    eligibility: [
      'Adult residents planning long-term post-retirement income streams',
      'Subject to standard PQFTL underwriting and maturity age rules',
    ],
    coverageInfo: [
      'Post-retirement periodic income options alongside Waqf protection',
      'Continuity of family benefit in line with selected payout option',
    ],
    contributionInfo:
      'Illustrative contribution starting from PKR 10,000/month depending on target retirement horizon.',
    illustrativeMinContributionPkr: 10000,
    illustrativeFrequency: 'Monthly / Annual',
    keyConditions: [
      'Payout structures depend on accumulated account value at retirement commencement.',
      'All calculator estimates in this app are non-guaranteed demonstrations.',
    ],
    faqs: [
      {
        q: 'How is Lifetime Kafalat different from general savings?',
        a: 'It focuses specifically on building a structured halal income stream for retirement years under PQFTL Family Takaful.',
      },
    ],
    documents: [
      'Lifetime Kafalat Plan Summary (Demo)',
      'Retirement Payout Options Guide',
    ],
    isInvestmentLinked: true,
  },
  {
    id: 'ft-vps-pension',
    entity: 'family',
    category: 'savings-retirement',
    companyName: 'Pak-Qatar Family Takaful Limited (PQFTL)',
    name: 'Voluntary Pension Scheme (VPS)',
    shortTagline: 'Shariah-compliant dedicated pension fund accumulation for individuals.',
    mainBenefit: 'Long-term halal pension accumulation across Shariah sub-funds',
    iconKey: 'briefcase',
    overview:
      'PQFTL Voluntary Pension Scheme (VPS) supports long-term retirement saving through diversified Shariah-compliant sub-funds tailored to participant risk tolerance across working years.',
    eligibility: [
      'Salaried and self-employed individuals with valid CNIC / NICOP',
      'Flexible contribution schedule based on individual retirement horizon',
    ],
    coverageInfo: [
      'Dedicated Shariah-compliant pension sub-fund allocation options',
      'Structured lump sum and income drawdown options at retirement age per applicable rules',
    ],
    contributionInfo:
      'Illustrative contribution starting from PKR 5,000/month; tax credit eligibility follows prevailing Pakistan tax laws.',
    illustrativeMinContributionPkr: 5000,
    illustrativeFrequency: 'Monthly / Quarterly / Annual',
    keyConditions: [
      'Unit values fluctuate based on underlying Shariah market instruments.',
      'Consult official PQFTL VPS offering documents and tax advisors for formal tax-credit computation.',
    ],
    faqs: [
      {
        q: 'Can I adjust my pension sub-fund mix over time?',
        a: 'Yes, participants can rebalance allocation across conservative, balanced, and growth Shariah sub-funds per scheme rules.',
      },
    ],
    documents: [
      'PQFTL Voluntary Pension Overview (Demo)',
      'Shariah Sub-Fund Allocation Note',
    ],
    isInvestmentLinked: true,
  },

  // FAMILY TAKAFUL (PQFTL) — HEALTH & CORPORATE GROUP
  {
    id: 'ft-health-elaaj',
    entity: 'family',
    category: 'health-group',
    companyName: 'Pak-Qatar Family Takaful Limited (PQFTL)',
    name: 'Individual & Family Elaaj Health',
    shortTagline: 'Family Sehat & Elaaj hospitalization protection for households.',
    mainBenefit: 'Access to Digital Elaaj Card and panel hospital care',
    iconKey: 'heart',
    overview:
      'Illustrative PQFTL Family Health Takaful (Family Sehat & Elaaj) solution providing structured inpatient hospitalization limits, accidental emergency care, day-care procedures, and seamless digital Elaaj identification.',
    eligibility: [
      'Primary participant aged 18 to 60 years; eligible dependents per rules',
      'Health declaration required at onboarding',
    ],
    coverageInfo: [
      'Annual inpatient hospitalization, accidental emergency & surgical benefit tiers (illustrative)',
      'Digital Elaaj health identification card & cashless / reimbursement pathway',
      'Pre- and post-hospitalization diagnostic support windows',
    ],
    contributionInfo:
      'Illustrative annual contribution starting from PKR 18,000/year per covered member.',
    illustrativeMinContributionPkr: 18000,
    illustrativeFrequency: 'Annual',
    keyConditions: [
      'Waiting periods and pre-existing condition rules apply as specified in official policy schedules.',
      'Hospital network lists in this prototype are illustrative demonstrations.',
    ],
    faqs: [
      {
        q: 'How does Elaaj hospitalization work?',
        a: 'Present your Digital Elaaj Card at panel facilities or submit discharge records via the Claims Centre for reimbursement review.',
      },
    ],
    documents: [
      'Elaaj Benefit Tier Overview (Demo)',
      'Hospitalization Claim Checklist',
    ],
    isInvestmentLinked: false,
  },
  {
    id: 'ft-group-family',
    entity: 'family',
    category: 'health-group',
    companyName: 'Pak-Qatar Family Takaful Limited (PQFTL)',
    name: 'Corporate Group Family Takaful',
    shortTagline: 'Employer-sponsored Shariah life protection for organizational teams.',
    mainBenefit: 'Unified group family protection via PQFTL Corporate Portal',
    iconKey: 'building',
    overview:
      'Illustrative group Family Takaful protection designed for employers wishing to extend ethical, Shariah-compliant family financial security and optional benefits to employees.',
    eligibility: [
      'Registered companies and institutions in Pakistan (minimum group size applies)',
      'Administered via PQFTL Corporate Portal',
    ],
    coverageInfo: [
      'Group term protection tied to employee grade or salary multiples',
      'Optional accidental protection and disability riders',
    ],
    contributionInfo:
      'Custom corporate quotation based on employee census and benefit design (illustrative).',
    illustrativeMinContributionPkr: 25000,
    illustrativeFrequency: 'Annual Corporate Schedule',
    keyConditions: [
      'Subject to group underwriting and formal corporate master certificate issuance.',
    ],
    faqs: [
      {
        q: 'How do employees view their group coverage?',
        a: 'Covered employees can access individual certificate summaries and Elaaj cards once onboarded by HR.',
      },
    ],
    documents: ['Corporate Family Takaful Brief (Demo)'],
    isInvestmentLinked: false,
  },
  {
    id: 'ft-group-health',
    entity: 'family',
    category: 'health-group',
    companyName: 'Pak-Qatar Family Takaful Limited (PQFTL)',
    name: 'Corporate Group Health Takaful',
    shortTagline: 'Comprehensive inpatient and panel healthcare cover for corporate teams.',
    mainBenefit: 'Panel hospitalization & Digital Elaaj cards for employees and families',
    iconKey: 'heart',
    overview:
      'PQFTL Corporate Group Health Takaful helps organizations safeguard employee and dependent wellbeing through tailored hospitalization schedules and Elaaj panel hospital access.',
    eligibility: [
      'Corporate employers, NGOs, and institutions operating in Pakistan',
      'Employee & eligible dependent census submitted by employer HR',
    ],
    coverageInfo: [
      'Cashless panel hospital admission via Digital Elaaj identification',
      'Inpatient room & surgical tiers plus maternity and OPD options per employer schedule',
    ],
    contributionInfo:
      'Custom corporate group rate based on employee demographics and chosen room-limit tier (illustrative).',
    illustrativeMinContributionPkr: 20000,
    illustrativeFrequency: 'Annual Corporate Schedule',
    keyConditions: [
      'Benefits follow employer-selected schedule limits and corporate master agreement.',
    ],
    faqs: [
      {
        q: 'Does Corporate Group Health include Elaaj App support?',
        a: 'Yes, covered employees can present their Digital Elaaj Health Card and search panel hospitals directly in the app.',
      },
    ],
    documents: ['Corporate Group Health Overview (Demo)'],
    isInvestmentLinked: false,
  },
];

export const DEMO_CERTIFICATES: TakafulCertificate[] = [
  {
    id: 'cert-ft-1',
    certificateNumber: 'PQFTL-FAM-2023-09412',
    entity: 'family',
    companyLabel: 'Pak-Qatar Family Takaful Limited (PQFTL)',
    productId: 'ft-family-savings',
    productName: 'Family Protection & Savings Plan',
    status: 'Active',
    issueDate: '14 Mar 2023',
    maturityOrRenewalDate: '14 Mar 2038',
    coveredBenefitPkr: 2500000,
    contributionAmountPkr: 15000,
    frequency: 'Monthly',
    nextDueDate: '05 Dec 2026',
    participantInvestmentAccountPkr: 742850,
    tabarruAllocationNote: 'Tabarru directed to PQFTL Waqf Pool; net balance invested in PIA units.',
    nomineeName: 'Bilal Tariq (Son)',
    coveredAssetOrPlan: '15-Year Unit-Linked Family Plan',
  },
  {
    id: 'cert-ft-2',
    certificateNumber: 'PQFTL-EDU-2024-11804',
    entity: 'family',
    companyLabel: 'Pak-Qatar Family Takaful Limited (PQFTL)',
    productId: 'ft-child-education',
    productName: 'Child Education Takaful Plan',
    status: 'Active',
    issueDate: '10 Aug 2024',
    maturityOrRenewalDate: '10 Aug 2036',
    coveredBenefitPkr: 1500000,
    contributionAmountPkr: 10000,
    frequency: 'Monthly',
    nextDueDate: '10 Dec 2026',
    participantInvestmentAccountPkr: 294120,
    tabarruAllocationNote: 'Includes Waiver of Contribution Tabarru rider.',
    nomineeName: 'Bilal Tariq (Son)',
    coveredAssetOrPlan: 'Higher Education Reserve (Age 18 Target)',
  },
  {
    id: 'cert-ft-3',
    certificateNumber: 'PQFTL-ELJ-2026-44180',
    entity: 'family',
    companyLabel: 'Pak-Qatar Family Takaful Limited (PQFTL)',
    productId: 'ft-health-elaaj',
    productName: 'Individual & Family Elaaj Health',
    status: 'Active',
    issueDate: '01 Feb 2026',
    maturityOrRenewalDate: '31 Jan 2027',
    coveredBenefitPkr: 1500000,
    contributionAmountPkr: 24000,
    frequency: 'Annual',
    nextDueDate: '31 Jan 2027',
    tabarruAllocationNote: 'Pure PQFTL Family Health Waqf protection with Digital Elaaj Card access.',
    nomineeName: 'Ahmed Tariq & Household (3 Members)',
    coveredAssetOrPlan: 'Family Inpatient & Elaaj Health Cover (Illustrative)',
  },
  {
    id: 'cert-ft-4',
    certificateNumber: 'PQFTL-MHB-2021-30811',
    entity: 'family',
    companyLabel: 'Pak-Qatar Family Takaful Limited (PQFTL)',
    productId: 'ft-mahana-bachat',
    productName: 'Mahana Bachat & Takaful Flexi Plan',
    status: 'Expired',
    issueDate: '04 Nov 2021',
    maturityOrRenewalDate: '04 Nov 2026',
    coveredBenefitPkr: 1200000,
    contributionAmountPkr: 6000,
    frequency: 'Monthly',
    nextDueDate: 'Matured Term',
    tabarruAllocationNote: '5-year savings & protection certificate completed full maturity schedule.',
    nomineeName: 'Tariq Mahmood (Father)',
    coveredAssetOrPlan: '5-Year Completed Savings Term (Matured)',
  },
];

export const DEMO_FUND_HOLDINGS: FundHolding[] = [
  {
    id: 'fund-balanced',
    fundName: 'PQFTL Balanced Takaful Fund (Illustrative)',
    riskProfile: 'Balanced',
    allocationPercent: 55,
    units: 3120.45,
    navPkr: 182.84,
    valuationDate: '24 Nov 2026',
    valuePkr: 570543,
    ytdIllustrativeChange: '+11.4% (Illustrative YTD)',
    historyPoints: [
      { month: 'Jun', nav: 168.4 },
      { month: 'Jul', nav: 171.2 },
      { month: 'Aug', nav: 173.9 },
      { month: 'Sep', nav: 176.1 },
      { month: 'Oct', nav: 179.5 },
      { month: 'Nov', nav: 182.84 },
    ],
  },
  {
    id: 'fund-growth',
    fundName: 'PQFTL Equity Growth Takaful Fund (Illustrative)',
    riskProfile: 'Growth',
    allocationPercent: 30,
    units: 1410.2,
    navPkr: 221.1,
    valuationDate: '24 Nov 2026',
    valuePkr: 311795,
    ytdIllustrativeChange: '+15.8% (Illustrative YTD)',
    historyPoints: [
      { month: 'Jun', nav: 196.2 },
      { month: 'Jul', nav: 201.5 },
      { month: 'Aug', nav: 199.8 },
      { month: 'Sep', nav: 208.4 },
      { month: 'Oct', nav: 215.7 },
      { month: 'Nov', nav: 221.1 },
    ],
  },
  {
    id: 'fund-conservative',
    fundName: 'PQFTL Secure Income Sukuk Fund (Illustrative)',
    riskProfile: 'Conservative',
    allocationPercent: 15,
    units: 1096.8,
    navPkr: 140.98,
    valuationDate: '24 Nov 2026',
    valuePkr: 154632,
    ytdIllustrativeChange: '+8.2% (Illustrative YTD)',
    historyPoints: [
      { month: 'Jun', nav: 131.5 },
      { month: 'Jul', nav: 133.4 },
      { month: 'Aug', nav: 135.2 },
      { month: 'Sep', nav: 137.1 },
      { month: 'Oct', nav: 139.0 },
      { month: 'Nov', nav: 140.98 },
    ],
  },
];

export const DEMO_PAYMENTS: ContributionPayment[] = [
  {
    id: 'pay-due-1',
    referenceNumber: 'DUE-PQF-202612-01',
    certificateNumber: 'PQFTL-FAM-2023-09412',
    productName: 'Family Protection & Savings Plan',
    entity: 'family',
    dueDate: '05 Dec 2026',
    amountPkr: 15000,
    status: 'Due',
    allocationBreakdown: {
      investmentPortionPkr: 12150,
      tabarruWaqfPortionPkr: 1650,
      wakalahFeePkr: 1200,
    },
  },
  {
    id: 'pay-due-2',
    referenceNumber: 'DUE-PQF-202612-02',
    certificateNumber: 'PQFTL-EDU-2024-11804',
    productName: 'Child Education Takaful Plan',
    entity: 'family',
    dueDate: '10 Dec 2026',
    amountPkr: 10000,
    status: 'Scheduled',
    allocationBreakdown: {
      investmentPortionPkr: 8100,
      tabarruWaqfPortionPkr: 1100,
      wakalahFeePkr: 800,
    },
  },
  {
    id: 'pay-hist-1',
    referenceNumber: 'TXN-PQF-8841209',
    certificateNumber: 'PQFTL-FAM-2023-09412',
    productName: 'Family Protection & Savings Plan',
    entity: 'family',
    dueDate: '05 Nov 2026',
    paidDate: '04 Nov 2026',
    amountPkr: 15000,
    status: 'Settled',
    paymentMethod: 'Raast / IBFT (Demo)',
    allocationBreakdown: {
      investmentPortionPkr: 12150,
      tabarruWaqfPortionPkr: 1650,
      wakalahFeePkr: 1200,
    },
  },
  {
    id: 'pay-hist-2',
    referenceNumber: 'TXN-PQF-8710542',
    certificateNumber: 'PQFTL-EDU-2024-11804',
    productName: 'Child Education Takaful Plan',
    entity: 'family',
    dueDate: '10 Nov 2026',
    paidDate: '09 Nov 2026',
    amountPkr: 10000,
    status: 'Settled',
    paymentMethod: '1Link Bill Payment (Demo)',
    allocationBreakdown: {
      investmentPortionPkr: 8100,
      tabarruWaqfPortionPkr: 1100,
      wakalahFeePkr: 800,
    },
  },
  {
    id: 'pay-hist-3',
    referenceNumber: 'TXN-PQF-4102938',
    certificateNumber: 'PQFTL-ELJ-2026-44180',
    productName: 'Individual & Family Elaaj Health',
    entity: 'family',
    dueDate: '01 Feb 2026',
    paidDate: '29 Jan 2026',
    amountPkr: 24000,
    status: 'Settled',
    paymentMethod: 'Islamic Bank Card (Demo)',
    allocationBreakdown: {
      investmentPortionPkr: 0,
      tabarruWaqfPortionPkr: 18000,
      wakalahFeePkr: 6000,
    },
  },
];

export const DEMO_CLAIMS: TakafulClaim[] = [
  {
    id: 'clm-1',
    referenceNumber: 'CLM-PQF-2026-1042',
    certificateNumber: 'PQFTL-ELJ-2026-44180',
    productName: 'Individual & Family Elaaj Health',
    entity: 'family',
    claimType: 'In-Patient Hospitalization & Surgical Care',
    incidentDate: '14 Nov 2026',
    submittedDate: '15 Nov 2026',
    estimatedAmountPkr: 68500,
    currentStage: 'Under Assessment',
    summary: 'In-patient admission & surgical care reimbursement request submitted with hospital discharge summary.',
    documents: ['Hospital Discharge Summary.pdf', 'Itemized Hospital Bill.pdf', 'Lab & Diagnostic Reports.pdf'],
    lastUpdatedNote: 'Medical officer document review completed; reimbursement approval under final assessment (Demo).',
  },
  {
    id: 'clm-2',
    referenceNumber: 'CLM-PQF-2026-0619',
    certificateNumber: 'PQFTL-FAM-2023-09412',
    productName: 'Elaaj Health Rider (Family Takaful)',
    entity: 'family',
    claimType: 'In-Patient Diagnostic & Day-Care Reimbursement',
    incidentDate: '02 Sep 2026',
    submittedDate: '06 Sep 2026',
    estimatedAmountPkr: 32000,
    approvedAmountPkr: 30400,
    currentStage: 'Completed',
    summary: 'Outpatient surgical procedure and lab diagnostics reimbursement for participant.',
    documents: ['Hospital Discharge Summary.pdf', 'Itemized Pharmacy Bills.pdf'],
    lastUpdatedNote: 'Reimbursement settled via IBFT after standard deductible adjustment (Demo).',
  },
];

export const DEMO_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'fam-1',
    initials: 'AT',
    fullName: 'Ahmed Tariq',
    relationship: 'Self (Participant)',
    role: 'Primary Participant',
    dateOfBirth: '18 May 1988',
    certificateNumbers: ['PQFTL-FAM-2023-09412', 'PQFTL-EDU-2024-11804', 'PQFTL-ELJ-2026-44180'],
    elaajCovered: true,
  },
  {
    id: 'fam-2',
    initials: 'BT',
    fullName: 'Bilal Tariq',
    relationship: 'Son',
    role: 'Beneficiary / Nominee',
    dateOfBirth: '09 Jan 2018',
    certificateNumbers: ['PQFTL-FAM-2023-09412', 'PQFTL-EDU-2024-11804', 'PQFTL-ELJ-2026-44180'],
    elaajCovered: true,
    sharePercent: 75,
  },
  {
    id: 'fam-3',
    initials: 'TM',
    fullName: 'Tariq Mahmood',
    relationship: 'Father',
    role: 'Covered Dependent',
    dateOfBirth: '11 Nov 1958',
    certificateNumbers: ['PQFTL-FAM-2023-09412', 'PQFTL-ELJ-2026-44180'],
    elaajCovered: true,
    sharePercent: 25,
  },
];

export const DEMO_ELAAJ_PROVIDERS: ElaajProvider[] = [
  {
    id: 'el-1',
    name: 'Karachi Central Medical Centre (Illustrative)',
    type: 'Hospital',
    city: 'Karachi',
    specialty: 'Multi-Specialty Inpatient & Emergency',
    address: 'Main Shahrah-e-Faisal, Block 6 PECHS, Karachi',
    panelType: 'Cashless & Reimbursement (Demo)',
    phone: '(021) 111-000-101 (Demo)',
  },
  {
    id: 'el-2',
    name: 'Dr. Kamran Siddiqui — Internal Medicine (Illustrative)',
    type: 'Specialist Physician',
    city: 'Karachi',
    specialty: 'Internal Medicine & Cardiology Consultations',
    address: 'Clifton Medical Plaza, Suite 402, Karachi',
    panelType: 'Reimbursement Support (Demo)',
    phone: '(021) 358-000-202 (Demo)',
  },
  {
    id: 'el-3',
    name: 'Lahore Crescent Care Hospital (Illustrative)',
    type: 'Hospital',
    city: 'Lahore',
    specialty: 'General Surgery, Orthopedics & ICU',
    address: 'Jail Road, Gulberg III, Lahore',
    panelType: 'Cashless & Reimbursement (Demo)',
    phone: '(042) 111-000-303 (Demo)',
  },
  {
    id: 'el-4',
    name: 'Dr. Salman Raza — Pediatrics (Illustrative)',
    type: 'Specialist Physician',
    city: 'Lahore',
    specialty: 'Pediatrics & Child Care',
    address: 'Model Town Link Road Clinic, Lahore',
    panelType: 'Reimbursement Support (Demo)',
    phone: '(042) 351-000-404 (Demo)',
  },
  {
    id: 'el-5',
    name: 'Capital Diagnostic & Imaging Lab (Illustrative)',
    type: 'Diagnostic Centre',
    city: 'Islamabad',
    specialty: 'MRI, CT Scan & Pathology',
    address: 'Blue Area, Jinnah Avenue, Islamabad',
    panelType: 'Cashless & Reimbursement (Demo)',
    phone: '(051) 280-000-505 (Demo)',
  },
];

export const DEMO_COMPLAINTS: SupportComplaint[] = [
  {
    id: 'cmp-1',
    ticketNumber: 'GRV-PQF-2026-0194',
    category: 'Statement & Tax Certificate',
    subject: 'Annual Tax Rebate Contribution Certificate Request',
    submittedDate: '12 Nov 2026',
    status: 'Resolved (Demo)',
    summary: 'Digital annual contribution statement issued for FY 2025–26 review.',
  },
];

export const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'not-1',
    title: 'Upcoming Family Takaful Contribution',
    detail: 'PKR 15,000 for Family Protection & Savings Plan is due on 05 Dec 2026.',
    timestamp: '2 hours ago',
    entity: 'family',
    read: false,
  },
  {
    id: 'not-2',
    title: 'Elaaj Health Claim Under Assessment',
    detail: 'Claim CLM-PQF-2026-1042 medical records reviewed and moving toward final decision.',
    timestamp: 'Yesterday',
    entity: 'family',
    read: false,
  },
  {
    id: 'not-3',
    title: 'Quarterly NAV Valuation Updated',
    detail: 'Illustrative PIA fund valuation updated as of 24 Nov 2026.',
    timestamp: '24 Nov 2026',
    entity: 'family',
    read: true,
  },
];

export const SHARIAH_MODULES = [
  {
    id: 'what-is-takaful',
    title: 'What Is Takaful?',
    summary:
      'Takaful is an Islamic cooperative system of mutual protection grounded in solidarity, shared responsibility, and ethical investment—free from Riba (interest), Gharar (excessive uncertainty), and Maysir (gambling).',
    keyPoints: [
      'Participants contribute into a shared Waqf pool to help members facing defined losses.',
      'Risk is shared mutually among participants rather than transferred commercially for profit.',
      'Funds are invested strictly in Shariah-screened Islamic financial instruments.',
    ],
  },
  {
    id: 'waqf',
    title: 'Waqf (Endowment Pool)',
    summary:
      'Under the Pak-Qatar Family Takaful Waqf-Wakalah model, a dedicated Waqf Fund (Participant Takaful Fund) is established as a separate legal entity to provide mutual financial relief to participants.',
    keyPoints: [
      'Contributions earmarked as Tabarru enter the Waqf pool.',
      'Claims and defined Takaful benefits are paid out from the Waqf pool.',
      'Any net surplus after claims and reserves remains governed by Waqf rules.',
    ],
  },
  {
    id: 'tabarru',
    title: 'Tabarru (Voluntary Mutual Contribution)',
    summary:
      'Tabarru is the portion of a participant’s contribution donated sincerely into the Waqf risk pool to mutually assist any covered member who experiences an insured loss.',
    keyPoints: [
      'Removes prohibited Gharar because protection stems from cooperative donation rather than a sale of uncertain risk.',
      'Calibrated transparently according to age, coverage, and risk profile.',
    ],
  },
  {
    id: 'wakalah',
    title: 'Wakalah (Agency Management Fee)',
    summary:
      'The Takaful Operator acts as Wakeel (agent) on behalf of the Waqf and participants, managing underwriting, servicing, claims, and administration for a disclosed Wakalah fee.',
    keyPoints: [
      'Fees are explicitly disclosed upfront rather than hidden inside commercial risk spreads.',
      'Separates Operator shareholders’ fund from Participants’ Waqf and Investment accounts.',
    ],
  },
  {
    id: 'governance',
    title: 'Shariah Governance & Reviews',
    summary:
      'Pak-Qatar Family Takaful operations are overseen by an independent Shariah Supervisory Board and undergo periodic Shariah compliance audits across product structures and investments.',
    keyPoints: [
      'All product wordings, Waqf deeds, and investment universes require Shariah review.',
      'No religious rulings or approvals are fabricated in this demonstration interface; consult official published PQFTL Shariah certificates for formal documentation.',
    ],
  },
];

export const PQFS_VERIFIED_CONTACT = {
  companyGroup: 'Pak-Qatar Family Takaful Limited (PQFTL)',
  headOffice: 'Suite 102–105, Business Arcade, Block 6 PECHS, Shahrah-e-Faisal, Karachi',
  uan: '(021) 111-825-238 (111-TAKAFUL)',
  email: 'info@pakqatar.com.pk',
  website: 'www.pqftl.com.pk',
  groupWebsite: 'www.pakqatar.com.pk',
  whatsappInfo: 'Official PQFTL WhatsApp Self-Service (via verified helpline)',
};

export const DEMO_BRANCHES = [
  {
    city: 'Karachi',
    branch: 'Head Office — Shahrah-e-Faisal',
    address: 'Suite 102–105, Business Arcade, Block 6 PECHS, Karachi',
    hours: 'Mon–Fri · 9:00 AM – 5:30 PM',
  },
  {
    city: 'Lahore',
    branch: 'Lahore Regional Office (Illustrative Demo)',
    address: 'Main Boulevard, Gulberg III, Lahore',
    hours: 'Mon–Fri · 9:00 AM – 5:30 PM',
  },
  {
    city: 'Islamabad',
    branch: 'Islamabad Capital Branch (Illustrative Demo)',
    address: 'Jinnah Avenue, Blue Area, Islamabad',
    hours: 'Mon–Fri · 9:00 AM – 5:30 PM',
  },
];

export const DEMO_AGENTS = [
  {
    code: 'PQF-AGT-1042',
    name: 'Muhammad Usman Khan',
    region: 'Karachi South',
    entity: 'Pak-Qatar Family Takaful',
    status: 'Verified Active Consultant (Demo)',
  },
  {
    code: 'PQF-AGT-2088',
    name: 'Faisal Mehmood',
    region: 'Lahore Central',
    entity: 'Pak-Qatar Family Takaful',
    status: 'Verified Active Consultant (Demo)',
  },
];

export const EXISTING_VS_PROPOSED_SERVICES = [
  {
    service: 'My Account & Digital Account Opening',
    status: 'Existing PQFTL Web Service · Unified in Mobile Demo',
  },
  {
    service: 'Account Statement & Investment Details',
    status: 'Existing PQFTL Web Service · Interactive Fund View in App',
  },
  {
    service: 'Online Contribution Collection & Instant Withdrawal',
    status: 'Existing PQFTL Web Service · Guided 4-Step Flow in App',
  },
  {
    service: 'Elaaj Portal & Corporate Portal',
    status: 'Existing PQFTL Service · Digital Elaaj Card & Search in App',
  },
  {
    service: 'Claims, Grievances, Branch Directory & Agent Network',
    status: 'Existing PQFTL Service · Integrated Claims Timeline & Lookup',
  },
  {
    service: 'WhatsApp Self Service',
    status: 'Existing PQFTL Channel · Quick Launch from Support Centre',
  },
  {
    service: '360° Rotating Family Takaful Product Selector',
    status: 'Proposed Mobile App Signature Capability',
  },
  {
    service: 'Biometric Access & Interactive Shariah Centre',
    status: 'Proposed Mobile App Experience Capability',
  },
];
