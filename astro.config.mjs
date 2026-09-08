// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The production domain. Drives canonical URLs, Open Graph tags and sitemap.xml.
const SITE = 'https://solarusgalveston.com';

export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // The CMS dashboard must never be advertised to search engines.
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  build: {
    // One ~8KB-gzipped stylesheet was the last render-blocking round trip on
    // the phone critical path; buyers are overwhelmingly first-time visitors,
    // so inlining wins (pattern proven on the Alta Homes build).
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
