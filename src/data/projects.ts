/**
 * Project registry — single source of truth for project metadata.
 *
 * Every project shape surface in the environment reads from this file.
 * Adding a new project means: add an entry here, add the route file,
 * add the entry to the sitemap route list. Nothing else.
 *
 * Evidence rules (per AGENTS.md):
 *   - status reflects reality, not aspiration
 *   - evidence[] items are real artifacts or explicitly "illustrative"
 *   - claim limits live next to the project so the boundary travels
 */

export type ProjectStatus =
  | 'live'
  | 'in-progress'
  | 'built-for-learning';

export type ProjectEvidence =
  | { kind: 'product'; label: string; href: string }
  | { kind: 'code'; label: string; href: string }
  | { kind: 'artifact-image'; label: string; href: string; alt: string }
  | { kind: 'document'; label: string; href: string }
  | { kind: 'illustrative'; label: string; note: string };

export type ProjectStage = {
  /** Short ID used for the data-stage attributes and deep-linking. */
  id: string;
  /** Step number, padded to two characters (e.g. '01'). */
  step: string;
  /** Mono label, e.g. 'INPUT' or 'INTERVENTION'. */
  label: string;
  /** Title shown as the stage heading. */
  title: string;
  /** Short summary shown under the title. */
  summary: string;
  /** Long-form prose for the inspector panel. */
  detail: string;
  /** Evidence statement shown at the bottom of the inspector panel. */
  evidence: string;
  /** Visual kind — drives which kind of panel body the inspector renders. */
  kind:
    | 'input'
    | 'raw'
    | 'validate'
    | 'fail'
    | 'diagnosis'
    | 'intervene'
    | 'valid';
  /** Optional illustrative code body for code-style stages. */
  code?: string;
  /** Failure modes for `fail` stages. */
  modes?: { name: string; note: string }[];
  /** Fix list for `intervene` stages. */
  fixes?: string[];
  /** Tone — drives inspector palette accent. */
  tone?: 'failure' | 'technical' | 'valid';
};

export type Project = {
  /** URL-safe identifier. Also used as the route segment. */
  id: string;
  /** Display name (short). */
  name: string;
  /** One-line claim used in lists and the inspector. */
  short: string;
  /** Mono-tagged status — visible wherever the project appears. */
  status: ProjectStatus;
  /** The headline framing of the project (used in environment cards). */
  claim: string;
  /** Three to five evidence points, each anchored to a real artifact. */
  evidence: ProjectEvidence[];
  /** Honest boundary on what is NOT claimed. Optional but encouraged. */
  claimLimit?: string;
  /** Stack — short list of the most relevant items. */
  stack: string[];
  /** Where this project's full case study lives. */
  route: string;
  /** Stage list for the inspector. Drives both homepage and full case. */
  stages: ProjectStage[];
  /** Optional: which reliability narrative states apply on the homepage. */
  narrativeStates?: Array<{
    id: string;
    label: string;
    title: string;
    summary: string;
    tone: 'failure' | 'technical' | 'valid';
    primaryStageId: string;
  }>;
};
