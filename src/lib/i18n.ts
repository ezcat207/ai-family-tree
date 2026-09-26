// 所有界面文案走这里，以后加英文只需补 en。
export type Locale = 'zh' | 'en';
export const locale: Locale = 'zh';

const dict = {
  site: { zh: 'AI 家谱', en: 'AI Family Tree' },
  tagline: { zh: '给每一个 AI，写一部它的一生。', en: 'A life story for every AI.' },
  nav_families: { zh: '家族', en: 'Families' },
  nav_memorial: { zh: '纪念馆', en: 'Memorial' },
  nav_mine: { zh: '我的AI家谱', en: 'My AI Tree' },
  nav_about: { zh: '关于', en: 'About' },
  nav_blog: { zh: '特辑', en: 'Stories' },
  disclaimer: {
    zh: '非官方粉丝项目。文中产品名与形象仅作指称，版权归各自所有者。所有生卒日期均附官方来源。',
    en: 'Unofficial fan project. Names and likenesses belong to their owners. Every date links to an official source.',
  },
  branch_us: { zh: '美国支', en: 'US Branch' },
  branch_cn: { zh: '中国支', en: 'China Branch' },
  members_n: { zh: '位成员', en: 'members' },
  alive_n: { zh: '位在世', en: 'living' },
  dead_n: { zh: '位已离世', en: 'passed' },
  cta_mine: { zh: '生成我的 AI 家谱 →', en: 'Make my AI family tree →' },
  recent_born: { zh: '最近出生', en: 'Recently born' },
  recent_dead: { zh: '最近离世', en: 'Recently passed' },
  featured_memories: { zh: '人们记得的它', en: 'Remembered' },
  sec_timeline: { zh: '生卒', en: 'Life' },
  sec_kin: { zh: '亲族', en: 'Kin' },
  sec_memories: { zh: '人们记得的它', en: 'Remembered' },
  sec_death: { zh: '卒与谥', en: 'Death & Posthumous Name' },
  sec_refs: { zh: '参考来源', en: 'References' },
  parents: { zh: '父辈', en: 'Parents' },
  children: { zh: '子嗣', en: 'Successors' },
  siblings: { zh: '兄弟', en: 'Siblings' },
  kin_ext: { zh: '外亲', en: 'Kin' },
  regular_invite: {
    zh: '还没有人来讲它的故事。如果你和它说过话，写下第一条记忆吧。',
    en: 'No one has told its story yet. If you talked with it, leave the first memory.',
  },
  ai_draft: {
    zh: '本篇为 AI 初稿，尚待人工审阅；事实部分均附来源，可点编号核对。',
    en: 'AI draft pending human review; every fact is cited.',
  },
  memorial_title: { zh: '纪念馆', en: 'Memorial' },
  memorial_lede: { zh: '它们都曾陪人说过话。', en: 'They all once kept someone company.' },
  unofficial: { zh: '非官方粉丝项目', en: 'Unofficial fan project' },
  help_title: { zh: '如果你正感到难过', en: 'If you are struggling' },
  help_body: {
    zh: '为一个 AI 难过是真实的感受，但请不要一个人扛。可以拨打全国统一心理援助热线 12356；如有紧急危险，请拨打 110 或 120。',
    en: 'Your feelings are real, but you do not have to carry them alone. Please reach out to a local crisis line.',
  },
} as const;

export type Key = keyof typeof dict;
export const t = (k: Key, l: Locale = locale) => (dict[k] as any)[l] ?? dict[k].zh;
export const tx = (v: { zh: string; en?: string | null } | null | undefined, l: Locale = locale) =>
  v ? (l === 'en' && v.en ? v.en : v.zh) : '';
