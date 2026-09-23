/**
 * Site destinations — the surfaces a visitor can land on.
 *
 * The final navigation (per AGENTS.md §2):
 *
 *   PRIMARY      01 HOME · 02 WORK · 03 LAB · 04 PROFILE
 *   UTILITIES    RÉSUMÉ · EMAIL
 *
 * The workspace rail (desktop) and the mobile bar/drawer both read from
 * this list. Every primary destination is a real route, so "current" is
 * derived from the pathname — no anchor mapping.
 *
 * Adding a destination means: add an entry here, create the route, add
 * the route to the sitemap list. Nothing else.
 */

import { PUBLIC_EMAIL } from './site';

export type Destination = {
  id: string;
  label: string;
  /** Absolute route (primary) or URL (utilities). */
  href: string;
  /** 2-digit index shown in mono. */
  index: string;
  /** 6–10 word mono caption shown in the mobile drawer. */
  description: string;
  /** External links open in a new tab. */
  external?: boolean;
};

export const primaryDestinations: Destination[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    index: '01',
    description: 'Orientation and concise proof.',
  },
  {
    id: 'work',
    label: 'Work',
    href: '/work/',
    index: '02',
    description: 'The project archive and case studies.',
  },
  {
    id: 'lab',
    label: 'Lab',
    href: '/lab/',
    index: '03',
    description: 'One payload, seven stages, operable.',
  },
  {
    id: 'profile',
    label: 'Profile',
    href: '/profile/',
    index: '04',
    description: 'About, experience, capabilities, evidence.',
  },
];

export const utilityDestinations: Destination[] = [
  {
    id: 'resume',
    label: 'Résumé',
    href: '/Stephen-Mensah-Resume.pdf',
    index: 'R',
    description: 'PDF — opens in a new tab.',
    external: true,
  },
  {
    id: 'email',
    label: 'Email',
    href: `mailto:${PUBLIC_EMAIL}`,
    index: 'E',
    description: 'Direct email — opens your mail client.',
  },
];

export const destinations: Destination[] = [...primaryDestinations, ...utilityDestinations];

/** Route-based "current" destination, derived from the pathname. */
export const destinationForPath = (pathname: string): string | null => {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/work')) return 'work';
  if (pathname.startsWith('/lab')) return 'lab';
  if (pathname.startsWith('/profile')) return 'profile';
  return null;
};
