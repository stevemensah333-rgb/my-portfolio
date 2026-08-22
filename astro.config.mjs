import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://stephen-mensah-portfolio.vercel.app',
  redirects: {
    '/about': '/#about',
    '/contact': '/#contact',
    '/case-study': '/work/syncareer/',
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
