# AUDIT.md — Forensic implementation audit (pre-redesign)

**Repository:** `stevemensah333-rgb/my-portfolio`
**Commit audited:** `0b138cc8f952f35d61b3922659fdb8955146f1c1` (`main`, single squashed commit — no earlier history)
**Audit branch:** `arena/01a0cf49-my-portfolio`
**Date:** 2026-09-23
**Scope:** read-only. No source file was modified. `AUDIT.md` is the only file changed; it fully replaces the 2026-09-21 audit, which described an older implementation (`Header.astro`, `SyncareerSection.astro`, `FailureTrace.astro`, `AmbientField.astro` — none of which exist any more).

**How this audit was produced:** static reading of every file under `src/` (30 files, ~15,750 lines), the root configs, and the `public/` asset tree; `grep`-based cross-referencing of every component, prop, data module, data attribute, and claim; `git` inspection. Per instruction, **no dependencies were installed** and **no build/check was run** — build facts below are structural observations, not re-verified build output. Run `npm install && npm run check && npm run build` before redesign work begins.

**Governing context:** `AGENTS.md` is the design authority (evidence-led workspace portfolio, HOME / WORK / LAB / PROFILE, LIGHT = INFORMATION / DARK = INSTRUMENTATION). This audit records what *is*, including where the current implementation conflicts with that direction. It proposes no new framework and no new dependencies.

---

## 1. Architecture map

### 1.1 Stack and build

| Aspect | Current state |
|---|---|
| Framework | Astro `^7.1.6`, **static output**, no adapter, no framework integrations (no React/Vue/Svelte), no `client:*` islands |
| Language | TypeScript via `astro/tsconfigs/strict` |
| Styling | Plain CSS: one global sheet (`src/styles/global.css`, 1,279 L) + `interactions.css` (45 L) + scoped `<style>` blocks inside every component; two components use `:global()`/`is:global` escape hatches (WorkspaceRail, BaseLayout) |
| Client JS | Small inline `<script>` blocks per component (Astro-bundled, deduped modules); **one shared module** `src/scripts/initTraceTabs.ts` (108 L). No fetch, no forms, no store, no event bus. One `sessionStorage` key (`workspace-boot-seen`) |
| Hosted services | `@vercel/analytics` + `@vercel/speed-insights`, both injected into `<head>` by `BaseLayout` |
| Config | `astro.config.mjs`: `site: https://stephen-mensah-portfolio.vercel.app`, `redirects` (below), `server.host: '0.0.0.0'` and Vite `allowedHosts: true` for dev **and** preview (keeps sandbox preview working — do not remove) |
| Scripts | `dev`, `build`, `preview`, `check`. No lint, no format, no tests, no CI, no `vercel.json` |
| `.vscode/` | `launch.json` (astro dev), `extensions.json` (astro plugin) |
| Root file | `googlea278621b6f9c1337.html` — Google site-verification stub (verification *also* exists as a meta tag in `BaseLayout`) |

**Dependencies (7 total).** Runtime: `astro`, `@fontsource-variable/inter`, `@fontsource/ibm-plex-mono`, `@vercel/analytics`, `@vercel/speed-insights`. Dev: `@astrojs/check`, `typescript`. Lockfile committed.

### 1.2 Routes

| Route | File | Notes |
|---|---|---|
| `/` | `src/pages/index.astro` (424 L) | Hero + 9 sections + footer |
| `/work/syncareer/` | `src/pages/work/syncareer.astro` (575 L) | Flagship case study |
| `/work/sessionbook/` | `src/pages/work/sessionbook.astro` (757 L) | Second case study |
| `/404.html` | `src/pages/404.astro` (48 L) | `noindex`, no canonical |
| `/robots.txt` | `src/pages/robots.txt.ts` | Generated, links sitemap |
| `/sitemap.xml` | `src/pages/sitemap.xml.ts` | Route list derived from `projects` registry — **single source, good** |
| `/about` → `/#about` | `astro.config.mjs` redirect | Static output ⇒ meta-refresh stubs |
| `/contact` → `/#contact` | redirect | URL commitments per AGENTS.md §8 |
| `/case-study` → `/work/syncareer/` | redirect | URL commitment |

### 1.3 Layout

One layout: `src/layouts/BaseLayout.astro` (118 L). Owns: full SEO head (title, description, canonical with trailing-slash normalization, OG + Twitter with image dimensions, `noindex`, `theme-color #111314`, Google verification meta, optional JSON-LD via `structuredData` prop), font preloads (Inter Variable + IBM Plex Mono woff2), `<script is:inline>` that sets `html.js`, skip link → `#main-content`, **`BootSequence`**, `.layout` flex shell, **`WorkspaceRail` on every page**, `<main id="main-content" tabindex="-1">`, `<slot name="footer" />` (only the homepage passes a footer — case pages and 404 end at their contact section with no footer).

### 1.4 Data layer

