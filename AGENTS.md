# Stephen's Engineering Workspace — project instructions

This file is the source of truth for the finalized portfolio direction. The portfolio is **Stephen's Engineering Workspace**: an evidence-led portfolio, not a Windows or macOS clone, fake operating system, dashboard, or generic interactive portfolio.

`ARCHITECTURE.md` describes an earlier workspace concept. Do not carry forward its workspace-rail/app-shell direction or any IA or visual choice that conflicts with this file. `AUDIT.md` is a useful, read-only snapshot of the implementation audited on 2026-09-21; consult it when working in the areas it covers, but treat it as implementation history, not design authority. Verify current code before relying on audit details.

## 1. Purpose and visitor journey

The visitor journey is:

**HUMAN → WORK → INSTRUMENTATION → PROFILE → CONTACT**

The portfolio should quickly show who Stephen is, let a visitor inspect real engineering work, explain the thinking behind it, and make it easy to contact him.

- **Default audience:** an engineering manager considering Stephen for an entry-level AI engineering role at a SaaS company.
- **Positioning:** Stephen builds and debugs AI-enabled software, with particular attention to reliability, validation, integration, and how AI output behaves inside a real product. Support this with evidence; do not turn it into an unsupported outcome claim.
- **Primary action:** email Stephen to arrange a conversation. Keep email easy to find across the site, on every device, and without JavaScript.
- **Homepage:** concise. Establish identity and direction, show a strong route into the work, and avoid turning the homepage into a duplicate of the full case study or Lab.

## 2. Information architecture

The architecture is **HOME / WORK / LAB / PROFILE**. The journey's CONTACT step is served primarily by the **EMAIL** utility; **RÉSUMÉ** is the other utility. Preserve existing public URLs unless a deliberate route and redirect plan is made.

- **HOME:** identity and concise orientation.
- **WORK:** project archive and project details. Syncareer is the flagship case study.
- **LAB:** Reliability Lab, the technical inspection environment for evidence.
- **PROFILE:** About, Experience, Capabilities, and Evidence.
- **Utilities:** RÉSUMÉ and EMAIL. Do not turn Toolkit into a standalone workspace; capabilities belong in Profile.

Do not add top-level destinations merely to make the site feel more like an operating environment.

## 3. Visual direction

The governing principle is **LIGHT = INFORMATION; DARK = INSTRUMENTATION**.

Use light environments primarily for identity, project context, case-study explanation, profile, experience, and evidence. Use the dark environment primarily for Reliability Lab, technical inspection, and system behavior.

- Warm light surfaces; deep charcoal instrumentation; restrained orange for meaningful state.
- Display typography for identity, sans-serif for content and interface, monospace for system state and technical metadata. Choose typefaces for these roles; do not preserve a family pairing merely for continuity.
- Use precise, structural geometry. Asymmetry is welcome when useful; inset, offset, and framed regions should clarify structure rather than decorate it.
- Prefer a few large visual anchors to many small cards. Keep hierarchy clear without motion.
- Keep the system coherent across all areas. Contrast must remain readable in every state.

Do not copy another portfolio's identity, layout, copy, illustrations, or interaction vocabulary. The design should read as a serious engineering portfolio, not a consumer OS or product dashboard.

## 4. Interaction direction

The intended primary interaction concepts are:

1. Stephen's portrait — the hero identity element.
2. Interactive name.
3. Project cluster/pile.
4. Syncareer engineering investigation.
5. Reliability Lab.

Treat these as purposeful parts of the visitor journey, not a checklist to crowd onto the homepage. Each interaction should reveal or communicate identity, evidence, state, causality, transformation, hierarchy, structure, or inspection. Do not add interaction merely for spectacle.

Secondary interactions are disclosure, inspection, visible focus states, and subtle transitions. Keep them quiet and predictable.

Stephen's identity is the real portrait, not a 3D character or generated stand-in. The hero portrait sits in a simple interaction boundary that may later support subtle pointer-responsive depth, lighting, and hover/focus response; it remains fundamentally a real photograph — no WebGL, no Three.js, no model asset. If an interaction uses drag, provide an equivalent keyboard and touch-friendly path.

Do not add:

- fake terminals, fake diagnostics, or fabricated logs;
- global cursor gimmicks or a global particle background;
- arbitrary 3D objects or unrelated/random ML demos;
- sound by default;
- an unnecessary backend, database, global state system, or animation framework.

## 5. Syncareer: canonical case study and Reliability Lab

Syncareer is the flagship case study. It has **one canonical implementation of the full engineering investigation**; do not create parallel versions of the same narrative across the archive, case study, and Lab.

Use this case-study structure:

**01 PRODUCT → 02 FAILURE → 03 INVESTIGATION → 04 INTERVENTION → 05 RESULT**

Inside INVESTIGATION, use:

**01 INPUT → 02 MODEL OUTPUT → 03 VALIDATION → 04 FAILURE → 05 DIAGNOSIS → 06 INTERVENTION → 07 OUTPUT AFTERWARD**

The Reliability Lab is the interactive inspection environment for this evidence. It should let visitors inspect technical behavior and artifacts, not repeat the case study as a second independent narrative. Avoid repeating the same failure modes and interventions in multiple views; link to or reuse the canonical evidence rather than maintaining duplicate story content. Keep the case study's explanation readable outside the interactive Lab.

Never fabricate a test, validation result, diagnostic, log, metric, failure rate, latency, or outcome. Clearly distinguish:

- what was **observed**;
- what was **interpreted**;
- what was **not measured** or remains **UNKNOWN**.

