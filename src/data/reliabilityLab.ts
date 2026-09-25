/**
 * Reliability Lab — inspection metadata for the canonical Syncareer stages.
 *
 * Artifacts, summaries and hand-offs come from syncareerInvestigation.ts.
 * This file adds only the instrument reading: what arrived at the stage,
 * and what kind of evidence the reading is. It does not retell the case study.
 *
 * No second experiment. There is no historical log of constraint changes
 * producing different outputs, so a simulated model would be a fabricated run.
 */

import {
  investigationStages,
  type InvestigationStage,
  type InvestigationStageId,
} from './syncareerInvestigation';

export type LabReading = 'source' | 'rules' | 'illustrative' | 'interpretation';

export type LabStageMeta = {
  /** Short system-state name for the payload at this stage. */
  state: string;
  /**
   * What the instrument treats as having arrived. A label, not a second
   * explanation. Fixture stages say so, so they are not read as the output
   * of the previous stage.
   */
  received: string;
  reading: LabReading;
  readingLabel: string;
};

export type LabStage = InvestigationStage & { lab: LabStageMeta };

const meta: Record<InvestigationStageId, LabStageMeta> = {
  input: {
    state: 'bounded request',
    received: 'Product request · cv.rewrite_bullet',
    reading: 'source',
    readingLabel: 'Source · contract.ts',
  },
  'model-output': {
    state: 'untrusted gateway text',
    received: 'Not the output of stage 01 · old contract, bullet only',
    reading: 'illustrative',
    readingLabel: 'Illustrative fixture · not a captured output',
  },
  validation: {
    state: 'validation rules',
    received: '02 · raw model text',
    reading: 'rules',
    readingLabel: 'Rules from source · not a test-run result',
  },
  failure: {
    state: 'refusal · 422',
    received: '03 · rewrite with nothing to cite',
    reading: 'source',
    readingLabel: 'Handler behavior · not a captured incident',
  },
  diagnosis: {
    state: 'contract diagnosis',
    received: '04 · refusal, nothing applied',
    reading: 'interpretation',
    readingLabel: 'Interpretation · no incident log',
  },
  intervention: {
    state: 'fail-closed intervention',
    received: '05 · repair target is the contract',
    reading: 'source',
    readingLabel: 'Source · handler.ts',
  },
  output: {
    state: 'proposal · review required',
    received: 'Not a captured result of stage 06 · revised shape',
    reading: 'illustrative',
    readingLabel: 'Illustrative fixture · not a live response',
  },
};

export const labStages: LabStage[] = investigationStages.map((stage) => ({
  ...stage,
  lab: meta[stage.id],
}));

export const labCopy = {
  eyebrow: 'Reliability Lab',
  title: 'One payload, seven stages, one instrument',
  keys: 'Arrows select a stage. Home and End jump. R replays. C compares.',
  replay: 'Replay',
  prev: 'Previous',
  next: 'Next',
  compare: 'Before / after',
} as const;

export const labBoundary = {
  intro:
    'This is an instrument for exploring how AI output moves through an application — one of the failure patterns I encountered while building AI-powered software. It is a demonstration of a way of working, not a claim that AI reliability is solved. Contracts, validation rules and refusal behavior are read from tracked Syncareer source; model payloads are illustrative fixtures, not historical logs.',
  pointer:
    'No live-model evaluation, captured before/after output, failure rate, latency or quality score is available.',
  pointerLabel: 'Read the full evidence boundary',
} as const;

export const labCompareCopy = {
  title: 'Before → after',
  state: 'documented shapes · illustrative fixtures',
  note: 'Contract rows are documented shapes. The two model texts are fixtures, not a captured pair.',
  before: 'Before',
  after: 'After',
} as const;
