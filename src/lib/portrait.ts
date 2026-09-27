// 家族画像：优先使用各家族的真实商标（public/avatars/family-<id>.svg），
// 程序化画像（家族基因 + 世代变体）作为兜底（08 §8）。
// 输出纯 SVG 字符串，网页、分享卡、批量导出共用一套。
// 商标为指称性使用（nominative use），来源见 public/avatars/CREDITS.md。

export type Variant = {
  age?: 'child' | 'young' | 'elder';
  detail?: number;
  prop?: string;
  mood?: 'calm' | 'smile' | 'sleepy' | 'curious';
  eye?: string | null;
};

export type PortraitOpts = {
  family: string;
  variant: Variant;
  color: string;
  dead?: boolean;
  uid: string;
  frame?: boolean;
};

const PAPER = '#F2EBDD';
const GOLD = '#B08A45';
const GOLD_DARK = '#8A6A2F';
const INK = '#22201C';
const CINNABAR = '#B8322A';
const BUTTERFLY = '#E3B23C';

const AGE_SCALE = { child: 0.72, young: 0.86, elder: 1 } as const;

const scaleAt = (s: number, body: string) =>
  `<g transform="translate(100 200) scale(${s}) translate(-100 -200)">${body}</g>`;

/* ---------- 通用小道具 ---------- */
const book = (x: number, y: number, c = '#7A2E22') =>
  `<g transform="translate(${x} ${y}) rotate(-8)"><rect x="-18" y="-13" width="36" height="26" rx="2" fill="${c}"/><rect x="-15" y="-10" width="30" height="20" fill="#F7F1E3"/><line x1="0" y1="-10" x2="0" y2="10" stroke="${c}" stroke-width="2"/><path d="M-11 -4h8M-11 1h8M3 -4h8M3 1h8" stroke="#9A8F7C" stroke-width="1.2"/></g>`;
const lantern = (x: number, y: number) =>
  `<g transform="translate(${x} ${y})"><line x1="0" y1="-26" x2="0" y2="-16" stroke="${INK}" stroke-width="2"/><rect x="-11" y="-16" width="22" height="30" rx="5" fill="#F4C66A" stroke="${GOLD_DARK}" stroke-width="2"/><circle cx="0" cy="-1" r="6" fill="#FFF3C4"/><rect x="-13" y="13" width="26" height="4" fill="${GOLD_DARK}"/></g>`;
const quill = (x: number, y: number) =>
  `<g transform="translate(${x} ${y}) rotate(25)"><path d="M0 0 C 6 -18, 14 -34, 4 -52 C -6 -34, -6 -16, 0 0Z" fill="#F7F1E3" stroke="#9A8F7C" stroke-width="1.5"/><line x1="0" y1="4" x2="2" y2="-46" stroke="#9A8F7C" stroke-width="1.2"/></g>`;
const scroll = (x: number, y: number) =>
  `<g transform="translate(${x} ${y}) rotate(-6)"><rect x="-22" y="-10" width="44" height="20" fill="#EAD9B0" stroke="#9A7B45" stroke-width="1.5"/><rect x="-26" y="-12" width="6" height="24" rx="3" fill="#9A7B45"/><rect x="20" y="-12" width="6" height="24" rx="3" fill="#9A7B45"/><path d="M-16 -3h30M-16 3h24" stroke="#9A8F7C" stroke-width="1.2"/></g>`;
const keys = (x: number, y: number) =>
  `<g transform="translate(${x} ${y})" fill="none" stroke="${GOLD_DARK}" stroke-width="2.5"><circle r="7"/><path d="M4 6 l6 14 m-3 -5 h4 m-2 5 h4"/><path d="M-5 5 l-4 15 m1 -5 h-4"/></g>`;
const lamp = (x: number, y: number) =>
  `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="8" rx="16" ry="5" fill="${GOLD_DARK}"/><path d="M-12 6 Q0 -14 12 6Z" fill="${GOLD}"/><path d="M0 -8 C -5 -16, 0 -24, 0 -28 C 1 -24, 6 -16, 0 -8Z" fill="#F5A623"/></g>`;
const phone = (x: number, y: number) =>
  `<g transform="translate(${x} ${y}) rotate(10)"><rect x="-9" y="-16" width="18" height="32" rx="3" fill="${INK}"/><rect x="-7" y="-12" width="14" height="22" fill="#9EC5E8"/></g>`;
