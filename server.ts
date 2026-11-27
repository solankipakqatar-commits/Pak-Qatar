import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import type { Request, Response } from 'express';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import {
  DEMO_CERTIFICATES,
  DEMO_CLAIMS,
  DEMO_CUSTOMER,
  DEMO_FUND_HOLDINGS,
  DEMO_PAYMENTS,
  PQFS_VERIFIED_CONTACT,
} from './src/data/pqfsData.ts';
import {
  KNOWLEDGE_BASE_DOCS,
  KNOWLEDGE_BASE_LAST_UPDATED,
  KNOWLEDGE_BASE_VERSION,
  type KnowledgeDoc,
  retrieveRelevantKnowledge,
} from './server/pqfsKnowledgeBase.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const MODEL_NAME = 'gemini-4-hydrogen';
const BACKUP_MODEL_NAME = 'gemini-3.1-flash-lite';
const PRIMARY_TIMEOUT_MS = 18_000;
const BACKUP_TIMEOUT_MS = 22_000;

interface AuthSession {
  token: string;
  customerId: string;
  issuedAt: number;
}

const authSessions = new Map<string, AuthSession>();
const SESSION_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

function getBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || typeof header !== 'string') return null;
  if (!header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  return token.length > 0 ? token : null;
}

function getValidSession(req: Request): AuthSession | null {
  const token = getBearerToken(req);
  if (!token) return null;
  const session = authSessions.get(token);
  if (!session) return null;
  if (Date.now() - session.issuedAt > SESSION_TTL_MS) {
    authSessions.delete(token);
    return null;
  }
  return session;
}

