# DESIGN.md — the bench

The site is a bench: a surface with objects on it. Somebody picks a thing up, looks at it close, puts it back. That is the whole conceit, and it is the test every change has to pass.

Three rules follow.

**1. Objects have weight.** A frame overlaps another frame instead of tiling beside it. It casts a shadow. It sits at a slight angle. It lifts when it is picked up. Flat, evenly spaced boxes are what the bench is not.

**2. One gesture opens things.** Pick up, then expand. The same lift appears on the hero artifacts, the archive rows and the next-project links, and the same transition carries a frame into its case study. A second gesture is a second idea; there isn't room.

**3. Regions are places, not sections.** Paper is where you read. The dark region is the machine, and only the Lab lives there. A page that is half instrument and half document is a page that doesn't know what it is.

## Voice

Somebody explaining their work to another engineer over coffee. Specific, unhurried, occasionally dry. Confident about what was built, plain about what wasn't.

- Contractions. "I'm", "it's", "don't".
- "You" for the reader, "I" for the work.
- One idea per sentence, twenty words at most in body copy. A short sentence after a long one.
- Semicolons don't appear in body copy. Full stop instead.
- One em dash per paragraph, maximum.
- Paragraphs of one to three sentences.
- Say the concrete thing: "a booking backend for a voice agent", not "backend services with a voice integration".
- First person for my own work: "I rebuilt the contract", not "the contract was rebuilt".
- Delete anything that describes the page instead of the work.
- One hedge per project, at the end, in plain words. "No live calls yet." Honesty stays; vagueness goes.

Banned: leverage, robust, seamless, elevate, curate, delve, unlock, empower, journey, showcase, "at the intersection of", "end-to-end", "not just X but Y", rules of three where two will do, and machine nouns for page furniture — "the record", "the artifact", "the surface", "the rail", "labelled representation". Say "the screenshot", "the example", "the page".

## Type and surface

- Display: Source Serif 4, tight leading on wide screens (`--leading-display`), looser once it stacks.
- Prose: Inter, 60–75 characters a line.
- Instrument: IBM Plex Mono for ids, statuses and numbers only, never for paragraphs.
- **No text below 10.5px** on the page. Small caps labels sit at 11px and up.
- Labels mark what a reader can't infer. A label that names what is already visible is deleted.

## What this site never does

No fake terminals, logs or diagnostics. No particles. No custom cursor over text, selection or controls. No scroll hijacking, no horizontal tunnels, no mandatory loaders. No claim of a measurement that wasn't taken. No invented client, quote, metric, date or deployment. Nothing that only works with a mouse, and nothing that stops working without JavaScript.

## Decisions that are settled, so they stop coming back

Four things were raised as "should we build it" in the audit. Three are answered here and stay answered until something on the page changes enough to reopen them.

- **No scroll-spy on the case-study contents.** The nav at the top of each case study is a set of anchors; it does not highlight where you are. Highlighting means an observer per section and a second reading of the same information the eyebrow already gives you (each section states its own coordinate, "03 / Contribution"). The page is long, but it is not a document you navigate by position — you read it. Dropped for good.
- **Shared-element transitions degrade to a plain page load** in browsers that don't support them (Firefox, Safari today). That is the accepted outcome. No fallback animation, no polyfill, no second transition to maintain.
- **The image dialog shows one line, never a spinner.** "Loading the full-size capture…" appears while the full-size image is actually incomplete; if it fails, the line says so and the caption still stands. An indefinite spinner claims progress it doesn't have.
- **No personal object, no site search, no testimonials** until the content for them exists. Each of those needs something real behind it — a photograph with a story, an index worth searching, a third party willing to be quoted. A placeholder for any of them is worse than their absence.

## Two numbers

- **35+ learners** supported through the DataCamp Donates programme: confirmed, stated with the number.
- **Library patrons:** no confirmed count, so the page states no number. It describes the work instead.
