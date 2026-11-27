import {
  DEMO_AGENTS,
  DEMO_BRANCHES,
  DEMO_ELAAJ_PROVIDERS,
  EXISTING_VS_PROPOSED_SERVICES,
  PQFS_VERIFIED_CONTACT,
  SHARIAH_MODULES,
  TAKAFUL_PRODUCTS,
} from '../src/data/pqfsData.ts';

export const KNOWLEDGE_BASE_VERSION = '2026-11-26';
export const KNOWLEDGE_BASE_LAST_UPDATED = '26 Nov 2026';

export interface KnowledgeDoc {
  id: string;
  category:
    | 'company'
    | 'family-product'
    | 'shariah'
    | 'app-guide'
    | 'support'
    | 'security';
  title: string;
  sourceLabel: string;
  keywords: string[];
  content: string;
  lastUpdated: string;
}

const APP_AND_CORPORATE_GUIDES: KnowledgeDoc[] = [
  {
    id: 'guide-pqftl-overview',
    category: 'company',
    title: 'Pak-Qatar Family Takaful Limited (PQFTL) Overview',
    sourceLabel: 'Official PQFTL Corporate & Product Overview',
    keywords: [
      'pak-qatar',
      'pqftl',
      'family',
      'takaful',
      'company',
      'savings',
      'education',
      'retirement',
      'elaaj',
      'vps',
      'kafalat',
      'mahana',
      'karachi',
      'پاک قطر',
      'خاندانی',
      'فیملی',
      'تکافل',
      'کمپنی',
    ],
    content: [
      'This application is dedicated exclusively to Pak-Qatar Family Takaful Limited (PQFTL).',
      'PQFTL provides Shariah-compliant long-term family protection, savings & wealth accumulation, Child Education Takaful, Mahana Bachat & Flexi savings, Lifetime Kafalat, Voluntary Pension Scheme (VPS), Individual & Family Elaaj Health, and Corporate Group Family & Group Health Takaful.',
      'PQFTL unit-linked Family Takaful plans clearly separate Participant Risk (Waqf/Tabarru pool) and Participant Investment Account (PIA) units under Shariah Supervisory Board oversight.',
      `Head Office: ${PQFS_VERIFIED_CONTACT.headOffice}. UAN: ${PQFS_VERIFIED_CONTACT.uan}. Email: ${PQFS_VERIFIED_CONTACT.email}. PQFTL Website: ${PQFS_VERIFIED_CONTACT.website}.`,
    ].join('\n'),
    lastUpdated: KNOWLEDGE_BASE_LAST_UPDATED,
  },
  {
    id: 'guide-general-takaful-referral',
    category: 'support',
    title: 'General Takaful Inquiries (Out-of-Scope Guidance)',
    sourceLabel: 'Official Pak-Qatar Channel Referral Guide',
    keywords: [
      'general-referral',
      'out-of-scope',
      'general',
      'motor',
      'car',
      'vehicle',
      'travel',
      'umrah',
      'home',
      'fire',
      'property',
      'marine',
      'cargo',
      'pqgtl',
      'جنرل',
      'موٹر',
      'گاڑی',
      'سفر',
      'عمرہ',
      'گھر',
    ],
    content: [
      'This mobile application is dedicated exclusively to Pak-Qatar Family Takaful Limited (PQFTL) products and customer services.',
      'General Takaful plans (such as Motor, Travel, Home/Fire, or Marine coverage) are NOT offered or serviced inside this PQFTL app.',
      `For General Takaful inquiries or assistance, please contact Pak-Qatar official channels directly: UAN ${PQFS_VERIFIED_CONTACT.uan}, email ${PQFS_VERIFIED_CONTACT.email}, or visit ${PQFS_VERIFIED_CONTACT.groupWebsite}.`,
    ].join('\n'),
    lastUpdated: KNOWLEDGE_BASE_LAST_UPDATED,
  },
  {
    id: 'guide-registration-login-biometrics',
    category: 'app-guide',
    title: 'Registration, Customer Login & Biometric Access Guide',
    sourceLabel: 'PQFTL Mobile App Onboarding Guide',
    keywords: [
      'register',
      'registration',
      'signup',
      'login',
      'sign in',
      'biometric',
      'face id',
      'fingerprint',
      'cnic',
      'otp',
      'password',
      'account',
      'لاگ ان',
      'رجسٹریشن',
      'بایومیٹرک',
      'اکاؤنٹ',
    ],
    content: [
      'How to register or sign in inside the PQFTL app:',
      '• New Customer Registration: Tap "New Customer? Register" from Welcome or Login, enter your CNIC number, registered mobile number, and create a secure password, then verify OTP in the guided flow.',
      '• Customer Login: Tap "Customer Login", enter your Mobile Number or Customer ID and password, or tap Face ID / Fingerprint if enabled.',
      '• Enable Biometric Login: After registration (or via More > Biometric & Security), enable Face ID and/or Fingerprint for quick subsequent access.',
      '• Security Reminder: Never share your password, PIN, or OTP with anyone, including inside chat.',
    ].join('\n'),
    lastUpdated: KNOWLEDGE_BASE_LAST_UPDATED,
  },
  {
    id: 'guide-payments',
    category: 'app-guide',
    title: 'How to Make a Contribution Payment',
    sourceLabel: 'PQFTL Contribution & Payments Guide',
    keywords: [
      'pay',
      'payment',
      'contribution',
      'due',
      'raast',
      'ibft',
      '1link',
      'card',
      'receipt',
      'ادائیگی',
      'قسط',
      'رسید',
    ],
    content: [
      'Steps to pay a due or scheduled Family Takaful contribution in the PQFTL app:',
      '1. Sign in via Customer Login.',
      '2. Open the Payments tab (or tap Contributions / Payments from My Takaful Dashboard).',
      '3. Select the due contribution and tap "Pay Contribution".',
      '4. Review the transparent allocation breakdown (Participant Investment Account, Tabarru/Waqf pool, and Wakalah fee).',
      '5. Choose your payment channel (such as Raast / IBFT, 1Link Bill Payment, or Islamic Bank Card in the app flow) and confirm to view/download your receipt.',
    ].join('\n'),
    lastUpdated: KNOWLEDGE_BASE_LAST_UPDATED,
  },
  {
    id: 'guide-certificates',
    category: 'app-guide',
    title: 'Viewing Certificates, Statements & Fund Holdings',
    sourceLabel: 'PQFTL My Protection & Certificates Guide',
    keywords: [
      'certificate',
      'policy',
      'document',
      'statement',
      'fund',
      'nav',
      'pia',
      'investment',
      'maturity',
      'سرٹیفکیٹ',
      'پالیسی',
      'اسٹیٹمنٹ',
      'فنڈ',
    ],
    content: [
      'Steps to view your PQFTL Family Takaful certificates and investment details:',
      '1. Sign in and open "My Certificates" from the Dashboard or open the "My Protection" tab.',
      '2. Filter your PQFTL certificates by category (All Plans, Savings & Retirement, or Health & Group).',
      '3. Tap any certificate to inspect covered benefit, contribution schedule, next due date, beneficiary/nominee details, and download summary statements.',
      '4. Under "Investment & Funds" (PQFTL investment-linked plans), review illustrative unit holdings, NAV dates, and top-up options.',
    ].join('\n'),
    lastUpdated: KNOWLEDGE_BASE_LAST_UPDATED,
  },
  {
    id: 'guide-claims',
    category: 'app-guide',
    title: 'Submitting & Tracking a Family Takaful Claim',
    sourceLabel: 'PQFTL Claims Centre Guide',
    keywords: [
      'claim',
      'submit claim',
      'track claim',
      'health claim',
      'elaaj claim',
      'hospital',
      'reimbursement',
      'maturity',
      'death',
      'کلیم',
      'دعویٰ',
      'ٹریک',
    ],
    content: [
      'How to submit or track a PQFTL Family Takaful or Elaaj Health claim in the app:',
      '• Track My Claim: Sign in and open the "Claims" tab (or tap "Claims" on your Dashboard) to see live claim stages: Submitted -> Documents Review -> Under Assessment -> Decision -> Completed.',
      '• Submit a New Claim: In the Claims tab, tap "Submit New Claim", choose your active PQFTL certificate, select the claim type (Elaaj Hospitalization / Reimbursement, Critical Illness / Surgical Care, Family Death Benefit, or Maturity / Partial Withdrawal), attach supporting documents (such as discharge summaries, itemized hospital bills, CNIC copy, or doctor reports), and submit for assessment.',
      `• Need assistance? Call UAN ${PQFS_VERIFIED_CONTACT.uan} or email ${PQFS_VERIFIED_CONTACT.email}.`,
    ].join('\n'),
    lastUpdated: KNOWLEDGE_BASE_LAST_UPDATED,
  },
  {
    id: 'guide-elaaj-calculator',
    category: 'app-guide',
    title: 'Digital Elaaj Card, Panel Hospitals & Contribution Calculator',
    sourceLabel: 'PQFTL Self-Service Tools Guide',
    keywords: [
      'elaaj',
      'hospital',
      'panel',
      'health card',
      'medical',
      'calculator',
      'estimate',
      'علاج',
      'ہسپتال',
      'کیلکولیٹر',
      'تخمینہ',
    ],
    content: [
      '• Digital Elaaj Health & Panel Lookup: Signed-in customers can open "My Family" -> switch to "Elaaj Health" to view their Digital Elaaj Card and search panel hospitals, specialists, and diagnostic centres by city (such as Karachi, Lahore, Islamabad).',
      '• Contribution Calculator: Open the "Calculator" tab from Guest Home or bottom navigation to select any PQFTL plan (Savings & Retirement or Health & Group), adjust contribution amount and term, and preview illustrative non-guaranteed demonstration figures. Calculator estimates are illustrative only; final terms require formal underwriting.',
      `Illustrative Panel Facilities in App: ${DEMO_ELAAJ_PROVIDERS.map((p) => `${p.name} (${p.city})`).join('; ')}.`,
    ].join('\n'),
    lastUpdated: KNOWLEDGE_BASE_LAST_UPDATED,
  },
  {
    id: 'guide-branches-support',
    category: 'support',
    title: 'Official PQFTL Contact Channels, Branches & Services',
    sourceLabel: 'PQFTL Official Contact & Branch Directory',
    keywords: [
      'contact',
      'helpline',
      'uan',
      'phone',
      'email',
      'whatsapp',
      'branch',
      'office',
      'complaint',
      'support',
      'agent',
      'رابطہ',
      'ہیلپ لائن',
      'برانچ',
      'شکایت',
      'مدد',
    ],
    content: [
      `Official Helpline (UAN): ${PQFS_VERIFIED_CONTACT.uan}`,
      `Email: ${PQFS_VERIFIED_CONTACT.email} | PQFTL Portal: ${PQFS_VERIFIED_CONTACT.website} | Group Website: ${PQFS_VERIFIED_CONTACT.groupWebsite}`,
      `WhatsApp Channel: ${PQFS_VERIFIED_CONTACT.whatsappInfo}`,
      `Branches: ${DEMO_BRANCHES.map((b) => `${b.city} - ${b.branch} (${b.address}, ${b.hours})`).join(' | ')}`,
      `Consultant Verification Examples: ${DEMO_AGENTS.map((a) => `${a.name} (${a.code}, ${a.entity})`).join(' | ')}`,
      `Digital Services: ${EXISTING_VS_PROPOSED_SERVICES.map((s) => s.service).join(', ')}.`,
    ].join('\n'),
    lastUpdated: KNOWLEDGE_BASE_LAST_UPDATED,
  },
];

