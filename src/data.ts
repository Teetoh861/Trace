export type GradeKey = 'confirmed' | 'noadverse' | 'discrepancy' | 'unable' | 'further';

export const GRADES: Record<
  GradeKey,
  { label: string; meaning: string; color: string; icon: string }
> = {
  confirmed: {
    label: 'Confirmed by available records',
    meaning: 'Official records corroborate the document provided.',
    color: '#3E7D4F',
    icon: '✓',
  },
  noadverse: {
    label: 'No adverse record identified in the sources searched',
    meaning: 'No conflicting entry was found in the sources checked. Not a guarantee of title.',
    color: '#3A5F8F',
    icon: '○',
  },
  discrepancy: {
    label: 'Discrepancy identified',
    meaning: 'Records conflict with the document or with another record.',
    color: '#B3261E',
    icon: '!',
  },
  unable: {
    label: 'Unable to establish',
    meaning: 'The relevant record could not be accessed or does not exist.',
    color: '#C98A1B',
    icon: '?',
  },
  further: {
    label: 'Further investigation required',
    meaning: 'A finding that needs a deeper, on-site or legal check.',
    color: '#6F6A63',
    icon: '→',
  },
};

export const PROPERTY_TYPES = ['Land', 'House', 'Duplex', 'Commercial', 'Farmland'];
export const DOC_TYPES = [
  'Certificate of Occupancy (C of O)',
  'Deed of Assignment',
  'Survey plan',
  "Governor's Consent",
  'Receipt / Sales agreement',
  'Excision / Gazette',
];

export type CheckId = 'title' | 'survey' | 'encumbrance' | 'ownership' | 'physical';

export const CHECKS: {
  id: CheckId;
  title: string;
  desc: string;
  price: number;
  days: number;
  core?: boolean;
}[] = [
  { id: 'title', title: 'Title record search', desc: 'Verify the title document against the state land registry.', price: 45000, days: 5, core: true },
  { id: 'survey', title: 'Survey verification', desc: 'Confirm the survey plan with the Surveyor-General and check overlaps.', price: 35000, days: 4, core: true },
  { id: 'encumbrance', title: 'Encumbrance & litigation', desc: 'Search for mortgages, liens, court cases and government acquisition.', price: 40000, days: 6 },
  { id: 'ownership', title: 'Ownership history', desc: 'Trace the chain of transfers back to the root of title.', price: 30000, days: 5 },
  { id: 'physical', title: 'Physical inspection', desc: 'An agent visits, photographs and beacon-checks the site.', price: 25000, days: 3 },
];

export const PAYMENT_OPTIONS = [
  { id: 'full', title: 'Pay in full', desc: 'One payment. Investigation starts immediately.' },
  { id: 'split', title: 'Two instalments', desc: '60% now, 40% before the report is released.' },
  { id: 'transfer', title: 'Bank transfer', desc: 'Pay by transfer. Starts once confirmed.' },
];

export type Step = { id: string; title: string; detail: string };

export const INVESTIGATION_STEPS: Step[] = [
  { id: 's1', title: 'Case received', detail: 'Your request and documents were logged.' },
  { id: 's2', title: 'Documents reviewed', detail: 'Provided documents checked for completeness.' },
  { id: 's3', title: 'Registry search', detail: 'Title and encumbrance records searched.' },
  { id: 's4', title: 'Survey verified', detail: 'Survey plan compared with the official record.' },
  { id: 's5', title: 'Site inspection', detail: 'Agent visits the property and checks beacons.' },
  { id: 's6', title: 'Report compiled', detail: 'Findings graded and conclusion written.' },
];

export type Finding = {
  id: string;
  title: string;
  grade: GradeKey;
  summary: string;
  detail: string;
};

export type CaseT = {
  id: string;
  address: string;
  type: string;
  size: string;
  checks: CheckId[];
  total: number;
  paid: boolean;
  progress: number; // number of completed steps
  createdAt: string;
  findings: Finding[];
  conclusion: string;
  overall: GradeKey;
};

export const naira = (n: number) => '₦' + n.toLocaleString('en-NG');

export function buildFindings(checks: CheckId[]): Finding[] {
  const all: Record<CheckId, Finding> = {
    title: {
      id: 'f-title', title: 'Title record', grade: 'confirmed',
      summary: 'Certificate of Occupancy matches the registry entry.',
      detail: 'The C of O number, plot description and holder name correspond to the entry in the state land registry.',
    },
    survey: {
      id: 'f-survey', title: 'Survey plan', grade: 'discrepancy',
      summary: 'Survey coordinates differ from the official record.',
      detail: 'Your survey plan is offset from the official record by about 40 m north-west, with overlapping beacons. Request a re-survey before any payment.',
    },
    encumbrance: {
      id: 'f-enc', title: 'Encumbrances & litigation', grade: 'noadverse',
      summary: 'No mortgage, lien or court case found in sources searched.',
      detail: 'High Court and registry indexes were searched. This is not a guarantee that none exists.',
    },
    ownership: {
      id: 'f-own', title: 'Ownership history', grade: 'unable',
      summary: 'Transfers before 2009 could not be established.',
      detail: 'Registry volumes before 2009 are not digitised. A physical search at the registry is needed.',
    },
    physical: {
      id: 'f-phy', title: 'Physical inspection', grade: 'further',
      summary: 'Fresh construction activity observed on part of the plot.',
      detail: 'A third party appears to be building on the north edge. Occupancy should be investigated before proceeding.',
    },
  };
  return checks.map((c) => all[c]);
}

export function overallGrade(f: Finding[]): GradeKey {
  const order: GradeKey[] = ['discrepancy', 'further', 'unable', 'noadverse', 'confirmed'];
  for (const g of order) if (f.some((x) => x.grade === g)) return g;
  return 'noadverse';
}

export function conclusionFor(g: GradeKey): string {
  switch (g) {
    case 'discrepancy':
      return 'Do not proceed yet. A discrepancy was found that must be resolved before you commit funds.';
    case 'further':
      return 'Proceed with caution. One or more findings need a deeper on-site or legal check.';
    case 'unable':
      return 'Part of the record could not be established. Consider a physical registry search.';
    case 'noadverse':
      return 'No adverse record was identified in the sources searched.';
    default:
      return 'Available records corroborate the documents provided.';
  }
}

export const SEED_CASE: CaseT = (() => {
  const checks: CheckId[] = ['title', 'survey', 'encumbrance', 'ownership', 'physical'];
  const findings = buildFindings(checks);
  const overall = overallGrade(findings);
  return {
    id: 'TR-20418',
    address: 'Plot 14, Okun Ajah, Lagos',
    type: 'Land',
    size: '600 sqm',
    checks,
    total: 175000,
    paid: true,
    progress: 6,
    createdAt: '28 Oct 2026',
    findings,
    conclusion: conclusionFor(overall),
    overall,
  };
})();
