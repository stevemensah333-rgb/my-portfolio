/**
 * Tests for the Reliability Lab.
 *
 * The page renders what `evaluateReply` returns, and the visitor drives it
 * with their own sentence and citation choices — so these assertions are
 * about the verdicts a visitor can actually reach: which example passes,
 * which is refused and why, and what the check still cannot claim.
 *
 * The module is pure: no DOM, no network, no clock, no randomness.
 *
 * Run with `npm test` (node --test).
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import {
  GATE_RULES,
  LIMITS,
  PRESETS,
  SUPPLIED_CONTEXT,
  claimsIn,
  evaluateReply,
  groundClaims,
  inspectProposal,
  plainReason,
} from '../src/scripts/labScenario.mjs';

const preset = (id) => {
  const found = PRESETS.find((item) => item.id === id);
  assert.ok(found, `missing preset: ${id}`);
  return found;
};

const withPreset = (id) => evaluateReply({ text: preset(id).text, citedIds: preset(id).citedIds });

test('the same sentence always produces the same verdict', () => {
  assert.deepEqual(withPreset('invented'), withPreset('invented'));
  assert.deepEqual(withPreset('honest'), withPreset('honest'));
  assert.deepEqual(evaluateReply({ text: 'x', citedIds: [] }), evaluateReply({ text: 'x', citedIds: [] }));
});

test('there are four examples, and the two middle ones share their wording', () => {
  assert.equal(PRESETS.length, 4);
  assert.equal(preset('uncited').text, preset('one-sided').text);
  assert.equal(preset('one-sided').text, preset('honest').text);
  assert.notDeepEqual(preset('uncited').citedIds, preset('one-sided').citedIds);
  assert.deepEqual(preset('honest').citedIds, ['requirement-2', 'evidence-1']);
});

test('the invented example passes the checks, and every invented claim is flagged', () => {
  const state = withPreset('invented');
  assert.equal(state.status, 'passed');
  assert.equal(state.gate.ok, true);
  assert.deepEqual(
    state.unbacked.map((claim) => claim.phrase),
    ['5 years', 'Kubernetes', 'Acme Corp', '40%'],
  );
  /* The point of the example: a passing verdict is not a truth check. */
  assert.match(state.reason, /not the same as being true/);
});

test('the honest example passes with nothing left to flag', () => {
  const state = withPreset('honest');
  assert.equal(state.status, 'passed');
  assert.deepEqual(state.unbacked, []);
  assert.ok(state.claims.every((claim) => claim.grounded));
});

test('citing nothing is refused, in words a person would use', () => {
  const state = withPreset('uncited');
  assert.equal(state.status, 'refused');
  assert.equal(state.gate.reason, 'model_missing_grounding');
  assert.equal(state.reason, 'It doesn’t say where the sentence came from.');
});

test('citing one side is refused, and the reason names the missing side', () => {
  const state = withPreset('one-sided');
  assert.equal(state.status, 'refused');
  assert.equal(state.gate.reason, 'model_missing_grounding');
  assert.match(state.reason, /job asked for/);

  const evidenceOnly = evaluateReply({ text: preset('honest').text, citedIds: ['evidence-1'] });
  assert.equal(evidenceOnly.status, 'refused');
  assert.match(evidenceOnly.reason, /not at what the job asked for/);
});

test('an id the request never supplied is refused', () => {
  const state = evaluateReply({ text: preset('honest').text, citedIds: ['requirement-2', 'evidence-99'] });
  assert.equal(state.status, 'refused');
  assert.equal(state.gate.reason, 'model_unknown_source_id');
  assert.equal(state.reason, 'It cites something that was never in the material.');
});

test('an empty sentence asks for one instead of passing it', () => {
  const state = evaluateReply({ text: '   ', citedIds: ['requirement-2', 'evidence-1'] });
  assert.equal(state.status, 'empty');
  assert.equal(state.label, 'Nothing to check yet');
  assert.equal(state.unbacked.length, 0);
});

test('every reason code the gate can return has a plain-language sentence', () => {
  const codes = [...new Set(GATE_RULES.map((rule) => rule.reason))];
  for (const reason of codes) {
    const sentence = plainReason({ ok: false, reason }, [], SUPPLIED_CONTEXT);
    assert.equal(typeof sentence, 'string');
    assert.ok(sentence.length > 20, `no usable sentence for ${reason}`);
    assert.doesNotMatch(sentence, /model_|review_required/, `${reason} leaked its code into the copy`);
  }
});

test('the gate still refuses free prose, as the contract excerpt says', () => {
  const state = inspectProposal('Results-driven engineer with 5 years of Kubernetes experience.');
  assert.equal(state.ok, false);
  assert.equal(state.reason, 'model_not_json');
});

test('claims are a word match against the supplied material, nothing more', () => {
  const claims = groundClaims(claimsIn('Built Python and SQL queries to analyse 1,200 sales records.'));
  assert.ok(claims.some((claim) => claim.phrase === '1,200' && claim.grounded === true));
  assert.ok(claims.every((claim) => claim.grounded), 'the honest sentence is fully grounded');

  const invented = groundClaims(claimsIn('Led Kubernetes migrations at Acme Corp.'));
  assert.ok(invented.every((claim) => claim.grounded === false));
});

test('the supplied context stays inside the documented size limits', () => {
  assert.equal(SUPPLIED_CONTEXT.length, 4);
  assert.ok(SUPPLIED_CONTEXT.length <= LIMITS.contextItemMax);
  const total = SUPPLIED_CONTEXT.reduce((sum, item) => sum + item.content.length, 0);
  assert.ok(total <= LIMITS.contextTotalMax);
});

test('the checker stays offline and deterministic', () => {
  const source = readFileSync(new URL('../src/scripts/labScenario.mjs', import.meta.url), 'utf8');
  for (const forbidden of ['fetch(', 'XMLHttpRequest', 'Math.random', 'Date.now', 'new Date(']) {
    assert.equal(source.includes(forbidden), false, `labScenario.mjs must not use ${forbidden}`);
  }
});
