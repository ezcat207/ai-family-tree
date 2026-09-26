# 产品 SPEC · AI 家谱 v1.0（2026-09-26）

## 1. 产品定义

**AI 家谱（AI Family Tree）**：把主流 AI 助手当"家庭成员"建档的站点。
每个 AI 有：档案卡（骨架）+ 人物小传（灵魂）。新模型发布 = 新成员"出道"，24 小时内建档。

**不是什么**：不是 AI 工具目录，不是新闻站，不是 benchmark 榜单，不是 chatbot 本体。

## 2. 技术栈

- 托管：GitHub repo `ai-family-tree`，GitHub Pages 发布
- 构建：Jekyll（Pages 原生支持）+ Collections
- 自动化：GitHub Actions（构建发布 / 每日监控 cron）
- 数据：成员档案 = Jekyll collection 文档，front matter 为结构化字段（即未来 MediaWiki infobox 字段）

## 3. 目录结构

```
ai-family-tree/
├── _members/               # 成员档案（每 AI 一个 .md，front matter + 七段正文）
│   └── chatgpt.md
├── _families/              # 家族分支页（每家族一个 .md）
│   └── openai.md
├── _data/
│   └── families.yml        # 家族元数据（名称/代表色/简介）
├── _layouts/
│   ├── home.html           # 首页
│   ├── member.html         # 成员档案页
│   ├── family.html         # 家族分支页
│   └── timeline.html       # 时间线页
├── _includes/              # 组件：member-card / infobox / timeline / family-tree ...
├── assets/                 # 自绘头像、CSS、JS
├── scripts/
│   ├── watch.py            # 监控官方发布源 → 输出新模型候选
│   └── draft.py            # 输入模型基础资料 → 按模板生成初稿 → 开分支+PR
├── templates/
│   └── member.md           # 成员档案模板（含 front matter 字段注释）
├── config/
│   └── sources.yaml        # 监控源清单（官方博客 RSS / 发布页）
├── .github/
│   ├── workflows/
│   │   ├── pages.yml       # Jekyll 构建 → Pages
│   │   └── watch.yml       # 每日 cron 跑 watch.py
│   └── pull_request_template.md  # PR 审核 checklist
├── timeline.md             # 出生记录（时间线页）
├── about.md                # 关于 / 收录标准
└── CONTRIBUTING.md         # 审核红线与投稿指南
```

## 4. 数据模型：成员档案 front matter

字段名固定为英文（供模板与未来迁移使用），`_members/<id>.md`：

```yaml
---
id: chatgpt                 # 英文小写，URL 用
name_zh: ChatGPT
name_en: ChatGPT
developer: OpenAI
family: openai              # 对应 _data/families.yml 的 id
debut: 2022-11-30           # 出道日（首次公开发布）
status: active              # active / deprecated / merged
versions:                   # 版本成长线（按时间）
  - version: GPT-3.5
    date: 2022-11-30
    note: 初代出道
  - version: GPT-4
    date: 2023-03-14
    note: 多模态，长大成人
personality: [幽默, 直接, 老好人]   # 人格关键词，≤3 个
color: "#10a37f"            # 代表色（用于卡片/时间线点缀）
avatar: /assets/avatars/chatgpt.svg  # 自绘头像，禁止官方原图直链
relations:                  # 关系（to 为成员 id）
  - { to: claude, type: 竞品 }
  - { to: gemini, type: 竞品 }
arena_tier: A               # 战力（季度更新，S/A/B/C）
evidence:                   # 每条关键事实的证据等级（至少覆盖 debut/versions）
  debut: 官方确认
---
```

证据等级枚举：`官方确认 / 社区共识 / 单一二创 / 传闻/预测`。正文里凡写"名场面/关系/性格评价"必须能对应到其一，
`传闻/预测` 必须显式标注。

## 5. 正文结构：七段（固定顺序）

