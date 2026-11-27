import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  ArrowRight,
  Lock,
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
  suggestedAction?: AssistantNavigationAction;
  sources?: string[];
  knowledgeBaseUpdatedAt?: string;
  authenticatedAccess?: boolean;
  knowledgeMatches?: KnowledgeMatch[];
  retryPrompt?: string;
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
  'Explore Elaaj Health & Education Plans',
  'How does Takaful work?',
  'How can I make a payment?',
  'How do I submit a claim?',
  'Track My Claim',
];

const SUGGESTED_QUESTIONS_UR = [
  'فیملی تکافل پلانز دیکھیں',
  'علاج ہیلتھ اور تعلیمی پلانز دیکھیں',
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
 * Geometric Islamic 8-Point Star & Conversation Mark (zero female avatars or depictions).
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
        ? 'السلام علیکم! میں پاک قطر اسسٹنٹ ہوں۔ میں پاک قطر فیملی تکافل (PQFTL) کے بچت، تعلیم، ریٹائرمنٹ/VPS، علاج ہیلتھ پلانز، شرعی اصولوں، ادائیگیوں اور کلیمز کے بارے میں مستند معلومات فراہم کرنے کے لیے حاضر ہوں۔'
        : 'Assalam-o-Alaikum! I am the Pak-Qatar Assistant for Pak-Qatar Family Takaful (PQFTL). Ask me in English or Urdu about Family Savings, Child Education, Retirement & VPS, Elaaj Health plans, Shariah concepts, payments, certificates, or claim guidance.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    mode: 'live-ai',
    sources: ['Pak-Qatar Family Takaful Verified Knowledge Base'],
    knowledgeBaseUpdatedAt: '26 Nov 2026',
  };
}