const PRODUCT_DOCS: KnowledgeDoc[] = TAKAFUL_PRODUCTS.map((p) => ({
  id: `product-${p.id}`,
  category: 'family-product',
  title: `${p.name} (PQFTL)`,
  sourceLabel: `${p.companyName} Product Specification`,
  keywords: [
    p.name.toLowerCase(),
    'family',
    'pqftl',
    p.category,
    p.id,
    ...p.shortTagline.toLowerCase().split(/\W+/),
    ...p.mainBenefit.toLowerCase().split(/\W+/),
    'خاندانی',
    'بچت',
    'تعلیم',
    'ریٹائرمنٹ',
    'علاج',
    'پنشن',
  ],
  content: [
    `Plan: ${p.name} | Company: ${p.companyName} | Category: ${p.category === 'savings-retirement' ? 'Savings & Retirement' : 'Health & Group'}`,
    `Summary: ${p.overview}`,
    `Primary Benefit: ${p.mainBenefit}`,
    `Eligibility: ${p.eligibility.join('; ')}`,
    `Coverage Highlights: ${p.coverageInfo.join('; ')}`,
    `Contribution Basis: ${p.contributionInfo} (Illustrative minimum: PKR ${p.illustrativeMinContributionPkr.toLocaleString()}, Frequency: ${p.illustrativeFrequency})`,
    `Key Terms & Exclusions Note: ${p.keyConditions.join('; ')}`,
    `Required Documents Overview: ${p.documents.join('; ')}`,
    `FAQs: ${p.faqs.map((f) => `Q: ${f.q} A: ${f.a}`).join(' | ')}`,
  ].join('\n'),
  lastUpdated: KNOWLEDGE_BASE_LAST_UPDATED,
}));

