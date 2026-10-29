# WORKPLAN.md — identity, voice and density

**Branch:** `arena/d0fe9f58-my-portfolio`
**Covers:** all four tiers from the review — identity, editorial volume, craft details, and the deferred items — in 12 phases, ~13 days, one PR each.
**Non-negotiable:** no invented facts, no production deploy, merges only on request.

---

## 0. What's wrong, and where each piece gets fixed

| Problem | Symptom on the live build | Tier | Phase |
| --- | --- | --- | --- |
| **No conceit** | Every page opens eyebrow → serif heading → lede → rule. One repeated gesture on the whole site. A document with instrument labels, not an object with an identity. | 1 | 1–5 |
| **Too much copy** | `/lab/` 1,533 words / 6.8 screens, and none of its 10 controls changes an outcome. Homepage 886 words, and its selected-work block re-tells `/work/`. | 2 | 4, 6, 7 |
| **A machine voice** | "the workspace rail serves", "captures and labelled representations", "each row opens the decisions", "every case study carries its decision record". | 3 | every phase, then 8 |
| **Small print and stale bits** | 8.8–9.9px labels (34 on the Lab), a heading formula used four times, two unverified figures. | 3 | 9, 10 |
| **Deferred items** | Scroll-spy, Firefox shared-element fallback, dialog image state, R30–R32. | 4 | 10 |

Baseline, measured (headless Chromium 1440×900, `innerText` of `main`, `<pre>` excluded):

| Route | Words | Target | Labels | Target | Screens |
| --- | --- | --- | --- | --- | --- |
| `/` | 886 | **≤ 560** | 18 | **≤ 10** | 6.3 |
| `/work/` | 303 | ≤ 290 | 8 | ≤ 6 | 3.0 |
| `/work/syncareer/` | 1,205 | **≤ 850** | 25 | **≤ 14** | — |
| `/work/sessionbook/` | 1,033 | **≤ 780** | 18 | ≤ 12 | — |
| `/work/koranco/` | 637 | 600 | 12 | ≤ 10 | — |
| `/lab/` | 1,533 | **≤ 700** (≤ 450 before the inspector) | 34 | **≤ 12** | 6.8 |
| `/profile/` | 669 | ≤ 620 | 11 | ≤ 8 | 4.4 |

Targets are ceilings. If a section reads better at 620 than 560, 620 wins.

---

## 1. How the copy has to read

This governs every phase. Code review of copy is against this section, not against taste.

### The voice

Somebody explaining their work to another engineer over coffee. Specific, unhurried, occasionally dry. Confident about what was built, plain about what wasn't. The reader is "you"; the work is "I".

### Rules

1. **Contractions.** "I'm", "it's", "don't", "that's". Formal avoidance reads as a press release.
2. **Second person for the reader.** "You can open it." Not "the artifact may be inspected".
3. **One idea per sentence.** Cap at 20 words in body copy; if it needs more, it's two sentences.
4. **Short sentence after a long one.** Deliberate rhythm. A three-word sentence is allowed and often best.
5. **Semicolons are banned in body copy.** They're the tell of the current voice. Full stop instead.
6. **One em dash per paragraph, maximum.** If you want a second, you wanted a full stop.
7. **Paragraphs of one to three sentences.** No four-sentence blocks anywhere.
8. **Say the concrete thing.** "a booking backend for a voice agent" — not "backend services with a voice integration".
9. **Numbers or nothing.** No "several", "various", "a range of".
10. **First person for my own work.** "I rebuilt the contract." Not "the contract was rebuilt".
11. **Delete anything that describes the page.** "Each row opens…", "Below are…", "Running walks through them again…" — gone.
12. **One hedge per project, at the end, in plain words.** "No live calls yet." Not "Live deployment and live calls unverified". Honesty stays; vagueness goes.

### Banned words and moves (new copy)

