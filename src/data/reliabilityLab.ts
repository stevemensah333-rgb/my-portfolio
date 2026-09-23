/**
 * Reliability Lab — presentation layer for the instrument.
 *
 * The Lab reuses the Syncareer investigation stages verbatim (real
 * contract code, real checks, real failure classes; illustrative
 * model text stays labelled). This module only adds the small
 * instrument vocabulary the Lab needs on top:
 *
 *   - chip      : the state word stamped on a stage node / panel
 *   - readout   : one-line inspection text (hover / focus readout)
 *   - delta     : what happened to the payload between stages
 *   - illustrative : whether the payload is a fixture, not a log
 *
 * Nothing here invents a measurement. Where the evidence stops, the
 * copy says so (see `labBoundary`).
 */

import {
  investigationStages,
  type InvestigationStage,
  type InvestigationStageId,
} from './syncareerInvestigation';

export type LabStageMeta = {
  chip: string;
  readout: string;
  delta: string;
  illustrative: boolean;
};

export type LabStage = InvestigationStage & { lab: LabStageMeta };

const meta: Record<InvestigationStageId, LabStageMeta> = {
  input: {
    chip: 'bounded',
    readout:
      'Allowlisted context with hard size limits. The server fetches nothing on its own.',
    delta:
      'Origin: the product supplies one requirement, one opportunity and the selected CV evidence. Nothing else enters.',
    illustrative: false,
  },
  'model-output': {
    chip: 'untrusted',
    readout:
      'A fluent rewrite the supplied evidence does not support. Illustrative — old outputs were never captured.',
    delta:
      'Model text arrives unvalidated. An HTTP 200 from the gateway is not a check.',
    illustrative: true,
  },
  validation: {
    chip: 'checking',
    readout:
      'parseModelProposal, then grounding: citations must exist on the request before quota is consumed.',
    delta:
      'The payload is parsed and cited against the request’s own ids. Unknown or missing ids fail closed.',
    illustrative: false,
  },
  failure: {
    chip: 'refused',
    readout:
      '422 no_safe_proposal. Reservation released, quota not consumed, unsafe text never applied.',
    delta:
      'Grounding fails on the payload from 02: no requirement-* or evidence-* citation, invented claims.',
    illustrative: false,
  },
  diagnosis: {
    chip: 'root cause',
    readout:
      'Both sides of the contract were too thin: bullet-only requests, unvalidated remote JSON.',
    delta:
      'The failure classes from 04 are read against the old request and response shapes.',
    illustrative: false,
  },
  intervention: {
    chip: 'applied',
    readout:
      'Bounded prompts, allowlisted context, citation enforcement, factual-risk checks, explicit review.',
    delta:
      'The contract is revised on both sides. Same seam — no new provider, no framework, no vector store.',
    illustrative: false,
  },
  output: {
    chip: 'accepted',
    readout:
      'Cited proposal in the revised contract shape. Review is still required; nothing auto-applies.',
    delta:
      'Same request shape as 01, after 06: the rewrite now cites the requirement and evidence it used.',
    illustrative: true,
  },
};

const fallbackMeta: LabStageMeta = {
  chip: 'stage',
  readout: 'Inspect this stage.',
  delta: 'Payload handed off from the previous stage.',
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
    'The same engineering investigation as the Syncareer case study, opened as an instrument. Run it, step it, or inspect any stage directly: what the payload was, what the system did to it, and what it handed on. Items marked ILLUSTRATIVE are fixtures, not historical logs.',
  keys: 'Keyboard: ← → move between stages · Home / End jump · Enter or Space inspects · Run, Pause and Step are real buttons.',
  run: 'Run',
  pause: 'Pause',
  replay: 'Replay',
  prev: '← Step',
  next: 'Step →',
} as const;

export const labBoundary = {
  intro:
    'Every contract, check and refusal in this instrument is tracked source in the Syncareer repository. The two model texts are illustrative fixtures.',
  pointer:
    'The full evidence boundary — what exists, what was never measured, and what is not deployed yet — is stated once, in the case study.',
  pointerLabel: 'Read the evidence boundary',
} as const;
