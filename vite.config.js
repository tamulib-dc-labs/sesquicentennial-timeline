import { defineConfig } from 'vite';

// Set base to the repo/subpath name when deploying to GitHub Pages,
// e.g. base: '/aggie-timeline/'. Use '/' for Netlify / custom domains.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
});