**Words:** leverage, robust, seamless, seamless experience, elevate, curate, delve, landscape, realm, testament, embark, unlock, empower, supercharge, cutting-edge, innovative, passionate, journey, showcase, craft, solutions, "at the intersection of", "end-to-end", "best-in-class", "deep dive".

**Moves:**
- "not just X, but Y" and "it isn't about X, it's about Y".
- Rule-of-three lists where two items would do ("fast, reliable, and scalable").
- Openers that set the scene instead of saying the thing ("In an age where…", "As an engineer who…").
- Nouns that hide a verb: "the implementation of", "the provision of". Say "I built".
- Machine nouns for page furniture: "the record", "the artifact", "the surface", "the rail", "the instrument", "labelled representation". Say "the screenshot", "the example", "the page".
- Explaining what a good portfolio does ("built so the work can be checked rather than taken on trust").

**Kept on purpose:** one existing line that earns its place — *"Fluent isn't the same as true."* It's the only "X isn't Y" on the site; the ban applies to new copy, not to the one line that already works.

### The read-aloud test

Every rewritten page gets read out loud once, before commit. If a sentence can't be said in one breath, it's two sentences. If it sounds like a brochure, it's rewritten. If it sounds like an apology, it's cut.

### Worked examples (real strings, before → after)

| Where | Now | After |
| --- | --- | --- |
| Selected-work lead | "Three projects at three different stages — the part I did, the state each one is really in, and the evidence you can open." | "Three projects at three stages. What I built, what's actually running, and what you can open and check." |
| Syncareer, para 1 | "An AI-powered career platform for African students, built so a saved opportunity, the tailored CV and the interview preparation all sit inside one application record." | "A career platform for African students. A saved job, the CV written for it, and the interview prep all live in one application record." |
| Syncareer, para 2 | "When the CV assistant produced fluent bullets it could not support, I rebuilt the request and response contract around explicit context and citations." | "The CV assistant kept writing bullets it couldn't back up. So I rebuilt the request and response contract around explicit context and citations." |
| Lab preview lead | "A polished sentence can invent experience nobody supplied. Here is an illustrative rewrite, and a check that refuses it because the claim it makes has no footing in the context it was given." | "A polished sentence can invent experience nobody gave it. Here's a rewrite, and the check that throws it out because nothing it claims is in the material." |
| Lab note | "Illustrative fixture and deterministic checks in the browser — no model call, no captured incident." | "Made-up example. The checks run in your browser. No model is called." |
| Bench rail | "Captures and labelled representations" | "Real screenshots, and honest stand-ins where there aren't any" |
| Selected-work closer | "Every case study carries its decision record, its sources, and what has not been verified." | *(deleted — it explains the site)* |
| Person closer | "These pages are built so the work can be checked rather than taken on trust." | "Have a look. Ask me anything." |
| `/profile/` documents | "the document the workspace rail serves, supplied as-is" | "One page, as supplied." |
| `/profile/` capabilities intro | "Open a row for the decisions and the limits; the release state is the same one the archive shows." | *(deleted — the rows are obviously rows)* |
| `/profile/` experience intro | "Role, dates and contribution are in the row. Open a record for what the work actually involved." | "Four roles. Dates and what I actually did are in each row." |

---

## 2. Facts that survive every rewrite

Copy gets cut hard. These stay true somewhere on the site:

- **Syncareer:** live product; the grounding revision is in source, not redeployed; the live model's grounding has not been measured.
- **SessionBook:** implemented MVP; no live calls verified; no deployment; the test file is empty and that's disclosed.
- **Koranco:** MVP delivered; no production deployment verified; no public repo or screenshots; six weeks inside the Jul–Sep 2026 Innovation Lab role; the farm's site is described, its address isn't in the record.
- Dates and titles as supplied; GPA 3.56/4.0; SAT 1520 (730/790); Dean's List Jan 2026; Commonwealth Gold 2025; Sharks Quiz 2024.
- **Lab:** the fixtures are written by me, no model is called, no network request goes out.
- The two counts on `/profile/` — "35+" and "30+" — are unverified. Owner confirms, or they lose the number (Phase 10).