const SHARIAH_DOCS: KnowledgeDoc[] = SHARIAH_MODULES.map((m) => ({
  id: `shariah-${m.id}`,
  category: 'shariah',
  title: m.title,
  sourceLabel: 'PQFTL Shariah Transparency Centre',
  keywords: [
    'shariah',
    'islamic',
    'halal',
    'riba',
    'gharar',
    'maysir',
    'waqf',
    'tabarru',
    'wakalah',
    'takaful',
    'شریعت',
    'شرعی',
    'تکافل',
    'وقف',
    'تبرع',
    'وکالہ',
    'حلال',
  ],
  content: [
    `Topic: ${m.title}`,
    `Explanation: ${m.summary}`,
    `Key Principles: ${m.keyPoints.join(' ')}`,
  ].join('\n'),
  lastUpdated: KNOWLEDGE_BASE_LAST_UPDATED,
}));

export const KNOWLEDGE_BASE_DOCS: KnowledgeDoc[] = [
  ...APP_AND_CORPORATE_GUIDES,
  ...PRODUCT_DOCS,
  ...SHARIAH_DOCS,
];

const URDU_TO_ENGLISH_HINTS: Array<[string, string[]]> = [
  ['تکافل', ['takaful', 'waqf', 'tabarru', 'wakalah', 'pak-qatar', 'pqftl']],
  ['خاندانی', ['family', 'pqftl', 'savings', 'education', 'retirement']],
  ['فیملی', ['family', 'pqftl']],
  ['جنرل', ['general-referral', 'out-of-scope', 'general', 'pak-qatar']],
  ['موٹر', ['general-referral', 'out-of-scope', 'motor']],
  ['گاڑی', ['general-referral', 'out-of-scope', 'car']],
  ['سفر', ['general-referral', 'out-of-scope', 'travel']],
  ['عمرہ', ['general-referral', 'out-of-scope', 'umrah']],
  ['گھر', ['general-referral', 'out-of-scope', 'home']],
  ['تعلیم', ['child', 'education', 'pqftl']],
  ['بچت', ['savings', 'mahana', 'bachat', 'pqftl']],
  ['پنشن', ['vps', 'pension', 'retirement', 'pqftl']],
  ['ریٹائرمنٹ', ['retirement', 'wealth', 'vps', 'pqftl']],
  ['صحت', ['elaaj', 'health', 'hospital', 'medical']],
  ['علاج', ['elaaj', 'health', 'hospital']],
  ['کلیم', ['claim', 'track', 'submit', 'hospital']],
  ['ادائیگی', ['payment', 'contribution', 'raast', '1link']],
  ['قسط', ['payment', 'contribution']],
  ['سرٹیفکیٹ', ['certificate', 'policy', 'statement']],
  ['پالیسی', ['certificate', 'policy']],
  ['شرعی', ['shariah', 'waqf', 'tabarru', 'wakalah']],
  ['شریعت', ['shariah', 'waqf', 'tabarru', 'wakalah']],
  ['وقف', ['waqf', 'tabarru', 'shariah']],
  ['لاگ ان', ['login', 'biometric', 'account']],
  ['رجسٹریشن', ['register', 'registration', 'cnic']],
  ['رابطہ', ['contact', 'uan', 'email', 'branch', 'support']],
  ['مدد', ['support', 'contact', 'uan', 'guide']],
];

