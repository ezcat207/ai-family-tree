// 分享卡：DOM → PNG（html-to-image）。
// 只内嵌卡片上真正用到的字形子集（按 unicode-range 过滤），避免把整套中文字体塞进图片。
import { toPng } from 'html-to-image';

const toDataUrl = async (url: string) => {
  const blob = await (await fetch(url)).blob();
  return await new Promise<string>((res) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.readAsDataURL(blob);
  });
};

const inRanges = (range: string, cps: Set<number>) => {
  if (!range) return true;
  const parts = range.split(',').map((s) => s.trim().replace(/^U\+/i, ''));
  for (const p of parts) {
    let lo: number, hi: number;
    if (p.includes('?')) { lo = parseInt(p.replace(/\?/g, '0'), 16); hi = parseInt(p.replace(/\?/g, 'F'), 16); }
    else if (p.includes('-')) { const [a, b] = p.split('-'); lo = parseInt(a, 16); hi = parseInt(b, 16); }
    else lo = hi = parseInt(p, 16);
    for (const c of cps) if (c >= lo && c <= hi) return true;
  }
  return false;
};

async function fontCSSFor(node: HTMLElement) {
  const cps = new Set<number>();
  for (const ch of node.innerText + '0123456789.— ') cps.add(ch.codePointAt(0)!);
  const out: string[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try { rules = sheet.cssRules; } catch { continue; }
    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSFontFaceRule)) continue;
      const range = rule.style.getPropertyValue('unicode-range');
      if (!inRanges(range, cps)) continue;
      const src = rule.style.getPropertyValue('src');
      const m = src.match(/url\(["']?([^"')]+\.woff2)["']?\)/);
      if (!m) continue;
      const abs = new URL(m[1], sheet.href || location.href).href;
      try {
        const data = await toDataUrl(abs);
        const st = rule.style;
        out.push(
          `@font-face{font-family:${st.getPropertyValue('font-family')};font-style:${st.getPropertyValue('font-style') || 'normal'};font-weight:${st.getPropertyValue('font-weight') || '400'};unicode-range:${range || 'U+0-10FFFF'};src:url(${data}) format('woff2');}`,
        );
      } catch {}
    }
  }
  return out.join('\n');
}

export async function render(node: HTMLElement) {
  await document.fonts.ready;
  const fontEmbedCSS = await fontCSSFor(node);
  return toPng(node, { pixelRatio: 1, cacheBust: true, fontEmbedCSS });
}

/** 生成图片并下载；同时返回 dataURL，供手机长按保存 */
export async function snap(node: HTMLElement, filename: string) {
  const url = await render(node);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  return url;
}
