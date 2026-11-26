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
    | 'general-product'
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
    id: 'guide-company-overview',
    category: 'company',
    title: 'Pak-Qatar Financial Services (PQFS) Group Companies',
    sourceLabel: 'Official PQFS Corporate & Product Overview',
    keywords: [
      'pak-qatar',
      'pqfs',
      'pqftl',
      'pqgtl',
      'family',
      'general',
      'company',
      'group',
      'difference',
      'karachi',
      'پاک قطر',
      'خاندانی',
      'جنرل',
      'تکافل',
      'کمپنی',
    ],
    content: [
      'Pak-Qatar Financial Services (PQFS) operates two strictly separate Takaful companies:',
      '1. Pak-Qatar Family Takaful Limited (PQFTL): Long-term family protection, Child Education Takaful, Retirement & Wealth Accumulation, Individual & Family Elaaj Health, and Corporate Group Family Takaful. Family investment-linked plans separate Participant Risk (Waqf/Tabarru) and Participant Investment Account (PIA) units.',
      '2. Pak-Qatar General Takaful Limited (PQGTL): Pure annual or per-trip risk-pool protection including Motor Takaful (Comprehensive), Home & Fire Property Takaful, Travel & Umrah Takaful, General Healthcare & Accident, and Marine, Cargo & SME Takaful.',
      `Head Office: ${PQFS_VERIFIED_CONTACT.headOffice}. UAN: ${PQFS_VERIFIED_CONTACT.uan}. Email: ${PQFS_VERIFIED_CONTACT.email}. Website: ${PQFS_VERIFIED_CONTACT.website}.`,
    ].join('\n'),
    lastUpdated: KNOWLEDGE_BASE_LAST_UPDATED,
  },
  {
    id: 'guide-registration-login-biometrics',
    category: 'app-guide',
    title: 'Registration, Customer Login & Biometric Access Guide',
    sourceLabel: 'PQFS Mobile App Onboarding Guide',
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
      'How to register or sign in inside the PQFS app:',
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
    sourceLabel: 'PQFS Contribution & Payments Guide',
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
      'Steps to pay a due or scheduled Takaful contribution in the PQFS app:',
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
    sourceLabel: 'PQFS My Protection & Certificates Guide',
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
      'Steps to view your Takaful certificates and investment details:',
      '1. Sign in and open "My Certificates" from the Dashboard or open the "My Protection" tab.',
      '2. Filter between Family (PQFTL) and General (PQGTL) certificates.',
      '3. Tap any certificate to inspect covered benefit, contribution schedule, next due date, nominee/asset details, and download summary statements.',
      '4. Under "Investment & Funds" (PQFTL investment-linked plans), review illustrative unit holdings, NAV dates, and top-up options.',
    ].join('\n'),
    lastUpdated: KNOWLEDGE_BASE_LAST_UPDATED,
  },
  {
    id: 'guide-claims',
    category: 'app-guide',
    title: 'Submitting & Tracking a Takaful Claim',
    sourceLabel: 'PQFS Claims Centre Guide',
    keywords: [
      'claim',
      'submit claim',
      'track claim',
      'motor claim',
      'health claim',
      'elaaj claim',
      'reimbursement',
      'surveyor',
      'کلیم',
      'دعویٰ',
      'ٹریک',
    ],
    content: [
      'How to submit or track a claim in the PQFS app:',
      '• Track My Claim: Sign in and open the "Claims" tab (or tap "Claims" on your Dashboard) to see live claim stages: Submitted -> Documents Review -> Under Assessment -> Decision -> Completed.',
      '• Submit a New Claim: In the Claims tab, tap "Submit New Claim", choose your active Family (PQFTL) or General (PQGTL) certificate, describe the incident/hospitalization, attach supporting documents (such as repair invoices, photos, or discharge summaries & itemized bills), and submit for assessment.',
      `• Need assistance? Call UAN ${PQFS_VERIFIED_CONTACT.uan} or email ${PQFS_VERIFIED_CONTACT.email}.`,
    ].join('\n'),
    lastUpdated: KNOWLEDGE_BASE_LAST_UPDATED,
  },
  {
    id: 'guide-elaaj-calculator',
    category: 'app-guide',
    title: 'Digital Elaaj Card, Panel Hospitals & Contribution Calculator',
    sourceLabel: 'PQFS Self-Service Tools Guide',
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
      '• Contribution Calculator: Open the "Calculator" tab from Guest Home or bottom navigation to select any Family (PQFTL) or General (PQGTL) plan, adjust contribution amount and term, and preview illustrative non-guaranteed demonstration figures. Calculator estimates are illustrative only; final terms require formal underwriting.',
      `Illustrative Panel Facilities in App: ${DEMO_ELAAJ_PROVIDERS.map((p) => `${p.name} (${p.city})`).join('; ')}.`,
    ].join('\n'),
    lastUpdated: KNOWLEDGE_BASE_LAST_UPDATED,
  },
  {
    id: 'guide-branches-support',
    category: 'support',
    title: 'Official Contact Channels, Branches & Services',
    sourceLabel: 'PQFS Official Contact & Branch Directory',
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
      `Email: ${PQFS_VERIFIED_CONTACT.email} | Website: ${PQFS_VERIFIED_CONTACT.website}`,
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
  category: p.entity === 'family' ? 'family-product' : 'general-product',
  title: `${p.name} (${p.entity === 'family' ? 'PQFTL' : 'PQGTL'})`,
  sourceLabel: `${p.companyName} Product Specification`,
  keywords: [
    p.name.toLowerCase(),
    p.entity === 'family' ? 'family' : 'general',
    p.entity === 'family' ? 'pqftl' : 'pqgtl',
    p.id,
    ...p.shortTagline.toLowerCase().split(/\W+/),
    ...p.mainBenefit.toLowerCase().split(/\W+/),
    ...(p.entity === 'family' ? ['خاندانی', 'بچت', 'تعلیم', 'ریٹائرمنٹ', 'علاج'] : ['جنرل', 'موٹر', 'گاڑی', 'گھر', 'سفر', 'عمرہ']),
  ],
  content: [
    `Plan: ${p.name} | Company: ${p.companyName}`,
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
  sourceLabel: 'PQFS Shariah Transparency Centre',
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
  ['تکافل', ['takaful', 'waqf', 'tabarru', 'wakalah', 'pak-qatar']],
  ['خاندانی', ['family', 'pqftl', 'savings', 'education', 'retirement']],
  ['فیملی', ['family', 'pqftl']],
  ['جنرل', ['general', 'pqgtl', 'motor', 'home', 'travel']],
  ['موٹر', ['motor', 'vehicle', 'car', 'pqgtl']],
  ['گاڑی', ['motor', 'car', 'pqgtl']],
  ['سفر', ['travel', 'umrah', 'pqgtl']],
  ['عمرہ', ['travel', 'umrah', 'pqgtl']],
  ['گھر', ['home', 'fire', 'property', 'pqgtl']],
  ['تعلیم', ['child', 'education', 'pqftl']],
  ['ریٹائرمنٹ', ['retirement', 'wealth', 'pqftl']],
  ['صحت', ['elaaj', 'health', 'hospital', 'medical']],
  ['علاج', ['elaaj', 'health', 'hospital']],
  ['کلیم', ['claim', 'track', 'submit', 'surveyor']],
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

  // Always include core corporate overview so PQFTL/PQGTL boundary is clear
  const scored = KNOWLEDGE_BASE_DOCS.map((doc) => {
    let score = doc.id === 'guide-company-overview' ? 2 : 0;
    const haystack = `${doc.title} ${doc.content} ${doc.keywords.join(' ')}`.toLowerCase();

    for (const token of expandedTokens) {
      if (doc.title.toLowerCase().includes(token)) score += 5;
      if (doc.keywords.some((k) => k.includes(token) || token.includes(k))) score += 4;
      if (haystack.includes(token)) score += 1.5;
    }

    // Specific intent boosts
    if (
      (normalized.includes('family') || query.includes('خاندانی')) &&
      doc.category === 'family-product'
    ) {
      score += 4;
    }
    if (
      (normalized.includes('general') || query.includes('جنرل')) &&
      doc.category === 'general-product'
    ) {
      score += 4;
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
