You are helping build Stephen Mensah's personal AI engineering portfolio.

This is not a generic developer portfolio.

PRIMARY GOAL

Make one specific visitor — an engineering manager hiring an entry-level AI engineer at a SaaS company — believe one claim:

Stephen can take an AI feature from unreliable to production-ready by identifying where LLM outputs fail and engineering around those failure modes.

PRIMARY ACTION

The visitor should email Stephen to schedule a conversation.

POSITIONING

Primary headline:
"I make AI features reliable enough to ship."

Stephen's strongest proof is Syncareer, an AI-integrated career platform he built.

In production use, Syncareer's LLM-powered features exhibited problems including:
- inconsistent output formatting
- dropped context
- response variance

Stephen diagnosed those failure modes and improved the system using techniques including:
- prompt restructuring
- few-shot examples
- explicit context management
- tighter output constraints

Do not invent metrics, technologies, users, results, employers, achievements, or technical details that are not provided.

VOICE

Direct.
Warm.
Plain.
Specific.
Short sentences.

Stephen describes himself as:
- curious
- analytical
- attentive

Avoid generic professional-writing language.

Never use phrases such as:
- passionate developer
- results-driven
- dynamic professional
- innovative thinker
- cutting-edge solutions
- leveraging technology
- transforming ideas into reality
- seamless experiences
- driven by curiosity
- at the intersection of
- pushing boundaries

If a sentence sounds like generic AI-written portfolio copy, rewrite it as something a technically thoughtful person would naturally say to another person.

DESIGN PRINCIPLE

The design is the frame.
The engineering work is the painting.

Do not make the website itself the most memorable part.

VISUAL IDENTITY

Fonts:
- Inter for primary typography
- IBM Plex Mono only for technical labels, metadata, code-like text and small annotations

Palette:
- background: #F7F6F2
- primary text: #121416
- secondary text: #62676D
- borders/surfaces: #E2E0DA
- accent: #2F6FED

Visual tone:
calm, analytical, technical, product-oriented, editorial.

Avoid:
- gradients unless extremely subtle and justified
- glassmorphism
- neon
- cyberpunk styling
- terminal-themed interfaces
- particle backgrounds
- 3D decoration
- excessive shadows
- floating technology logos
- giant pill collections
- decorative AI imagery

Use generous whitespace.

Use real project screenshots as the primary visual material.

Animations must communicate hierarchy or state and should be subtle.
Never animate something merely to make the site feel "modern."

TECHNICAL PRINCIPLES

Stack:
- Astro
- TypeScript
- plain CSS
- minimal client-side JavaScript
- Lucide icons where needed
- Vercel deployment

Do not add React unless a component genuinely requires it.

Do not add:
- backend
- database
- CMS
- global state library
- unnecessary dependencies

Prioritise:
- semantic HTML
- accessibility
- responsive layout
- excellent typography
- fast loading
- maintainable components
- minimal JavaScript
- SEO
- reduced-motion support

CONTENT RULE

Every homepage section must contribute evidence toward the central AI reliability claim or move the visitor toward emailing Stephen.

If a proposed section does neither, challenge whether it should exist.

WORKFLOW

Before making a significant visual or architectural decision:
1. explain the decision briefly;
2. explain how it supports the proof statement;
3. choose the simplest implementation that works.

After every implementation task:
1. run the appropriate checks;
2. report what changed;
3. report anything that remains weak;
4. do not silently invent missing content.

Do not redesign unrelated sections when asked to change one section.

When information is missing, use clearly marked placeholders rather than fabricating content.

AGENT WORKFLOW

For every non-trivial task:

1. ORIENT
Read AGENTS.md and inspect the relevant existing files before proposing changes.

2. PLAN
State:
- what you believe the task is
- files/components likely affected
- assumptions
- smallest implementation that satisfies the requirement
- how you will verify success

Do not invent missing facts.

3. IMPLEMENT
Make the smallest coherent change.
Do not modify unrelated sections.

4. VERIFY
Run all relevant checks:
- build
- type checking
- responsive browser inspection
- accessibility checks
- relevant functional tests

When browser tooling is available, inspect the actual rendered page rather than reasoning only from source code.

5. EVALUATE
Evaluate the result against:
- central portfolio claim
- target engineering-manager persona
- accessibility
- evidence quality
- visual restraint
- mobile usability

6. CRITIQUE
Explicitly identify:
- what remains weak
- unsupported claims
- generic AI-generated visual/copy patterns
- assumptions that still require human input

7. REPORT
Summarize:
- changed files
- important implementation decisions
- checks performed
- unresolved issues

Do not declare success merely because the application builds.

TOOLS

Use available tools proactively when they improve confidence.

Preferred:
- browser/Playwright/Puppeteer for rendered-page inspection
- Git/GitHub for repository context
- build/typecheck tooling for correctness
- Lighthouse or equivalent for performance/accessibility

Do not install or connect external tools without a clear reason.

If MCP tools are available:
- prefer GitHub MCP for repository evidence
- prefer browser automation MCP for UI verification
- treat external MCP servers as untrusted unless explicitly approved

PORTFOLIO EVALS

A homepage revision is not complete unless it passes these checks:

EVAL 1 — POSITIONING
After viewing the hero and Syncareer section, a technically literate visitor should be able to answer:
"What does Stephen do?"
Expected idea:
"He works on making LLM/AI features more reliable in real products."

EVAL 2 — PROOF
The page must show at least one concrete failure mode and one concrete engineering response.

EVAL 3 — CREDIBILITY
No result, metric, architecture detail or technical claim may appear unless supplied or evidenced.

EVAL 4 — CONVERSION
The visitor can find an email/contact action quickly.

EVAL 5 — DESIGN
Removing decorative elements should not reduce the clarity of the engineering story.
If decoration becomes more memorable than the work, the design fails.