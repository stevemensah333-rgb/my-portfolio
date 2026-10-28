/**
 * Reliability Lab — the deterministic local scenario.
 *
 * One CV bullet followed through five steps: the context a revised request
 * carries, an answer that context cannot support, the gate that refuses it,
 * a cited proposal that passes the gate, and the person who still decides.
 *
 * WHAT THIS IS
 *   Pure functions over plain data. No network, no model, no clock and no
 *   randomness, so the same inputs always produce the same reading. The page
 *   renders this result on the server; the browser replays it. `npm test`
 *   asserts it.
 *
 * WHAT THIS IS NOT
 *   Not Syncareer's production validator and not a truth check. `inspectProposal`
 *   is a small subset of the documented contract: JSON shape, the kind
 *   allowlist, citations drawn from the ids actually supplied, and a
 *   requirement/evidence pair. `claimsIn`/`groundClaims` are a word match
 *   against the supplied context, nothing more — a claim phrased differently
 *   reads as unsupported, and a claim whose words appear in the context can
 *   still be misused.
 *
 * The fixture texts are passed in by the caller; on the site they come from
 * `src/data/syncareerInvestigation.ts`, which stays the single copy.
 */

export const TASK = 'cv.rewrite_bullet';

export const INSTRUCTION = 'Rewrite the selected bullet for requirement-2.';

/** Provenance is a fixed list in the documented contract. */
export const PROVENANCE = Object.freeze(['job_description', 'selected_cv_text']);

/** The size limits named in contract.ts. */
export const LIMITS = Object.freeze({
  instructionMax: 2000,
  contextItemMax: 12,
  contextItemContentMax: 8000,
  contextTotalMax: 24000,
});

/**
 * The context a revised request would supply. Illustrative fixture shaped by
 * the v2 contract — the same two cited items the canonical output fixture
 * uses, plus the opportunity and the selected bullet. None of it crossed the
 * old contract's boundary: that request sent the bullet alone.
 */
export const SUPPLIED_CONTEXT = Object.freeze([
  {
    id: 'opportunity-1',
    label: 'Opportunity',
    provenance: 'job_description',
    content: 'Graduate data analyst role, Accra.',
  },
  {
    id: 'requirement-2',
    label: 'Requirement 2',
    provenance: 'job_description',
    content: 'Python and SQL for reporting.',
  },
  {
    id: 'evidence-1',
    label: 'Evidence 1',
    provenance: 'selected_cv_text',
    content: 'Class project analysing 1,200 sales records.',
  },
  {
    id: 'bullet-1',
    label: 'Selected bullet',
    provenance: 'selected_cv_text',
    content: 'Worked on a sales analysis project.',
  },
]);

/**
 * The rules the local gate applies, in the order it applies them. The page
 * renders this list, so the explanation and the code cannot drift.
 */
export const GATE_RULES = Object.freeze([
  {
    reason: 'model_not_json',
    name: 'It must be JSON',
    note: 'The reply is parsed. Prose is refused before anything is read from it.',
  },
  {
    reason: 'model_kind',
    name: 'It must be a rewrite',
    note: 'cv.rewrite_bullet may return one kind only: a non-empty rewrite proposal.',
  },
  {
    reason: 'model_missing_grounding',
    name: 'It must cite something',
    note: 'A proposal with no source ids cites nothing and stops here.',
  },
  {
    reason: 'model_unknown_source_id',
    name: 'It must cite what was sent',
    note: 'Every id must belong to the context the request supplied — no invented ids.',
  },
  {
    reason: 'model_missing_grounding',
    name: 'It must cite both sides',
    note: 'At least one requirement-* and one evidence-* id, or the claim has no footing.',
  },
  {
    reason: 'review_required',
    name: 'Then it goes to a person',
    note: 'What passes is a proposal for review — not a verified claim and not an applied edit.',
  },
]);

/** The four review actions the product offers. Accept is a person's act. */
export const REVIEW_ACTIONS = Object.freeze(['accept', 'edit', 'reject', 'undo']);

