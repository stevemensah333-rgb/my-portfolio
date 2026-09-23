/**
 * Project registry types.
 *
 * Every project-shaped surface (archive, case pages, sitemap) reads from
 * the registry. Adding a new project means: add an entry in registry.ts,
 * add the route file, add the route to the sitemap list. Nothing else.
 *
 * Stage-level investigation data does NOT belong here — it lives in the
 * investigation module of the project it belongs to (one canonical
 * record per project, per AGENTS.md §5). `stages` is therefore optional
 * and only carries a stage list that has no other home.
 *
 * Evidence rules (per AGENTS.md):
 *   - status reflects reality, not aspiration
 *   - evidence[] items are real artifacts or explicitly "illustrative"
 */

export type ProjectStatus =
  | 'live'
  | 'mvp'
  | 'in-development'
  | 'coursework'
  | 'experiment';

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
  /** Optional label for the code panel header. Defaults to an ILLUSTRATIVE label.
   *  Set this when the code is a real implementation excerpt so it is not mislabelled. */
  codeLabel?: string;
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
  /** One-line claim used in the archive index. */
  short: string;
  /** Mono-tagged status — visible wherever the project appears. */
  status: ProjectStatus;
  /** The headline framing of the project (used on the case page). */
  claim: string;
  /** Three to five evidence points, each anchored to a real artifact. */
  evidence: ProjectEvidence[];
  /** Honest boundary on what is NOT claimed. Rendered on the project's own page. */
  claimLimit?: string;
  /** Stack — short list of the most relevant items. */
  stack: string[];
  /** Where this project's full case study lives. */
  route: string;
  /** Optional stage list, when no dedicated investigation module exists. */
  stages?: ProjectStage[];
};
