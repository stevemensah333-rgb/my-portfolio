/**
 * Concrete project entries. Each entry is shaped by Project in projects.ts.
 * No project literal should appear anywhere else in the codebase.
 *
 * Evidence policy: Syncareer copy is grounded in the public syncareer repo
 * (README, AGENTS.md, career-guidance edge function, AI_APPLICATION_GUIDANCE).
 * SessionBook copy is grounded in the public sessionbook repo at commit
 * 48ba544. Anything illustrative is labelled illustrative in the interface.
 */

import type { Project } from './projects';

export const syncareer: Project = {
  id: 'syncareer',
  name: 'Syncareer',
  short: 'Opportunity-first career workspace: saved opportunity → tailored CV → interview prep → outcome.',
  status: 'live',
  claim:
    'A free career workspace for students and graduates. Its AI help is evidence-grounded — bounded tasks, cited requirements and evidence, validated output — because a career claim has to trace back to something real.',
  evidence: [
    {
      kind: 'product',
      label: 'Live product',
      href: 'https://syncareer.me/',
    },
    {
      kind: 'code',
      label: 'Source repository',
      href: 'https://github.com/stevemensah333-rgb/syncareer',
    },
    {
      kind: 'document',
      label: 'Seed funding secured',
      href: 'https://syncareer.me/',
    },
    {
      kind: 'artifact-image',
      label: 'SynAI context surface',
      href: '/images/syncareer/synai-context-2400.png',
      alt: 'Syncareer SynAI interface showing personalised career guidance based on profile, quick actions and a message input.',
    },
    {
      kind: 'artifact-image',
      label: 'Product dashboard',
      href: '/images/syncareer/dashboard-2400.png',
      alt: 'Syncareer dashboard showing career readiness, application, CV strength and interview progress.',
    },
    {
      kind: 'artifact-image',
      label: 'Opportunities workflow',
      href: '/images/syncareer/opportunities-2400.png',
      alt: 'Syncareer opportunities interface showing job search, match score, and interview / CV tailoring actions.',
    },
  ],
  claimLimit:
    'No before-and-after model outputs, repeatable evaluation, or measured failure rate is supplied. Some AI behaviour runs in deployed-only functions whose exact prompts cannot be audited from the repository.',
  stack: ['TypeScript', 'React + Vite', 'Supabase Postgres + RLS', 'Edge Functions (Deno)', 'Lovable AI gateway'],
  route: '/work/syncareer/',
  stages: [
    {
      id: 'input',
      step: '01',
      label: 'INPUT',
      title: 'Allowlisted context, nothing else',
      summary: 'One bounded task, explicit context items, hard size limits.',
      detail:
        'Each request carries one bounded task (for example, cv.rewrite_bullet) plus explicit context items with id, provenance and label. The server fetches nothing on its own — no profile, no history, no CV beyond what is supplied — and rejects requests that exceed the item and size limits.',
      evidence: 'contract.ts + prompts.ts in the career-guidance edge function.',
      kind: 'input',
    },
    {
      id: 'model-output',
      step: '02',
      label: 'MODEL OUTPUT',
      title: 'Ungrounded rewrite (illustrative bad output)',
      summary: 'A plausible bullet the evidence does not support.',
      detail:
        'ILLUSTRATIVE EXAMPLE — not a historical Syncareer log. Previous model outputs were never captured, so the “before” shape is inferred from the old request contract, which sent only the selected bullet: the server could not see the job requirement and could not tell job keywords from candidate evidence.',
      evidence: 'Failure class from the repo evidence-grounding notes; old outputs not captured.',
      kind: 'raw',
      code: `Results-driven engineer with 5 years of Kubernetes experience
who transformed deployments at Acme Corp,
improving speed by 40%.`,
      tone: 'failure',
    },
    {
      id: 'validation',
      step: '03',
      label: 'VALIDATION',
      title: 'Citations + factual-risk checks',
      summary: 'Requirement and evidence IDs required; risky claims flagged.',
      detail:
        'Valid output must cite at least one requirement-* and one evidence-* context the model actually used. The application layer then checks for new numbers, job skills copied without candidate evidence, employers presented as experience, and coursework upgraded to employment. Unsafe proposals stay visible with a warning but cannot be accepted until fixed.',
      evidence: 'Citation enforcement in career-guidance; factual-risk checks in the CV review flow.',
      kind: 'validate',
    },
    {
      id: 'failure',
      step: '04',
      label: 'FAILURE',
      title: 'How ungrounded help failed',
      summary: 'Too little context in, too little checking out.',
      detail:
        'Three distinct gaps, not one “AI problem”: requests carried too little context for the server to judge, job wording and candidate evidence were never distinguished, and remote JSON was trusted without runtime validation.',
      evidence: 'Root causes recorded in the repo evidence-grounding notes.',
      kind: 'fail',
      tone: 'failure',
      modes: [
        { name: 'Bullet-only requests', note: 'Server could not see the requirement.' },
        { name: 'Job skills as candidate skills', note: 'No evidence distinction.' },
        { name: 'Unvalidated JSON trusted', note: 'A type cast, not a check.' },
      ],
    },
    {
      id: 'diagnosis',
      step: '05',
      label: 'DIAGNOSIS',
      title: 'The contract was too thin',
      summary: 'Both the request and the response needed more structure.',
      detail:
        'The old contract sent only the selected bullet and accepted text plus broad source IDs, while the UI supplied a fixed rationale. The fix had to cover both sides: richer, bounded requests and validated, cited responses.',
      evidence: 'Interpretation of the old vs revised contracts; old outputs not captured.',
      kind: 'diagnosis',
    },
    {
      id: 'intervention',
      step: '06',
      label: 'INTERVENTION',
      title: 'Ground every proposal in cited evidence',
      summary: 'Bounded prompts, allowlisted context, citation + risk checks.',
      detail:
        'Revised contract: bounded task-family server prompts that treat all supplied text as untrusted data, allowlisted context items with size limits, mandatory requirement/evidence citations before quota is consumed, and application-layer factual-risk checks with explicit accept, reject and undo. Nothing is applied automatically.',
      evidence: 'Tracked career-guidance v2 source; revised server prompt awaits deployment through Lovable Cloud.',
      kind: 'intervene',
      tone: 'technical',
      fixes: [
        'Bounded task-family server prompts',
        'Allowlisted context with size limits',
        'Requirement/evidence citation enforcement',
        'Factual-risk checks + explicit review',
      ],
      code: `// revised response contract (real shape)
{
  "kind": "rewrite",
  "text": "the proposal",
  "sourceContextIds": ["requirement-1", "evidence-3"]
}`,
    },
    {
      id: 'output',
      step: '07',
      label: 'VALID OUTPUT',
      title: 'Cited proposal, ready for review (illustrative)',
      summary: 'A rewrite that traces back to requirement + evidence.',
      detail:
        'ILLUSTRATIVE valid output in the revised contract shape. The wording stays inside the supplied evidence and cites the contexts used. Accept changes only the local draft; the existing save persists it. No reliability rate is claimed.',
      evidence: 'Contract shape from career-guidance; fixture-style example, not a live sample.',
      kind: 'valid',
      code: `{
  "kind": "rewrite",
  "text": "Built Python and SQL queries to analyse 1,200 sales records.",
  "sourceContextIds": ["requirement-2", "evidence-1"]
}`,
      tone: 'valid',
    },
  ],
  narrativeStates: [
    {
      id: 'observed-failure',
      label: 'Observed failure',
      title: 'The assistant saw too little and proved too little.',
      summary: 'Bullet-only requests, undistinguished job wording, and unvalidated responses made ungrounded help possible.',
      tone: 'failure',
      primaryStageId: 'failure',
    },
    {
      id: 'engineering-response',
      label: 'Engineering response',
      title: 'Both sides of the contract were rebuilt.',
      summary: 'Bounded prompts, allowlisted context, mandatory citations and factual-risk checks — with the user reviewing every proposal.',
      tone: 'technical',
      primaryStageId: 'intervention',
    },
    {
      id: 'product-contract',
      label: 'Product contract',
      title: 'A proposal is a draft, never a verdict.',
      summary: 'Cited output the user can accept, edit or reject. No reliability metric is claimed.',
      tone: 'valid',
      primaryStageId: 'output',
    },
  ],
};

