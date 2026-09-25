/**
 * Syncareer engineering investigation — the canonical record.
 *
 * Grounded in the public syncareer repository (2026-09-09):
 *   supabase/functions/career-guidance/{contract,prompts,handler,index.test}.ts
 *   docs/AI_APPLICATION_GUIDANCE.md
 *   docs/CONTEXTUAL_ASSISTANT_V2.md
 *
 * ONE EXPLANATION PER FACT (AGENTS.md §5). Each export below declares the
 * single surface that explains a fact in prose, named in its doc comment:
 *
 *   §01 PRODUCT       syncareerProduct    the product, its workflow, its record
 *   §02 FAILURE       failureRecord       the observed failure, its classes, and
 *                                         the documented old contract (the large
 *                                         failure artifact)
 *   §03 INVESTIGATION investigationStages the seven-stage system, stage by stage
 *   §04 INTERVENTION  interventionRecord  what changed, the before/after record
 *                                         (the large anchor), and where it lives
 *   §05 RESULT        evidenceBoundary    what exists / what was never measured
 *
 * Every other view — the Reliability Lab, the work archive, the case-page
 * navigation — renders a label, a citation, a visual or a link back here.
 * It must not re-explain these facts in its own words. Inside the seven-stage
 * system the pointer rule holds: stage 04 points at 02, stage 05 at 02 and 04,
 * stage 06 at 04 — no fact is explained twice.
 *
 * Illustrative model text is labelled at the point of display, as required by
 * AGENTS.md §5. The reason those fixtures exist is stated once, in §05.
 */

export const syncareerProduct = {
  /**
   * §01 PRODUCT — the product record. Product-level facts only: what it is,
   * who it is for, the workflow it encodes, and where it can be inspected.
   * The provider/model and contract detail live in §03, at the stage that
   * actually handles them.
   */
  record: [
    { label: 'Product', value: 'AI-powered career platform — free to use, no paid tier' },
    { label: 'For', value: 'African students and recent graduates' },
    { label: 'Workflow', value: 'Opportunity → Evidence → CV → Interview → Next action → Outcome' },
    { label: 'Status', value: 'Live product' },
  ],
  /** §01 — the one path this case study examines. */
  scope:
    'This case study examines one path inside the product: the CV assistant that rewrites a selected bullet for a selected job requirement. The project exposed practical problems around model output, context, validation and consistency; I worked on the application layer around those failure modes rather than treating the model as the whole system. What I learned is where most of the work sits: not calling the model, but getting its output to behave consistently enough for the product around it.',
  /** §01 — the workflow the two supporting screenshots show. */
  surfaces: [
    {
      id: 'dashboard',
      label: '02 / Dashboard',
      caption:
        'Readiness, applications, CV strength and interview progress, drawn from the same application records.',
      address: 'syncareer.me/dashboard',
    },
    {
      id: 'opportunities',
      label: '03 / Opportunities',
      caption:
        'Saved opportunities feed CV tailoring and interview practice. Match scores are product UI, not a hiring probability.',
      address: 'syncareer.me/opportunities',
    },
  ],
} as const;

/**
 * §02 FAILURE — the canonical failure explanation.
 *
 * `explanation`, `impact` and `classes[]` are rendered once, in §02. The
 * pipeline's stage 04 visualises what this failure does to the payload at the
 * gate; it links back here instead of restating any of it.
 */
export const failureRecord = {
  statement: 'The assistant saw a bullet. It could not see the evidence.',
  explanation:
    'Before the change, the CV assistant sent only the selected bullet. The server could polish the wording; it could not know the job requirement the bullet was meant to answer, and it could not tell a job keyword from candidate evidence. The reply carried text and broad source ids, the interface wrote its own rationale for it, and newly introduced claims were never checked.',
  impact:
    'What reached the user: a fluent, confident bullet that reads like evidence and traces back to nothing.',
  classes: [
    {
      name: 'Bullet-only requests',
      note: 'No requirement, no evidence records, no provenance — the model could not see the job or the candidate’s history.',
    },
    {
      name: 'Job keywords read as candidate skills',
      note: 'A requirement and the evidence for it arrived in the same shape, so employer wording could come back as a claim about the candidate.',
    },
    {
      name: 'Remote output trusted, not checked',
      note: 'Response shape and upload path alike: text plus broad source ids, and a TypeScript cast where a runtime check belonged.',
    },
  ],
  known:
    'Recorded in the project’s own AI-application guidance notes and visible in the previous request shape. This is a reading of the code and notes, not a captured incident report — no live failure log exists.',
  /**
   * THE PROBLEM’s large failure artifact — the old contract, as documented.
   * Rendered once, in 02 FAILURE, as the section’s anchor. The values are
   * the documented old shape (the project’s guidance notes), not a captured
   * log; the classes above are the same record read as a list, and the
   * stage 02 fixture in 03 is what this contract produced (illustrative).
   */
  oldContract: {
    label: 'Old contract · cv.rewrite_bullet',
    source:
      'As documented in the project’s AI-application guidance notes — no captured log exists.',
    request: 'The selected bullet — one string, nothing else.',
    gaps: [
      { field: 'requirement', note: 'not sent' },
      { field: 'evidence records', note: 'not sent' },
      { field: 'provenance', note: 'not sent' },
      { field: 'validation', note: 'none — the reply was cast to a type, not checked' },
    ],
  },
} as const;

