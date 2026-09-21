/**
 * SessionBook case-study copy, grounded in the public sessionbook
 * repository (commit 48ba544) and the AssemblyAI HTTP-tools tutorial
 * (conceptual reference only). Anything referenced from the tutorial is
 * treated as shape/idea, never as an implemented feature. Anything
 * illustrative is labelled illustrative in the interface.
 */

export const sessionbookMeta = {
  repoUrl: 'https://github.com/stevemensah333-rgb/sessionbook',
  repoCommit: '48ba544',
  repoCommitDate: '2026-09-20',
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
    evidence: 'Claim derived from app/services/booking_service.py; no live calls exist to measure the goal against.',
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
    evidence: 'Reference architecture from the HTTP-tools tutorial; the agent document is voice_agent/agent.json, still empty.',
  },
  {
    question: 'What was learned?',
    answer:
      'The interesting part of a voice booking is not the model \u2014 it is the boundary. Dates need a provider\u2019s clock, availability needs a row lock, confirmation needs to be safe to read aloud, and a failure needs to say what to do next. None of that is the model\u2019s job, and all of it breaks without it.',
    evidence: 'Written service surface; UNKNOWN beyond what the repository verifies.',
  },
];

/** Q&A band — one row per question the page must answer. */
export const sessionbookQuestions: {
  q: string;
  a: string;
}[] = [
  {
    q: 'What problem was being explored?',
    a: 'Whether a small backend can own an entire appointment flow served over voice \u2014 availability, booking, confirmation \u2014 keeping every decision model-free: timing, locking, and what gets said.',
  },
  {
    q: 'Why voice?',
    a: 'Because voice raises the stakes on correctness. A wrong date, a double-booking, or a poorly formatted time is immediately audible to the caller. It is the hardest surface for sloppy output to hide on.',
  },
  {
    q: 'How does the agent interact with the backend?',
    a: 'Through plain HTTP on AssemblyAI\u2019s side. Each tool the agent holds points at a backend endpoint; when the agent needs a fact it makes the request itself, and the backend answers with values the agent can speak.',
  },
  {
    q: 'What does the backend own?',
    a: 'The calendar and its correctness. FastAPI plus a service layer: which slots are free, how a slot gets reserved without double-booking someone, how dates and times stay true to the provider\u2019s timezone, and what a confirmation should sound like.',
  },
  {
    q: 'What does AssemblyAI own?',
    a: 'The conversation. Transcribing the caller, running the agent, choosing and executing tools, and speaking replies. SessionBook supplies the agent document and the endpoints; it never holds a call or a socket.',
  },
  {
    q: 'What happens when a booking request cannot be fulfilled?',
    a: 'Two written failure paths: SlotAlreadyBookedError when the slot is gone on arrival, and ValueError when the slot does not exist. Neither is yet caught and spoken \u2014 the spoken-failure sentence is the next piece of the boundary.',
  },
  {
    q: 'What data crosses the system boundary?',
    a: 'What the agent can say: a slot\u2019s id plus its ready-to-speak label on the way out, and a caller\u2019s slot choice, name, and a 7\u201315 digit phone number on the way in. A booking returns a confirmation code and a full sentence.',
  },
  {
    q: 'What failure cases were considered?',
    a: 'A concurrent double-booking, a slot that vanished between being listed and being chosen, a confirmation code that is ambiguous when read aloud or typed back \u2014 and the work still ahead: date interpretation when times are busy or closed, and phone numbers that arrive without enough digits.',
  },
  {
    q: 'What did Stephen learn?',
    a: 'The model is the conversation; the backend is the contract. Separating what the agent is allowed to do from what the backend decides is correct keeps a spoken system small, inspectable, and safe \u2014 and every gap that remains is visible in the words coming out of it.',
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
    'GET /health is served',
    'The token path \u2014 agent document, tool routes, tests \u2014 exists as empty or ready scaffolding',
  ] as const,
  missing: [
    'No AssemblyAI integration: voice_agent/agent.json is empty',
    'No HTTP tool routes: app/routers/tools.py is empty, only /health is wired',
    'No spoken failure response — raised errors are not yet caught or worded',
    'No migrations generated',
    'No test coverage (tests/test_booking.py is empty)',
    'No deployment, no live calls, no latency or success data',
    'Model imports as written do not resolve without a path fix (from database import Base)',
    'Availability query does not filter by provider yet',
  ] as const,
};
