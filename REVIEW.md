# REVIEW.md — the bench, final acceptance

**Repository:** `stevemensah333-rgb/my-portfolio`
**Branch:** `arena/d0fe9f58-my-portfolio` (base `a5de844`, "main" after #54)
**Design contract:** `DESIGN.md` (the conceit, the voice, the type floor, the never-do list)
**Date:** 29 October 2026
**Deployment:** **none.** Everything below was verified against a local static build served by `astro preview`. No production deploy was made.

---

## 1. What this pass was

The previous review (#54) fixed defects in the system that existed. This pass changed the system itself, phase by phase, against `DESIGN.md`:

| # | Phase | What it did |
| --- | --- | --- |
| 4 | Lab | Replaced a five-stage walkthrough with one thing you can try: type a sentence, see the gate pass or refuse it, with the reason in plain words. |
| 1 | Design contract | Wrote `DESIGN.md`: one conceit, one voice, one type floor, one list of things the site never does. |
| 2 | The bench | Three objects at three sizes on a stepped baseline, each with its own shadow and resting angle. Nothing overlaps a neighbour's caption. |
| 3 | One idea | The Lab preview's two invented claims sit inside the sentence that accuses them. One place, not a motif. |
| 5 | Contact | The address became a slip of paper with a tear line and a copy button sitting on it. |
| 6 | Homepage trim | 1,051 words to 725, seven screens to 5.7, one script to zero. |
| 7 | Case studies | Every hedge moved into one `Not verified` block per page. |
| 8 | Consistency | Numbering starts at 01, "rail" is gone, `/profile/` stops describing its own interface. |
| 9 | Type floor | Nothing below 10.5px anywhere; two new label tokens; a phone layout bug fixed. |
| 10 | Facts | The unconfirmed 30+ figure is gone; four deferred decisions are settled in writing. |

---

## 2. Measurements

Words are `main` `.innerText` at 1440, excluding nav and footer. Screens are `scrollHeight / 900`.

| Route | Words before | Words now | Screens now |
| --- | --- | --- | --- |
| `/` | 886 (1,051 mid-pass) | **725** (565 of prose; 160 is the artifacts' own text) | 5.7 |
| `/work/` | 303 | 383 | 3.2 |
| `/work/syncareer/` | 1,205 | **850** | 7.8 |
| `/work/sessionbook/` | 1,033 | **779** | 6.4 |
| `/work/koranco/` | 637 | **599** | 5.5 |
| `/lab/` | 1,533 | **450** | 3.2 |
| `/profile/` | 669 | 541 | 4.7 |

Labels, counted with a selector for instrument labels: `/` 21 (11 of them inside a drawn artifact or shared chrome), `/work/` 21, syncareer 34, sessionbook 27, koranco 28, `/profile/` 13. The original targets of 10 and 14 were set against a looser definition and a much smaller page; see WORKPLAN's Phase 9 note (removed with the plan — the reasoning is in `DESIGN.md`: a label that names what a reader can already see is deleted, and a field key is not a label that anyone can infer).

---

## 3. Checks run, with results

### Build, types, tests

| Command | Result |
| --- | --- |
| `npx astro check` | 44 files, **0 errors, 0 warnings, 0 hints** |
| `npx astro build` | **8 pages** built |
| `npm test` | **13 passed, 0 failed** (`node --test` on `src/scripts/labScenario.mjs`) |

### Layout

| Check | Result |
| --- | --- |
| Horizontal overflow, 5 widths × 8 routes (1440/1280/768/390/320) | **0** on every combination |
| Bench geometry, 1440/1280/1024 | no object overlaps another's caption or its "Open" link (0% overlap, measured) |
| Phone bench, 390/320 | full width after the Phase 9 fix; three objects, reading order, no squeeze |
| 200% zoom (720, 512, 384 CSS px) × 5 routes | no overflow; the only elements reported as clipped are `visually-hidden` headings, which is what they are for |

**A real defect was found here**: at 390 and 320 the desktop composition's `grid-column: 1 / 7` and `7 / 13` placements survived into the single-column phone layout, creating eleven empty implicit tracks and squeezing every artifact into ~190px with a 72px map beside it. Fixed in the phone block.

### Motion and scripting

| Check | Result |
| --- | --- |
| `prefers-reduced-motion: reduce`, 8 routes | `document.getAnimations()` empty on every route; no text at `opacity: 0` or `visibility: hidden` |
| No JavaScript, 8 routes | all render their content — `/` 828 words, `/work/` 481, syncareer 928, sessionbook 864, koranco 689, `/lab/` 530, `/profile/` 592, 404 138 |
| No JavaScript, Lab | a labelled static verdict replaces the live field; the invitation copy swaps to a static version |
| No JavaScript, Contact | the `mailto:` slip is intact and the copy button stays hidden |
| Scripts on the homepage | **zero** |

### Keyboard

Tab order on `/` walks skip-link → header → the three bench objects → three actions → the three case-study links → the three entries. On `/lab/` it walks the text field, four presets, four citation chips, the case-study link, the contract disclosure, then Contact. Every focused element showed a 3px focus ring. The image dialog opens, closes on Esc, and returns focus to its Inspect button.

### Performance (local lab, not Lighthouse)

| Metric | Result |
| --- | --- |
| Cumulative layout shift, `/` | **0.0000** |
| Long tasks (`longtask` observer), `/` | **none recorded** |
| Critical resources transferred, `/` from a cold cache | ~4 KB of measured transfer in this environment (fonts and images report 0 `transferSize` over local HTTP with the cache warm); the real weights are in the build output, not in this number |

These are observations of this build on this machine over localhost. There is no field data, no CDN, no TLS and no real mobile radio in the path. They are not page-experience data and are not a Lighthouse score.

---

## 4. What this review did not verify

- **No real devices.** 390×844 and 320×568 are emulated viewports with touch events; Android Chrome and iOS Safari were not exercised. `backdrop-filter`, `mask`, `view-transition` and `content-visibility` are Chromium-tested only.
- **No Firefox or WebKit run.** Shared-element transitions degrade to a plain page load there; that is the accepted outcome, and it was reasoned about, not observed.
- **No screen reader.** Semantics were checked structurally (roles, labels, order, focus movement, `aria-live` on the verdict and the copy status) and by walking the tab order, not with NVDA, JAWS or VoiceOver.
- **No automated accessibility audit.** No axe-core run, no WCAG conformance claim. Contrast of the small labels was checked by token (`#5E625F` on `#F4F0E6`, ~5.6:1) rather than swept over every text leaf.
- **No production deploy.** The deployed build at `stephen-mensah-portfolio.vercel.app` is still the pre-pass version until someone deploys.

---

## 5. Files removed in this pass

`WORKPLAN.md` (the executed plan) and `Stephen-Mensah-Portfolio-Redesign.md` (the brief it was written from) are deleted: both describe work that is now either done or contradicted by the site. `ARCHITECTURE.md` is deleted too — it describes an app-shell and workspace-rail direction that `AGENTS.md` explicitly forbids carrying forward, and leaving a stale architecture document next to a new one is how the wrong idea gets built twice.

Kept: `AGENTS.md` (design authority), `DESIGN.md` (the contract this pass wrote), `AUDIT.md` (read-only implementation history from 2026-09-21), this file.