export type InvestigationStageId =
  | 'input'
  | 'model-output'
  | 'validation'
  | 'failure'
  | 'diagnosis'
  | 'intervention'
  | 'output';

export type InvestigationArtifact =
  | { kind: 'code'; label: string; code: string; illustrative?: boolean }
  | { kind: 'checks'; label: string; items: { name: string; note?: string }[] }
  | { kind: 'refusal'; label: string; items: { name: string; value: string }[] };

export type InvestigationStage = {
  id: InvestigationStageId;
  step: string;
  label: string;
  title: string;
  /** One-line index readout, shown in the §03 system map. */
  summary: string;
  /** The stage's single explanation. Rendered once, in §03. */
  detail: string;
  /** What this stage passes to the next one. */
  handedOff: string;
  /** Where the stage's behavior can be read in tracked source. */
  evidence: string;
  tone: 'neutral' | 'failure' | 'technical' | 'valid';
  artifact?: InvestigationArtifact;
};

export const investigationStages: InvestigationStage[] = [
  {
    id: 'input',
    step: '01',
    label: 'INPUT',
    title: 'Allowlisted context, nothing else',
    summary: 'One bounded task, explicit context items, hard size limits.',
    detail:
      'A cv.rewrite_bullet request carries version 2, a request id, one instruction and context items with an id, label, provenance and content. The server retrieves nothing on its own: no profile, no history, no CV beyond what the request supplies. A bullet rewrite fails closed before the model is called unless an opportunity item, a requirement-* item and an evidence-* item are all present.',
    handedOff: 'A typed AssistantRequestV2, or a 4xx refusal. An invalid shape never reaches the model.',
    evidence:
      'supabase/functions/career-guidance/contract.ts — parseAssistantRequest, LIMITS, the cv.rewrite_bullet preflight.',
    tone: 'neutral',
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

export const LIMITS = {
  instructionMax: 2_000,
  contextItemMax: 12,
  contextItemContentMax: 8_000,
  contextTotalMax: 24_000,
} as const;

// cv.rewrite_bullet preflight — fails closed before the gateway call
const hasRequirement = context.some(
  (item) => item.id.startsWith("requirement-")
    && item.provenance === "job_description",
);
const hasEvidence = context.some(
  (item) => item.id.startsWith("evidence-")
    && item.provenance === "selected_cv_text",
);
if (!hasRequirement || !hasEvidence || !hasOpportunity) {
  return { ok: false, failure: "cv_context" };
}`,
    },
  },
  {
    id: 'model-output',
    step: '02',
    label: 'MODEL OUTPUT',
    title: 'Ungrounded rewrite (illustrative)',
    summary: 'A plausible bullet the supplied evidence does not support.',
    detail:
      'ILLUSTRATIVE — inferred from the old contract and the recorded failure classes, not a captured output. The old contract sent the bullet alone; the failure it reproduces is set out in 02 FAILURE.',
    handedOff: 'Raw model text. An HTTP 200 from the gateway is not treated as a result.',
    evidence:
      'Failure shape from docs/AI_APPLICATION_GUIDANCE.md.',
    tone: 'failure',
    artifact: {
      kind: 'code',
      label: 'ILLUSTRATIVE — fixture, not a captured output',
      code: `Results-driven engineer with 5 years of Kubernetes experience
who transformed deployments at Acme Corp,
improving speed by 40%.`,
      illustrative: true,
    },
  },
  {
    id: 'validation',
    step: '03',
    label: 'VALIDATION',
    title: 'Parse, then check the citations',
    summary: 'Model output is a proposal, not an answer.',
    detail:
      'Raw text is stripped of code fences and parsed as JSON; the kind must be one the task is allowed to return, and sourceContextIds must be a non-empty subset of the ids the request actually supplied. A bullet rewrite must also cite at least one requirement-* and one evidence-* id before the request can consume quota. Only then do the factual-risk checks run — what they flag is set out in 04 INTERVENTION.',
    handedOff:
      'A Proposal, or one of the named refusals: model_not_json, model_kind, model_unknown_source_id, model_missing_grounding.',
    evidence:
      'parseModelProposal in contract.ts; the grounding check in handler.ts; factual-risk checks in the CV review flow.',
    tone: 'technical',
    artifact: {
      kind: 'checks',
      label: 'parseModelProposal, then grounding',
      items: [
        { name: 'JSON object', note: 'Fence-stripped, then parsed. Malformed output is model_not_json.' },
        { name: 'kind allowlist', note: 'cv.rewrite_bullet may only return a rewrite.' },
        { name: 'sourceContextIds', note: 'A non-empty subset of the ids supplied with the request.' },
        { name: 'Grounding', note: 'Must cite requirement-* and evidence-* before quota is consumed.' },
      ],
    },
  },
  {
    id: 'failure',
    step: '04',
    label: 'FAILURE',
    title: 'The gate refuses it',
    summary: 'No citation, no quota, no apply.',
    detail:
      'The rewrite from 02 arrives with nothing it can cite. The handler refuses it and says why, releases the idempotent reservation, and leaves the quota untouched, so a rejected request never bills. The text can stay on screen with its warning; it cannot be accepted. The failure classes that made this gate necessary are set out once in 02 FAILURE.',
    handedOff:
      'A refusal with a reason code, surfaced to the product. Nothing was applied and nothing was consumed.',
    evidence:
      'handler.ts — release() on every failure after reservation; the review surface blocks accept.',
    tone: 'failure',
    artifact: {
      kind: 'refusal',
      label: 'Refusal record · career-guidance/handler.ts',
      items: [
        { name: 'Response', value: '422 no_safe_proposal' },
        { name: 'Quota', value: 'Reservation released — never consumed' },
        { name: 'Product', value: 'Unsafe text stays visible with a warning; accept blocked until it is edited or regenerated' },
      ],
    },
  },
  {
    id: 'diagnosis',
    step: '05',
    label: 'DIAGNOSIS',
    title: 'Both sides of the contract were too thin',
    summary: 'The repair was to the contract, not to the model.',
    detail:
      'Read against the old shape set out in 02 FAILURE, neither side of the contract gave the server anything to check a claim against — which is why the repair targets the contract rather than the model, the provider or the prompt alone. The opportunity and application drawers already had an authenticated call, a quota seam and explicit accept/reject/undo, so the change could extend that seam instead of adding a provider, an AI framework, a vector store or a generic prompt API. The before/after it implies is set out in 04 INTERVENTION.',
    handedOff: 'A target for the repair: a richer, bounded request and a validated, cited response.',
    evidence:
      'Interpretation of the old and revised contracts in docs/AI_APPLICATION_GUIDANCE.md.',
    tone: 'technical',
  },
  {
    id: 'intervention',
    step: '06',
    label: 'INTERVENTION',
    title: 'The same seam, in a fail-closed order',
    summary: 'Bounded in, validated out, nothing applied automatically.',
    detail:
      'This is where the pipeline changes shape. The four engineering responses are set out in 04 INTERVENTION; what this stage adds is the order they run in, and the rule that every failure after the reservation releases it.',
    handedOff: 'A Proposal the interface can review, or a refusal that cost nothing.',
    evidence:
      'Tracked career-guidance v2 source (handler.ts, prompts.ts). Deployment status: 05 RESULT.',
    tone: 'technical',
    artifact: {
      kind: 'code',
      label: 'Handler order · career-guidance/handler.ts',
      code: `// Ordering is deliberate: validate → authenticate → reserve
// idempotently → entitlement → gateway → validate output → commit
// exactly one unit. Any failure after the reservation releases it,
// so a failed request never bills.

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
    id: 'output',
    step: '07',
    label: 'OUTPUT AFTERWARD',
    title: 'Cited proposal, ready for review (illustrative)',
    summary: 'A rewrite that traces back to the requirement and the evidence.',
    detail:
      'ILLUSTRATIVE. This fixture uses only facts from the supplied context — Python and SQL from the requirement, a class project that analysed 1,200 sales records from the evidence — and cites the ids it used. A person still decides: accept changes the draft field only while its current value still matches the original, and the existing CV save is what persists it.',
    handedOff:
      'A draft the user can accept, edit, reject or undo. The last gate in the pipeline is a person.',
    evidence:
      'Contract shape from career-guidance; the fixture is the fixed-example comparison in docs/AI_APPLICATION_GUIDANCE.md.',
    tone: 'valid',
    artifact: {
      kind: 'code',
      label: 'ILLUSTRATIVE — fixture in the revised shape, not a live sample',
      code: `{
  "kind": "rewrite",
  "text": "Built Python and SQL queries to analyse 1,200 sales records.",
  "sourceContextIds": ["requirement-2", "evidence-1"]
}`,
      illustrative: true,
    },
  },
];

