/** Shared presentation records. Source verification and unresolved facts: docs/REDESIGN.md. */
export { projectRecords } from './registry';
import { projectRecords } from './registry';
export type ProjectId = keyof typeof projectRecords;
export const experiences=[
 {id:'innovation-lab',organisation:'Ashesi Center for Entrepreneurship',role:'Software Engineer — Applied Innovation Lab',dates:'Jul — Sep 2026 · résumé; to confirm',summary:'Farm management software for attendance, produce and employee records.',detail:'The supplied portfolio describes a six-week Koranco Farms engagement and delivered MVP. Attribution and exact dates require owner confirmation.',href:'/work/koranco/',link:'Inspect Koranco'},
 {id:'amalitech',organisation:'AmaliTech',role:'Software Engineer Intern',dates:'Aug — Sep 2026 · résumé; to confirm',summary:'Backend work on a mentor–mentee matching MVP.',detail:'The résumé-derived record describes FastAPI and JWT session management in a cross-functional team. The internship date range remains unresolved.',href:null,link:null},
 {id:'datacamp',organisation:'Ashesi DataCamp Donates',role:'Program Coordinator',dates:'Nov 2025 — Nov 2026 · résumé record',summary:'Coordinate learner access to AI and data science learning resources.',detail:'The supplied résumé record describes technical upskilling support for students and community learners. Current tenure has not been independently verified.',href:null,link:null},
 {id:'library',organisation:'Ashesi University',role:'Student Library Assistant',dates:'Feb — May 2026 · résumé record',summary:'Helped patrons navigate printing, scanning and library databases.',detail:'Translated everyday technical processes into plain language.',href:null,link:null},
] as const;
