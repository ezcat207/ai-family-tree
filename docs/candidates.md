# 候选与待拍板（实现过程中发现，未动工）

> 按 AGENTS.md 规则 1：新想法和名单外成员只记在这里，不建档。

## 名单外、但核对时发现"当过 App 默认"的成员
| 家族 | 成员 | 线索（官方） | 建议 |
|---|---|---|---|
| DeepSeek | V3.2-Exp（2025-09-29）、V3.2（2025-12-01） | https://api-docs.deepseek.com/zh-cn/news/news250929 、https://api-docs.deepseek.com/zh-cn/news/news251201 | 补档：V3.1 与 V4 之间有断代 |
| DeepSeek | V4.1 Flash（2026-09-10） | https://www.deepseek.com/news/deepseek-v4-1-flash/ | 补档：V4 的继任 |
| 豆包 | 豆包 1.8（2025-12）、豆包 2.1（2026-06） | https://docs.volcengine.com/docs/ark/model-release-announcement | 补档 |
| Claude | Claude 5 一代拆档（Fable 5 / Sonnet 5 / Opus 5 / Fable 5.1 / Opus 5.5） | https://www.anthropic.com/news/claude-fable-5-mythos-5 | 【待拍板】目前合为 `claude-5` |

## 【待拍板】数据口径
1. **豆包旗舰 `doubao` 代表 App / 家族长子**。初代模型 Doubao-pro 在 2025-04-15 从火山方舟下线，这件事写在生平里，没有作为 rest 事件，否则首页会显示"豆包已离世"。
2. **找不到 App 下架官方日期时，以 API 关停（rest）作为卒日**（Claude 家大多如此）。已写进 /about/。
3. **DeepSeek 开源权重算不算"遗体保存（preserved）"**：agent 给 5 位都加了，日期取出生日，来源是官方 GitHub / Hugging Face。官方没有说过"承诺保留"。
4. **Claude Opus 3**：API 已退役，但仍对 claude.ai 付费用户开放，状态显示为"退而不休"，进纪念馆，不设谥号投票。
5. **GPT-4o 与豆包 2.0 "同日生死"**：豆包 2.0 官方发布日是 2026-02-14（北京时间），4o 下架是美国时间 02-13。严格说不是同一天，站内按事实写"前后脚"。
6. **R1 算不算"当家"**：官方口径是"打开深度思考才调用 R1"，默认应答是 V3，所以没写 head。

## 新想法（不做）
- 模型监控 + 自动建档、出生证明卡、英文版、截图上传（08 §18.1 明确不做）。
- 内容日历：豆包 1.5 Pro / 1.6 于 2026-09-21 API 停服，DeepSeek V4 于 2026-09-14 停服，是现成的讣告节点。
