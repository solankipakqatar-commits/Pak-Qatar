import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  ArrowRight,
  Lock,
  Mail,
  Mic,
  MicOff,
  PhoneCall,
  RefreshCw,
  RotateCcw,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  ContributionPayment,
  LanguageCode,
  TakafulCertificate,
  TakafulClaim,
} from '../types/pqfs';
import { DEMO_CUSTOMER, PQFS_VERIFIED_CONTACT } from '../data/pqfsData';

export type AssistantNavigationAction =
  | 'none'
  | 'family-plans'
  | 'calculator'
  | 'shariah'
  | 'login'
  | 'certificates'
  | 'payments'
  | 'claims'
  | 'elaaj'
  | 'support';

interface KnowledgeMatch {
  id: string;
  title: string;
  sourceLabel: string;
  excerpt: string;
  lastUpdated: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  mode?: 'live-ai' | 'privacy-guard' | 'fallback-reference' | 'error';
  isStreaming?: boolean;
  suggestedAction?: AssistantNavigationAction;
  sources?: string[];
  knowledgeBaseUpdatedAt?: string;
  authenticatedAccess?: boolean;
  knowledgeMatches?: KnowledgeMatch[];
  retryPrompt?: string;
  pairedUserMsgId?: string;
}

interface PakQatarAssistantProps {
  visible: boolean;
  hasBottomNav: boolean;
  isAuthenticated: boolean;
  authToken: string | null;
  appLanguage: LanguageCode;
  certificates: TakafulCertificate[];
  payments: ContributionPayment[];
  claims: TakafulClaim[];
  onNavigateAction: (action: AssistantNavigationAction) => void;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}
interface SpeechRecognitionResult {
  0: SpeechRecognitionAlternative;
}
interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResult>;
}
interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

const SUGGESTED_QUESTIONS_EN = [
  'Explore Family Takaful Plans',
  'Eligibility & Required Documents',
  'How does Takaful work?',
  'How can I make a payment?',
  'How do I submit a claim?',
  'Track My Claim',
];

const SUGGESTED_QUESTIONS_UR = [
  'فیملی تکافل پلانز دیکھیں',
  'اہلیت اور ضروری دستاویزات',
  'تکافل کیسے کام کرتا ہے؟',
  'میں ادائیگی کیسے کر سکتا ہوں؟',
  'کلیم کیسے جمع کرواؤں؟',
  'میرا کلیم ٹریک کریں',
];

const ACTION_LABELS_EN: Record<Exclude<AssistantNavigationAction, 'none'>, string> = {
  'family-plans': 'Open Family Takaful Plans',
  calculator: 'Open Contribution Calculator',
  shariah: 'Open Shariah Transparency',
  login: 'Go to Customer Login',
  certificates: 'View My Certificates',
  payments: 'Open Contributions & Payments',
  claims: 'Open Claims Centre',
  elaaj: 'Open Elaaj Health & Panel',
  support: 'Open Branches & Support',
};

const ACTION_LABELS_UR: Record<Exclude<AssistantNavigationAction, 'none'>, string> = {
  'family-plans': 'فیملی تکافل پلانز دیکھیں',
  calculator: 'کیلکولیٹر کھولیں',
  shariah: 'شرعی معلومات دیکھیں',
  login: 'کسٹمر لاگ ان پر جائیں',
  certificates: 'میرے سرٹیفکیٹس دیکھیں',
  payments: 'ادائیگیاں کھولیں',
  claims: 'کلیمز سینٹر کھولیں',
  elaaj: 'علاج ہیلتھ اور پینل دیکھیں',
  support: 'رابطہ اور برانچز دیکھیں',
};

/**
 * Geometric Islamic 8-Point Star & Conversation Mark.
 */
const AssistantEmblem: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
    className="shrink-0"
  >
    <rect
      x="9"
      y="9"
      width="22"
      height="22"
      rx="3"
      fill="#A32035"
      stroke="#F5B335"
      strokeWidth="1.5"
    />
    <rect
      x="9"
      y="9"
      width="22"
      height="22"
      rx="3"
      transform="rotate(45 20 20)"
      fill="#007A48"
      stroke="#F5B335"
      strokeWidth="1.5"
    />
    <circle cx="20" cy="20" r="8.5" fill="#FFFFFF" />
    <path
      d="M15.5 20h9M17.5 16.8h5M17.5 23.2h3.5"
      stroke="#007A48"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

function getWelcomeMessage(lang: LanguageCode): ChatMessage {
  return {
    id: 'pqfs-welcome-msg',
    role: 'assistant',
    text:
      lang === 'ur'
        ? 'السلام علیکم! میں پاک قطر اسسٹنٹ ہوں۔ میں پاک قطر فیملی تکافل (PQFTL) کے بچت، تعلیم، ریٹائرمنٹ/VPS، علاج ہیلتھ پلانز، اہلیت اور ضروری دستاویزات، شرعی اصولوں، ادائیگیوں اور کلیمز کے بارے میں تفصیلی اور مستند معلومات فراہم کرنے کے لیے حاضر ہوں۔'
        : 'Assalam-o-Alaikum! I am the Pak-Qatar Assistant for Pak-Qatar Family Takaful Limited (PQFTL). Ask me in English or Urdu about Family Savings, Child Education, Retirement & VPS, Elaaj Health plans, eligibility, required documents, Shariah principles, payments, or claims.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    mode: 'live-ai',
    sources: ['Pak-Qatar Family Takaful Verified Knowledge Base'],
    knowledgeBaseUpdatedAt: '27 Nov 2026',
  };
}

