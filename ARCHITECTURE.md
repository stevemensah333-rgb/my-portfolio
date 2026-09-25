# Architecture — environment redesign

A summary of the architectural decisions made when transforming the
portfolio from a conventional scrolling layout into a personal computing
environment. Companion to `AUDIT.md` and `AGENTS.md`.

## 1. Shell: workspace rail + mobile bar

The persistent navigation surface is the **workspace rail**.

- **Desktop ≥ 64 rem**: a sticky 17 rem sidebar on the left, listing
  destinations as numbered, mono-labelled rows. Active section updates
  through an `IntersectionObserver`. A path indicator at the top
  (`01 / 09`, etc.) shows progress through the workspace.
- **Tablet/mobile < 64 rem**: a compact sticky bar at the top with
  mono-labelled tabs and a `+` button that opens a drawer with the
  full destination list. `Escape` closes the drawer; clicking a link
  closes it; breakpoint changes close it.
- **Brand**: SM mark + name + role, fixed at the top.
- **Status footer**: real status line ("Open to software engineering roles")
  + a contact CTA. No fake diagnostics.

The rail is keyboard-operable (Tab + Enter), has visible focus, and uses
`aria-current="true"` to indicate the active section. No fake terminals.

## 2. Project registry

A single source of truth lives in `src/data/registry.ts` and
`src/data/projects.ts`. Every project-shaped surface reads from it.

```
Project = {
  id, name, short, status, claim, evidence[],
  claimLimit, stack, route, stages[], narrativeStates?
}
```

Adding a project means:

1. Add an entry to `src/data/registry.ts`.
2. Add a route at `src/pages/work/<id>.astro` using `<ProjectSection>`.
3. Add the route to the sitemap route list (handled automatically — the
   sitemap reads `projects.map(p => p.route)`).

The old `syncareerTrace.ts` is preserved as a thin alias layer that
re-exports from the registry, so any external importer keeps working.

## 3. ProjectSection — the unified project viewer

`ProjectSection.astro` is the single component that renders a project,
whether on the homepage or on its case-study page. It is data-driven
from the registry, uses the shared `initTraceTabs` controller, and has:

- Project header (claim, status, stack, evidence)
- Optional product image (uses `ProductFrame`)
- Optional reliability narrative rail (3-state)
- Stage inspector with `role="tablist"`, roving tabindex, arrow keys,
  Home/End, and a shared `aria-live` region for changes.
