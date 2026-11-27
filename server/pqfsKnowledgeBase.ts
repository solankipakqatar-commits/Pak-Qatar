import {
  DEMO_AGENTS,
  DEMO_BRANCHES,
  DEMO_ELAAJ_PROVIDERS,
  EXISTING_VS_PROPOSED_SERVICES,
  PQFS_VERIFIED_CONTACT,
  SHARIAH_MODULES,
  TAKAFUL_PRODUCTS,
} from '../src/data/pqfsData.ts';

export const KNOWLEDGE_BASE_VERSION = '2026-11-27';
export const KNOWLEDGE_BASE_LAST_UPDATED = '27 Nov 2026';

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
      'PQFTL provides Shariah-compliant long-term family protection, savings & wealth accumulation (Family Protection & Savings Plan, Mahana Bachat & Takaful Flexi Plan), Child Education Takaful Plan, Retirement & Wealth Accumulation, Lifetime Kafalat Plan, Voluntary Pension Scheme (VPS), Individual & Family Elaaj Health, and Corporate Group Family & Group Health Takaful.',
      'PQFTL unit-linked Family Takaful plans clearly separate Participant Risk (Waqf/Tabarru pool) and Participant Investment Account (PIA) units under independent Shariah Supervisory Board oversight.',
      `Head Office: ${PQFS_VERIFIED_CONTACT.headOffice}. UAN: ${PQFS_VERIFIED_CONTACT.uan}. Email: ${PQFS_VERIFIED_CONTACT.email}. PQFTL Website: ${PQFS_VERIFIED_CONTACT.website}.`,
    ].join('\n'),
    lastUpdated: KNOWLEDGE_BASE_LAST_UPDATED,
  },
  {
    id: 'guide-application-documents',
    category: 'app-guide',
    title: 'Family Takaful Application Steps, Eligibility & Required Documents',
    sourceLabel: 'PQFTL Onboarding & Underwriting Guide',
    keywords: [
      'apply',
      'application',
      'start',
      'eligibility',
      'eligible',
      'age',
      'document',
      'documents',
      'required',
      'cnic',
      'nicop',
      'b-form',
      'kyc',
      'underwriting',
      'pmd',
      'درخواست',
      'اپلائی',
      'اہلیت',
      'عمر',
      'دستاویزات',
      'کاغذات',
      'شناختی کارڈ',
      'ب فارم',
    ],
    content: [
      'How to start a Family Takaful application in the PQFTL app (4-Step Guided Flow):',
      '• Step 1 (Select Plan): Choose any PQFTL plan (Savings & Retirement or Health & Group) via Guest Exploration or the 360° Product Dial.',
      '• Step 2 (Configure Contribution & Term): Select payment frequency (Monthly, Quarterly, or Annual), contribution amount (meeting illustrative plan minimums), and coverage term.',
      '• Step 3 (Applicant Info): Enter full name, city, contact number, and beneficiary/goal details for the illustrative proposal summary.',
      '• Step 4 (Review & Submit): Review the illustrative summary and submit your request or hand off to Customer Registration (with CNIC & OTP verification) for formal underwriting.',
      'General Eligibility & Required Documents Overview:',
      '• Individual Savings, Retirement & Elaaj Health Plans: Adult Pakistani residents typically aged 18–60 years (20–55 for Child Education parent/guardian, 22–58 for Retirement & Wealth); valid CNIC / NICOP; active Pakistani mobile number for OTP & KYC verification.',
      '• Child Education Takaful Plan: Child aged 0–14 years at commencement; guardian CNIC plus child birth registration certificate / NADRA B-Form during formal application.',
      '• Individual & Family Elaaj Health: Health declaration at onboarding and dependent relationship details.',
      '• Corporate Group Plans: Registered Pakistan organization/employer, minimum group size rules, and employee & dependent HR census.',
      '• Official Terms: All online figures are illustrative; final acceptance and exact documentation follow formal underwriting and the issued Participant Membership Document (PMD).',
    ].join('\n'),
    lastUpdated: KNOWLEDGE_BASE_LAST_UPDATED,
  },
  {
    id: 'guide-faqs-guest',
    category: 'app-guide',
    title: 'Frequently Asked Questions (FAQs) — Guest Exploration & Plans',
    sourceLabel: 'PQFTL Verified Customer FAQs',
    keywords: [
      'faq',
      'faqs',
      'question',
      'questions',
      'waiver',
      'top-up',
      'topup',
      'switch',
      'switching',
      'guest',
      'illustrative',
      'quote',
      'سوال',
      'سوالات',
      'ٹاپ اپ',
      'فنڈ',
    ],
    content: [
      'Verified PQFTL Frequently Asked Questions:',
      '• Can I explore before registering? Yes—Guest Exploration lets customers browse the 360° Product Dial, compare any two PQFTL plans side by side, estimate illustrative contributions, and preview the 4-step application journey before signing up.',
      '• Child Education Waiver of Contribution: Where Waiver of Contribution coverage applies, the Waqf pool continues funding scheduled plan contributions if an unforeseen event occurs to the parent/guardian.',
      '• Fund Switching & Top-Ups: Eligible unit-linked savings and retirement plans allow ad-hoc top-up contributions and switching between Conservative, Balanced, and Growth Shariah funds as goals evolve.',
      '• Are Calculator Figures Final Quotes? No—amounts and growth curves in Guest Exploration and the Contribution Calculator are non-guaranteed illustrative demonstrations only; official quotes follow formal underwriting and PMD issuance.',
    ].join('\n'),
    lastUpdated: KNOWLEDGE_BASE_LAST_UPDATED,
  },
  {
    id: 'guide-compare-calculator',
    category: 'app-guide',
    title: 'Comparing PQFTL Plans & Contribution Calculator Guide',
    sourceLabel: 'PQFTL Plan Comparison & Calculator Guide',
    keywords: [
      'compare',
      'comparison',
      'difference',
      'versus',
      'vs',
      'calculator',
      'calculate',
      'estimate',
      'minimum',
      'contribution',
      'premium',
      'pkr',
      'موازنہ',
      'فرق',
      'کیلکولیٹر',
      'تخمینہ',
      'کم از کم',
    ],
    content: [
      'PQFTL Plan Comparison & Illustrative Minimum Contributions:',
      '• Unit-Linked Savings & Retirement Plans (separate Tabarru risk pool + Participant Investment Account):',
      '  - Mahana Bachat & Takaful Flexi Plan: Illustrative minimum PKR 3,500/month (Monthly/Quarterly/Annual).',
      '  - Child Education Takaful Plan: Illustrative minimum PKR 4,500/month across 10–20 year terms.',
      '  - Family Protection & Savings Plan: Illustrative minimum PKR 5,000/month.',
      '  - Voluntary Pension Scheme (VPS): Illustrative minimum PKR 5,000/month across Shariah pension sub-funds.',
      '  - Retirement & Wealth Accumulation: Illustrative minimum PKR 7,500/month (min. 10-year term).',
      '  - Lifetime Kafalat Plan: Illustrative minimum PKR 10,000/month for post-retirement income planning.',
      '• Pure Waqf Health & Corporate Group Plans:',
      '  - Individual & Family Elaaj Health: Illustrative minimum PKR 18,000/year per covered member.',
      '  - Corporate Group Health Takaful (illustrative base PKR 20,000 annual corporate schedule) & Corporate Group Family Takaful (illustrative base PKR 25,000 annual corporate schedule), customized by HR census.',
      'Note: Calculator projections are non-guaranteed demonstrations; official illustrations depend on age, term, underwriting, and PMD terms.',
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
      '5. Choose your payment channel (Raast / IBFT, 1Link Bill Payment, or Islamic Bank Card in the app flow) and confirm to view/download your receipt.',
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
      '• Submit a New Claim: In the Claims tab, tap "Submit New Claim", choose your active PQFTL certificate, select the claim type (Elaaj Hospitalization / Reimbursement, Critical Illness / Surgical Care, Family Death Benefit, or Maturity / Partial Withdrawal), attach supporting documents (discharge summaries, itemized hospital bills, lab/diagnostic reports, CNIC copy), and submit for assessment.',
      `• Need assistance? Call UAN ${PQFS_VERIFIED_CONTACT.uan} or email ${PQFS_VERIFIED_CONTACT.email}.`,
    ].join('\n'),
    lastUpdated: KNOWLEDGE_BASE_LAST_UPDATED,
  },
  {
    id: 'guide-elaaj-calculator',
    category: 'app-guide',
    title: 'Digital Elaaj Card & Panel Hospital Directory',
    sourceLabel: 'PQFTL Elaaj Health Self-Service Guide',
    keywords: [
      'elaaj',
      'hospital',
      'panel',
      'health card',
      'medical',
      'علاج',
      'ہسپتال',
      'پینل',
    ],
    content: [
      '• Digital Elaaj Health & Panel Lookup: Signed-in customers can open "My Family" -> switch to "Elaaj Health" to view their Digital Elaaj Card and search panel hospitals, specialists, and diagnostic centres by city (Karachi, Lahore, Islamabad).',
      '• Cashless vs. Reimbursement: Present your Digital Elaaj Card at participating panel hospitals for eligible admission support, or submit itemized hospital bills and discharge summaries in the Claims Centre for reimbursement review.',
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
      'consultant',
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
    `Eligibility Criteria: ${p.eligibility.join('; ')}`,
    `Coverage Highlights: ${p.coverageInfo.join('; ')}`,
    `Contribution Basis: ${p.contributionInfo} (Illustrative minimum: PKR ${p.illustrativeMinContributionPkr.toLocaleString()}, Frequency: ${p.illustrativeFrequency})`,
    `Key Terms & Exclusions Note: ${p.keyConditions.join('; ')}`,
    `Required Documents & Reference Guides: ${p.documents.join('; ')}`,
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
  ['درخواست', ['apply', 'application', 'eligibility', 'documents']],
  ['اپلائی', ['apply', 'application', 'eligibility', 'documents']],
  ['اہلیت', ['eligibility', 'age', 'documents']],
  ['دستاویزات', ['documents', 'cnic', 'b-form', 'application']],
  ['کاغذات', ['documents', 'cnic', 'b-form', 'application']],
  ['شناختی کارڈ', ['cnic', 'documents', 'eligibility', 'register']],
  ['موازنہ', ['compare', 'comparison', 'calculator']],
  ['کیلکولیٹر', ['calculator', 'estimate', 'contribution']],
  ['سوالات', ['faq', 'faqs', 'questions']],
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

  const asksApplicationOrDocs =
    /\b(apply|application|eligibility|eligible|document|documents|cnic|b-form|requirements|start|join|open)\b/i.test(
      normalized
    ) || ['درخواست', 'اپلائی', 'اہلیت', 'دستاویزات', 'کاغذات'].some((t) => query.includes(t));

  const asksShariahOrHowItWorks =
    /\b(how does.*takaful|what is.*takaful|shariah|waqf|tabarru|wakalah|halal|riba)\b/i.test(
      normalized
    ) || ['تکافل', 'شرعی', 'شریعت', 'وقف'].some((t) => query.includes(t));

  const asksCompareOrCalc =
    /\b(compare|comparison|difference|calculator|calculate|estimate|minimum|cost|price|how much)\b/i.test(
      normalized
    ) || ['موازنہ', 'کیلکولیٹر', 'تخمینہ', 'کم از کم'].some((t) => query.includes(t));

  const asksFaq =
    /\b(faq|faqs|common question|questions)\b/i.test(normalized) || query.includes('سوال');

  const scored = KNOWLEDGE_BASE_DOCS.map((doc) => {
    let score = doc.id === 'guide-pqftl-overview' ? 4 : 0;
    const haystack = `${doc.title} ${doc.content} ${doc.keywords.join(' ')}`.toLowerCase();

    for (const token of expandedTokens) {
      if (doc.title.toLowerCase().includes(token)) score += 5;
      if (doc.keywords.some((k) => k === token || k.includes(token) || token.includes(k))) {
        score += 4;
      }
      if (haystack.includes(token)) score += 1.5;
    }

    if (asksApplicationOrDocs && doc.id === 'guide-application-documents') {
      score += 14;
    }
    if (asksCompareOrCalc && doc.id === 'guide-compare-calculator') {
      score += 12;
    }
    if (asksFaq && doc.id === 'guide-faqs-guest') {
      score += 12;
    }
    if (asksShariahOrHowItWorks && doc.category === 'shariah') {
      score += 10;
    }
    if (
      (normalized.includes('family') || query.includes('خاندانی') || query.includes('فیملی')) &&
      doc.category === 'family-product'
    ) {
      score += 3;
    }
    if (isOutOfScopeGeneralQuery && doc.id === 'guide-general-takaful-referral') {
      score += 24;
    }

    return { doc, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const overviewDoc = KNOWLEDGE_BASE_DOCS.find((d) => d.id === 'guide-pqftl-overview');
  const selected = scored.slice(0, maxDocs).map((item) => item.doc);
  if (overviewDoc && !selected.some((d) => d.id === overviewDoc.id) && selected.length > 0) {
    selected[selected.length - 1] = overviewDoc;
  }
  return selected;
}
