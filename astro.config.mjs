import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import rehypeCite from './src/lib/rehype-cite.mjs';

export default defineConfig({
  site: process.env.SITE_URL || 'https://ai-family-tree.vercel.app',
  trailingSlash: 'ignore',
  output: 'static',
  adapter: vercel(),
  i18n: { defaultLocale: 'zh', locales: ['zh', 'en'], routing: { prefixDefaultLocale: false } },
  markdown: { rehypePlugins: [rehypeCite] },
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
