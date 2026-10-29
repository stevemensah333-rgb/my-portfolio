/**
 * Presentation records that are about the person, not a project.
 *
 * Source of record: the supplied résumé (public/Stephen-Mensah-Resume.pdf).
 * Every date, title and employer below appears there. The site no longer
 * carries a parallel "to confirm" list: where the résumé gives a date, the
 * date is used; where it does not, the field is absent rather than guessed.
 *
 * The one fact the résumé does not fix is the address of the farm website
 * built during the Koranco engagement — so it is described, and not linked.
 *
 * Projects stay in registry.ts (status, evidence, deployment); this file
 * never restates a project's release state.
 */
export { projectRecords } from './registry';
import { projectRecords } from './registry';

export type ProjectId = keyof typeof projectRecords;

export type Experience = {
  id: string;
  organisation: string;
  role: string;
  /** Printed date range, exactly as the résumé ranges read. */
  dates: string;
  /** True while the role is still running at the time of writing. */
  current?: boolean;
  /** The contribution, stated before any expansion. */
  summary: string;
  /** What the work actually involved, one step longer. */
  detail: string;
  /** A case study for this work, when one exists. */
  href?: string;
  link?: string;
};

export const experiences: Experience[] = [
  {
    id: 'innovation-lab',
    organisation: 'Ashesi Center for Entrepreneurship',
    role: 'Software Engineer — Applied Innovation Lab',
    dates: 'Jul — Sep 2026',
    summary:
      'Offline-first farm management software for Koranco Farms, built to hold up in low-connectivity field work.',
    detail:
      'Three modules — attendance, produce and employees — with custom authentication and role-based authorization on FastAPI and PostgreSQL. Jul–Sep 2026 was the lab placement; the Koranco engagement inside it is recorded as six weeks. Also built the farm’s public website, which is described but not linked: its address is not in the supplied record.',
    href: '/work/koranco/',
    link: 'Read the Koranco case study',
  },
  {
    id: 'amalitech',
    organisation: 'AmaliTech',
    role: 'Software Engineer Intern',
    dates: 'Aug — Sep 2026',
    summary: 'Backend for a mentor–mentee matching platform, shipped as a working MVP.',
    detail:
      'FastAPI and Python services with JWT authentication for secure session management, in a cross-functional group of five engineers building a full-stack MVP.',
  },
  {
    id: 'datacamp',
    organisation: 'Ashesi DataCamp Donates',
    role: 'Program Coordinator',
    dates: 'Nov 2025 — Nov 2026',
    current: true,
    summary: 'Learner access to DataCamp’s AI and data-science platform, through the Donates program.',
    detail:
      'Coordinated access for students and community learners, and supported 35+ of them through technical upskilling in data science, AI and programming.',
  },
  {
    id: 'library',
    organisation: 'Ashesi University',
    role: 'Student Library Assistant',
    dates: 'Feb — May 2026',
    summary: 'Front-line technical help with printing, scanning and database navigation.',
    detail:
      'Patrons arrived with a printer that would not print or a database nobody had shown them, and left with something that worked. Translating a technical process into plain language is the same job as writing an error message somebody can act on.',
  },
];

/** Education, as the résumé records it. */
export const education = {
  institution: 'Ashesi University',
  programme: 'B.Sc. Computer Science',
  location: 'Berekuso, Ghana',
  /** Expected graduation, per the résumé. */
  expected: '2029',
  gpa: '3.56 / 4.0',
} as const;
