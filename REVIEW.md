# REVIEW.md — final acceptance review of the workbench redesign

**Repository:** `stevemensah333-rgb/my-portfolio`
**Branch:** `arena/3cf0ab4e-my-portfolio` (base `767b5f2`, "One motion vocabulary, and the phone/tablet/accessibility pass (#53)")
**Brief under review:** `Stephen-Mensah-Portfolio-Redesign.md` — §3 register R01–R32, §5 page requirements, §6 motion/mobile rules, §8 acceptance
**Date of this review:** 28 October 2026
**Deployment:** **none.** Everything below was verified against a local static build (`npx astro preview`). No production deploy was made.

---

## 1. Verdict

The designed system now covers every route the brief names — homepage, archive, all three case studies, Lab, About (`/profile/`), Contact, phone and tablet layouts, reduced-motion layouts and the functional states that exist. The R01–R32 register is answered in §5: **28 implemented, 3 deliberately not built (P2), 1 partially met with a documented gap, 0 unaddressed.**

This review found and fixed six defects. Four are typographic or responsive (display leading on stacked headings, inspector prose measure, tablet case-study fact grid, duplicated dialog caption), one is a control-size fix (footer "Back to top" at 40px), one is an interaction gap carried as a known limitation since Prompt 6 (dialog focus trap). All fixes were re-verified on every route after the change.

Nothing measured here is a Lighthouse or CrUX score. There is no field data for this site, and the lab numbers in §4 come from headless Chromium over local HTTP with synthetic CPU/network throttling. They are reported as observations of this build on this machine.

---

## 2. What this review changed

Ten files, all on the session branch, uncommitted at the time of writing.

| File | Change | Why |
| --- | --- | --- |
| `src/styles/global.css` | New `--leading-display` token (`1.03`, `1.12` under `46rem`); `.case-intro` collapses to one column under `64rem` | Opening headings stacked on phones let descenders meet the next line's ascenders. And at 768px the case-study fact grid was squeezed into ~280px. |
| `src/components/home/WorkbenchHero.astro` | Hero title consumes the token; removed the ad-hoc phone override | The override existed because there was no token; the token makes the rule impossible to forget. |
| `src/pages/work/index.astro`, `src/pages/profile.astro`, `src/components/ScenarioLab.astro` | `.archive h1`, `.about h1`, `.lab__title` consume the token | Same reason. Four opening headings, one rule. |
| `src/components/ScenarioLab.astro` | Keyboard jump (`1`–`5`) now sets `location.hash` instead of calling `scrollIntoView` | A keyboard jump and a rail click now produce the same shareable URL and the same rail state. |
| `src/components/ScenarioLab.astro` | `.plate__note` capped at `62ch` | The notes under the code excerpts ran the full inspector width: ~160 characters a line at 13.6px. |
| `src/components/ProductFrame.astro` | Tab/Shift-Tab now wraps inside the image dialog | Browsers let Tab leave a modal dialog for their own chrome and return. The cycle is now closed inside the dialog. |
| `src/components/ProductFrame.astro` | Dialog caption prints the caption only, not `caption — alt` | The alt describes the same image, so the dialog read as a duplicated sentence. |
| `src/components/SiteFooter.astro` | "Back to top" `min-height: 44px` (was 40px) | It is a standalone target on every page and was the only control below 44px. |
| `src/components/home/StephenPortrait.astro` | Portrait is `loading="lazy"` instead of `fetchpriority="high"` | It sits below the fold on the homepage and was competing with the hero capture. |
| `public/images/stephen.webp` | Re-encoded 500×500, quality 85, method 6: 139,336 → 21,220 bytes | 118KB of the homepage's weight was one portrait. Mean absolute channel difference 0.93/255; side-by-side comparison indistinguishable. |
| `src/layouts/BaseLayout.astro` | Focus/scroll after client-side navigation: focus the main region, re-resolve cross-page hashes after the route loads, keep the browser's restored position on Back/Forward, and always reset with `behavior: 'instant'` | Cross-page deep links overshot (landed 2,072px below the heading); Back reopened new routes part-way down. |

