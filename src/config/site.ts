/**
 * Site facts and page metadata — the single source.
 *
 * Anything that appears on more than one page lives here: the name, the
 * role line, the email, the three external links, and every page's
 * title, description and social image. A page composes its own body; it
 * does not retype its own identity.
 *
 * Titles follow one pattern — `Subject — Stephen Mensah` — so a browser
 * tab, a search result and a shared link all name the same thing the
 * same way. Descriptions stay under ~155 characters so they survive a
 * search snippet intact.
 *
 * Facts come from the supplied résumé and the project registry. Where the
 * record does not settle something, the description does not assert it.
 */

export const SITE = {
  name: 'Stephen Mensah',
  /** Short role line, used beside the name. */
  role: 'Software engineer',
  /** Where the work happens. */
  location: 'Berekuso, Ghana',
  email: 'stevemensah333@gmail.com',
} as const;

/** The three professional destinations. `resume` is a real PDF, not a page. */
export const PUBLIC_LINKS: Record<'github' | 'linkedin' | 'resume', string | null> = {
  github: 'https://github.com/stevemensah333-rgb',
  linkedin: 'https://www.linkedin.com/in/stephen-mensah-867538348/',
  resume: '/Stephen-Mensah-Resume.pdf',
};

export type LinkId = 'github' | 'linkedin' | 'resume';

type ExternalLink = { id: LinkId; label: string; href: string; detail: string };

/** Labelled, ordered list of the destinations, minus anything unset. */
const allExternalLinks: ExternalLink[] = [
  {
    id: 'github',
    label: 'GitHub',
    href: PUBLIC_LINKS.github ?? '',
    detail: 'Source for the projects that are public',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: PUBLIC_LINKS.linkedin ?? '',
    detail: 'Roles and dates',
  },
  {
    id: 'resume',
    label: 'Résumé',
    href: PUBLIC_LINKS.resume ?? '',
    detail: 'PDF, one page, as supplied',
  },
];

export const externalLinks: ExternalLink[] = allExternalLinks.filter((link) => Boolean(link.href));

/**
 * Shared social-card geometry. Every card in /public/social is rendered
 * at exactly this size, so an unfurled link never crops the words that
 * matter.
 */
export const SOCIAL_IMAGE = {
  width: 1200,
  height: 630,
  type: 'image/png',
} as const;

/** The one card every page falls back to. */
export const DEFAULT_SOCIAL_IMAGE = {
  src: '/social-preview.png',
  alt: 'Stephen Mensah — software engineer. AI products and the systems behind them.',
} as const;

/**
 * Case-study metadata, built from the registry's own summary so a project
 * is described the same way in a search result as on its own page.
 */
export const caseMeta = (input: {
  name: string;
  summary: string;
  image: string;
  imageAlt: string;
}): PageMeta => ({
  title: `${input.name} — case study — ${SITE.name}`,
  description: input.summary,
  image: input.image,
  imageAlt: input.imageAlt,
});

export type PageMeta = {
  /** Full <title>. */
  title: string;
  /** Meta description, one sentence or two short ones. */
  description: string;
  /** Social card path; defaults to the shared card. */
  image?: string;
  imageAlt?: string;
};

/** Route → title, description and card. Keyed by the route's role, not its path. */
export const pageMeta = {
  home: {
    title: 'Stephen Mensah — Software engineer',
    description:
      'I build AI-powered products and the systems behind them. Syncareer, SessionBook and Koranco Farms — with the decisions, source and limits of each.',
    image: DEFAULT_SOCIAL_IMAGE.src,
    imageAlt: DEFAULT_SOCIAL_IMAGE.alt,
  },
  work: {
    title: 'Work — Stephen Mensah',
    description:
      'Three engineering projects — Syncareer, SessionBook and Koranco Farms — with the part each one needed, its real release state, and the case study.',
    image: '/social/work.png',
    imageAlt: 'The work register — Syncareer, SessionBook and Koranco Farms, three projects in three release states.',
  },
  lab: {
    title: 'Reliability Lab — Stephen Mensah',
    description:
      'One reply followed end to end: the context it carries, an answer that context cannot support, the gate that refuses it, and the person who decides.',
    image: '/social/lab.png',
    imageAlt: 'The Reliability Lab — one reply, five checks, an illustrative fixture.',
  },
  about: {
    title: 'About — Stephen Mensah',
    description:
      'Software engineer and Computer Science student at Ashesi University, Ghana: the roles, the projects behind each capability, and the academic record.',
    image: '/social/about.png',
    imageAlt: 'About Stephen Mensah — software engineer, Ashesi University, Ghana.',
  },
  notFound: {
    title: 'Page not found — Stephen Mensah',
    description: 'That page does not exist. The work, the Lab and the contact details are one link away.',
    image: DEFAULT_SOCIAL_IMAGE.src,
    imageAlt: DEFAULT_SOCIAL_IMAGE.alt,
  },
} satisfies Record<string, PageMeta>;
