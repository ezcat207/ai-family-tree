// 我的 AI 家谱：只收匿名聚合数据（选了谁），不收任何身份信息
import type { APIRoute } from 'astro';
import { db, json, unavailable } from '../../lib/server';
import { memberIndex } from '../../lib/ids';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const q = db();
  if (!q) return unavailable();
  const b = await request.json().catch(() => null);
  const ids = await memberIndex();
  const ok = (v: unknown) => (typeof v === 'string' && ids.has(v) ? v : null);
  const first = ok(b?.first);
  if (!first) return json({ message: 'bad' }, 400);
  try {
    await q('insert into mine_stats (first, longest, missed, now, event) values (?, ?, ?, ?, ?)', [first, ok(b?.longest), ok(b?.missed), ok(b?.now), b?.event === 'share' ? 'share' : 'generate']);
  } catch {}
  return json({ ok: true });
};
