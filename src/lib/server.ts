// 服务端工具：只在 /api/* 里用。数据存在 Cloudflare D1，经 D1 HTTP API 访问；token 只在服务端。
const env = (k: string) => (import.meta.env[k] as string | undefined) ?? process.env[k];

export type DB = <T = Record<string, any>>(sql: string, params?: unknown[]) => Promise<T[]>;

/** 返回一个查询函数；没配置时返回 null（前端会显示"暂未开放"） */
export function db(): DB | null {
  const acc = env('CF_ACCOUNT_ID'), id = env('CF_D1_DATABASE_ID'), token = env('CF_API_TOKEN');
  if (!acc || !id || !token) return null;
  return async (sql, params = []) => {
    const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${acc}/d1/database/${id}/query`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ sql, params }),
    });
    const d = await r.json().catch(() => null);
    if (!d?.success) {
      const err = new Error(d?.errors?.[0]?.message || `D1 ${r.status}`) as Error & { unique?: boolean };
      err.unique = /UNIQUE constraint/i.test(err.message);
      throw err;
    }
    return d.result?.[0]?.results ?? [];
  };
}

export const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...headers } });

export const unavailable = () => json({ error: 'backend_not_configured', message: '这个功能还没开放，稍后再来。' }, 503);

export function clientIp(req: Request) {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || '0.0.0.0';
}

/** 不可逆摘要：只用于防刷和去重，不保存 IP 原文 */
export async function hash(...parts: string[]) {
  const salt = env('HASH_SALT') || 'ai-family-tree';
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode([salt, ...parts].join('|')));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = env('TURNSTILE_SECRET_KEY');
  if (!secret) return true; // 未配置时跳过（demo）
  if (!token) return false;
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  return !!(await r.json().catch(() => ({})))?.success;
}

// ---- 审核规则（08 §9.2）----
const LINK = /(https?:\/\/|www\.|[a-z0-9-]+\.(com|cn|net|org|io|ai|top|xyz|cc|me)\b)/i;
const PHONE = /(?<!\d)1[3-9]\d{9}(?!\d)/;
const ID_CARD = /(?<!\d)\d{17}[\dXx](?!\d)/;
const CONTACT = /(微信|vx|v信|加我|qq[:：]?\s*\d|扣扣|电报|telegram)/i;
const ADULT = /(约炮|裸聊|色情|黄片|av女优|成人视频|porn|nsfw|援交)/i;
const ABUSE = /(傻逼|傻b|sb[^a-z]|去死吧|操你|草你|cnm|nmsl|脑残|智障)/i;
const SELF_HARM = /(自杀|轻生|想死|不想活|活不下去|结束生命|结束自己|割腕|跳楼|跳河|吃安眠药|自残|了结自己|kill myself|suicide)/i;

export type Verdict = { status: 'pending' | 'rejected'; reason?: string; help?: boolean };

export function moderate(text: string): Verdict {
  if (SELF_HARM.test(text)) return { status: 'rejected', reason: 'self_harm', help: true };
  if (LINK.test(text) || CONTACT.test(text)) return { status: 'rejected', reason: 'link_or_ad' };
  if (PHONE.test(text) || ID_CARD.test(text)) return { status: 'rejected', reason: 'personal_info' };
  if (ADULT.test(text)) return { status: 'rejected', reason: 'adult' };
  if (ABUSE.test(text)) return { status: 'rejected', reason: 'abuse' };
  return { status: 'pending' };
}
