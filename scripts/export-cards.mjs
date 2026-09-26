// 批量导出发小红书用的高清卡片（08 §15：Playwright 截图）。
// 先 `npm run dev`，再 `npm run export:cards`。输出到 out/cards/。
// BASE=https://线上地址 npm run export:cards 可以直接对线上导出。
import fs from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:4321';
const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'out/cards');
fs.mkdirSync(out, { recursive: true });
const members = fs.readdirSync(path.join(root, 'data/members'))
  .filter((f) => f.endsWith('.yaml') && !f.startsWith('._'))
  .map((f) => yaml.load(fs.readFileSync(path.join(root, 'data/members', f), 'utf8')));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });

async function grab(url, selector, file) {
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  const el = await page.$(selector);
  if (!el) return;
  // 把藏在屏幕外的卡片挪回来再截
  await page.evaluate((sel) => {
    const n = document.querySelector(sel);
    let p = n.parentElement;
    while (p && p !== document.body) { if (getComputedStyle(p).position === 'fixed') { p.style.left = '0'; p.style.zIndex = '999'; } p.style.transform = 'none'; p.style.height = 'auto'; p.style.overflow = 'visible'; p = p.parentElement; }
  }, selector);
  await page.evaluate(() => document.fonts.ready);
  await el.screenshot({ path: path.join(out, file) });
  console.log('✓', file);
}

for (const m of members) {
  if (m.tier === 'flagship') await grab(`/m/${m.id}/`, `#card-bio-${m.id}`, `bio-${m.id}.png`);
  await grab(`/m/${m.id}/`, `#card-obit-${m.id}`, `obit-${m.id}.png`);
}
await grab('/blog/bainian-gudu/', '#long-image', 'long-bainian-gudu.png');
await browser.close();
