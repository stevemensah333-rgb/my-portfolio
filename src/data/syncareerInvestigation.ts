/**
 * Syncareer engineering investigation.
 *
 * Grounded in the public syncareer repo:
 *   supabase/functions/career-guidance/{contract,prompts,handler}.ts
 *   docs/AI_APPLICATION_GUIDANCE.md
 *
 * Illustrative model text is labelled. Previous live outputs were never captured.
 */

export const syncareerProduct = {
  liveUrl: 'https://syncareer.me/',
  repoUrl: 'https://github.com/stevemensah333-rgb/syncareer',
  problem:
    'The CV assistant used to send only the selected bullet. The server could polish wording. It could not see the job requirement, and it could not tell job keywords from candidate evidence.',
  built:
    'A request/response contract that allowlists context, validates model JSON, requires requirement and evidence citations, and refuses to apply anything automatically.',
} as const;

/** ReliabilityTrace 5-step causal path (raw → validate → fail → intervene → valid). */
export const reliabilityTraceCopy = {
  raw: `Results-driven engineer with 5 years of Kubernetes experience
who transformed deployments at Acme Corp,
improving speed by 40%.`,
  valid: `{
  "kind": "rewrite",
  "text": "Built Python and SQL queries to analyse 1,200 sales records.",
  "sourceContextIds": ["requirement-2", "evidence-1"]
}`,
  gates: [
    { id: 'json_shape', label: 'json_shape', rule: 'object · kind, text, ids' },
    { id: 'kind_rewrite', label: 'kind', rule: 'must be "rewrite"' },
    { id: 'citations', label: 'sourceContextIds', rule: 'non-empty subset' },
    { id: 'grounding', label: 'grounding', rule: 'requirement-* + evidence-*' },
  ],
  failures: [
    'Invented employer, tenure and a 40% metric',
    'Copied Kubernetes from the job, not the CV',
    'No requirement-* or evidence-* citations',
  ],
  interventions: [
    'Allowlisted context items with hard size limits',
    'parseModelProposal before any quota is consumed',
    'Factual-risk checks; accept / reject / undo — never auto-apply',
  ],
} as const;

export type InvestigationStageId =
  | 'input'
  | 'model-output'
  | 'validation'
  | 'failure'
  | 'diagnosis'
  | 'intervention'
  | 'output';

export type InspectorField = {
  key: 'input' | 'output' | 'schema' | 'failure' | 'intervention';
  label: string;
  body: string;
};

export type InvestigationStage = {
  id: InvestigationStageId;
  step: string;
  label: string;
  title: string;
  summary: string;
  detail: string;
  receivedFrom: string;
  handedOff: string;
  evidence: string;
  tone: 'neutral' | 'failure' | 'technical' | 'valid';
  inspector: InspectorField[];
  artifact?: {
    kind: 'code' | 'checks' | 'modes' | 'fixes';
    label: string;
    code?: string;
    items?: { name: string; note?: string }[];
  };
};