Nothing in `src/content/`, `src/data/` or any claim was invented, softened or added. No dependency, framework or route changed.

---

## 3. How this was reviewed, and what that limits

Environment: Linux headless Chromium (`@sparticuz/chromium`) driven through `puppeteer-core`, against `astro preview` on `127.0.0.1:4331` serving the current `dist/`. Every route is loaded directly by URL and also reached by clicking through the interface.

Limits, stated plainly:

- **No real devices.** Phone (390×844), small phone (320×568), tablet (768×1024) and desktop widths are emulated viewports with touch events enabled. iOS Safari and Android Chrome were not exercised. Everything containing `backdrop-filter`, `mask`, `view-transition` or `content-visibility` is Chromium-only as tested.
- **No Firefox or WebKit run.** The shared-element transition is Chromium's View Transitions API. Firefox and Safari fall back to a normal navigation; that fallback was reasoned about, not observed.
- **No screen reader.** Semantics were checked structurally (roles, labels, order, focus movement, `aria-current`, `aria-live` on the copy status) and by walking the tab order, not with NVDA/JAWS/VoiceOver.
- **No automated accessibility audit.** The contrast sweep in §4 is a computed-style check of every text leaf against its nearest opaque ancestor background. It cannot see text over images, gradients, or `mask` layers, and it is not axe-core. This is **not** a claim of WCAG conformance.
- **Performance numbers are lab-only.** CPU throttled 4×, network 1.6 Mbps down / 750 kbps up / 150 ms RTT, one cold context per measurement. Warm localhost HTTP, no CDN, no TLS, no real mobile radio. Do not read them as page-experience data.
- **Transfer sizes** are read from `content-length` response headers with the cache disabled. The HTML document is served without a `content-length`, so the totals understate each page by roughly one document.

---

## 4. Checks run, with results

### Build, types, tests

| Check | Result |
| --- | --- |
| `npx astro check` (strict TS + templates) | **0 errors, 0 warnings, 0 hints**, 44 files |
| `npx astro build` | **8 pages** built (7 routes + `404.html`) |
| `npm test` (Node test runner) | **13 passed, 0 failed** — includes the Lab gate's reason codes, the fixture schema and the copy/link inventory |

Run after every edit in this review; the final runs are the ones quoted.

### Routes, links, redirects

- All seven routes plus `404.html` return their expected status and content on direct load. Zero broken internal links in the built output.
- `/about`, `/contact` and `/case-study` redirect to `/profile/`, `/profile/#contact` and `/work/` correctly with JavaScript on **and** off.
- `/Stephen-Mensah-Resume.pdf` — 200, `application/pdf`, 71,458 bytes, one page. A real document, opened as a direct link.
- Eight routes carry a title, description, canonical and Open Graph image; `/404.html` intentionally has no canonical. All are `lang="en"` with a `skip-link` and `main[tabindex="-1"]`.
- Contact reachable from every route (navigation and footer), `mailto:stevemensah333@gmail.com` only — no Gmail compose URL, no form.

### Navigation, history, deep links

- In-site forward navigation lands at `scrollY = 0` and moves focus to `#main-content`; Back restores the previous scroll position (`y = 1400` in the recorded case).
- First load keeps document focus; the first Tab stop is the skip link.
- Cross-page deep links land at `top = 96` (the sticky-header offset) at 300 / 900 / 2000 / 4000 ms after arrival, with smooth scrolling on and with reduced motion. Section anchors: case studies `#overview #visual #problem #contribution #decisions #result #limits #sources #contact`; Lab `#lab-input … #lab-review #lab-compare #lab-code`; About `#about #experience #capabilities #evidence #contact`.
- Mobile menu (`<details>`) appears at ≤800px and the primary nav above it. Measured at 800 / 768 / 390 / 320: panel spans the viewport width exactly, six rows at 52px, zero horizontal overflow, current page marked, closes with Escape and on outside click.