function containsSensitiveCredentials(text: string): boolean {
  const patterns = [
    /\b(otp|pin|password|passcode|cvv|cvc)\b\s*(?:is|:|=|-)?\s*[a-z0-9!@#$%^&*]{4,}/i,
    /\b\d{5}-\d{7}-\d\b/, // full unmasked CNIC
  ];
  return patterns.some((rx) => rx.test(text));
}

/**
 * Normalizes chat history into strict alternating user -> model turns,
 * always starting with 'user' and ending with 'model' before appending the new user turn.
 */
function sanitizeHistory(
  rawHistory: unknown
): Array<{ role: 'user' | 'model'; text: string }> {
  if (!Array.isArray(rawHistory)) return [];
  const filtered: Array<{ role: 'user' | 'model'; text: string }> = [];
  for (const item of rawHistory.slice(-12)) {
    if (!item || typeof item !== 'object') continue;
    const role = (item as { role?: unknown }).role;
    const text = (item as { text?: unknown }).text;
    if ((role === 'user' || role === 'model') && typeof text === 'string') {
      const trimmed = text.trim().slice(0, 1600);
      if (trimmed) {
        filtered.push({ role, text: trimmed });
      }
    }
  }

  // Drop leading model turns so conversation always starts with 'user'
  while (filtered.length > 0 && filtered[0].role !== 'user') {
    filtered.shift();
  }

  // Enforce strict alternation (never two user or two model turns consecutively)
  const alternating: Array<{ role: 'user' | 'model'; text: string }> = [];
  for (const turn of filtered) {
    const prev = alternating[alternating.length - 1];
    if (prev && prev.role === turn.role) {
      alternating[alternating.length - 1] = turn;
    } else {
      alternating.push(turn);
    }
  }

  // Ensure the final turn in prior history is 'model' before appending the new 'user' turn
  if (alternating.length > 0 && alternating[alternating.length - 1].role === 'user') {
    alternating.pop();
  }

  return alternating.slice(-8);
}

interface AccountSnapshotInput {
  certificates?: Array<{
    certificateNumber: string;
    productName: string;
    entity: string;
    status: string;
    contributionAmountPkr: number;
    frequency: string;
    nextDueDate: string;
    participantInvestmentAccountPkr?: number;
  }>;
  payments?: Array<{
    referenceNumber: string;
    productName: string;
    status: string;
    amountPkr: number;
    dueDate: string;
    paidDate?: string;
  }>;
  claims?: Array<{
    referenceNumber: string;
    productName: string;
    currentStage: string;
    estimatedAmountPkr: number;
    approvedAmountPkr?: number;
    lastUpdatedNote: string;
  }>;
}

function buildAuthenticatedContextText(rawSnapshot: unknown): string {
  const fallbackCerts = DEMO_CERTIFICATES;
  const fallbackPayments = DEMO_PAYMENTS;
  const fallbackClaims = DEMO_CLAIMS;

  const snap =
    rawSnapshot && typeof rawSnapshot === 'object'
      ? (rawSnapshot as AccountSnapshotInput)
      : null;

  const certs = Array.isArray(snap?.certificates)
    ? snap.certificates.slice(0, 10)
    : fallbackCerts;
  const pays = Array.isArray(snap?.payments)
    ? snap.payments.slice(0, 12)
    : fallbackPayments;
  const clms = Array.isArray(snap?.claims) ? snap.claims.slice(0, 10) : fallbackClaims;

  return [
    `Authenticated Customer (Demo Account): ${DEMO_CUSTOMER.fullName} (Customer ID: ${DEMO_CUSTOMER.customerId}, City: ${DEMO_CUSTOMER.city}, Elaaj Card: ${DEMO_CUSTOMER.elaajCardNumber})`,
    'Active/Expired Certificates:',
    ...certs.map(
      (c) =>
        `- ${c.certificateNumber}: ${c.productName} (PQFTL), Status: ${c.status}, Contribution: PKR ${Number(c.contributionAmountPkr).toLocaleString()} (${c.frequency}), Next Due: ${c.nextDueDate}${c.participantInvestmentAccountPkr ? `, Illustrative PIA Value: PKR ${Number(c.participantInvestmentAccountPkr).toLocaleString()}` : ''}`
    ),
    'Contributions & Payment Records:',
    ...pays.map(
      (p) =>
        `- ${p.referenceNumber} (${p.productName}): Status ${p.status}, Amount PKR ${Number(p.amountPkr).toLocaleString()}, Due ${p.dueDate}${p.paidDate ? `, Paid ${p.paidDate}` : ''}`
    ),
    'Submitted Claims:',
    ...clms.map(
      (cl) =>
        `- ${cl.referenceNumber} (${cl.productName}): Stage "${cl.currentStage}", Estimated PKR ${Number(cl.estimatedAmountPkr).toLocaleString()}${cl.approvedAmountPkr ? `, Approved PKR ${Number(cl.approvedAmountPkr).toLocaleString()}` : ''}. Note: ${cl.lastUpdatedNote}`
    ),
    `Illustrative Fund Holdings Summary (as of ${DEMO_FUND_HOLDINGS[0]?.valuationDate ?? '24 Nov 2026'}): ${DEMO_FUND_HOLDINGS.map((f) => `${f.fundName}: ${f.allocationPercent}% (PKR ${f.valuePkr.toLocaleString()})`).join('; ')}`,
    'IMPORTANT ACCOUNT DISCLOSURE NOTE: Remind the user briefly when quoting account details that these records reflect their current authenticated app session (demo portfolio).',
  ].join('\n');
}

const VALID_ACTIONS = new Set([
  'none',
  'family-plans',
  'calculator',
  'shariah',
  'login',
  'certificates',
  'payments',
  'claims',
  'elaaj',
  'support',
]);

function inferSuggestedAction(
  message: string,
  relevantDocs: KnowledgeDoc[],
  isAuthenticated: boolean
): string {
  const lower = message.toLowerCase();
  if (
    /\b(general takaful|pqgtl|motor|car|vehicle|travel|umrah|home|fire|marine|contact|helpline|uan|branch|support|agent)\b/i.test(
      lower
    ) ||
    ['رابطہ', 'ہیلپ لائن', 'برانچ', 'شکایت', 'جنرل', 'موٹر'].some((t) =>
      message.includes(t)
    )
  ) {
    return 'support';
  }
  if (
    /\b(claim|reimbursement|hospitalization claim)\b/i.test(lower) ||
    message.includes('کلیم') ||
    message.includes('دعویٰ')
  ) {
    return isAuthenticated ? 'claims' : 'login';
  }
  if (
    /\b(pay|payment|raast|1link|ibft|receipt|due contribution)\b/i.test(lower) ||
    message.includes('ادائیگی')
  ) {
    return isAuthenticated ? 'payments' : 'login';
  }
  if (
    /\b(my certificate|my policy|statement|fund holding|nav)\b/i.test(lower) ||
    message.includes('سرٹیفکیٹ')
  ) {
    return isAuthenticated ? 'certificates' : 'login';
  }
  if (
    /\b(elaaj|panel hospital|health card)\b/i.test(lower) ||
    message.includes('علاج')
  ) {
    return isAuthenticated ? 'elaaj' : 'family-plans';
  }
  if (
    /\b(calculator|calculate|estimate|how much|minimum)\b/i.test(lower) ||
    message.includes('کیلکولیٹر') ||
    message.includes('تخمینہ')
  ) {
    return 'calculator';
  }
  if (
    /\b(shariah|waqf|tabarru|wakalah|halal|riba)\b/i.test(lower) ||
    ['شریعت', 'شرعی', 'وقف'].some((t) => message.includes(t))
  ) {
    return 'shariah';
  }
  if (
    /\b(login|sign in|register|biometric|otp|account)\b/i.test(lower) ||
    ['لاگ ان', 'رجسٹریشن'].some((t) => message.includes(t))
  ) {
    return isAuthenticated ? 'certificates' : 'login';
  }
  if (relevantDocs.some((d) => d.category === 'family-product')) {
    return 'family-plans';
  }
  return 'none';
}

function buildKnowledgeMatches(relevantDocs: KnowledgeDoc[]) {
  return relevantDocs.slice(0, 3).map((d) => ({
    id: d.id,
    title: d.title,
    sourceLabel: d.sourceLabel,
    excerpt: d.content.split('\n').slice(0, 4).join(' '),
    lastUpdated: d.lastUpdated,
  }));
}

function classifyUpstreamFailure(err: unknown, language: 'en' | 'ur') {
  const errStatus =
    err && typeof err === 'object' && 'status' in err
      ? Number((err as { status?: unknown }).status)
      : undefined;
  const errMessage = err instanceof Error ? err.message : String(err ?? '');
  const isAbort =
    (err instanceof Error && err.name === 'AbortError') ||
    errMessage.includes('AbortError') ||
    errMessage.includes('aborted');

  if (isAbort) {
    return {
      statusCode: 504,
      errorCode: 'AI_TIMEOUT',
      message:
        language === 'ur'
          ? 'لائیو اے آئی سروس کے جواب میں توقع سے زیادہ وقت لگا۔ ذیل میں تصدیق شدہ پاک قطر معلومات اور آفیشل ہیلپ لائن ملاحظہ کریں۔'
          : 'The live AI assistant took too long to respond. Verified Pak-Qatar Family Takaful excerpts and official support details are shown below.',
    };
  }
  if (errStatus === 403 || errMessage.includes('403') || errMessage.includes('PERMISSION_DENIED')) {
    return {
      statusCode: 403,
      errorCode: 'AI_AUTH_ERROR',
      message:
        language === 'ur'
          ? 'لائیو اے آئی سروس تک رسائی اس وقت دستیاب نہیں ہے۔ ذیل میں تصدیق شدہ پاک قطر معلومات اور آفیشل ہیلپ لائن ملاحظہ کریں۔'
          : 'Live AI access is currently unavailable in this environment. Verified Pak-Qatar excerpts and official UAN support are shown below.',
    };
  }
  if (errStatus === 429 || errMessage.includes('429') || errMessage.includes('RESOURCE_EXHAUSTED')) {
    return {
      statusCode: 429,
      errorCode: 'AI_RATE_LIMITED',
      message:
        language === 'ur'
          ? 'اس وقت درخواستوں کا رش زیادہ ہے۔ براہِ کرم چند لمحوں بعد دوبارہ کوشش کریں یا ذیل میں تصدیق شدہ معلومات دیکھیں۔'
          : 'The live AI assistant is experiencing high demand. Please retry shortly or review the verified Pak-Qatar excerpts below.',
    };
  }
  return {
    statusCode: 502,
    errorCode: 'AI_UPSTREAM_ERROR',
    message:
      language === 'ur'
        ? 'اس وقت لائیو اے آئی سروس سے رابطہ نہیں ہو سکا۔ ذیل میں تصدیق شدہ پاک قطر معلومات اور آفیشل ہیلپ لائن ملاحظہ کریں۔'
        : 'Unable to reach the live AI assistant right now. Verified Pak-Qatar excerpts and official support channels are shown below.',
  };
}

function buildSystemInstruction(
  relevantDocs: KnowledgeDoc[],
  accountContextText: string,
  includeActionTagRule: boolean,
  language: 'en' | 'ur'
): string {
  const lines = [
    'You are the official "Pak-Qatar Assistant" for Pak-Qatar Family Takaful Limited (PQFTL).',
    `ACTIVE CUSTOMER LANGUAGE PREFERENCE: ${language === 'ur' ? 'URDU (reply strictly in Urdu)' : 'ENGLISH (reply strictly in English)'}.`,
    '',
    'CORE RULES (STRICT):',
    '1. LANGUAGE: Always reply in the ACTIVE CUSTOMER LANGUAGE PREFERENCE specified above unless the user explicitly writes their current question in the other language.',
    '2. DETAILED & STRUCTURED EXPLANATIONS: Provide thorough, clear, easy-to-scan explanations tailored for mobile reading. Whenever the customer asks about a Family Takaful plan, application procedure, onboarding, or claims, explicitly structure relevant sections with bold headings or bullet points covering:',
    '   - **Overview & Key Benefits**',
    '   - **Eligibility Criteria** (verified age/residency/applicant conditions)',
    '   - **Required Documents** (CNIC/NICOP, B-Form, health declaration, or claim/corporate requirements from verified context)',
    '   - **Illustrative Contribution Basis & Terms** (only verified illustrative figures; remind clearly that calculator/app figures are illustrative and governed by the PMD after underwriting)',
    '   - **Official Next Steps** (in-app flow or official PQFTL contact)',
    '3. ACCURACY & ZERO FABRICATION: Rely ONLY on the VERIFIED PAK-QATAR FAMILY TAKAFUL KNOWLEDGE BASE and (if authenticated) AUTHENTICATED ACCOUNT DATA below. NEVER invent rates, guaranteed returns, policy wording, exclusions, or unverified figures.',
    '4. OUT-OF-SCOPE GENERAL TAKAFUL INQUIRIES: This application serves Pak-Qatar Family Takaful Limited (PQFTL) exclusively. If a customer asks about General Takaful, Motor, Travel, Home/Fire, or Marine/Cargo coverage, politely explain that this app is dedicated exclusively to Family Takaful (PQFTL) and direct them to official Pak-Qatar channels: UAN (021) 111-825-238 (111-TAKAFUL), info@pakqatar.com.pk, or www.pakqatar.com.pk.',
    '5. UNVERIFIED QUESTIONS: If specific details are absent from the verified context, clearly state that they require formal verification and direct the customer to UAN (021) 111-825-238 (111-TAKAFUL) or info@pakqatar.com.pk.',
    '6. NO PERSONAL ADVICE OR FATWAS: Do not provide personalized financial/investment recommendations or formal Shariah rulings/fatwas. Refer formal Shariah documentation queries to official published PQFTL Shariah Supervisory Board certificates.',
    '7. SECURITY & PRIVACY: Never request passwords, PINs, OTPs, or full CNIC numbers. Require sign-in before displaying any personal account, payment, certificate, or claim records.',
  ];

  if (includeActionTagRule) {
    lines.push(
      '8. CONTROL TAG (MANDATORY FINAL LINE): At the very end of your response, on its own final line, output exactly one tag choosing the single most helpful action from [none, family-plans, calculator, shariah, login, certificates, payments, claims, elaaj, support], formatted exactly as [[ACTION:family-plans]] (no extra text after this tag).'
    );
  } else {
    lines.push(
      '8. SUGGESTED ACTION: Pick the single most helpful "suggestedAction" from: "none", "family-plans", "calculator", "shariah", "login", "certificates", "payments", "claims", "elaaj", "support".'
    );
  }

  lines.push(
    '',
    `KNOWLEDGE BASE LAST UPDATED: ${KNOWLEDGE_BASE_LAST_UPDATED}`,
    '',
    'VERIFIED PAK-QATAR FAMILY TAKAFUL KNOWLEDGE BASE:',
    ...relevantDocs.map(
      (doc, idx) => `[Source ${idx + 1}: ${doc.title} — ${doc.sourceLabel}]\n${doc.content}`
    ),
    '',
    'ACCOUNT ACCESS CONTEXT:',
    accountContextText
  );

  return lines.join('\n');
}

function writeSseEvent(res: Response, event: string, data: unknown) {
  if (res.writableEnded) return;
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function extractActionTag(text: string): { cleanText: string; action: string | null } {
  const match = text.match(/\n?\s*\[\[ACTION:([a-z-]+)\]\]\s*$/i);
  if (!match) {
    // Also clean any stray inline [[ACTION:...]] anywhere in the string
    const inlineMatch = text.match(/\[\[ACTION:([a-z-]+)\]\]/i);
    if (!inlineMatch) {
      return { cleanText: text.trim(), action: null };
    }
    const candidate = inlineMatch[1].toLowerCase();
    return {
      cleanText: text.replace(/\[\[ACTION:[a-z-]+\]\]/gi, '').trim(),
      action: VALID_ACTIONS.has(candidate) ? candidate : null,
    };
  }
  const candidate = match[1].toLowerCase();
  return {
    cleanText: text.slice(0, match.index).trim(),
    action: VALID_ACTIONS.has(candidate) ? candidate : null,
  };
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  // Issue authenticated Bearer session token in memory upon Customer Login / Registration
  app.post('/api/auth/demo-session', (_req: Request, res: Response) => {
    const token = crypto.randomBytes(24).toString('hex');
    authSessions.set(token, {
      token,
      customerId: DEMO_CUSTOMER.customerId,
      issuedAt: Date.now(),
    });
    res.json({
      token,
      customerId: DEMO_CUSTOMER.customerId,
      expiresInSeconds: Math.round(SESSION_TTL_MS / 1000),
    });
  });

  app.delete('/api/auth/demo-session', (req: Request, res: Response) => {
    const token = getBearerToken(req);
    if (token) {
      authSessions.delete(token);
    }
    res.json({ revoked: true });
  });

  app.get('/api/assistant/status', (_req: Request, res: Response) => {
    res.json({
      aiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()),
      model: MODEL_NAME,
      streaming: true,
      knowledgeBaseVersion: KNOWLEDGE_BASE_VERSION,
      knowledgeBaseUpdatedAt: KNOWLEDGE_BASE_LAST_UPDATED,
      totalKnowledgeDocs: KNOWLEDGE_BASE_DOCS.length,
      officialContact: PQFS_VERIFIED_CONTACT,
    });
  });

  app.post('/api/assistant/chat', async (req: Request, res: Response) => {
    const body = req.body as {
      message?: unknown;
      language?: unknown;
      history?: unknown;
      accountSnapshot?: unknown;
      stream?: unknown;
    };

    const wantsStream =
      body?.stream === true ||
      Boolean(req.headers.accept && req.headers.accept.includes('text/event-stream'));

    try {
      if (typeof body?.message !== 'string' || !body.message.trim()) {
        res.status(400).json({
          errorCode: 'INVALID_INPUT',
          message: 'Please enter a message before sending.',
        });
        return;
      }

      const rawMessage = body.message.trim().slice(0, 1200);
      const language: 'en' | 'ur' = body.language === 'ur' ? 'ur' : 'en';
      const history = sanitizeHistory(body.history);
      const session = getValidSession(req);
      const isAuthenticated = Boolean(session);

      if (containsSensitiveCredentials(rawMessage)) {
        const privacyReply =
          language === 'ur'
            ? 'حفاظتی اصولوں کے مطابق براہِ کرم چیٹ میں اپنا پاس ورڈ، پن کوڈ، مکمل شناختی کارڈ نمبر یا او ٹی پی ہرگز شیئر نہ کریں۔ اگر آپ کو اکاؤنٹ تک رسائی میں مدد درکار ہو تو براہِ کرم آفیشل ہیلپ لائن (021) 111-825-238 پر رابطہ کریں۔'
            : 'For your account security, please never share passwords, PINs, OTPs, or full CNIC numbers in chat. Your message was not processed with sensitive details. For account recovery or verification help, please use the Login screen or call Pak-Qatar UAN (021) 111-825-238.';

        const payload = {
          reply: privacyReply,
          suggestedAction: 'support',
          sources: ['PQFTL Security & Privacy Policy'],
          knowledgeBaseUpdatedAt: KNOWLEDGE_BASE_LAST_UPDATED,
          authenticatedAccess: isAuthenticated,
          mode: 'privacy-guard',
        };

        if (wantsStream) {
          res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache, no-transform');
          res.setHeader('Connection', 'keep-alive');
          res.setHeader('X-Accel-Buffering', 'no');
          res.flushHeaders?.();
          writeSseEvent(res, 'start', { mode: 'privacy-guard' });
          writeSseEvent(res, 'chunk', { delta: privacyReply });
          writeSseEvent(res, 'done', payload);
          res.end();
          return;
        }

        res.json(payload);
        return;
      }

      const relevantDocs = retrieveRelevantKnowledge(rawMessage, 6);
      const sourceNames = Array.from(new Set(relevantDocs.map((d) => d.sourceLabel)));
      const knowledgeMatches = buildKnowledgeMatches(relevantDocs);
      const fallbackAction = inferSuggestedAction(rawMessage, relevantDocs, isAuthenticated);

      const apiKey = process.env.GEMINI_API_KEY?.trim();
      if (!apiKey) {
        const unconfiguredPayload = {
          errorCode: 'AI_NOT_CONFIGURED',
          statusCode: 503,
          message:
            language === 'ur'
              ? 'لائیو اے آئی سروس اس وقت کنفیگر نہیں ہے، تاہم ذیل میں تصدیق شدہ پاک قطر معلومات اور آفیشل ہیلپ لائن موجود ہیں۔'
              : 'Live AI service is currently unavailable in this environment. Verified Pak-Qatar Family Takaful excerpts and official UAN support are shown below.',
          knowledgeBaseUpdatedAt: KNOWLEDGE_BASE_LAST_UPDATED,
          officialContact: PQFS_VERIFIED_CONTACT,
          knowledgeMatches,
          suggestedAction: fallbackAction === 'none' ? 'support' : fallbackAction,
        };

        if (wantsStream) {
          res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache, no-transform');
          res.setHeader('Connection', 'keep-alive');
          res.setHeader('X-Accel-Buffering', 'no');
          res.flushHeaders?.();
          writeSseEvent(res, 'fallback', unconfiguredPayload);
          res.end();
          return;
        }

        res.status(503).json(unconfiguredPayload);
        return;
      }

      const accountContextText = isAuthenticated
        ? buildAuthenticatedContextText(body.accountSnapshot)
        : 'AUTHENTICATED: NO (Guest user). Do NOT reveal any personal certificates, payments, or claim statuses. If the customer asks to track personal claims, payments, or certificates, clearly guide them to Customer Login.';

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const conversationContents = [
        ...history.map((turn) => ({
          role: turn.role,
          parts: [{ text: turn.text }],
        })),
        {
          role: 'user',
          parts: [{ text: rawMessage }],
        },
      ];

      // SSE live word-by-word streaming branch
      if (wantsStream) {
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders?.();

        let clientClosed = false;
        let activeAbort: AbortController | null = null;

        res.on('close', () => {
          if (!res.writableEnded) {
            clientClosed = true;
            activeAbort?.abort();
          }
        });

        writeSseEvent(res, 'start', { mode: 'live-ai' });

        const systemInstruction = buildSystemInstruction(
          relevantDocs,
          accountContextText,
          true,
          language
        );

        const attempts = [
          {
            model: MODEL_NAME,
            thinkingLevel: ThinkingLevel.LOW,
            timeoutMs: PRIMARY_TIMEOUT_MS,
          },
          {
            model: BACKUP_MODEL_NAME,
            thinkingLevel: ThinkingLevel.MINIMAL,
            timeoutMs: BACKUP_TIMEOUT_MS,
          },
        ];

        let lastStreamErr: unknown = null;

        for (const attemptCfg of attempts) {
          if (clientClosed) return;

          const abortController = new AbortController();
          activeAbort = abortController;
          const timeoutId = setTimeout(() => {
            abortController.abort(new Error('AbortError: Upstream Gemini stream timed out'));
          }, attemptCfg.timeoutMs);

          let fullRawText = '';
          let pendingTail = '';
          let emittedChars = 0;

          try {
            const stream = await ai.models.generateContentStream({
              model: attemptCfg.model,
              contents: conversationContents,
              config: {
                systemInstruction,
                thinkingConfig: { thinkingLevel: attemptCfg.thinkingLevel },
                abortSignal: abortController.signal,
              },
            });

            for await (const chunk of stream) {
              if (clientClosed) break;
              const delta = chunk.text;
              if (!delta) continue;

              fullRawText += delta;
              pendingTail += delta;

              // Hold back only a potential trailing [[ACTION:...]] marker so users never see raw tags
              const bracketIdx = pendingTail.lastIndexOf('[');
              if (bracketIdx !== -1 && pendingTail.length - bracketIdx <= 34) {
                const safeToFlush = pendingTail.slice(0, bracketIdx);
                if (safeToFlush) {
                  writeSseEvent(res, 'chunk', { delta: safeToFlush });
                  emittedChars += safeToFlush.length;
                }
                pendingTail = pendingTail.slice(bracketIdx);
              } else {
                writeSseEvent(res, 'chunk', { delta: pendingTail });
                emittedChars += pendingTail.length;
                pendingTail = '';
              }
            }

            clearTimeout(timeoutId);
            if (clientClosed) return;

            const { cleanText, action } = extractActionTag(fullRawText);
            if (pendingTail) {
              const cleanedTail = pendingTail.replace(/\[\[ACTION:[a-z-]+\]\]/gi, '');
              const remainingVisible = cleanText.slice(emittedChars);
              const tailDelta = remainingVisible || cleanedTail.trimEnd();
              if (tailDelta) {
                writeSseEvent(res, 'chunk', { delta: tailDelta });
              }
            }

            if (!cleanText) {
              throw new Error('Empty AI stream response received.');
            }

            const resolvedAction =
              action && action !== 'none' ? action : fallbackAction;

            writeSseEvent(res, 'done', {
              reply: cleanText,
              suggestedAction: resolvedAction,
              sources: sourceNames,
              knowledgeBaseUpdatedAt: KNOWLEDGE_BASE_LAST_UPDATED,
              authenticatedAccess: isAuthenticated,
              mode: 'live-ai',
            });
            res.end();
            return;
          } catch (streamErr) {
            clearTimeout(timeoutId);
            if (clientClosed) return;
            lastStreamErr = streamErr;
            console.error(`Gemini stream error (${attemptCfg.model}):`, streamErr);
            // Never retry after visible chunks were already streamed to client
            if (emittedChars > 0) {
              break;
            }
          }
        }

        const classified = classifyUpstreamFailure(lastStreamErr, language);
        writeSseEvent(res, 'fallback', {
          errorCode: classified.errorCode,
          statusCode: classified.statusCode,
          message: classified.message,
          knowledgeBaseUpdatedAt: KNOWLEDGE_BASE_LAST_UPDATED,
          officialContact: PQFS_VERIFIED_CONTACT,
          knowledgeMatches,
          suggestedAction: fallbackAction === 'none' ? 'support' : fallbackAction,
        });
        res.end();
        return;
      }

      // Standard non-streaming JSON fallback for synchronous callers
      const systemInstruction = buildSystemInstruction(
        relevantDocs,
        accountContextText,
        false,
        language
      );

      const jsonAttempts = [
        {
          model: MODEL_NAME,
          thinkingLevel: ThinkingLevel.LOW,
          timeoutMs: PRIMARY_TIMEOUT_MS,
        },
        {
          model: BACKUP_MODEL_NAME,
          thinkingLevel: ThinkingLevel.MINIMAL,
          timeoutMs: BACKUP_TIMEOUT_MS,
        },
      ];

      let lastJsonErr: unknown = null;

      for (const attemptCfg of jsonAttempts) {
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => {
          abortController.abort(new Error('AbortError: Upstream Gemini request timed out'));
        }, attemptCfg.timeoutMs);

        try {
          const response = await ai.models.generateContent({
            model: attemptCfg.model,
            contents: conversationContents,
            config: {
              systemInstruction,
              thinkingConfig: { thinkingLevel: attemptCfg.thinkingLevel },
              abortSignal: abortController.signal,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  reply: {
                    type: Type.STRING,
                    description:
                      'Detailed, structured answer grounded only in Pak-Qatar verified sources, including eligibility and required documents where applicable.',
                  },
                  suggestedAction: {
                    type: Type.STRING,
                    description:
                      'One of: none, family-plans, calculator, shariah, login, certificates, payments, claims, elaaj, support',
                  },
                },
                required: ['reply', 'suggestedAction'],
              },
            },
          });

          clearTimeout(timeoutId);
          const responseText = response.text?.trim();
          if (!responseText) {
            throw new Error('Empty AI response received.');
          }

          let parsedReply = responseText;
          let suggestedAction = fallbackAction;
          try {
            const parsed = JSON.parse(responseText) as {
              reply?: unknown;
              suggestedAction?: unknown;
            };
            if (typeof parsed.reply === 'string' && parsed.reply.trim()) {
              parsedReply = parsed.reply.trim();
            }
            if (
              typeof parsed.suggestedAction === 'string' &&
              VALID_ACTIONS.has(parsed.suggestedAction) &&
              parsed.suggestedAction !== 'none'
            ) {
              suggestedAction = parsed.suggestedAction;
            }
          } catch {
            // Keep plain text safely if JSON parsing fails
          }

          res.json({
            reply: parsedReply,
            suggestedAction,
            sources: sourceNames,
            knowledgeBaseUpdatedAt: KNOWLEDGE_BASE_LAST_UPDATED,
            authenticatedAccess: isAuthenticated,
            mode: 'live-ai',
          });
          return;
        } catch (jsonErr) {
          clearTimeout(timeoutId);
          lastJsonErr = jsonErr;
          console.error(`Gemini API error (${attemptCfg.model}):`, jsonErr);
        }
      }

      const classified = classifyUpstreamFailure(lastJsonErr, language);
      res.status(classified.statusCode).json({
        errorCode: classified.errorCode,
        message: classified.message,
        knowledgeBaseUpdatedAt: KNOWLEDGE_BASE_LAST_UPDATED,
        officialContact: PQFS_VERIFIED_CONTACT,
        knowledgeMatches,
        suggestedAction: fallbackAction === 'none' ? 'support' : fallbackAction,
      });
    } catch (error) {
      console.error('Assistant endpoint error:', error);
      if (wantsStream && !res.headersSent) {
        res.status(500).json({
          errorCode: 'INTERNAL_ERROR',
          message: 'Unexpected server error while processing your request.',
        });
      } else if (!res.writableEnded) {
        res.status(500).json({
          errorCode: 'INTERNAL_ERROR',
          message: 'Unexpected server error while processing your request.',
        });
      }
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PQFTL server running on http://0.0.0.0:${PORT}`);
  });
}

void createServer();
