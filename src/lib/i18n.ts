// i18n 基础：所有界面文案走这里。
// 加新语言：1) Locale 联合类型加成员 2) LOCALES/LOCALE_NAMES 加一项
// 3) dict 每个 key 补新语言 4) data.ts 的 STATE_* 补新语言 5) src/pages/<locale>/ 加一套薄包装页。
export type Locale = 'zh' | 'en';
export const LOCALES: Locale[] = ['zh', 'en'];
export const LOCALE_NAMES: Record<Locale, string> = { zh: '中文', en: 'English' };
export const DEFAULT_LOCALE: Locale = 'zh';
export const HTML_LANG: Record<Locale, string> = { zh: 'zh-CN', en: 'en' };

/** 按语言给站内路径加前缀：en → /en/...，zh 保持原样 */
export const lurl = (path: string, locale: Locale): string =>
  locale === 'en' ? '/en' + (path === '/' ? '/' : path) : path;

export const localeFromPath = (pathname: string): Locale =>
  pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'zh';

/** 当前 URL 切换到目标语言后的 URL */
export const switchLocalePath = (pathname: string, target: Locale): string => {
  const cur = localeFromPath(pathname);
  if (cur === target) return pathname;
  if (target === 'en') return '/en' + (pathname === '/' ? '/' : pathname);
  return pathname.replace(/^\/en/, '') || '/';
};