### Keyboard-only walk (fresh browser, no pointer)

| Step | Result |
| --- | --- |
| Tab once | `skip-link`; Enter moves focus to `#main-content` |
| Tab to first artifact | "Open the Syncareer case study"; Enter → `/work/syncareer/`, focus `#main-content` |
| Tab to "Inspect" | Opens the image dialog, focus on "Close · Esc" |
| Tab ×6 / Shift-Tab ×3 inside dialog | **Every stop stays inside the dialog** (verified after the fix) |
| Escape | Dialog closes, focus returns to the triggering button, page scroll restored |
| `R` on `/lab/` | Scenario runs: 1 → 5 stages reached, button reads "Replay the scenario ↺" |
| `1`–`5` on `/lab/` | Jumps to a stage, sets the matching `#lab-…` hash, does not fire while typing in an input |
| Enter on "Copy email" | Clipboard write attempted, `aria-live` status reads "stevemensah333@gmail.com copied to your clipboard." |
| Open dialog → Back | Returns to the previous route, dialog is not re-opened, `overflow` lock released |
| Back → Forward | Route restored, three product frames present, no duplicate listeners |

### Images and the image dialog

- All `public/images/syncareer/*` captures exist in three widths (1440/1800/2400) as WebP and PNG; WebP files are 30–84KB. `stephen.webp` is 21,220 bytes; `stephen-176.webp` is 5,974 bytes.
- Four evidence files in `public/evidence/`, six 1200×630 social cards in `public/social/`.
- Image dialogs: image decodes (`naturalWidth > 0`), scroll is locked while open and released on close, reduced motion leaves the dialog at final opacity with no animation, and focus containment now holds.
- Evidence previews verified by opening each accordion: SAT 1520 (730 R&W / 790 Math), Dean's List January 2026 (letter body partly redacted), Queen's Commonwealth Essay Competition 2025 Gold Award (no certificate number or signature), National Sharks Quiz 2024 photo. Copies are cropped or redacted for publication; the copy says so.

### Typography and measure

- Opening heading line-height ratio, measured from computed style: **1.12 at 320px** on `/`, `/work/`, `/profile/`, `/lab/`; **1.03 at 1440px** on the same four. Before the fix, `/work/` measured 1.00 and `/profile/` 1.02 at 320px, with descenders touching the next line in crops.
- Body measure: `/profile/` about text is 432px at 14.88px ≈ **50–60 characters** a line; the case-study bodies are ~55 at 768px and ~65 at 1440px.
- Lab inspector notes were 1,222px at 13.6px ≈ **160 characters** a line; capped at `62ch`, the worst line now measures **82 characters**.
- Smallest type, measured per route: instrument labels at 9.6–9.9px, and 8.8px inside the miniature SessionBook ticket illustration, where the label is drawn as part of a scaled object rather than set as page prose. No clipped, overflowing or ellipsised text in any captured view.

### Contrast (computed style, not an audit)

Every text leaf inside `header`, `main` and `footer` on all eight routes, compared with its nearest opaque ancestor background: **0 failures** against 4.5:1 (normal text) and 3:1 (large text). This does not cover text over images or gradients, and it is not a substitute for an accessibility audit.

### Layout stability

- Horizontal overflow: **0** on all eight routes at 1440 / 1280 / 768 / 390 / 320.
- 200% text zoom: **0** overflow on `/`, `/work/`, `/lab/`, `/profile/`, `/work/syncareer/` at 1440 / 768 / 390.
- Touch targets at 390px: every button, primary link and navigation row is ≥44px tall. The four remaining undersized items on `/profile/` are inline links inside running sentences (`Syncareer`, `SessionBook`, `Koranco Farms`, `Résumé (PDF)`), which are exempt as inline text targets.
- Case-study opening at 768px now stacks the fact grid under the summary: cells 336px wide, 0 overflow.
- No infinite or idle animation: after 2.5s every animation on `/` reports `finished`, iteration 1.

