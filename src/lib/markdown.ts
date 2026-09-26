import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import rehypeCite from './rehype-cite.mjs';

let proc: Awaited<ReturnType<typeof createMarkdownProcessor>> | null = null;

/** 渲染本纪正文，并拆出「卒与谥」和「本文引用」，好按 08 §12.3 的顺序摆放 */
export async function renderBio(body: string) {
  proc ??= await createMarkdownProcessor({ rehypePlugins: [rehypeCite] });
  const { code } = await proc.render(body);
  let html = code;
  let cites = '';
  const ci = html.indexOf('<section class="cites">');
  if (ci >= 0) { cites = html.slice(ci); html = html.slice(0, ci); }
  let death = '';
  const m = html.match(/<h2[^>]*>\s*卒与谥\s*<\/h2>/);
  if (m && m.index !== undefined) {
    const after = html.slice(m.index + m[0].length);
    const next = after.search(/<h2[\s>]/);
    death = next >= 0 ? after.slice(0, next) : after;
    html = html.slice(0, m.index) + (next >= 0 ? after.slice(next) : '');
  }
  return { main: html, death, cites };
}

export async function renderMd(body: string) {
  proc ??= await createMarkdownProcessor({ rehypePlugins: [rehypeCite] });
  return (await proc.render(body)).code;
}
