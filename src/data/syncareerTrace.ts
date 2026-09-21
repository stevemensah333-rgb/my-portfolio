/**
 * Backwards-compatible exports for the Syncareer trace content.
 * The single source of truth now lives in src/data/registry.ts.
 * This file re-exports the pieces that other modules import directly.
 *
 * New code should import from `../data/registry` instead.
 */

import { syncareer } from './registry';

export const syncareerTraceStageIds = syncareer.stages.map(s => s.id) as readonly string[];

export type SyncareerTraceStageId = (typeof syncareer.stages)[number]['id'];
export type SyncareerTraceStageKind = (typeof syncareer.stages)[number]['kind'];

export const syncareerHomepageNarrativeStateIds = syncareer.narrativeStates?.map(s => s.id) as
  | readonly string[]
  | undefined;

export type SyncareerHomepageNarrativeStateId = NonNullable<
  typeof syncareerHomepageNarrativeStateIds
>[number];

export const illustrativeBadOutput = syncareer.stages.find(s => s.id === 'model-output')?.code ?? '';
export const illustrativeValidOutput = syncareer.stages.find(s => s.id === 'output')?.code ?? '';

export const syncareerInterventions = (syncareer.stages.find(s => s.id === 'intervention')?.fixes ??
  []) as readonly string[];

export const syncareerFailureModes = (syncareer.stages.find(s => s.id === 'failure')?.modes ??
  []) as readonly { name: string; note: string }[];

type SharedStage = {
  id: Exclude<SyncareerTraceStageId, 'diagnosis'>;
  label: string;
  title: string;
  evidence: string;
  kind: Exclude<SyncareerTraceStageKind, 'diagnosis'>;
};

export const sharedSyncareerStages = {
  input: syncareer.stages.find(s => s.id === 'input'),
  modelOutput: syncareer.stages.find(s => s.id === 'model-output'),
  validation: syncareer.stages.find(s => s.id === 'validation'),
  failure: syncareer.stages.find(s => s.id === 'failure'),
  intervention: syncareer.stages.find(s => s.id === 'intervention'),
  output: syncareer.stages.find(s => s.id === 'output'),
} satisfies Record<string, unknown>;

export const syncareerHomepageNarrativeStates = syncareer.narrativeStates ?? [];

export const syncareerHomepageNarrativeStateByStage: Partial<
  Record<SyncareerTraceStageId, SyncareerHomepageNarrativeStateId>
> = {
  'model-output': 'observed-failure',
  failure: 'observed-failure',
  intervention: 'engineering-response',
  validation: 'product-contract',
  output: 'product-contract',
};

// Re-export with the explicit types for callers that depend on them.
export type { SharedStage };