| Module | Contents | Used by |
|---|---|---|
| `src/config/site.ts` (8 L) | `PUBLIC_EMAIL`, `GMAIL_COMPOSE_URL`, `PUBLIC_LINKS` (github/linkedin/resume) | Contact, hero, footer-equivalents, JSON-LD |
| `src/config/workspace.ts` (92 L) | `destinations[]` — 8 nav entries (Work→`#syncareer`, Reliability Lab, Toolkit, Experience, About, Evidence, Email→`#contact`, Résumé→external PDF), each with id/label/section/kind/description/index | WorkspaceRail (rail + bar + drawer) |
| `src/data/projects.ts` (95 L) | **Types only**: `Project`, `ProjectStage`, `ProjectEvidence`, `ProjectStatus` | registry, ProjectSection |
| `src/data/registry.ts` (329 L) | `syncareer` and `sessionbook` as full `Project` literals; `projects[]`; `getProject()` (**exported, never used — dead**) | index, both case pages, sitemap |
| `src/data/syncareerInvestigation.ts` (410 L) | `syncareerProduct` (live/repo/problem/built/**pitchResult — never rendered, dead**), `reliabilityTraceCopy` (5-step condensed trace), `investigationStages` (7 rich stages), `investigationDecisions`, `evidenceBoundary` | ReliabilityTrace, SyncareerInvestigation, SyncareerPreview, ReliabilityLab (via reliabilityLab.ts), syncareer page |
| `src/data/reliabilityLab.ts` (124 L) | `labStages` = `investigationStages` + per-stage lab meta (chip/readout/delta/illustrative); `labCopy`; `labBoundary` (reuses `evidenceBoundary`) | ReliabilityLab |
| `src/data/sessionbook.ts` (109 L) | `sessionbookMeta` (repo, commit `48ba544`, tutorial URL), `sessionbookPrimer` (4 Q&A), `sessionbookQuestions` (9 Q&A), `sessionbookBoundary` | sessionbook page |
| `src/data/credentials.ts` (56 L) | 4 credentials with evidence image/doc paths, alt text, dimensions | EvidenceSection |

**Content that lives in component frontmatter instead of data modules:** `ExperienceSection` (`experiences[]`, 4 entries), `TechnicalToolkitSection` (`toolkit[]`, 5 groups / 17 items), `KorancoSection` (all copy inline), `SessionBookArchitecture` (`nodes[]`, 8), `SessionBookWalkthrough` (`steps[]`, 4), `ReliabilityTrace` (5 stage buttons with inline labels/readouts; code bodies from `reliabilityTraceCopy`).

### 1.5 Assets (`public/`, 4.7 MB total)

- **Fonts:** Inter Variable (latin, woff2) + IBM Plex Mono 500 (latin, woff2), self-hosted via `@fontsource`, hand-written `@font-face` with `font-display: optional`, both preloaded. Only one mono weight.
- **Syncareer images:** 3 screenshots × 3 widths (1440/1800/2400) × 2 formats (PNG + WebP) = 18 files (~3 MB).
- **Portrait:** `images/stephen.png` 800×800 PNG (**818 KB**, also the no-canvas `<img>` fallback) + `stephen-480.webp` / `stephen-800.webp` variants with srcset/sizes.
- **Evidence:** 5 files (~708 KB): SAT jpg+pdf, Dean's List png, Commonwealth png, Sharks jpg.
- **Other:** `social-preview.png` (1200×630), favicon.ico/svg, apple-touch-icon, `Stephen-Mensah-Resume.pdf` (72 KB).
- No manifest, RSS, or print stylesheet.

### 1.6 SEO / structured data

- JSON-LD: `Person` (name, url, image, sameAs, Ashesi affiliation, jobTitle, knowsAbout) on `/`; `CreativeWork` (+`SoftwareApplication` about) on `/work/syncareer/`; `CreativeWork` (+`SoftwareSourceCode` with `codeRepository`) on `/work/sessionbook/`.
- Canonical normalized to trailing slash; `og:*`/`twitter:*` complete with image dimensions and alt; `og:locale en_GH`; per-page titles/descriptions; 404 `noindex`.
- Sitemap routes come from the projects registry (route changes propagate automatically **only if** the registry `route` field is updated — navigation and structured data are separate manual steps, per AGENTS.md §8).

---

## 2. Component map

All 20 components + 1 shared script. "Interactive" = ships client JS.

| Component | LOC | Interactive | Used on | Role / notes |
|---|---|---|---|---|
| `WorkspaceRail.astro` | 708 | Yes | **All pages** (via BaseLayout) | Desktop left rail (≥64rem) + mobile bottom bar + "More" drawer. IO section tracking, `aria-current`, path label `NN / NN`, progress fill. Drawer: `inert` background, Esc, focus move, matchMedia auto-close |
| `BootSequence.astro` | 266 | Yes | All pages | ≤560ms boot overlay, skip/Esc/click, `sessionStorage` once-per-session, reduced-motion & no-JS never show, focus handoff to `#main-content` |
| `SectionFrame.astro` | 194 | No | 8 sections + case pages | Region wrapper: seam + copper tick, mono coordinate rule, `surface` (paper/canvas/inset), `density`, forwards `data-workspace-section/dest` |
| `GutterAxis.astro` | 113 | No | **Homepage hero only** | Decorative measured axis (aria-hidden) |
| `ReliabilityTrace.astro` | 1,204 | Yes (engine) | Homepage hero (`instanceId="hero"`) + syncareer case band (`instanceId="case"`) | 5-step typewriter causal trace: raw → validate → failed → intervene → valid. Own engine (not initTraceTabs). **`variant="portrait"` branch is dead** |
| `ReliabilityLab.astro` | 1,413 | Yes (engine) | Homepage | 7-stage instrument: tablist rail + track/cursor, Run/Pause/Resume/Replay/Step transport, payload panels, chips, delta, handoff dl, boundary aside, `#lab-<id>` deep links, IO autoplay once |
| `ProjectSection.astro` | 1,265 | Yes | Homepage (sessionbook, `anchorId="sessionbook"`) + sessionbook page (`anchorId="trace"`) | Generic project "viewer": header (claim/status/stack/evidence) + stage inspector via initTraceTabs + optional narrative block. **Dead paths: `inspectorOnly` prop never used; `productFrame` prop never passed; `showNarrative` always `false`** |
| `SyncareerPreview.astro` | 376 | No | Homepage | Compact Syncareer trailer: margin apparatus, ProductFrame, failure block, 7-stage index linking to `/work/syncareer/#stage-<id>`, boundary, actions |
| `SyncareerInvestigation.astro` | 873 | Yes | `/work/syncareer/` | Full 7-stage investigation: vertical tablist spine (horizontal when stacked <64rem), from/head-off/evidence per stage, inspector fields, artifacts, `#stage-<id>` deep links |
| `ProductFrame.astro` | 484 | Yes | SyncareerPreview, syncareer page ×3 | Captioned screenshot frame: WebP/PNG picture + srcset/sizes, `priority` flag, Inspect button → `<dialog>` lightbox (showModal + fallback, focus save/restore, Esc, backdrop click, scroll lock). Random build-time id `pf-XXXXXX` |
| `SessionBookArchitecture.astro` | 745 | Yes | `/work/sessionbook/` | 8-node signal path tablist (vertical track, readout, states: present/in-progress/written/external) |
| `SessionBookWalkthrough.astro` | 532 | Yes | `/work/sessionbook/` | 4-step call-path inspector (tool/request/process/response), provenance chips, initTraceTabs only |
| `TechnicalToolkitSection.astro` | 857 | Yes | Homepage | Capability index: 6 featured tab rows + detail panel + `<details>` "supporting tools" tail. Hand-rolled tablist |
| `ExperienceSection.astro` | 329 | No (native) | Homepage | 4 `<details name="experience-entry">` accordions on a spine; zero JS |
| `AboutSection.astro` | 115 | No | Homepage | Prose + `ParticlePortrait` in margin rail |
| `ParticlePortrait.astro` | 428 | Yes (canvas) | AboutSection only | Canvas particle portrait sampled from the `<img>`; pointer displacement + spring recovery; coarse-pointer radius; static image under reduced motion; live readout. **Palette hand-mirrored in JS** (INK/ACCENT constants) |
| `EvidenceSection.astro` | 594 | Yes | Homepage | Credential archive: accession tablist + plate viewport, evidence images/documents, hand-rolled tablist |
| `ContactSection.astro` | 254 | No | Homepage | Dark terminus: `mailto:` at feature scale, Gmail-compose accent button, secondary links (GitHub/LinkedIn/Résumé) |
| `KorancoSection.astro` | 240 | No | Homepage | Static 3-panel project blurb + boundary; not in the registry (hardcoded) |
| `SiteFooter.astro` | 137 | No | **Homepage only** | Brand, nav (Index/Syncareer/SessionBook/Koranco/Contact), back-to-top, UNKNOWN tagline |
| `scripts/initTraceTabs.ts` | 108 | — | 5 components | Shared roving-tabindex tab controller: `initTraceTabs(root, {onSelect}) → {select(id)}` + `reserveStackHeight(panels)` (layout-stability measurement, fonts-ready + debounced resize re-run) |

**Per-requested-area inspection notes:**

- **Workspace/sidebar navigation** — `WorkspaceRail` + `config/workspace.ts`. Desktop rail is 15rem; the mobile bar is a horizontally scrolling tab strip + full-screen drawer. Active tracking maps `data-workspace-section` → destination via `data-workspace-dest` (several sections share the `work` destination). Quirks found: (a) `currentDest` hardcodes `work` for both homepage and case pages, so "Work" is current on load before any scroll; (b) **the homepage SessionBook section (`data-workspace-section="sessionbook"`) has no `data-workspace-dest`**, so while it is in view no rail item is current; (c) the boot overlay's initial label hardcodes `00 / 07` while the real homepage section count is 10.
- **Hero** — dark deck band: eyebrow, two-line display headline ("I make AI features reliable enough to ship."), support, actions ("See the proof" → `#syncareer`, "Email me" → Gmail compose), coordinates `<dl>` (status/Based/Year/"Workspace: 2 projects"), and the ReliabilityTrace inset as "The claim, running". Faint 1px grid background (decorative, masked, aria-hidden).
- **Reliability Path** — exists as TWO surfaces: the 5-step `ReliabilityTrace` (hero + case band) and the 7-stage investigation family (`investigationStages` → SyncareerInvestigation on the case page, `labStages` → ReliabilityLab on the homepage).
- **Syncareer case study** — hero + product record + 3 ProductFrames, trace band, 7-stage investigation, decisions, surfaces, evidence boundary, contact.
- **Reliability Lab** — homepage dark instrument, reuses the investigation stages verbatim + lab vocabulary (chip/readout/delta/illustrative), boundary restated inside the instrument, link to the case study.
- **Toolkit** — homepage capability index, evidence-anchored (featured 6 + supporting 11).
- **Experience** — native `<details>` spine, 4 entries, résumé-mirrored copy.
- **About** — quiet register, prose + particle portrait.
- **Evidence** — dark archive plate-drawer with 4 credentials.
- **Contact** — dark terminus; primary action is Gmail compose; `mailto:` present; email also reachable without JS.
- **Existing project navigation** — registry `projects[]` → sitemap; homepage Work = SyncareerPreview (01.1) + ProjectSection/SessionBook (01.2) + KorancoSection (01.3); SyncareerPreview trail deep-links `/work/syncareer/#stage-<id>`; ProjectSection inspector footer links "Explore the full case study"; case pages link back "← Back to workspace" (`/#syncareer`, `/#sessionbook`); footer links all three homepage project anchors. **Koranco is navigable but has no detail route and is not in the registry** — it cannot appear in the sitemap and its "case study" is a homepage section only.

---

## 3. Current information architecture

### 3.1 What is built

**Homepage (single-page environment, coordinates in render order):**

| # | Section id | Coordinate | Surface | Component |
|---|---|---|---|---|
| — | `top` (hero) | — | deck (dark) | index.astro hero |
| 01.1 | `syncareer` | 01.1 · Work / Syncareer | sheet | SyncareerPreview |
| 01.2 | `sessionbook` | 01.2 · Work / SessionBook | sheet | ProjectSection |
| 01.3 | `koranco` | 01.3 · Work / Koranco | sheet | KorancoSection |
| 02 | `reliability-lab` | 02 · Lab / Reliability | deck (dark) | ReliabilityLab |
| 03 | `toolkit` | 03 · Toolkit | sheet | TechnicalToolkitSection |
| 04 | `experience` | 04 · Experience | sheet-soft | ExperienceSection |
| 05 | `about` | 05 · About | sheet | AboutSection |
| 06 | `evidence` | 06 · Evidence | **deck (dark)** | EvidenceSection |
| 07 | `contact` | 07 · Contact | deck (dark) | ContactSection |
| — | footer | — | deck-deep | SiteFooter |

**Case pages:** `/work/syncareer/` = overview → trace band → investigation → decisions → product surfaces → evidence boundary → contact. `/work/sessionbook/` = overview → primer → architecture → stage inspector → call path → questions → boundary → contact.

**Navigation destinations (rail/bar/drawer):** Work · Reliability Lab · Toolkit · Experience · About · Evidence · Email · Résumé.

### 3.2 IA vs the AGENTS.md direction

AGENTS.md mandates **HOME / WORK / LAB / PROFILE** with RÉSUMÉ and EMAIL as utilities, and the journey HUMAN → WORK → INSTRUMENTATION → PROFILE → CONTACT. The current implementation differs in ways the redesign must reconcile:

- **There is no WORK archive page.** "Work" is a homepage anchor (`#syncareer`) plus two `/work/<project>/` detail pages; Koranco is a homepage-only section with no shareable URL (violates AGENTS.md §8 "every major project needs a shareable, indexable detail URL" for Koranco).
- **Toolkit, Experience, About, Evidence are top-level destinations**, but AGENTS.md assigns About/Experience/Capabilities/Evidence to PROFILE and says "Do not turn Toolkit into a standalone workspace; capabilities belong in Profile."
- **Light/dark mapping is inverted for Evidence and Contact:** both are dark reading/CTA surfaces, but AGENTS.md §3 reserves light for "profile, experience, and evidence" and dark for "Reliability Lab, technical inspection, system behavior."
- **The homepage is dense**: identity + trace instrument + full Syncareer trailer + SessionBook inspector + Koranco + the entire 7-stage Lab + toolkit + experience + about + evidence + contact. AGENTS.md §1 asks for a concise homepage that is not a duplicate of the case study or Lab — the Syncareer 7-stage story currently appears on the homepage (Lab) *and* the case page (investigation), and the 5-step trace appears on both too.
- **Contact is a section on the homepage only.** The `/contact` redirect goes to `/#contact`. Case pages have their own inline contact CTA. Email is present on every page via the rail footer and is fully no-JS.

---

## 4. Duplicate content/data

This is the largest structural problem in the codebase. Ordered by severity.

### 4.1 The SessionBook voice-agent contradiction (factual, must resolve first)

The `/work/sessionbook/` page renders **both** of these claims:

- `src/data/sessionbook.ts` + `src/data/registry.ts` (used by the page hero, primer, boundary, and the homepage ProjectSection): *"AssemblyAI voice-agent integration implemented (agent config, HTTP tool routes)"*, *"Integration verified in the repository"*, status line *"MVP — voice-agent integration implemented"*.
- `src/components/SessionBookArchitecture.astro` + `SessionBookWalkthrough.astro` (rendered in sections 02 and 04 of the same page): *"voice_agent/agent.json — present in the repo, empty (0 bytes)"*, *"app/routers/tools.py — present in the repo, empty (0 bytes); no tool routes wired in main.py"*, *"tools.py and agent.json are both empty today"*, *"It is not implemented yet"*.

These cannot both be true. `AboutSection` compounds it with *"SessionBook is a completed voice-agent backend"* while the boundary says no live deployment and sparse tests. Per AGENTS.md §6, the repository is the source of truth — re-verify against the sessionbook repo before any redesign content work, then make the claim travel from **one** data module.

### 4.2 The Syncareer 7-stage story exists as two full data copies (one dead)

- `src/data/registry.ts` → `syncareer.stages` (7 `ProjectStage` literals, ~150 lines) **is never rendered by anything**. `ProjectSection` (the only consumer of `Project.stages`) is instantiated exclusively with `sessionbook`. `syncareer.narrativeStates` is likewise dead (`showNarrative` is always `false`).
- The live copy is `src/data/syncareerInvestigation.ts` → `investigationStages`, consumed by `SyncareerInvestigation` (case page) and, via `reliabilityLab.ts`, by `ReliabilityLab` (homepage).
- The two copies have **already drifted**: registry's stage 07 is labeled `VALID OUTPUT` vs `OUTPUT AFTERWARD` in the investigation copy; several `detail`/`evidence` strings differ in wording; registry carries `code` blocks the investigation renders as `artifact.code`.
- The dead copy is not harmless: it is the loudest place a future editor would "just fix a wording" and it also feeds the `Project` type, forcing every project to carry a `stages` array.

### 4.3 The same failure/intervention content stated 3–5 times

Verbatim or near-verbatim repeats of the Syncareer evidence:

| Content | Copies |
|---|---|
| Illustrative bad output ("Results-driven engineer… Kubernetes… Acme Corp… 40%") | `reliabilityTraceCopy.raw` · `investigationStages[1].artifact.code` · `registry.syncareer.stages[1].code` (dead) — **3 verbatim** |
| Illustrative valid output JSON (`kind/text/sourceContextIds`) | `reliabilityTraceCopy.valid` · `investigationStages[6].artifact.code` · registry `stages[6].code` — **3 verbatim** |
| Failure modes (bullet-only requests / job skills as candidate skills / unvalidated JSON) | `reliabilityTraceCopy.failures` · `investigationStages[3]` (detail + modes artifact) · registry `stages[3].modes` · restated in Lab meta readouts — **4** |
| Interventions (bounded prompts / allowlisted context / citations / risk checks) | `reliabilityTraceCopy.interventions` · `investigationStages[5]` (detail + fixes artifact) · registry `stages[5].fixes` · Lab delta/readout · case "Decisions" section — **5** |
| Validation gates | `reliabilityTraceCopy.gates` · `investigationStages[2]` (checks artifact) — **2** |
| Evidence boundary (known/missing) | `evidenceBoundary` (syncareerInvestigation) · `labBoundary` (reuses it — good) · `syncareer.claimLimit` (registry, paraphrase, rendered by SyncareerPreview) — one paraphrase drifts from the source lists |

AGENTS.md §5 requires **one canonical implementation of the full engineering investigation** with the Lab inspecting, not re-narrating. Currently the Lab renders the *entire* case-study stage detail (`stage.detail`) inside every panel plus its own meta, so the homepage carries a second full telling of the story, and the trace is a third condensed telling on both pages.

### 4.4 Duplicated visual components built independently

- **Evidence-boundary panels ×6 implementations**: `boundary-panel`/`boundary-list` (syncareer page), `boundary`/`boundary-panel` (sessionbook page), `lab__boundary` (Lab), `project__boundary` (ProjectSection), `sync-preview__boundary` (SyncareerPreview), `koranco__boundary` (KorancoSection). Same two-column known/missing concept, six markup+CSS trees.
- **Case-page hero scaffolding ×2**: `back-link`, `case-opening`, `case-summary`, `product-record` (record-heading/dl), `case-note` markup and ~200 lines of CSS are duplicated between `work/syncareer.astro` and `work/sessionbook.astro`.
- **Tablist engines ×3 implementations**: shared `initTraceTabs` (Lab, ProjectSection, SyncareerInvestigation, SessionBookArchitecture, SessionBookWalkthrough) vs hand-rolled roving-tabindex in `EvidenceSection` and `TechnicalToolkitSection` (near-identical to each other, both adding hover-select + status region) vs `ReliabilityTrace`'s bespoke 5-step engine.
- **Timeline/track/cursor/readout boilerplate**: `setTrack` + `setReadout` + `announce` + past/future `dataset` loops are re-implemented inside the `onSelect` callbacks of ReliabilityLab, SyncareerInvestigation, and SessionBookArchitecture.
- **Async run engine ×2**: the `wait(ms, runId)` promise-with-pause (visibilitychange) + run-token cancellation pattern is duplicated nearly line-for-line in `ReliabilityTrace` and `ReliabilityLab`.

### 4.5 Duplicated state

No global state exists (good), but the *same kind* of state is re-declared per component: active index/id, run token, `paused`, `hasPlayed/hasRun`, reduced-motion flag + change listener, and the derived DOM state (`aria-selected`, `tabIndex`, `data-active`, `data-past/future`, `hidden`). Every engine also re-implements its live-region announce. Seven components each own a private copy of this identical machinery.

### 4.6 Duplicated facts living outside data modules

- Koranco facts appear in `KorancoSection` (3 panels + boundary), `AboutSection` prose, `ExperienceSection` entry 1, and the footer link — four places, none data-driven, with the Ashesi Innovation Lab / Center for Entrepreneurship attribution split (AGENTS.md flags this as unresolved).
- Experience entries exist only in `ExperienceSection` frontmatter; the résumé PDF is the stated source of truth — a manual mirror. Note the dates overlap (Innovation Lab Jul–Sep 2026 vs AmaliTech Aug–Sep 2026) and AGENTS.md marks the Amalitech dates as unresolved.
- Syncareer "seed funding" appears as a registry evidence link (`kind: 'document'`, href = the live site) and as About prose; `syncareerProduct.pitchResult` (the fullest wording) is **dead data, never rendered**.
- Toolkit `usedIn` project links are hand-typed per item and can drift from registry routes.

### 4.7 Unnecessary abstractions / dead code summary

- `registry.syncareer.stages`, `syncareer.narrativeStates`, `syncareerProduct.pitchResult`, `getProject()` — dead.
- `ProjectSection` props `inspectorOnly`, `productFrame`, and the `showNarrative` narrative block (~180 lines markup + ~90 lines script + CSS) — dead paths.
- `ReliabilityTrace` `variant="portrait"` SVG branch — dead.
- `Project`/`ProjectStage` type forces the dead duplication (see 4.2).
- Global CSS §9 "token aliases" layer (`--color-background`, `--type-case-title`, …) exists solely so the case pages can keep legacy token names — an acknowledged retirement candidate, plus three later section-qualified override passes stacked on top of component styles (see §6.5).

---

## 5. Current interaction architecture

### 5.1 State model

No store, no router state, no `localStorage`, no network calls. All state is DOM-attribute state owned by one component each; the only cross-component contract is `initTraceTabs(root, {onSelect}) → {select(id)}` (+ `reserveStackHeight`). That module is the de-facto state API and the natural seam for any redesign.

### 5.2 Interaction inventory

| Surface | Controls | State representation | A11y | No-JS | Reduced motion |
|---|---|---|---|---|---|
| Boot overlay | click / Esc / Skip button | `data-state`, `sessionStorage` | real button, focus handoff | never shown | never shown |
| Rail/bar/drawer | links, More button | `aria-current`, `aria-expanded`, `hidden`, `html.bar-drawer-open`, `inert` on background | Esc, focus into drawer, matchMedia close | links work (anchors/URLs) | n/a (progress-fill transition disabled) |
| ReliabilityTrace | 5 step buttons, Replay, Prev/Next | `data-active/current`, `data-panel-active`, gate `data-state`, `data-revealed`, status tone | roving arrows/Home/End, `role=status` live region, readout on hover/focus | panels stack (no-JS CSS), transport hidden | final state populated; live change listener jumps to final |
| ReliabilityLab | 7 tabs, Run/Pause/Resume, Replay, Step ←/→ | `aria-selected`, `tabIndex`, `hidden`, `data-past/future`, track fill/cursor %, `data-mark`, `data-revealed`, `data-state` on run button | tablist + panels, live region, hover/focus readout, `#lab-<id>` deep links | panels stack, transport/readout hidden | final stage selected; stepping still works |
| ProjectSection inspector | 7 tabs | `aria-selected`, `hidden`, `data-narrative-state` | tablist, live region (narrative — dead) | panels stack, rail hidden | transitions only (global kill switch) |
| SyncareerInvestigation | 7 tabs, Prev/Next | as Lab + `data-layout` stacked/inspect | tablist, orientation flips with layout, `#stage-<id>` deep links, live region | panels stack | track jumps instantly |
| SessionBookArchitecture | 8 tabs | as above | tablist, live region | panels stack | transitions only |
| SessionBookWalkthrough | 4 tabs | initTraceTabs default | tablist | panels stack | transitions only |
| Toolkit | 6 tabs + `<details>` tail | `aria-selected`, `hidden`, `data-active`, status region | arrows/Home/End, hover-select on hover-capable pointers only | panels stack; tail is native `<details>` | transitions only |
| Evidence | 4 tabs | `aria-selected`, `hidden`, `data-active`, status region | arrows/Home/End, hover-select gated by `(hover: hover)` | panels stack | transitions only |
| Experience | native `<details name>` | open/closed | native disclosure | works | n/a |
| ProductFrame | Inspect button, Close | `<dialog>` open | `aria-haspopup="dialog"`, focus save/restore, Esc via cancel, backdrop click | image + caption remain; button hidden | instant open (no zoom animation) |
| ParticlePortrait | pointer / tap | particle array in JS, readout text | canvas aria-hidden; `role=live` readout reports discrete states; static `<img>` always present | static image + readout | canvas never activates |

### 5.3 Scroll / observer systems

1. **WorkspaceRail IO** — active-section tracking (`rootMargin: -30% 0px -55% 0px`), drives `aria-current`, path label, progress fill.
2. **ReliabilityTrace IO** — autoplay once at 30% visibility (per instance; homepage and case page each have one).
3. **ReliabilityLab IO** — autoplay once at 30% visibility, then disconnect.
4. **BootSequence** — counts `[data-workspace-section]` elements for its progress label (not an observer, but coupled to the same attributes).
5. `reserveStackHeight` — resize listener (150ms debounce) + `document.fonts.ready` re-measure.
6. `SyncareerInvestigation` — `matchMedia((max-width: 63.99rem))` layout flip re-shows all panels when stacked.

### 5.4 Animation inventory

CSS: token-driven transitions on links/buttons/tabs; `signal-blink`, `rail-status-pulse`, `boot-in/out`, `reveal-enter` (interactions.css, applied by JS on panel activation). JS: typewriter (trace), staged sequencer (lab `playStage`), canvas spring sim (portrait), boot rAF progress. All JS engines respect `visibilitychange` (pause) and run tokens (cancel); both trace and lab listen for reduced-motion *changes* mid-run.

### 5.5 Accessibility safeguards present (keep all)

Skip link; `main tabindex="-1"`; global `:focus-visible` (2px copper) with bright-face override on dark surfaces; `forced-colors` block; roving tabindex with arrows/Home/End in every tablist; `aria-current` on nav and steps; six polite live regions; native `<details>`/`<summary>` and `<dialog>`; `inert` background + Esc + focus management in the drawer; focus restore in the lightbox and boot; decorative elements `aria-hidden`; `data-workspace-*` hooks are attribute-only (no-JS safe); no-JS CSS un-hides stacked panels via `html:not(.js)` overrides in 7 components; reduced-motion handled globally (kill switch) + per-engine final-state branches + mid-run change listeners; 320px/`min-width: 20rem` body floor; `overflow-wrap` for long tokens; `scroll-margin-top` on `section[id]`.

---

## 6. Visual system

### 6.1 Tokens (`global.css` §2)

- **Two environments, one material:** DECK (deep warm charcoal, 5 steps: deep `#0B0C0D` → raised `#25282A`) and SHEET (warm pressed linen, 4 steps: high `#F3EFE4` → inset `#DAD2BD`). Legacy aliases map `--color-canvas*` → deck and `--color-paper*` → sheet; the whole component layer is written against the legacy names.
- **Text:** three steps per environment (`on-paper` `#15181C/#3D4349/#53595F`, `on-canvas` `#EAE7DF/#A6A39B/#8F8C85`), each documented with verified contrast ratios (≥4.5:1 including on inset steps).
- **Rules:** hair/rule/edge weights per environment; `--color-rule-on-canvas-strong #5D6164` is the ~3:1 edge.
- **Accent:** copper `#C2632F` family (bright/deep/soft/tint/ink) + `--color-on-accent #0B0C0D` constant. Signal green `#2C6249` family and rust `#95323C` family reserved for pass/fail trace surfaces. `.on-deck` remaps accent-text to the bright face.
- **Type:** Inter Variable (identity + prose + UI) and IBM Plex Mono 500 (readouts, coordinates, metadata, code). Scale: `--text-display` (hero only) → feature → section → component → body → body-large → small → meta → micro. *Note for the redesign:* AGENTS.md §3 asks for **display typography for identity** and says not to preserve a family pairing merely for continuity — there is currently no display face; Inter is both identity and content.
- **Geometry:** 90° everywhere; the only curve is the circle (status dots, trace nodes); no rounded cards. 4px-grid spacing scale (`--space-1…9`); widths (`--width-reading/content`, `--rail-col`, `--page-gutter`); z-index and control-height tokens; motion tokens (`--duration-quick/base/reveal`, `--ease-standard/emphasized`).

### 6.2 Composition grammar

`.page-shell` (gutter-bound measure) · `.region`/`--major`/`--tight` (three densities) · `.region-grid` (asymmetric rail + body, rail goes sticky ≥60rem) · `.region-rail` / `.region-body` / `.region-index` (mono number + copper rule + name) · `.mono-label` (+`--bare`, `--inverse`) · `.button` / `--accent` / `--secondary` · `.text-link` with arrow · `.on-deck` · SectionFrame seam + coordinate rule. This grammar is the strongest reusable asset in the repo.

### 6.3 Environment usage today (light = information, dark = instrumentation)

Dark: hero, case trace band, Reliability Lab, **Evidence**, **Contact**, footer, rail/bar, boot. Light: everything else. Conflicts with the AGENTS.md mapping: Evidence (a reading/archive surface) and Contact sit on the deck; the trace band duplicates the Lab's instrumentation role on the case page.

### 6.4 Responsive logic

Breakpoints in use: 30, 34, 40, 48, 60, 64, 75/80rem (+ `63.99rem`/`47.99rem`/`59.99rem` max-width companions). Key behaviors: rail ↔ bottom bar swap at 64rem; `region-grid` collapses under 60rem; hero coordinates 1→2→4 columns; Lab rail becomes a horizontal scroller (`lab__railscroll`); investigation switches stacked mode via JS at 64rem; toolkit/evidence grids collapse at 48rem; `--text-*` tokens step down at 30rem; drawer height synced to bar height via `--workspace-bar-height`.

### 6.5 CSS architecture risk: layered overrides

Component styles are scoped, but `global.css` then stacks **four** later layers on top: §9 legacy token aliases for the case pages; a "scale, asymmetry and rhythm pass" (section-qualified `section#syncareer …` rules overriding component CSS, including grid placements); an "information density and repetition pass" (more `section#…`/`article.case-page …` overrides, opacity tweaks); and a final `.section-frame.section-frame` specificity hack. Redesigning components without retiring these layers will produce unpredictable precedence; conversely the layers are the only thing keeping several sections looking current.

---

## 7. Reusable components (keep / modify / remove)

### 7.1 Reuse as-is (proven, low-risk)

- `scripts/initTraceTabs.ts` — the site's state seam; extend rather than replace.
- `SectionFrame.astro` + the `.region-*` grammar + `.mono-label` / `.button` / `.text-link` / `.page-shell` utilities.
- `ProductFrame.astro` (picture + srcset + lightbox + focus handling) — the image-evidence primitive.
- `config/site.ts`, `data/credentials.ts`, `data/sessionbook.ts` (structure, pending the §4.1 fact fix), `evidenceBoundary`/`labBoundary` composition in `reliabilityLab.ts`.
- The no-JS (`html:not(.js)`) panel-stacking pattern, the reduced-motion three-layer pattern, the drawer `inert` pattern, the dialog focus-restore pattern — copy these behaviors forward into anything new.
- `ExperienceSection`'s native `<details name>` spine — zero-JS disclosure done right.

### 7.2 Modify

- `WorkspaceRail` + `config/workspace.ts` — must be re-pointed at the HOME/WORK/LAB/PROFILE destinations; fix the sessionbook `data-workspace-dest` gap and the hardcoded `currentDest`/`00 / 07` boot label while touching it.
- `ReliabilityLab` — keep as the dark instrument, but stop re-narrating the full case prose (consume lab meta + link out); it should inspect, not duplicate (AGENTS.md §5).
- `SyncareerInvestigation` — remains the canonical case-study telling; fold the registry's dead stage copy into it and delete the duplicate.
- `ProjectSection` — delete dead props/narrative block; decide whether it survives as the WORK-archive detail pattern (it is currently the only generic project viewer) or is superseded by per-project case pages.
- `EvidenceSection`, `TechnicalToolkitSection` — migrate their hand-rolled tablists onto `initTraceTabs` (adding hover-select as an option) and move into Profile per the new IA.
- `BootSequence` — AGENTS.md §4 bans fake terminals/fabricated logs; the boot overlay is skippable and brief, but it is OS-cosplay adjacent and its fate should be an explicit redesign decision, not an inheritance.
- `ParticlePortrait` — candidate to keep as the one sanctioned playful surface, but its JS-mirrored palette and 818KB PNG fallback need attention; the AGENTS.md 3D-Stephen concept would supersede or absorb it.
- `BaseLayout` — footer slot used by one page only; make footer usage consistent.

### 7.3 Remove (after their replacements exist)

- `registry.syncareer.stages`, `syncareer.narrativeStates`, `syncareerProduct.pitchResult`, `getProject()`.
- `ProjectSection` `inspectorOnly` / `productFrame` / narrative block; `ReliabilityTrace` portrait variant.
- The per-page duplicated case-hero scaffolding (extract one shared component, then delete both copies).
- Five of the six boundary-panel implementations (keep one).
- Global CSS §9 alias layer + the stacked section-qualified override passes, retired section by section as pages are re-skinned.

---

## 8. Likely migration risks

1. **URL and redirect commitments.** `/`, `/work/syncareer/`, `/about`, `/contact`, `/case-study` are promises. Any IA move to HOME/WORK/LAB/PROFILE must ship redirects, sitemap updates, and structured-data updates in the same change (AGENTS.md §8). Koranco gaining a route changes the sitemap (automatic via registry — but only if Koranco enters the registry).
2. **The SessionBook factual contradiction (§4.1)** — any redesign that touches copy before re-verifying against the repository will either perpetuate or amplify an unsupported claim. Resolve first.
3. **Attribute-coupled navigation.** Rail tracking, boot count, path labels, and progress all key off `data-workspace-section` / `data-workspace-dest`. Renaming or regrouping sections without updating `config/workspace.ts` and every section's attributes silently breaks the rail.
4. **Dead data that looks live.** The registry's Syncareer stages are the most convincing copy in the repo and render nowhere; an editor "fixing" them changes nothing on the site. Delete before migrating.
5. **Layered CSS precedence (§6.5).** Re-skinning a component while the global section-qualified passes still target it will produce hybrid results; retiring the passes before the component work will regress the current look. Sequence per section.
6. **Duplicated engines drift.** Three tablist implementations and two async run engines mean any behavior change (e.g. new keyboard convention) must be made in up to three places and can silently miss the hand-rolled ones.
7. **Layout-stability coupling.** `reserveStackHeight` measures hidden panels synchronously and assumes panels share a parent stack; new layouts (e.g. a WORK archive grid) may invalidate its assumptions and reintroduce resize-on-switch.
8. **Canvas palette mirror.** `ParticlePortrait` hardcodes the palette in JS; a token change desynchronizes it invisibly.
9. **No-JS/reduced-motion contracts are per-component.** Seven `html:not(.js)` blocks and three JS reduced-motion branches must each survive the migration; a redesigned panel that keeps `hidden={index !== 0}` without its no-JS CSS un-hide loses content without JavaScript.
10. **Performance floor.** 818KB portrait PNG, ~3MB of Syncareer PNGs (WebP variants exist and are served via `<picture>` — verify usage survives), two autoplaying instruments on the homepage, and inline JS in every component. The AGENTS.md 3D-Stephen concept adds budget pressure; the audit's static read cannot confirm current bundle sizes — measure after install.
11. **Résumé mirror risk.** Experience dates (incl. the overlapping Jul–Sep 2026 entries) and Koranco attribution are unresolved per AGENTS.md §6; the redesign must not hard-code them as settled.
12. **Single squashed history.** No git history to recover intent from; `ARCHITECTURE.md` describes a superseded workspace concept — treat only `AGENTS.md` as authority.
13. **Build unverified in this audit.** No install/build/check was run (per instruction). TypeScript strictness has not been re-confirmed against the current tree.

---

## 9. Files likely affected by the redesign

| Area | Files |
|---|---|
| Routing / IA | `astro.config.mjs` (redirects), `src/pages/index.astro`, `src/pages/work/syncareer.astro`, `src/pages/work/sessionbook.astro`, possible new `work` archive + `profile` pages, `src/pages/sitemap.xml.ts`, `src/pages/404.astro` |
| Shell / navigation | `src/layouts/BaseLayout.astro`, `src/components/WorkspaceRail.astro`, `src/components/BootSequence.astro`, `src/config/workspace.ts`, `src/components/SiteFooter.astro` |
| Syncareer narrative | `src/data/syncareerInvestigation.ts`, `src/data/reliabilityLab.ts`, `src/data/registry.ts`, `src/components/SyncareerPreview.astro`, `src/components/SyncareerInvestigation.astro`, `src/components/ReliabilityLab.astro`, `src/components/ReliabilityTrace.astro` |
| SessionBook | `src/data/sessionbook.ts`, `src/components/SessionBookArchitecture.astro`, `src/components/SessionBookWalkthrough.astro`, `src/components/ProjectSection.astro` |
| Profile-bound sections | `src/components/AboutSection.astro`, `src/components/ExperienceSection.astro`, `src/components/TechnicalToolkitSection.astro`, `src/components/EvidenceSection.astro`, `src/components/KorancoSection.astro`, `src/data/credentials.ts` |
| Contact | `src/components/ContactSection.astro`, `src/config/site.ts` |
| Shared UI to extract | new boundary/product-record/case-hero components; `src/components/ProductFrame.astro`, `src/components/SectionFrame.astro`, `src/components/GutterAxis.astro` (likely retire), `src/scripts/initTraceTabs.ts` |
| Styling | `src/styles/global.css` (tokens, aliases, override passes), `src/styles/interactions.css`, every component `<style>` block |
| Assets | `public/images/stephen.png` (818KB), portrait variants, possibly new display typeface files (would touch `package.json` — **dependency decisions require a concrete implementation reason per AGENTS.md §8**) |
| Docs | `README.md`, this `AUDIT.md`; `ARCHITECTURE.md` is superseded and should be retired or archived by the redesign |

---

## 10. Recommended implementation order

Stays on the existing stack (Astro + strict TS + plain CSS + small client JS). No new framework, no new dependencies, no backend. Each step is the smallest coherent change that keeps the site shippable.

1. **Verify facts before touching code.** Re-verify the SessionBook voice-agent state against the repository (resolves §4.1), the Koranco/Amalitech attribution and dates against the résumé, and the seed-funding evidence. Then run `npm install && npm run check && npm run build` to re-establish the verification baseline this audit could not.
2. **Consolidate the data layer.** Delete the dead registry Syncareer `stages`/`narrativeStates`/`pitchResult`/`getProject`; make `syncareerInvestigation.ts` the single canonical stage source; slim `ProjectStage`/`Project` so projects are not forced to carry investigation stages; extract one shared boundary/evidence-boundary data shape; put Koranco (or its deliberate absence) into the registry. Pure data move — no visual change.
3. **Fix the content contradictions.** One SessionBook claim everywhere; align About/sessionbook-page/status wording; state the evidence boundary once per surface from the shared data.
4. **Extract shared UI.** One boundary panel, one case-hero/product-record, one back-link — then delete the per-page duplicates. Unify Toolkit/Evidence tablists onto `initTraceTabs` (hover-select as an option). No IA change yet.
5. **Re-base navigation and IA.** Introduce HOME / WORK / LAB / PROFILE with EMAIL/RÉSUMÉ utilities: a WORK archive page, Koranco's route decision, Profile page (About + Experience + Toolkit-as-capabilities + Evidence moved to light surfaces), redirects for every moved URL, sitemap + structured data updated in the same change, `config/workspace.ts` re-pointed, `data-workspace-*` attributes audited on every section. This is the highest-risk step — do it as its own reviewable change with the URL commitments checked line by line.
6. **Re-skin section by section.** Retire the global CSS alias layer and the section-qualified override passes one section at a time (Lab → case pages → profile sections → contact), applying the LIGHT = INFORMATION / DARK = INSTRUMENTATION mapping (Evidence and Contact move to light; dark concentrates in the Lab). Decide the display typeface and BootSequence's fate here, not later.
7. **Interaction upgrades last, budgeted.** The AGENTS.md §4 concepts (interactive 3D Stephen with static fallback, interactive name, project cluster) land only after the structure is stable, each with its own performance/a11y budget, replacing (not stacking on) `ParticlePortrait` where appropriate.
8. **Verification pass per step.** `npm run check` + `npm run build` + rendered inspection: keyboard path, no-JS content, reduced motion, 320px, 200% zoom, and the factual-support checklist from AGENTS.md §9–10.

**Stop.** No redesign work is included in this phase; this document is the complete Phase 1 deliverable.
