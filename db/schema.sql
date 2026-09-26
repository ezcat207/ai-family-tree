-- AI 家谱 · 用户数据（08 §14.4），Cloudflare D1（SQLite）
-- 所有读写都经由 Vercel 上的 /api/*，用 D1 HTTP API + 服务端 token；浏览器拿不到任何密钥。
-- 审核：在 Cloudflare 后台 D1 → ai-family-tree → Console 里改 status。

create table if not exists memories (
  id text primary key default (lower(hex(randomblob(16)))),
  member_id text not null,
  nickname text,
  body text not null check (length(body) between 1 and 300),
  period text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'featured')),
  reject_reason text,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  ip_hash text not null
);
create index if not exists memories_member_status on memories (member_id, status, created_at);
create index if not exists memories_ip_time on memories (ip_hash, created_at);

create table if not exists votes (
  id text primary key default (lower(hex(randomblob(16)))),
  member_id text not null,
  candidate text not null,
  voter_hash text not null,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  unique (member_id, voter_hash)
);

create table if not exists nominations (
  id text primary key default (lower(hex(randomblob(16)))),
  member_id text not null,
  name text not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  ip_hash text not null,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

create table if not exists mine_stats (
  id text primary key default (lower(hex(randomblob(16)))),
  first text, longest text, missed text, now text,
  event text not null default 'generate',
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- 审核队列
create view if not exists pending_memories as
  select id, member_id, nickname, body, period, created_at from memories where status = 'pending' order by created_at;

-- 聚合：最多人想念的是谁
create view if not exists most_missed as
  select missed as member_id, count(*) as n from mine_stats where missed is not null and event = 'generate' group by missed order by n desc;
