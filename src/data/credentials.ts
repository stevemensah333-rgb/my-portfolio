export interface Credential {
  id: string;
  name: string;
  result: string;
  issuer?: string;
  detail?: string;
  /** Path to a public-approved evidence image. */
  evidenceImage?: string;
  evidenceAlt?: string;
  evidenceWidth?: number;
  evidenceHeight?: number;
  /** Path to a public-approved evidence document. */
  evidenceDocument?: string;
}

export const credentials: Credential[] = [
  {
    id: 'sat',
    name: 'SAT',
    result: '1520 / 1600',
    issuer: 'College Board',
    evidenceImage: '/evidence/sat-score-preview.jpg',
    evidenceAlt: 'Cropped SAT score section showing total 1520, Reading and Writing 730, and Math 790.',
    evidenceWidth: 1180,
    evidenceHeight: 530,
  },
  {
    id: 'ashesi',
    name: 'Ashesi University',
    result: "Dean’s List",
    detail: 'B.Sc. Computer Science',
    evidenceImage: '/evidence/ashesi-deans-list-redacted.png',
    evidenceAlt: "Cropped Ashesi letter addressed to Stephen confirming his Dean’s List recognition.",
    evidenceWidth: 1320,
    evidenceHeight: 310,
  },
  {
    id: 'commonwealth-essay',
    name: 'Royal Commonwealth Essay Competition',
    result: 'Gold Award',
    evidenceImage: '/evidence/commonwealth-gold-award-redacted.png',
    evidenceAlt: 'Cropped Royal Commonwealth Essay Competition certificate naming Stephen Mensah as a Gold Award recipient.',
    evidenceWidth: 1555,
    evidenceHeight: 1320,
  },
  {
    id: 'national-sharks-quiz',
    name: 'National Sharks Quiz',
    result: 'Quarterfinalist',
    evidenceImage: '/evidence/national-sharks-event.jpg',
    evidenceAlt: 'Event photograph showing Stephen Mensah competing with his school team at National Sharks Quiz.',
    evidenceWidth: 1282,
    evidenceHeight: 960,
  },
];
