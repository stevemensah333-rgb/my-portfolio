/**
 * Concrete project entries. Each entry is shaped by Project in projects.ts.
 * No project literal should appear anywhere else in the codebase.
 */

import type { Project } from './projects';

export const syncareer: Project = {
  id: 'syncareer',
  name: 'Syncareer',
  short: 'AI-integrated career platform with a real LLM reliability case study.',
  status: 'live',
  claim:
    'An AI-integrated career platform. Production use exposed real LLM failure modes; the engineering response is the case study.',
  evidence: [
    {
      kind: 'product',
      label: 'Live product',
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
    'No before-and-after outputs, repeatable evaluation, or measured failure rate is supplied. The case study states this boundary inside the interaction.',
  stack: ['Prompt engineering', 'Claude API', 'Postgres', 'JavaScript', 'PostgreSQL schema design'],
  route: '/work/syncareer/',
  stages: [
    {
      id: 'input',
      step: '01',
      label: 'INPUT',
      title: 'User activity + profile context',
      summary: 'Degree, interests, activity, progress, weaknesses.',
      detail:
        'Syncareer supplies Claude with explicit context from the student profile so guidance can be tailored. Context includes degree, interests, skills, CV progress and interview activity.',
      evidence: 'Product record — context visible in SynAI surface.',
      kind: 'input',
    },
    {
      id: 'model-output',
      step: '02',
      label: 'MODEL OUTPUT',
      title: 'Raw LLM response (illustrative bad output)',
      summary: 'Mixed prose + inconsistent structure before constraints.',
      detail:
        'ILLUSTRATIVE EXAMPLE — not a historical Syncareer log. Shows the kind of format drift observed in production: malformed fields, prose bleed, missing required keys.',
      evidence: 'Confirmed observation: inconsistent formatting.',
      kind: 'raw',
      code: `To become senior, you should...
- build projects

{
  title: Senior Dev
  level:
  years: "five?"`,
      tone: 'failure',
    },
    {
      id: 'validation',
      step: '03',
      label: 'VALIDATION',
      title: 'Schema check',
      summary: 'Does output match product contract?',
      detail:
        'Gate that checks required fields and type expectations before the product uses the response. If validation fails, the path routes to failure diagnosis.',
      evidence: 'Check: title (string), level (enum), years (number), next_steps (array).',
      kind: 'validate',
    },
    {
      id: 'failure',
      step: '04',
      label: 'FAILURE',
      title: 'Observed failure modes',
      summary: 'Formatting, context, structure.',
      detail:
        'Separate failures treated as distinct: inconsistent formatting, dropped context (activity / progress / weaknesses not retained), unpredictable response structure.',
      evidence: 'Confirmed observations from production use.',
      kind: 'fail',
      tone: 'failure',
      modes: [
        { name: 'Formatting', note: 'Missing schema' },
        { name: 'Context', note: 'Context dropped' },
        { name: 'Response variance', note: 'Inconsistent output' },
      ],
    },
    {
      id: 'diagnosis',
      step: '05',
      label: 'DIAGNOSIS',
      title: 'Why it failed',
      summary: 'Prompt lacked explicit constraints; context not explicitly managed.',
      detail:
        'Root cause not reduced to one "AI problem". Each mode mapped to a specific missing constraint. Interpretation: prompt structure, context handling and expected output needed tighter control.',
      evidence: 'No invented root cause beyond observed behaviours.',
      kind: 'diagnosis',
    },
    {
      id: 'intervention',
      step: '06',
      label: 'INTERVENTION',
      title: 'Constrain what was breaking',
      summary: 'Prompt restructure + few-shot + explicit context + tighter constraints.',
      detail:
        'Implemented: restructured prompts, added few-shot examples to anchor expected structure, managed context explicitly, set clearer constraints around expected output. ILLUSTRATIVE pattern shown for constraint — not claiming exact historical prompt text.',
      evidence: 'No measured before-and-after reliability rate is available.',
      kind: 'intervene',
      tone: 'technical',
      fixes: [
        'Prompt restructuring',
        'Few-shot anchor',
        'Explicit context management',
        'Tighter output constraints',
      ],
      code: `// illustrative constraint pattern
{
  "type": "object",
  "required": ["title", "level", "years"],
  "properties": {
    "title": { "type": "string" },
    "level": { "enum": ["junior", "mid", "senior"] },
    "years": { "type": "number" }
  }
}`,
    },
    {
      id: 'output',
      step: '07',
      label: 'VALID OUTPUT',
      title: 'Valid product output (illustrative)',
      summary: 'Now conforms to product contract.',
      detail:
        'ILLUSTRATIVE valid output showing shape after intervention. Not claimed as historical Syncareer log. Measured reliability threshold not yet supplied — evidence boundary preserved.',
      evidence: 'Outcome shape matches product needs; no fabricated metrics.',
      kind: 'valid',
      code: `{
  "title": "Senior Developer",
  "level": "senior",
  "years": 5,
  "next_steps": [
    "ship one AI feature",
    "add validation",
    "test beyond happy path"
  ]
}`,
      tone: 'valid',
    },
  ],
  narrativeStates: [
    {
      id: 'observed-failure',
      label: 'Observed failure',
      title: 'Production exposed three failure modes.',
      summary: 'Inconsistent formatting, dropped context and response variance broke the expected product contract.',
      tone: 'failure',
      primaryStageId: 'failure',
    },
    {
      id: 'engineering-response',
      label: 'Engineering response',
      title: 'Each failure mapped to a tighter response path.',
      summary: 'The prompt, examples, context and output constraints were made more explicit.',
      tone: 'technical',
      primaryStageId: 'intervention',
    },
    {
      id: 'product-contract',
      label: 'Product contract',
      title: 'Valid output is a contract, not a reliability metric.',
      summary: 'The output shape can match product needs while the evidence boundary remains explicit.',
      tone: 'valid',
      primaryStageId: 'output',
    },
  ],
};

export const sessionbook: Project = {
  id: 'sessionbook',
  name: 'SessionBook',
  short: 'A backend service that manages appointment / session bookings.',
  status: 'in-progress',
  claim:
    'A booking service with double-booking protection, timezone correctness, and spoken-output design. The voice-agent integration is in progress.',
  evidence: [
    {
      kind: 'code',
      label: 'Source repository',
      href: 'https://github.com/stevemensah333-rgb/sessionbook',
    },
    {
      kind: 'illustrative',
      label: 'AssemblyAI voice-agent integration',
      note: 'Voice-agent JSON configuration and HTTP tool routes are not yet implemented. Repository is honest about this.',
    },
  ],
  claimLimit:
    'No deployment, no live calls, no measured latency or success rate. UNKNOWN for everything that depends on real production traffic.',
  stack: ['FastAPI', 'SQLAlchemy 2.0 (async)', 'asyncpg', 'Postgres 16', 'Pydantic', 'Alembic'],
  route: '/work/sessionbook/',
  stages: [
    {
      id: 'input',
      step: '01',
      label: 'REQUEST',
      title: 'Caller asks for availability',
      summary: 'Date or window, validated at the boundary.',
      detail:
        'A caller asks for availability for a date. The request is validated against a Pydantic schema before it reaches the service layer — caller_name and caller_phone types are enforced.',
      evidence: 'Pydantic contract: AvailabilityRequest(date), BookingRequest with phone regex.',
      kind: 'input',
    },
    {
      id: 'model-output',
      step: '02',
      label: 'READ',
      title: 'Slots queried by date',
      summary: 'Timezone-aware, unbooked only.',
      detail:
        'The service queries slots for the requested date, filtered by provider and `is_booked`. Datetimes are stored timezone-aware in `Africa/Accra` and rendered with `ZoneInfo`.',
      evidence: 'Verified in booking_service.check_availability and Provider.timezone.',
      kind: 'raw',
      code: `SELECT start_time, end_time
FROM slots
WHERE provider_id = :pid
  AND is_booked = false
  AND date_trunc('day', start_time AT TIME ZONE 'Africa/Accra')
      = :day;`,
      tone: 'technical',
    },
    {
      id: 'validation',
      step: '03',
      label: 'CHECK',
      title: 'Slot exists and is free',
      summary: 'Existence and overlap gate.',
      detail:
        'Before a booking is created, the service confirms the slot exists, is not booked, and the time window is valid. The check happens before the row lock to keep the happy path cheap.',
      evidence: 'Verified in booking_service.book_slot precondition.',
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
        'book_slot runs `SELECT … FOR UPDATE` inside a transaction, raises `SlotAlreadyBookedError` on `IntegrityError`, and generates a confirmation code that excludes ambiguous glyphs (0/O, 1/I). Spoken output is rendered via `_to_spoken_label`.',
      evidence: 'Verified in booking_service.book_slot, _generate_confirmation_code, _to_spoken_label.',
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
  "spoken_confirmation": "You're booked for Saturday, September 5 at 9:00 AM. Your confirmation code is A F 3 F 9 K 2.",
  "slot_id": 412,
  "created_at": "2026-09-21T08:14:22Z"
}`,
      tone: 'valid',
    },
  ],
};

export const projects: Project[] = [syncareer, sessionbook];

export const getProject = (id: string): Project | undefined =>
  projects.find(p => p.id === id);
