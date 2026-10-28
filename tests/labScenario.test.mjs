/**
 * Tests for the Reliability Lab's scenario logic.
 *
 * The page renders the reading `runScenario` returns, so these assertions are
 * about what a visitor is shown: which reason code each reply earns, which
 * claims trace back to the supplied context, and what the review surface will
 * and will not do. No DOM, no network, no clock.
 *
 * Run with `npm test` (node --test).
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { investigationStages } from '../src/data/syncareerInvestigation.ts';
import {
  GATE_RULES,
  LIMITS,
  STAGE_IDS,
  SUPPLIED_CONTEXT,
  claimsIn,
  groundClaims,
  inspectProposal,
  reviewAction,
  runScenario,
} from '../src/scripts/labScenario.mjs';

const codeOf = (id) => {
  const stage = investigationStages.find((item) => item.id === id);
  assert.ok(stage && stage.artifact && stage.artifact.kind === 'code', `missing code artifact: ${id}`);
  return stage.artifact.code;
};

/* The canonical fixtures — the same two the page renders. */
const oldText = codeOf('model-output');
const revisedText = codeOf('output');
const scenario = runScenario({ oldText, revisedText });

test('the same inputs always produce the same reading', () => {
  const again = runScenario({ oldText, revisedText });
  assert.deepEqual(again, scenario);
  assert.deepEqual(runScenario({ oldText, revisedText }), again);
});

test('the supplied context passes the documented preflight', () => {
  assert.deepEqual(
    scenario.requestChecks.map((check) => check.name),
    [
      'A version 2 request',
      'Allowlisted provenance',
      'Opportunity, requirement and evidence present',
      'Within the size limits',
    ],
  );
  assert.ok(
    scenario.requestChecks.every((check) => check.pass),
    'every preflight check should pass for the supplied context',
  );
  assert.equal(scenario.context.length, 4);
  assert.ok(scenario.context.length <= LIMITS.contextItemMax);
  assert.deepEqual(scenario.suppliedIds, ['opportunity-1', 'requirement-2', 'evidence-1', 'bullet-1']);
});

test('the old-contract reply is prose, and the gate refuses it by name', () => {
  assert.equal(scenario.oldGate.ok, false);
  assert.equal(scenario.oldGate.reason, 'model_not_json');
  assert.equal(scenario.oldClaims.length, 4);
  assert.deepEqual(
    scenario.oldClaims.map((claim) => claim.phrase),
    ['5 years', 'Kubernetes', 'Acme Corp', '40%'],
  );
  assert.ok(
    scenario.oldClaims.every((claim) => claim.grounded === false),
    'none of the invented claims may appear in the supplied context',
  );
});

test('the revised reply parses, cites supplied ids, and earns review — not a pass on truth', () => {
  assert.equal(scenario.revisedGate.ok, true);
  assert.equal(scenario.revisedGate.reason, 'review_required');
  assert.match(scenario.revisedGate.message, /person must still review/i);
  assert.deepEqual(scenario.revisedProposal?.sourceContextIds, ['requirement-2', 'evidence-1']);
  assert.ok(
    scenario.revisedProposal.sourceContextIds.every((id) => scenario.suppliedIds.includes(id)),
  );

  /* Claims are read from the proposal text, not from the JSON envelope. */
  assert.equal(scenario.revisedReplyText, scenario.revisedProposal.text);
  assert.deepEqual(
    scenario.revisedClaims.map((claim) => claim.phrase),
    ['Python', 'SQL', '1,200'],
  );
  assert.ok(scenario.revisedClaims.every((claim) => claim.grounded));
  assert.deepEqual(
    scenario.revisedClaims.map((claim) => claim.sourceId),
    ['requirement-2', 'requirement-2', 'evidence-1'],
  );
});

test('every malformed variant of the proposal is refused with a named reason', () => {
  const reasons = Object.fromEntries(scenario.variants.map((variant) => [variant.id, variant.verdict.reason]));
  assert.deepEqual(reasons, {
    prose: 'model_not_json',
    uncited: 'model_missing_grounding',
    unknown: 'model_unknown_source_id',
    partial: 'model_missing_grounding',
  });
  assert.ok(
    scenario.variants.every((variant) => variant.verdict.ok === false),
    'a variant with no citations must not pass',
  );

  /* The two grounding rules are distinguishable only by their message, so
     assert the difference the page shows. */
  const uncited = scenario.variants.find((variant) => variant.id === 'uncited');
  const partial = scenario.variants.find((variant) => variant.id === 'partial');
  assert.match(uncited.verdict.message, /no source ids/i);
  assert.match(partial.verdict.message, /requirement-\* and one evidence-\*/i);
});

test('the gate refuses anything not named in the supplied context', () => {
  const shape = (patch) => JSON.stringify({ kind: 'rewrite', text: 'Built Python queries.', ...patch });
  assert.equal(inspectProposal(shape({ sourceContextIds: ['evidence-99'] })).reason, 'model_unknown_source_id');
  assert.equal(inspectProposal(shape({ kind: 'answer', sourceContextIds: ['requirement-2'] })).reason, 'model_kind');
  assert.equal(inspectProposal('not json at all').reason, 'model_not_json');
  assert.equal(inspectProposal(shape({ text: '   ' }), ['requirement-2']).reason, 'model_kind');
  assert.equal(
    inspectProposal(shape({ sourceContextIds: ['requirement-2', 'evidence-1'] }), ['requirement-2', 'evidence-1'])
      .reason,
    'review_required',
  );
});