const fail = (reason, message) => ({ ok: false, reason, message });
const pass = (reason, message) => ({ ok: true, reason, message });

/**
 * The local gate. A subset of the documented contract — see the file header.
 * @param {string} raw
 * @param {string[]} suppliedIds
 */
export function inspectProposal(raw, suppliedIds = SUPPLIED_CONTEXT.map((item) => item.id)) {
  const ids = Array.isArray(suppliedIds) ? suppliedIds : [];

  let proposal;
  try {
    proposal = JSON.parse(raw);
  } catch {
    return fail('model_not_json', 'The reply is prose. Only a JSON proposal can be checked.');
  }

  if (
    !proposal ||
    typeof proposal !== 'object' ||
    Array.isArray(proposal) ||
    proposal.kind !== 'rewrite' ||
    typeof proposal.text !== 'string' ||
    !proposal.text.trim()
  ) {
    return fail('model_kind', 'The reply must be a non-empty rewrite proposal.');
  }

  const cited = proposal.sourceContextIds;
  if (!Array.isArray(cited) || cited.length === 0) {
    return fail('model_missing_grounding', 'No source ids. The proposal must cite the context it used.');
  }

  if (cited.some((id) => typeof id !== 'string' || !ids.includes(id))) {
    return fail(
      'model_unknown_source_id',
      'A citation names an id the request never supplied.',
    );
  }

  const hasRequirement = cited.some((id) => id.startsWith('requirement-'));
  const hasEvidence = cited.some((id) => id.startsWith('evidence-'));
  if (!hasRequirement || !hasEvidence) {
    return fail(
      'model_missing_grounding',
      'Cite at least one requirement-* and one evidence-* id.',
    );
  }

  return pass(
    'review_required',
    'Shape and citations pass these local checks. A person must still review the claim.',
  );
}

const NUMBER_CLAIM = /\d[\d,]*(?:\.\d+)?\s*(?:%|percent|years?|yrs?|months?|weeks?)?/gi;
const NAME_TOKEN = /\b[A-Z][A-Za-z]{1,}\b/g;

const isSentenceStart = (text, index) => {
  let cursor = index - 1;
  while (cursor >= 0 && /\s/.test(text[cursor])) cursor -= 1;
  if (cursor < 0) return true;
  return /[.!?]/.test(text[cursor]) || text[cursor] === '\n';
};

/**
 * Pluck the checkable claims out of a reply: numbers (with a unit when one
 * follows) and capitalised names, skipping the first word of a sentence.
 * Adjacent proper nouns stay together, so "Acme Corp" is one claim and
 * "Built Python" is not a claim at all. A word list, not an argument about
 * meaning.
 * @param {string} text
 */