const riceBowl = (x: number, y: number) =>
  `<g transform="translate(${x} ${y})"><path d="M-22 -4 Q0 -22 22 -4Z" fill="#FFFFFF" stroke="#DDD" stroke-width="1"/><circle cx="-8" cy="-9" r="1.2" fill="#DDD"/><circle cx="5" cy="-12" r="1.2" fill="#DDD"/><path d="M-26 -4 H26 Q22 16 0 18 Q-22 16 -26 -4Z" fill="#F7F1E3" stroke="#3E6FB0" stroke-width="2"/><path d="M-18 4 H18" stroke="#3E6FB0" stroke-width="1.5" stroke-dasharray="3 3"/></g>`;
const abacus = (x: number, y: number) => {
  let beads = '';
  for (let r = 0; r < 3; r++)
    for (let b = 0; b < 4; b++)
      beads += `<ellipse cx="${-14 + b * 6 + (r % 2) * 5}" cy="${-8 + r * 8}" rx="3" ry="2.6" fill="#8A4B2A"/>`;
  return `<g transform="translate(${x} ${y})"><rect x="-24" y="-16" width="48" height="32" rx="2" fill="none" stroke="#5A3A1E" stroke-width="3"/><path d="M-22 -8H22M-22 0H22M-22 8H22" stroke="#5A3A1E" stroke-width="1"/>${beads}</g>`;
};

const butterfly = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s}) rotate(-18)"><ellipse cx="-7" cy="-5" rx="8" ry="6" fill="${BUTTERFLY}" transform="rotate(-25 -7 -5)"/><ellipse cx="7" cy="-5" rx="8" ry="6" fill="${BUTTERFLY}" transform="rotate(25 7 -5)"/><ellipse cx="-5" cy="5" rx="5" ry="4" fill="#D69E26" transform="rotate(20 -5 5)"/><ellipse cx="5" cy="5" rx="5" ry="4" fill="#D69E26" transform="rotate(-20 5 5)"/><rect x="-1" y="-9" width="2" height="18" rx="1" fill="${INK}"/><path d="M0 -9 l-4 -6 M0 -9 l4 -6" stroke="${INK}" stroke-width="1" fill="none"/></g>`;

/* ---------- ChatGPT：全黑剪影，白眼白嘴 ---------- */
function chatgpt(v: Required<Variant>) {
  const eye = v.eye || '#FFFFFF';
  const k = '#141414';
  const glow = `<ellipse cx="100" cy="95" rx="80" ry="80" fill="${v.eye || '#FFF6DA'}" opacity="${0.06 + v.detail * 0.05}"/>`;
  const body = `<path d="M26 206 Q28 142 100 134 Q172 142 174 206Z" fill="${k}"/><rect x="88" y="120" width="24" height="22" fill="${k}"/><ellipse cx="100" cy="92" rx="42" ry="47" fill="${k}"/><path d="M70 60 Q84 38 100 44 Q112 34 128 52 Q118 50 110 56 Q100 46 90 56 Q80 52 70 60Z" fill="${k}"/>`;
  let eyes = '';
  const L = [84, 88], R = [116, 88];
  if (v.mood === 'sleepy')
    eyes = `<path d="M75 90 Q84 84 93 90" stroke="${eye}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M107 90 Q116 84 125 90" stroke="${eye}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  else {
    const rr = v.mood === 'curious' ? 13 : 11;
    eyes = `<ellipse cx="${L[0]}" cy="${L[1]}" rx="9" ry="11" fill="${eye}"/><ellipse cx="${R[0]}" cy="${R[1]}" rx="${rr - 2}" ry="${rr}" fill="${eye}"/>`;
  }
  const mouth =
    v.mood === 'smile'
      ? `<path d="M80 111 Q100 132 120 111 Q100 122 80 111Z" fill="#FFFFFF"/>`
      : `<path d="M88 114 Q100 122 112 114" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const props: Record<string, string> = {
    bowtie: `<path d="M100 146 L82 136 L82 156Z M100 146 L118 136 L118 156Z" fill="${CINNABAR}"/><circle cx="100" cy="146" r="4" fill="#8E221C"/>`,
    glasses: `<g fill="none" stroke="#FFFFFF" stroke-width="2.5"><circle cx="84" cy="88" r="15"/><circle cx="116" cy="88" r="15"/><path d="M99 88h2"/></g>`,
    hat: `<rect x="62" y="52" width="76" height="8" rx="2" fill="${k}"/><rect x="72" y="14" width="56" height="42" rx="3" fill="${k}"/><rect x="72" y="44" width="56" height="7" fill="${CINNABAR}"/>`,
    scarf: `<path d="M68 138 Q100 156 132 138 L134 150 Q100 170 66 150Z" fill="${CINNABAR}"/><path d="M118 150 l6 34 l-12 0Z" fill="${CINNABAR}"/>`,
    book: book(146, 176),
    lantern: lantern(158, 172),
  };
  return glow + scaleAt(AGE_SCALE[v.age], body + eyes + mouth + (props[v.prop] || ''));
}

