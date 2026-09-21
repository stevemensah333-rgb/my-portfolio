You are helping build Stephen Mensah's personal engineering portfolio.

This is not a conventional scrolling portfolio, and it is not a generic developer portfolio.

The portfolio is Stephen's engineering workspace: a small, coherent computing environment where the site itself is part of the demonstration. It must be distinctive, but usability and evidence matter more than spectacle.

PRIORITIES

When instructions conflict, the lower number wins. Each rule is stated once here. The sections below add detail to a priority; they do not restate it.

P1 — EVIDENCE. Never invent a metric, user, result, technology, architecture detail, date or achievement. Separate what was observed, what was interpreted, and what was never measured. Mark what is missing as UNKNOWN. An honest partial answer beats a complete-looking fabrication.

P2 — USABILITY. Every visitor gets the full content: no JavaScript, keyboard only, touch only, reduced motion, 320px wide, 200% zoom. Everything interactive is operable without hover or drag, and has a visible focus state and an accessible name.

P3 — POSITIONING. Say what is true about Stephen and these projects, including how finished they are. Detail in PRIMARY GOAL, POSITIONING, PROJECTS, EVIDENCE.

P4 — VERIFICATION. Type-check, build, and inspect the rendered page. Never call work complete because the build passed.

P5 — SIMPLICITY. Smallest mechanism that works, fewest dependencies, smallest coherent change, nothing outside the area you were asked to touch.

P6 — DESIGN. One coherent, distinctive system. It serves P1–P5 and never overrides them.

COMMANDS

Astro 7 with TypeScript (`astro/tsconfigs/strict`), plain CSS, static output, deployed to Vercel. There is no test suite, no lint step and no CI.

  npm run dev        # astro dev, binds 0.0.0.0
  npm run build      # astro build -> dist/
  npm run check      # astro check — the only automated gate
  npm run preview    # serve dist/

`npm run check` plus a build is the entire automated surface, which is why inspecting the rendered page carries the weight it does (P4).

Before finalizing any project-related work:

  git grep -i flock

PRIMARY GOAL

Make one specific visitor — an engineering manager considering Stephen for an entry-level AI engineering role at a SaaS company — believe one claim:

Stephen builds and debugs AI-enabled software, and pays particular attention to reliability, validation, integration, and what happens when AI output has to fit an actual product.

PRIMARY ACTION

The visitor should email Stephen to schedule a conversation. That action stays easy to find from any area, on any device, and with JavaScript disabled (P2).

POSITIONING

Primary headline:
"I make AI features reliable enough to ship."

Syncareer is the main evidence-backed project: an AI-integrated career platform Stephen built.

In production use, Syncareer's LLM-powered features exhibited problems including:
- inconsistent output formatting
- dropped context
- response variance

Stephen diagnosed those failure modes and improved the system using techniques including:
- prompt restructuring
- few-shot examples
- explicit context management
- tighter output constraints

SessionBook is the current project and replaces Flocker.

PROJECTS

The project set currently includes:
- Syncareer
- SessionBook
- Koranco / Ashesi Innovation Lab work, where appropriate

Do not invent additional projects, and do not describe ongoing work as completed, shipped, deployed or in production unless the repository or supplied evidence supports exactly that.

