// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://semyonhartov.github.io',
  trailingSlash: 'never',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
});
