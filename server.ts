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
  retrieveRelevantKnowledge,
} from './server/pqfsKnowledgeBase.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const MODEL_NAME = 'gemini-4-hydrogen';

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

function sanitizeHistory(
  rawHistory: unknown
): Array<{ role: 'user' | 'model'; text: string }> {
  if (!Array.isArray(rawHistory)) return [];
  const clean: Array<{ role: 'user' | 'model'; text: string }> = [];
  for (const item of rawHistory.slice(-8)) {
    if (!item || typeof item !== 'object') continue;
    const role = (item as { role?: unknown }).role;
    const text = (item as { text?: unknown }).text;
    if ((role === 'user' || role === 'model') && typeof text === 'string') {
      const trimmed = text.trim().slice(0, 1200);
      if (trimmed) {
        clean.push({ role, text: trimmed });
      }
    }
  }
  return clean;
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
      knowledgeBaseVersion: KNOWLEDGE_BASE_VERSION,
      knowledgeBaseUpdatedAt: KNOWLEDGE_BASE_LAST_UPDATED,
      totalKnowledgeDocs: KNOWLEDGE_BASE_DOCS.length,
      officialContact: PQFS_VERIFIED_CONTACT,
    });
  });

  app.post('/api/assistant/chat', async (req: Request, res: Response) => {
    try {
      const body = req.body as {
        message?: unknown;
        language?: unknown;
        history?: unknown;
        accountSnapshot?: unknown;
      };

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

      if (containsSensitiveCredentials(rawMessage)) {
        const privacyReply =
          language === 'ur'
            ? 'حفاظتی اصولوں کے مطابق براہِ کرم چیٹ میں اپنا پاس ورڈ، پن کوڈ، مکمل شناختی کارڈ نمبر یا او ٹی پی ہرگز شیئر نہ کریں۔ اگر آپ کو اکاؤنٹ تک رسائی میں مدد درکار ہو تو براہِ کرم آفیشل ہیلپ لائن (021) 111-825-238 پر رابطہ کریں۔'
            : 'For your account security, please never share passwords, PINs, OTPs, or full CNIC numbers in chat. Your message was not processed with sensitive details. For account recovery or verification help, please use the Login screen or call Pak-Qatar UAN (021) 111-825-238.';

        res.json({
          reply: privacyReply,
          suggestedAction: 'support',
          sources: ['PQFTL Security & Privacy Policy'],
          knowledgeBaseUpdatedAt: KNOWLEDGE_BASE_LAST_UPDATED,
          authenticatedAccess: Boolean(getValidSession(req)),
          mode: 'privacy-guard',
        });
        return;
      }

      const relevantDocs = retrieveRelevantKnowledge(rawMessage, 6);
      const sourceNames = Array.from(new Set(relevantDocs.map((d) => d.sourceLabel)));

      const apiKey = process.env.GEMINI_API_KEY?.trim();
      if (!apiKey) {
        res.status(503).json({
          errorCode: 'AI_NOT_CONFIGURED',
          message:
            language === 'ur'
              ? 'لائیو اے آئی سروس اس وقت کنفیگر نہیں ہے (ڈیمو ریفرنس موڈ فعال ہے)۔'
              : 'Live AI service is not configured in this environment (prototype reference mode active).',
          knowledgeBaseUpdatedAt: KNOWLEDGE_BASE_LAST_UPDATED,
          officialContact: PQFS_VERIFIED_CONTACT,
          knowledgeMatches: relevantDocs.slice(0, 3).map((d) => ({
            id: d.id,
            title: d.title,
            sourceLabel: d.sourceLabel,
            excerpt: d.content.split('\n').slice(0, 3).join(' '),
            lastUpdated: d.lastUpdated,
          })),
        });
        return;
      }

      const session = getValidSession(req);
      const isAuthenticated = Boolean(session);
      const accountContextText = isAuthenticated
        ? buildAuthenticatedContextText(body.accountSnapshot)
        : 'AUTHENTICATED: NO (Guest user). Do NOT reveal any personal certificates, payments, or claim statuses. If the customer asks to track personal claims, payments, or certificates, clearly guide them to Customer Login and set suggestedAction to "login".';

      const systemInstruction = [
        'You are the official "Pak-Qatar Assistant" for Pak-Qatar Family Takaful Limited (PQFTL).',
        '',
        'CORE RULES (STRICT):',
        '1. LANGUAGE: Match the customer language. If language preference is "ur" or the customer writes in Urdu, reply in clear, polite, natural Urdu. Otherwise reply in clear, friendly English.',
        '2. CONCISE & HELPFUL: Keep answers short, structured, and easy to scan on mobile (2–4 concise sentences or brief numbered steps).',
        '3. ACCURACY & ZERO FABRICATION: Rely ONLY on the VERIFIED PAK-QATAR FAMILY TAKAFUL KNOWLEDGE BASE and (if authenticated) AUTHENTICATED ACCOUNT DATA below. NEVER invent rates, guaranteed returns, policy wording, exclusions, or unverified figures.',
        '4. OUT-OF-SCOPE GENERAL TAKAFUL INQUIRIES: This application serves Pak-Qatar Family Takaful Limited (PQFTL) exclusively. If a customer asks about General Takaful, Motor, Travel, Home/Fire, or Marine/Cargo coverage, politely explain that this app is dedicated exclusively to Family Takaful (PQFTL) and direct them to official Pak-Qatar channels: UAN (021) 111-825-238 (111-TAKAFUL), info@pakqatar.com.pk, or www.pakqatar.com.pk, and set suggestedAction to "support".',
        '5. UNVERIFIED QUESTIONS: If information is not present in the verified context, clearly state that you cannot verify it here and direct the customer to UAN (021) 111-825-238 (111-TAKAFUL) or info@pakqatar.com.pk.',
        '6. NO PERSONAL ADVICE OR FATWAS: Do not provide personalized financial/investment recommendations or formal Shariah rulings/fatwas. Refer formal Shariah documentation queries to official published PQFTL Shariah Supervisory Board certificates.',
        '7. SECURITY & PRIVACY: Never request passwords, PINs, OTPs, or full CNIC numbers. Require sign-in before displaying any personal account, payment, certificate, or claim records.',
        '8. SUGGESTED ACTION: Pick the single most helpful "suggestedAction" from: "none", "family-plans", "calculator", "shariah", "login", "certificates", "payments", "claims", "elaaj", "support".',
        '',
        `KNOWLEDGE BASE LAST UPDATED: ${KNOWLEDGE_BASE_LAST_UPDATED}`,
        '',
        'VERIFIED PAK-QATAR FAMILY TAKAFUL KNOWLEDGE BASE:',
        ...relevantDocs.map(
          (doc, idx) => `[Source ${idx + 1}: ${doc.title} — ${doc.sourceLabel}]\n${doc.content}`
        ),
        '',
        'ACCOUNT ACCESS CONTEXT:',
        accountContextText,
      ].join('\n');

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

      let responseText: string | undefined;
      let lastError: unknown = null;

      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: conversationContents,
            config: {
              systemInstruction,
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  reply: {
                    type: Type.STRING,
                    description:
                      'Clear, short, conversational answer grounded only in Pak-Qatar verified sources.',
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
          responseText = response.text;
          break;
        } catch (err) {
          lastError = err;
          if (attempt === 0) {
            await new Promise((r) => setTimeout(r, 350));
          }
        }
      }

      if (!responseText) {
        console.error('Gemini API error:', lastError);
        const errMessage =
          lastError instanceof Error ? lastError.message : 'Upstream AI service unavailable.';
        const statusCode =
          errMessage.includes('403') || errMessage.includes('PERMISSION_DENIED')
            ? 403
            : errMessage.includes('429') || errMessage.includes('RESOURCE_EXHAUSTED')
              ? 429
              : 502;
        res.status(statusCode).json({
          errorCode: 'AI_UPSTREAM_ERROR',
          message:
            language === 'ur'
              ? 'اس وقت لائیو اے آئی سروس سے رابطہ نہیں ہو سکا۔ براہِ کرم دوبارہ کوشش کریں یا آفیشل ہیلپ لائن (021) 111-825-238 پر رابطہ کریں۔'
              : 'Unable to reach the live AI assistant right now. Please try again or contact Pak-Qatar support at (021) 111-825-238.',
          knowledgeBaseUpdatedAt: KNOWLEDGE_BASE_LAST_UPDATED,
          officialContact: PQFS_VERIFIED_CONTACT,
          knowledgeMatches: relevantDocs.slice(0, 3).map((d) => ({
            id: d.id,
            title: d.title,
            sourceLabel: d.sourceLabel,
            excerpt: d.content.split('\n').slice(0, 3).join(' '),
            lastUpdated: d.lastUpdated,
          })),
        });
        return;
      }

      let parsedReply = responseText.trim();
      let suggestedAction = 'none';
      try {
        const parsed = JSON.parse(parsedReply) as {
          reply?: unknown;
          suggestedAction?: unknown;
        };
        if (typeof parsed.reply === 'string' && parsed.reply.trim()) {
          parsedReply = parsed.reply.trim();
        }
        if (
          typeof parsed.suggestedAction === 'string' &&
          VALID_ACTIONS.has(parsed.suggestedAction)
        ) {
          suggestedAction = parsed.suggestedAction;
        }
      } catch {
        // If model returned plain text, keep parsedReply cleanly
      }

      res.json({
        reply: parsedReply,
        suggestedAction,
        sources: sourceNames,
        knowledgeBaseUpdatedAt: KNOWLEDGE_BASE_LAST_UPDATED,
        authenticatedAccess: isAuthenticated,
        mode: 'live-ai',
      });
    } catch (error) {
      console.error('Assistant endpoint error:', error);
      res.status(500).json({
        errorCode: 'INTERNAL_ERROR',
        message: 'Unexpected server error while processing your request.',
      });
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