function isUrduString(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

/**
 * Safely renders inline **bold** segments without raw HTML injection.
 */
function renderInlineBold(line: string, keyPrefix: string): React.ReactNode {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={`${keyPrefix}-${idx}`} className="font-bold text-[#1E2022]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={`${keyPrefix}-${idx}`}>{part}</React.Fragment>;
  });
}

function renderFormattedAssistantText(text: string): React.ReactNode {
  const lines = text.split('\n');
  return lines.map((rawLine, lineIdx) => {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      return <div key={`sp-${lineIdx}`} className="h-1.5" />;
    }
    const cleanHeading = trimmed.replace(/^#{1,4}\s+/, '');
    const cleanBullet = cleanHeading.replace(/^[-*]\s+/, '• ');
    return (
      <p key={`ln-${lineIdx}`} className="leading-relaxed">
        {renderInlineBold(cleanBullet, `ln-${lineIdx}`)}
      </p>
    );
  });
}

/**
 * Builds strict alternating user -> model pairs from confirmed live-ai turns only.
 * Orphaned failed user turns are excluded so Gemini never receives consecutive user turns.
 */
function buildCleanApiHistory(
  msgs: ChatMessage[],
  stopBeforeMsgId?: string
): Array<{ role: 'user' | 'model'; text: string }> {
  const limitIdx = stopBeforeMsgId
    ? msgs.findIndex((m) => m.id === stopBeforeMsgId)
    : msgs.length;
  const slice = limitIdx === -1 ? msgs : msgs.slice(0, limitIdx);

  const pairs: Array<{ role: 'user' | 'model'; text: string }> = [];
  for (let i = 0; i < slice.length; i++) {
    const cur = slice[i];
    if (cur.id === 'pqfs-welcome-msg' || cur.isStreaming) continue;
    if (cur.role === 'user') {
      const next = slice[i + 1];
      if (
        next &&
        next.role === 'assistant' &&
        next.mode === 'live-ai' &&
        !next.isStreaming &&
        next.text.trim()
      ) {
        pairs.push({ role: 'user', text: cur.text.trim() });
        pairs.push({ role: 'model', text: next.text.trim() });
        i++; // skip paired assistant reply
      }
    }
  }
  return pairs.slice(-8);
}

const ASSISTANT_POS_STORAGE_KEY = 'pqfs_assistant_pos_v1';
const FLOAT_BTN_SIZE = 48;
const FLOAT_EDGE_MARGIN = 12;
const STREAM_TIMEOUT_MS = 45_000;

interface StoredRatios {
  rx: number;
  ry: number;
}

function getSafeBounds(hasBottomNav: boolean) {
  if (typeof window === 'undefined') {
    return { minX: 12, maxX: 300, minY: 12, maxY: 500 };
  }
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isMobileNav = hasBottomNav && vw < 1024;
  const bottomReserve = isMobileNav ? 72 : FLOAT_EDGE_MARGIN;
  const minX = FLOAT_EDGE_MARGIN;
  const maxX = Math.max(minX, vw - FLOAT_BTN_SIZE - FLOAT_EDGE_MARGIN);
  const minY = FLOAT_EDGE_MARGIN;
  const maxY = Math.max(minY, vh - FLOAT_BTN_SIZE - bottomReserve);
  return { minX, maxX, minY, maxY };
}

function snapRatioX(rx: number): number {
  return rx < 0.5 ? 0 : 1;
}

function loadSavedRatios(): StoredRatios {
  if (typeof window === 'undefined') return { rx: 1, ry: 1 };
  try {
    const raw = window.localStorage.getItem(ASSISTANT_POS_STORAGE_KEY);
    if (!raw) return { rx: 1, ry: 1 };
    const parsed = JSON.parse(raw) as { rx?: unknown; ry?: unknown };
    const rawRx =
      typeof parsed.rx === 'number' && Number.isFinite(parsed.rx)
        ? Math.max(0, Math.min(1, parsed.rx))
        : 1;
    const ry =
      typeof parsed.ry === 'number' && Number.isFinite(parsed.ry)
        ? Math.max(0, Math.min(1, parsed.ry))
        : 1;
    return { rx: snapRatioX(rawRx), ry };
  } catch {
    return { rx: 1, ry: 1 };
  }
}

function ratiosToPixels(ratios: StoredRatios, hasBottomNav: boolean) {
  const { minX, maxX, minY, maxY } = getSafeBounds(hasBottomNav);
  const edgeRx = snapRatioX(ratios.rx);
  return {
    x: edgeRx === 0 ? minX : maxX,
    y: Math.round(minY + ratios.ry * (maxY - minY)),
  };
}

function pixelsToRatios(x: number, y: number, hasBottomNav: boolean): StoredRatios {
  const { minX, maxX, minY, maxY } = getSafeBounds(hasBottomNav);
  const spanY = Math.max(1, maxY - minY);
  const distLeft = x - minX;
  const distRight = maxX - x;
  return {
    rx: distLeft < distRight ? 0 : 1,
    ry: Math.max(0, Math.min(1, (y - minY) / spanY)),
  };
}