export const sessionbook: Project = {
  id: 'sessionbook',
  name: 'SessionBook',
  short: 'A backend service that manages appointment / session bookings.',
  status: 'mvp',
  claim:
    'A booking service with double-booking protection, timezone correctness, spoken-output design, and voice-agent integration. The backend owns the contract — availability, atomic booking, and confirmation — so the voice agent never decides correctness on its own.',
  evidence: [
    {
      kind: 'code',
      label: 'Source repository',
      href: 'https://github.com/stevemensah333-rgb/sessionbook',
    },
    {
      kind: 'illustrative',
      label: 'AssemblyAI voice-agent integration',
      note: 'Voice-agent JSON configuration and HTTP tool routes are implemented. Integration verified in the repository.',
    },
  ],
  claimLimit:
    'No live deployment, no measured latency or success rate. UNKNOWN for everything that depends on real production traffic. Test coverage is minimal (tests/ is scaffolded but sparse).',
  stack: ['FastAPI', 'SQLAlchemy 2.0 (async)', 'asyncpg', 'Postgres 16', 'Pydantic', 'Alembic'],
  route: '/work/sessionbook/',
  stages: [
    {
      id: 'input',
      step: '01',
      label: 'REQUEST',
      title: 'Caller asks for availability',
      summary: 'Contracts defined and routes wired.',
      detail:
        'A caller asks for availability for a date. Pydantic contracts are defined for this boundary — AvailabilityRequest(date), BookingRequest with a phone regex — and HTTP tool routes are wired to serve the voice agent.',
      evidence: 'schemas.py defines the contracts; tool routes verified in the repository.',
      kind: 'input',
    },
    {
      id: 'model-output',
      step: '02',
      label: 'READ',
      title: 'Slots queried by date',
      summary: 'Timezone-aware, unbooked only.',
      detail:
        'check_availability queries slots for the requested date that are still unbooked. Datetimes are timezone-aware and rendered for speech in Africa/Accra via ZoneInfo. Note: the query filters by date and booked state; it does not filter by provider.',
      evidence: 'booking_service.check_availability; PROVIDER_TZ = Africa/Accra.',
      kind: 'raw',
      code: `result = await db.execute(
    select(Slot).where(
        Slot.start_time >= day_start,
        Slot.start_time < day_end,
        Slot.is_booked == False,
    )
)`,
      codeLabel: 'IMPLEMENTATION EXCERPT',
      tone: 'technical',
    },
    {
      id: 'validation',
      step: '03',
      label: 'CHECK',
      title: 'Slot exists and is free',
      summary: 'Lock first, then check inside the transaction.',
      detail:
        'Inside a transaction, book_slot locks the slot row with SELECT … FOR UPDATE, then confirms the slot exists and is still free. The existence check happens after the lock is held, so two concurrent callers cannot both pass the gate.',
      evidence: 'book_slot: with_for_update(), then None / is_booked checks.',
      kind: 'validate',
    },
    {
      id: 'failure',
      step: '04',
      label: 'CONFLICT',
      title: 'Race: two callers, one slot',
      summary: 'Concurrent book request for the same slot.',
      detail:
        'Two callers can attempt to book the same slot at almost the same time. Without protection, both reads see `is_booked = false` and both writes succeed — the system double-books.',
      evidence: 'A failure mode the implementation is designed to prevent.',
      kind: 'fail',
      tone: 'failure',
      modes: [
        { name: 'Lost update', note: 'Concurrent reads, two writes succeed.' },
        { name: 'Phantom booking', note: 'A slot that was already taken.' },
        { name: 'No spoken acknowledgement', note: 'Caller has no read-back.' },
      ],
    },
    {
      id: 'diagnosis',
      step: '05',
      label: 'DIAGNOSIS',
      title: 'Concurrency is the boundary, not the model',
      summary: 'Read-then-write is unsafe under load.',
      detail:
        'The diagnosis is straightforward: the booking row must be claimed atomically. Any read-then-write path without a row lock will double-book under concurrent calls.',
      evidence: 'Standard SQL transaction pattern; not novel, not optional.',
      kind: 'diagnosis',
    },
    {
      id: 'intervention',
      step: '06',
      label: 'INTERVENTION',
      title: 'SELECT … FOR UPDATE + spoken confirmation',
      summary: 'Lock the slot, return a code the caller can read back.',
      detail:
        'book_slot runs `SELECT … FOR UPDATE` inside a transaction, raises `SlotAlreadyBookedError` on `IntegrityError`, and generates a confirmation code that excludes ambiguous glyphs (0/O, 1/I). Spoken output is rendered via `_to_spoken_label`, and a `get_today()` helper returns the provider-local date.',
      evidence: 'Verified in booking_service.book_slot, _generate_confirmation_code, _to_spoken_label, get_today.',
      kind: 'intervene',
      tone: 'technical',
      fixes: [
        'SELECT … FOR UPDATE row lock',
        'IntegrityError → SlotAlreadyBookedError',
        'Ambiguous-glyph-free confirmation code',
        'Timezone-aware spoken label',
      ],
    },
    {
      id: 'output',
      step: '07',
      label: 'CONFIRM',
      title: 'Booking confirmed, code returned',
      summary: 'Caller can read the code back.',
      detail:
        'Booking returns a confirmation with `confirmation_code` (6–10 chars, no 0/O/1/I) and a `spoken_confirmation` sentence the agent can say. The caller can read it back, and the system can look it up.',
      evidence: 'BookingConfirmation schema; _generate_confirmation_code implementation.',
      kind: 'valid',
      code: `{
  "confirmation_code": "A3F9K2",
  "spoken_confirmation": "You're booked for Saturday, September 5 at 9:00 AM. Your confirmation code is A3F9K2."
}`,
      tone: 'valid',
    },
  ],
};

export const projects: Project[] = [syncareer, sessionbook];

export const getProject = (id: string): Project | undefined =>
  projects.find(p => p.id === id);
