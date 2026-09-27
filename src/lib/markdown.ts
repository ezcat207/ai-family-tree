import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import rehypeCite from './rehype-cite.mjs';
import type { Locale } from './i18n';

const procs: Partial<Record<Locale, Awaited<ReturnType<typeof createMarkdownProcessor>>>> = {};

async function procFor(locale: Locale) {
  if (!procs[locale]) {
    procs[locale] = await createMarkdownProcessor({
      rehypePlugins: [[rehypeCite, { heading: locale === 'en' ? 'References' : '本文引用' }]],
    });
  }
  return procs[locale]!;
}

/** 渲染本纪正文，并拆出「卒与谥 / Death」和引用列表，好按 08 §12.3 的顺序摆放 */
export async function renderBio(body: string, locale: Locale = 'zh') {
  const proc = await procFor(locale);
  const { code } = await proc.render(body);
  let html = code;
  let cites = '';
  const ci = html.indexOf('<section class="cites">');
  if (ci >= 0) { cites = html.slice(ci); html = html.slice(0, ci); }
  let death = '';
  const deathRe = locale === 'en' ? /<h2[^>]*>\s*Death[^<]*<\/h2>/ : /<h2[^>]*>\s*卒与谥\s*<\/h2>/;
  const m = html.match(deathRe);
  if (m && m.index !== undefined) {
    const after = html.slice(m.index + m[0].length);
    const next = after.search(/<h2[\s>]/);
    death = next >= 0 ? after.slice(0, next) : after;
    html = html.slice(0, m.index) + (next >= 0 ? after.slice(next) : '');
  }
  return { main: html, death, cites };
}

export async function renderMd(body: string, locale: Locale = 'zh') {
  const proc = await procFor(locale);
  return (await proc.render(body)).code;
}