/* ---------- Claude：Clawd 像素螃蟹，越新像素越细 ---------- */
function claude(v: Required<Variant>, color: string) {
  const N = 8 + v.detail * 4; // 12..28 格
  const cell = 200 / N;
  const dark = '#A9523A', light = '#EFA184';
  const raised = v.mood === 'smile' || v.prop === 'quill';
  const inRect = (x: number, y: number, x0: number, x1: number, y0: number, y1: number) =>
    x >= x0 && x < x1 && y >= y0 && y < y1;
  const eyeH = v.mood === 'sleepy' ? [0.5, 0.54] : [0.45, 0.56];
  const pick = (u: number, w: number): string | null => {
    if (inRect(u, w, 0.35, 0.41, eyeH[0], eyeH[1])) return INK;
    if (inRect(u, w, 0.59, 0.65, v.mood === 'curious' ? 0.42 : eyeH[0], eyeH[1])) return INK;
    const body = inRect(u, w, 0.22, 0.78, 0.36, 0.72);
    const armL = inRect(u, w, 0.08, 0.22, 0.48, 0.6);
    const armR = raised ? inRect(u, w, 0.78, 0.9, 0.26, 0.48) || inRect(u, w, 0.78, 0.84, 0.46, 0.6) : inRect(u, w, 0.78, 0.92, 0.48, 0.6);
    const leg = [0.28, 0.4, 0.56, 0.68].some((x) => inRect(u, w, x, x + 0.06, 0.72, 0.84));
    if (!(body || armL || armR || leg)) return null;
    if (v.detail >= 3 && body && w > 0.66) return dark;
    if (v.detail >= 4 && body && w < 0.41 && u > 0.26 && u < 0.74) return light;
    return color;
  };
  let rects = '';
  for (let j = 0; j < N; j++) {
    let run: { c: string; i: number } | null = null;
    const flush = (end: number) => {
      if (run) rects += `<rect x="${(run.i * cell).toFixed(2)}" y="${(j * cell).toFixed(2)}" width="${((end - run.i) * cell + 0.3).toFixed(2)}" height="${(cell + 0.3).toFixed(2)}" fill="${run.c}"/>`;
    };
    for (let i = 0; i <= N; i++) {
      const c = i < N ? pick((i + 0.5) / N, (j + 0.5) / N) : null;
      if (run && c === run.c) continue;
      flush(i);
      run = c ? { c, i } : null;
    }
  }
  const crab = `<g transform="translate(0 -6)">${rects}</g>`;
  const props: Record<string, string> = {
    book: book(100, 158, "#2F4A6B"),
    quill: quill(172, 96),
    glasses: `<g fill="none" stroke="${INK}" stroke-width="3" transform="translate(0 -6)"><rect x="64" y="84" width="24" height="30"/><rect x="112" y="84" width="24" height="30"/><path d="M88 96h24"/></g>`,
    scroll: scroll(100, 160),
    lantern: lantern(30, 168),
  };
  return scaleAt(AGE_SCALE[v.age], crab + (props[v.prop] || ''));
}

