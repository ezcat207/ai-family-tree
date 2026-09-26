import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import cloudflare from '@astrojs/cloudflare';
import rehypeCite from './src/lib/rehype-cite.mjs';

// 同一套代码部署两处：默认 Vercel；DEPLOY_TARGET=cloudflare 时打包成 Cloudflare Pages（国内访问用）
const onCloudflare = process.env.DEPLOY_TARGET === 'cloudflare';

export default defineConfig({
  site: process.env.SITE_URL || (onCloudflare ? 'https://ai-family-tree.pages.dev' : 'https://ai-family-tree-xi.vercel.app'),
  trailingSlash: 'ignore',
  output: 'static',
  adapter: onCloudflare ? cloudflare({ imageService: 'passthrough' }) : vercel(),
  i18n: { defaultLocale: 'zh', locales: ['zh', 'en'], routing: { prefixDefaultLocale: false } },
  markdown: { rehypePlugins: [rehypeCite] },
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
