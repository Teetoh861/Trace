import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  CaseT, CheckId, SEED_CASE, buildFindings, overallGrade, conclusionFor, CHECKS,
} from './data';

export type Draft = {
  address: string;
  type: string;
  size: string;
  docs: string[];
  files: Record<string, string>; // document type -> attached file name
  checks: CheckId[];
  notes: string;
};

const emptyDraft: Draft = {
  address: '', type: 'Land', size: '', docs: [], files: {}, checks: ['title', 'survey'], notes: '',
};

type Ctx = {
  draft: Draft;
  setDraft: (p: Partial<Draft>) => void;
  resetDraft: () => void;
  cases: CaseT[];
  quote: () => { lines: { title: string; price: number }[]; subtotal: number; fee: number; total: number; days: number };
  submitCase: (paid: boolean) => string;
  advance: (id: string) => void;
};

const StoreCtx = createContext<Ctx>(null as unknown as Ctx);
export const useStore = () => useContext(StoreCtx);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [draft, setD] = useState<Draft>(emptyDraft);
  const [cases, setCases] = useState<CaseT[]>([SEED_CASE]);

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
      draft,
      setDraft: (p) => setD((d) => ({ ...d, ...p })),
      resetDraft: () => setD(emptyDraft),
      cases,
      quote,
      submitCase: (paid) => {
        const q = quote();
        const findings = buildFindings(draft.checks);
        const overall = overallGrade(findings);
        const id = 'TR-' + (20419 + cases.length);
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
        setD(emptyDraft);
        return id;
      },
      advance: (id) =>
        setCases((cs) => cs.map((c) => (c.id === id && c.progress < 6 ? { ...c, progress: c.progress + 1 } : c))),
    };
  }, [draft, cases]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
