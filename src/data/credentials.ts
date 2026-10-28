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
    evidenceAlt: 'SAT score report excerpt showing a total of 1520, Reading and Writing 730, and Math 790.',
    evidenceWidth: 1180,
    evidenceHeight: 530,
  },
  {
    id: 'ashesi',
    name: 'Ashesi University',
    result: "Dean’s List",
    detail: 'B.Sc. Computer Science',
    evidenceImage: '/evidence/ashesi-deans-list-redacted.png',
    evidenceAlt: "Ashesi University letter excerpt confirming Stephen’s place on the Dean’s List for the January Term (Term Two) of the 2025/2026 academic year.",
    evidenceWidth: 1320,
    evidenceHeight: 310,
  },
  {
    id: 'commonwealth-essay',
    name: 'Royal Commonwealth Essay Competition',
    result: 'Gold Award',
    issuer: 'Royal Commonwealth Society',
    evidenceImage: '/evidence/commonwealth-gold-award-redacted.png',
    evidenceAlt: 'Royal Commonwealth Essay Competition certificate naming Stephen Mensah as a Gold Award recipient.',
    evidenceWidth: 1555,
    evidenceHeight: 1320,
  },
  {
    id: 'national-sharks-quiz',
    name: 'National Sharks Quiz',
    result: 'Quarterfinalist',
    evidenceImage: '/evidence/national-sharks-event.jpg',
    evidenceAlt: 'Event photograph of Stephen Mensah competing with his school team at the National Sharks Quiz.',
    evidenceWidth: 1282,
    evidenceHeight: 960,
  },
];
