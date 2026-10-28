# WORKPLAN.md — identity, voice and density

**Branch:** `arena/d0fe9f58-my-portfolio` (from `a5de844`)
**Scope:** the changes agreed after comparing the live build with the four reference sites and Wilbert's.
**Non-negotiable:** no invented facts, no production deploy, merges only on request.

---

## 0. What is being fixed

Three separate problems, and they need three different kinds of work:

| Problem | Symptom | Where it is fixed |
| --- | --- | --- |
| **No conceit** — the site is a well-set document with instrument labels, not an object with an identity | Every page opens eyebrow → serif heading → lede → rule. One repeating gesture in the whole site (artifact → case study) | Phase 1, 6 |
| **Too much copy, and the Lab is the worst of it** | `/lab/` = 1,533 visible words over 6.8 screens; 11 hedge sentences; 330 words before the first refusal. Homepage 886 words, and its selected-work block repeats `/work/` | Phase 2, 3, 4 |
| **A machine voice in places** | "the workspace rail serves", "captures and labelled representations", "each row opens the decisions", "carries its decision record" | Phase 5 |

Measured baseline (headless Chromium, 1440×900, `innerText` of `main`, `<pre>` excluded):

| Route | Words now | Target | Labels now | Target | Screens now |
| --- | --- | --- | --- | --- | --- |
| `/` | 886 | **≤ 560** | 18 | **≤ 10** | 6.3 |
| `/work/` | 303 | ≤ 290 | 8 | ≤ 6 | 3.0 |
| `/work/syncareer/` | 1,205 | **≤ 850** | 25 | **≤ 14** | — |
| `/work/sessionbook/` | 1,033 | **≤ 780** | 18 | ≤ 12 | — |
| `/work/koranco/` | 637 | 600 | 12 | ≤ 10 | — |
| `/lab/` | 1,533 | **≤ 700** (≤ 450 before the inspector) | 34 | **≤ 12** | 6.8 |
| `/profile/` | 669 | ≤ 620 | 11 | ≤ 8 | 4.4 |

Targets are ceilings, not quotas. If a page reads better at 620 than at 560, 620 wins.

---

## 1. Copy voice contract

Every string rewritten in this plan follows these rules. They are the "sound like a person" checklist, and Phase 5 is graded against them.

1. **One idea per sentence.** Average ≤ 18 words in body copy.
2. **Start with the thing, not the framing.** "A career platform for African students." — not "An AI-powered career platform, built so that…".
3. **First person for my own work.** "I rebuilt the request contract." Never "the author" or passive avoidance of "I".
4. **No tour-guide voice.** Delete anything that explains the page instead of the work: "Each row opens…", "All five steps are below…", "Running walks through them again…".
5. **Plain nouns.** "what I built", "you can open it", "a made-up example". Not "the record", "the evidence", "the representation", "labelled".
6. **One hedge per project, placed at the end, as a plain sentence.** "No live calls yet." — not "Live deployment and live calls unverified; no retained latency or success measurements".
7. **No em-dash chains.** One per paragraph maximum; otherwise full stops.
8. **No filler adjectives.** Robust, seamless, innovative, passionate, cutting-edge: banned. Concrete nouns and real numbers instead.
9. **Read it out loud.** If a sentence can't be said in one breath, it's two sentences.
10. **Honesty stays, vagueness goes.** Every status claim survives the rewrite in plainer words. Nothing is softened into ambiguity to sound friendlier.

### Worked examples (before → after)

| Where | Now | After |
| --- | --- | --- |
| Selected work lead | "Three projects at three different stages — the part I did, the state each one is really in, and the evidence you can open." | "Three projects, three different stages. What I built, what's running now, and what you can open and check." |
| Syncareer body | "An AI-powered career platform for African students, built so a saved opportunity, the tailored CV and the interview preparation all sit inside one application record." | "A career platform for African students. A saved job, the CV written for it, and the interview prep all live in one application record." |
| Syncareer second para | "When the CV assistant produced fluent bullets it could not support, I rebuilt the request and response contract around explicit context and citations." | "The CV assistant kept writing bullets it couldn't back up. So I rebuilt the request and response contract around explicit context and citations." |
| Lab preview lead | "A polished sentence can invent experience nobody supplied. Here is an illustrative rewrite, and a check that refuses it because the claim it makes has no footing in the context it was given." | "A polished sentence can invent experience nobody gave it. Here's a rewrite, and the check that throws it out because nothing it claims is in the source material." |
| Lab note | "Illustrative fixture and deterministic checks in the browser — no model call, no captured incident." | "Made-up example. The checks run in your browser. No model is called." |
| Bench rail note | "Captures and labelled representations" | "Real captures, and honest stand-ins where none exist" |
| Selected-work closer | "Every case study carries its decision record, its sources, and what has not been verified." | *(deleted — it explains the site)* |
| Person closer | "These pages are built so the work can be checked rather than taken on trust." | "Have a look. Ask me anything." |
| `/profile/` documents row | "the document the workspace rail serves, supplied as-is" | "One page, as supplied." |
| `/profile/` capabilities intro | "Open a row for the decisions and the limits; the release state is the same one the archive shows." | *(deleted — the rows are obviously rows)* |

