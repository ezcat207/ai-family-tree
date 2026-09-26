// 开发用：给页面截图。node scripts/shot.mjs <path> <out.png> [width] [fullPage]
import { chromium } from 'playwright';
const [, , path = '/', out = 'shot.png', width = '1200', full = '1'] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +width, height: 900 }, deviceScaleFactor: 1 });
await p.goto((process.env.BASE || 'http://localhost:4399') + path, { waitUntil: 'networkidle' });
await p.waitForTimeout(500);
await p.screenshot({ path: out, fullPage: full === '1' });
await b.close();
