// 把正文里的 [来源](url) 渲染成上标编号 [1]，并在文末附引用列表。
// 同一个链接多次引用时共用一个编号。
// 用法：rehypeCite({ heading: 'References' })；不传则用中文「本文引用」。
const CITE_TEXT = /^(来源|出处|source)\s*\d*$/i;

const textOf = (node) =>
  node.type === 'text' ? node.value : (node.children || []).map(textOf).join('');

const shortUrl = (href) => {
  try {
    const u = new URL(href);
    const path = decodeURIComponent(u.pathname).replace(/\/$/, '');
    const s = u.hostname.replace(/^www\./, '') + path;
    return s.length > 64 ? s.slice(0, 61) + '…' : s;
  } catch {
    return href;
  }
};

export default function rehypeCite(opts = {}) {
  const heading = opts.heading || '本文引用';
  return (tree) => {
    const urls = [];
    const visit = (node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        if (child.type === 'element' && child.tagName === 'a') {
          const href = child.properties?.href || '';
          if (/^https?:/.test(href)) {
            child.properties.target = '_blank';
            child.properties.rel = ['noopener', 'noreferrer'];
          }
          if (/^https?:/.test(href) && CITE_TEXT.test(textOf(child).trim())) {
            let n = urls.indexOf(href) + 1;
            if (!n) n = urls.push(href);
            return {
              type: 'element',
              tagName: 'sup',
              properties: { className: ['cite'] },
              children: [
                {
                  type: 'element',
                  tagName: 'a',
                  properties: { href, target: '_blank', rel: ['noopener', 'noreferrer'], title: href },
                  children: [{ type: 'text', value: `[${n}]` }],
                },
              ],
            };
          }
        }
        visit(child);
        return child;
      });
    };
    visit(tree);
    if (!urls.length) return;
    tree.children.push({
      type: 'element',
      tagName: 'section',
      properties: { className: ['cites'] },
      children: [
        { type: 'element', tagName: 'h3', properties: {}, children: [{ type: 'text', value: heading }] },
        {
          type: 'element',
          tagName: 'ol',
          properties: {},
          children: urls.map((href) => ({
            type: 'element',
            tagName: 'li',
            properties: {},
            children: [
              {
                type: 'element',
                tagName: 'a',
                properties: { href, target: '_blank', rel: ['noopener', 'noreferrer'] },
                children: [{ type: 'text', value: shortUrl(href) }],
              },
            ],
          })),
        },
      ],
    });
  };
}