---

## 2. Facts that must survive every rewrite

Copy will be cut hard in Phases 2–4. These survive verbatim in meaning, somewhere on the site:

- Syncareer: **live product**, and the grounding revision is **in source, not redeployed**; the live model's grounding has **not** been measured.
- SessionBook: **implemented MVP**, **no live calls verified**, no deployment; the test file is empty and that is disclosed.
- Koranco: **MVP delivered**, **no production deployment verified**, no public repository or screenshots; six weeks inside the Jul–Sep 2026 Innovation Lab role; the farm's site is described, its address not in the record.
- Dates, titles, GPA 3.56/4.0, SAT 1520 (730/790), Dean's List Jan 2026, Commonwealth Gold 2025, Sharks Quiz 2024.
- Lab: fixtures are authored, no model is called, no network request is made.
- The two counts on `/profile/` — "35+" and "30+" — are unverified against the résumé. Either the owner confirms them or they become "students" / "patrons" without a number.

---

## 3. Phases

Each phase is one PR. Merge only when asked.

### Phase 0 — Baseline and guardrails (0.5 day)

- Add `scripts/content-audit.mjs`: reads `dist/**/*.html`, strips `<script>/<style>/<pre>`, prints words, labels, hedge count and screens per route. Wire as `npm run audit:copy`. Makes every target in §0 repeatable instead of hand-measured.
- Capture baseline screenshots of all 8 routes at 1440 / 390 / 320 into `/tmp/base/` (not committed).
- Record the current copy inventory (every string that will be deleted) in the PR description, so nothing factual disappears silently.

**Done when:** `npm run audit:copy` reproduces the §0 table ±2%, and baseline shots exist.

---

### Phase 1 — The bench becomes an object (1.5 days)

Files: `src/components/home/WorkbenchHero.astro`, `src/components/ProjectArtifact.astro`, `src/styles/global.css`

1. **Compose the stack instead of tiling it.** Replace the current 1.12fr/0.88fr grid with an overlapping composition: Syncareer large, SessionBook overlapping its lower-left edge by ~40–56px, Koranco offset right and behind at −1.8°, each with a real contact shadow (`0 18px 40px -18px rgba(23,26,27,.32)` plus a 1px rule). Keep DOM order = reading order; overlap must not change the tab order or push any card off-canvas at 390/320 (stack vertically below 46rem).
2. **Fill the dead quadrant.** The left column is 583px inside a 993px hero — ~350px of empty paper under the CTAs. Add a compact factual index under the actions: each project name, a status dot, and the release state, linking to its case study ("In the drawer"). No new claims; a second route into the work.
3. **One lift gesture.** A single shared treatment for anything that opens: `translateY(-4px)` + deepened shadow + 2.2° settle on hover/focus-visible, identical on hero artifacts, archive rows and next-project links. Reuse one class + one set of tokens from `motion.css`; no per-component copies.
4. **Tilt decision.** Keep the 2.2° pointer tilt (fine pointer, no reduced motion) but move its constant and geometry into shared tokens so there is one implementation. If it cannot be made visible at 2.2°, it gets deleted in Phase 6 rather than nudged.

**Done when:** hero has no empty quadrant at 1440, zero overflow at 1440/768/390/320, keyboard order unchanged, artifacts usable before animation completes, and the lift gesture measures the same on all three surfaces.

---

### Phase 2 — Lab: stop presenting, start testing (3 days)

