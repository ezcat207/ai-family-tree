# 实现设计与决策记录

> 配套 `08-产品SPEC-v3.md`。这里记录实现时做的设计，以及已经拍板的决定。新的待拍板事项先记在 `docs/candidates.md`，需要人去做的事记在 `human_todo.md`。

## 1. 架构

```
浏览器 ──> 静态页（Astro 构建）
   │
   └─> /api/*（同域函数）──> Cloudflare D1 HTTP API ──> D1 数据库 ai-family-tree
```

| 部署 | 地址 | 触发方式 | 用途 |
|---|---|---|---|
| Vercel | https://ai-family-tree-xi.vercel.app | push main 后由 Vercel 的 GitHub 集成自动部署 | 海外访问 |
| Cloudflare Pages | https://ai-family-tree.pages.dev | push main 后由 GitHub Actions `deploy-cloudflare.yml` 自动部署，本地也可以跑 `npm run deploy:cf` | 国内访问（仍需绑定自有域名，见 human_todo） |

- 两个部署是同一套代码，靠 `DEPLOY_TARGET=cloudflare` 切换适配器，共用同一个 D1 库，所以两边的记忆和投票是互通的。
- 密钥只放在服务端环境变量里，浏览器拿不到：Vercel 的 env、Cloudflare Pages 的 secrets、GitHub Actions 的 secrets。本地放在 `.env`，不进仓库。
- 人机验证用 Cloudflare Turnstile（managed 模式），只在记忆墙提交时校验。投票靠"浏览器 ID + IP 摘要"去重。

## 2. 数据口径（已拍板）

> 2026-09-26 由神威确认，同意按以下方式处理。

1. **找不到 App 下架官方日期时，以 API 关停（rest）作为卒日。** API 都关了，App 里自然也见不到它了。Claude 家大多属于这种情况。这条也写在了 /about/。
2. **豆包旗舰 `doubao` 代表豆包 App / 家族长子**，App 仍在，所以算在世。初代模型 Doubao-pro 在 2025-04-15 从火山方舟下线，这件事写进了生平，但不作为 rest 事件记入 lifecycle。
3. **DeepSeek 的开源权重记为"遗体保存（preserved）"**，日期取出生日，来源是官方 GitHub / Hugging Face 仓库。
4. **o3 的离世日按官方预告的计划日期（2026-08-26）记录**，同时在 yaml 的 todo 里挂着，等找到"已退役"的官方确认。
5. **Claude Opus 3**：API 已退役，但仍对 claude.ai 付费用户开放，状态显示为"退而不休"；进纪念馆，但不设谥号投票。
6. **GPT-4o 与豆包 2.0 不写"同日生死"。** 豆包 2.0 官方发布日是北京时间 2026-02-14，4o 下架是美国时间 02-13，站内如实写"前后脚"。
7. **R1 不记"当家"。** 官方口径是"打开深度思考才调用 R1"，默认应答的是 V3。
8. **Muse 的名字保留"（Jolly）"。** 依据是媒体转述，官方页面没有出现 Jolly，这一点已在 yaml 的 todo 里注明。

## 3. 引用规则（用户要求：所有事实都要能核对，并在站上引用）

- 每个 lifecycle 事件都必须带官方 `source`，时间轴上可以点开来源。
- 正文里每句事实后面写 `[来源](url)`，由 `src/lib/rehype-cite.mjs` 渲染成上标编号，文末附「本文引用」。
- 每页末尾的「参考来源」由 yaml 的 `references` 和生命周期来源合并生成，并标注官方、媒体或社区。
- 讣告卡上的数据（`obit_fact`）在卡片上标注来源域名。
- `npm run check:data -- --links` 会逐个打开链接。openai.com 和 meta.com 屏蔽脚本访问，会报 403/400，要人工在浏览器里抽查。

## 4. 形象

- `Portrait.astro` 按优先级取图：拟人形象（`FAMILY_MASCOT`，成员级真实头像/角色图）> 家徽（`FAMILY_CREST`，家族级商标）> 程序化 SVG 兜底（`portraitSVG`，按"家族基因 + 世代变体"生成，变体参数在 yaml 的 `avatar.variant`）。外面统一套旧式画框，离世成员照样蒙纱、停黄蝴蝶。来源和授权见 `public/avatars/CREDITS.md`。
- 拟人形象目前有 Claude（Clawd）、DeepSeek（鲸鱼娘）、Muse（Jolly）、豆包（App 内 3D 助手头像）。ChatGPT 只有家徽，没有拟人形象。豆包家族页顶部的"家族形象"卡槽仍显示程序化重绘（因为豆包没有商标可作家徽），拟人形象卡槽显示真实头像。
- **2026-09-26 用户决定**：demo 阶段直接使用官方/社区的真实头像素材，不再因版权顾虑而回退到程序化重绘（沿用 08 §16"版权"条：暂不处理版权问题，如遇异议再复查撤下）。
- 注意：「我的 AI 家谱」卡片是在浏览器端直接调用 `portraitSVG` 生成的，目前仍是程序化画像，和站内其他地方的画像不一致（见 human_todo）。

## 5. 审核

在 Cloudflare 后台打开 D1 → ai-family-tree → Console：

```sql
select * from pending_memories;                             -- 待审
update memories set status = 'approved' where id = '...';   -- 通过
update memories set status = 'featured' where id = '...';   -- 精选（置顶 + 上首页）
update memories set status = 'rejected' where id = '...';   -- 拒绝
select * from nominations where status = 'pending';          -- 谥号提名
select * from most_missed;                                   -- 最多人想念谁
```

自动拒绝的内容：链接和广告、联系方式、手机号和身份证号、成人内容、辱骂。出现自伤或轻生的表达时，这条不展示，提交后提示拨打全国心理援助热线 12356。
