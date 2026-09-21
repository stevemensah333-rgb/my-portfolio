# AUDIT.md — Forensic audit of the current portfolio (pre-redesign)

**Repository:** `stevemensah333-rgb/my-portfolio`
**Commit audited:** `9604c685534e92532cec89c1b56112ae5479289b` (`main`, single squashed commit — no earlier history exists to mine)
**Audit branch:** `arena/01a0c550-my-portfolio`
**Date:** 2026-09-21
**Scope:** read-only. No source file was modified. `AUDIT.md` is the only file created.
**Artefacts created by the audit (all gitignored, all removable):** `node_modules/`, `dist/`, `.astro/`. `git status` is clean.

**How this audit was produced:** static reading of all 24 `src` files; `npm install` + `astro build` + `astro check`; dev-server smoke test; machine analysis of the built `dist/` HTML/CSS/JS (duplicate IDs, heading order, per-page bundles, gzip sizes, image dimensions); `git` object/history scanning; GitHub API checks; PDF text extraction; and a read of the sibling public repo `stevemensah333-rgb/sessionbook` plus the supplied AssemblyAI HTTP-tools tutorial.

---

## 0. Verification results (facts this audit rests on)

| Check | Result |
|---|---|
| `astro build` | Passes. 3 pages + robots + sitemap + 3 redirect stubs. 851 ms. |
| `astro check` (TS strict) | **0 errors, 0 warnings, 0 hints** across 24 files |
| Duplicate `id` attributes in built HTML | **None** (home 76/76 unique, case 32/32, 404 4/4) |
| Heading order | Clean h1→h2→h3→h4 on both pages; **no level skips**; 24 headings home, 22 case |
| Dev server | Binds `0.0.0.0:4321`; `/`, `/work/syncareer/` → 200; `/about` → 301 (dev-only, see §9); unknown path → 404 |
| JS shipped | 3 external modules (1.1 KB / 0.5 KB / 0.3 KB gz) + **12.5 KB inline** on home, 8.5 KB inline on the case page |
| CSS shipped | `index` 69.9 KB raw / 9.0 KB gz · `syncareer` 30.5 KB / 4.4 KB · `BaseLayout` 9.6 KB / 2.7 KB — **properly split per page, no cross-page bleed** |
| Flocker references | **Zero, everywhere** — see §10 |
| SessionBook references | **Zero** in this repo — see §11 and the SessionBook evidence box |

---

## 1. Current architecture map

**Framework / build.** Astro `7.1.6` (`^7.1.6`), static output, no adapter, **no framework integration at all** (no React/Vue/Svelte), **no `client:*` directives**, no islands. TypeScript via `astro/tsconfigs/strict` (0 diagnostics). Only two integrations, both Vercel-hosted, both render into `<head>`: `@vercel/analytics` and `@vercel/speed-insights`.

**Routes.**

| Route | File | Notes |
|---|---|---|
| `/` | `src/pages/index.astro` (226 L) | Hero + 6 sections |
| `/work/syncareer/` | `src/pages/work/syncareer.astro` (1244 L) | The only case study |
| `/404.html` | `src/pages/404.astro` | `noindex`, no canonical |
| `/robots.txt` | `src/pages/robots.txt.ts` | Generated at build |
| `/sitemap.xml` | `src/pages/sitemap.xml.ts` | **Hand-rolled**, hardcoded route array `['/', '/work/syncareer/']` |
| `/about`, `/contact`, `/case-study` | `astro.config.mjs` `redirects` | Static output ⇒ **meta-refresh HTML stubs**, see §9 S5 |

**Layout.** One layout: `BaseLayout.astro` (89 L) — head/SEO/meta/JSON-LD, skip link, `<Header />`, `<main id="main-content" tabindex="-1">`, `<slot name="footer" />`.

**Components** (9 + 1 script module), by role:

| Component | LOC | Interactive? | Role |
|---|---|---|---|
| `SyncareerSection.astro` | 1434 | Yes (engine) | Homepage case section + 6-stage inspector + scroll-synced narrative |
| `TechnicalToolkitSection.astro` | 887 | Yes | Two-zone capability index with detail panel |
| `ReliabilityTrace.astro` | 931 | Yes (engine) | Signature hero trace (typewriter) + portrait SVG variant |
| `FailureTrace.astro` | 731 | Yes | 7-stage inspector, sole case-page trace |
| `EvidenceSection.astro` | 470 | Yes | Credentials, desktop switcher + mobile `<details>` |
| `Header.astro` | 272 | Yes | Sticky nav + mobile overlay menu |
| `ContactSection.astro` | 240 | No | Dark CTA band |
| `ProductFrame.astro` | 173 | No | Screenshot frame, `<picture>` WebP/PNG + `priority` flag |
| `AboutSection.astro` | 139 | No | Copy + portrait + portrait trace |
| `AmbientField.astro` | 87 | CSS only | 16 decorative dots, 3 infinite drift keyframes |
| `ExperienceSection.astro` | 76 | Native `<details name>` | Accordion, zero JS |
| `SiteFooter.astro` | 66 | No | "Back to top" |
| `scripts/initTraceTabs.ts` | 66 | Yes | Shared roving-tabindex tab controller |

**Content / data structures — content currently lives in 8 places.** Only 3 are data modules:

- `src/config/site.ts` — email, Gmail compose URL, `PUBLIC_LINKS` (typed `string | null`).
- `src/data/syncareerTrace.ts` (155 L) — stage ids, `illustrativeBadOutput/ValidOutput`, interventions, failure modes, `sharedSyncareerStages`, homepage narrative states.
- `src/data/credentials.ts` (56 L) — 4 credentials with evidence image/doc paths + alt text.

Inline content arrays in **component/page frontmatter**: `ExperienceSection` (`experiences`), `TechnicalToolkitSection` (`toolkit`, 5 categories / 14 items), `FailureTrace` (`stages`, 7), `SyncareerSection` (`compactStages`, 6), `work/syncareer.astro` (`investigationStages`, 6). There is **no project registry** — every project-shaped surface is Syncareer-specific literal.

