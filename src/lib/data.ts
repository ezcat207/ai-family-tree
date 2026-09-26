import { getCollection, type CollectionEntry } from 'astro:content';

export type Member = CollectionEntry<'members'>['data'];
export type Family = CollectionEntry<'families'>['data'];
export type Clan = CollectionEntry<'clans'>['data'];
export type LifeEvent = Member['lifecycle'][number];

export const STATE_LABEL: Record<LifeEvent['state'], string> = {
  born: '出生',
  head: '当家',
  yielded: '让位',
  notice: '病危通知',
  died: '离世',
  'api-only': '魂在 API',
  rest: '安息',
  preserved: '遗体保存',
  afterlife: '退而不休',
  revived: '复活',
};

export const STATE_GLOSS: Record<LifeEvent['state'], string> = {
  born: '首次公开发布',
  head: '成为 App 的默认模型',
  yielded: '默认位置被接替，但还能选到它',
  notice: '官方宣布弃用或退役日期',
  died: '从消费级 App 下架，普通人再也见不到它',
  'api-only': '下架后 API 仍然可用',
  rest: 'API 也关停了',
  preserved: '官方承诺保留权重',
  afterlife: '退役后仍以特殊形式存在',
  revived: '下架之后又被恢复',
};

const byDate = (a: LifeEvent, b: LifeEvent) => a.date.localeCompare(b.date);

export function events(m: Member) {
  return [...m.lifecycle].sort(byDate);
}

export function bornDate(m: Member) {
  return events(m).find((e) => e.state === 'born')?.date ?? events(m)[0].date;
}

/** 当前状态：按事件顺序推演（08 §6.2：状态可叠加） */
export function status(m: Member) {
  let dead = false, diedOn: string | null = null, head = false, notice = false;
  let apiOnly = false, rest = false, preserved = false, afterlife = false, restOn: string | null = null;
  for (const e of events(m)) {
    switch (e.state) {
      case 'head': head = true; break;
      case 'yielded': head = false; break;
      case 'notice': notice = true; break;
      case 'died': dead = true; diedOn = e.date; head = false; notice = false; break;
      case 'revived': dead = false; diedOn = null; break;
      case 'api-only': apiOnly = true; break;
      case 'rest': rest = true; restOn = e.date; apiOnly = false; break;
      case 'preserved': preserved = true; break;
      case 'afterlife': afterlife = true; break;
    }
  }
  // 找不到 App 下架的官方日期时，以 API 关停（安息）为卒日：API 都关了，App 里自然也见不到它了
  if (!dead && rest) { dead = true; diedOn = restOn; head = false; notice = false; }
  const label = dead
    ? afterlife ? '退而不休' : rest ? '安息' : apiOnly ? '魂在 API' : '已离世'
    : notice ? '病危' : head ? '当家' : '在世';
  return { dead, diedOn, head, notice, apiOnly, rest, preserved, afterlife, label };
}

/** 2024-05-13 → 2024.5.13；2024-05 → 2024.5 */
export function fmt(d: string) {
  const [y, m, dd] = d.split('-');
  return [y, String(+m), dd ? String(+dd) : null].filter(Boolean).join('.');
}

export function lifespan(m: Member) {
  const s = status(m);
  return `${fmt(bornDate(m))} — ${s.dead && s.diedOn ? fmt(s.diedOn) : ''}`.trim();
}

export async function loadAll() {
  const members = (await getCollection('members')).map((e) => e.data);
  const families = (await getCollection('families')).map((e) => e.data).sort((a, b) => a.order - b.order);
  const clans = (await getCollection('clans')).map((e) => e.data);
  const bios = await getCollection('bios');
  const byId = new Map(members.map((m) => [m.id, m]));
  const famById = new Map(families.map((f) => [f.id, f]));
  const clanById = new Map(clans.map((c) => [c.id, c]));
  const familyMembers = (fid: string) =>
    members.filter((m) => m.family === fid).sort((a, b) => a.gen - b.gen || bornDate(a).localeCompare(bornDate(b)));
  return { members, families, clans, bios, byId, famById, clanById, familyMembers };
}

/** 本成员用到的全部链接：yaml references + 生命周期来源，去重 */
export function allRefs(m: Member) {
  const seen = new Map<string, { title: string; url: string; publisher?: string | null; kind: string }>();
  for (const r of m.references ?? []) seen.set(r.url, r);
  for (const e of events(m)) {
    if (!seen.has(e.source)) {
      let host = e.source;
      try { host = new URL(e.source).hostname.replace(/^www\./, ''); } catch {}
      seen.set(e.source, { title: `${STATE_LABEL[e.state]} · ${fmt(e.date)}`, url: e.source, publisher: host, kind: 'official' });
    }
  }
  return [...seen.values()];
}
