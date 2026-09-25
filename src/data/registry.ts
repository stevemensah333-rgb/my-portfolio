/**
 * Concrete project entries. Each entry is shaped by Project in projects.ts.
 * No project literal should appear anywhere else in the codebase.
 *
 * Stage-level investigation data lives in the project's own investigation
 * module (syncareerInvestigation.ts) — the registry carries identity,
 * status, evidence and route only, so there is exactly one copy of any
 * narrative (AGENTS.md §5).
 *
 * Evidence policy: Syncareer copy is grounded in the public syncareer repo
 * (README, AGENTS.md, career-guidance edge function, AI_APPLICATION_GUIDANCE).
 * SessionBook copy is grounded in the public sessionbook repository at
 * commit 1264d9e (2026-09-22). Anything illustrative is labelled
 * illustrative in the interface.
 */

import type { Project } from './projects';

export const syncareer: Project = {
  id: 'syncareer',
  name: 'Syncareer',
  short: 'An AI-powered career platform I built for students: saved opportunity → tailored CV → interview prep → outcome.',
  status: 'live',
  // Product-level claim. The engineering narrative lives in
  // syncareerInvestigation.ts and is rendered by /work/syncareer/ (§5).
  claim:
    'An AI-powered career platform I built for students: free to use, aimed at African students and recent graduates. Everything an application needs — from the saved opportunity to the recorded outcome — is held in one record.',
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
  stack: ['TypeScript', 'React + Vite', 'Supabase Postgres + RLS', 'Edge Functions (Deno)', 'Lovable AI gateway'],
  route: '/work/syncareer/',
  // The full engineering investigation (7 stages) lives in
  // syncareerInvestigation.ts and renders on /work/syncareer/ and /lab/.
};

export const sessionbook: Project = {
  id: 'sessionbook',
  name: 'SessionBook',
  short: 'A FastAPI booking backend I built for a voice agent, where the backend owns correctness.',
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

export const koranco: Project = {
  id: 'koranco',
  name: 'Koranco Farms',
  short:
    'A farm management system I built through the Ashesi Innovation Lab — attendance, produce and employee modules.',
  status: 'mvp',
  claim:
    'Selected for a 6-week Ashesi Innovation Lab project with Koranco Farms. Built a farm management system addressing how production data is captured, organized and used — with attendance checking, farm produce management, and employee management modules.',
  evidence: [],
  claimLimit:
    'The farm management system was built and delivered as a working MVP through the Innovation Lab. No public repository, production deployment, or farm-side usage figures exist. This engagement is described from the Innovation Lab brief and my résumé.',
  stack: ['FastAPI', 'PostgreSQL'],
  route: '/work/koranco/',
};

export const projects: Project[] = [syncareer, sessionbook, koranco];