function isUrduString(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

const ASSISTANT_POS_STORAGE_KEY = 'pqfs_assistant_pos_v1';
const FLOAT_BTN_SIZE = 48;
const FLOAT_EDGE_MARGIN = 12;

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
    knowledgeBaseUpdatedAt: '26 Nov 2026',
  });

  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

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
              knowledgeBaseUpdatedAt: data.knowledgeBaseUpdatedAt || '26 Nov 2026',
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

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isSending) return;

    setVoiceNotice(null);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: nowTime,
    };

    const nextHistory = messages
      .filter((m) => m.id !== 'pqfs-welcome-msg' && (m.mode === 'live-ai' || m.role === 'user'))
      .slice(-8)
      .map((m) => ({
        role: m.role === 'user' ? ('user' as const) : ('model' as const),
        text: m.text,
      }));

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsSending(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (isAuthenticated && authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const payload: Record<string, unknown> = {
        message: trimmed,
        language: isUrduString(trimmed) ? 'ur' : chatLang,
        history: nextHistory,
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
      });

      const data = (await res.json().catch(() => ({}))) as {
        reply?: string;
        suggestedAction?: AssistantNavigationAction;
        sources?: string[];
        knowledgeBaseUpdatedAt?: string;
        authenticatedAccess?: boolean;
        mode?: 'live-ai' | 'privacy-guard';
        errorCode?: string;
        message?: string;
        knowledgeMatches?: KnowledgeMatch[];
      };

      if (!res.ok) {
        const isNotConfigured = res.status === 503 && data.errorCode === 'AI_NOT_CONFIGURED';
        if (isNotConfigured) {
          setAiStatus((prev) => ({
            ...prev,
            checked: true,
            aiConfigured: false,
          }));
        }

        const errMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text:
            data.message ||
            (chatLang === 'ur'
              ? 'اس وقت لائیو اے آئی سروس دستیاب نہیں ہے۔'
              : 'Live AI service is currently unavailable.'),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: isNotConfigured ? 'fallback-reference' : 'error',
          knowledgeMatches: data.knowledgeMatches,
          knowledgeBaseUpdatedAt: data.knowledgeBaseUpdatedAt || aiStatus.knowledgeBaseUpdatedAt,
          retryPrompt: trimmed,
        };
        setMessages((prev) => [...prev, errMsg]);
        return;
      }

      setAiStatus((prev) => ({
        ...prev,
        checked: true,
        aiConfigured: true,
        knowledgeBaseUpdatedAt: data.knowledgeBaseUpdatedAt || prev.knowledgeBaseUpdatedAt,
      }));

      const replyMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'I could not generate a response for that query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: data.mode || 'live-ai',
        suggestedAction: data.suggestedAction || 'none',
        sources: data.sources,
        knowledgeBaseUpdatedAt: data.knowledgeBaseUpdatedAt || aiStatus.knowledgeBaseUpdatedAt,
        authenticatedAccess: data.authenticatedAccess,
      };
      setMessages((prev) => [...prev, replyMsg]);
    } catch {
      const offlineMsg: ChatMessage = {
        id: `net-${Date.now()}`,
        role: 'assistant',
        text:
          chatLang === 'ur'
            ? 'سرور سے رابطہ منقطع ہو گیا ہے۔ براہِ کرم اپنا انٹرنیٹ چیک کریں اور دوبارہ کوشش کریں۔'
            : 'Unable to connect to the Pak-Qatar Assistant server. Please check your connection and retry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: 'error',
        retryPrompt: trimmed,
      };
      setMessages((prev) => [...prev, offlineMsg]);
    } finally {
      setIsSending(false);
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
            // Support keyboard activation (Enter / Space) without double-firing pointer taps
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
                          ? 'ڈیمو ریفرنس موڈ · لائیو اے آئی دستیاب نہیں'
                          : 'Prototype Mode · Live AI Offline'
                        : chatLang === 'ur'
                          ? `لائیو اے آئی · اپڈیٹ ${aiStatus.knowledgeBaseUpdatedAt}`
                          : `Live AI · Verified ${aiStatus.knowledgeBaseUpdatedAt}`}
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
                                {msg.mode === 'fallback-reference'
                                  ? 'Prototype Reference Mode (Live AI Not Configured)'
                                  : 'Connection Notice'}
                              </div>
                              <p className="text-[11px] text-[#5C6066] mt-0.5">{msg.text}</p>
                            </div>
                          </div>
                        )}

                        {!isFallbackOrError && (
                          <div className="space-y-1.5 whitespace-pre-line">{msg.text}</div>
                        )}

                        {/* Official Knowledge Base Fallback Cards when AI is offline/unconfigured */}
                        {msg.knowledgeMatches && msg.knowledgeMatches.length > 0 && (
                          <div className="space-y-2 pt-1">
                            <div className="text-[11px] font-bold text-[#007A48]">
                              Verified Pak-Qatar Knowledge Base References:
                            </div>
                            {msg.knowledgeMatches.map((km) => (
                              <div
                                key={km.id}
                                className="p-2.5 rounded-xl bg-[#EAF3EE]/70 border border-[#007A48]/15 text-xs"
                              >
                                <div className="font-bold text-[#1E2022]">{km.title}</div>
                                <p className="text-[11px] text-[#5C6066] mt-0.5 line-clamp-3">
                                  {km.excerpt}
                                </p>
                                <div className="mt-1 text-[10px] text-[#007A48]">
                                  Source: {km.sourceLabel} · Updated {km.lastUpdated}
                                </div>
                              </div>
                            ))}
                            <div className="text-[11px] text-[#5C6066] flex items-center gap-1.5 pt-1">
                              <PhoneCall className="w-3.5 h-3.5 text-[#A32035] shrink-0" />
                              <span>
                                Official Support: {PQFS_VERIFIED_CONTACT.uan} ·{' '}
                                {PQFS_VERIFIED_CONTACT.email}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Action Button from Verified AI Navigation Hint */}
                        {msg.suggestedAction && msg.suggestedAction !== 'none' && (
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

                        {/* Retry button for transient errors */}
                        {msg.retryPrompt && msg.mode === 'error' && (
                          <button
                            type="button"
                            onClick={() => void sendMessage(msg.retryPrompt!)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A32035] hover:underline"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>{chatLang === 'ur' ? 'دوبارہ کوشش کریں' : 'Retry'}</span>
                          </button>
                        )}

                        {/* Source & Last Updated Footer */}
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
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isSending && (
                  <div className="flex justify-start" aria-live="polite" aria-label="Assistant is typing">
                    <div className="rounded-2xl rounded-bl-sm bg-white border border-[#E5E7EB] px-4 py-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#007A48] animate-bounce" />
                      <span
                        className="w-2 h-2 rounded-full bg-[#F5B335] animate-bounce"
                        style={{ animationDelay: '120ms' }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-[#A32035] animate-bounce"
                        style={{ animationDelay: '240ms' }}
                      />
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
                          : 'Ask about Takaful, claims, or payments...'
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