test('every reason the gate can return is documented in GATE_RULES', () => {
  const documented = new Set(GATE_RULES.map((rule) => rule.reason));
  const observed = new Set([
    scenario.oldGate.reason,
    scenario.revisedGate.reason,
    ...scenario.variants.map((variant) => variant.verdict.reason),
    inspectProposal('nope').reason,
    inspectProposal(JSON.stringify({ kind: 'answer' })).reason,
    inspectProposal(JSON.stringify({ kind: 'rewrite', text: 'x', sourceContextIds: [] })).reason,
    inspectProposal(JSON.stringify({ kind: 'rewrite', text: 'x', sourceContextIds: ['evidence-9'] })).reason,
  ]);
  for (const reason of observed) {
    assert.ok(documented.has(reason), `${reason} is not in GATE_RULES`);
  }
});

test('claims are a word match: sentence-initial words and acronyms behave predictably', () => {
  assert.deepEqual(claimsIn('Built Python and SQL queries.').map((claim) => claim.phrase), ['Python', 'SQL']);
  assert.deepEqual(claimsIn('At Acme Corp we shipped Kubernetes.').map((claim) => claim.phrase), [
    'Acme Corp',
    'Kubernetes',
  ]);
  /* A sentence that opens on the noun keeps it; a hyphenated opener is dropped. */
  assert.deepEqual(claimsIn('Kubernetes shipped it.').map((claim) => claim.phrase), ['Kubernetes']);
  assert.deepEqual(claimsIn('Results-driven engineer.').map((claim) => claim.phrase), []);
  assert.deepEqual(claimsIn(''), []);

  /* A claim whose words are in the context is grounded; a rephrasing is not. */
  const grounded = groundClaims(claimsIn('Python and SQL'), SUPPLIED_CONTEXT);
  assert.ok(grounded.every((claim) => claim.grounded));
  const rephrased = groundClaims(claimsIn('Pythons and SQLs'), SUPPLIED_CONTEXT);
  assert.equal(rephrased[0]?.grounded, false);
});

test('review: a person decides, and nothing is saved by this page', () => {
  const revised = scenario.reviews.revised;
  assert.equal(revised.status, 'awaiting_review');
  assert.equal(revised.gateOk, true);
  assert.equal(revised.draft, null);
  assert.equal(revised.saved, null);

  const accepted = reviewAction(revised, 'accept', { text: 'Built Python and SQL queries.' });
  assert.equal(accepted.status, 'accepted');
  assert.equal(accepted.draft, 'Built Python and SQL queries.');
  assert.equal(accepted.saved, null, 'accept must not claim the saved CV changed');
  assert.match(accepted.message, /saved CV is unchanged/i);

  const undone = reviewAction(accepted, 'undo');
  assert.equal(undone.status, 'awaiting_review');
  assert.equal(undone.draft, null);

  const edited = reviewAction(revised, 'edit', { text: 'Analysed sales data in Python.' });
  assert.equal(edited.status, 'edited');
  assert.equal(edited.draft, 'Analysed sales data in Python.');
  assert.equal(reviewAction(edited, 'undo').status, 'awaiting_review');

  const rejected = reviewAction(revised, 'reject');
  assert.equal(rejected.status, 'rejected');
  assert.equal(rejected.draft, null);
  assert.equal(reviewAction(rejected, 'undo'), rejected, 'undo is not offered after a rejection');
  assert.equal(reviewAction(revised, 'accept').status, 'accepted');
  assert.equal(reviewAction(revised, 'nonsense'), revised, 'unknown actions change nothing');
});

test('review: accept is blocked while the gate refuses', () => {
  const refused = scenario.reviews.refused;
  assert.equal(refused.gateOk, false);
  assert.equal(refused.status, 'blocked');

  for (const action of ['accept', 'edit', 'reject']) {
    const next = reviewAction(refused, action);
    assert.equal(next.status, 'blocked', `${action} must not change a blocked review`);
    assert.equal(next.draft, null);
    assert.match(next.message, /^Blocked:/);
  }
  assert.equal(reviewAction(refused, 'undo'), refused);
});

test('the module is deterministic by construction: no network, no clock, no randomness', () => {
  const source = readFileSync(new URL('../src/scripts/labScenario.mjs', import.meta.url), 'utf8');
  for (const forbidden of ['fetch(', 'XMLHttpRequest', 'Math.random', 'Date.now', 'new Date', 'process.env']) {
    assert.equal(source.includes(forbidden), false, `labScenario.mjs must not use ${forbidden}`);
  }
});

test('the page keeps every stage and legacy deep link', () => {
  const page = readFileSync(new URL('../src/components/ScenarioLab.astro', import.meta.url), 'utf8');
  for (const id of STAGE_IDS) {
    assert.ok(page.includes(`id: '${id}'`), `missing stage: ${id}`);
  }
  assert.ok(page.includes('id={stage.id}'), 'stages must render their id from stageMeta');
  const required = [
    'lab-compare',
    'lab-validation',
    'lab-intervention',
    'lab-output',
    'lab-diagnosis',
    'source-inspection',
    'lab-code',
  ];
  for (const id of required) {
    assert.ok(page.includes(`id="${id}"`) || page.includes(`id=${id}`), `missing anchor: ${id}`);
  }
  assert.equal(new Set(STAGE_IDS).size, STAGE_IDS.length);
  assert.equal(STAGE_IDS.length, 5);
});

test('the page renders the canonical fixtures, labelled as illustrative', () => {
  const page = readFileSync(new URL('../src/components/ScenarioLab.astro', import.meta.url), 'utf8');
  assert.ok(page.includes('ILLUSTRATIVE — fixture, not a captured output'));
  assert.ok(page.includes('ILLUSTRATIVE — fixture in the revised shape, not a live sample'));
  assert.ok(page.includes('Illustrative reply · old-contract shape'));
  assert.ok(page.includes('Illustrative reply · revised-contract shape'));
  assert.ok(page.includes('No model is called'));
});
