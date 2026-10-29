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
 * Try a sentence against the gate.
 *
 * The bench on /lab/ lets a visitor write their own line and choose which
 * supplied items it cites, so the gate has to be callable with a stranger's
 * text. It is the same `inspectProposal` the product's contract excerpt
 * describes: shape, the kind allowlist, citations drawn from the ids actually
 * supplied, and both sides of the claim. The word match from `groundClaims`
 * rides along as advice, never as a pass or a fail.
 *
 * @param {{text?: string, citedIds?: string[], context?: {id: string, content: string, label?: string}[]}} input
 */
export function evaluateReply({ text = '', citedIds = [], context = SUPPLIED_CONTEXT } = {}) {
  const items = Array.isArray(context) ? context : [];
  const ids = items.map((item) => item.id);
  const body = typeof text === 'string' ? text : '';
  const cited = Array.isArray(citedIds) ? citedIds.filter((id) => typeof id === 'string') : [];

  const raw = JSON.stringify({ kind: 'rewrite', text: body, sourceContextIds: cited });
  const gate = inspectProposal(raw, ids);
  const claims = groundClaims(claimsIn(body), items);
  const unbacked = claims.filter((claim) => !claim.grounded);

  const empty = !body.trim();
  const hasRequirement = cited.some((id) => id.startsWith('requirement-'));
  const hasEvidence = cited.some((id) => id.startsWith('evidence-'));
  const unknown = cited.filter((id) => !ids.includes(id));

  /* One row per rule the page actually runs, so a refusal can point at the
     line that failed instead of only naming the first one. */
  const checks = [
    {
      id: 'cites-something',
      name: 'Cites something',
      pass: cited.length > 0,
      note: 'No ids at all.',
    },
    {
      id: 'known-ids',
      name: 'Only ids it was given',
      pass: unknown.length === 0,
      note: unknown.length ? `Unknown: ${unknown.join(', ')}.` : 'Every id belongs to the material.',
    },
    {
      id: 'both-sides',
      name: 'A requirement and evidence',
      pass: hasRequirement && hasEvidence,
      note:
        hasRequirement && hasEvidence
          ? 'Both sides are cited.'
          : !hasRequirement && !hasEvidence
            ? 'Neither side is cited.'
            : hasRequirement
              ? 'The job ad is cited, the work is not.'
              : 'The work is cited, the job ad is not.',
    },
    {
      id: 'has-text',
      name: 'Something to read',
      pass: Boolean(body.trim()),
      note: 'The proposal has text in it.',
    },
  ];

  return {
    checks,
    text: body,
    citedIds: cited,
    gate,
    claims,
    unbacked,
    empty,
    status: empty ? 'empty' : gate.ok ? 'passed' : 'refused',
    label: empty ? 'Nothing to check yet' : gate.ok ? 'Passed the checks' : 'Refused',
    reason: empty ? 'Write a sentence, or start from one of the examples.' : plainReason(gate, cited, items),
  };
}

/**
 * The gate's reason code, in words a person would use. Kept beside
 * `inspectProposal` so a new reason code cannot ship without a sentence.
 * @param {{ok: boolean, reason?: string}} gate
 * @param {string[]} cited
 * @param {{id: string}[]} items
 */
export function plainReason(gate, cited = [], items = SUPPLIED_CONTEXT) {
  if (gate?.ok) return 'A person still has to read the claim. Passing this check is not the same as being true.';

  const ids = items.map((item) => item.id);
  const known = (Array.isArray(cited) ? cited : []).filter((id) => ids.includes(id));

  if (gate?.reason === 'model_unknown_source_id') {
    return 'It cites something that was never in the material.';
  }
  if (gate?.reason === 'model_missing_grounding') {
    if (!known.length) return 'It doesn’t say where the sentence came from.';
    const requirement = known.some((id) => id.startsWith('requirement-'));
    const evidence = known.some((id) => id.startsWith('evidence-'));
    if (requirement && !evidence) return 'It points at what the job asked for, but not at anything you’ve done.';
    if (evidence && !requirement) return 'It points at your evidence, but not at what the job asked for.';
    return 'It needs at least one requirement and one piece of evidence.';
  }
  if (gate?.reason === 'model_kind') {
    return 'The reply has to be a rewrite proposal with some text in it.';
  }
  if (gate?.reason === 'model_not_json') {
    return 'The reply isn’t in the shape the contract expects.';
  }
  return 'The check refused this one.';
}

/**
 * The four lines the bench offers. Three of them are things that went wrong
 * in the real product, or a plausible version of them; the fourth is the
 * fixture that passes. Same sentence, different citations, in the middle two:
 * the point is that the words are identical and only the sourcing differs.
 */
export const PRESETS = Object.freeze([
  {
    id: 'invented',
    label: 'Invent a company',
    text: 'Results-driven engineer with 5 years of Kubernetes experience who transformed deployments at Acme Corp, improving speed by 40%.',
    citedIds: ['requirement-2', 'evidence-1'],
    note: 'Passes the checks, and every claim in it is made up.',
  },
  {
    id: 'uncited',
    label: 'Cite nothing',
    text: 'Built Python and SQL queries to analyse 1,200 sales records.',
    citedIds: [],
    note: 'True, and unaccounted for. Nothing says where it came from.',
  },
  {
    id: 'one-sided',
    label: 'Half the sources',
    text: 'Built Python and SQL queries to analyse 1,200 sales records.',
    citedIds: ['requirement-2'],
    note: 'It cites the job ad but not the work.',
  },
  {
    id: 'honest',
    label: 'Make it honest',
    text: 'Built Python and SQL queries to analyse 1,200 sales records.',
    citedIds: ['requirement-2', 'evidence-1'],
    note: 'Both sides cited. The claim is still a person’s to check.',
  },
]);

/** Anchors the page exposes, and the hash a preset writes. */
export const PRESET_HASH = Object.freeze(
  Object.fromEntries(PRESETS.map((preset) => [preset.id, `#lab-${preset.id}`])),
);
