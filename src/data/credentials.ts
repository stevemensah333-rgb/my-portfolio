export interface CredentialAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Credential {
  id: string;
  name: string;
  result: string;
  issuer?: string;
  detail?: string;
  asset?: CredentialAsset;
}

export const credentials: Credential[] = [
  {
    id: 'sat',
    name: 'SAT',
    result: '1520 / 1600',
    issuer: 'College Board',
  },
  {
    id: 'ashesi',
    name: 'Ashesi University',
    result: "Dean's List · 3.56 / 4.00",
    detail: 'B.Sc. Computer Science',
  },
  {
    id: 'commonwealth-essay',
    name: 'Royal Commonwealth Essay Competition',
    result: 'Gold Award',
  },
  {
    id: 'national-sharks-quiz',
    name: 'National Sharks Quiz',
    result: 'Quarterfinalist',
  },
];