export const investigationStages: InvestigationStage[] = [
  {
    id: 'input',
    step: '01',
    label: 'INPUT',
    title: 'Allowlisted context, nothing else',
    summary: 'One bounded task, explicit context items, hard size limits.',
    detail:
      'A cv.rewrite_bullet request must carry version 2, a UUID, one instruction, and context items with id, provenance and label. The server fetches nothing on its own — no profile, no history, no CV beyond what is supplied. Cover-letter and bullet-rewrite tasks fail closed if the required provenances are missing.',
    receivedFrom: 'The product: one selected opportunity, one requirement, and user-selected CV evidence.',
    handedOff: 'A typed AssistantRequestV2. Invalid shape never reaches the model.',
    evidence: 'supabase/functions/career-guidance/contract.ts — parseAssistantRequest, LIMITS, cv.rewrite_bullet preflight.',
    tone: 'neutral',
    inspector: [
      {
        key: 'input',
        label: 'Input',
        body: 'task cv.rewrite_bullet · instruction ≤ 2,000 chars · ≤ 12 context items · ≤ 24,000 chars total.',
      },
      {
        key: 'schema',
        label: 'Schema',
        body: 'ContextItem { id, label, provenance, content }. Provenance is an allowlist. Bullet rewrite requires requirement-* (job_description), evidence-* (selected_cv_text), and an opportunity item.',
      },
      {
        key: 'output',
        label: 'What leaves this stage',
        body: 'A validated request, or a 4xx failure (shape, provenance, cv_context) with quota not consumed.',
      },
    ],
    artifact: {
      kind: 'code',
      label: 'Request contract · career-guidance/contract.ts',
      code: `export interface AssistantRequestV2 {
  version: 2;
  requestId: string;
  task: AssistantTask;      // e.g. "cv.rewrite_bullet"
  instruction: string;
  context: ContextItem[];   // id, label, provenance, content
}

// cv.rewrite_bullet preflight (fails closed)
const hasRequirement = context.some(
  (item) => item.id.startsWith("requirement-")
    && item.provenance === "job_description",
);
const hasEvidence = context.some(
  (item) => item.id.startsWith("evidence-")
    && item.provenance === "selected_cv_text",
);`,
    },
  },
  {
    id: 'model-output',
    step: '02',
    label: 'MODEL OUTPUT',
    title: 'Ungrounded rewrite (illustrative)',
    summary: 'A plausible bullet the evidence does not support.',
    detail:
      'ILLUSTRATIVE — not a historical Syncareer log. Previous model outputs were never captured. The “before” shape is inferred from the old request contract, which sent only the selected bullet: the server could not see the job requirement and could not tell job keywords from candidate evidence.',
    receivedFrom: 'Under the old contract: the selected bullet only. Under v2: the allowlisted request from 01.',
    handedOff: 'Raw model text. An HTTP 200 is never trusted.',
    evidence: 'Failure class from docs/AI_APPLICATION_GUIDANCE.md; old outputs not captured.',
    tone: 'failure',
    inspector: [
      {
        key: 'input',
        label: 'What the old path sent',
        body: 'The selected CV bullet, and nothing else. No requirement id. No evidence records. No opportunity facts.',
      },
      {
        key: 'output',
        label: 'Illustrative model text',
        body: 'A fluent rewrite that invents Kubernetes, Acme Corp, five years, and a 40% improvement.',
      },
      {
        key: 'failure',
        label: 'Why this is unsafe',
        body: 'It reads like a CV bullet. None of the claims are in the supplied evidence.',
      },
    ],
    artifact: {
      kind: 'code',
      label: 'ILLUSTRATIVE bad output — not a historical log',
      code: `Results-driven engineer with 5 years of Kubernetes experience
who transformed deployments at Acme Corp,
improving speed by 40%.`,
    },
  },
  {
    id: 'validation',
    step: '03',
    label: 'VALIDATION',
    title: 'Citations + factual-risk checks',
    summary: 'Requirement and evidence IDs required; risky claims flagged.',
    detail:
      'Valid output must be JSON with an allowed kind, non-empty text, and sourceContextIds that are a subset of the ids actually supplied. For cv.rewrite_bullet, at least one requirement-* and one evidence-* citation are required before quota is consumed. The application layer then checks for new numbers, job skills copied without evidence, employers presented as experience, and coursework upgraded to employment.',
    receivedFrom: 'Raw model text from 02. Upstream HTTP 200 is irrelevant.',
    handedOff: 'A Proposal, or no_safe_proposal (422) with the reservation released.',
    evidence: 'parseModelProposal in contract.ts; grounding check in handler.ts; factual-risk checks in the CV review flow.',
    tone: 'technical',
    inspector: [
      {
        key: 'input',
        label: 'Input',
        body: 'result.text from the gateway, plus the allowlisted context ids from the request.',
      },
      {
        key: 'schema',
        label: 'Schema',
        body: '{ kind, text, sourceContextIds }. kind must be in ALLOWED_KINDS[task]. Unknown ids fail. Empty ids fail.',
      },
      {
        key: 'output',
        label: 'Gate result',
        body: 'ok: Proposal. fail: model_not_json | model_kind | model_no_source_ids | model_unknown_source_id | model_missing_grounding.',
      },
    ],
    artifact: {
      kind: 'checks',
      label: 'parseModelProposal · then grounding',
      items: [
        { name: 'JSON object', note: 'Fence-stripped. Malformed → model_not_json.' },
        { name: 'kind allowlist', note: 'cv.rewrite_bullet may only return "rewrite".' },
        { name: 'sourceContextIds', note: 'Non-empty subset of supplied ids.' },
        { name: 'Grounding', note: 'Must cite requirement-* and evidence-* or quota is not consumed.' },
      ],
    },
  },
  {
    id: 'failure',
    step: '04',
    label: 'FAILURE',
    title: 'How ungrounded help failed',
    summary: 'Too little context in, too little checking out.',
    detail:
      'Three distinct gaps, not one “AI problem”: requests carried too little context for the server to judge, job wording and candidate evidence were never distinguished, and remote JSON was trusted without runtime validation. Quota is not consumed on a failed proposal.',
    receivedFrom: 'The ungrounded rewrite from 02, run through the checks in 03.',
    handedOff: 'A rejected proposal the user can still see, with a warning. Accept is blocked.',
    evidence: 'Root causes recorded in docs/AI_APPLICATION_GUIDANCE.md. handler.ts releases the reservation on no_safe_proposal.',
    tone: 'failure',
    inspector: [
      {
        key: 'failure',
        label: 'Failure reason',
        body: 'model_missing_grounding / invented claims. The product must not apply this bullet.',
      },
      {
        key: 'input',
        label: 'What was checked',
        body: 'Raw text against the Proposal schema, then against requirement/evidence citations, then against factual-risk heuristics.',
      },
      {
        key: 'output',
        label: 'Product behaviour',
        body: 'HTTP 422 no_safe_proposal. Reservation released. Quota not consumed. Unsafe text may stay visible with a warning.',
      },
    ],
    artifact: {
      kind: 'modes',
      label: 'Observed failure classes',
      items: [
        { name: 'Bullet-only requests', note: 'Server could not see the requirement.' },
        { name: 'Job skills as candidate skills', note: 'No evidence distinction.' },
        { name: 'Unvalidated JSON trusted', note: 'A type cast, not a check.' },
      ],
    },
  },
  {
    id: 'diagnosis',
    step: '05',
    label: 'DIAGNOSIS',
    title: 'The contract was too thin',
    summary: 'Both the request and the response needed more structure.',
    detail:
      'The old contract sent only the selected bullet and accepted text plus broad source IDs, while the UI supplied a fixed rationale. The CV-upload hook trusted a TypeScript cast instead of validating remote JSON. The opportunity and application drawers already had an authenticated call, a quota seam, and explicit accept/reject/undo — the repair extends that seam rather than adding a new provider.',
    receivedFrom: 'The failure modes in 04, read against the old request/response shapes.',
    handedOff: 'A diagnosis: richer, bounded requests and validated, cited responses.',
    evidence: 'Interpretation of the old vs revised contracts in AI_APPLICATION_GUIDANCE.md. Old outputs not captured.',
    tone: 'technical',
    inspector: [
      {
        key: 'input',
        label: 'Old request',
        body: 'Selected bullet only. No requirement. No evidence records. No provenance.',
      },
      {
        key: 'output',
        label: 'Old response',
        body: 'Text plus broad source IDs. UI invented a rationale. Newly introduced claims were not checked.',
      },
      {
        key: 'intervention',
        label: 'What had to change',
        body: 'Both sides of the contract — not the model, not a new framework, not a vector store.',
      },
    ],
    artifact: {
      kind: 'code',
      label: 'Handler order · career-guidance/handler.ts',
      code: `// validate → authenticate → reserve idempotently →
// entitlement → gateway → validate output → commit exactly one unit.
// Any failure after reservation releases it, so a failed request never bills.

const validated = parseModelProposal(
  result.text,
  request.task,
  request.context.map((item) => item.id),
);
if (!validated.ok) {
  await deps.release(user.userId, request.requestId);
  return failure(requestId, 422, "no_safe_proposal", quota, cors);
}`,
    },
  },
  {
    id: 'intervention',
    step: '06',
    label: 'INTERVENTION',
    title: 'Ground every proposal in cited evidence',
    summary: 'Bounded prompts, allowlisted context, citation + risk checks.',
    detail:
      'Revised contract: task-family server prompts that treat all supplied text as untrusted data; allowlisted context items with size limits; mandatory requirement/evidence citations before quota is consumed; application-layer factual-risk checks with explicit accept, reject and undo. Nothing is applied automatically. The revised server source still needs a Lovable Cloud deploy before citation enforcement is live.',
    receivedFrom: 'The diagnosis in 05: both sides of the contract were too thin.',
    handedOff: 'A Proposal the UI can review, or a refused request that did not bill.',
    evidence: 'Tracked career-guidance v2 source. Revised server prompt awaits deployment through Lovable Cloud.',
    tone: 'technical',
    inspector: [
      {
        key: 'intervention',
        label: 'What changed',
        body: 'Allowlisted context, bounded prompts, citation enforcement, factual-risk checks, explicit review. Same seam — not a new AI stack.',
      },
      {
        key: 'schema',
        label: 'Response contract',
        body: '{ kind: "rewrite", text, sourceContextIds: ["requirement-…", "evidence-…"] }',
      },
      {
        key: 'output',
        label: 'Still true',
        body: 'Accept changes only the local draft. The existing CV save persists it. No reliability rate is claimed.',
      },
    ],
    artifact: {
      kind: 'fixes',
      label: 'Engineering response',
      items: [
        { name: 'Bounded task-family server prompts' },
        { name: 'Allowlisted context with size limits' },
        { name: 'Requirement/evidence citation enforcement' },
        { name: 'Factual-risk checks + explicit review' },
      ],
    },
  },
  {
    id: 'output',
    step: '07',
    label: 'OUTPUT AFTERWARD',
    title: 'Cited proposal, ready for review (illustrative)',
    summary: 'A rewrite that traces back to requirement + evidence.',
    detail:
      'ILLUSTRATIVE valid output in the revised contract shape. The wording stays inside the supplied evidence (Python, SQL, 1,200 records) and cites the contexts used. Accept changes only the local draft; the existing save persists it. No reliability rate is claimed.',
    receivedFrom: 'The same kind of request as 01, after the intervention in 06.',
    handedOff: 'A draft the user can accept, edit, or reject. Not a verdict.',
    evidence: 'Contract shape from career-guidance; fixture-style example from AI_APPLICATION_GUIDANCE.md, not a live sample.',
    tone: 'valid',
    inspector: [
      {
        key: 'input',
        label: 'Supplied evidence (fixture)',
        body: 'Requirement: Python and SQL. Evidence: a class project that analysed 1,200 sales records. Original bullet: “Built scripts for a class project”.',
      },
      {
        key: 'output',
        label: 'Cited proposal',
        body: '“Built Python and SQL queries to analyse 1,200 sales records.” sourceContextIds: requirement-2, evidence-1.',
      },
      {
        key: 'schema',
        label: 'What the product accepts',
        body: 'kind rewrite, non-empty text, citations that exist on the request. User review is still required.',
      },
    ],
    artifact: {
      kind: 'code',
      label: 'ILLUSTRATIVE valid output — fixture, not a live sample',
      code: `{
  "kind": "rewrite",
  "text": "Built Python and SQL queries to analyse 1,200 sales records.",
  "sourceContextIds": ["requirement-2", "evidence-1"]
}`,
    },
  },
];

export const investigationDecisions = [
  {
    label: 'Same seam',
    body: 'Repair the existing career-guidance call. Do not add a second provider, an AI framework, or a vector store.',
  },
  {
    label: 'Fail closed',
    body: 'Invalid requests and ungrounded model output never consume quota. Reservations are released.',
  },
  {
    label: 'User is the last gate',
    body: 'Accept, edit, reject, undo. Nothing writes to the saved CV automatically.',
  },
] as const;

export const evidenceBoundary = {
  known: [
    'Observed failure classes identified',
    'Revised request/response contract implemented in tracked source',
    'Runtime validation of model JSON (parseModelProposal)',
    'Citation enforcement for cv.rewrite_bullet in handler.ts',
  ],
  missing: [
    'No before-and-after model outputs supplied',
    'No repeatable live-model evaluation supplied',
    'No measured failure rate supplied',
    'Revised career-guidance source awaits Lovable Cloud deploy',
    'Some AI functions are deployed-only (prompts unauditable)',
  ],
} as const;