/* ---------- DeepSeek：蓝色大肥鱼（社区二创） ---------- */
function deepseek(v: Required<Variant>, color: string) {
  const belly = '#A9B8FF', dark = '#3149C9';
  const tails = [
    `<path d="M40 128 L6 96 Q14 128 6 160Z" fill="${dark}"/>`,
    `<path d="M40 128 L4 92 L22 128 L4 164Z" fill="${dark}"/>`,
    `<path d="M40 128 C 20 100, 0 96, 4 112 C 12 124, 12 132, 4 144 C 0 160, 20 156, 40 128Z" fill="${dark}"/>`,
  ];
  const tail = tails[v.detail % 3];
  const eye =
    v.mood === 'sleepy'
      ? `<circle cx="140" cy="116" r="11" fill="#FFF"/><circle cx="142" cy="119" r="5" fill="${INK}"/><path d="M128 113 Q140 104 152 113 L152 108 L128 108Z" fill="${color}"/><path d="M128 113 Q140 106 152 113" stroke="${dark}" stroke-width="2.5" fill="none"/>`
      : `<circle cx="140" cy="116" r="${v.mood === 'curious' ? 13 : 11}" fill="#FFF"/><circle cx="143" cy="117" r="5.5" fill="${INK}"/><circle cx="145" cy="114" r="1.8" fill="#FFF"/>`;
  const fish = `${tail}<ellipse cx="102" cy="128" rx="70" ry="54" fill="${color}"/><ellipse cx="112" cy="148" rx="52" ry="26" fill="${belly}" opacity=".7"/><path d="M78 76 Q100 54 124 76Z" fill="${dark}"/><path d="M92 150 q10 18 24 8" fill="${dark}" opacity=".55"/>${eye}<ellipse cx="150" cy="138" rx="8" ry="4" fill="#F4A6B6" opacity=".7"/><path d="M164 130 q6 4 0 8" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>${v.detail >= 4 ? `<path d="M70 110 q6 6 0 12 M80 104 q6 6 0 12" stroke="${dark}" stroke-width="1.5" fill="none" opacity=".6"/>` : ''}`;
  const props: Record<string, string> = {
    rice: riceBowl(118, 186),
    book: book(122, 186, '#2F4A6B'),
    abacus: abacus(118, 184),
    lantern: lantern(180, 170),
  };
  return scaleAt(AGE_SCALE[v.age], `<g transform="translate(0 -4)">${fish}</g>` + (props[v.prop] || ''));
}