### Reduced motion

All eight routes with `prefers-reduced-motion: reduce`: **0 animations**, no text left hidden, `scroll-behavior: auto`, hero and Lab content at final state on first paint. Lab keyboard jumps and anchor links still move the page (instantly) rather than relying on animation.

### Performance (lab only — see §3)

Throttled to CPU 4× and 1.6 Mbps / 750 kbps / 150 ms RTT:

| Route | FCP | LCP | CLS | Long tasks |
| --- | --- | --- | --- | --- |
| `/` | 614ms | 614ms | 0 | ≤2 |
| `/work/` | 640ms | 812ms | 0 | ≤2 |
| `/work/syncareer/` | 648ms | 648ms | 0 | ≤2 |
| `/lab/` | 499ms | 499ms | 0 | ≤2 |
| `/profile/` | 507ms | 542ms | 0 | ≤2 |

Unthrottled desktop, FCP 67–123ms, CLS 0, no long tasks.

Transfer (`content-length` sums, cache disabled):

| Route | Total | Largest items |
| --- | --- | --- |
| `/` | 213KB | Source Serif 4 49.6KB · Inter 47.1KB · opportunities capture 44.7KB · dashboard 30.7KB · portrait 20.7KB |
| `/work/` | 156KB | fonts + one capture |
| `/work/syncareer/` | 219KB | three captures |
| `/lab/` | 111KB | fonts only |
| `/profile/` | 132KB | fonts + portrait |

Fonts total 111KB across three preloaded WOFF2 subsets. The portrait re-encode and lazy-loading took the homepage from 465KB to 213KB and `/profile/` from 247KB to 132KB.

### No JavaScript

With scripting disabled: 0 hidden sections on `/`, `/work/`, `/lab/`, `/profile/`, `/work/sessionbook/`; the mobile menu still opens (native `<details>`); every project link still works; the Lab's static review panel is visible; no dialog opens on its own. The copy-email button is present but inert without JS, which is honest — the `mailto:` link next to it is the no-JS path.

### Content consistency

- Syncareer: live product; the reliability work is "revision in source, awaiting deployment"; limitations state no live-model evaluation and that replies are labelled fixtures. Consistent across homepage, archive, case study and About.
- SessionBook: implemented MVP, "no live calls verified", deployment "none evidenced", backend supported by a source repository; the empty test file is disclosed. No latency or success figures.
- Koranco: MVP delivered, no production deployment, no public screenshots or repository; module map only, six-week Innovation Lab engagement, farm website address not linked.
- No invented clients, testimonials, metrics, dates, statuses, credentials or availability. No lorem, TODO or placeholder copy in the built pages. The one phrase that scans like a placeholder — "A release still pending." — is the accurate status line for the Syncareer revision.

---

## 5. Register R01–R32

Status vocabulary: **Met** = implemented and verified in this review. **Met (gap noted)** = implemented with a known, documented limitation. **Not built (deliberate)** = the brief marks it optional and building it would have added invented content or unneeded surface.