1. **一句话**：这个 AI 是谁（≤50 字）。
2. **档案**：开发者、出道日、当前版本、状态（表格化，读 front matter 自动生成，AIGC 填）。
3. **性格**：人格关键词展开 + 语言风格（AIGC 初稿，人润色）。
4. **成长线**：版本历史叙事（AIGC 初稿）。
5. **名场面**：3–5 个社区公认高光时刻（**人写**，每条附来源链接）。
6. **关系**：家族内兄弟、竞品、CP（**人写**，fanon 必须标注"社区二创"）。
7. **评价与外部链接**：战力评价 + 官方链接（AIGC 初稿）。

分工铁律：**1/2/4/7 可 AIGC 初稿；3 需人润色；5/6 必须人写**。

## 6. AIGC pipeline

```
watch.py（每日 cron）
  → 扫描 config/sources.yaml 的官方源，发现新模型/大版本
  → 输出候选清单（以 issue 提醒，附证据链接）

draft.py（人工触发，输入：id + 官方资料链接）
  → 拉取公开资料 → LLM 按 templates/member.md 生成 _members/<id>.md 初稿
  → 自动开分支 + PR，PR 描述带审核 checklist

人审（PR review）
  → 按 checklist 审核 → 补充 5/6 段 → merge

pages.yml（merge 后）
  → Jekyll 构建 → GitHub Pages 发布
```

PR 审核 checklist（`.github/pull_request_template.md`）：
- [ ] debut/versions 日期已核对官方来源
- [ ] 人格关键词 ≤3 且非编造
- [ ] 名场面有来源链接
- [ ] fanon 内容已标注"社区二创"
- [ ] 无 R18、无拉踩、无编造官方设定
- [ ] 头像为自绘、非官方原图

## 7. 审核标准（CONTRIBUTING.md 硬约束）

1. 不编造官方设定：官方没说过的性格/关系不写；写了就标 fanon。
2. 明确区分：官方信息 / 社区共识 / 单一二创 / 传闻预测。
3. 无 R18 内容；未成年形象相关二创一律不收。
4. 图片：统一自绘风格，禁止官方 logo/mascot 原图；fan art 需授权+署名。
5. 商标：模型名/公司名仅作指称使用，不暗示官方授权；页脚加"非官方粉丝项目"声明。
6. 拉踩红线：竞品比较只列事实（发布时间/版本/公开榜单），不做人格贬损。

## 8. 首批 20 个成员名单

| id | 中文名 | 家族 |
|---|---|---|
| chatgpt | ChatGPT | openai |
| claude | Claude | anthropic |
| gemini | Gemini | google |
| grok | Grok | xai |
| copilot | Copilot | microsoft |
| doubao | 豆包 | bytedance |
| kimi | Kimi | moonshot |
| deepseek | DeepSeek | deepseek |
| qwen | 通义千问 | alibaba |
| ernie | 文心一言 | baidu |
| spark | 讯飞星火 | iflytek |
| xiaoice | 小冰 | xiaoice |
| yuanbao | 元宝 | tencent |
| zhipu | 智谱清言 | zhipu |
| replika | Replika | replika |
| characterai | Character.AI | characterai |
| neurosama | Neuro-sama | indie |
| midjourney | Midjourney | midjourney |
| pi | Pi | inflection |
| duo | Duo（多邻国） | duolingo |

家族元数据（`_data/families.yml`）：openai / anthropic / google / xai / microsoft / bytedance /
moonshot / deepseek / alibaba / baidu / iflytek / xiaoice / tencent / zhipu / replika /
characterai / indie / midjourney / inflection / duolingo —— 每个含 name_zh、简介、代表色。

## 9. 非功能要求

- 构建：Jekyll 增量构建，20–200 页规模下 <2 分钟。
- 数据与呈现分离：所有成员事实只存 front matter，不硬编码进模板。
- 可迁移：字段名即未来 MediaWiki infobox 字段名，迁移时 1:1 对应。
- 移动端优先；语义 HTML；每页 <200KB（不含头像）。
