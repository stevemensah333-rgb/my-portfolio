/**
 * SessionBook case-study copy, grounded in the public sessionbook
 * repository (commit 1264d9e, 2026-09-22) and the AssemblyAI HTTP-tools
 * tutorial (conceptual reference only). Anything referenced from the
 * tutorial is treated as shape/idea, never as an implemented feature.
 * Anything illustrative is labelled illustrative in the interface.
 *
 * The primer (4 anchors, with evidence) and the questions register are
 * complementary: a question appears in exactly ONE of the two lists, so
 * no answer is stated twice on the page.
 */

export const sessionbookMeta = {
  repoUrl: 'https://github.com/stevemensah333-rgb/sessionbook',
  repoCommit: '1264d9e',
  repoCommitDate: '2026-09-22',
  tutorialUrl: 'https://lablab.ai/ai-tutorials/assemblyai-voice-agent-http-tools',
} as const;

/** Four short answers that anchor the case above the fold. */
export const sessionbookPrimer: {
  question: string;
  answer: string;
  evidence: string;
}[] = [
  {
    question: 'What problem was being explored?',
    answer:
      'Can a caller book an appointment entirely by voice, with every step that matters — timing, locking, confirmation — decided by a small backend rather than by the model improvising on air?',
    evidence: 'Claim derived from app/services/booking_service.py; no live calls exist yet, but the backend and voice-agent integration are verified in the repository.',
  },
  {
    question: 'Why voice?',
    answer:
      'Because the failure modes are real and specific: dates get guessed wrong, two callers can grab one slot, and a message read aloud has nowhere to hide formatting errors. Voice makes bad decisions audible.',
    evidence: 'Reference ideas from the HTTP-tools tutorial; SessionBook\u2019s verification is the written engine, not a working call.',
  },
  {
    question: 'What does AssemblyAI own?',
    answer:
      'Everything about the conversation: transcription, prompting, tool invocation, and speech. SessionBook\u2019s job is the agent document and the backend the agent calls — nothing has to stream or persist a WebSocket.',
    evidence: 'voice_agent/agent.json — implemented: agent configuration with four tool definitions, verified in the repository.',
  },
  {
    question: 'What was learned?',
    answer:
      'The interesting part of a voice booking is not the model \u2014 it is the boundary. Dates need a provider\u2019s clock, availability needs a row lock, confirmation needs to be safe to read aloud, and a failure needs to say what to do next. None of that is the model\u2019s job, and all of it breaks without it.',
    evidence: 'Written service surface; UNKNOWN beyond what the repository verifies.',
  },
];

/**
 * Q&A band — only the questions the primer does NOT already answer.
 * (Problem explored, why voice, AssemblyAI's role, and what was learned
 * live in the primer above, each with its evidence statement.)
 */
export const sessionbookQuestions: {
  q: string;
  a: string;
}[] = [
  {
    q: 'How does the agent interact with the backend?',
    a: 'Through plain HTTP on AssemblyAI\u2019s side. Each tool the agent holds points at a backend endpoint; when the agent needs a fact it makes the request itself, and the backend answers with values the agent can speak.',
  },
  {
    q: 'What does the backend own?',
    a: 'The calendar and its correctness. FastAPI plus a service layer: which slots are free, how a slot gets reserved without double-booking someone, how dates and times stay true to the provider\u2019s timezone, and what a confirmation should sound like.',
  },
  {
    q: 'What happens when a booking request cannot be fulfilled?',
    a: 'Two caught, speakable failure paths: the tool route returns 409 with \u201cThat slot was just taken, would you like another time?\u201d when the slot is gone on arrival, and 404 when the slot does not exist. The agent can turn either into the next question instead of an apology.',
  },
  {
    q: 'What data crosses the system boundary?',
    a: 'What the agent can say: a slot\u2019s id plus its ready-to-speak label on the way out, and a caller\u2019s slot choice, name, and a 7\u201315 digit phone number on the way in. A booking returns a confirmation code and a full sentence.',
  },
  {
    q: 'What failure cases were considered?',
    a: 'A concurrent double-booking, a slot that vanished between being listed and being chosen, a confirmation code that is ambiguous when read aloud or typed back \u2014 and the work still ahead: date interpretation when times are busy or closed, and phone numbers that arrive without enough digits.',
  },
];

/** Evidence boundary — verified vs UNKNOWN, in the house style. */
export const sessionbookBoundary = {
  known: [
    'FastAPI app, service layer, models and Pydantic contracts are written',
    'SELECT \u2026 FOR UPDATE plus an IntegrityError fallback guards double-booking',
    'Datetimes are timezone-aware, anchored to Africa/Accra (ZoneInfo)',
    'Confirmation codes drop ambiguous 0/O and 1/I glyphs',
    'Availability and confirmation responses carry ready-to-speak strings',
    'Four HTTP tool routes serve the agent: get_today, check_availability, book_slot, confirm_booking',
    'Booking failures return speakable sentences (409 slot taken, 404 no such slot)',
    'AssemblyAI voice-agent integration implemented \u2014 agent configuration and tool routes verified in the repository',
  ] as const,
  missing: [
    'No live deployment, no live calls, no latency or success data',
    'tests/test_booking.py is empty \u2014 no tests are written',
    'No migrations generated (Alembic configured, no versions)',
    'Edge cases still open: date interpretation when times are busy or closed, and phone numbers without enough digits',
  ] as const,
} as const;