Prefer real project artifacts—code, schemas, logs, screenshots, failure examples, and documented decisions—over reconstructions. If an illustrative example is necessary because a real artifact is unavailable, label it **illustrative** next to the example. State the evidence boundary in the relevant view, not only elsewhere on the site.

## 6. Factual accuracy and project boundaries

Never invent a user, metric, result, date, technology, architecture detail, project status, or achievement. Do not imply work is complete, shipped, deployed, or in production unless repository or supplied evidence supports that exact claim. Omit unsupported detail or mark it UNKNOWN. Keep the public résumé consistent with the site.

Known project context to re-verify against the repository before publishing claims:

- **Syncareer:** an AI-integrated career platform Stephen built. Existing project notes describe production-use problems in LLM features including inconsistent formatting, dropped context, and response variance, and interventions including prompt restructuring, few-shot examples, explicit context management, and tighter output constraints. Present only what current artifacts support; do not imply an unmeasured improvement.
- **SessionBook:** the current project, a backend utility involving AssemblyAI Voice Agent functionality for booking workflows. Repository evidence is the source of truth for what exists and what is unfinished. The AssemblyAI HTTP-tools tutorial is conceptual reference only, not evidence of implementation. The 2026-09-21 audit found no Voice Agent integration, HTTP tool routes, tests, migrations, or metrics; re-check before making any claim.
- **Koranco / Ashesi Innovation Lab:** include only where appropriate and supported. The Amalitech entry dates, and whether the Koranco farm work belongs to Amalitech or the Ashesi Innovation Lab, remain unresolved; do not present either version as settled.

Do not invent additional projects. The abandoned project replaced by SessionBook must not appear in public content, routes, metadata, images, or project lists. Before project-related work, run `git grep -i flock -- src public` and check any supplied drafts for stale references.

## 7. Accessibility, resilience, and responsive behavior

Accessibility is a design requirement, not a final polish pass.

- Use semantic HTML first. Give every control an accessible name and a visible focus state.
- All content and essential navigation must work without JavaScript. JavaScript may enhance, never gate, the core story.
- Every interaction must work by keyboard and touch; hover is never the only way to discover information. Provide a non-drag alternative wherever dragging is used.
- Respect `prefers-reduced-motion` in CSS and JavaScript. Reduced-motion visitors must reach the same information in its final state without animation.
- Preserve logical focus behavior, including focus restoration for overlays. Use established native patterns where appropriate (`details`/`summary`, buttons, links, and correct tab semantics).
- Compose deliberately for mobile; do not merely compress desktop layouts. Keep controls touch-friendly and content reachable without a chain of panels.
- Check readable contrast, keyboard operation, a 320px viewport, and 200% zoom. No essential information may be hidden behind motion, pointer precision, or an interaction a visitor may not discover.

## 8. Technical and routing constraints

The project uses Astro with strict TypeScript, plain CSS, small amounts of client-side JavaScript, and static output. Prefer the existing stack and maintain Vercel static-deployment compatibility. Verify `package.json` and the code before relying on implementation details.

Use the smallest maintainable implementation and fewest dependencies that satisfy the interaction. Do not add React, WebGL/3D tooling, large animation libraries, backend infrastructure, a database, or global state without a concrete implementation reason. The 3D avatar concept is abandoned: the human identity layer uses the real portrait. Do not reintroduce WebGL, Three.js, or model assets.

- Keep browser navigation, reloads, anchor links, and shareable project URLs working; do not make the site depend on opaque client-side state.
- Existing public URLs `/`, `/work/syncareer/`, `/about`, `/contact`, and `/case-study` are commitments. Do not break them without a deliberate redirect decision.
- Every major project needs a shareable, indexable detail URL, following the existing `/work/<project>/` pattern.
- When routes change, update navigation, the sitemap route list, and structured data in the same change.
- Keep SEO, responsive images, and a small initial payload in view. Use icons only when they carry meaning; mark decorative icons hidden from assistive technology.

## 9. Working process and verification

Before significant work:

1. **Inspect** the current implementation and relevant documentation; read `AUDIT.md` where it covers the affected area.
2. **Scope** the affected files, state assumptions, and explain the smallest coherent change. For a significant visual or architectural decision, say how it supports the portfolio's evidence and what is being traded away.
3. **Implement** only what was requested. Do not rewrite working code without a concrete reason or touch unrelated files.
4. **Verify** relevant checks. Available project commands are `npm run check`, `npm run build`, `npm run dev`, and `npm run preview`. For source/UI changes, inspect the rendered result as well as command output; check responsive behavior, keyboard access, no-JavaScript content, and reduced motion as relevant. A passing build alone does not establish completion.
5. **Critique** the result for factual support, accessibility, mobile behavior, performance, maintainability, and consistency with this direction. Name remaining weaknesses or assumptions.
6. **Report** changed files, decisions, checks run, and unresolved issues.

For a documentation-only change, verify the diff and ensure no unrequested files changed; source builds are not a substitute for that scope check.

## 10. Content and completion standard

Write directly, warmly, and specifically, with short sentences. Avoid portfolio clichés such as “passionate developer,” “results-driven,” “cutting-edge solutions,” “leveraging technology,” and generic claims that could fit hundreds of developers.

A revision is ready only when:

- a technically literate visitor can tell what Stephen builds and where to inspect evidence;
- Syncareer shows a real, bounded engineering investigation without unsupported claims or duplicate narratives;
- email is easy to find and use;
- the design reads as one restrained system, with light used for information and dark for instrumentation;
- all information remains accessible across keyboard, touch, reduced motion, narrow screens, zoom, and no-JavaScript conditions;
- the implementation remains performant, maintainable, and proportionate to the work it demonstrates.
