import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import rehypeCite from './src/lib/rehype-cite.mjs';

// 同一套代码部署两处：默认 Vercel；DEPLOY_TARGET=cloudflare 时打包成 Cloudflare Pages（国内访问用）
const onCloudflare = process.env.DEPLOY_TARGET === 'cloudflare';
// cloudflare adapter 会加载 workerd 原生二进制；Vercel 构建时不需要，懒加载避免 config 无法载入
const cloudflare = onCloudflare ? (await import('@astrojs/cloudflare')).default : null;

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