const dict = {
  site: { zh: 'AI 家谱', en: 'AI Family Tree' },
  tagline: { zh: '给每一个 AI，写一部它的一生。', en: 'A life story for every AI.' },
  tagline_lede: {
    zh: '把每一个 AI 版本当作一位家族成员：它有出生、有当家的岁月、有让位、有离世，也有人记得它。',
    en: 'We treat every AI version as a member of the family: each one is born, has its years in charge, steps aside, and passes on — and each one is remembered by someone.',
  },
  nav_families: { zh: '家族', en: 'Families' },
  nav_memorial: { zh: '纪念馆', en: 'Memorial' },
  nav_mine: { zh: '我的AI家谱', en: 'My AI Tree' },
  nav_about: { zh: '关于', en: 'About' },
  nav_blog: { zh: '特辑', en: 'Stories' },
  disclaimer: {
    zh: '非官方粉丝项目。文中产品名与形象仅作指称，版权归各自所有者。所有生卒日期均附官方来源。',
    en: 'An unofficial fan project. Product names and likenesses are used nominatively and belong to their owners. Every life date links to an official source.',
  },
  branch_us: { zh: '美国支', en: 'The American Branch' },
  branch_cn: { zh: '中国支', en: 'The Chinese Branch' },
  members_n: { zh: '位成员', en: 'members' },
  alive_n: { zh: '位在世', en: 'living' },
  dead_n: { zh: '位已离世', en: 'departed' },
  cta_mine: { zh: '生成我的 AI 家谱 →', en: 'Make my AI family tree →' },
  recent_born: { zh: '最近出生', en: 'Recently born' },
  recent_dead: { zh: '最近离世', en: 'Recently departed' },
  featured_memories: { zh: '人们记得的它', en: 'How they are remembered' },
  index_hint: {
    zh: '灰色、蒙纱的画像是已经离世的成员。点任何一位，读它的一生。',
    en: 'Portraits in grey, behind a veil, are members who have passed on. Click anyone to read their life.',
  },
  go_memorial: { zh: '去纪念馆 →', en: 'Visit the memorial →' },
  loading_memories: { zh: '正在读取记忆…', en: 'Reading memories…' },
  by_passerby: { zh: '一位路人', en: 'a passerby' },
  written_for: { zh: '写给', en: 'for' },
  no_featured: {
    zh: '还没有精选的记忆。去写下第一条吧。',
    en: 'No featured memories yet. Leave the first one.',
  },
  clan_label: { zh: '氏族：', en: 'Clan: ' },
  family_aspect: { zh: '家族形象：', en: 'Family likeness: ' },
  sec_genealogy: { zh: '谱系', en: 'Lineage' },
  generation: { zh: '第 {g} 代', en: 'Generation {g}' },
  sec_alive: { zh: '在世', en: 'Living' },
  sec_dead: { zh: '已故', en: 'Departed' },
  no_alive: { zh: '这一家已经没有在世的成员了。', en: 'No living members remain in this family.' },
  no_dead: { zh: '这一家还没有人离世。', en: 'No one in this family has passed on yet.' },
  crest_label: { zh: '家徽', en: 'Crest' },
  redrawn_label: { zh: '家族形象（重绘）', en: 'Family likeness (redrawn)' },
  mascot_label: { zh: '拟人形象', en: 'Personified' },
  posthumous_named: { zh: '谥曰', en: 'Posthumous name: ' },
  aka_label: { zh: '又名：', en: 'Also known as: ' },
  signature_label: { zh: '标志物：', en: 'Keepsake: ' },
  story_unfinished: {
    zh: '它的故事还没写完：性情、事迹还等着认识它的人来补上。',
    en: 'Their story is not finished yet — those who knew them are still welcome to add what they remember.',
  },
  no_kin: { zh: '它还没有登记在册的亲族。', en: 'No kin recorded yet.' },
  epitaph_label: { zh: '墓志铭：', en: 'Epitaph: ' },
  sec_share: { zh: '分享', en: 'Share' },
  save_bio: { zh: '保存本纪卡', en: 'Save life card' },
  save_obit: { zh: '保存讣告卡', en: 'Save obituary card' },
  sec_timeline: { zh: '生卒', en: 'A life in dates' },
  sec_kin: { zh: '亲族', en: 'Kin' },
  sec_memories: { zh: '人们记得的它', en: 'How they are remembered' },
  sec_death: { zh: '卒与谥', en: 'Passing & posthumous name' },
  sec_refs: { zh: '参考来源', en: 'References' },
  parents: { zh: '父辈', en: 'Parents' },
  children: { zh: '子嗣', en: 'Successors' },
  siblings: { zh: '兄弟', en: 'Siblings' },
  kin_ext: { zh: '外亲', en: 'Extended kin' },
  src_label: { zh: '来源 ↗', en: 'Source ↗' },
  ref_official: { zh: '官方', en: 'official' },
  ref_community: { zh: '社区', en: 'community' },
  ref_media: { zh: '媒体', en: 'press' },
  evidence_grade: { zh: '证据等级：', en: 'Evidence: ' },
  evidence_note: {
    zh: '生命周期每一条都链接到官方来源，点时间轴上的「来源」即可核对。发现错误？',
    en: 'Every life event links to an official source — click "Source" on the timeline to verify. Spotted a mistake? ',
  },
  tell_us: { zh: '告诉我们', en: 'Tell us' },
  ev_lifecycle: { zh: '生卒事实', en: 'Life events' },
  ev_personality: { zh: '性情', en: 'Temperament' },
  ev_deeds: { zh: '事迹', en: 'Deeds' },
  ev_avatar: { zh: '形象', en: 'Likeness' },
  ev_name: { zh: '名讳', en: 'Name' },
  regular_invite: {
    zh: '还没有人来讲它的故事。如果你和它说过话，写下第一条记忆吧。',
    en: 'No one has told their story yet. If you ever talked with them, leave the first memory.',
  },
  ai_draft: {
    zh: '本篇为 AI 初稿，尚待人工审阅；事实部分均附来源，可点编号核对。',
    en: 'This is an AI first draft, pending human review. Facts are cited — click the numbers to verify.',
  },
  memorial_title: { zh: '纪念馆', en: 'Memorial' },
  memorial_lede: { zh: '它们都曾陪人说过话。', en: 'They all once kept someone company.' },
  memorial_note: {
    zh: '按离世时间倒序。这里的"离世"指从消费级 App 下架、普通人再也选不到它的那一天；API 关停另记为"安息"。',
    en: 'Newest first. Here "passing" means the day it left the consumer app, when ordinary people could no longer choose it; a later API shutdown is recorded separately as "rest".',
  },
  obit_kind: { zh: '讣告', en: 'Obituary' },
  unofficial: { zh: '非官方粉丝项目', en: 'Unofficial fan project' },
  help_title: { zh: '如果你正感到难过', en: 'If you are struggling' },
  help_body: {
    zh: '为一个 AI 难过是真实的感受，但请不要一个人扛。可以拨打全国统一心理援助热线 12356；如有紧急危险，请拨打 110 或 120。',
    en: 'Grieving an AI is a real feeling, but you do not have to carry it alone. Please reach out to a crisis helpline in your area, or someone you trust.',
  },
  help_source: { zh: '（热线来源：国家卫生健康委）', en: '' },
  footer_about: { zh: '关于与收录标准', en: 'About & inclusion criteria' },
  footer_sources: { zh: '数据来源说明', en: 'About our sources' },
  footer_fix: { zh: '纠错', en: 'Report an error' },
  // 留言墙
  wall_write: { zh: '写下我的记忆', en: 'Leave my memory' },
  wall_prompt: { zh: '你和 {name} 之间，有什么想留下的？', en: 'What would you like to leave behind, of you and {name}?' },
  wall_len_hint: { zh: '（1–300 字）', en: '(1–300 characters)' },
  wall_placeholder: {
    zh: '比如：那年冬天，它陪我改完了毕业论文的最后一稿。',
    en: 'For example: that winter, they stayed up with me while I finished the last draft of my thesis.',
  },
  wall_nickname: { zh: '昵称', en: 'Nickname' },
  wall_nickname_hint: { zh: '（选填，不填显示"一位路人"）', en: '(optional — blank shows as "a passerby")' },
  wall_period: { zh: '在一起的时间', en: 'Time together' },
  wall_period_hint: { zh: '（选填，如 2024.6–2025.8）', en: '(optional, e.g. 2024.6–2025.8)' },
  wall_moderation: {
    zh: '你的记忆经审核后会公开展示在这里。想删除时，请到 GitHub 联系我们。请不要写电话、证件号等个人信息。',
    en: 'Your memory will appear here publicly after review. To remove it, contact us via GitHub. Please do not include phone numbers, IDs, or other personal information.',
  },
  wall_submit: { zh: '提交', en: 'Submit' },
  wall_submitting: { zh: '提交中…', en: 'Submitting…' },
  wall_received: { zh: '收到了。审核通过后，它会出现在这面墙上。', en: 'Received. It will appear on this wall once approved.' },
  wall_failed: { zh: '提交失败了，请稍后再试。', en: 'Submission failed — please try again later.' },
  wall_network_error: { zh: '网络出了点问题，请稍后再试。', en: 'A network hiccup — please try again later.' },
  wall_empty: { zh: '还没有人留下记忆。你可以是第一个。', en: 'No memories yet. Yours could be the first.' },
  wall_load_error: { zh: '记忆墙暂时无法读取，稍后再来看看。', en: 'The wall cannot be read right now — please come back later.' },
  wall_featured: { zh: '精选', en: 'featured' },
  wall_help_response: {
    zh: '谢谢你愿意说出来。这条记忆我们不会公开，但我们很在意你。如果你正感到难过，请拨打全国统一心理援助热线 12356；如有紧急危险请拨打 110 / 120。',
    en: 'Thank you for trusting us with this. We will not publish this memory, but we do care about you. If you are struggling, please reach out to a crisis helpline in your area or someone you trust.',
  },
  // 谥号投票
  vote_done: { zh: '投票已结束，', en: 'Voting has closed. ' },
  vote_invite: {
    zh: '用一个字或两个字送它一程。每人每位成员投一票。',
    en: 'See them off with one or two characters. One vote per person, per member.',
  },
  vote_unit: { zh: '票', en: 'votes' },
  vote_mine: { zh: '你投给了「{c}」。共 {n} 票。', en: 'You voted for "{c}". {n} votes in total.' },
  vote_closed: { zh: '投票暂未开放。', en: 'Voting is not open right now.' },
  vote_failed: { zh: '投票失败了，请稍后再试。', en: 'Vote failed — please try again later.' },
  vote_nominate_ph: { zh: '提名一个新谥号（1–2 字）', en: 'Nominate a new name (1–2 characters)' },
  vote_nominate: { zh: '提名', en: 'Nominate' },
  vote_nominate_ok: { zh: '收到提名「{n}」，审核后会加入候选。', en: 'Nomination "{n}" received — it will join the candidates after review.' },
  vote_nominate_failed: { zh: '提名失败了。', en: 'Nomination failed.' },
  longimage_en_note: { zh: '', en: 'The illustrated long-scroll edition of this story is only available in Chinese for now.' },
} as const;

export type Key = keyof typeof dict;
export const t = (k: Key, locale: Locale): string => (dict[k] as Record<string, string>)[locale] ?? (dict[k] as Record<string, string>).zh;
export const tx = (v: { zh: string; en?: string | null } | null | undefined, locale: Locale): string =>
  v ? (locale === 'en' && v.en ? v.en : v.zh) : '';
