import type { APIRoute } from 'astro';
import { projects } from '../data/registry';

export const prerender = true;

const publicRoutes = ['/', ...projects.map(p => p.route)];

export const GET: APIRoute = ({ site }) => {
  const urls = publicRoutes
    .map((route) => `  <url><loc>${new URL(route, site)}</loc></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
