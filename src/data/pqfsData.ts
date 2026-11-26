import {
  AppNotification,
  ContributionPayment,
  ElaajProvider,
  FamilyMember,
  FundHolding,
  SupportComplaint,
  TakafulCertificate,
  TakafulClaim,
  TakafulProduct,
} from '../types/pqfs';

export const DEMO_CUSTOMER = {
  customerId: 'PQF-849201',
  fullName: 'Ahmed Tariq',
  initials: 'AT',
  maskedCnic: '42101-•••••••-3',
  fullCnicDemo: '42101-5839201-3',
  mobile: '0300-8241905',
  email: 'ahmed.tariq@demo-pqfs.example',
  city: 'Karachi',
  elaajCardNumber: 'ELJ-PQF-2026-4418',
  elaajPlanName: 'Elaaj Family Healthcare (Illustrative Demo)',
};

export const TAKAFUL_PRODUCTS: TakafulProduct[] = [
  // FAMILY TAKAFUL (PQFTL)
  {
    id: 'ft-family-savings',
    entity: 'family',
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
    id: 'ft-retirement-wealth',
    entity: 'family',
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
    id: 'ft-health-elaaj',
    entity: 'family',
    companyName: 'Pak-Qatar Family Takaful Limited (PQFTL)',
    name: 'Individual & Family Elaaj Health',
    shortTagline: 'In-patient hospitalization and surgical protection for households.',
    mainBenefit: 'Access to Digital Elaaj Card and panel hospital care',
    iconKey: 'heart',
    overview:
      'Illustrative Family Health Takaful solution providing structured inpatient hospitalization limits, surgical support, and seamless digital Elaaj identification.',
    eligibility: [
      'Primary participant aged 18 to 60 years; eligible dependents per rules',
      'Health declaration required at onboarding',
    ],
    coverageInfo: [
      'Annual inpatient hospitalization & surgical benefit tiers (illustrative)',
      'Digital Elaaj health identification card & reimbursement pathway',
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
    companyName: 'Pak-Qatar Family Takaful Limited (PQFTL)',
    name: 'Corporate Group Family Takaful',
    shortTagline: 'Employer-sponsored Shariah protection for organizational teams.',
    mainBenefit: 'Unified group life & hospitalization coverage via Corporate Portal',
    iconKey: 'building',
    overview:
      'Illustrative group Takaful protection designed for employers wishing to extend ethical, Shariah-compliant family security and medical benefits to employees.',
    eligibility: [
      'Registered companies and institutions in Pakistan (minimum group size applies)',
      'Administered via PQFTL Corporate Portal',
    ],
    coverageInfo: [
      'Group term protection tied to employee grade or salary multiples',
      'Optional group health & accidental riders',
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
    documents: ['Corporate Takaful Inquiry Brief (Demo)'],
    isInvestmentLinked: false,
  },

  // GENERAL TAKAFUL (PQGTL)
  {
    id: 'gt-motor',
    entity: 'general',
    companyName: 'Pak-Qatar General Takaful Limited (PQGTL)',
    name: 'Motor Takaful (Comprehensive)',
    shortTagline: 'Shariah-compliant protection for private vehicles against theft and damage.',
    mainBenefit: 'Accidental damage, theft, and third-party liability protection',
    iconKey: 'car',
    overview:
      'Illustrative General Takaful motor cover protecting private vehicles against road accidents, theft, fire, and third-party claims through a mutual Waqf risk pool.',
    eligibility: [
      'Private cars registered in Pakistan with valid registration & owner CNIC',
      'Pre-inspection survey where required for vehicle valuation',
    ],
    coverageInfo: [
      'Accidental collision & own-damage protection (illustrative)',
      'Total loss and vehicle theft indemnity',
      'Third-party bodily injury & property damage liability',
    ],
    contributionInfo:
      'Illustrative annual rate calculated as a percentage of declared vehicle value (IDV).',
    illustrativeMinContributionPkr: 28000,
    illustrativeFrequency: 'Annual',
    keyConditions: [
      'Illustrative motor rates exclude government levies and trackers where mandated.',
      'Deductibles and depreciation scales apply per official PQGTL motor terms.',
    ],
    faqs: [
      {
        q: 'How do I initiate a motor claim?',
        a: 'Report the incident immediately through Claims Centre, upload vehicle photos and inspection details, and track surveyor assessment live.',
      },
    ],
    documents: [
      'Motor Takaful Coverage Summary (Demo)',
      'Motor Claim Inspection Checklist',
    ],
    isInvestmentLinked: false,
  },
  {
    id: 'gt-home-fire',
    entity: 'general',
    companyName: 'Pak-Qatar General Takaful Limited (PQGTL)',
    name: 'Home & Fire Property Takaful',
    shortTagline: 'Protect residential structures and household contents from fire and perils.',
    mainBenefit: 'Structure, contents, fire, lightning, and allied perils protection',
    iconKey: 'home',
    overview:
      'Illustrative property Takaful cover safeguarding residential homes and personal contents against fire, explosion, natural perils, and specified burglary risks.',
    eligibility: [
      'Homeowners or residential tenants in Pakistan',
      'Accurate declared replacement value of structure and/or contents',
    ],
    coverageInfo: [
      'Building structure protection against fire and allied perils',
      'Household contents and electrical appliance safeguards',
      'Alternative accommodation support clause (illustrative)',
    ],
    contributionInfo:
      'Illustrative annual contribution starting from PKR 8,500/year depending on sum covered.',
    illustrativeMinContributionPkr: 8500,
    illustrativeFrequency: 'Annual',
    keyConditions: [
      'Valuation based on reinstatement or market value as selected in the certificate.',
    ],
    faqs: [
      {
        q: 'Can tenants cover household contents without owning the building?',
        a: 'Yes, contents-only property Takaful can be structured separately from building structure cover.',
      },
    ],
    documents: ['Property & Fire Takaful Brief (Demo)'],
    isInvestmentLinked: false,
  },
  {
    id: 'gt-travel',
    entity: 'general',
    companyName: 'Pak-Qatar General Takaful Limited (PQGTL)',
    name: 'Travel & Umrah Takaful',
    shortTagline: 'Emergency medical, baggage, and trip-delay support for international journeys.',
    mainBenefit: 'Worldwide emergency medical and travel disruption coverage',
    iconKey: 'plane',
    overview:
      'Illustrative international travel and Umrah/Ziyarat Takaful providing emergency medical evacuation, hospitalization, baggage delay, and passport loss assistance.',
    eligibility: [
      'Pakistani travellers departing from Pakistan with valid passport and travel dates',
      'Single-trip and multi-trip illustrative options',
    ],
    coverageInfo: [
      'Overseas emergency medical & hospitalization expenses',
      'Checked baggage delay / loss & flight delay assistance',
      '24/7 international emergency assistance helpline',
    ],
    contributionInfo:
      'Illustrative trip contribution starting from PKR 3,500 per trip depending on destination and duration.',
    illustrativeMinContributionPkr: 3500,
    illustrativeFrequency: 'Per Trip / Annual Multi-Trip',
    keyConditions: [
      'Must be issued prior to departure from Pakistan.',
      'Limits vary by Schengen, Worldwide, or Regional/Umrah travel tier.',
    ],
    faqs: [
      {
        q: 'Do I receive an instant digital certificate for visa applications?',
        a: 'Once issued through verified onboarding, digital certificates can be downloaded directly from My Certificates.',
      },
    ],
    documents: ['Travel Tier Comparison Sheet (Demo)'],
    isInvestmentLinked: false,
  },
  {
    id: 'gt-healthcare-corp',
    entity: 'general',
    companyName: 'Pak-Qatar General Takaful Limited (PQGTL)',
    name: 'General Healthcare & Accident',
    shortTagline: 'Personal accident and outpatient/inpatient general medical protection.',
    mainBenefit: '24/7 worldwide accidental protection and medical support',
    iconKey: 'umbrella',
    overview:
      'Illustrative General Takaful personal accident and medical reimbursement cover offering financial relief following accidental injuries or unforeseen hospitalization.',
    eligibility: [
      'Individuals aged 18 to 65 years (illustrative)',
      'Occupation class declaration required',
    ],
    coverageInfo: [
      'Accidental medical expense reimbursement',
      'Permanent total or partial disability capital benefit',
      'Hospital daily cash allowance option',
    ],
    contributionInfo:
      'Illustrative annual contribution starting from PKR 4,000/year.',
    illustrativeMinContributionPkr: 4000,
    illustrativeFrequency: 'Annual',
    keyConditions: [
      'Pure risk-pool General Takaful certificate with no investment/savings component.',
    ],
    faqs: [
      {
        q: 'How is General Health/Accident different from Family Takaful savings?',
        a: 'General Takaful is pure annual risk protection under PQGTL without a long-term investment unit account.',
      },
    ],
    documents: ['Personal Accident Summary (Demo)'],
    isInvestmentLinked: false,
  },
  {
    id: 'gt-marine-sme',
    entity: 'general',
    companyName: 'Pak-Qatar General Takaful Limited (PQGTL)',
    name: 'Marine, Cargo & SME Takaful',
    shortTagline: 'Transit and commercial asset protection for businesses and traders.',
    mainBenefit: 'In-transit cargo, stock, and commercial premises safeguards',
    iconKey: 'briefcase',
    overview:
      'Illustrative commercial General Takaful helping SMEs, importers, and distributors protect goods in transit and commercial stock under Shariah-compliant terms.',
    eligibility: [
      'Registered sole proprietors, SMEs, and corporate entities',
      'Shipment invoice / commercial inventory valuation',
    ],
    coverageInfo: [
      'Inland transit and marine cargo perils coverage',
      'Warehouse stock & commercial fire protection',
    ],
    contributionInfo:
      'Illustrative rating based on cargo type, route, and declared shipment value.',
    illustrativeMinContributionPkr: 15000,
    illustrativeFrequency: 'Per Shipment / Annual Open Cover',
    keyConditions: [
      'Subject to Institute Cargo Clauses (Takaful adapted) and underwriting review.',
    ],
    faqs: [
      {
        q: 'Can SMEs manage multiple transit certificates?',
        a: 'Yes, corporate participants can request open marine policies or single-shipment certificates.',
      },
    ],
    documents: ['Marine & SME Coverage Overview (Demo)'],
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
    id: 'cert-gt-1',
    certificateNumber: 'PQGTL-MTR-2026-55219',
    entity: 'general',
    companyLabel: 'Pak-Qatar General Takaful Limited (PQGTL)',
    productId: 'gt-motor',
    productName: 'Motor Takaful (Comprehensive)',
    status: 'Active',
    issueDate: '01 Feb 2026',
    maturityOrRenewalDate: '31 Jan 2027',
    coveredBenefitPkr: 4200000,
    contributionAmountPkr: 79800,
    frequency: 'Annual',
    nextDueDate: '31 Jan 2027',
    tabarruAllocationNote: 'Pure PQGTL General Waqf risk-pool certificate (no savings unit account).',
    nomineeName: 'Ahmed Tariq (Owner)',
    coveredAssetOrPlan: 'Private Sedan · Reg. BXY-418 (Illustrative)',
  },
  {
    id: 'cert-gt-2',
    certificateNumber: 'PQGTL-TRV-2025-30811',
    entity: 'general',
    companyLabel: 'Pak-Qatar General Takaful Limited (PQGTL)',
    productId: 'gt-travel',
    productName: 'Travel & Umrah Takaful',
    status: 'Expired',
    issueDate: '04 Nov 2025',
    maturityOrRenewalDate: '25 Nov 2025',
    coveredBenefitPkr: 5000000,
    contributionAmountPkr: 6200,
    frequency: 'Annual',
    nextDueDate: 'Completed Trip',
    tabarruAllocationNote: 'Single-trip Umrah Takaful certificate (expired naturally after return).',
    nomineeName: 'Tariq Mahmood (Father)',
    coveredAssetOrPlan: '21-Day International Travel Cover',
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
    referenceNumber: 'TXN-PQG-4102938',
    certificateNumber: 'PQGTL-MTR-2026-55219',
    productName: 'Motor Takaful (Comprehensive)',
    entity: 'general',
    dueDate: '01 Feb 2026',
    paidDate: '29 Jan 2026',
    amountPkr: 79800,
    status: 'Settled',
    paymentMethod: 'Islamic Bank Card (Demo)',
    allocationBreakdown: {
      investmentPortionPkr: 0,
      tabarruWaqfPortionPkr: 59850,
      wakalahFeePkr: 19950,
    },
  },
];

export const DEMO_CLAIMS: TakafulClaim[] = [
  {
    id: 'clm-1',
    referenceNumber: 'CLM-PQG-2026-1042',
    certificateNumber: 'PQGTL-MTR-2026-55219',
    productName: 'Motor Takaful (Comprehensive)',
    entity: 'general',
    claimType: 'Minor Bumper & Headlamp Repair',
    incidentDate: '14 Nov 2026',
    submittedDate: '15 Nov 2026',
    estimatedAmountPkr: 48500,
    currentStage: 'Under Assessment',
    summary: 'Workshop repair estimate submitted after minor rear fender contact in Gulshan-e-Iqbal.',
    documents: ['Repair Estimate Invoice.pdf', 'Vehicle Photos (4).zip', 'Driving License Copy.pdf'],
    lastUpdatedNote: 'Surveyor inspection completed; repair authorization under final assessment (Demo).',
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
    certificateNumbers: ['PQFTL-FAM-2023-09412', 'PQFTL-EDU-2024-11804', 'PQGTL-MTR-2026-55219'],
    elaajCovered: true,
  },
  {
    id: 'fam-2',
    initials: 'BT',
    fullName: 'Bilal Tariq',
    relationship: 'Son',
    role: 'Beneficiary / Nominee',
    dateOfBirth: '09 Jan 2018',
    certificateNumbers: ['PQFTL-FAM-2023-09412', 'PQFTL-EDU-2024-11804'],
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
    certificateNumbers: ['PQFTL-FAM-2023-09412'],
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
    title: 'Motor Claim Under Assessment',
    detail: 'Claim CLM-PQG-2026-1042 surveyor report received and moving toward decision.',
    timestamp: 'Yesterday',
    entity: 'general',
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
      'Under the Pak-Qatar Waqf-Wakalah model, a dedicated Waqf Fund (Participant Takaful Fund) is established as a separate legal entity to provide mutual financial relief to participants.',
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
      'Pak-Qatar Takaful operations are overseen by an independent Shariah Supervisory Board and undergo periodic Shariah compliance audits across product structures and investments.',
    keyPoints: [
      'All product wordings, Waqf deeds, and investment universes require Shariah review.',
      'No religious rulings or approvals are fabricated in this demonstration interface; consult official published PQFTL/PQGTL Shariah certificates for formal documentation.',
    ],
  },
];

export const PQFS_VERIFIED_CONTACT = {
  companyGroup: 'Pak-Qatar Financial Services (PQFTL & PQGTL)',
  headOffice: 'Suite 102–105, Business Arcade, Block 6 PECHS, Shahrah-e-Faisal, Karachi',
  uan: '(021) 111-825-238 (111-TAKAFUL)',
  email: 'info@pakqatar.com.pk',
  website: 'www.pakqatar.com.pk',
  whatsappInfo: 'Official PQFS WhatsApp Self-Service (via verified PQFS helpline)',
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
    code: 'PQG-AGT-2088',
    name: 'Faisal Mehmood',
    region: 'Lahore Central',
    entity: 'Pak-Qatar General Takaful',
    status: 'Verified Active Consultant (Demo)',
  },
];

export const EXISTING_VS_PROPOSED_SERVICES = [
  {
    service: 'My Account & Digital Account Opening',
    status: 'Existing PQFS Web Service · Unified in Mobile Demo',
  },
  {
    service: 'Account Statement & Investment Details',
    status: 'Existing PQFS Web Service · Interactive Fund View in App',
  },
  {
    service: 'Online Contribution Collection & Instant Withdrawal',
    status: 'Existing PQFS Web Service · Guided 4-Step Flow in App',
  },
  {
    service: 'Elaaj Portal & Corporate Portal',
    status: 'Existing PQFS Service · Digital Elaaj Card & Search in App',
  },
  {
    service: 'Claims, Grievances, Branch Directory & Agent Network',
    status: 'Existing PQFS Service · Integrated Claims Timeline & Lookup',
  },
  {
    service: 'WhatsApp Self Service',
    status: 'Existing PQFS Channel · Quick Launch from Support Centre',
  },
  {
    service: '360° Rotating Takaful Product Selector',
    status: 'Proposed Mobile App Signature Capability',
  },
  {
    service: 'Biometric Access & Interactive Shariah Centre',
    status: 'Proposed Mobile App Experience Capability',
  },
];
