# Stephen Mensah — Portfolio Redesign Brief & Implementation Prompts
Reviewed 27 October 2026. Direction: an interactive engineering workbench with professional consistency.

## 1. Decision and scope
Rebuild the overall visual and interaction system, preserving substantive project content, useful routes, real assets, credentials, and verified engineering details. Adding hover animations to the existing homepage is insufficient for the desired creative ambition.

The experience should communicate: Stephen builds software, understands the systems beneath it, and has the taste to make those systems approachable. Introduce one cohesive workbench concept, rather than combining a desktop simulator, 3D planet, phone, and scrapbook.

Reference principles:
- Wilbert(https://www.wilbertboadzo.tech/): coherent styling, visible work, clear positioning, credible professional presentation.
- MyOS(https://myos.framer.website/): objects open into useful views; interactions feel like software.
- Nudge(https://nudge-folio.framer.website/): expressive art direction, deliberate type, project grouping, and recurring visual motifs.
- Foldfolio(https://foldfolio.framer.website/): one recognisable transformation and a satisfying beginning-to-end story.
- Landfall(https://landfall.framer.website/): spatial curiosity and purposeful exploration.
- Primer(https://nuanced-screenshot-385541.framer.app/): interaction and visual language reinforce the same concept.
These are conceptual references, not assets or layouts to copy.

## 2. What the final review established
Reviewed Home, Work archive, Profile, Reliability Lab, Syncareer, SessionBook, and Koranco pages. Scrolled and inspected selected tab interactions. Earlier review included phone layouts. This is a visual/content review, not a performance benchmark, security audit, repository verification, or complete accessibility audit.

### Keep and evolve
- Distinctive warm paper, ink, and copper identity; rebuild its application and hierarchy.
- Real Syncareer screenshots and its flagship position.
- Work archive's stacked artifacts separating into projects.
- Reliability Lab's inspectable pipeline and keyboard navigation.
- Experience, capabilities linked to projects, and credentials.
- Public project routes and deep links, résumé, GitHub, LinkedIn, and contact access.
- Honest distinction between live products, implemented source, delivered MVPs, and illustrative examples.

### Problems to solve
- Homepage mostly presents text and links; the strongest work is behind another click.
- Fixed dark sidebar dominates the shell and constrains the canvas.
- Home, Profile, case studies, and contact repeatedly explain the same AI reliability positioning.
- Case-study openings spend too long framing the investigation before presenting a concise contribution and outcome.
- SessionBook repeats its system through architecture, seven-stage inspector, four-step flow, question cards, and status lists.
- Small uppercase metadata, fine dividers, similar panels, and repeated numbered sections create more indexing than visual discovery.
- Contact has less visual presence than the opening.
- Lab opens with dense contract code instead of a simple, compelling result.
- Profile biography is long; experience and distinctive achievements deserve earlier exposure.
- Koranco has no public screenshots or repository, so its presentation needs a truthful conceptual artifact rather than invented product UI.
- Project status is inconsistent: Profile Backend says SessionBook routes are pending; SessionBook says HTTP routes and voice-agent configuration are implemented.
- Syncareer is labelled live, but its case study says revised prompt/citation enforcement still awaits deployment. Those are separate statuses and must stay separate.
- SessionBook presents repository implementation and explicitly states no live calls/deployment. Do not turn the redesign into a claim of a live voice demo.
- Credential images need a check for unnecessary identifiers before reusing public previews.

## 3. Complete recommendation register
Priority P0 means foundational; P1 means essential for the redesign; P2 means optional after the core experience works.

| ID | Priority | Recommendation | Acceptance condition |
| --- | --- | --- | --- |
| R01 | P0 | Establish one engineering-workbench concept | Homepage, Work, Lab, About, case studies and Contact share the same object language |
| R02 | P0 | Replace the dominant fixed sidebar with a compact navigation bar | Work, Lab, About, résumé and contact are visible; current location is clear |
| R03 | P0 | Build a shared visual system | Type, colours, spacing, icons, buttons, panels, labels and motion are consistent |
| R04 | P0 | Centralise project and experience content | Home, archive, About and case studies derive status/summary fields from shared records |
| R05 | P0 | Reconcile status conflicts against source | No contradictory implementation/deployment claims; unresolved claims are flagged for owner review |
| R06 | P1 | Create a distinctive hero with useful interactive artifacts | Identity and primary actions are readable immediately; a real project can be opened without scrolling |
| R07 | P1 | Add substantial homepage project previews | Syncareer has a prominent real capture; other projects have truthful representative artifacts |
| R08 | P1 | Use one signature object-to-project transition | Selected artifact expands into a proper case-study route; browser Back works |
| R09 | P1 | Shorten the homepage sequence | Introduction, selected work, Lab preview, experience/person, contact each have a distinct purpose |
| R10 | P1 | Evolve the archive animation | Stacked artifacts resolve into readable, directly clickable projects after a short sequence |
| R11 | P1 | Make every project understandable before opening | Problem, Stephen's role, status and project-specific visual are visible |
| R12 | P1 | Give every case study a quick overview and optional depth | Product, contribution, stack, status, known result and links appear near the opening |
| R13 | P1 | Simplify Syncareer narrative | One concise before/after account and visual system; detailed pipeline links to Lab |
| R14 | P1 | Consolidate SessionBook inspectors | One main interactive flow replaces redundant competing step sequences |
| R15 | P1 | Give Koranco a conceptual module map | Attendance, produce and employees shown without implying undocumented screens or deployment |
| R16 | P1 | Turn Lab into an approachable demonstration | A prebuilt example visibly fails a check, receives a bounded correction and returns for review |
| R17 | P1 | Preserve simulation truthfulness | Demo inputs and outputs are labelled illustrative; source excerpts and observed captures are distinct |
| R18 | P1 | Rewrite About into a concise professional profile | Brief bio, real experience and selected achievements; capabilities link to work |
| R19 | P1 | Improve experience cards | Each role has organisation, dates, contribution and relevant project; show useful summary before expansion |
| R20 | P1 | Make credentials secondary and readable | Selected achievements are concise; source documents open deliberately and unnecessary identifiers are redacted |
| R21 | P1 | Build a confident contact finale | Large invitation, readable email, copy action, mail link, GitHub, LinkedIn and résumé |
| R22 | P1 | Use context-aware cursor feedback | Small project-open treatment only over interactive visual regions; ordinary pointer for reading/forms |
| R23 | P1 | Define purposeful motion | One coordinated entrance, one shared transition, consistent hover/press feedback |
| R24 | P1 | Design phone and touch behaviour intentionally | Single-column cards and routes replace dragging, overlaps and hover-only controls |
| R25 | P1 | Build keyboard and reduced-motion equivalents | Every action works without a mouse; reduced motion presents content immediately |
| R26 | P1 | Keep content discoverable and linkable | Direct route loads, deep links, back/forward and page titles work |
| R27 | P1 | Maintain professional copy | No invented clients, testimonials, metrics, skill ratings, availability or deployment claims |
| R28 | P1 | Verify rendering and performance | No clipping, unreadable overlays, layout jumps or perpetual motion when idle; measure rather than invent results |
| R29 | P1 | Finish complete components and states | Loading, focus, selected, unavailable, error and empty states have intentional treatments |
| R30 | P2 | Add a restrained personal object | Only owner-supplied interests; no invented hobby content |
| R31 | P2 | Add a project search/command palette if scope grows | Three projects alone do not require filters or a search product |
| R32 | P2 | Consider testimonials when genuine quotes exist | Named quotes used only with supplied content and permission |

## 4. Creative direction
### Working concept
Stephen's Workbench. A precise digital workspace with editorial warmth, tangible project artifacts, and meaningful interactions. The visible site title remains Stephen Mensah; the concept name is an internal design guide.

### Palette — proposed starting tokens
Paper #F4F0E6; surface #FFFCF5; ink #171A1B; muted text #5E625F; copper #A34F2D; deep teal #194E47; rule #D4CFC3. Use copper for emphasis/actions and teal for selected system or success moments. Derive warning/error states with text and icons, not colour alone. Validate actual colour pairings and focus visibility.

### Typography
One expressive display face, one readable sans for prose, and restrained mono metadata. Maximum three families; prefer existing licensed fonts/assets or reputable web-font sources with appropriate loading. Large intentional headlines, not oversized text everywhere. Approximately 16–18px body, comfortable line length (roughly 60–75 characters), readable captions. Avoid all-monospace paragraphs and tiny low-contrast labels.

### Layout and material
Generous alignment, a stable grid, subtle depth, fine borders, a few overlapping objects in the opening. Use warm surfaces with controlled dark Lab sections. No persistent moving particles behind prose. Keep a small shared set of artifact frames, not a different decorative style for each page.

### Signature opening and transition
Introduction on one side; three composed project artifacts on the other:
1. Syncareer: real product screenshot with a clear open action.
2. SessionBook: readable request/response or availability artifact, labelled as an illustrative representation where appropriate.
3. Koranco: a conceptual three-module map, explicitly not a product screenshot.

A short entrance resolves the composition. Pointer movement can produce very slight local tilt. Selecting a project expands its artifact into the project route using a restrained shared transition. Text and navigation remain usable throughout. Deep links render their final state immediately. Normal scrolling remains native. Optional dragging is an enhancement only, with no content dependent on exact placement.

### Homepage sequence
- Hero: Stephen Mensah, software engineer, a short positioning statement, View work, Résumé, contact.
- Selected work: big Syncareer feature, smaller SessionBook and Koranco presentations with outcomes/status.
- Lab teaser: a tiny illustrative example showing an unsupported claim being caught.
- Experience/person: credible experience summaries, portrait and short human introduction, link to About.
- Contact: strong closing composition, direct email and professional links.

Suggested positioning to refine against the existing voice: “I build AI-powered products and the systems behind them.” The supporting sentence should explain the scope in ordinary language and avoid repeating the same claim in every section.

## 5. Page-by-page requirements
### Navigation and routes
Home /; Work /work/; Lab /lab/; About visible label can point to existing /profile/; Contact anchors should remain valid. Preserve /work/syncareer/, /work/sessionbook/, /work/koranco/ and relevant section hashes. If a route changes, provide redirects and maintain legacy deep links. Résumé must remain a direct real document link.

### Work
Use a short stacked-artifact sequence as an introduction and then a stable readable project layout. Do not force users through a long scroll before project access. Three projects need no elaborate filter UI. Status labels must say what they mean: live product, implemented MVP, delivered MVP.

### Syncareer
Lead with what the platform does, who it serves, Stephen's contribution and the real product preview. Summarise the context/validation problem in plain language. Show a concise old/new request-response comparison and the relevant architecture. Link to Lab for the full interactive investigation. Label fixture comparisons and deployed/source-only features clearly. Keep measurements unavailable unless verified. Do not call fixture rubric marks model-quality improvements.

### SessionBook
Lead with “Booking backend for a voice agent” or equally clear wording. A composed request/availability/confirmation artifact can supply the visual identity. Build one inspector showing caller, agent, HTTP tool, backend, booking logic and reply, grouping repeated actors where useful. A deterministic demo can illustrate two requests for one slot, but label it as a frontend simulation and do not claim database behaviour is proven by that animation. Consolidate the current eight-node map, seven-stage inspector and four-step flow. Keep repository status, absence of live calls, testing and migration limitations accurate.

### Koranco
A concise three-module operational story is appropriate. Use a conceptual workflow/map for attendance, produce and employee records based only on documented scope. No invented application dashboard, mock client analytics, public repository or adoption claims. Explain six-week Innovation Lab context and delivered MVP status, with concise limitations.

### Lab
Offer an immediately understandable prebuilt scenario and visible result; detailed code is secondary. Provide scenario controls only for rules faithfully implemented by the demo. Clicking Run should operate a deterministic local demo unless a real backend integration exists and is intentionally configured. No decorative live-AI claims. Separate two illustrative branches (unbounded example and revised bounded example); do not present an old-contract fixture as a captured output of the revised request. Keep pause/replay, keyboard stage navigation, comparison and relevant deep links.

### About
Brief bio; role and contribution-focused experience; capabilities tied to project links; selected achievements. The current SAT score, Dean's List, Commonwealth Essay award and Sharks Quiz record can remain secondary, with documents available on request/click. Avoid a courtroom/archive tone in ordinary introductions. Do not add unprovided interests, client quotes, numbers or roles.

### Contact
A deliberate final visual composition, perhaps a focused collaboration panel. Keep contact faster than exploring the concept. Use a real mailto action and copy-email with success/failure feedback; do not force visitors into Gmail. Keep external professional links and résumé. Add a form only if delivery and error handling actually work.

## 6. Motion, cursor, mobile and quality rules
- Motion timings are starting values: hover/press 120–180ms; reveal 250–450ms; shared artifact transition 450–650ms. Adjust after reviewing actual feel.
- Hover tilt should be subtle (roughly 2–3 degrees maximum) and confined to artwork, not reading surfaces.
- Custom cursor only on fine-pointer project regions, with an “Open project” or similar useful label. Never hide focus, text selection, links or form affordances.
- No scroll hijacking, forced horizontal project tunnel, mandatory loader, auto-playing audio, endless typewriter text or unrelated particle background.
- All projects are clickable before any animation completes.
- Respect reduced motion: remove parallax, tilt, drag inertia and animated spatial transitions; use immediate stable layouts.
- On mobile, use native vertical scrolling, full-width previews, comfortably sized controls (aim around 44px), a short menu, and no overlapping free-floating windows. Contact and résumé stay easy to reach.
- Use semantic headings, real links/buttons, alt text, visible focus, appropriate contrast and robust dialog focus management.
- Animations should primarily use transforms/opacity. Avoid heavy 3D dependencies unless a concrete requirement needs them; a strong 2D implementation is sufficient.
- Serve responsive images, reserve dimensions, lazy-load lower media, and keep critical text server-rendered/static where the existing stack supports it.
- Do not put confidential identifiers from credential documents in public previews.
- Check direct navigation, browser history, lightbox closing, outside-click/Escape behaviour, clipboard failure, unavailable project links and slow loading.
- Measure Lighthouse/Core Web Vitals where practical and report results with environment limitations. Scores are not proof of overall accessibility or quality.

## 7. Copy-ready implementation prompts
Use Prompt 0 once, then Prompts 1–9 in order in the same project/session. Each prompt requires implementation and checks, not merely a proposed plan. Use the existing repository and framework; do not migrate stacks or publish production by default. A public-site inspection alone does not establish source-code truth.

### Prompt 0 — Overall contract and source inventory
Act as a senior creative developer, product designer and editor. Fully redesign Stephen Mensah's existing portfolio into a distinctive interactive engineering workbench with professional consistency. Current site: https://stephen-mensah-portfolio.vercel.app/ . Read this entire brief first and use its recommendation register as the coverage checklist.

Inspect the actual repository, local instructions, framework, routing, assets and content before editing. Preserve the existing stack, real project content, source links, résumé, credentials and useful deep links. Treat live-site wording as claims to reconcile, not source verification. Create a shared content model for projects, statuses, roles and links. Identify contradictions, especially SessionBook pending routes versus implemented integration and Syncareer's live platform versus source-only reliability changes. Correct only what available evidence supports; flag unresolved facts without inventing.

Use one workbench concept. Draw conceptual lessons from Wilbert's consistency, MyOS object interaction, Nudge's expressive canvas, Foldfolio's transformation and Landfall's exploration. Do not clone their interfaces or combine every metaphor.

Implement the redesign on an isolated branch/worktree if needed. Keep a local preview and do not deploy production unless explicitly instructed. Maintain a checklist mapping R01–R32 to implementation, optional/deferred items, and checks. Continue through all requested stages. Report changed files, real validation results, and facts requiring owner clarification.

### Prompt 1 — Art direction, shell and shared components
Implement the design foundation for the agreed workbench concept. Replace the dominant fixed dark sidebar with a compact persistent navigation bar: Stephen Mensah, Work, Lab, About, Résumé and Contact. Preserve existing route paths and hashes, including /profile/ behind the About label, or supply tested redirects where necessary.

Use the brief's warm paper, ink, copper and deep-teal palette as starting tokens, validating contrast. Establish expressive display typography, readable sans body text and limited mono metadata. Build shared spacing, container widths, artifact frames, buttons, labels, links, project statuses, focus rings, dialogs, lightboxes and section layouts. Use a clear 8px-based spacing rhythm where appropriate and controlled subtle depth. Give the header a stable mobile equivalent.

Define component states and motion tokens centrally. Avoid generic repeated rounded cards, excessive metadata, unreadable labels, moving backgrounds behind prose and decorative fake terminal activity. Apply the shell across every page; do not leave inner routes in the previous design. Check desktop, tablet, phone, keyboard focus, menu operation and route highlighting.

### Prompt 2 — Homepage and signature interaction
Build the full new homepage as Stephen's interactive engineering workbench. Make the name, software-engineering positioning, View Work, Résumé and contact readable immediately. Use a concise headline such as “I build AI-powered products and the systems behind them,” refining the wording without inventing experience.

Compose three distinctive artifacts beside the introduction: a real Syncareer product capture, a SessionBook request/availability artifact, and a conceptual Koranco three-module map. Use existing assets. Clearly label representations and examples where they are not real product captures. Add a short coordinated entrance and subtle local pointer tilt. Clicking an artifact must open its existing project route through one coherent object-to-page transition. All objects must be usable immediately and without dragging. Direct route loads must render correctly without the animation.

Continue with substantial selected work, a small illustrative Lab demonstration, brief real experience/person content and a strong contact closing. Avoid repeating reliability copy in every section. Make the homepage visually surprising while preserving clear alignment, readable text and professional restraint. Deliver a distinct phone layout with static vertical artifacts and early project visibility. Implement the full page rather than stopping at the hero.

### Prompt 3 — Work archive and project navigation
Redesign /work/ using the shared workbench system. Preserve the idea of stacked screenshots/code separating into individual projects, but shorten the sequence and allow immediate direct access. Resolve the animation into a stable layout with Syncareer prominent and SessionBook and Koranco visually distinct.

Each project needs a project-specific artifact, short problem/value description, Stephen's role where supported, accurate status, stack, and clear case-study action. Avoid ornamental filters for three projects. Add local pointer feedback or a subtle “Open project” cursor on project artwork only. Keep standard links usable for keyboard, touch, middle-click, and opening in a new tab.

Match homepage-to-project transition behaviour; preserve focus/history and return context. Build phone/tablet and reduced-motion equivalents with normal vertical scrolling and readable cards. Ensure the real screenshots are legible and compositions never obscure titles/actions.

### Prompt 4 — All three case studies
Rebuild all three case-study routes with one editorial structure: quick overview, project visual, problem, contribution, key engineering decisions, result/status, limitations, source links and next project. Provide clear section navigation and optional technical depth. Use the shared visual language with project-specific artifacts rather than identical generic panels.

For Syncareer, lead with the product and user workflow. Bring real screenshots forward. Condense the CV-assistant investigation into a clear old/new contract comparison, citation/validation explanation and concise architecture; link the detailed pipeline to Lab. Preserve illustrative labels and distinguish deployed product from reliability work awaiting deployment. Do not convert fixture rubric marks into model-performance claims.

For SessionBook, lead with a voice-agent booking backend. Consolidate the eight-node architecture, seven-stage inspector and four-step flow into one coherent inspector with optional detail. If adding a two-request/one-slot demonstration, label it a local simulation and use the real documented booking rules. Preserve no-live-calls/deployment status and accurate testing/migration limitations unless new evidence establishes otherwise.

For Koranco, use the documented attendance, produce and employee scope in a clearly conceptual module map. State the six-week Innovation Lab context and delivered MVP. Do not invent screenshots, usage data, deployment or public code. Keep this case study appropriately concise.

Keep implementation claims distinct from independently tested behaviour. No invented results or credentials. Test links, section anchors, image inspection, page history and direct loads.

### Prompt 5 — Reliability Lab
Redesign /lab/ as a visually engaging, approachable engineering demonstration. Open with a prebuilt example and a short plain-English problem, not a full contract code listing. The visitor should see what fails, why it fails and what changes after a bounded correction.

Create a deterministic local scenario showing context, illustrative output, validation/refusal, revised cited proposal and human review. Keep old-contract and revised-contract branches logically distinct. Never imply that an illustrative old-model output is a captured result of a revised request. Show clear labels for fixtures, source excerpts and real captures. Expose only scenario controls whose rules the demo implements faithfully.

Use an interactive visual pipeline, Run/Replay, stage selection and before/after comparison. Put code in a secondary inspector. Preserve supported keyboard controls and existing stage deep links, with accessible focus/state announcements. No new paid API, pretend live model calls, arbitrary success metrics or unsupported evaluation claims.

On phones use vertical stages or an easy selector rather than a miniature horizontal instrument. Reduced motion must expose the same information without animation. Verify scenario states and invariants with meaningful tests. Link clearly to Syncareer's case study.

### Prompt 6 — About, experience, capabilities and credentials
Redesign the existing /profile/ page as About within the same workbench system. Rewrite the biography into a short natural introduction using only supplied facts. Give the portrait an intentional composition. Surface the actual experience: Ashesi Applied Innovation Lab, AmaliTech internship, DataCamp coordination and library work, preserving accurate titles and dates.

Show useful contribution summaries before optional expansion. Explain capabilities through real project examples and links; avoid percentage skill bars and repetitive tool lists. Resolve project status wording using shared content and available evidence.

Present SAT, Dean's List, Commonwealth Essay award and Sharks Quiz as selected achievements secondary to engineering work. Retain source-document access where appropriate; inspect previews and remove unnecessary personal identifiers from public derivatives without altering originals. Do not invent certificates, testimonials, company relationships, hobbies or outcome numbers. Add a small personal detail only if content is already supplied.

Keep page hierarchy, spacing, captions and interactions consistent with the rest of the redesign. Verify accordions/tabs, document links, anchors and phone layouts.

### Prompt 7 — Contact, copy and content consistency
Finish the global contact experience and edit the full site for professional consistency. Build a confident final composition with a large invitation, readable email, copy-email button with success/failure feedback, a real mailto link, GitHub, LinkedIn and the actual résumé. Contact must be easy to reach from all pages without exploring the interactive concept. Avoid forced Gmail compose links. Add a contact form only if real delivery and error handling are available.

Reduce repeated AI reliability language, excessive caveats and administrative phrases in introductions. Lead with the work and contribution; keep precise limitations in appropriate project sections and near affected demonstrations. Distinguish product existence, implementation status, deployment, and measured outcomes. Do not silently drop qualifications.

Centralise names, roles, dates, status fields and canonical URLs. Search for stale SessionBook pending-route text and verify the status of Syncareer's revised edge function. Audit visible screenshot/status disagreements. Use clear language for unavailable artifacts; no dead or fake actions. Add consistent next-project/footer navigation and meaningful page titles/descriptions and social previews using real assets.

### Prompt 8 — Motion, cursor, touch and accessibility
Apply a coherent motion system across the finished site: one entrance language, one artifact-to-case-study transformation, subtle project hover feedback and consistent selected/pressed states. Start with 120–180ms feedback, 250–450ms reveals and 450–650ms shared transitions, then adjust after live review. Use transform/opacity and prevent layout shifts.

Add contextual project cursor feedback only for fine pointers over interactive artwork. Keep the native cursor for text selection, controls, forms and ordinary navigation. Never require cursor effects, dragging or hover to discover essential content.

Complete phone/tablet layouts: vertical artifacts, readable project previews, no free-floating windows or pinned horizontal tunnels, generous tap targets and a useful mobile menu. Honour reduced motion by removing parallax/tilt/spatial transitions and rendering stable final states.

Check semantic headings, genuine links/buttons, accessible names, visible focus, contrast, keyboard paths, dialog trapping/restoration, Escape, browser zoom, text resizing and overflow. Screen-reader order should match the readable narrative. Ensure content is accessible before animations and when enhancement code is unavailable. Fix issues across all routes.

### Prompt 9 — Final visual and functional acceptance
Review the implemented redesign against this brief and the recommendation register. Use the real browser to navigate every route directly and through the interface, scroll top-to-bottom, open every project, run each Lab scenario, test navigation/menus/lightboxes, résumé/contact actions and browser back/forward.

Check representative widths including 390px, 768px, 1280px and 1440px, plus keyboard-only and reduced-motion operation. Verify screenshot legibility, typography hierarchy, line length, spacing, object transitions, fixed header overlap, overflow, loading/failure states and deep links. Confirm the experience feels like one intentional professional portfolio across all pages.

Run the framework build/type/lint checks and meaningful tests for changed logic. Measure page performance when tools permit; report environment and actual measurements. Check image sizing, font loading, animation cost and idle behaviour. Avoid repeated unnecessary test runs once concerns are resolved.

Compare every project status and outcome statement against available evidence; report unresolved facts. Do not fabricate benchmark scores or claim a complete accessibility audit. Deliver a local preview and a concise completion report with changed files, checks, known limitations, and deferred optional items. Do not publish production unless explicitly instructed.

## 8. Final acceptance
A visitor should be able to recognise Stephen, understand his focus, open a real project, find the résumé and contact him immediately. A curious visitor should have a coherent creative experience worth exploring. Technical detail should reward deeper inspection without obscuring the main story.

The final redesign is complete only when the same visual and interaction system covers the homepage, archive, all three case studies, Lab, About, Contact, phone layouts, reduced-motion layouts, and functional states.