export function claimsIn(text) {
  if (typeof text !== 'string' || !text.trim()) return [];
  const found = [];

  for (const match of text.matchAll(NUMBER_CLAIM)) {
    const phrase = match[0].trim();
    if (phrase) found.push({ phrase, kind: 'number', start: match.index ?? 0 });
  }

  let group = null;
  for (const match of text.matchAll(NAME_TOKEN)) {
    const index = match.index ?? 0;
    const end = index + match[0].length;
    if (isSentenceStart(text, index)) {
      /* A sentence opener is usually a verb or an adjective, so it is not a
         claim: drop it when it runs into a hyphen ("Results-driven") or when a
         proper noun follows ("Built Python"). A sentence that opens on the
         noun itself ("Kubernetes shipped…") keeps it. */
      const rest = text.slice(end);
      group = null;
      if (text[end] === '-' || /^\s+[A-Z]/.test(rest)) continue;
    }
    if (group) {
      const gap = text.slice(group.end, index);
      if (/^\s+$/.test(gap)) {
        group.phrase = `${group.phrase} ${match[0]}`;
        group.end = index + match[0].length;
        continue;
      }
      found.push(group);
      group = null;
    }
    group = { phrase: match[0], kind: 'name', start: index, end: index + match[0].length };
  }
  if (group) found.push(group);

  const seen = new Set();
  return found
    .sort((a, b) => a.start - b.start)
    .filter((claim) => {
      const key = claim.phrase.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(({ phrase, kind }) => ({ phrase, kind }));
}

/**
 * Mark each claim as present or absent in the supplied context. A string
 * comparison against the context text, nothing more.
 * @param {{phrase: string, kind: string}[]} claims
 * @param {{id: string, content: string}[]} context
 */
export function groundClaims(claims, context = SUPPLIED_CONTEXT) {
  const items = Array.isArray(context) ? context : [];
  return claims.map((claim) => {
    const needle = claim.phrase.toLowerCase();
    const source = items.find((item) =>
      typeof item.content === 'string' && item.content.toLowerCase().includes(needle),
    );
    return { ...claim, grounded: Boolean(source), sourceId: source ? source.id : null };
  });
}

/**
 * Build the whole reading once. Everything the page shows — and everything
 * the test asserts — comes from here.
 */
export function runScenario({ oldText = '', revisedText = '', context = SUPPLIED_CONTEXT } = {}) {
  const items = Array.isArray(context) ? context : [];
  const suppliedIds = items.map((item) => item.id);
  const contextText = items.map((item) => item.content).join(' ');

  const oldGate = inspectProposal(oldText, suppliedIds);
  const revisedGate = inspectProposal(revisedText, suppliedIds);

  let revisedProposal = null;
  try {
    revisedProposal = JSON.parse(revisedText);
  } catch {
    revisedProposal = null;
  }

  /* Claims are read from the reply a person would actually see: the prose of
     the old fixture, and the proposal's own text — never the JSON envelope,
     whose keys and ids are not claims about the candidate. */
  const oldClaims = groundClaims(claimsIn(oldText), items);
  const revisedReplyText =
    typeof revisedProposal?.text === 'string' ? revisedProposal.text : revisedText;
  const revisedClaims = groundClaims(claimsIn(revisedReplyText), items);

  const hasOpportunity = items.some((item) => item.id.startsWith('opportunity-'));
  const hasRequirement = items.some(
    (item) => item.id.startsWith('requirement-') && item.provenance === 'job_description',
  );
  const hasEvidence = items.some(
    (item) => item.id.startsWith('evidence-') && item.provenance === 'selected_cv_text',
  );
  const totalChars = items.reduce(
    (sum, item) => sum + (typeof item.content === 'string' ? item.content.length : 0),
    0,
  );
  const provenanceKnown = items.every((item) => PROVENANCE.includes(item.provenance));

  const requestChecks = [
    {
      name: 'A version 2 request',
      pass: true,
      note: `${TASK} · version 2 · requestId, instruction and typed context items.`,
    },
    {
      name: 'Allowlisted provenance',
      pass: provenanceKnown,
      note: items.every((item) => PROVENANCE.includes(item.provenance))
        ? `Every item carries one of ${PROVENANCE.length} known provenances.`
        : 'An item carries a provenance the contract does not allow.',
    },
    {
      name: 'Opportunity, requirement and evidence present',
      pass: hasOpportunity && hasRequirement && hasEvidence,
      note: 'The documented preflight. Fail this and the request stops before the model is called.',
    },
    {
      name: 'Within the size limits',
      pass: items.length <= LIMITS.contextItemMax && totalChars <= LIMITS.contextTotalMax,
      note: `${items.length} of ${LIMITS.contextItemMax} items · ${totalChars.toLocaleString('en-GB')} of ${LIMITS.contextTotalMax.toLocaleString('en-GB')} characters.`,
    },
  ];

  const variants = [];
  if (revisedProposal && typeof revisedProposal === 'object') {
    const shape = (sourceContextIds) =>
      JSON.stringify({ ...revisedProposal, sourceContextIds }, null, 2);
    variants.push(
      {
        id: 'prose',
        label: 'Old-contract prose',
        note: 'The recorded failure shape: free text, no citations, nothing to check.',
        raw: oldText,
        verdict: oldGate,
      },
      {
        id: 'uncited',
        label: 'Cited shape, no citations',
        note: 'Coordinates stripped out of an otherwise valid rewrite.',
        raw: shape([]),
        verdict: inspectProposal(shape([]), suppliedIds),
      },
      {
        id: 'unknown',
        label: 'Cited shape, unknown id',
        note: 'One invented id beside one real one.',
        raw: shape(['requirement-2', 'evidence-99']),
        verdict: inspectProposal(shape(['requirement-2', 'evidence-99']), suppliedIds),
      },
      {
        id: 'partial',
        label: 'Cited shape, requirement only',
        note: 'A real citation, but only one side of the claim.',
        raw: shape(['requirement-2']),
        verdict: inspectProposal(shape(['requirement-2']), suppliedIds),
      },
    );
  }

  return {
    task: TASK,
    instruction: INSTRUCTION,
    context: items,
    suppliedIds,
    contextText,
    requestChecks,
    oldText,
    revisedText,
    revisedReplyText,
    revisedProposal,
    oldClaims,
    revisedClaims,
    oldGate,
    revisedGate,
    variants,
    reviews: {
      revised: createReview(revisedGate, revisedProposal?.text ?? ''),
      refused: createReview(oldGate, ''),
    },
  };
}

/**
 * The review surface as a small state machine. Nothing is persisted: `saved`
 * stays null because the saved CV is written by the product's existing save,
 * which this local demonstration does not run.
 * @param {{ok: boolean, reason?: string, message?: string}} gate
 * @param {string} text
 */
export function createReview(gate, text = '') {
  const gateOk = Boolean(gate?.ok);
  return {
    gateOk,
    reason: gate?.reason ?? null,
    status: gateOk ? 'awaiting_review' : 'blocked',
    text,
    draft: null,
    saved: null,
    message: gateOk
      ? 'Accept, edit, reject or undo. The saved CV changes only when the existing save runs.'
      : `Accept is blocked: the gate refused this reply (${gate?.reason ?? 'unknown'}). It must be edited or regenerated first.`,
  };
}

/**
 * One review action. Returns the next state; never mutates the previous one.
 * @param {{gateOk: boolean, reason: string|null, status: string, text: string, draft: string|null, saved: string|null, message: string}} review
 * @param {'accept'|'edit'|'reject'|'undo'} action
 * @param {{text?: string}} [payload]
 */
export function reviewAction(review, action, payload = {}) {
  if (!review || typeof review !== 'object') return review;
  const nextText = typeof payload.text === 'string' ? payload.text : review.text;

  if (action === 'undo') {
    if (review.status !== 'accepted' && review.status !== 'edited') return review;
    return {
      ...review,
      status: 'awaiting_review',
      draft: null,
      message: 'Undone. The draft is back to the proposal; nothing was saved.',
    };
  }

  if (!REVIEW_ACTIONS.includes(action)) return review;

  if (!review.gateOk) {
    return {
      ...review,
      message: `Blocked: the gate refused this reply (${review.reason ?? 'unknown'}). A person can edit or regenerate, but not accept it.`,
    };
  }

  if (review.status !== 'awaiting_review') return review;

  if (action === 'accept') {
    return {
      ...review,
      status: 'accepted',
      draft: nextText,
      saved: null,
      message:
        'Accepted into the draft field. The saved CV is unchanged — the existing save is what persists it.',
    };
  }

  if (action === 'edit') {
    return {
      ...review,
      status: 'edited',
      draft: nextText,
      saved: null,
      message: 'Edited. The person’s wording is now the draft; still nothing written to the saved CV.',
    };
  }

  if (action === 'reject') {
    return {
      ...review,
      status: 'rejected',
      draft: null,
      saved: null,
      message: 'Rejected. The draft is untouched and nothing was written.',
    };
  }

  return review;
}

/** The stage ids the page exposes as deep links, in order. */
export const STAGE_IDS = Object.freeze([
  'lab-input',
  'lab-model-output',
  'lab-failure',
  'lab-revised',
  'lab-review',
]);