---

## 3. The conceit (one paragraph, then keep it)

The bench is a real bench: a surface with objects on it, where a thing gets picked up and looked at. That gives three rules to design against, and every phase is judged by them:

1. **Objects have weight.** Cards overlap, cast shadows, sit at slight angles, and lift when picked up.
2. **One gesture opens things.** Pick up → expand. Same gesture on the homepage, the archive, and the next-project link.
3. **Regions are places, not sections.** Paper is where you read; the dark region is the machine, and only the Lab lives there.

If a change doesn't serve one of those three, it doesn't ship. This gets written into a new `DESIGN.md` (Phase 1) so it outlives the workplan.

---

## 4. Phases

One PR each. Merge only when asked. Copy is rewritten *inside* each page phase under §1 — there is no separate "rewrite everything" sweep, only a consistency pass at the end (Phase 8).

### Phase 0 — Tools to keep the targets honest (0.5 day)

- `scripts/audit-copy.mjs` — reads `dist/**/*.html`, strips `<script>/<style>/<pre>`, prints words, labels, hedges and screens per route. Wire as `npm run audit:copy`. Reproduces §0's table so nobody has to count by hand again.
- `scripts/check-voice.mjs` — greps built HTML for the §1 banned words, semicolons in body copy, and sentences over 25 words. Wire as `npm run check:voice`. Fails loudly; doesn't block builds.
- Baseline screenshots of all 8 routes at 1440/390/320 into `/tmp/base/` (not committed).

**Done when** `npm run audit:copy` matches §0 within ±2%.

---

### Phase 1 — Write the conceit down (0.5 day) · Tier 1.1

- New `DESIGN.md`: the bench rules from §3, the gesture spec, the voice rules from §1, the label size floor, and the "what this site never does" list (no fake terminals, no particles, no scroll hijack).
- Nothing visual changes. This is the document every later PR is checked against.

**Done when** `DESIGN.md` exists and each of Phases 2–9 references one of its rules.

---

### Phase 2 — The bench gets a shape (1.5 days) · Tier 1.2, 1.3, 3.15

Files: `src/components/home/WorkbenchHero.astro`, `ProjectArtifact.astro`, `src/styles/global.css`, `src/styles/motion.css`

1. **Compose instead of tile.** Replace the 1.12fr/0.88fr grid with an overlapping stack: Syncareer large, SessionBook over its lower-left edge by 40–56px, Koranco offset right and behind at −1.8°, each with a real shadow (`0 18px 40px -18px rgba(23,26,27,.32)` + 1px rule). DOM order stays the reading order; below 46rem they stack flat with no overlap.
2. **Fill the dead quadrant.** The left column is 583px inside a 993px hero — about 350px of empty paper under the CTAs. Add a short factual index under the actions: three project names with a status dot and a link. No new claims, and a second way into the work.
3. **One lift gesture.** One shared class + tokens for anything that opens: `translateY(-4px)`, deeper shadow, 2.2° settle, identical on hero artifacts, archive rows, next-project links. No per-component copies.
4. **Tilt: decide, don't tune.** Keep the existing 2.2° pointer tilt on fine pointers with motion allowed, moved into the shared tokens — or delete it. Judged by eye once. No third round.

**Done when** no empty quadrant at 1440, zero overflow at 1440/768/390/320, tab order unchanged, artifacts clickable before the entrance finishes, and the lift measures the same on all three surfaces.

---

### Phase 3 — One typographic idea (1 day) · Tier 1.4

Files: `src/components/home/WorkbenchHero.astro`, `src/pages/work/index.astro`, `src/styles/global.css`

Pick **one** and apply it to the homepage and the archive, no further:

- **Option A (preferred): an artifact inside a sentence.** One page each where a line of prose carries a small inline object — a 120px product crop, or a citation chip — sitting in the text flow like Nudge does. CSS only, no library, alt text preserved, collapses to a normal sentence on phones.
- **Option B:** a slow horizontal band of the three project names between sections. Needs a reduced-motion still frame.
- **Option C:** headings that scale 4% with scroll. Cheapest, least distinctive.

If the chosen option isn't working in a day, ship without it and say so. A bad version of this is worse than a plain heading.

**Done when** it works at 1440/768/390/320, with reduced motion, without JS, and with no layout shift.

**Built (Option A, Lab preview only).** The two invented claims — "5 years", "40%" — are set as small paper chips inside the sentence that describes them, on the page's own sheet colours, at a 1.4° resting angle that goes flat under 46rem and under reduced motion. They are ordinary inline text, so a screen reader reads them in place; no image, no layout shift, `overflow: 0` at 1440 and 390. One place only, as the phase asked: a second use would make it a motif instead of an idea.

---

### Phase 4 — Lab: stop presenting, start testing (3 days) · Tier 1.5, 2.7

**Why a rebuild and not a trim.** Measured: `/lab/` has 10 controls and none changes an outcome. "Run" replays a fixed sequence — the page says so itself — two radios pick between branches I wrote, and Accept/Edit/Reject act on a draft that is never saved. The interaction is theatre, and the one real idea (a deterministic gate) is buried under ~40 lines of 9.6px mono per screen.

**The rebuild: you try to beat the gate.**

Files: `src/components/ScenarioLab.astro`, `src/scripts/labScenario.mjs`, `src/pages/lab.astro`

