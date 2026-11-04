import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  AUTO_REPLIES, CaseT, CheckId, Msg, SEED_CASES, SEED_MESSAGES, buildFindings, overallGrade, conclusionFor, CHECKS,
} from './data';

export type Draft = {
  address: string;
  pin: { lat: string; lng: string } | null;
  type: string;
  size: string;
  docs: string[];
  files: Record<string, string>; // document type -> attached file name
  checks: CheckId[];
  notes: string;
};

const emptyDraft: Draft = {
  address: '', pin: null, type: 'Land', size: '', docs: [], files: {}, checks: ['title', 'survey'], notes: '',
};

type Prefs = { notifications: boolean; whatsapp: boolean };

type Ctx = {
  signedIn: boolean;
  phone: string;
  signIn: (phone: string) => void;
  signOut: () => void;
  prefs: Prefs;
  setPref: (k: keyof Prefs, v: boolean) => void;
  unread: boolean;
  markRead: () => void;
  draft: Draft;
  setDraft: (p: Partial<Draft>) => void;
  resetDraft: () => void;
  cases: CaseT[];
  quote: () => { lines: { title: string; price: number }[]; subtotal: number; fee: number; total: number; days: number };
  submitCase: (paid: boolean) => string;
  advance: (id: string) => void;
  messages: Record<string, Msg[]>;
  sendMessage: (id: string, text: string) => void;
  watching: Record<string, boolean>;
  toggleWatch: (id: string) => void;
  reset: () => void;
};

const KEY = 'trace-state-v2';

type Persisted = {
  signedIn?: boolean; phone?: string; cases?: CaseT[]; messages?: Record<string, Msg[]>;
  watching?: Record<string, boolean>; prefs?: Prefs; unread?: boolean;
};

function load(): Persisted {
  try {
    if (typeof localStorage === 'undefined') return {};
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Persisted) : {};
  } catch {
    return {};
  }
}

// Deep links (anything other than /app itself) skip the sign-in screens so shared links open directly.
function deepLinked(): boolean {
  try {
    if (typeof window === 'undefined' || !window.location) return false;
    const p = window.location.pathname.replace(/\/$/, '');
    return p !== '/app' && p !== '' && p !== '/';
  } catch {
    return false;
  }
}

const StoreCtx = createContext<Ctx>(null as unknown as Ctx);
export const useStore = () => useContext(StoreCtx);

const nowHM = () => {
  const d = new Date();
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const saved = useRef(load()).current;
  const [signedIn, setSignedIn] = useState<boolean>(saved.signedIn ?? deepLinked());
  const [phone, setPhone] = useState<string>(saved.phone ?? '+234 803 555 0142');
  const [prefs, setPrefs] = useState<Prefs>(saved.prefs ?? { notifications: true, whatsapp: false });
  const [unread, setUnread] = useState<boolean>(saved.unread ?? true);
  const [draft, setD] = useState<Draft>(emptyDraft);
  const [cases, setCases] = useState<CaseT[]>(saved.cases ?? SEED_CASES);
  const [messages, setMessages] = useState<Record<string, Msg[]>>(saved.messages ?? SEED_MESSAGES);
  const [watching, setWatching] = useState<Record<string, boolean>>(saved.watching ?? { 'TR-20418': true });

  useEffect(() => {
    try {
      if (typeof localStorage === 'undefined') return;
      const data: Persisted = { signedIn, phone, cases, messages, watching, prefs, unread };
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* storage unavailable: the app still works, state just will not survive a refresh */
    }
  }, [signedIn, phone, cases, messages, watching, prefs, unread]);

  const value = useMemo<Ctx>(() => {
    const quote = () => {
      const picked = CHECKS.filter((c) => draft.checks.includes(c.id));
      const subtotal = picked.reduce((s, c) => s + c.price, 0);
      const fee = Math.round(subtotal * 0.05);
      return {
        lines: picked.map((c) => ({ title: c.title, price: c.price })),
        subtotal,
        fee,
        total: subtotal + fee,
        days: picked.length ? Math.max(...picked.map((c) => c.days)) : 0,
      };
    };
    return {
      signedIn,
      phone,
      signIn: (p) => { setPhone(p); setSignedIn(true); },
      signOut: () => setSignedIn(false),
      prefs,
      setPref: (k, v) => setPrefs((x) => ({ ...x, [k]: v })),
      unread,
      markRead: () => setUnread(false),
      draft,
      setDraft: (p) => setD((d) => ({ ...d, ...p })),
      resetDraft: () => setD(emptyDraft),
      cases,
      quote,
      submitCase: (paid) => {
        const q = quote();
        const findings = buildFindings(draft.checks);
        const overall = overallGrade(findings);
        const next = Math.max(20430, ...cases.map((c) => parseInt(c.id.replace('TR-', ''), 10) || 0)) + 1;
        const id = 'TR-' + next;
        const c: CaseT = {
          id,
          address: draft.address || 'Untitled property',
          type: draft.type,
          size: draft.size || '—',
          checks: draft.checks,
          total: q.total,
          paid,
          progress: 1,
          createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          findings,
          conclusion: conclusionFor(overall),
          overall,
        };
        setCases((cs) => [c, ...cs]);
        setMessages((m) => ({
          ...m,
          [id]: [{ id: 'w' + Date.now(), from: 'inv', text: 'Welcome to TRACE. Your case is open and the first documents review is underway. Message me here if you need to add anything.', at: nowHM() }],
        }));
        setUnread(true);
        setD(emptyDraft);
        return id;
      },
      advance: (id) =>
        setCases((cs) => cs.map((c) => (c.id === id && c.progress < 6 ? { ...c, progress: c.progress + 1 } : c))),
      messages,
      sendMessage: (id, text) => {
        const mine: Msg = { id: 'm' + Date.now(), from: 'me', text, at: nowHM() };
        setMessages((m) => ({ ...m, [id]: [...(m[id] || []), mine] }));
        setTimeout(() => {
          const reply: Msg = {
            id: 'r' + Date.now(), from: 'inv', at: nowHM(),
            text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
          };
          setMessages((m) => ({ ...m, [id]: [...(m[id] || []), reply] }));
        }, 1400);
      },
      watching,
      toggleWatch: (id) => setWatching((w) => ({ ...w, [id]: !w[id] })),
      reset: () => {
        setCases(SEED_CASES);
        setMessages(SEED_MESSAGES);
        setWatching({ 'TR-20418': true });
        setUnread(true);
        setD(emptyDraft);
      },
    };
  }, [signedIn, phone, prefs, unread, draft, cases, messages, watching]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