**Why this replaces the earlier "shorten the stages" plan.** Measured on the current build, `/lab/` has 10 interactive controls and not one of them changes an outcome: "Run" replays a fixed sequence (the page says so itself), two radios pick between branches the author wrote, and Accept/Edit/Reject operate on a draft that is deliberately never saved. The interaction is theatre, and the page's best idea — a deterministic gate — is buried under ~40 lines of 9.6px mono per screen. No visitor will interact with that.

**The rebuild: the visitor tries to beat the gate.** The gate is real code that already exists; letting people attack it is the only honest interaction this site has that nobody else's does.

Files: `src/components/ScenarioLab.astro` (structure + copy), `src/scripts/labScenario.mjs` (expose the same checker the page uses), `src/pages/lab.astro`

1. **One interaction, above the fold.** Reuse the existing deterministic checker; add a text field. As the visitor types (debounced ~120 ms), the verdict card returns **PASSED** or **REFUSED** plus one plain-language reason (""Kofi's Kitchens" isn't in the material I gave you"). No Run button. Three presets fill the field: **Invent a company**, **Cite nothing**, **Make it honest**. This is the page's only new logic; it calls `checkProposal()` exactly as the stage view did, so `npm test` keeps asserting the same function.
2. **Cut the five-stage narrative to one bench.** Left: the supplied material as four readable chips (opportunity, requirement, evidence, bullet) — no request table, no version numbers, no `requestId`. Centre: the editable proposal. Right: the verdict. Everything the stages explained moves to the rule list or the inspector.
3. **Rule list, one line each, expandable.** Five rules with their reason codes, closed by default. This replaces the 400-word refusal stage.
4. **The real story, ~150 words.** What actually went wrong in Syncareer and what changed in the source revision. Before/after stays as one compact pair, not two branch panels.
5. **One limits block, including the honest one:** the checker validates structure and citations, not truth — a well-cited sentence can still be wrong, which is why a person reviews it. This replaces the current 11 hedges with 2 sentences and makes the argument better than 622 words did.
6. **Code inspector** stays as a collapsed `<details>` at the bottom.
7. **Keep:** deep links (presets set `#lab-invented` / `#lab-nothing-cited` / `#lab-honest`, so a shared URL opens on that verdict), keyboard operation (the field is a real input; presets are buttons; the verdict is `aria-live`), reduced-motion parity, and the labelled static verdict with JS off. **Retire:** the `1`–`5` stage shortcuts, the pipeline strip, the Run/Replay button, the A/B radio toggle, and the accept/edit/reject sandbox.

**Targets:** ≤ 450 words before the inspector, ≤ 700 total (from 1,533); labels 34 → ≤ 12 (from 34); interactive controls 5 (input, 3 presets, reset) instead of 10.

**Done when:** a first-time visitor can get a refusal within one screen without scrolling; typing changes the verdict; `npm test` passes unchanged; every remaining anchor lands at `top = 96`; keyboard-only and no-JS paths both reach a stated verdict; and nothing on the page claims the checker tests truth.

---

### Phase 3 — Homepage trim (1 day)

Files: `src/components/home/SelectedWork.astro`, `LabPreview.astro`, `PersonSection.astro`

1. **Selected work:** drop the four-row facts table and the "Known result" line from the homepage. Keep number + kind·status kicker, name, one-line statement, one body paragraph, link. The archive keeps the table.
2. **Delete the section closer** ("Every case study carries…").
3. **Person:** keep three roles; move the résumé footnote to About; replace the closer with the human line from §1.
4. **Lab preview:** shorten lead and note per §1; keep the working refusal demo.

**Done when:** homepage ≤ 560 words, all three projects still named with status, nothing factual lost that isn't already on its case study, fold still shows identity + actions + the first artifact.

---

### Phase 4 — Case studies: one hedge, one home (1.5 days)

Files: `src/components/case/CaseStudy.astro`, `src/pages/work/{syncareer,sessionbook,koranco}.astro`, `src/data/caseStudies.ts`

1. Add one **"Not verified"** block per case study, rendered from data, placed in `#limits`. Every scattered hedge in the opening, the captions and `#result` moves there or is deleted.
2. **Syncareer:** decisions 307 → ≤ 220 words; result and limits stop repeating each other; the fixture-comparison labels stay.
3. **SessionBook:** visual 313 → ≤ 220 (the booking exchange carries it); one flow preserved.
4. **Koranco:** untouched apart from the hedge block.

**Done when:** syncareer ≤ 850, sessionbook ≤ 780; each status claim appears exactly once per page; `REVIEW.md` §4 content checks still hold; anchors and deep links unchanged.

---

### Phase 5 — Voice pass (1.5 days)

Files: all page copy, `src/data/*.ts`, plus comment sweep

1. Apply §1 to every remaining string on all 8 routes.
2. `src/pages/profile.astro:175` — replace "the document the workspace rail serves"; sweep `rail` out of user-facing copy and stale comments (`SiteFooter.astro`, `SectionFrame.astro`, `project.astro:521`, `motion.css`).
3. **Break the heading formula on one page.** Proposal: `/work/` says the plain thing ("Three projects, one bench.") instead of a fourth "X. Y." pair. Keep the voice; stop the template.
4. Verify no string describes the interface instead of the work (grep list in Phase 7).

**Done when:** read-aloud pass on every page, hedge counter per route ≤ 2, no meta-voice sentences, no invented claims, and `git diff` reviewable per file.

---

### Phase 6 — Craft details (1 day)

Files: `src/styles/global.css`, component-local label rules, `README`-level notes

1. **Label floor 10.5px.** The shared `.mono-label` is `.75rem` (12px); the problem is 23 local overrides at `.6rem`/`.62rem` (9.6–9.9px) and the SessionBook ticket at **8.8px**. Introduce `--size-label: 0.6875rem` (11px) and point every override at it; raise the ticket clamp floor to 10.5px and re-check the ticket's two-line fit at 320.
2. **Cut labels to the §0 targets** — remove the ones naming what is already visible.
3. **Tilt:** keep or delete, decided by eye at 1440 (no third round of tuning).
4. **Confirm or remove the 35+/30+ figures** (§2).

**Done when:** nothing below 10.5px except the drawn ticket object; label counts at target; no overflow introduced.

---

### Phase 7 — Verification and delivery (1 day)

- `npx astro check`, `npx astro build`, `npm test`, `npm run audit:copy`.
- Overflow sweep 1440/1280/768/390/320 on 8 routes; 200% text zoom on 5 routes × 3 widths.
- Reduced motion: 0 animations, no hidden text; keyboard walk incl. dialog trap and Lab `R`/`1`–`5`; no-JS content check.
- CLS/long-tasks re-measure (local, throttled) and transfer sizes; report as lab numbers.
- Update `REVIEW.md` with a new §: what the identity pass changed, new word counts, and any register items that shifted.
- Deliver: local preview, changed files, checks, limitations. **No deploy.**

---

## 4. Order and size

| Phase | Product | Effort | PR |
| --- | --- | --- | --- |
| 0 | repeatable copy audit | 0.5 | yes |
| 1 | hero composition + lift gesture | 1.5 | yes |
| 2 | Lab rebuild: test-the-gate bench | 3.0 | yes |
| 3 | homepage trim | 1.0 | yes |
| 4 | case-study consolidation | 1.5 | yes |
| 5 | voice pass | 1.5 | yes |
| 6 | labels + tilt + numbers | 1.0 | yes |
| 7 | verification | 1.0 | yes |

Roughly 10 half-day units. Phases 0–2 are the ones that change how the site reads; 3–6 are clean-up that can ship in any order after them.

**If only one phase gets done, do Phase 2.** The Lab is the page most likely to be skipped by visitors and the one with a real idea buried in it — a deterministic gate they can attack. It is also the page that most needs to be shorter.

---

## 5. Risks and how they are held

| Risk | Mitigation |
| --- | --- |
| Trimming removes the honesty that makes the site different | §2 facts list; one hedge per project; Phase 7 diff review against the list |
| Hero recomposition breaks the View Transition or tab order | DOM order stays = reading order; transition names untouched; keyboard walk in Phase 7 |
| Lab rebuild loses keyboard/deep-link behaviour | The input is a native field and presets are buttons, so keyboard support is simpler than the current stage shortcuts; presets set hashes; `npm test` (gate codes) plus anchor/keyboard probes at the end of Phase 2 |
| A visitor passes a nonsense sentence and concludes the checker is fake | Stated on the page: it validates structure and citations, not truth — and that is why a person reviews the result |
| Copy drifts into marketing tone | §1 rules 6 and 10; no new adjectives; every claim traced to `src/data` |
| Scope creep into a fifth redesign | The conceit work is Phase 1 only. Phases 3–6 touch copy and tokens, not structure. |

**Explicitly out of scope:** new routes, new dependencies, any 3D/WebGL, fake terminals or logs, invented personal content (R30), testimonials (R32), search (R31), production deploy.
