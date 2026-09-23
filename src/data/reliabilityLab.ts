/**
 * Reliability Lab — inspection metadata for the canonical Syncareer stages.
 *
 * Payload artifacts and stage order come from syncareerInvestigation.ts.
 * This file adds only concise instrument state; it does not retell the case
 * study or imply that an illustrative fixture is a captured run.
 */

import {
  investigationStages,
  interventionRecord,
  type InvestigationStage,
  type InvestigationStageId,
} from './syncareerInvestigation';

export type LabInspection = { label: string; value: string };

export type LabStageMeta = {
  state: string;
  inspection: LabInspection[];
  interventions?: string[];
  illustrative: boolean;
};

export type LabStage = InvestigationStage & { lab: LabStageMeta };

const meta: Record<InvestigationStageId, LabStageMeta> = {
  input: {
    state: 'bounded request',
    inspection: [
      { label: 'System state', value: 'AssistantRequestV2; no server-side profile or history retrieval.' },
      { label: 'Validation state', value: 'Opportunity, requirement-* and evidence-* are required before the gateway call.' },
    ],
    illustrative: false,
  },
  'model-output': {
    state: 'untrusted gateway text',
    inspection: [
      { label: 'System state', value: 'Raw text; parsing, citation checks and review have not run yet.' },
      { label: 'Evidence', value: 'Fixture only. No historical model output was captured.' },
    ],
    illustrative: true,
  },
  validation: {
    state: 'validation rules',
    inspection: [
      { label: 'Validation state', value: 'Contract rules from tracked source; this is not a test-run result.' },
      { label: 'Order', value: 'Parse → allowed kind → supplied ids → grounding → factual-risk checks.' },
    ],
    illustrative: false,
  },
  failure: {
    state: 'refusal · 422',
    inspection: [
      { label: 'Failure reason', value: 'no_safe_proposal: the proposal did not pass the required checks.' },
      { label: 'System state', value: 'Reservation released; quota untouched; unsafe text cannot be accepted.' },
    ],
    illustrative: false,
  },
  diagnosis: {
    state: 'contract diagnosis',
    inspection: [
      { label: 'Before / revised', value: 'One bullet and broad source ids → bounded context and validated citations.' },
      { label: 'Evidence', value: 'Comparison of documented contract shapes; no incident log exists.' },
    ],
    illustrative: false,
  },
  intervention: {
    state: 'fail-closed intervention',
    inspection: [
      { label: 'System state', value: 'Validate → authenticate → reserve → entitlement → gateway → validate output → commit; failures release.' },
    ],
    interventions: interventionRecord.responses.map((item) => item.name),
    illustrative: false,
  },
  output: {
    state: 'proposal · review required',
    inspection: [
      { label: 'Output', value: 'A cited proposal containing kind, text and sourceContextIds.' },
      { label: 'Review state', value: 'A person must accept, edit or reject; nothing is applied automatically.' },
      { label: 'Evidence', value: 'Illustrative fixture, not a captured live response.' },
    ],
    illustrative: true,
  },
};

const fallbackMeta: LabStageMeta = {
  state: 'stage',
  inspection: [],
  illustrative: false,
};

export const labStages: LabStage[] = investigationStages.map((stage) => ({
  ...stage,
  lab: meta[stage.id] ?? fallbackMeta,
}));

export const labCopy = {
  eyebrow: 'Reliability Lab · instrument',
  title: 'One payload, seven stages, one instrument.',
  intro:
    'Inspect the request contract, validation rules, refusal path and output fixtures. The Syncareer case study explains the investigation; this instrument exposes its artifacts.',
  keys: 'Keyboard: arrow keys select a stage · Home / End jump · Previous and Next step · Replay returns to Input.',
  replay: 'Replay',
  prev: 'Previous',
  next: 'Next',
} as const;

export const labBoundary = {
  intro:
    'Contracts, validation rules and refusal behavior are read from tracked Syncareer source. Model payloads are illustrative fixtures, not historical logs.',
  pointer:
    'No live-model evaluation, captured before/after output, failure rate, latency or quality score is available.',
  pointerLabel: 'Read the full evidence boundary',
} as const;
