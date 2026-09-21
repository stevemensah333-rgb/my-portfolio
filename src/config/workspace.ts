/**
 * Workspace destinations — the surfaces a visitor can land on.
 *
 * The workspace rail (desktop) and the mobile drawer both read from
 * this list. Each destination has:
 *   - id         : anchor or slug
 *   - label      : short user-facing name
 *   - section    : route fragment on the homepage, or absolute route
 *   - kind       : 'home' (anchor on /), 'route' (full route), 'external'
 *   - description: 6–10 word mono caption shown next to the label
 *
 * Adding a destination means: add an entry here, place a matching
 * `<section id="...">` on the homepage (or a new route). Nothing else.
 */

export type Destination = {
  id: string;
  label: string;
  /** Path. On the homepage these are anchors; from other pages they are full URLs. */
  section: string;
  kind: 'home' | 'route' | 'external';
  description: string;
  /** 2-digit index shown in mono. */
  index: string;
};

export const destinations: Destination[] = [
  {
    id: 'work',
    label: 'Work',
    section: 'syncareer',
    kind: 'home',
    description: 'Projects and reliability evidence.',
    index: '01',
  },
  {
    id: 'reliability-lab',
    label: 'Reliability Lab',
    section: 'reliability-lab',
    kind: 'home',
    description: 'The trace engine as an instrument.',
    index: '02',
  },
  {
    id: 'toolkit',
    label: 'Toolkit',
    section: 'toolkit',
    kind: 'home',
    description: 'Capabilities anchored to evidence.',
    index: '03',
  },
  {
    id: 'experience',
    label: 'Experience',
    section: 'experience',
    kind: 'home',
    description: 'Where I have worked.',
    index: '04',
  },
  {
    id: 'about',
    label: 'About',
    section: 'about',
    kind: 'home',
    description: 'A note on the engineer.',
    index: '05',
  },
  {
    id: 'evidence',
    label: 'Evidence',
    section: 'evidence',
    kind: 'home',
    description: 'Credentials and recognition.',
    index: '06',
  },
  {
    id: 'contact',
    label: 'Email',
    section: 'contact',
    kind: 'home',
    description: 'Direct email — opens Gmail compose.',
    index: '07',
  },
  {
    id: 'resume',
    label: 'Résumé',
    section: '/Stephen-Mensah-Resume.pdf',
    kind: 'external',
    description: 'PDF — opens in a new tab.',
    index: 'R',
  },
];