| ID | P | Status | Where, and what was checked |
| --- | --- | --- | --- |
| R01 | P0 | **Met** | One object language — the artifact frame, plate, rule and mono-label vocabulary — on `/`, `/work/`, all three case studies, `/lab/`, `/profile/`, Contact and 404. No leftover desktop-simulator, planet or scrapbook metaphor anywhere in `src/`. |
| R02 | P0 | **Met** | Compact sticky bar: name, Work, Lab, About, Résumé, Contact. Current page marked with a dot and underline. Collapses to a `<details>` menu at ≤800px. No fixed sidebar. |
| R03 | P0 | **Met** | One token file (`global.css`) for type, colour, rule, spacing and duration; one motion file (`motion.css`) with three keyframes and two entrance utilities, and no other `@keyframes` in `src/`. Buttons, panels, labels and rules are shared components. |
| R04 | P0 | **Met** | `src/data/` records drive the archive, the homepage bench, the About rows and the case-study status fields. The release state shown in About's capability rows is the same field the archive reads. |
| R05 | P0 | **Met** | Contradictory claims reconciled: Syncareer live *and* revision awaiting deployment (separate states), SessionBook implemented with no live calls, Koranco delivered MVP with no deployment. One fact still needs the owner — see §7. |
| R06 | P1 | **Met** | At 390px the name, positioning line, "View the work", "Email me" and "Résumé" are all above the fold. On desktop a real Syncareer capture is openable without scrolling. |
| R07 | P1 | **Met** | Syncareer: three real captures, largest given the widest frame. SessionBook: a labelled booking-exchange artefact plus the booking flow. Koranco: a module map, explicitly not a screenshot. |
| R08 | P1 | **Met** | `view-transition-name: artifact-syncareer / -sessionbook / -koranco` on the archive thumbnails and on the case-study lead capture (one target each, verified). Back returns to the archive; Firefox/Safari fall back to a normal navigation. |
| R09 | P1 | **Met** | Homepage order: statement and bench → archive preview → Lab preview → experience/person → contact. Each block has a different job; no repeated section headers. |
| R10 | P1 | **Met** | Archive stacks resolve into three directly clickable rows; every entrance reports `finished` at 2.5s, so the layout is stable and links work before any animation completes. |
| R11 | P1 | **Met** | Each row shows project-specific visual, problem line, contribution, release state and the case-study link before opening. |
| R12 | P1 | **Met** | Every case study opens with product, contribution, implementation, deployment, stack and an eight-item section index, before the long-form body. |
| R13 | P1 | **Met** | Syncareer tells one before/after story and links to `/lab/` for the full investigation instead of repeating the pipeline. |
| R14 | P1 | **Met** | SessionBook has one main flow (ask → check → book → confirm) and no competing step inspectors. |
| R15 | P1 | **Met** | Koranco shows attendance, produce and employees as a conceptual map, with no implied screen captures and no deployment claim. |
| R16 | P1 | **Met** | Lab runs five steps; step 2 fails a deterministic check, step 3 shows the gate refusing with a named reason code, step 4 returns a bounded, cited proposal, step 5 hands to a human. All offline, no model call, no network request. |
| R17 | P1 | **Met** | Fixtures are labelled where they appear; the page states no model is called and no network request is made; source excerpts are marked as excerpts with file paths. |
| R18 | P1 | **Met** | About is a short bio, real experience, capabilities that link to work, and credentials kept secondary. |
| R19 | P1 | **Met** | Each role row has organisation, dates and contribution summary before expansion, plus the relevant project. |
| R20 | P1 | **Met** | Four selected achievements, each opening deliberately into a cropped/redacted public copy, with a line saying what was removed. |
| R21 | P1 | **Met** | Large invitation, readable email, copy action with `aria-live` status, `mailto:`, GitHub, LinkedIn, résumé. Reachable from every route. |
| R22 | P1 | **Met** | `cursor: pointer` only on the interactive artifact regions and controls; the hero statement and prose keep `auto`. No custom cursor over text, selection, controls or navigation. |
| R23 | P1 | **Met** | One entrance ladder (`--stagger-step`, capped), one cross-fade for route changes, one press treatment. Movement-only entrances for anything clickable. |
| R24 | P1 | **Met** | Single-column cards and routes at 320/390; no hover-only discovery (menu, rail, accordions are all tap- or keyboard-reachable); no drag, no overlap, no forced horizontal scrolling. |
| R25 | P1 | **Met** | Full keyboard walk in §4 including the dialog trap; reduced motion verified on all eight routes with 0 animations and no hidden text. |
| R26 | P1 | **Met** | Direct route loads, deep links to every section, Back/Forward with restored position, page titles for all routes; redirects preserved. |
| R27 | P1 | **Met** | No invented clients, testimonials, metrics, dates, statuses, availability, skill ratings or deployment claims. Statuses are separated per project. |
| R28 | P1 | **Met** | No clipping or horizontal overflow at five widths; CLS 0 on every measured route; no idle animation; measurements reported with their environment (§3). |
| R29 | P1 | **Met (gap noted)** | Loading ("Running…", status text), focus (`:focus-visible` rings checked in captures), selected (current nav, chosen Lab stage), unavailable (no-JS static review, copy failure message), error (404 page, gate refusal) and empty (disclosed empty test file) states all exist. The image dialog's scroll-lock and focus restoration are complete; a `loading` treatment for the largest 2400px capture inside the dialog would be the next refinement. |
| R30 | P2 | **Not built (deliberate)** | No owner-supplied interests were recorded, and the brief forbids inventing them. The portrait and the person section carry the personal note instead. |
| R31 | P2 | **Not built (deliberate)** | Three projects do not need search or a command palette; the archive shows all three at once. |
| R32 | P2 | **Not built (deliberate)** | No testimonials exist as supplied content. Nothing resembling a quote appears anywhere in the build. |

