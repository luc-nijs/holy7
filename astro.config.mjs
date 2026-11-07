import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.theholy7.be',
  // Old Wix addresses, so existing links keep working.
  redirects: {
    '/bandmembers': '/band',
    '/copy-of-media': '/media',
    '/copy-of-film': '/media',
    '/copy-of-foto': '/media',
    '/facebook': '/media',
    '/copy-of-bretagne2023': '/bretagne2025',
  },
});
