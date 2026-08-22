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
  { name: 'Structure', note: 'Inconsistent output' },
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