interface SseFallbackPayload {
  errorCode?: string;
  statusCode?: number;
  message?: string;
  knowledgeBaseUpdatedAt?: string;
  knowledgeMatches?: KnowledgeMatch[];
  suggestedAction?: AssistantNavigationAction;
}

interface SseDonePayload {
  reply?: string;
  suggestedAction?: AssistantNavigationAction;
  sources?: string[];
  knowledgeBaseUpdatedAt?: string;
  authenticatedAccess?: boolean;
  mode?: 'live-ai' | 'privacy-guard';
}

export const PakQatarAssistant: React.FC<PakQatarAssistantProps> = ({
  visible,
  hasBottomNav,
  isAuthenticated,
  authToken,
  appLanguage,
  certificates,
  payments,
  claims,
  onNavigateAction,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [chatLang, setChatLang] = useState<LanguageCode>(appLanguage);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [getWelcomeMessage(appLanguage)]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [hasFirstStreamChunk, setHasFirstStreamChunk] = useState(false);

  const [savedRatios, setSavedRatios] = useState<StoredRatios>(() => loadSavedRatios());
  const [pos, setPos] = useState<{ x: number; y: number }>(() =>
    ratiosToPixels(loadSavedRatios(), hasBottomNav)
  );
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    active: boolean;
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startX: number;
    startY: number;
    moved: boolean;
  }>({
    active: false,
    pointerId: -1,
    startClientX: 0,
    startClientY: 0,
    startX: 0,
    startY: 0,
    moved: false,
  });

  const [aiStatus, setAiStatus] = useState<{
    checked: boolean;
    aiConfigured: boolean;
    knowledgeBaseUpdatedAt: string;
  }>({
    checked: false,
    aiConfigured: true,
    knowledgeBaseUpdatedAt: '27 Nov 2026',
  });

  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const activeAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setChatLang(appLanguage);
  }, [appLanguage]);

  // Keep icon inside safe visible screen boundaries across screen changes & viewport resizes
  useEffect(() => {
    const syncPosition = () => {
      if (dragRef.current.active) return;
      setPos(ratiosToPixels(savedRatios, hasBottomNav));
    };
    syncPosition();
    window.addEventListener('resize', syncPosition);
    return () => window.removeEventListener('resize', syncPosition);
  }, [savedRatios, hasBottomNav]);

  useEffect(() => {
    const win = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    setVoiceSupported(Boolean(win.SpeechRecognition || win.webkitSpeechRecognition));
  }, []);

  useEffect(() => {
    if (!open) return;
    let active = true;
    fetch('/api/assistant/status')
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (
          data: {
            aiConfigured?: boolean;
            knowledgeBaseUpdatedAt?: string;
          } | null
        ) => {
          if (active && data) {
            setAiStatus({
              checked: true,
              aiConfigured: Boolean(data.aiConfigured),
              knowledgeBaseUpdatedAt: data.knowledgeBaseUpdatedAt || '27 Nov 2026',
            });
          }
        }
      )
      .catch(() => {
        if (active) {
          setAiStatus((prev) => ({ ...prev, checked: true, aiConfigured: false }));
        }
      });
    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      scrollEndRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  }, [messages, isSending, open, prefersReducedMotion]);

  useEffect(() => {
    return () => {
      activeAbortRef.current?.abort();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore cleanup stop errors
        }
      }
    };
  }, []);

  if (!visible) return null;

  const sendMessage = async (
    rawText: string,
    retryOpts?: { removeMsgId: string; existingUserMsgId?: string }
  ) => {
    const trimmed = rawText.trim();
    if (!trimmed || isSending) return;

    setVoiceNotice(null);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = retryOpts?.existingUserMsgId || `usr-${Date.now()}`;
    const streamMsgId = `ast-${Date.now() + 1}`;

    const nextHistory = buildCleanApiHistory(messages, retryOpts?.existingUserMsgId);

    if (retryOpts) {
      setMessages((prev) => prev.filter((m) => m.id !== retryOpts.removeMsgId));
    } else {
      const userMsg: ChatMessage = {
        id: userMsgId,
        role: 'user',
        text: trimmed,
        timestamp: nowTime,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue('');
    }

    setIsSending(true);
    setHasFirstStreamChunk(false);

    activeAbortRef.current?.abort();
    const abortController = new AbortController();
    activeAbortRef.current = abortController;
    let didTimeout = false;
    const timeoutTimer = window.setTimeout(() => {
      didTimeout = true;
      abortController.abort();
    }, STREAM_TIMEOUT_MS);

    let accumulatedText = '';
    let insertedStreamBubble = false;
    let receivedTerminalEvent = false;

    const pushFallbackMessage = (fallback: SseFallbackPayload, isOffline = false) => {
      receivedTerminalEvent = true;
      const isNotConfigured =
        fallback.errorCode === 'AI_NOT_CONFIGURED' || fallback.statusCode === 503;
      if (isNotConfigured) {
        setAiStatus((prev) => ({
          ...prev,
          checked: true,
          aiConfigured: false,
        }));
      }

      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text:
          fallback.message ||
          (chatLang === 'ur'
            ? 'اس وقت لائیو اے آئی سروس دستیاب نہیں ہے۔ ذیل میں تصدیق شدہ پاک قطر معلومات اور آفیشل ہیلپ لائن ملاحظہ کریں۔'
            : 'Live AI service is currently unavailable. Please review verified Pak-Qatar excerpts or contact our official helpline below.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: isNotConfigured || (fallback.knowledgeMatches?.length ?? 0) > 0
          ? 'fallback-reference'
          : 'error',
        knowledgeMatches: fallback.knowledgeMatches,
        knowledgeBaseUpdatedAt:
          fallback.knowledgeBaseUpdatedAt || aiStatus.knowledgeBaseUpdatedAt,
        suggestedAction: fallback.suggestedAction || (isOffline ? 'support' : 'none'),
        retryPrompt: trimmed,
        pairedUserMsgId: userMsgId,
      };

      setMessages((prev) => {
        const cleaned = insertedStreamBubble
          ? prev.filter((m) => m.id !== streamMsgId)
          : prev;
        return [...cleaned, fallbackMsg];
      });
    };

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream, application/json',
      };
      if (isAuthenticated && authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const payload: Record<string, unknown> = {
        message: trimmed,
        language: isUrduString(trimmed) ? 'ur' : chatLang,
        history: nextHistory,
        stream: true,
      };

      if (isAuthenticated && authToken) {
        payload.accountSnapshot = {
          certificates,
          payments,
          claims,
        };
      }

      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: abortController.signal,
      });

      const contentType = res.headers.get('content-type') || '';

      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as SseFallbackPayload;
        pushFallbackMessage(errData);
        return;
      }

      // Handle SSE streaming response incrementally word-by-word
      if (contentType.includes('text/event-stream') && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let sseBuffer = '';

        const processSseBlock = (block: string) => {
          const lines = block.split(/\r?\n/);
          let eventName = 'message';
          const dataLines: string[] = [];
          for (const line of lines) {
            if (line.startsWith('event:')) {
              eventName = line.slice(6).trim();
            } else if (line.startsWith('data:')) {
              dataLines.push(line.slice(5).trimStart());
            }
          }
          if (dataLines.length === 0) return;

          const dataStr = dataLines.join('\n');
          let parsed: unknown;
          try {
            parsed = JSON.parse(dataStr);
          } catch {
            return;
          }

          if (eventName === 'chunk') {
            const delta = (parsed as { delta?: unknown }).delta;
            if (typeof delta === 'string' && delta.length > 0) {
              accumulatedText += delta;
              if (!insertedStreamBubble) {
                insertedStreamBubble = true;
                setHasFirstStreamChunk(true);
                setMessages((prev) => [
                  ...prev,
                  {
                    id: streamMsgId,
                    role: 'assistant',
                    text: accumulatedText,
                    timestamp: new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                    mode: 'live-ai',
                    isStreaming: true,
                  },
                ]);
              } else {
                const snapshotText = accumulatedText;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === streamMsgId ? { ...m, text: snapshotText } : m
                  )
                );
              }
            }
          } else if (eventName === 'done') {
            receivedTerminalEvent = true;
            const doneData = parsed as SseDonePayload;
            setAiStatus((prev) => ({
              ...prev,
              checked: true,
              aiConfigured: true,
              knowledgeBaseUpdatedAt:
                doneData.knowledgeBaseUpdatedAt || prev.knowledgeBaseUpdatedAt,
            }));

            const finalText =
              typeof doneData.reply === 'string' && doneData.reply.trim()
                ? doneData.reply.trim()
                : accumulatedText.trim() ||
                  'I could not generate a response for that query.';

            const finalMsg: ChatMessage = {
              id: streamMsgId,
              role: 'assistant',
              text: finalText,
              timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              mode: doneData.mode || 'live-ai',
              isStreaming: false,
              suggestedAction: doneData.suggestedAction || 'none',
              sources: doneData.sources,
              knowledgeBaseUpdatedAt:
                doneData.knowledgeBaseUpdatedAt || aiStatus.knowledgeBaseUpdatedAt,
              authenticatedAccess: doneData.authenticatedAccess,
            };

            setMessages((prev) =>
              insertedStreamBubble
                ? prev.map((m) => (m.id === streamMsgId ? finalMsg : m))
                : [...prev, finalMsg]
            );
          } else if (eventName === 'fallback') {
            pushFallbackMessage(parsed as SseFallbackPayload);
          }
        };

        while (true) {
          const { value, done } = await reader.read();
          if (value) {
            sseBuffer += decoder.decode(value, { stream: true });
            const blocks = sseBuffer.split(/\r?\n\r?\n/);
            sseBuffer = blocks.pop() ?? '';
            for (const block of blocks) {
              if (block.trim()) processSseBlock(block);
            }
          }
          if (done) {
            sseBuffer += decoder.decode();
            if (sseBuffer.trim()) {
              processSseBlock(sseBuffer);
            }
            break;
          }
        }

        if (!receivedTerminalEvent) {
          if (accumulatedText.trim()) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === streamMsgId
                  ? {
                      ...m,
                      text: accumulatedText.trim(),
                      isStreaming: false,
                      sources: ['Pak-Qatar Family Takaful Verified Knowledge Base'],
                      knowledgeBaseUpdatedAt: aiStatus.knowledgeBaseUpdatedAt,
                    }
                  : m
              )
            );
          } else {
            pushFallbackMessage({
              errorCode: 'STREAM_INCOMPLETE',
              message:
                chatLang === 'ur'
                  ? 'جواب مکمل ہونے سے پہلے رابطہ منقطع ہو گیا۔ براہِ کرم دوبارہ کوشش کریں یا آفیشل ہیلپ لائن سے مدد لیں۔'
                  : 'The live response ended unexpectedly. Please retry or contact our official UAN helpline below.',
              suggestedAction: 'support',
            });
          }
        }
        return;
      }

      // Synchronous JSON fallback response handling
      const data = (await res.json().catch(() => ({}))) as SseDonePayload;
      setAiStatus((prev) => ({
        ...prev,
        checked: true,
        aiConfigured: true,
        knowledgeBaseUpdatedAt:
          data.knowledgeBaseUpdatedAt || prev.knowledgeBaseUpdatedAt,
      }));

      const replyMsg: ChatMessage = {
        id: streamMsgId,
        role: 'assistant',
        text: data.reply || 'I could not generate a response for that query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: data.mode || 'live-ai',
        suggestedAction: data.suggestedAction || 'none',
        sources: data.sources,
        knowledgeBaseUpdatedAt:
          data.knowledgeBaseUpdatedAt || aiStatus.knowledgeBaseUpdatedAt,
        authenticatedAccess: data.authenticatedAccess,
      };
      setMessages((prev) => [...prev, replyMsg]);
    } catch (err) {
      const wasUserCleared =
        err instanceof Error && err.name === 'AbortError' && !didTimeout;
      if (wasUserCleared) {
        return;
      }
      pushFallbackMessage(
        {
          errorCode: didTimeout ? 'AI_TIMEOUT' : 'NETWORK_ERROR',
          message: didTimeout
            ? chatLang === 'ur'
              ? 'جواب موصول ہونے میں توقع سے زیادہ وقت لگا۔ براہِ کرم دوبارہ کوشش کریں یا آفیشل پاک قطر ہیلپ لائن پر رابطہ کریں۔'
              : 'The assistant took too long to respond. Please retry or contact Pak-Qatar official support below.'
            : chatLang === 'ur'
              ? 'سرور سے رابطہ منقطع ہو گیا ہے۔ براہِ کرم اپنا انٹرنیٹ چیک کریں اور دوبارہ کوشش کریں۔'
              : 'Unable to connect to the Pak-Qatar Assistant server. Please check your connection, retry, or reach our official UAN support below.',
          suggestedAction: 'support',
        },
        true
      );
    } finally {
      window.clearTimeout(timeoutTimer);
      if (activeAbortRef.current === abortController) {
        activeAbortRef.current = null;
      }
      setIsSending(false);
      setHasFirstStreamChunk(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!voiceSupported) {
      setVoiceNotice(
        chatLang === 'ur'
          ? 'آپ کے براؤزر میں وائس ان پٹ دستیاب نہیں ہے۔'
          : 'Voice input is not supported in this browser.'
      );
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const win = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRec) return;

    try {
      setVoiceNotice(null);
      const recognition = new SpeechRec();
      recognition.lang = chatLang === 'ur' ? 'ur-PK' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript?.trim();
        if (transcript) {
          setInputValue(transcript);
        }
      };
      recognition.onerror = () => {
        setVoiceNotice(
          chatLang === 'ur'
            ? 'آواز ریکارڈ کرنے میں دشواری پیش آئی۔ براہِ کرم ٹائپ کریں۔'
            : 'Could not capture voice audio. Please type your question or check microphone permissions.'
        );
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      setIsListening(true);
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceNotice('Voice recognition could not start.');
    }
  };

  const clearHistory = () => {
    activeAbortRef.current?.abort();
    activeAbortRef.current = null;
    setIsSending(false);
    setHasFirstStreamChunk(false);
    setMessages([getWelcomeMessage(chatLang)]);
    setVoiceNotice(null);
  };

  const suggestedQuestions =
    chatLang === 'ur' ? SUGGESTED_QUESTIONS_UR : SUGGESTED_QUESTIONS_EN;

  const handleActionClick = (action: AssistantNavigationAction) => {
    if (action === 'none') return;
    setOpen(false);
    onNavigateAction(action);
  };

  const snapAndSavePosition = (releaseX: number, releaseY: number) => {
    const { minX, maxX, minY, maxY } = getSafeBounds(hasBottomNav);
    const clampedX = Math.max(minX, Math.min(maxX, releaseX));
    const finalY = Math.max(minY, Math.min(maxY, releaseY));
    const snappedX = clampedX - minX < maxX - clampedX ? minX : maxX;

    setPos({ x: snappedX, y: finalY });
    const nextRatios = pixelsToRatios(snappedX, finalY, hasBottomNav);
    setSavedRatios(nextRatios);
    try {
      window.localStorage.setItem(ASSISTANT_POS_STORAGE_KEY, JSON.stringify(nextRatios));
    } catch {
      // ignore storage restrictions
    }
  };

  const handleTriggerPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: pos.x,
      startY: pos.y,
      moved: false,
    };
    setIsDragging(true);
  };

  const handleTriggerPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current.active || dragRef.current.pointerId !== e.pointerId) return;
    const dx = e.clientX - dragRef.current.startClientX;
    const dy = e.clientY - dragRef.current.startClientY;

    if (!dragRef.current.moved && Math.hypot(dx, dy) > 6) {
      dragRef.current.moved = true;
    }

    if (dragRef.current.moved) {
      const { minX, maxX, minY, maxY } = getSafeBounds(hasBottomNav);
      const clampedX = Math.max(minX, Math.min(maxX, Math.round(dragRef.current.startX + dx)));
      const clampedY = Math.max(minY, Math.min(maxY, Math.round(dragRef.current.startY + dy)));
      setPos({ x: clampedX, y: clampedY });
    }
  };

  const handleTriggerPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current.active || dragRef.current.pointerId !== e.pointerId) return;
    const wasMoved = dragRef.current.moved;
    const dx = e.clientX - dragRef.current.startClientX;
    const dy = e.clientY - dragRef.current.startClientY;
    const releaseX = Math.round(dragRef.current.startX + dx);
    const releaseY = Math.round(dragRef.current.startY + dy);

    dragRef.current.active = false;
    setIsDragging(false);

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore pointer release edge cases
    }

    if (wasMoved) {
      snapAndSavePosition(releaseX, releaseY);
    } else {
      setOpen(true);
    }
  };

  const handleTriggerPointerCancel = () => {
    const wasMoved = dragRef.current.active && dragRef.current.moved;
    dragRef.current.active = false;
    setIsDragging(false);
    if (wasMoved) {
      snapAndSavePosition(pos.x, pos.y);
    }
  };

  return (
    <>
      {/* Compact Draggable Floating AI Assistant Icon */}
      {!open && (
        <button
          type="button"
          data-no-press="true"
          onPointerDown={handleTriggerPointerDown}
          onPointerMove={handleTriggerPointerMove}
          onPointerUp={handleTriggerPointerUp}
          onPointerCancel={handleTriggerPointerCancel}
          onClick={(e) => {
            if (e.detail === 0) setOpen(true);
          }}
          aria-label="Open Pak-Qatar AI Assistant (drag to move)"
          title={chatLang === 'ur' ? 'پاک قطر اسسٹنٹ' : 'Pak-Qatar AI Assistant'}
          style={{
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${isDragging ? 1.07 : 1})`,
            transition:
              isDragging || prefersReducedMotion
                ? 'none'
                : 'transform 340ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 180ms ease',
          }}
          className={`fixed top-0 left-0 z-40 w-12 h-12 rounded-full bg-[#007A48] hover:bg-[#00663C] border-2 border-[#F5B335] flex items-center justify-center touch-none select-none will-change-transform ${
            isDragging ? 'cursor-grabbing shadow-xl' : 'cursor-grab shadow-md hover:shadow-lg'
          }`}
        >
          <AssistantEmblem size={30} />
        </button>
      )}

      {/* Assistant Chat Panel */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-end sm:p-5">
            {/* Backdrop on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/35 backdrop-blur-xs pointer-events-auto sm:hidden"
            />

            <motion.section
              role="dialog"
              aria-modal="true"
              aria-label="Pak-Qatar Assistant"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto relative z-10 w-full sm:w-[420px] h-[85dvh] sm:h-[620px] max-h-[92dvh] bg-[#F7F5F2] rounded-t-3xl sm:rounded-3xl border border-[#E5E7EB] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Top Yellow Accent */}
              <div className="h-1 bg-[#F5B335] shrink-0" aria-hidden="true" />

              {/* Header */}
              <header className="bg-[#007A48] text-white px-4 py-3 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <AssistantEmblem size={36} />
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold truncate">
                      {chatLang === 'ur' ? 'پاک قطر اسسٹنٹ' : 'Pak-Qatar Assistant'}
                    </h2>
                    <div className="text-[11px] text-white/85 truncate">
                      {aiStatus.checked && !aiStatus.aiConfigured
                        ? chatLang === 'ur'
                          ? 'تصدیق شدہ پاک قطر گائیڈ موڈ'
                          : 'Verified PQFTL Reference Mode'
                        : chatLang === 'ur'
                          ? `پاک قطر فیملی تکافل · اپڈیٹ ${aiStatus.knowledgeBaseUpdatedAt}`
                          : `PQFTL Verified Knowledge · ${aiStatus.knowledgeBaseUpdatedAt}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setChatLang((l) => (l === 'en' ? 'ur' : 'en'))}
                    aria-label="Switch assistant language"
                    className="min-h-[34px] px-2.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold text-white transition-colors"
                  >
                    {chatLang === 'en' ? 'اردو' : 'EN'}
                  </button>
                  <button
                    type="button"
                    onClick={clearHistory}
                    aria-label="Clear conversation history"
                    title="Reset chat"
                    className="min-h-[38px] min-w-[38px] rounded-xl hover:bg-white/15 flex items-center justify-center text-white transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close Pak-Qatar Assistant"
                    className="min-h-[38px] min-w-[38px] rounded-xl hover:bg-white/15 flex items-center justify-center text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </header>

              {/* Auth & Privacy Bar */}
              <div
                className={`px-4 py-2 border-b border-[#E5E7EB] text-[11px] flex items-center justify-between gap-2 shrink-0 ${
                  isAuthenticated && authToken ? 'bg-[#EAF3EE]' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0 text-[#1E2022]">
                  {isAuthenticated && authToken ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#007A48] shrink-0" />
                      <span className="truncate font-medium">
                        {chatLang === 'ur'
                          ? `لاگ ان: ${DEMO_CUSTOMER.fullName} (ڈیمو پورٹ فولیو)`
                          : `Signed in: ${DEMO_CUSTOMER.fullName} · Do not share OTPs/PINs`}
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-[#A32035] shrink-0" />
                      <span className="truncate text-[#5C6066]">
                        {chatLang === 'ur'
                          ? 'مہمان موڈ · ذاتی کلیمز کے لیے لاگ ان کریں'
                          : 'Guest mode · Never share passwords or OTPs'}
                      </span>
                    </>
                  )}
                </div>

                {!isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => handleActionClick('login')}
                    className="text-[11px] font-bold text-[#A32035] hover:underline whitespace-nowrap shrink-0"
                  >
                    {chatLang === 'ur' ? 'لاگ ان' : 'Sign In'}
                  </button>
                )}
              </div>

              {/* Chat Messages List */}
              <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  const rtl = isUrduString(msg.text);

                  if (isUser) {
                    return (
                      <div key={msg.id} className="flex justify-end">
                        <div
                          dir={rtl ? 'rtl' : 'ltr'}
                          className="max-w-[85%] rounded-2xl rounded-br-sm bg-[#A32035] text-white px-3.5 py-2.5 text-[13px] leading-relaxed shadow-xs"
                        >
                          <p className="whitespace-pre-line">{msg.text}</p>
                          <div className="mt-1 text-[10px] text-white/75 text-right tabular-nums">
                            {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  const isFallbackOrError =
                    msg.mode === 'fallback-reference' || msg.mode === 'error';

                  return (
                    <div key={msg.id} className="flex justify-start">
                      <div
                        dir={rtl ? 'rtl' : 'ltr'}
                        className={`max-w-[92%] rounded-2xl rounded-bl-sm bg-white border px-3.5 py-3 text-[13px] text-[#1E2022] leading-relaxed shadow-xs space-y-2.5 ${
                          isFallbackOrError
                            ? 'border-[#F5B335]'
                            : msg.mode === 'privacy-guard'
                              ? 'border-[#A32035]/40'
                              : 'border-[#E5E7EB]'
                        }`}
                      >
                        {isFallbackOrError && (
                          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#F5B335]/15 text-xs text-[#1E2022]">
                            <AlertCircle className="w-4 h-4 text-[#A32035] shrink-0 mt-0.5" />
                            <div>
                              <div className="font-bold">
                                {chatLang === 'ur'
                                  ? 'تصدیق شدہ پاک قطر معلومات اور معاونت'
                                  : 'Verified PQFTL Excerpts & Support'}
                              </div>
                              <p className="text-[11px] text-[#5C6066] mt-0.5">{msg.text}</p>
                            </div>
                          </div>
                        )}

                        {!isFallbackOrError && (
                          <div className="space-y-1 text-[13px] text-[#1E2022]">
                            {renderFormattedAssistantText(msg.text)}
                            {msg.isStreaming && (
                              <span
                                aria-hidden="true"
                                className="inline-block w-1.5 h-3.5 ml-1 align-middle bg-[#007A48] animate-pulse rounded-xs"
                              />
                            )}
                          </div>
                        )}

                        {/* Official Knowledge Base Excerpts & UAN Support when AI is unavailable */}
                        {isFallbackOrError && (
                          <div className="space-y-2 pt-0.5">
                            {msg.knowledgeMatches && msg.knowledgeMatches.length > 0 && (
                              <>
                                <div className="text-[11px] font-bold text-[#007A48]">
                                  {chatLang === 'ur'
                                    ? 'تصدیق شدہ پاک قطر فیملی تکافل حوالہ جات:'
                                    : 'Verified PQFTL Knowledge Excerpts:'}
                                </div>
                                {msg.knowledgeMatches.map((km) => (
                                  <div
                                    key={km.id}
                                    className="p-2.5 rounded-xl bg-[#EAF3EE]/70 border border-[#007A48]/15 text-xs"
                                  >
                                    <div className="font-bold text-[#1E2022]">{km.title}</div>
                                    <p className="text-[11px] text-[#5C6066] mt-1 leading-relaxed">
                                      {km.excerpt}
                                    </p>
                                    <div className="mt-1 text-[10px] text-[#007A48]">
                                      {km.sourceLabel} · Updated {km.lastUpdated}
                                    </div>
                                  </div>
                                ))}
                              </>
                            )}

                            {/* Always show official Pak-Qatar UAN & Email support card */}
                            <div className="p-2.5 rounded-xl bg-[#F7F5F2] border border-[#E5E7EB] text-[11px] text-[#1E2022] space-y-1">
                              <div className="font-bold text-[#A32035]">
                                {chatLang === 'ur'
                                  ? 'آفیشل پاک قطر ہیلپ لائن'
                                  : 'Official Pak-Qatar Customer Support'}
                              </div>
                              <div className="flex items-center gap-1.5 text-[#1E2022]">
                                <PhoneCall className="w-3.5 h-3.5 text-[#007A48] shrink-0" />
                                <span className="font-semibold">
                                  UAN: {PQFS_VERIFIED_CONTACT.uan}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[#5C6066]">
                                <Mail className="w-3.5 h-3.5 text-[#007A48] shrink-0" />
                                <span>
                                  {PQFS_VERIFIED_CONTACT.email} · {PQFS_VERIFIED_CONTACT.website}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action Button from Verified AI Navigation Hint */}
                        {!msg.isStreaming &&
                          msg.suggestedAction &&
                          msg.suggestedAction !== 'none' && (
                            <button
                              type="button"
                              onClick={() => handleActionClick(msg.suggestedAction!)}
                              className="w-full min-h-[38px] px-3 py-1.5 rounded-xl bg-[#EAF3EE] hover:bg-[#007A48] text-[#007A48] hover:text-white text-xs font-semibold flex items-center justify-between transition-colors"
                            >
                              <span>
                                {chatLang === 'ur'
                                  ? ACTION_LABELS_UR[msg.suggestedAction]
                                  : ACTION_LABELS_EN[msg.suggestedAction]}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                            </button>
                          )}

                        {/* In-place Retry button without duplicating user messages */}
                        {msg.retryPrompt && isFallbackOrError && (
                          <button
                            type="button"
                            disabled={isSending}
                            onClick={() =>
                              void sendMessage(msg.retryPrompt!, {
                                removeMsgId: msg.id,
                                existingUserMsgId: msg.pairedUserMsgId,
                              })
                            }
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A32035] hover:underline disabled:opacity-50"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>
                              {chatLang === 'ur' ? 'لائیو جواب دوبارہ حاصل کریں' : 'Retry Live Answer'}
                            </span>
                          </button>
                        )}

                        {/* Source & Last Updated Footer */}
                        {!msg.isStreaming && (
                          <div className="pt-1.5 border-t border-[#E5E7EB]/70 flex flex-wrap items-center justify-between gap-1 text-[10px] text-[#5C6066]">
                            <span className="truncate max-w-[230px]">
                              {msg.sources && msg.sources.length > 0
                                ? `${msg.sources[0]}${msg.authenticatedAccess ? ' · Account Linked' : ''}`
                                : 'Official PQFTL Channel'}
                            </span>
                            <span className="tabular-nums">
                              {msg.knowledgeBaseUpdatedAt
                                ? `Updated ${msg.knowledgeBaseUpdatedAt}`
                                : msg.timestamp}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator shown cleanly until the first streamed chunk arrives */}
                {isSending && !hasFirstStreamChunk && (
                  <div
                    className="flex justify-start"
                    aria-live="polite"
                    aria-label="Assistant is typing"
                  >
                    <div className="rounded-2xl rounded-bl-sm bg-white border border-[#E5E7EB] px-4 py-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#007A48] animate-bounce" />
                      <span
                        className="w-2 h-2 rounded-full bg-[#F5B335] animate-bounce"
                        style={{ animationDelay: '120ms' }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-[#A32035] animate-bounce"
                        style={{ animationDelay: '240ms' }}
                      />
                      <span className="text-[11px] text-[#5C6066] ml-1">
                        {chatLang === 'ur' ? 'جواب تیار ہو رہا ہے...' : 'Preparing answer...'}
                      </span>
                    </div>
                  </div>
                )}

                <div ref={scrollEndRef} />
              </div>

              {/* Suggested Quick Questions */}
              <div className="px-3.5 py-2 bg-white border-t border-[#E5E7EB] shrink-0">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      disabled={isSending}
                      onClick={() => void sendMessage(q)}
                      className="min-h-[34px] px-3 py-1 rounded-full bg-[#EAF3EE] hover:bg-[#007A48] text-[#007A48] hover:text-white border border-[#007A48]/20 text-xs font-medium whitespace-nowrap shrink-0 transition-colors disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Composer + Voice Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendMessage(inputValue);
                }}
                className="p-3 bg-white border-t border-[#E5E7EB] shrink-0 space-y-1.5"
              >
                {voiceNotice && (
                  <div className="text-[11px] text-[#A32035] px-1">{voiceNotice}</div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                    title={voiceSupported ? 'Voice input' : 'Voice input unsupported on this browser'}
                    className={`min-h-[44px] min-w-[44px] rounded-2xl border flex items-center justify-center transition-colors shrink-0 ${
                      isListening
                        ? 'bg-[#A32035] text-white border-[#A32035]'
                        : voiceSupported
                          ? 'bg-[#F7F5F2] text-[#007A48] border-[#E5E7EB] hover:border-[#007A48]'
                          : 'bg-[#F7F5F2] text-[#5C6066]/60 border-[#E5E7EB]'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <input
                    type="text"
                    dir={chatLang === 'ur' || isUrduString(inputValue) ? 'rtl' : 'ltr'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      isListening
                        ? chatLang === 'ur'
                          ? 'سن رہے ہیں...'
                          : 'Listening...'
                        : chatLang === 'ur'
                          ? 'اپنا سوال لکھیں...'
                          : 'Ask about plans, eligibility, documents, or claims...'
                    }
                    className="flex-1 min-h-[44px] px-3.5 rounded-2xl border border-[#E5E7EB] bg-[#F7F5F2] text-sm text-[#1E2022] placeholder:text-[#5C6066] focus:outline-none focus:border-[#007A48]"
                  />

                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isSending}
                    aria-label="Send message"
                    className="min-h-[44px] min-w-[44px] rounded-2xl bg-[#A32035] hover:opacity-90 disabled:opacity-45 text-white flex items-center justify-center transition-opacity shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
