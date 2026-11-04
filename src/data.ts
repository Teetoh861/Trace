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

// Site inspection photos shown on the "Physical inspection" finding.
// Add up to 3 image URLs (or hosted file paths such as '/photos/site1.jpg') to replace the placeholders.
export const SITE_PHOTOS: string[] = [];

export const naira = (n: number) => '₦' + n.toLocaleString('en-NG');

export function buildFindings(checks: CheckId[], clean = false): Finding[] {
  const cleanAll: Record<CheckId, Finding> = {
    title: {
      id: 'f-title', title: 'Title record', grade: 'confirmed',
      summary: 'Certificate of Occupancy matches the registry entry.',
      detail: 'The C of O number, plot description and holder name correspond to the entry in the state land registry.',
    },
    survey: {
      id: 'f-survey', title: 'Survey plan', grade: 'confirmed',
      summary: 'Survey coordinates match the official record.',
      detail: 'Your survey plan agrees with the Surveyor-General record to within tolerance. No overlapping beacons were found.',
    },
    encumbrance: {
      id: 'f-enc', title: 'Encumbrances & litigation', grade: 'noadverse',
      summary: 'No mortgage, lien or court case found in sources searched.',
      detail: 'High Court and registry indexes were searched. This is not a guarantee that none exists.',
    },
    ownership: {
      id: 'f-own', title: 'Ownership history', grade: 'confirmed',
      summary: 'Chain of transfers traced to the root of title.',
      detail: 'Three transfers were traced back to the original grant. Each is supported by a registered instrument.',
    },
    physical: {
      id: 'f-phy', title: 'Physical inspection', grade: 'noadverse',
      summary: 'Site is vacant and beacons are in place.',
      detail: 'No occupants or construction were observed. Four beacons were located and photographed.',
    },
  };
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
  return checks.map((c) => (clean ? cleanAll[c] : all[c]));
}

export const NEXT_STEPS: Record<GradeKey, string[]> = {
  discrepancy: [
    'Do not pay the seller yet.',
    'Commission a fresh survey from a licensed surveyor and compare it with the official record.',
    'Ask a qualified property lawyer to review the discrepancy before you continue.',
  ],
  further: [
    'Visit the site with the seller and a lawyer before you commit funds.',
    'Ask who is occupying or building on the property, and on what authority.',
  ],
  unable: [
    'Request a physical search at the registry for the missing period.',
    'Ask the seller for the earlier transfer documents.',
  ],
  noadverse: [
    'Have a lawyer review the documents and draft the sale agreement.',
    'Consider a re-check close to payment, since records can change.',
  ],
  confirmed: [
    'Proceed with your lawyer and complete the transaction through registered instruments.',
    'Turn on monitoring to be alerted if a new entry appears against the property.',
  ],
};

export type Notif = { id: string; title: string; body: string; when: string; caseId?: string };
export const NOTIFICATIONS: Notif[] = [
  { id: 'n1', title: 'Report ready', body: 'Your report for Plot 14, Okun Ajah is ready to read.', when: '2 h ago', caseId: 'TR-20418' },
  { id: 'n2', title: 'Site inspection scheduled', body: 'An agent will visit 12 Admiralty Way tomorrow morning.', when: 'Yesterday', caseId: 'TR-20425' },
  { id: 'n3', title: 'Message from Ada', body: 'Quick question about the survey plan you attached.', when: 'Yesterday', caseId: 'TR-20425' },
  { id: 'n4', title: 'Quote expires soon', body: 'Your draft quote for Epe farmland is valid for 24 more hours.', when: '2 days ago' },
];

export type Msg = { id: string; from: 'me' | 'inv'; text: string; at: string };
export const SEED_MESSAGES: Record<string, Msg[]> = {
  'TR-20425': [
    { id: 'm1', from: 'inv', text: 'Hi, this is Ada from TRACE. I have received your documents for 12 Admiralty Way.', at: '09:12' },
    { id: 'm2', from: 'inv', text: 'The survey plan scan is a little blurry in one corner. Could you send a clearer copy?', at: '09:14' },
    { id: 'm3', from: 'me', text: 'Sure, I will ask the seller and upload it today.', at: '09:31' },
  ],
};
export const AUTO_REPLIES = [
  'Thanks, noted. I will update the case as soon as I have it.',
  'Understood. The registry search is on track for the estimated date.',
  'Good question. I will confirm with the registry and come back to you shortly.',
  'Received. Nothing else needed from you right now.',
];

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

function seed(
  id: string, address: string, type: string, size: string, checks: CheckId[],
  total: number, progress: number, createdAt: string, clean = false,
): CaseT {
  const findings = buildFindings(checks, clean);
  const overall = overallGrade(findings);
  return {
    id, address, type, size, checks, total, paid: true, progress, createdAt,
    findings, conclusion: conclusionFor(overall), overall,
  };
}

export const SEED_CASES: CaseT[] = [
  seed('TR-20425', '12 Admiralty Way, Lekki Phase 1, Lagos', 'House', '450 sqm', ['title', 'survey', 'physical'], 110250, 3, '1 Nov 2026'),
  seed('TR-20418', 'Plot 14, Okun Ajah, Lagos', 'Land', '600 sqm', ['title', 'survey', 'encumbrance', 'ownership', 'physical'], 183750, 6, '28 Oct 2026'),
  seed('TR-20412', 'Farmland, Epe, Lagos', 'Farmland', '2 hectares', ['title', 'survey', 'ownership'], 115500, 6, '19 Oct 2026', true),
];
export const SEED_CASE = SEED_CASES[1];