/* ---------- 豆包：豆包姐姐（特征重绘，参考官方 3D 助手形象：短棕发、黑色上衣） ---------- */
function doubao(v: Required<Variant>, color: string) {
  const skin = '#F8DCC8', hair = '#3A2E22';
  const outfit = v.age === 'elder' ? '#9A4E1E' : v.age === 'child' ? '#FFC49A' : '#22201C';
  const styles = [
    // 1 短发
    { back: `<path d="M54 100 Q52 44 100 42 Q148 44 146 100 L146 120 L54 120Z" fill="${hair}"/>`, front: `<path d="M58 84 Q64 52 100 50 Q136 52 142 84 Q120 70 100 74 Q80 70 58 84Z" fill="${hair}"/>` },
    // 2 双丸子
    { back: `<circle cx="58" cy="52" r="18" fill="${hair}"/><circle cx="142" cy="52" r="18" fill="${hair}"/><path d="M54 100 Q52 44 100 42 Q148 44 146 100Z" fill="${hair}"/>`, front: `<path d="M58 84 Q64 52 100 50 Q136 52 142 84 Q110 66 100 72 Q90 66 58 84Z" fill="${hair}"/>` },
    // 3 头顶一个包子髻
    { back: `<circle cx="100" cy="30" r="20" fill="${hair}"/><path d="M54 104 Q52 44 100 42 Q148 44 146 104Z" fill="${hair}"/>`, front: `<path d="M58 84 Q64 52 100 50 Q136 52 142 84 Q124 64 104 70 Q82 66 58 84Z" fill="${hair}"/>` },
    // 4 马尾
    { back: `<path d="M140 60 Q178 70 168 140 Q160 110 146 96Z" fill="${hair}"/><path d="M54 100 Q52 44 100 42 Q148 44 146 100Z" fill="${hair}"/>`, front: `<path d="M58 86 Q64 52 100 50 Q136 52 142 86 Q126 62 96 70 Q76 70 58 86Z" fill="${hair}"/>` },
    // 5 长发 + 发夹
    { back: `<path d="M50 100 Q48 40 100 40 Q152 40 150 100 L156 168 L44 168Z" fill="${hair}"/>`, front: `<path d="M58 86 Q64 52 100 50 Q136 52 142 86 Q120 62 100 70 Q80 62 58 86Z" fill="${hair}"/><rect x="118" y="58" width="16" height="6" rx="3" fill="${color}" transform="rotate(-20 126 61)"/>` },
  ];
  const h = styles[Math.max(0, Math.min(4, v.detail - 1))];
  const eyes =
    v.mood === 'sleepy'
      ? `<path d="M76 104 q8 6 16 0 M108 104 q8 6 16 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="84" cy="102" rx="6" ry="8" fill="${INK}"/><ellipse cx="116" cy="102" rx="6" ry="8" fill="${INK}"/><circle cx="86" cy="99" r="2" fill="#FFF"/><circle cx="118" cy="99" r="2" fill="#FFF"/>`;
  const mouth = v.mood === 'smile' ? `<path d="M92 120 Q100 130 108 120Z" fill="#C0504D"/>` : `<path d="M93 121 Q100 126 107 121" stroke="#C0504D" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  const buttons = `<circle cx="100" cy="168" r="2.4" fill="#4A463E"/><circle cx="100" cy="180" r="2.4" fill="#4A463E"/><circle cx="100" cy="192" r="2.4" fill="#4A463E"/>`;
  const figure = `${h.back}<path d="M40 206 Q42 150 100 144 Q158 150 160 206Z" fill="${outfit}"/>${outfit === '#22201C' ? buttons : ''}<path d="M84 146 L100 164 L116 146" fill="#FFF7EE"/><rect x="92" y="130" width="16" height="18" fill="${skin}"/><ellipse cx="100" cy="102" rx="42" ry="44" fill="${skin}"/>${h.front}${eyes}<ellipse cx="74" cy="116" rx="7" ry="4" fill="#F4A6A0" opacity=".7"/><ellipse cx="126" cy="116" rx="7" ry="4" fill="#F4A6A0" opacity=".7"/>${mouth}`;
  const props: Record<string, string> = {
    keys: keys(150, 176),
    apron: `<path d="M72 160 H128 L134 206 H66Z" fill="#FFF7EE" opacity=".95"/><path d="M78 160 Q100 150 122 160" stroke="#E6D3BC" stroke-width="3" fill="none"/>`,
    lamp: lamp(156, 184),
    book: book(148, 182),
    phone: phone(150, 180),
  };
  return scaleAt(AGE_SCALE[v.age], figure + (props[v.prop] || ''));
}

/* ---------- Muse：Jolly，奶油色毛绒 ---------- */
function muse(v: Required<Variant>) {
  const cream = '#F6EBDD', edge = '#E3D2BC';
  let fuzz = '';
  for (let a = 0; a < 360; a += 12) {
    const r = (a * Math.PI) / 180;
    fuzz += `<circle cx="${(100 + Math.cos(r) * 72).toFixed(1)}" cy="${(128 + Math.sin(r) * 66).toFixed(1)}" r="7" fill="${cream}" stroke="${edge}" stroke-width="1"/>`;
  }
  const eyes =
    v.mood === 'sleepy'
      ? `<path d="M74 124 q8 5 16 0 M110 124 q8 5 16 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="82" cy="122" rx="6" ry="8" fill="${INK}"/><ellipse cx="118" cy="122" rx="6" ry="8" fill="${INK}"/><circle cx="84" cy="119" r="1.8" fill="#FFF"/><circle cx="120" cy="119" r="1.8" fill="#FFF"/>`;
  const body = `<ellipse cx="62" cy="68" rx="14" ry="16" fill="${cream}" stroke="${edge}" stroke-width="2"/><ellipse cx="138" cy="68" rx="14" ry="16" fill="${cream}" stroke="${edge}" stroke-width="2"/>${fuzz}<ellipse cx="100" cy="128" rx="72" ry="66" fill="${cream}"/>${eyes}<ellipse cx="70" cy="140" rx="10" ry="6" fill="#F4B6B6"/><ellipse cx="130" cy="140" rx="10" ry="6" fill="#F4B6B6"/><path d="M88 142 Q100 156 112 142" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const charm = `<g transform="translate(160 128)"><circle r="8" fill="none" stroke="${GOLD}" stroke-width="3"/><path d="M0 8 v10" stroke="${GOLD}" stroke-width="2"/><ellipse cx="0" cy="30" rx="12" ry="12" fill="${cream}" stroke="${edge}" stroke-width="1.5"/><circle cx="-4" cy="28" r="1.8" fill="${INK}"/><circle cx="4" cy="28" r="1.8" fill="${INK}"/></g>`;
  return scaleAt(AGE_SCALE[v.age] + 0.14, `<g transform="translate(0 -26)">${body}</g>` + (v.prop === 'charm' ? charm : ''));
}

export function figureSVG(family: string, variant: Variant, color: string) {
  const v: Required<Variant> = {
    age: variant.age ?? 'young',
    detail: variant.detail ?? 3,
    prop: variant.prop ?? 'none',
    mood: variant.mood ?? 'calm',
    eye: variant.eye ?? '',
  };
  switch (family) {
    case 'chatgpt': return chatgpt(v);
    case 'claude': return claude(v, color);
    case 'deepseek': return deepseek(v, color);
    case 'doubao': return doubao(v, color);
    case 'muse': return muse(v);
    default: return '';
  }
}

/** 框体：旧式椭圆肖像框 + 羊皮纸底 + 家族色内衬；离世成员蒙纱、停一只黄蝴蝶 */
function frameWrap(uid: string, color: string, dead: boolean | undefined, frame: boolean, inner: string) {
  const clip = `clip-${uid}`;
  const veil = dead
    ? `<g clip-path="url(#${clip})"><rect width="240" height="300" fill="rgba(255,255,255,.45)"/><path d="M0 40 L240 10 M0 120 L240 90 M0 200 L240 170 M0 280 L240 250" stroke="#FFF" stroke-width="10" opacity=".25"/></g>`
    : '';
  const frameSvg = frame
    ? `<ellipse cx="120" cy="150" rx="112" ry="142" fill="none" stroke="${GOLD}" stroke-width="10"/><ellipse cx="120" cy="150" rx="104" ry="134" fill="none" stroke="${GOLD_DARK}" stroke-width="1.5"/><ellipse cx="120" cy="150" rx="117" ry="147" fill="none" stroke="${GOLD_DARK}" stroke-width="1.5"/>`
    : '';
  return `<svg viewBox="0 0 240 300" xmlns="http://www.w3.org/2000/svg" role="img"><defs><clipPath id="${clip}"><ellipse cx="120" cy="150" rx="104" ry="134"/></clipPath><radialGradient id="bg-${uid}" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="${PAPER}"/><stop offset="1" stop-color="#E2D6C0"/></radialGradient></defs><g clip-path="url(#${clip})"><rect width="240" height="300" fill="url(#bg-${uid})"/><rect width="240" height="300" fill="${color}" opacity=".1"/>${inner}</g>${veil}${frameSvg}${dead ? butterfly(206, 38, 1.3) : ''}</svg>`;
}

/** 程序化画像：家族基因 + 世代变体；没有真实商标时的兜底 */
export function portraitSVG({ family, variant, color, dead, uid, frame = true }: PortraitOpts) {
  const fig = figureSVG(family, variant, color);
  return frameWrap(uid, color, dead, frame, `<g transform="translate(-6 34) scale(1.26)">${fig}</g>`);
}

export type LogoPortraitOpts = {
  logo: string; // 站内路径，如 /avatars/family-chatgpt.svg
  boxW?: number; // logo 在框内的显示尺寸（默认 150×150）
  boxH?: number;
  color: string;
  dead?: boolean;
  uid: string;
};

/** 真实商标画像：官方 logo 放在同一套框体里；logo 本体不改色、不裁剪 */
export function logoPortraitSVG({ logo, boxW = 150, boxH = 150, color, dead, uid }: LogoPortraitOpts) {
  const x = (240 - boxW) / 2;
  const y = (300 - boxH) / 2;
  return frameWrap(
    uid,
    color,
    dead,
    true,
    `<image href="${logo}" x="${x}" y="${y}" width="${boxW}" height="${boxH}" preserveAspectRatio="xMidYMid meet"/>`,
  );
}

/* ---------- 家徽与拟人形象映射 ---------- */
// 各家族的家徽：真实商标（public/avatars/family-*.svg），指称性使用，来源见 public/avatars/CREDITS.md。
export const FAMILY_CREST: Record<string, { src: string; w: number; h: number }> = {
  chatgpt: { src: '/avatars/family-chatgpt.svg', w: 150, h: 150 },
  claude: { src: '/avatars/family-claude.svg', w: 150, h: 150 },
  deepseek: { src: '/avatars/family-deepseek.svg', w: 150, h: 150 },
  muse: { src: '/avatars/family-muse.svg', w: 200, h: 60 },
};
// 各家族成员的拟人形象（真实出处，见 public/avatars/CREDITS.md；社区二创已标注非官方）。
// 尚无可靠形象的家族回退到家徽，再没有家徽的（目前没有）回退到 portraitSVG 的程序化画像。
export const FAMILY_MASCOT: Record<string, { src: string; w: number; h: number }> = {
  claude: { src: '/avatars/mascot-claude.png', w: 200, h: 200 },
  deepseek: { src: '/avatars/mascot-deepseek.png', w: 160, h: 284 },
  muse: { src: '/avatars/mascot-muse.png', w: 200, h: 200 },
  doubao: { src: '/avatars/mascot-doubao.png', w: 200, h: 200 },
};
