export const syncareerTraceStageIds = [
  'input',
  'model-output',
  'validation',
  'failure',
  'diagnosis',
  'intervention',
  'output',
] as const;

export type SyncareerTraceStageId = (typeof syncareerTraceStageIds)[number];
export type SyncareerTraceStageKind = 'input' | 'raw' | 'validate' | 'fail' | 'diagnosis' | 'intervene' | 'valid';

export const syncareerHomepageNarrativeStateIds = [
  'observed-failure',
  'engineering-response',
  'product-contract',
] as const;

export type SyncareerHomepageNarrativeStateId = (typeof syncareerHomepageNarrativeStateIds)[number];

type SyncareerHomepageNarrativeState = {
  id: SyncareerHomepageNarrativeStateId;
  label: string;
  title: string;
  summary: string;
  tone: 'failure' | 'technical' | 'valid';
  primaryStageId: SyncareerTraceStageId;
  stageIds: readonly SyncareerTraceStageId[];
};

type SharedStage = {
  id: Exclude<SyncareerTraceStageId, 'diagnosis'>;
  label: string;
  title: string;
  evidence: string;
  kind: Exclude<SyncareerTraceStageKind, 'diagnosis'>;
};

export const illustrativeBadOutput = `To become senior, you should...
- build projects

{
  title: Senior Dev
  level: 
  years: "five?"`;

export const illustrativeValidOutput = `{
  "title": "Senior Developer",
  "level": "senior",
  "years": 5,
  "next_steps": [
    "ship one AI feature",
    "add validation",
    "test beyond happy path"
  ]
}`;

export const syncareerInterventions = [
  'Prompt restructuring',
  'Few-shot anchor',
  'Explicit context management',
  'Tighter output constraints',
] as const;

export const syncareerFailureModes = [
  { name: 'Formatting', note: 'Missing schema' },
  { name: 'Context', note: 'Context dropped' },
  { name: 'Response variance', note: 'Inconsistent output' },
] as const;

export const sharedSyncareerStages = {
  input: {
    id: 'input',
    label: 'INPUT',
    title: 'User activity + profile context',
    evidence: 'Product record — context visible in SynAI surface.',
    kind: 'input',
  },
  modelOutput: {
    id: 'model-output',
    label: 'MODEL OUTPUT',
    title: 'Raw LLM response (illustrative bad output)',
    evidence: 'Confirmed observation: inconsistent formatting.',
    kind: 'raw',
  },
  validation: {
    id: 'validation',
    label: 'VALIDATION',
    title: 'Schema check',
    evidence: 'Check: title (string), level (enum), years (number), next_steps (array).',
    kind: 'validate',
  },
  failure: {
    id: 'failure',
    label: 'FAILURE',
    title: 'Observed failure modes',
    evidence: 'Confirmed observations from production use.',
    kind: 'fail',
  },
  intervention: {
    id: 'intervention',
    label: 'INTERVENTION',
    title: 'What Stephen changed',
    evidence: 'Related interventions listed in case study.',
    kind: 'intervene',
  },
  output: {
    id: 'output',
    label: 'VALID OUTPUT',
    title: 'Valid product output (illustrative)',
    evidence: 'Outcome shape matches product needs; no fabricated metrics.',
    kind: 'valid',
  },
} satisfies Record<string, SharedStage>;

export const syncareerHomepageNarrativeStates = [
  {
    id: 'observed-failure',
    label: 'Observed failure',
    title: 'Production exposed three failure modes.',
    summary: 'Inconsistent formatting, dropped context and response variance broke the expected product contract.',
    tone: 'failure',
    primaryStageId: 'failure',
    stageIds: ['model-output', 'failure'],
  },
  {
    id: 'engineering-response',
    label: 'Engineering response',
    title: 'Each failure mapped to a tighter response path.',
    summary: 'The prompt, examples, context and output constraints were made more explicit.',
    tone: 'technical',
    primaryStageId: 'intervention',
    stageIds: ['intervention'],
  },
  {
    id: 'product-contract',
    label: 'Product contract / evidence boundary',
    title: 'Valid output is a contract, not a reliability metric.',
    summary: 'The output shape can match product needs while the evidence boundary remains explicit.',
    tone: 'valid',
    primaryStageId: 'output',
    stageIds: ['validation', 'output'],
  },
] as const satisfies readonly SyncareerHomepageNarrativeState[];

export const syncareerHomepageNarrativeStateByStage: Partial<
  Record<SyncareerTraceStageId, SyncareerHomepageNarrativeStateId>
> = {
  'model-output': 'observed-failure',
  failure: 'observed-failure',
  intervention: 'engineering-response',
  validation: 'product-contract',
  output: 'product-contract',
};
