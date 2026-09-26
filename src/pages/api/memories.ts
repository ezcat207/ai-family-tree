import type { APIRoute } from 'astro';
import { db, json, unavailable, clientIp, hash, verifyTurnstile, moderate } from '../../lib/server';
import { memberIndex } from '../../lib/ids';

export const prerender = false;

const COLS = 'id, member_id, nickname, body, period, status, created_at';

export const GET: APIRoute = async ({ url }) => {
  const q = db();
  if (!q) return unavailable();
  const member = url.searchParams.get('member');
  try {
    let items;
    if (url.searchParams.get('featured')) items = await q(`select ${COLS} from memories where status = 'featured' order by created_at desc limit 6`);
    else if (member)
      // 精选置顶，其余按时间倒序
      items = await q(`select ${COLS} from memories where member_id = ? and status in ('approved', 'featured') order by (status = 'featured') desc, created_at desc limit 200`, [member]);
    else return json({ error: 'member required' }, 400);
    return json({ items }, 200, { 'cache-control': 'public, s-maxage=60, stale-while-revalidate=300' });
  } catch {
    return json({ error: 'db', message: '读取失败' }, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  const q = db();
  if (!q) return unavailable();
  const b = await request.json().catch(() => null);
  if (!b || typeof b !== 'object') return json({ message: '格式不对' }, 400);
  if (b.website) return json({ ok: true }); // 蜜罐：机器人填了隐藏字段，假装成功
  const ids = await memberIndex();
  const member_id = String(b.member_id || '');
  if (!ids.has(member_id)) return json({ message: '没有这位成员' }, 400);
  const body = String(b.body || '').trim();
  if (body.length < 1 || body.length > 300) return json({ message: '记忆请写在 1 到 300 字之间。' }, 400);
  const nickname = String(b.nickname || '').trim().slice(0, 20) || null;
  const period = String(b.period || '').trim().slice(0, 30) || null;
  const ip = clientIp(request);
  if (!(await verifyTurnstile(b.turnstile, ip))) return json({ message: '人机验证没有通过，请刷新后再试。' }, 400);
  const ip_hash = await hash('ip', ip);
  try {
    const since = new Date(Date.now() - 3600_000).toISOString();
    const [{ n }] = await q<{ n: number }>('select count(*) as n from memories where ip_hash = ? and created_at >= ?', [ip_hash, since]);
    if (n >= 5) return json({ message: '一小时内最多提交 5 条，歇一会儿再来吧。' }, 429);
    const v = moderate([body, nickname, period].filter(Boolean).join(' '));
    await q('insert into memories (member_id, nickname, body, period, status, reject_reason, ip_hash) values (?, ?, ?, ?, ?, ?, ?)', [member_id, nickname, body, period, v.status, v.reason ?? null, ip_hash]);
    if (v.help) return json({ ok: true, help: true });
    if (v.status === 'rejected') return json({ message: '这条记忆里有链接、联系方式、个人信息或不合适的内容，没法展示。修改后可以再提交。' }, 422);
    return json({ ok: true });
  } catch {
    return json({ message: '保存失败了，请稍后再试。' }, 500);
  }
};
