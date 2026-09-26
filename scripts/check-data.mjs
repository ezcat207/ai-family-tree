// 数据校验：schema 关键字段、交叉引用、日期顺序、来源必须是官方域名；--links 时逐个打开所有链接。
// 用法：npm run check:data            （离线检查）
//       npm run check:data -- --links （再加联网检查链接）
import fs from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';

const root = path.resolve(import.meta.dirname, '..');
const dir = path.join(root, 'data/members');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.yaml') && !f.startsWith('._'));
const members = files.map((f) => ({ file: f, ...yaml.load(fs.readFileSync(path.join(dir, f), 'utf8')) }));
const ids = new Set(members.map((m) => m.id));
const errors = [], warns = [];
const OFFICIAL = /(openai\.com|anthropic\.com|claude\.com|claude\.ai|deepseek\.com|github\.com\/deepseek-ai|huggingface\.co\/(collections\/)?deepseek-ai|volcengine\.com|bytedance\.com|doubao\.com|fb\.com|meta\.com|about\.meta\.com|ai\.meta\.com|substack\.com|web\.archive\.org|seed\.bytedance\.com)/;
const d = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v));

for (const m of members) {
  const at = `${m.file}`;
  if (m.id + '.yaml' !== m.file) errors.push(`${at}: id 与文件名不一致`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(m.id)) errors.push(`${at}: id 不合规`);
  for (const k of ['parents', 'children', 'siblings']) for (const x of m[k] ?? []) if (!ids.has(x)) warns.push(`${at}: ${k} 引用了不存在的 ${x}`);
  for (const k of m.kin ?? []) if (!ids.has(k.to)) warns.push(`${at}: kin 引用了不存在的 ${k.to}`);
  const lc = m.lifecycle ?? [];
  if (!lc.some((e) => e.state === 'born')) errors.push(`${at}: 没有 born 事件`);
  for (const e of lc) {
    if (!e.source) errors.push(`${at}: ${e.state} 缺 source`);
    else if (!OFFICIAL.test(e.source)) warns.push(`${at}: ${e.state} 的来源不像官方域名：${e.source}`);
    if (/待核/.test(JSON.stringify(e))) errors.push(`${at}: lifecycle 里不能有【待核】`);
  }
  const born = d(lc.find((e) => e.state === 'born')?.date ?? '');
  for (const e of lc) if (d(e.date) < born) errors.push(`${at}: ${e.state} 早于出生`);
  if ((m.epigraph?.zh ?? '').length > 40) warns.push(`${at}: 题记超过 40 字`);
  const md = path.join(root, 'content/zh/members', m.id + '.md');
  if (!fs.existsSync(md)) warns.push(`${at}: 没有本纪正文`);
}
// 双向关系
for (const m of members) for (const c of m.children ?? []) {
  const cm = members.find((x) => x.id === c);
  if (cm && !(cm.parents ?? []).includes(m.id)) warns.push(`${m.id} → ${c}: 子嗣没把它列为父辈`);
}

// 收集所有链接
const urls = new Map();
const add = (u, where) => { if (!urls.has(u)) urls.set(u, new Set()); urls.get(u).add(where); };
for (const m of members) {
  for (const e of m.lifecycle ?? []) add(e.source, m.id);
  for (const r of m.references ?? []) add(r.url, m.id);
}
for (const sub of ['members', 'blog']) {
  const p = path.join(root, 'content/zh', sub);
  if (!fs.existsSync(p)) continue;
  for (const f of fs.readdirSync(p).filter((f) => f.endsWith('.md') && !f.startsWith('._'))) {
    const s = fs.readFileSync(path.join(p, f), 'utf8');
    for (const m of s.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) add(m[1], `${sub}/${f}`);
  }
}

console.log(`成员 ${members.length} 位，链接 ${urls.size} 个`);
warns.forEach((w) => console.log('⚠️ ', w));
errors.forEach((e) => console.log('❌', e));

if (process.argv.includes('--links')) {
  const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';
  const list = [...urls.keys()];
  const bad = [];
  let i = 0;
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (i < list.length) {
      const u = list[i++];
      try {
        const r = await fetch(u, { redirect: 'follow', headers: { 'user-agent': UA, accept: 'text/html,*/*' }, signal: AbortSignal.timeout(20000) });
        if (r.status >= 400) bad.push([r.status, u]);
      } catch (e) {
        bad.push(['ERR', u]);
      }
    }
  }));
  console.log(`\n链接检查：${list.length - bad.length}/${list.length} 可打开`);
  for (const [s, u] of bad) console.log(`  ${s}  ${u}  ← ${[...urls.get(u)].join(', ')}`);
  console.log('（403/429 多为站点屏蔽脚本访问，需人工在浏览器里确认）');
}
if (errors.length) process.exit(1);
