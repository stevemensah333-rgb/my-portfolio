/**
 * The case-study structure — one list, used by all three case pages.
 *
 * Every case study answers the same questions in the same order, so the
 * pages can be read against each other: what is it, what does it look
 * like, what was wrong, what did I do, what did I decide, where does it
 * stand, what is unproven, where can it be checked.
 *
 * The part keys double as the section ids and as the anchors in the
 * page's section navigation. Section prose lives here too, because the
 * section titles are part of the structure: if two case studies drift
 * into different headings, they stop being comparable.
 */
import type { ProjectId } from './portfolio';

export type CasePartKey =
  | 'overview'
  | 'visual'
  | 'problem'
  | 'contribution'
  | 'decisions'
  | 'result'
  | 'limits'
  | 'sources';

export const caseParts: { key: CasePartKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'visual', label: 'Project visual' },
  { key: 'problem', label: 'Problem' },
  { key: 'contribution', label: 'Contribution' },
  { key: 'decisions', label: 'Key decisions' },
  { key: 'result', label: 'Result & status' },
  { key: 'limits', label: 'Limitations' },
  { key: 'sources', label: 'Sources' },
];

export const partNumber = (key: CasePartKey): string =>
  String(caseParts.findIndex((part) => part.key === key) + 1).padStart(2, '0');

export type CaseSectionCopy = {
  /** The section's h2. Plain text, wrapped by the layout. */
  title: string;
  /** One line under the heading: the section's reading frame. */
  note?: string;
  /**
   * Older anchors that must keep resolving. They are empty, focusable
   * spans inside the section, so a bookmarked or cross-linked `#id`
   * still lands in the right place after the rebuild.
   */
  aliases?: string[];
};

export const caseCopy: Record<ProjectId, Record<Exclude<CasePartKey, 'overview'>, CaseSectionCopy>> = {
  syncareer: {
    visual: {
      title: 'The product, as it runs.',
      note: 'Three real captures from the live platform. The grounding revision described below is not in them — it is still waiting for a deployment.',
      aliases: ['product', 'product-surfaces'],
    },
    problem: {
      title: 'The assistant saw a bullet. Not the evidence.',
      aliases: ['failure'],
    },
    contribution: {
      title: 'The application layer, not the model.',
    },
    decisions: {
      title: 'Fix the contract, not the model.',
      note: 'The whole seven-stage investigation condenses to this comparison. The Lab runs one reply through the gate and the review.',
      aliases: [
        'investigation',
        'intervention',
        'stage-input',
        'stage-model-output',
        'stage-validation',
        'stage-failure',
        'stage-diagnosis',
        'stage-intervention',
        'stage-output',
      ],
    },
    result: {
      title: 'A repaired contract. A release still pending.',
      aliases: ['result-verified'],
    },
    limits: {
      title: 'What this does not show.',
      aliases: ['result-unmeasured'],
    },
    sources: {
      title: 'Check the record.',
    },
  },

  sessionbook: {
    visual: {
      title: 'One exchange, one path.',
      note: 'There is no product screenshot: the repository contains no captured call and no deployed URL. The exchange is illustrative; the path below is written in source.',
      aliases: ['architecture', 'trace', 'call-path'],
    },
    problem: {
      title: 'The conversation can be flexible. The booking can’t.',
      aliases: ['primer'],
    },
    contribution: {
      title: 'The service behind the boundary.',
    },
    decisions: {
      title: 'Correctness decided in the backend.',
    },
    result: {
      title: 'Written is a state. Proven is another.',
    },
    limits: {
      title: 'What has not been proven.',
      aliases: ['boundary', 'questions'],
    },
    sources: {
      title: 'Pinned source, not a demo.',
      aliases: ['evidence'],
    },
  },

  koranco: {
    visual: {
      title: 'A conceptual map, not a screenshot.',
      note: 'Three record types, drawn from the written project scope. No application UI, capture or repository is public.',
      aliases: ['built'],
    },
    problem: {
      title: 'Three record types, one working farm.',
    },
    contribution: {
      title: 'Software for farm operations.',
    },
    decisions: {
      title: 'Scope, and where it stops.',
    },
    result: {
      title: 'A delivered MVP, reported.',
    },
    limits: {
      title: 'A bounded account.',
      aliases: ['evidence'],
    },
    sources: {
      title: 'Where this comes from.',
    },
  },
};

/** Each case study ends by handing over to the next one. */
export const nextProject: Record<ProjectId, ProjectId> = {
  syncareer: 'sessionbook',
  sessionbook: 'koranco',
  koranco: 'syncareer',
};