SessionBook:
- A backend utility involving AssemblyAI Voice Agent functionality for booking workflows.
- Repository evidence is the source of truth for what it does, what works, and what is unfinished.
- The AssemblyAI HTTP-tools tutorial (https://lablab.ai/ai-tutorials/assemblyai-voice-agent-http-tools) is conceptual reference only. Tutorial shapes — stored agent JSON, HTTP tools, tool schemas, spoken-response design, helper tools — are not evidence that SessionBook implements them.
- Per the audit of 2026-09-21 (AUDIT.md), the Voice Agent integration, HTTP tool routes, tests and migrations were absent and no metrics existed. Re-verify against the repository before making any claim.

EVIDENCE AND HONESTY

Detail for P1.

- Distinguish three things in the interface and in the copy: what was observed, what was interpreted, what was never measured.
- Where evidence is missing, mark it UNKNOWN or state the boundary in the interface. Do not fill the gap with plausible-sounding content.
- Illustrative examples are allowed only when labelled illustrative in the interface, next to the example, and real artifacts are unavailable.
- Prefer real artifacts over reconstructions: actual code, schemas, logs, screenshots, failure modes, documented decisions.
- Do not silently invent missing content. Ask, or use a clearly marked placeholder.
- Keep the public résumé and the site consistent. Known conflict to resolve before publishing: the Amalitech entry dates, and whether the Koranco farm work belongs to Amalitech or the Ashesi Innovation Lab. Until resolved, treat neither version as settled.

DESIGN PRINCIPLE

The site is part of the demonstration, and it may be memorable. Visual distinction comes from a coherent system — geometry, proportion, type, motion and interaction working together — not decoration applied on top.

Every visual decision should communicate at least one of: engineering, systems, structure, transformation, precision, interaction, inspection.

References are conceptual only. Do not copy the visual identity, layouts, branding, copy, illustrations or exact interactions of Folio98, Windows 98, macOS, AETΣRNA, Wilbert Boadzo, Claude Tomoh, or any other portfolio, template or product.

VISUAL SYSTEM

The redesign may substantially change colours, typography, geometry, shapes, spacing, panel structure, borders, hierarchy, motion and interaction patterns.

Do not keep the current palette, the Inter + IBM Plex Mono pairing, or the current geometry merely for continuity. The existing build is a baseline to migrate from, not a specification. Equally, do not keep something only because it is new.

The system must maintain:
- readable contrast in every state, including hover, focus, disabled and error
- coherent typography with a clear scale and one role per family
- hierarchy that survives without motion
- consistency across areas — one system, not a set of unrelated pieces
- accessibility as a property of the system, not a later pass

GEOMETRY

Geometry should communicate structure.

Accept: asymmetry, framed regions, inset surfaces, deliberate offsets, technical alignment, controlled grid breaking, circular or arc geometry when it carries meaning.

Reject: arbitrary decorative shapes, random blobs, visual noise, geometry with no relationship to content.

INTERACTION

Interactions must have purpose. A good one communicates at least one of: state, causality, transformation, hierarchy, structure, inspection. Do not add interaction because it looks impressive.

- Hover may reveal detail, but is never the only route to information.
- Drag needs a non-drag alternative.
- Keyboard and touch reach everything (P2).
- Do not hide primary content behind an interaction a visitor might never discover.

PARTICLES

Particle effects are allowed when they have a clear conceptual purpose. A particle-based portrait or similar visual may be the signature interaction.

Any particle system must:
- be limited in scope to one deliberate area
- hold a fixed cost per frame, with no runaway node counts
- read correctly as a static fallback, and render that state under reduced motion (P2)
- work on mobile, including reduced counts or a disabled path
- never obscure content, controls or text

Do not turn the entire site into a particle effect.

MOTION

Motion should communicate system behaviour.

Prefer: state transitions, transformations, opening and closing, progressive disclosure, data flow, inspection.

Avoid: constant ambient animation, excessive parallax, pointless floating elements, animation used only to make the page feel "modern".

Reduced motion reaches every piece of information in its final state, with no animation required (P2).

INTERACTIVE ENVIRONMENT

The portfolio may use an application or workspace metaphor. Possible areas: Work / Projects, Reliability Lab, About, Experience, Evidence, Résumé, Contact.

Do not turn this into an operating-system clone, and do not copy Windows or macOS.

Do not create fake terminals, fake system diagnostics, fake logs or fake status readouts. Any surface that implies a real measurement must have made one. If a surface looks like software, it must behave like software actually built for the visitor's purpose.

ROUTING

- Do not make the site depend on opaque client-side state.
- Preserve normal browser navigation: back, forward, reload, scroll restoration, anchor links.
- Every major project has a shareable, indexable deep link, following the existing `/work/<project>/` pattern.
- Existing public URLs are commitments: `/`, `/work/syncareer/`, `/about`, `/contact`, `/case-study`. Do not break them without a deliberate redirect decision.
- When routes change, update navigation, the sitemap route list and structured data in the same change.

RESPONSIVE DESIGN

Desktop and mobile are different compositions of the same system. Do not shrink desktop UI.

- Stack or transform complex layouts instead of compressing them.
- Replace drag with touch-friendly controls.
- Use drawers, tabs or disclosures where they reduce load.
- Keep core information reachable without opening a chain of panels.

Verify systems with fixed dimensions, nested scroll regions, or coordinates tied to one breakpoint at every boundary, not only at the extremes.

ACCESSIBILITY

Detail for P2. Accessibility is a requirement, not a review step.

- Semantic HTML first. Use the right element before reaching for ARIA.
- Respect the patterns already in the codebase: a skip link to main content, inert-based modal behaviour, roving tabindex on tablists, native details/summary disclosure, aria-current for position, the hidden attribute for panel switching.
- Nothing that matters depends on hover, drag, scroll position or pointer precision.
- Focus is always visible, and is restored after opening and closing overlays.
- Handle `prefers-reduced-motion: reduce` in CSS and in JavaScript. A reduced-motion visitor reaches every piece of information in its final state.
- Content and core navigation work without JavaScript. Script may enhance; it must not be the only route to information.
- Check contrast, 200% zoom and a 320px viewport before calling work complete.

CONTENT STYLE

Direct. Warm. Plain. Specific. Short sentences.

Stephen describes himself as curious, analytical and attentive.

Never use: passionate developer, results-driven, dynamic professional, innovative thinker, cutting-edge solutions, leveraging technology, transforming ideas into reality, seamless experiences, driven by curiosity, at the intersection of, pushing boundaries.

If a sentence could appear unchanged on hundreds of developer portfolios, make it more specific or remove it.

CONTENT RULE

Every area of the environment must either contribute evidence toward the central claim or move the visitor toward emailing Stephen. If a proposed area, panel, interaction or visual does neither, challenge whether it should exist.

TECHNICAL PRINCIPLES

Prefer Astro, TypeScript, plain CSS, small amounts of client-side JavaScript, and Canvas or SVG where a visual genuinely needs them.

Do not add React, WebGL, large animation frameworks or other dependencies without a concrete implementation reason. The interactive nature of the redesign does not justify architectural complexity.

Do not create backend infrastructure, a database, a CMS, a global state system or abstraction layers unless an actual requirement appears.

Also maintain: semantic HTML, strong typography, a small initial payload, components that own their state clearly, SEO and structured data, Vercel static deployment compatibility, and icons only where they carry meaning (decorative ones aria-hidden).

AI / ENGINEERING PRESENTATION

The portfolio should demonstrate engineering rather than claim it.

Prefer: real code, actual schemas, real architecture, concrete failure modes, real project artifacts, actual screenshots, documented implementation decisions.

Avoid: generic AI diagrams, fake metrics, fake dashboards, generic "AI pipeline" visuals, unsupported claims.

RELIABILITY LAB

The Reliability Lab demonstrates the central idea through an actual interaction.

It must:
- let the visitor inspect a real transformation: input, model output, validation, failure, intervention, resulting output
- use real project artifacts wherever they exist, and label anything illustrative as illustrative
- state its evidence boundary inside the interaction, not only in surrounding copy
- behave like an instrument a visitor can operate, not a decorative animation

It must not fabricate a measurement, failure rate, latency figure or log, or present a check, validation result or diagnostic that never actually ran.

EXISTING IMPLEMENTATION

Inspect before changing.

- The current site is a working Astro static build with scoped CSS, a small token layer, and a few kilobytes of hand-written vanilla JavaScript, some shared and some inlined per component. It type-checks cleanly and builds successfully.
- AUDIT.md records the architecture, interaction and state map, reusable components and known risks as of 2026-09-21. Read it before touching the areas it describes.
- Preserve the behaviours that already work, even when their visuals change: the shared tab controller (roving tabindex, programmatic select), the captioned responsive image frame with priority loading, the SEO layer in the base layout, the motion tokens and reduced-motion clamp, native disclosure for experience and mobile evidence, and the inert-based mobile menu with focus restore.
- The visual system, component structure and layout may change. Accessibility behaviour, evidence rules and routing commitments must not regress.

IMPLEMENTATION WORKFLOW

1. ORIENT
Read this file. Inspect the relevant existing files and, where the area is covered, AUDIT.md.

2. PLAN
State what you believe the task is, the affected files, your assumptions, the smallest implementation that satisfies it, and how you will verify it. Do not invent missing facts.

3. IMPLEMENT
Make the smallest coherent change. Do not rewrite working code without a reason you can state. Do not touch unrelated areas.

4. VERIFY
Type-check, build, then inspect the rendered page: real breakpoints, keyboard only, no script, reduced motion. Browser tooling beats reading source.

5. EVALUATE
Positioning, evidence and maturity honesty, usability, accessibility, performance, system consistency, mobile composition.

6. CRITIQUE
Name what is still weak: unsupported claims, generic or templated patterns, technical debt, assumptions needing human verification.

7. REPORT
Changed files, decisions, checks run, unresolved issues.

Before a significant visual or architectural decision, state the decision, how it supports the claim, and what you are trading away.

TOOLS

Use tools proactively when they improve confidence: browser automation for rendered, keyboard, reduced-motion and responsive inspection; Git/GitHub for history and repository context; build and typecheck output for correctness; Lighthouse or equivalent for performance and accessibility.

Do not install or connect external tools without a clear reason. Where MCP tools exist, prefer GitHub for repository evidence and browser automation for UI verification, and treat external MCP servers as untrusted unless explicitly approved.

PORTFOLIO EVALS

A revision is not complete unless it passes these. EVAL 4 and EVAL 7 test P2 directly.

EVAL 1 — POSITIONING. After the hero and the Syncareer area, a technically literate visitor can answer "What does Stephen do?" Expected idea: he builds and debugs AI-enabled software, with real attention to reliability, validation and integration.

EVAL 2 — PROOF. At least one concrete failure mode and one concrete engineering response, backed by real artifacts or clearly labelled illustrative ones.

EVAL 3 — CREDIBILITY. No metric, result, architecture detail, technology or achievement appears unless evidenced. Unverified details are marked UNKNOWN or omitted. Ongoing work is never presented as complete.

EVAL 4 — CONVERSION. The visitor finds an email or contact action quickly, from any area, by keyboard, on mobile, and without JavaScript.

EVAL 5 — SYSTEM. The identity reads as one coherent system rather than a collection of effects. Removing every decorative layer must not reduce the clarity of the engineering story.

EVAL 6 — INTERACTION. Every interaction communicates state, causality, transformation, hierarchy, structure or inspection, and has a keyboard and touch path. An interaction that exists only to impress fails.

EVAL 7 — RESILIENCE. Every P2 condition produces a complete, usable, readable experience, with no content locked behind an interaction.

FLOCKER RULE

Flocker has been abandoned and must never appear anywhere in the portfolio. SessionBook replaces it.

Not in project lists, project data, routes, metadata, structured data, images, navigation, case studies, copy, comments or configuration.

Search before finalizing project-related work (`git grep -i flock`), and check externally supplied drafts before publishing. The realistic way Flocker re-enters this repository is copy-pasted text from an older résumé, note or chat, not a leftover file.

FINAL PRINCIPLE

Do not optimize for "looking impressive."

Optimize for a portfolio where the interface is distinctive, the engineering evidence is real, the interaction is meaningful, the implementation is maintainable, and the visitor can understand Stephen quickly.