/**
 * §04 INTERVENTION — the canonical record of what changed.
 *
 * Only documented engineering responses appear here. Nothing is inferred,
 * and no technique is claimed that the repository does not contain.
 */
export const interventionRecord = {
  lede: 'A request/response contract: allowlisted context in, validated and cited proposals out, and nothing applied automatically.',
  /**
   * THE INTERVENTION’s large before/after artifact — the canonical contract
   * comparison. Rendered once as the 04 anchor on the case page; the Lab’s
   * diagnosis stage re-exposes it at instrument scale. Stage 05 points here.
   */
  comparison: {
    label: 'The contract, before → after',
    items: [
      { name: 'Request', before: 'One selected bullet', after: 'Allowlisted context items with provenance, size limits, and a required requirement/evidence pair' },
      { name: 'Response', before: 'Text plus broad source ids', after: 'kind, text, and sourceContextIds drawn from the ids actually supplied' },
      { name: 'Trust', before: 'Remote JSON cast to a type', after: 'Runtime validation, a citation subset check, and factual-risk checks' },
    ],
  },
  responses: [
    {
      name: 'Bounded, task-family server prompts',
      note: 'Ten tasks, each with its own server-side prompt built only from the supplied context. Job text, CV text, labels and the user instruction are treated as untrusted data.',
    },
    {
      name: 'Allowlisted context with size limits',
      note: 'Context may enter only as allowlisted items with a fixed provenance list. Limits: 12 items, 8,000 characters each, 24,000 in total, and 2,000 for the instruction.',
    },
    {
      name: 'Citation enforcement',
      note: 'Missing grounding is a refusal, not a warning — the request is checked before the model is called, and the reply is checked against the ids the request supplied.',
    },
    {
      name: 'Factual-risk checks and explicit review',
      note: 'New numbers, unsupported job skills, employers presented as experience, coursework presented as employment, participation presented as leadership or a win, and generic filler are flagged. Accept, edit, reject and undo stay with the user, and nothing is written to the saved CV automatically.',
    },
  ],
  /** Where the change lives — stated once, here. */
  stack:
    'The repair stayed in the existing career-guidance seam: React + Vite on Supabase (Auth, Postgres with row-level security, database functions, edge functions), hosted on Lovable Cloud, with no custom API server. Authorization is enforced server-side; the router’s guards are UX only.',
} as const;

