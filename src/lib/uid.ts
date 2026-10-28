/**
 * Render-scoped id source.
 *
 * A component's frontmatter runs once per instance, so a counter declared
 * there resets to zero on every render. This module is evaluated once per
 * build (and once per dev server process), which makes it the right place
 * for ids that only have to be unique within one rendered page.
 *
 * Used by ProjectArtifact for `aria-labelledby`, where the id has to
 * survive being printed inside the same element that references it.
 */

let counter = 0;

export const nextId = (prefix: string): string => `${prefix}-${++counter}`;
