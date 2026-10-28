import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://stephen-mensah-portfolio.vercel.app',
  redirects: {
    '/about': '/profile/#about',
    '/contact': '/#contact',
    '/case-study': '/work/syncareer/',
    '/evidence/sat-score-report-full.jpg': '/evidence/sat-score-preview.jpg',
    '/evidence/sat-results.pdf': '/evidence/sat-score-preview.jpg',
  },
  server: {
    host: '0.0.0.0',
  },
  vite: {
    server: {
      host: '0.0.0.0',
      allowedHosts: true,
    },
    preview: {
      host: '0.0.0.0',
      allowedHosts: true,
    },
  },
});