---

## 6. Route-by-route notes

| Route | Verified |
| --- | --- |
| `/` | Hero, bench (three artifacts), Lab preview, experience/person, contact. Hero at 320/390/1440 with the new leading; portrait lazy and 21KB; no overflow; reduced motion static. |
| `/work/` | Three rows with capture, problem, contribution, state. 320/768/1440 checked; archive transition resolves; no hover dependency. |
| `/work/syncareer/` | Capture set, five decision entries, result/limits/sources, eight anchors, image dialog, TOC at 320/390/768/1024/1280/1440. Tablet fact grid fixed. |
| `/work/sessionbook/` | Single flow, booking exchange artefact, honest status and limitations, source link. 390/768 checked, including the tablet fact grid fix. |
| `/work/koranco/` | Module map only, six-week context, delivered-MVP status, no implied screens. 768 checked. |
| `/lab/` | Five steps, gate refusal with named reason code, comparison, code excerpts, review matrix, static no-JS panel, keyboard `R` and `1`–`5`, reduced motion. 320/390/1440 checked; inspector measure fixed. |
| `/profile/` | Bio, experience rows, capabilities with release states, evidence accordions with redaction notes, contact. 320/390/1440 checked. |
| `/404.html` | Styled, labelled, with links back to work, About and contact. |

---

## 7. Facts that need the owner

1. **Koranco farm website address.** Not linked anywhere because it is not in the supplied record. If it exists, it belongs next to the module map.
2. **Syncareer deployment.** The reliability revision is described as source-only, awaiting deployment. If it ships, three places change together: the archive state, the case-study result, and the About capability row.
3. **SessionBook live calls.** No call has been verified, so latency and success are not shown. Any real call data would be welcome; none is implied in the meantime.
4. **Résumé currency.** The PDF matches the dates in the site. If it is revised, the experience rows and evidence dates should be re-read together.

---

## 8. Deferred optional items

Carried forward, none of them blocking the brief's acceptance condition:

- Case-study table-of-contents scroll-spy (the index links work; it does not highlight the section you are reading).
- A shared-element fallback for Firefox and Safari (the navigation is a plain page load there).
- A `loading` treatment for the largest capture inside the image dialog.
- R30–R32, as recorded in §5.
- Device-lab testing on real iOS Safari and Android Chrome, and a screen-reader pass with NVDA/VoiceOver. Both need environments this review did not have.

---

## 9. Local preview

```
npm ci
npx astro build
npx astro preview --host 0.0.0.0 --port 4331
```

Then open `http://<host>:4331/`. Routes: `/`, `/work/`, `/work/syncareer/`, `/work/sessionbook/`, `/work/koranco/`, `/lab/`, `/profile/`, plus `/about`, `/contact`, `/case-study` redirects and the styled 404. `/Stephen-Mensah-Resume.pdf` is served from `public/`.

`/_vercel/*` requests 404 in the local preview; that is the analytics script's path and not a site defect.