**CSS architecture.** One global sheet + scoped component `<style>` blocks (Astro auto-scoping; only `Header.astro` has `<style is:global>`, for the `html.menu-open` scroll lock). `global.css` (328 L) is the token layer: colour (`#f7f6f2` / `#121416` / `#62676d` / `#e2e0da` / `#2f6fed` + failure + on-dark ramps, many derived with `color-mix()`), type scale (`--type-hero` … `--text-label`), 4 px spacing base, five section-rhythm tokens, widths, motion tokens (`--duration-fast 140ms`, `--duration-normal 220ms`, `--duration-reveal 380ms`, two easings), breakpoint tokens as **documentation only** (CSS vars can't be used in media queries). 57 media queries total; 14 `!important` — 8 belong to the global and component reduced-motion blocks, 4 guarantee `[hidden]` panels stay hidden, 1 is a responsive layout override in Toolkit, 1 a trivial margin override in Contact. Utilities: `.page-shell`, `.technical-label`, `.button`, `.text-link`, `.skip-link`. `.content-grid` is defined but **never used** (dead rule).

**Animation.** CSS transitions driven by tokens; `AmbientField` keyframes gated behind `prefers-reduced-motion: no-preference`; one JS typewriter (`ReliabilityTrace`); one scroll-driven horizontal pan (case page); two `IntersectionObserver` patterns.

**Scroll observers.**

| Where | Purpose | Gated by |
|---|---|---|
| `ReliabilityTrace` | Start typewriter once at 35 % visibility | none (fires even with reduced motion, but reduced path short-circuits) |
| `SyncareerSection` | Map scroll position → active narrative state (42.5 % activation line via `rootMargin: -42% 0px -57% 0px`) | `(min-width: 64rem)` **and** no reduced motion |
| `work/syncareer.astro` | Sticky horizontal investigation pan; `scroll` listener + `rAF`, `getBoundingClientRect` | `(min-width: 64rem) and (prefers-reduced-motion: no-preference)` |
| `work/syncareer.astro` | `case-nav` → `aria-current="location"` | none |

**Accessibility behaviour present.** Skip link → `#main-content`; global `:focus-visible` 3 px accent outline; roving tabindex with Arrow/Home/End in `initTraceTabs`; `role="tablist"/"tab"/"tabpanel"` on both traces; `aria-pressed` toggles in Toolkit and Evidence; three `aria-live` regions (trace `role="status"`, narrative announcement, evidence preview); mobile menu uses `inert` on `.skip-link`, `main`, `body > footer` + manual focus trap + focus restore + `Escape`; `matchMedia` re-configuration on breakpoint/OS-setting change in `Header` and `SyncareerSection`.

**Reduced motion** is handled in **three independent places** that must agree: `global.css` (`transition-duration: 0.01ms !important` etc.), per-component `@media (prefers-reduced-motion: reduce)` blocks (8 occurrences), and JS `matchMedia` branches (ReliabilityTrace final-state path; SyncareerSection disabling scroll sync; case page disabling the pan).

**Responsive.** Breakpoints: 30 rem, 36 rem (one-off), 47.98/48 rem, 63.999/64 rem. Base grid token `--grid-columns` 4→6→12 (12-col grid only used by Toolkit). Mobile-first authoring in most components; two components duplicate markup per breakpoint (EvidenceSection).

**Assets.**

- **Fonts:** Inter Variable (latin, 48 KB) + IBM Plex Mono 500 (latin, 15 KB), self-hosted via `@fontsource`, declared by hand-written `@font-face` with **`font-display: optional`** and preloaded. Only one mono weight is self-hosted.
- **Images:** 3 product shots × 3 widths (1440/1800/2400) as **PNG + WebP pairs**; `images/stephen.png` **800×800, 799 KB, PNG only, no srcset**; 4 evidence files (708 KB total). Social preview 1200×630.
- **Audio/video:** none. **No manifest, no RSS/feed, no print stylesheet.**
- **Documents:** `Stephen-Mensah-Resume.pdf` (72 KB) linked from header.

**Dependencies (7 total).** Runtime: `astro`, `@fontsource-variable/inter`, `@fontsource/ibm-plex-mono`, `@vercel/analytics`, `@vercel/speed-insights`. Dev: `@astrojs/check`, `typescript`. Lockfile committed. One open Dependabot PR (#9, `fast-uri`).

**Scripts.** `dev`, `build`, `preview`, `check`. **No lint, no format, no test, no CI** (`.github/` does not exist), no `vercel.json`.

**Structured data / SEO.** JSON-LD `Person` (name, url, image, sameAs, affiliation) on home; `CreativeWork` on the case page. Canonical normalised to trailing slash; `og:*` + `twitter:*` + `og:image` dimensions + `theme-color`; Google verification present both as a root HTML file and as a meta tag.

**Deployment assumptions.** Vercel static; `site: https://stephen-mensah-portfolio.vercel.app`; `redirects` in `astro.config.mjs`; `server.host: '0.0.0.0'` and Vite `allowedHosts: true` for dev **and** preview (leaving this alone is what keeps the sandbox preview working). The live domain was **unreachable from this sandbox** (connection failure), so the deployed site could not be verified.

---

## 2. Existing interaction / state map

No global store, no event bus, no `localStorage`/`sessionStorage`/cookies, **no `fetch`, no forms, no network calls**. All state is DOM-attribute state, owned by one component each:

| Surface | State | Representation | Persisted? | Controller |
|---|---|---|---|---|
| Hero trace | step index (0–4), `paused`, `hasPlayed`, `activeRun` (run token), typing progress | `data-active` / `data-current` per step, `data-panel-active` per panel, `data-state` on status, `data-revealed` on fixes, `aria-current="step"` | No | `ReliabilityTrace` (inline script) |
| Case narrative | active state id | root `data-active-narrative-state`, `data-active` per state | No | `SyncareerSection` |
| Case inspector (home) / full inspector (case page) | selected stage + past/active flags | `aria-selected`, `tabIndex`, `data-active`, `data-past`, `hidden` | No | `initTraceTabs.ts` (shared) |
| Narrative ↔ inspector sync | `syncingTrace` boolean **guard** | — | No | `SyncareerSection` via `initTraceTabs`'s `onSelect` callback |
| Case-page rail | active section | `aria-current="location"` | No | `work/syncareer.astro` IO |
| Case-page pan | translate offset, active stage counter | inline `--investigation-x`, `--investigation-height`, `data-enhanced` flag | No | `work/syncareer.astro` |
| Toolkit | selected capability | `aria-pressed`, `data-active`, `hidden` on 3 panel groups (`--inline`, `--detail`) | No | `TechnicalToolkitSection` |
| Evidence (desktop) | selected credential | `aria-pressed`, `data-active`, `aria-hidden` | No | `EvidenceSection` |
| Evidence (mobile) | open credential | native `<details name="credentials">` | No | none (browser) |
| Experience | open entry | native `<details name="experience-entry">` | No | none (browser) |
| Mobile menu | open/closed | `aria-expanded`, `hidden`, `html.menu-open`, `inert` | No | `Header` |

**Architecturally important:** the only cross-component contract that already exists is `initTraceTabs(root, { onSelect })` returning `{ select(id) }`, used with a re-entrancy guard. That is the de-facto state API of this site and is the natural seam to build a more interactive redesign on. Everything else is component-local. `data-*` counts: `data-active` ×30, `data-narrative-enhanced` ×15, `data-state` ×11, `data-panel` ×10.

---

## 3. Reusable components (keep, build on)

1. **`scripts/initTraceTabs.ts`** — small, correct, accessible, framework-free, already supports programmatic `select()`. Reuse as the "select one of N stages" primitive.
2. **`ProductFrame.astro`** — `<picture>` WebP+PNG srcset, `sizes`, `priority` (eager/high) flag, captioned figure. Reuse as-is for SessionBook screenshots; only its decorative "browser bar" needs a visual decision.
3. **`data/syncareerTrace.ts`** — the **content model** (stage ids, kinds, evidence strings, illustrative code, narrative states) is the right shape. Generalise it; don't discard it.
4. **`BaseLayout.astro`** — head/SEO/canonical/OG/JSON-LD/skip-link/main/footer-slot. Extend (new structured-data types, per-page OG), don't replace.
5. **`global.css` token layer** — colour/type/space/rhythm/motion tokens are the visual system that keeps a from-scratch interactive design coherent. Extend.
6. **`Header.astro`** — sticky header, mobile overlay with `inert` + trap + restore. Keep the mechanics; replace only the nav link list.
7. **`ExperienceSection.astro`** — native exclusive `<details name>` accordion with zero JS. This is the correct progressive-enhancement pattern in this codebase; reuse the pattern elsewhere.
8. **`EvidenceSection.astro`** — the *data-driven* credential rendering (`credentials.ts` with `evidenceImage`/`evidenceAlt`/`evidenceWidth`/`evidenceDocument`) and the mobile `<details>` fallback are reusable; the duplicated desktop/mobile markup is not.
9. **`config/site.ts`** — single source for email, Gmail compose, GitHub/LinkedIn/résumé. Keep and extend.
10. **`robots.txt.ts` / `sitemap.xml.ts` / `404.astro` / `SiteFooter.astro`** — correct and cheap; keep (but see §9 S1).
11. **`AmbientField.astro`** — reusable *mechanically*, but see §4 (design conflict).

---

## 4. Components that should be replaced or substantially reworked

| Component | Verdict | Reason |
|---|---|---|
| `ReliabilityTrace.astro` | **Rework (high priority)** | Contains a real interaction bug (§5 R1) and is the hero. Its concept (raw → validate → fail → intervene → valid) is the site's best idea and should survive; the implementation should be rebuilt behind the same `data-*` contract. |
| `SyncareerSection.astro` | **Split + generalise** | 1434 L contains a case header, product proof, a scroll-synced narrative, a stage inspector and CTAs — all hardcoded to Syncareer. SessionBook needs a sibling, so this must become a `ProjectSection`-style component + per-project data. It is also the largest CSS surface in the repo. |
| `FailureTrace.astro` | **Merge** | A near-duplicate of the homepage inspector with a different stage count (7 vs 6) and its own 731-line CSS. Two implementations of one concept will drift; collapse into one inspector component with a data-driven stage list. |
| `TechnicalToolkitSection.astro` | **Rework** | Content model assumes one project (`usedIn: Syncareer`) plus a lot of "Learning / Coursework" claims. Needs a per-project capability mapping and an evidence policy per claim; its layout arithmetic breaks the moment a 6th group is added (§7 R1). |
| `EvidenceSection.astro` | **Rework** | Currently *academic* evidence (SAT, Dean's List, essay prize, quiz) — unrelated to the AI-reliability claim and not connected to projects. With SessionBook the section should carry project evidence; the duplicated desktop/mobile markup should go. |
| `ContactSection.astro` | **Small rework** | Copy is "Have an AI engineering role to discuss?" — fine, but it is the conversion surface and will need to fit the new experience. |
| `AboutSection.astro` | **Rework (light)** | Portrait + short copy is fine; depends on the 799 KB PNG and the portrait trace variant. |
| `AmbientField.astro` | **Decision required** | 16 drifting dots = decorative particle background. `AGENTS.md` explicitly forbids particle backgrounds and judges the design by whether decoration outshines the work (EVAL 5). Carrying a Folio98/AETΣRNA-style visual identity adds pressure to keep something like this — this needs an explicit call, not a silent default. |

---

## 5. Technical risks

**R1 — `ReliabilityTrace` "Replay trace" is effectively broken (highest priority).** `mouseenter`/`focusin` set `paused = true` (`ReliabilityTrace.astro:193–196`), the replay button lives *inside* that region, and `wait()` only advances while `!paused` (`:203–213`). Clicking Replay therefore clears the visual state (`resetVisual()`, `:245–266`) and then waits forever: the hero trace goes blank and stays blank until the pointer *and* focus leave the element. Keyboard users hit the same freeze because the button keeps focus. The trace also freezes whenever the pointer rests over it.

**R2 — Two trace implementations** (§4). Different stage counts, different labels, shared controller.

**R3 — Stage metadata is duplicated.** `sharedSyncareerStages` (`data/syncareerTrace.ts`) is re-spread into `compactStages` (6) and `stages` (7) which override `label`/`title` — the intervention stage is `INTERVENTION` in the data, `FIX` on the homepage, `DIAGNOSIS + INTERVENTION` in the full inspector. Silent drift is already present.

**R4 — Responsive markup duplication.** `EvidenceSection` renders desktop *and* mobile variants at every breakpoint (8 `<img>` elements for 4 credentials, two copies of each link). Any redesign of that section must edit both or diverge.

**R5 — Content is smeared across 8 locations** (§1). Adding a second project means touching literals in: `sitemap.xml.ts`, `astro.config.mjs` redirects, `Header` nav, `index.astro`, `syncareerTrace.ts`, `TechnicalToolkitSection`, `work/syncareer.astro` structured data, and the new page.

**R6 — The site is Syncareer-shaped by construction.** `/case-study` → `/work/syncareer/` redirect, `sitemap.xml` array, `CreativeWork` JSON-LD, narrative states, stage ids, nav labels. There is no "projects" abstraction to extend, so SessionBook cannot be added without creating one.

**R7 — Redirect handling.** With `output: 'static'`, `astro.config.mjs` `redirects` emit **meta-refresh HTML pages served as HTTP 200** (`dist/about/index.html` is a 319-byte stub with `<meta http-equiv="refresh">` + `noindex` + canonical). The dev server returns a real 301, so this behaves differently in dev than in production. There is no `vercel.json` to emit true 301s.

**R8 — Cleanup gaps that can leak during redesign.** `IntersectionObserver` in `ReliabilityTrace` is never disconnected; `visibilitychange` listeners are added per trace instance; the typewriter's `wait()` is a 50 ms `setTimeout` polling loop with `Math.random()` jitter; `window.addEventListener('resize')` on the case page is not debounced (rAF only guards the render).

**R9 — Zero test/lint/CI coverage.** No `.github/`, no test runner, no lint script. `astro check` (0 errors) is the only automated gate, so interaction regressions during the redesign are invisible to tooling.

**R10 — Version drift.** Astro `^7.1.6` installed 7.1.6 (7.3.3 available; dev server warns). Dependabot PR #9 open. Low risk, but pinning policy should be a conscious choice before a large redesign.

**R11 — `AGENTS.md` is a tracked, load-bearing constraint file** (positioning, palette, fonts, forbidden visual motifs, content rules, 5 named evals). The stated redesign direction (Folio98-style interactive environment, AETΣRNA geometry/motion identity) is in direct tension with several of its rules. This is a governance risk: leaving it unchanged while building a different site makes the repo self-contradictory.

---

## 6. Accessibility risks

**A1 — The §5 R1 bug also breaks screen-reader output.** The `role="status"` region is only written inside `play()`; on a stuck replay it announces "Stage 1: unstructured output" and then never completes.

**A2 — `aria-live="polite"` wraps the entire evidence preview** (`EvidenceSection.astro:32`) around four panels whose `aria-hidden` toggles. Live-region behaviour here is unpredictable and can produce long, unhelpful announcements. The live region should be a small dedicated status node (the pattern already used in `ReliabilityTrace` and `SyncareerSection`).

**A3 — `aria-pressed` used for single-select disclosure.** Toolkit triggers and evidence triggers are toggle buttons that can never be "un-pressed", which mis-describes the widget to AT. `aria-pressed` also makes the mobile evidence `<details>`/panel relationship unclear.

**A4 — Selection on focus.** Both Toolkit and Evidence call `select()` on `focus` and `mouseenter`. Simply tabbing through the list changes the detail panel; users can't inspect the list without mutating the view.

**A5 — Toolkit's collapsed group silently resets the selection** (`TechnicalToolkitSection.astro:414–418`): closing `<details data-toolkit-more>` moves the detail region back to the first item, with no announcement.

**A6 — `role="region"` labelled by a `<button>`** (`aria-labelledby={btnId}` on toolkit panels) — an unusual labelling source; a heading-based label would be more robust.

**A7 — Sub-10 px type is used for functional labels:** `0.5625rem` (9 px) and `0.585rem` (9.4 px) appear 5 times across `ReliabilityTrace`, `SyncareerSection` and `FailureTrace` (trace coordinates, hints, legacy strip); `0.625rem` (10 px) appears 13 times. Uppercase mono does not compensate for 9 px text at 200 % zoom or on low-density displays.

**A8 — Inconsistent tablist orientation semantics:** the Syncareer tablist declares `aria-orientation="horizontal"`; the FailureTrace tablist declares none while its keyboard handler supports both axes.

**A9 — Reduced-motion detection is one-shot.** `ReliabilityTrace` reads `matchMedia('(prefers-reduced-motion: reduce)').matches` once at load (`:177`) and never subscribes to changes — unlike `Header` and `SyncareerSection`, which do listen. Toggling the OS setting mid-session requires a reload on the hero.

**A10 — Unverified contrast/forced-colors:** the design leans on `color-mix()` and `#62676d` secondary text on `#f7f6f2` (≈5.1:1, fine) — but there is **no** `prefers-contrast` or `forced-colors` handling anywhere, and no automated a11y scan has ever been run on this repo.

**A11 — Good things that must not be lost** (they are the current a11y baseline): skip link, `:focus-visible` ring, roving tabindex, `inert`-based modal menu with focus restore, `hidden`-attribute panel switching (removes content from tab order), `aria-current` usage, and `aria-hidden` on decorative glyphs.

---

## 7. Responsive risks

**R1 — Fragile Toolkit layout arithmetic.** `--grid-columns` 12 with **hardcoded** `nth-child` spans `2,2,2,3,3` for exactly 5 groups (`:837–867`), plus `display: none !important` on inline panels and `order: 2` on the skills column below 48 rem (`:813–825`, `:870–877`). Adding one capability group (likely with a second project) breaks the 12-col arithmetic and the border logic. Mid-range 48–64 rem uses a 2-col grid with `nth-child(2n)` borders — also group-count sensitive.

**R2 — Behaviour discontinuity at 64 rem.** The homepage narrative switches from "three stacked states" (<64 rem) to "scroll-synced single state" (≥64 rem). At 63.9 rem the visitor sees all three states; at 64 rem they see one at a time. Same for the case-page pan (stacked → sticky horizontal scroll).

**R3 — Nested scroll regions.** ≥48 rem, the case-page trace puts a vertically scrollable tablist *and* a scrollable panel area inside the page (`overscroll-behavior: contain`), with a hardcoded `left: calc(17rem - 1px)` rail. <48 rem it becomes a horizontal snap scroller (`min-width: 11.5rem` tabs) inside a vertically scrolling page. Both patterns are known to trap/confuse touch users.

**R4 — Hardcoded mobile header height.** `.mobile-panel { inset: 4.5rem 0 0 }` assumes the header is exactly 4.5 rem tall (it is 5 rem at ≥48 rem). A redesign that changes header height silently breaks the overlay.

**R5 — No container queries anywhere.** Every adaptation is a viewport media query. A Folio98-style multi-pane environment (panels, docks, nested regions) will need container queries, and there is no existing pattern or token for them.

**R6 — Duplicated breakpoint values** rather than tokens: `30rem`, `36rem`, `47.98rem`, `48rem`, `63.999rem`, `64rem` — a change to a breakpoint requires edits in up to 10 places, and `:root` documents `--breakpoint-*` vars that **cannot be used** in media queries (misleading).

**R7 — Not verified and must be verified in-browser before/after redesign:** 320 px width, 200 % zoom, iOS Safari `100svh` hero maths (hero uses `min(30rem, calc(100svh - 4.5rem))`), and text-overflow in the fixed `2rem minmax(0,1fr) auto 1rem` experience rows.

---

## 8. Performance risks

**P1 — `public/images/stephen.png`: 799 KB, 800×800, PNG-only**, rendered at ≤20 rem (320 px) with no `srcset`. Roughly 10× the bytes needed; the single largest asset on the homepage.

**P2 — No image pipeline.** `astro:assets` is unused; everything lives in `public/` with no build-time resizing, hashing or AVIF. Product shots ship **both** PNG and WebP (the PNGs total ~2.4 MB and are dead weight for WebP-capable browsers); there are no `Cache-Control` overrides (no `vercel.json`).

**P3 — 12.5 KB of inline module JS on the homepage** (6 separate `<script>` blocks, none cacheable). The `Header` script is re-inlined on the case page too. Each becomes its own module → parse/eval per navigation and no cross-page caching.

**P4 — `font-display: optional`** on both fonts: if a font misses the ~100 ms block window the fallback stays for the *entire* page view, and the preloaded mono font is fetched even on pages that barely use it. For a redesign where "typography is the frame", this is a real visual-consistency risk on cold mobile connections and should be re-decided (with the perf trade-off stated).

**P5 — The most expensive script runs first, above the fold.** The hero typewriter mutates `textContent` per character with random jitter and a 50 ms polling timer, while an `IntersectionObserver` and `visibilitychange` handlers are live.

**P6 — 16 absolutely-positioned animated nodes with three infinite keyframes and `will-change: transform`** in the hero plus `will-change: transform` on `ProductFrame`/portrait hover. Composited, but non-trivial on low-end mobile for purely decorative output.

**P7 — Duplicated responsive DOM** (see §5 R4) doubles image elements; the two variants can both be fetched depending on the lazy-load/base-URL heuristics.

**P8 — Measured payload:** home HTML 105 KB raw / 16.6 KB gz; case 52 KB / 11.3 KB; CSS 9.0 KB + 2.7 KB gz on home; fonts 63 KB. `dist/` totals 5.0 MB, almost entirely images. Nothing here is broken — but there is no budget, no CI, and no monitoring beyond Vercel Analytics/Speed Insights.

**P9 — Positive patterns worth keeping:** per-page CSS splitting; `loading="lazy"`/`decoding="async"` everywhere except the priority hero; `priority` → `fetchpriority="high"` + eager on the case hero; `rAF`-throttled scroll handler with a passive listener; prerendered static output with no hydration JS.

---

## 9. SEO / metadata risks

**S1 — `sitemap.xml` is hand-rolled** with a hardcoded array; adding `/work/sessionbook/` requires a manual edit, and there is no `lastmod`. Consider `@astrojs/sitemap` only once routes grow (it is a new dependency — `AGENTS.md` requires justification).

**S2 — Metadata doesn't carry the claim.** Title/description still describe a "Computer Science student building LLM-powered software". Post-redesign the description should match the reliability claim — without over-claiming unverified results (see the SessionBook box).

**S3 — `Person.sameAs` is built from `PUBLIC_LINKS` values that are typed `string | null` and not filtered** (`index.astro:22`). Today both are set, so output is valid; if a link is ever removed, `sameAs` would contain `null` and the JSON-LD would be invalid.

**S4 — Structured data is minimal:** `Person` (no `jobTitle`, `knowsAbout`, `description`) and one `CreativeWork`. No `WebSite`, no `ProfilePage`, no `BreadcrumbList` for the case study.

**S5 — Redirect stubs are 200s, not 301s** (§5 R7) — weak link consolidation for `/about`, `/contact`, `/case-study`. If these URLs matter, emit real redirects (e.g. `vercel.json`) rather than meta-refresh pages.

**S6 — Route naming decision pending:** `/case-study` currently redirects to `/work/syncareer/`. When SessionBook lands, repoint `/case-study` (or leave it and add a projects index) — it is an indexed URL and should be changed deliberately, once.

**S7 — Minor:** no `twitter:site`/`creator`; Google verification duplicated (file + meta); `og:image` on the case page is a 300 KB PNG; no `alternates`; no manifest.

**S8 — Hygiene already correct:** canonical normalisation with trailing slash, `noindex` on 404 and redirect stubs, `robots.txt` generated at build, `og:image:width/height/alt`, `lang="en"`, `theme-color`, descriptive `alt` text on every evidence image, and honest copy that avoids fabricated metrics.

---

## 10. All Flocker references

**Result: there are none. Flocker does not appear anywhere — including in places a plain grep would miss.**

| Searched | Result |
|---|---|
| Working tree (`git grep -i flock`, all tracked files) | 0 |
| Partial match `flock` (catches Flocker/Flock/flocker) in working tree | 0 |
| Entire Git history — pickaxe `-S"flocker"` across **all** refs | 0 (repository has exactly 1 commit: `9604c68`) |
| All Git objects — content scan of every reachable blob | 0 |
| Commit messages/bodies across all refs | 0 |
| `git fsck --dangling` / reflog / stash | 0 (no dangling objects, no stash) |
| Branch list (local + remote) and the open Dependabot branch | 0 |
| Untracked/ignored files (`--ignored`) | 0 |
| GitHub code search across all repos of `stevemensah333-rgb` | `total_count: 0` |
| GitHub commit search (`flocker author:stevemensah333-rgb`) | 0 |
| Issues and PRs (all repos, all states) | 0 |
| `public/Stephen-Mensah-Resume.pdf` (text extracted with pypdf) | 0 |
| Live deployed HTML (`/`, `/work/syncareer/`) | 0 — **caveat:** the production domain was unreachable from this sandbox, so the deployed site could not truly be verified |
| Sibling repos `sessionbook`, `syncareer` | 0 |

**Interpretation.** Flocker is not a code-cleanup task: there is no dead import, no orphaned data file, no comment, no asset, no structured-data node, and no route to remove. The work is content *substitution* — the project slot Flocker would have occupied currently holds Syncareer, and SessionBook needs to be added alongside/afterwards. The only way a Flocker artefact could reappear is by copy-pasting from an external draft (a résumé, a Notion doc, or a previous chat) into the new components. **Prevention rule for the redesign: SessionBook text is written from the SessionBook evidence box below, never from earlier drafts.**

---

## 11. All current project references

| Project / entity | Mentions in `src` | Where it appears |
|---|---|---|
| **Syncareer** | 117 | Homepage case section, case-study page, nav (`Work` → `#syncareer`), `/case-study` redirect, JSON-LD `about`, sitemap, `ProductFrame` address bar (`syncareer.me`), toolkit `usedIn`, outbound link `https://syncareer.me/` ×4 |
| **SynAI** (Syncareer's AI surface) | 14 | Product frame alt/label/caption, toolkit copy |
| **Claude** (model) | 7 | Case-study record, system-context copy, "No AI problem" diagnosis copy |
| **Ashesi University** | 7 | About copy, credentials data, JSON-LD `affiliation`, experience entry |
| **DataCamp** | 4 | Experience entry, toolkit `usedIn` |
| **Amalitech** | 1 | Experience entry |
| **"Portfolio (this site)"** | part of toolkit `usedIn` | Toolkit self-reference |
| **Coursework / local prototypes / learning** | ~8 toolkit items | Toolkit, mostly marked as learning, not product claims |
| **SessionBook** | **0** | Not represented anywhere |
| **Flocker** | **0** | See §10 |

**Cross-asset consistency problems (factual, currently live):**

1. **Amalitech dates disagree.** Site: "Aug 2026 — Present". Résumé: "Aug 2026 – Sep 2026".
2. **Koranco work is attributed differently.** The site's Amalitech entry describes farm production-data/record-keeping work; the résumé attributes that work to "Ashesi Center for Entrepreneurship — Innovation Lab project Participant, Jul 2026 – Present" with Koranco Farms. The site never names Koranco; the résumé does.
3. **The résumé has no SessionBook entry** and no AI-reliability framing — it still lists Syncareer as the flagship product. Any SessionBook case study will contradict the linked PDF until it is updated.
4. Résumé contains claims the site deliberately omits (seed funding for Syncareer, "improving on-time assignment submission rates by 20 %"). The site's restraint is the correct behaviour per `AGENTS.md` EVAL 3 — the discrepancy should be resolved in favour of the site's standard, or evidenced.
5. The site's own evidence boundary copy ("Measured result — not yet supplied", "No measured failure rate supplied", "no fabricated metrics") is a genuine strength and should be treated as the house style for SessionBook.

---

## SessionBook — what can be claimed, and what is UNKNOWN

The portfolio repo contains **no** SessionBook code, copy, image or data. The project exists as a **separate public repo** `stevemensah333-rgb/sessionbook` ("A backend service that manages appointment/session bookings", last commit `48ba544`, 2026-09-20). Everything below is verified from that repo; anything not verified is marked **UNKNOWN**.

**Verified present (safe to describe as built):**

- FastAPI service + SQLAlchemy 2.0 async + `asyncpg`; Postgres 16 via `docker-compose.yml`; Alembic configured (`alembic.ini`, `env.py` wiring `target_metadata = Base.metadata`, sync `psycopg2` URL for migrations).
- Domain model (`app/models.py`): `Provider`, `Slot` (provider FK, start/end timezone-aware datetimes, `is_booked`), `Booking` (unique `slot_id` FK, `caller_name`, `caller_phone`, unique `confirmation_code`, server-side `created_at`).
- Pydantic contracts (`app/schemas.py`): `AvailabilityRequest(date)`, `AvailabilitySlot` (with `spoken_label`), `BookingRequest` (`caller_name` 1–100, `caller_phone` regex `^\+?[0-9]{7,15}$`), `BookingConfirmation` (`confirmation_code` 6–10, `spoken_confirmation`).
- Booking service (`app/services/booking_service.py`): `Africa/Accra` provider timezone (`ZoneInfo`); `check_availability` by date filtering unbooked slots; `book_slot` with `SELECT … FOR UPDATE` row lock, `IntegrityError` → `SlotAlreadyBookedError` fallback, and a spoken confirmation sentence; `_generate_confirmation_code` excludes ambiguous glyphs (`0/O`, `1/I`) for read-aloud/typed-back use; `_to_spoken_label` renders "Saturday, September 5 at 9:00 AM"-style speech.
- `/health` endpoint returning `{"status": "ok"}`.
- `app/config.py`: pydantic-settings (`DATABASE_URL` required, `PORT=8000`, `ENV=development`).

**Verified absent / broken (must not be claimed, and mostly must not be shown as "done"):**

| Item | Evidence |
|---|---|
| **AssemblyAI integration** | **UNKNOWN / not implemented.** `voice_agent/agent.json` exists but is **0 bytes**; no AssemblyAI dependency in `requirements.txt`. |
| **HTTP tools for the voice agent** | **UNKNOWN / not implemented.** `app/routers/tools.py` is **0 bytes** and no router is included in `app/main.py`. |
| **Tests** | `tests/test_booking.py` is **0 bytes**; no test evidence of any kind. |
| **Migrations** | No `alembic/versions/` directory; no migration has been generated. |
| **Documented environment** | `.env.example` is **0 bytes** — required vars are not documented. |
| **Model imports work as written** | `app/models.py` does `from database import Base` → verified **`ModuleNotFoundError: No module named 'database'`** when imported as `app.models` (which also breaks `app.services.booking_service` and `alembic/env.py`). |
| **App metadata** | `FastAPI(name="SessionBook", …)` — verified that FastAPI/Starlette accept and **silently ignore** `name` (there is no `title`), so the app has no configured title. |
| **Availability API surface** | No endpoint exposes `check_availability`/`book_slot`/`get_booking` (only `/health`). |
| **Time labels portable** | `_to_spoken_label` uses `%-d` / `%-I`, which are glibc-specific `strftime` extensions (works on Linux; unverified elsewhere). |
| **Type consistency** | `Booking.slot_id` is annotated `Mapped[str]` against an integer FK; `caller_name`/`caller_phone` are `Mapped[str]` with `nullable=True`. |
| **Deployment, demo, users, metrics, latency, success rate** | **UNKNOWN.** No deployment config, no hosted URL, no data. |

**Portfolio implications.** SessionBook can be presented as the current engineering project with the verified surface above (booking domain, double-booking protection, spoken-output design, timezone correctness) — and the AssemblyAI voice-agent work must be described as **in progress with no verified integration yet**, or omitted, until `agent.json`/`voice_agent` and the tool routes exist and run. Any claim about call volume, booking success, latency, or "reliability improved" would be fabrication and must not appear. The AssemblyAI HTTP-tools tutorial defines the intended shape (stored agent JSON + HTTP tools pointing at a REST API, spoken-not-parsed responses, a `get_today` tool, schema design that makes the agent re-ask rather than guess) — that is the *conceptual* target, not evidence of implemented work.

---

## 12. Existing features worth preserving

1. **Claim-led hero** — "I make AI features reliable enough to ship." One sentence, one claim, immediately provable below.
2. **The trace concept** — raw model output → validation → failure → intervention → valid output. This is the site's strongest original idea and the right spine for a more interactive redesign.
3. **The evidence boundary as house style** — "Not yet supplied. No reliability threshold is claimed here.", "no fabricated metrics", "ILLUSTRATIVE — not a historical log". Actively protects credibility (EVAL 3).
4. **`initTraceTabs`** — accessible, framework-free, programmatically controllable, already used twice.
5. **`ProductFrame`** — responsive WebP/PNG with `priority`, real `width`/`height` (no CLS), captions tied to labelled figures.
6. **Progressive enhancement where it exists** — native `<details>`/`<details name>` for Experience and mobile Evidence (zero JS), `<noscript>` fallback in the hero trace, `hidden`-attribute panel switching.
7. **Global reduced-motion clamp** plus per-component motion opt-outs.
8. **Mobile menu mechanics** — `inert` + focus trap + focus restore + `Escape` + `matchMedia` close on breakpoint change.
9. **Skip link, `:focus-visible` ring, `aria-current` usage, `aria-hidden` on decorations.**
10. **Token layer in `global.css`** — the reason a redesign can be visually coherent at all.
11. **Per-page CSS splitting** (verified: home CSS not loaded on the case page and vice versa).
12. **`BaseLayout` SEO layer** — canonical normalisation, OG/Twitter, JSON-LD injection, per-page overrides, `noindex` support.
13. **Data-driven evidence & credentials** with alt text and dimensions authored in the data file.
14. **Honest toolkit disclosures** — "Used for data work and API validation patterns, not claimed as Syncareer prod stack.", "Learning – pattern reference".
15. **Case-page rail** with `IntersectionObserver` → `aria-current="location"` and a hashchange fallback.
16. **A working, fast, dependency-light build** — 3 pages in 851 ms, 0 type errors, ~27 KB gz of CSS+JS+fonts on the homepage.

---

## 13. Code that should NOT be rewritten without a concrete reason

| Do not rewrite | Why |
|---|---|
| `BaseLayout.astro` head/SEO block | Correct, complete, verified (canonical, OG, Twitter, JSON-LD, icons, font preload). Extend only. |
| `global.css` token layer | The shared vocabulary for the redesign. Add tokens; don't replace the palette/scale/rhythm system wholesale. |
| `scripts/initTraceTabs.ts` | Small, correct, accessible, already the site's only cross-component contract. Extend it (`onSelect`/`select`) rather than replacing it with a new controller. |
| `ProductFrame.astro` picture/priority logic | Verified correct and CLS-safe. |
| `config/site.ts` | Single source of truth for contact + links. |
| `robots.txt.ts`, `sitemap.xml.ts`, `404.astro`, `SiteFooter.astro` | Working; only the sitemap route list needs to grow. |
| `ExperienceSection.astro` mechanics | Native `<details name>` with correct focus styling and reduced-motion handling — the pattern to copy, not to "modernise". |
| `EvidenceSection.astro` data module usage | Keep `credentials.ts` shape (image + alt + explicit width/height + optional document). |
| Astro config `server.host` / Vite `allowedHosts: true` | Removing these breaks the live preview. Do not "tidy" them. |
| `syncareerTrace.ts` content model | Generalise the types; the data itself is accurate and hard-won. |
| The `syncingTrace` re-entrancy guard | Prevents an infinite narrative↔inspector loop; subtle and correct. |
| The whole static, dependency-light architecture | No React, no global state library, no Tailwind — `AGENTS.md` requires a stated reason for any dependency. Do not add frameworks as part of "interactivity"; the current site proves plain Astro + ~3 KB of vanilla JS is enough. |

---

## 14. Recommended implementation order for the redesign

**Phase 0 — decisions before code (no files touched).**
Resolve four conflicts explicitly, because they determine everything downstream:
(a) `AGENTS.md` vs the new visual direction (it forbids terminal themes, particle backgrounds, 3D decoration, and judges design by EVAL 5 "decoration must not outweigh the work" — Folio98/AETΣRNA inspiration pulls the other way);
(b) what SessionBook may publicly claim today (see the evidence box — integration is UNKNOWN, so the first version should lead with the verified booking-engine surface);
(c) whether Syncareer stays the featured case or becomes one of two;
(d) whether `/case-study` is repointed and whether a `/work/` index is introduced.
Output: an updated `AGENTS.md` positioning/evidence section (only after the user agrees) and a short project-claims policy.

**Phase 1 — foundations, no visual change (lowest risk, unblocks everything).**
1. Add `src/data/projects.ts` (project registry: id, name, route, status, summary, stack, evidence[], claim limits) and a **SessionBook entry populated strictly from the evidence box**, with `UNKNOWN` markers.
2. Drive the sitemap route list, the `/case-study` redirect target, structured data, and nav from that registry.
3. Fix the trace freeze/replay bug (§5 R1) using the existing `data-*` contract — small, isolated, immediately verifiable.
4. Fix `Person.sameAs` null filtering (§9 S3).
5. Add `?` guard: keep `astro check` green; run `build` after every step.
*(Closes R1, R5, R6, S1, S3. Touches no layout, so it is safe to do before any design decision is final.)*

**Phase 2 — component generalisation (behaviour-preserving refactor).**
6. Extract from `SyncareerSection` a reusable `ProjectSection` / case-hero / narrative-rail structure, keeping the homepage's current rendering pixel-identical for Syncareer.
7. Merge `FailureTrace` and the homepage inspector into **one** stage-inspector component with a data-driven stage array; remove the duplicated labels (§5 R2/R3).
8. De-duplicate `EvidenceSection`'s desktop/mobile DOM (§5 R4) while keeping the mobile `<details>` fallback and the keyboard/AT behaviour.
9. Re-model `TechnicalToolkitSection` around per-project capabilities and fix the hardcoded 5-group grid arithmetic **before** adding a second project's tools (§7 R1).

**Phase 3 — the new interactive experience (only after Phase 1–2).**
10. Rebuild the hero/environment per the approved direction on top of the preserved primitives (`ProductFrame`, `initTraceTabs`, registry data). Budget the interaction, don't discover it.
11. Keep the existing engines working throughout: `matchMedia` re-configuration, `IntersectionObserver` gating, `hidden`-attribute switching, native `<details>` fallbacks.
12. Acceptance criteria fixed from day one, not retrofitted: **no-JS renders a complete, readable page**; **reduced-motion renders final states with no transitions**; **keyboard-only reaches and operates every control**; 320 px, 200 % zoom, and touch all verified in a browser.

**Phase 4 — evidence, assets, documents.**
13. SessionBook evidence capture (screen recording/screenshots of a real call, tool-call logs) — the one thing that converts claims into proof.
14. Image pipeline for `stephen.png` etc. (§8 P1/P2) and a decision on `font-display`.
15. Update the résumé PDF and resolve the Amalitech/Koranco discrepancies (§11).

**Phase 5 — verification and budgets.**
16. Per page: Lighthouse (perf/a11y/best-practices/SEO) + axe; keyboard-only pass; no-JS pass; reduced-motion pass; 200 % zoom; 320 px; both breakpoint boundaries (47.98/48 rem, 63.999/64 rem) to confirm the §7 R2 discontinuity is intentional.
17. Add the missing automation this repo has never had: a CI job running `astro check` + `build`, and a JS/CSS/image byte budget.

**Ordering rationale:** Phase 1 is deliberately non-visual — it makes the SessionBook slot data-driven and fixes the one live interaction bug, so that when the visual work starts it is *content and interaction work*, not archaeology. Phase 2 removes the duplicate implementations that would otherwise be copied twice into the new design. Phase 3 is last among code phases because the current codebase has no project abstraction and no automation; building a "more interactive environment" on top of Syncareer-hardcoded components would multiply the hardcoding.

---

## Open questions blocking parts of the redesign

1. How much of SessionBook may be claimed publicly today, given the AssemblyAI integration is **UNKNOWN/not implemented** and there are no tests, endpoints, or benchmarks? (Recommendation: describe the verified booking engine now; present the voice agent as in progress; add no numbers.)
2. Does building a Folio98-style "interactive computing environment" override the current `AGENTS.md` prohibitions (terminal motifs, particle backgrounds, decoration-first design)? One of the two must change.
3. Is Syncareer still the flagship, or does SessionBook become the lead case study?
4. Should `/case-study` be repointed to a SessionBook route, kept on Syncareer, or replaced with a `/work/` index?
5. Is the public résumé going to be updated in sync with the site (Amalitech dates, Koranco attribution, SessionBook entry)?
6. Should the redesign keep `font-display: optional` (fast, but may permanently fall back to system fonts on slow connections) or switch to `swap` (correct typography, visible reflow)?