const OUT_OF_SCOPE_GENERAL_REGEX =
  /\b(general takaful|pqgtl|motor|car insurance|vehicle|auto takaful|travel|umrah|home|fire|marine|cargo)\b/i;

export function retrieveRelevantKnowledge(query: string, maxDocs = 6): KnowledgeDoc[] {
  const normalized = query.toLowerCase();
  const expandedTokens = new Set(
    normalized
      .split(/[\s,?.!؛،؟:;()]+/)
      .map((t) => t.trim())
      .filter((t) => t.length >= 2)
  );

  for (const [urTerm, enHints] of URDU_TO_ENGLISH_HINTS) {
    if (query.includes(urTerm)) {
      for (const hint of enHints) expandedTokens.add(hint);
    }
  }

  const isOutOfScopeGeneralQuery =
    OUT_OF_SCOPE_GENERAL_REGEX.test(normalized) ||
    ['جنرل', 'موٹر', 'گاڑی', 'سفر', 'عمرہ', 'گھر'].some((t) => query.includes(t));

  // Always include core PQFTL overview so scope is crystal clear
  const scored = KNOWLEDGE_BASE_DOCS.map((doc) => {
    let score = doc.id === 'guide-pqftl-overview' ? 2 : 0;
    const haystack = `${doc.title} ${doc.content} ${doc.keywords.join(' ')}`.toLowerCase();

    for (const token of expandedTokens) {
      if (doc.title.toLowerCase().includes(token)) score += 5;
      if (doc.keywords.some((k) => k.includes(token) || token.includes(k))) score += 4;
      if (haystack.includes(token)) score += 1.5;
    }

    if (
      (normalized.includes('family') || query.includes('خاندانی') || query.includes('فیملی')) &&
      doc.category === 'family-product'
    ) {
      score += 4;
    }
    if (isOutOfScopeGeneralQuery && doc.id === 'guide-general-takaful-referral') {
      score += 18;
    }
    if (
      (normalized.includes('takaful') || normalized.includes('shariah') || query.includes('تکافل')) &&
      doc.category === 'shariah'
    ) {
      score += 4;
    }

    return { doc, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxDocs).map((item) => item.doc);
}
