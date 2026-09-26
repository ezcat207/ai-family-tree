# AI 家谱 · AI Family Tree

给每一个 AI，写一部它的一生。产品定义见 `08-产品SPEC-v3.md`，协作规则见 `AGENTS.md`。

## 目录
```
data/                 事实（只在这里）：clans / families / members/<id>.yaml
content/zh/members/   本纪正文（draft: ai = AI 初稿，待人审）
content/zh/blog/      特辑
src/lib/portrait.ts   程序化画像（家族基因 + 世代变体）
src/pages/api/        记忆墙 / 谥号投票 / 匿名统计（Vercel 函数 + Cloudflare D1）
db/schema.sql         D1 建表 SQL
scripts/              数据校验、批量导出分享卡
docs/                 数据规范、候选与待拍板
```

## 本地开发
```bash
npm install
npm run dev                      # http://localhost:4321
npm run check:data               # 校验数据
npm run check:data -- --links    # 再逐个打开所有来源链接
npm run export:cards             # 批量导出 1080×1440 卡片和特辑长图到 out/cards/
```

## 引用规则
- 生命周期的每个事件都必须有官方 `source`；正文里每句事实后面写 `[来源](url)`，页面上会渲染成上标编号和文末「本文引用」。
- 每页末尾的「参考来源」由 yaml 的 `references` 和生命周期来源合并生成。

## 后端（记忆墙、谥号）
数据存在 Cloudflare D1（数据库名 `ai-family-tree`），Vercel 上的 `/api/*` 通过 D1 HTTP API 读写，浏览器拿不到任何密钥。
1. 建表：`wrangler d1 execute ai-family-tree --remote --file db/schema.sql`（或在 Cloudflare 后台 D1 Console 里粘贴执行）。
2. Vercel 环境变量：
   - `CF_ACCOUNT_ID`、`CF_D1_DATABASE_ID`、`CF_API_TOKEN`（需要 D1 编辑权限，只在服务端使用）
   - `HASH_SALT`：任意随机串，用于 IP 摘要
   - `SITE_URL`：线上地址（分享卡上显示）
   - 可选：`PUBLIC_TURNSTILE_SITE_KEY`、`TURNSTILE_SECRET_KEY`（Cloudflare 人机验证；不配就只用蜜罐 + 每 IP 每小时 5 条限流）
3. 没配置时，记忆墙和投票会显示"暂未开放"，其余页面照常。

### 审核（先审后发）
在 Cloudflare 后台 → D1 → ai-family-tree → Console：
```sql
select * from pending_memories;                                   -- 待审队列
update memories set status = 'approved' where id = '...';         -- 通过
update memories set status = 'featured' where id = '...';         -- 精选（置顶并上首页）
update memories set status = 'rejected' where id = '...';         -- 拒绝
```
谥号提名在 `nominations` 表里，审核通过后手动加进对应成员 yaml 的 `posthumous_name.candidates`。
自动拒绝：链接和广告、联系方式、手机号和身份证号、成人内容、辱骂。出现自伤或轻生表达时，这条不展示，并在提交后给出求助热线 12356。
