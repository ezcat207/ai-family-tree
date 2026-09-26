# SEO 要点 · AI 家谱（2026-09-26）

> 来源：哥飞 SEO Agent 五轮调研（2026-09-26）+ 七月复核。定位：**SEO 是辅助，不是主赛道**。
> 基础必须做对，但不为关键词扭曲产品（不追 wiki/ai news 等词）。

## 1. 关键词分层（实现时用于定标题/URL/内链）

### 流量层（骨架页承接）
| 词 | 量级/月 | 备注 |
|---|---|---|
| when did chatgpt come out | ~14,800 | 最高；软标靶见 §5 |
| llm leaderboard | ~8,100 | P1 战力榜承接 |
| best ai model | ~4,400 | 红海，P1 再碰 |
| chatgpt release date | ~2,900 | 成员档案页/时间线页承接 |
| ai model comparison | ~1,300 | P1 比较页承接 |
| list of ai models | ~320 | 首页/时间线页承接 |
| ai model tier list | ~170 | P1 |
| llm tracker | ~170 | 时间线页承接 |

### 情感层（灵魂页承接，长尾）
`ai persona` ~720/月、`chatgpt personality` ~480/月——量小但精准，成员档案页"性格"段自然承接，
不单独建页。

### 别碰
- `wiki / ai wiki`：品牌词真空=没人搜，不是机会。
- `ai news`：新闻站红海，与"家谱"定位冲突。
- `ai family`：被"全家福/家庭 AI 产品"占据，语义撞车。
- 为关键词 invented 的新词（如 synthekin 类）：搜索纠错吃掉你。

## 2. 一页一核心词（硬规则）

- 每页定一个主关键词 → H1 + title + 首段对准它（专栏交付标准第 1 条同样适用）。
- 成员档案页：`<中文名> 是什么时候发布的 / <name> release date`（如"ChatGPT 是什么时候发布的"）。
- 时间线页：`ai model release timeline / llm tracker`。
- 首页：`ai family tree`（品类词，种树不摘果）。
- 家族页：`<家族> AI models`（如"OpenAI AI models"）。

## 3. URL 与内链

- URL：`/members/<id>/`、`/families/<id>/`、`/timeline/`——短、稳、P2 迁域名可 1:1 保留。
- 内链三角：家族页 ↔ 成员页 ↔ 时间线页互相链；成员页"关系区"链向竞品/CP 成员页。
- 面包屑：首页 / 家族 / 成员。

## 4. 技术 SEO（Jekyll 实现 checklist）

- [ ] sitemap.xml 自动生成并提交
- [ ] 每页唯一 title/description（读 front matter 生成，模板兜底）
- [ ] Schema.org：成员页用 `Person`（+ `knowsAbout` 指向能力）或 `SoftwareApplication` 二选一，P0 定一种全站统一
- [ ] 语义 HTML（04 §2 第 5 条）；`time` 标签带 `datetime`
- [ ] 图片 `alt` 完整；头像 SVG 内联或压缩
- [ ] 移动端体验（Core Web Vitals）；每页 <200KB（02 §9）
- [ ] robots.txt 允许全抓；GitHub Pages 自带 HTTPS

## 5. 软标靶（P0 可尝试）

`when did chatgpt come out` / `chatgpt release date` 的 SERP 顶部据调研有一个低 DR 占位者
（`chatgpt.ca`，DR ~11，数据为 SEO Agent 口径、未独立复核）。
打法：ChatGPT 档案页 + 时间线页用"发布时间考据"体写深（官方公告原文引用 + 版本对照表），
不承诺排名，只做内容深度。

## 6. 红线

- 不编造日期/版本；`传闻/预测` 必须标注（02 §4 证据等级）。
- 不抄竞品站（aireleasetracker 等）文案；只参考结构。
- 赞助/变现相关：`$699/月赞助位`为挂牌价，不作为收入依据写入任何页面。
