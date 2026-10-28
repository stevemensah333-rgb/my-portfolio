/**
 * Site destinations — compact persistent navigation.
 *
 * Navigation structure: Stephen Mensah, Work, Lab, About, Résumé, Contact
 * About points to /profile/ route.
 *
 * The navigation bar reads from this list. Every primary destination is a
 * real route, so "current" is derived from the pathname.
 *
 * Adding a destination means: add an entry here, create the route, add
 * the route to the sitemap list. Nothing else.
 */

export type NavItem = {
  id: string;
  label: string;
  /** Absolute route or URL. */
  href: string;
  /** External links open in a new tab. */
  external?: boolean;
};

export const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Stephen Mensah',
    href: '/',
  },
  {
    id: 'work',
    label: 'Work',
    href: '/work/',
  },
  {
    id: 'lab',
    label: 'Lab',
    href: '/lab/',
  },
  {
    id: 'about',
    label: 'About',
    href: '/profile/',
  },
  {
    id: 'resume',
    label: 'Résumé',
    href: '/Stephen-Mensah-Resume.pdf',
    external: true,
  },
  {
    id: 'contact',
    label: 'Contact',
    href: `/#contact`,
  },
];

/** Route-based "current" destination, derived from the pathname. */
export const currentNavItem = (pathname: string): string | null => {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/work')) return 'work';
  if (pathname.startsWith('/lab')) return 'lab';
  if (pathname.startsWith('/profile')) return 'about';
  return null;
};