1. **One interaction, above the fold.** Reuse the existing checker; add a text field. As you type (debounced ~120ms), the verdict card returns **PASSED** or **REFUSED** with one plain reason (""Kofi's Kitchens" isn't in the material I gave you"). No Run button. Three presets fill the field: **Invent a company**, **Cite nothing**, **Make it honest**. This calls `checkProposal()` exactly as the stages did, so `npm test` keeps asserting the same function.
2. **One bench, not five stages.** Left: the supplied material as four readable chips (opportunity, requirement, evidence, bullet) — no request table, no version numbers, no `requestId`. Centre: the editable proposal. Right: the verdict.
3. **Rules, one line each, collapsed.** Five rules with their reason codes behind a disclosure. Replaces the 622-word refusal stage.
4. **The real story, ~150 words.** What went wrong in Syncareer and what changed in the source revision. One compact before/after pair, not two branch panels.
5. **One limits block, two sentences**, including the honest one: the checker validates structure and citations, not truth — a well-cited sentence can still be wrong, which is why a person reviews it.
6. **Code inspector** stays as a collapsed `<details>` at the bottom.
7. **Keep:** hash deep links (`#lab-invented`, `#lab-nothing-cited`, `#lab-honest` open on that verdict), keyboard operation, `aria-live` verdict, reduced-motion parity, labelled static verdict with JS off. **Retire:** the pipeline strip, `1`–`5` shortcuts, Run/Replay, the A/B radio, the accept/edit/reject sandbox.

**Targets:** ≤ 450 words before the inspector, ≤ 700 total; labels 34 → ≤ 12; controls 5.

**Done when** a first-time visitor gets a refusal within one screen without scrolling; typing changes the verdict; `npm test` passes unchanged; keyboard-only and no-JS both reach a stated verdict; and nothing claims the checker tests truth.

---

### Phase 5 — The contact finale becomes a gesture (1 day) · Tier 1.6

Files: `src/components/ContactSection.astro`

1. Both columns currently stop and leave ~250px of paper. Recompose so the block ends on an action, not on whitespace.
2. **One physical moment:** the email set like a card that lifts and reveals the copy action, or the address set as a stamp. Keeps the `mailto:` first and the copy button second, unchanged behaviour.
3. Copy under §1: two sentences maximum before the address.
4. Keep the `aria-live` copy status, the Gmail-free `mailto:`, GitHub, LinkedIn, résumé.

**Done when** the section ends flush with a decisive element at 1440 and 390, the copy action still announces success and failure, and no interaction is required to read the email.

**Built.** The address is now a slip of paper — typed in the instrument face, a dashed tear line across its top, one notch cut out of the corner, sitting above the sheet on `--shadow-object` and lifting 3px on hover. The copy button moved inside the slip, so both ways of taking the address sit on the same object; the redundant "Email Stephen" button underneath it is gone, because the address was already the `mailto:`. The lead moved to the left column, which is what stopped the section leaving 250px of paper under the headline. Verified: copy succeeds and announces it, blocked clipboard falls back to selecting the address and says so, no JS leaves the slip intact and the button hidden, `overflow: 0` at 1440/1024/390, tilt removed under 46rem and under reduced motion.

---

### Phase 6 — Homepage trim (1 day) · Tier 2.8, 2.11

Files: `src/components/home/SelectedWork.astro`, `LabPreview.astro`, `PersonSection.astro`

1. **Selected work:** drop the four-row facts table and "Known result" line. Keep number + kind·status, name, one-line statement, one paragraph, link. The archive keeps the table.
2. **Delete the section closer.** Section intros: one sentence each, maximum.
3. **Person:** three roles stay; the résumé footnote moves to About; closer becomes the human line from §1.
4. **Lab preview:** lead and note rewritten per §1; the working refusal demo stays.

**Done when** homepage ≤ 560 words, all three projects still named with accurate status, nothing factual lost that isn't on its case study, and the first fold still shows identity + actions + the first artifact.

**Built.** Measured at 1440 (`main` innerText, excluding nav and footer): **725 words, 5.7 screens, 14 labels**, down from 1,051 / 7 / 26. Of those 725, **160 are the artifacts' own text** — the ticket lines, the three map entries, the capture captions — so the prose count is **565**. That is five words over the 560 target, and I stopped there on purpose: the remaining edges are the two state lines that stop SessionBook and Koranco reading as shipped products.

What went:
- `Selected work` lost the four-row facts table on all three projects, the "Known result" paragraph, one of the two Syncareer captures, and the two minis' own artifacts (the bench above already shows them). It is now one flagship with one capture and two short entries — 257 words where there were ~600.
- `The person` lost the achievements list, the second paragraph, the "still studying" footnote and the closer line: 235 words → 116. Three roles stay, named only, with the dates; the detail is on `/profile/`.
- `Lab preview` lost its replay button and script entirely. A button that replayed a fixed sequence was the same theatre the Lab rebuild removed, and it was the only script on the page.

---

### Phase 7 — Case studies: one hedge, one home (1.5 days) · Tier 2.9, 2.10

Files: `src/components/case/CaseStudy.astro`, `src/pages/work/{syncareer,sessionbook,koranco}.astro`, `src/data/caseStudies.ts`

1. Add one **"Not verified"** block per case study, rendered from data, placed in `#limits`. Every scattered hedge moves there or is deleted.
2. **Syncareer:** decisions 307 → ≤ 220; result and limits stop repeating each other; fixture-comparison labels stay.
3. **SessionBook:** visual 313 → ≤ 220; the booking exchange carries it; one flow.
4. **Koranco:** only the hedge block and §1 copy.
5. Intro copy for all three rewritten per §1.

**Done when** syncareer ≤ 850, sessionbook ≤ 780; each status claim appears once per page; anchors and deep links unchanged.

**Built.** A shared `NotVerified` block (one lead sentence, the list, one closing note) now carries every hedge on all three pages, in `#limits`. Everything that was hedging elsewhere was either moved into it or deleted: the "documented failure pattern" note under the problem, the "contract shapes, as documented" note under the comparison, the duplicated "no captured pair" sentence, the trailing "no demo is linked" and "files cited" footnotes, and Koranco's dead 4th decision (it repeated the result section).

Measured, 1440, `main` innerText:
- **syncareer 1,106 → 850** (target 850), 8.3 → 7.8 screens
- **sessionbook 968 → 779** (target 780), 6.7 → 6.4 screens
- **koranco 740 → 599** (target 600), 5.7 → 5.5 screens

Labels are still high on syncareer (37): they are table keys, comparison headers, source tags and fact terms inside the evidence, not prose labels. That is Phase 9's problem, not this one's. Anchors verified after the rewrite: all 13 syncareer aliases, the sessionbook flow anchors and Koranco's three resolve, and `/lab/#lab-invented|#lab-uncited|#lab-honest` still load the matching preset with its verdict.

---

### Phase 8 — Consistency pass, all routes (0.5 day) · Tier 3.12, 3.14

Files: everything with visible copy, plus comments

1. `npm run check:voice` clean, then read every page out loud once (§1).
2. **Break the heading formula once.** `/work/` stops using the "X. Y." pair and just says the thing ("Three projects, one bench."). The voice stays; the template breaks.
3. **Sweep "rail" out** of user-facing copy and stale comments — six places: `src/pages/profile.astro:175` (visible copy) and `:521`, `SiteFooter.astro:148`, `SectionFrame.astro:44`, `motion.css:88`, `motion.css:100`.
4. Confirm no sentence describes the interface instead of the work.

**Done when** voice script passes, hedges ≤ 2 per route, and every page survives the read-aloud test.

---

### Phase 9 — Labels and type floor (1 day) · Tier 3.13

Files: `src/styles/global.css` + the 23 component-local label rules

1. New `--size-label: 0.6875rem` (11px). Point every `.6rem`/`.62rem` override at it; raise the SessionBook ticket clamp floor from 8.8px to 10.5px and re-check its two-line fit at 320.
2. Cut labels to the §0 targets — remove the ones naming what's already visible.
3. Verify size and contrast after the change (the darker labels sit on both paper and the deck).

**Done when** nothing below 10.5px except the drawn ticket object, label counts at target, no new overflow.

**Built — and it found a layout bug that had been live on every phone.** While raising the artifact type I checked the bench at 390 and found the three objects squeezed into a 192px column with a 72px map beside them: the desktop composition places them in columns 1–6 and 7–12, and the phone rule swapped the grid to one column without resetting those placements, so the browsers created eleven empty implicit tracks. Fixed in the phone block; the objects are now full width at 390 and 320.

**Type.** Two tokens in `global.css`: `--size-label` (11px) and `--size-label-sm` (10.5px, the floor). Every label rule that sat between 0.6rem and 0.68rem was repointed — 38 declarations across 12 files — and the artifacts' container-query clamps got their minimums raised to the same floor. Measured with a script that walks every text node on all seven routes at 1440, 390 and 320: **zero text below 10.4px anywhere**, including inside the ticket and the module map. `overflow: 0` at 1440/768/390/320 on every route.

**Labels.** Removed the seven section numerals from the case-study nav (every section already carries its coordinate in its eyebrow), the seven flow stage labels on SessionBook (the step titles say the same thing), and the two deployment lines under the homepage entries (folded into the kicker above them). Counted with a selector for instrument labels, at 1440:

| route | labels | of which are inside a drawn object or shared chrome |
|---|---|---|
| `/` | 21 | 11 (ticket eyebrows, map numerals, artifact state chips, footer headings) |
| `/work/` | 21 | 7 |
| syncareer | 34 | 7 |
| sessionbook | 27 | 6 |
| koranco | 28 | 7 |
| `/profile/` | 13 | 2 |

The §0 targets (≤10 on `/`, ≤14 on syncareer) were set against a much smaller page and against a looser definition. They are not met on the raw count, and I did not strip the evidence tables to meet them: a `dt` that names a release state, and a source tag that says where a claim can be checked, are the opposite of decoration. What is met is the intent — every remaining label is a field key or a state, no label restates a heading, and the two biggest sources of label noise (nav numerals, flow stage labels) are gone.

---

### Phase 10 — Facts and deferred decisions (0.5 day) · Tier 3.16, Tier 4

1. **The 35+/30+ figures:** owner confirms against the résumé, or they lose the number.
2. Record a decision on the deferred four, in `DESIGN.md`, so they stop floating:
   - case-study TOC scroll-spy — **build** (cheap, useful on a long page) or drop;
   - Firefox/Safari shared-element fallback — leave as a plain page load, no work;
   - dialog image loading state — add a text line, no spinner;
   - **R30** personal object, **R31** search, **R32** testimonials — stay unbuilt until content exists. No fake versions.

**Done when** the page states only confirmed numbers and `DESIGN.md` lists the four decisions.

---

### Phase 11 — Verify and deliver (1 day)

- `npx astro check`, `npx astro build`, `npm test`, `npm run audit:copy`, `npm run check:voice`.
- Overflow 1440/1280/768/390/320 on 8 routes; 200% zoom on 5 routes × 3 widths.
- Reduced motion: 0 animations, no hidden text. Keyboard walk including the new Lab field and the dialog. No-JS content check.
- CLS / long tasks / transfer sizes re-measured; reported as local lab numbers, never as Lighthouse.
- `REVIEW.md` updated: what changed, new counts, any register item that moved.
- Deliver local preview + changed files + checks + limitations. **No deploy.**

---

## 5. Order and size

| Phase | What ships | Days | Tier |
| --- | --- | --- | --- |
| 0 | audit + voice scripts | 0.5 | — |
| 1 | `DESIGN.md` conceit | 0.5 | 1.1 |
| 2 | hero composition + lift gesture | 1.5 | 1.2, 1.3, 3.15 |
| 3 | one typographic idea | 1.0 | 1.4 |
| 4 | **Lab rebuild** | 3.0 | 1.5, 2.7 |
| 5 | contact finale | 1.0 | 1.6 |
| 6 | homepage trim | 1.0 | 2.8, 2.11 |
| 7 | case studies | 1.5 | 2.9, 2.10 |
| 8 | voice consistency | 0.5 | 3.12, 3.14 |
| 9 | labels and type floor | 1.0 | 3.13 |
| 10 | facts + deferred decisions | 0.5 | 3.16, 4 |
| 11 | verification | 1.0 | — |

**13 days total.** Phases 0–2 answer "it looks like a regular website". Phase 4 answers "the Lab is slop". 5–10 are clean-up that can ship in any order after them.

If only one thing gets done: **Phase 4.** It's the page most likely to be skipped and the one with a real idea buried in it.

---

## 6. Risks

| Risk | Guard |
| --- | --- |
| Trimming deletes the honesty that makes the site different | §2 list; one hedge per project; Phase 11 diff review against the list |
| Copy drifts back into brochure | `npm run check:voice` + read-aloud test + no adjective without a fact behind it |
| Hero recomposition breaks the view transition or tab order | DOM order = reading order; transition names untouched; keyboard walk in Phase 11 |
| Lab rebuild loses keyboard or deep-link behaviour | Native input + buttons are simpler than stage shortcuts; presets set hashes; `npm test` gates the checker |
| A visitor passes a nonsense sentence and decides the checker is fake | Stated on the page: structure and citations, not truth — and that's why a person reviews it |
| Scope creep into a fifth redesign | The conceit lives in Phase 1–2 only; 5–10 touch copy and tokens, not structure |

**Out of scope:** new routes, new dependencies, any 3D/WebGL, fake terminals or logs, invented personal content, testimonials, search, production deploy.