- Evidence boundary (the project's `claimLimit`).

No-JS fallback: every panel renders stacked.
Reduced-motion fallback: tabs still work, scroll-sync is disabled.

## 4. Section frame vocabulary (preserved)

The existing visual system is preserved:

- **Canvas / paper** two-environment palette, unchanged.
- **Amber accent** reserved for active state, never decoration.
- **Corner crosshair marks** at the top of every section.
- **Gutter axis ticks** along the hero's rulers.
- **Mono coordinate labels** (`01 / Work · Syncareer`, etc.) at the
  top-left of each section frame.
- **Section frame** component still wraps every major section.

The new components read the same tokens (`--color-canvas`,
`--color-paper`, `--color-accent`, `--color-rule-*`, `--space-*`,
`--font-mono`, `--font-sans`, etc.). The system remains coherent.

## 5. Reliability Lab as its own workspace

`Reliability Lab` is a dedicated destination (#02) and the signature
interactive experience of the portfolio. Since Phase 5 it is its own
component, `ReliabilityLab.astro`, not a second copy of the hero
trace. The hero `ReliabilityTrace` remains the compact preview; the
Lab is the full instrument.

The Lab shows one payload moving through the real Syncareer pipeline:

```
INPUT → MODEL OUTPUT → VALIDATION → FAILURE → DIAGNOSIS →
INTERVENTION → VALID OUTPUT
```

Structure:

- **Pipeline rail** — seven stage nodes in a `role="tablist"`, driven
  by the shared `initTraceTabs` controller (roving tabindex, arrows,
  Home/End). Passed stages fill their validation mark with the stage
  tone; the active stage is amber.
- **Track + payload block** — a 1 px track under the rail with an
  amber square that travels to the active node and a fill line that
  records progress. Causality, not decoration.
- **Transport** — Run/Pause (one toggle, `aria-pressed`), Replay,
  Step back, Step forward, and a mono position readout
  (`03 / 07 · VALIDATION`). Any direct interaction with the rail
  cancels an in-flight run.
- **Payload viewport** — one `role="tabpanel"` per stage: the real
  artifact (contract code, validation checks, failure classes,
  fixes), a *payload delta* line (what the system did to the payload
  between stages), and receives / hands-off / evidence rows.
  Illustrative payloads carry their own `ILLUSTRATIVE FIXTURE` stamp.
- **Hover / focus readout** — a single line under the rail that
  echoes the hovered or focused stage's one-line summary. The same
  text lives in the panel, so hover is never the only route.
- **Evidence boundary inside the instrument** — verified-in-source
  vs never-measured lists, plus the link into the full investigation.

Behaviour contract:

- Run advances stage by stage; validation marks flip to fail one at a
  time; interventions reveal one at a time. `wait()` only advances
  while `!paused`; a run id invalidates superseded runs.
- Autoplay once, at 30 % visibility, exactly like the trace.
- Reduced motion: final state immediately, no autoplay, stepping and
  inspection still work.
- No-JS: all seven panels stack and read; transport, readout and
  track cursor are hidden with `html:not(.js)`.
- Deep links: `/#lab-<stage-id>` selects and scrolls to a stage.

The trace engine keeps the R1 fix from the audit:
- `mouseenter` no longer pauses when the pointer is over the replay
  button (the button is detected with `closest('[data-replay]')`).
- `wait()` only advances while `!paused`.
- `IntersectionObserver` runs once per instance at 30 % visibility.
- Reduced motion renders the final state immediately.

## 5b. Particle portrait — the single particle surface

`ParticlePortrait.astro` (used once, in About) samples the real
portrait into a grid of square data blocks on a 2D canvas:

- At rest the blocks resolve into the portrait. Pointer movement
  displaces blocks inside a 64 px radius; displaced blocks are drawn
  in the controlled accent (amber = out of place), and the spring
  pulls them home when the pointer leaves. Nothing moves otherwise.
- The rAF loop stops the moment the field settles, and never starts
  off-screen (`IntersectionObserver`), while hidden
  (`visibilitychange`), or under reduced motion.
- Cost is capped: cell size grows until the field is ≤ 2600 blocks
  (≤ 1200 on coarse pointers). Draws are batched per ink bucket, so
  fillStyle changes stay rare. No dependencies, no WebGL.
- Fallbacks: the `<img>` stays in the DOM with its alt text; the
  canvas is `aria-hidden` and `hidden` until the first successful
  draw. No-JS, reduced motion, canvas failure or a tainted image all
  leave the static portrait.

## 6. Routes

```
/                              → home (workspace rail + sections)
/work/syncareer/               → case study (uses ProjectSection)
/work/sessionbook/             → case study (uses ProjectSection)
/404.html                      → not found
/about, /contact, /case-study  → redirects (preserved from audit)
```

`/case-study` still redirects to `/work/syncareer/`. When SessionBook
gains enough evidence to be the lead, that redirect target becomes a
decision, not an accident. Right now it stays.

Sitemap routes are derived from the registry, so adding a project
updates the sitemap automatically.

## 7. Interactions — what is real, what is not

Every clickable element does something meaningful:

| Surface | What it does |
|---|---|
| Workspace rail link | Real navigation (anchor or full route) |
| Workspace bar drawer | Real disclosure (`hidden` attribute + focus) |
| Reliability trace replay | Restarts the typewriter engine |
| Project inspector tab | Switches the inspector panel (`initTraceTabs`) |
| Narrative rail button | Switches narrative state + syncs inspector |
| Stage link "Inspect this state" | Scrolls to inspector + selects stage |
| Experience details | Native `<details>` accordion |
| Evidence trigger | Toggles credential panel |
| Toolkit trigger | Toggles capability detail panel |

Nothing exists for decoration. The amber accent marks the active
state; corner marks and gutter ticks are aria-hidden because they
carry no information.

## 8. Accessibility

- Skip link to `#main-content`.
- `:focus-visible` ring on every interactive element.
- Roving tabindex on every tablist (`initTraceTabs`).
- `aria-live="polite"` regions: workspace path indicator, narrative
  announcements, status indicator, toolkit detail, evidence preview.
- `aria-current="true"` on active destination, active narrative step,
  active stage tab, active credential.
- No-JS fallback shows all panels stacked and disables the
  intersection-driven sync.
- Reduced-motion fallback disables typewriter, scroll-sync, and
  ambient pulses; tabs still work.

## 9. Mobile composition

The mobile composition is **not** the desktop shrunk:

- Workspace rail collapses to a sticky top bar (`workspace-bar`).
- Destination list compresses to a horizontally-scrollable set of
  mono-labelled chips.
- A `+` "More" disclosure opens a full-screen drawer with the same
  destinations rendered as full-width rows.
- The trace engine's panel layout adapts (stacked instead of side-by-side).
- Project inspector tab list scrolls horizontally at narrow widths
  (`overflow-x: auto` with snap-align).
- Contact, footer, and evidence remain unchanged in flow.

Breakpoints: 30 rem (narrow phone), 48 rem (tablet), 64 rem (desktop).
Used consistently.

## 10. Performance & build

- **4 static routes** built in ~450 ms.
- **HTML gz**: home ~25.5 KB (the Lab's seven panels are content, not
  chrome), syncareer ~14 KB, sessionbook ~10 KB, 404 ~5 KB.
- **CSS gz**: home page CSS ~6.6 KB; per-page splitting preserved.
- **JS gz**: Lab controller ~1.9 KB + shared `initTraceTabs` ~0.5 KB;
  trace ~2.3 KB; the particle portrait inlines at ~2 KB on the home
  page only.
- Total `dist/` is ~5 MB — almost entirely product screenshots.

Per-page CSS splitting is preserved (verified in dist). No JS framework
added. No WebGL. No new dependencies. The trace engine uses
`requestAnimationFrame` only for the typewriter; the Lab uses chained
timeouts for its run; the particle portrait uses one 2D canvas whose
loop idles at zero cost once the field settles.

## 11. Compromises and trade-offs

These are the deliberate compromises documented at the end of the
redesign. None break an evaluation; each was a choice rather than an
oversight.

| Compromise | Why |
|---|---|
| `font-display: optional` retained | Visual consistency on cold loads; falls back to system mono/sans without breaking layout (verified). |
| Static output keeps redirects as 200 stubs | Matches `astro.config.mjs`. Real 301s would need `vercel.json`; not changed in this pass because the audit records it as a known trade-off. |
| Stephen portrait (799 KB PNG, 800×800) unchanged | Out of scope for this redesign; recorded in `AUDIT.md` P1. |
| Product screenshots ship both PNG and WebP | Same — out of scope. |
| Reliability trace panel titles changed from `<h3>` to `<p>` | They are stage labels inside the hero, not section headings; keeping them as `<h3>` produced an `h1 → h3` skip. Documented. |
| Toolkit 6th featured item (SQLAlchemy) added | Per-group layout uses `nth-child(2n)`, which is group-count agnostic. The audit's concern about a 6th *group* does not apply. |
| Hero trace and Lab coexist | Resolved in Phase 5: the Lab is now its own component and its own instrument; the hero trace stays as the compact preview. They share data, not DOM. |
| Particle portrait samples the 799 KB PNG at runtime | The image is already lazy-loaded for the static fallback; sampling reuses the decoded image, so no second asset ships. Coarse pointers get a reduced cap. |

## 12. What I deliberately did not do

- No fake terminal, fake diagnostic, fake status counter. Every
  surface that looks "instrumental" carries real information.
- No OS chrome (no window controls, no wallpaper, no folders).
- No particle *backgrounds* and no ambient particle motion. The one
  particle surface is the portrait in About, it is static until a
  pointer perturbs it, and it degrades to the static image. Ambient
  animation is still only two CSS pulses (signal-blink on the hero
  coordinate dot, footer status).
- No dark/light mode toggle — the canvas/paper alternation is
  intentional and structural.
- No JS framework. Astro static + ~3 KB of vanilla TS.
- No client-side router. Normal browser navigation preserved.

## 13. Files touched

### New

- `src/components/WorkspaceRail.astro` — the persistent navigation.
- `src/components/ProjectSection.astro` — the unified project viewer.
- `src/data/projects.ts` — Project type and helpers.
- `src/data/registry.ts` — concrete project entries (syncareer, sessionbook).
- `src/config/workspace.ts` — destination list for the rail.
- `src/pages/work/sessionbook.astro` — SessionBook case study route.
- `src/components/ReliabilityLab.astro` — Phase 5: the Lab instrument
  (pipeline rail, track + payload block, transport, payload viewport,
  readout, evidence boundary).
- `src/data/reliabilityLab.ts` — Phase 5: instrument vocabulary
  (chip / readout / delta / illustrative) layered over the
  investigation stages; no new facts.
- `src/components/ParticlePortrait.astro` — Phase 5: the single
  particle surface (canvas data-block portrait with pointer response).

### Changed

- `src/layouts/BaseLayout.astro` — wraps content in a flex layout with
  the WorkspaceRail; adds the global `.layout` styles.
- `src/components/SectionFrame.astro` — accepts `data-workspace-section`
  so case pages can also be tracked.
- `src/components/ReliabilityTrace.astro` — accepts `instanceId` so
  multiple instances can co-exist on the homepage without ID
  collisions. Trace panel titles are now `<p>` (semantically labels).
- `src/components/SiteFooter.astro` — links to both project anchors.
- `src/components/ExperienceSection.astro`, `AboutSection.astro`,
  `EvidenceSection.astro`, `ContactSection.astro`,
  `TechnicalToolkitSection.astro` — added `data-workspace-section` so
  the workspace rail tracks them.
- `src/components/TechnicalToolkitSection.astro` — added 4 SessionBook
  capabilities (Python, FastAPI, SQLAlchemy, Docker); PostgreSQL
  and output-validation-few-shot are now used in both projects.
- `src/pages/index.astro` — uses the new ProjectSection; hosts the
  Reliability Lab as its own destination. Phase 5: the Lab section is
  now `<ReliabilityLab />` (the duplicated trace instance and its
  scoped styles were removed).
- `src/components/AboutSection.astro` — Phase 5: portrait renders
  through `ParticlePortrait` (static image preserved as fallback).
- `src/config/workspace.ts` — Phase 5: destination #02 caption updated
  to describe the instrument.
- `src/pages/work/syncareer.astro` — uses ProjectSection; back link
  goes to workspace.
- `src/pages/sitemap.xml.ts` — derives routes from the project registry.
- `src/data/syncareerTrace.ts` — re-exports from the registry; preserved
  for any external importer.

### Removed

- `src/components/SyncareerSection.astro` — replaced by ProjectSection.
- `src/components/Header.astro` — replaced by WorkspaceRail.
- `src/components/FailureTrace.astro` — replaced by ProjectSection.

## 14. Verification performed

- `astro check` — 0 errors / 0 warnings / 0 hints.
- `astro build` — 4 pages built successfully in ~450 ms.
- Dev server smoke test — all routes return 200; `/404` returns 404.
- Heading hierarchy — every page has exactly one `<h1>`; no level skips
  on the home or case pages.
- Duplicate IDs — none across all four built pages.
- `git grep -i flock src/` — zero references in source.
- Sitemap — all three content routes listed.
- Reduced-motion and no-JS fallbacks — present in every interactive
  component.
- Phase 5 functional harnesses (jsdom, executed against the built
  page, kept outside the repository): 36 Lab checks — initial state,
  stepping, roving tabindex + arrow/Home/End, hover-focus readout,
  run/pause/resume, cancel-on-interaction, full run to completion,
  live announcements, no-JS stacked panels — and 7 particle-portrait
  checks — field build, background skip, pointer displacement,
  recovery and loop shutdown. All pass.
