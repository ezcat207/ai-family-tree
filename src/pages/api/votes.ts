import type { APIRoute } from 'astro';
import { db, json, unavailable, clientIp, hash, moderate, type DB } from '../../lib/server';
import { memberIndex } from '../../lib/ids';

export const prerender = false;

async function tally(q: DB, member: string, candidates: string[], voter_hash?: string) {
  const rows = await q<{ candidate: string; n: number }>('select candidate, count(*) as n from votes where member_id = ? group by candidate', [member]);
  const t: Record<string, number> = Object.fromEntries(candidates.map((c) => [c, 0]));
  for (const r of rows) if (r.candidate in t) t[r.candidate] = r.n;
  let mine: string | null = null;
  if (voter_hash) mine = (await q<{ candidate: string }>('select candidate from votes where member_id = ? and voter_hash = ?', [member, voter_hash]))[0]?.candidate ?? null;
  return { tally: t, mine };
}

export const GET: APIRoute = async ({ url, request }) => {
  const q = db();
  if (!q) return unavailable();
  const member = url.searchParams.get('member') || '';
  const m = (await memberIndex()).get(member);
  if (!m || !m.candidates.length) return json({ message: '这位成员没有谥号投票' }, 404);
  const vh = await hash('vote', clientIp(request), url.searchParams.get('voter') || '');
  try { return json(await tally(q, member, m.candidates, vh)); } catch { return json({ message: '读取失败' }, 500); }
};

export const POST: APIRoute = async ({ request }) => {
  const q = db();
  if (!q) return unavailable();
  const b = await request.json().catch(() => null);
  const member = String(b?.member_id || '');
  const m = (await memberIndex()).get(member);
  if (!m || !m.candidates.length) return json({ message: '这位成员没有谥号投票' }, 404);
  if (m.result) return json({ message: '投票已经结束了' }, 409);
  const ip = clientIp(request);
  const vh = await hash('vote', ip, String(b?.voter || ''));
  const iph = await hash('ip', ip);
  try {
    if (b?.nominate) {
      const name = String(b.nominate).trim();
      if (!/^[一-鿿]{1,2}$/.test(name)) return json({ message: '谥号请用一到两个汉字。' }, 400);
      if (moderate(name).status === 'rejected') return json({ message: '这个提名没法收录。' }, 422);
      const since = new Date(Date.now() - 3600_000).toISOString();
      const [{ n }] = await q<{ n: number }>('select count(*) as n from nominations where ip_hash = ? and created_at >= ?', [iph, since]);
      if (n >= 5) return json({ message: '提名太频繁了，歇一会儿再来。' }, 429);
      await q('insert into nominations (member_id, name, ip_hash) values (?, ?, ?)', [member, name, iph]);
      return json({ ok: true });
    }
    const candidate = String(b?.candidate || '');
    if (!m.candidates.includes(candidate)) return json({ message: '没有这个候选' }, 400);
    let dup = false;
    try {
      await q('insert into votes (member_id, candidate, voter_hash) values (?, ?, ?)', [member, candidate, vh]);
    } catch (e: any) {
      if (!e.unique) throw e;
      dup = true;
    }
    const res = await tally(q, member, m.candidates, vh);
    return json(dup ? { ...res, message: '你已经投过了' } : res);
  } catch {
    return json({ message: '投票失败了，请稍后再试。' }, 500);
  }
};