/**
 * §05 RESULT — the canonical evidence boundary.
 *
 * Quantitative results that do not exist are named as missing. `numbers`
 * carries the one quantitative artifact that does exist — a fixture rubric
 * from the project's own notes — with its limits attached, so it cannot be
 * read as a measurement.
 */
export const evidenceBoundary = {
  statement:
    'The repository shows a repaired contract. It does not show that the model got better. No evaluation was run against the live model, no before-and-after outputs were captured, and no failure rate, latency or quality measurement exists. The two model texts in the pipeline are fixtures, labelled where they appear.',
  known: [
    {
      text: 'Request contract, task/provenance allowlists and size limits',
      cite: 'contract.ts',
    },
    {
      text: 'Runtime validation of model JSON, with named failure codes',
      cite: 'parseModelProposal',
    },
    {
      text: 'Requirement/evidence citation enforcement for cv.rewrite_bullet',
      cite: 'handler.ts',
    },
    {
      text: 'Fail-closed ordering, with the reservation released on every failure',
      cite: 'handler.ts',
    },
    {
      text: '18 Deno tests for the contract and handler, on synthetic fixtures',
      cite: 'index.test.ts',
    },
    {
      text: 'A review surface offering request, regenerate, edit, accept, reject and undo',
      cite: 'CV review flow',
    },
  ],
  missing: [
    {
      text: 'No live-model evaluation and no captured before-and-after model output',
    },
    {
      text: 'No measured failure rate, latency, or output-quality score',
    },
    {
      text: 'No authenticated canary — the four workflow families have not been run against the live model',
    },
    {
      text: 'Stricter server prompt and citation enforcement are not live yet: the changed edge function still needs a Lovable Cloud deployment',
    },
    {
      text: 'Interview generation and CV parsing run in deployed-only functions, whose prompts and quotas are not auditable from the repository',
    },
  ],
  numbers: {
    label: 'On numbers',
    body: 'The project’s own notes score five fixed examples against a six-part rubric: 8/30 for the old contract, 29/30 for the revised one. Those are rubric marks on fixtures that compare two contract versions — not live-model quality scores, and the notes state that. No performance, hiring or outcome metric exists.',
  },
} as const;


