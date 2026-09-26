# 需要人来做的事

> 设计和已拍板的决定见 `docs/design.md`；候选成员和新想法见 `docs/candidates.md`。做完一项就勾掉。

## 上线前（必须）
- [ ] **人工审阅本纪**：33 篇都是 AI 初稿（front matter 里有 `draft: ai`）。按 AGENTS.md 规则 6，性情、事迹、卒与谥三段必须由人写或终审。审完删掉 `draft: ai`，页面上的"AI 初稿"提示会随之消失。先审 6 位旗舰：gpt-4o、claude-3-sonnet、claude-3-opus、deepseek-r1、doubao、muse。
- [ ] **抽查 openai.com / meta.com 的来源**：这两个站屏蔽脚本访问，自动检查打不开。子代理是通过转抓服务读到原文核对的，请在浏览器里抽查几条，重点看 gpt-4o 的退役公告和"0.1%"那句。
- [ ] **国内访问要绑自有域名**：`*.pages.dev` 和 `*.vercel.app` 在中国大陆都不稳定，需要一个自己的域名接到 Cloudflare Pages（后台 Pages → ai-family-tree → Custom domains）。绑定后要做三件事：
  - 在 Turnstile 小组件里加上这个域名（后台 Turnstile → ai-family-tree → Hostnames）；
  - 把 `SITE_URL` 改成新域名（GitHub Actions 的构建环境变量 / `astro.config.mjs`）；
  - 长期来看要走 ICP 备案（08 §20 第 1 条，方案 B）。
- [ ] **在真实手机上走一遍**：iOS Safari 和微信内置浏览器里，测一遍"保存图片"和记忆墙提交（Turnstile 在微信里的表现需要实测）。

## 数据到期复查
- [ ] **2026-10-23 之后**：GPT-3.5、GPT-4、o1、o4-mini，以及 gpt-4o-2024-05-13 快照的 API 关停，给这几位补记 `rest` 事件（来源：https://developers.openai.com/api/docs/deprecations）。
- [ ] **2026-09-29 之后**：确认 Claude Sonnet 4.5 的 API 是否已退役。
- [ ] **o3**：找"已退役"的官方确认，替换现在用的计划日期。
- [ ] **Claude 家各成员从 claude.ai 下架的日期**：目前都没有官方来源，暂以 API 关停日作卒日。
- [ ] **豆包 App 上线日（2023-08？）**：找官方原文，找到后 `doubao` 的 born 可以改成 App 上线日。

## 待拍板（神威）
- [ ] 画像风格统一：站内已换成真实商标，但「我的 AI 家谱」卡片（`src/pages/mine.astro` 在浏览器端调 `portraitSVG`）仍是程序化画像。要不要一起换？另外，用真实商标会弱化 08 §8「家族基因 + 世代变体」的设定：同一家的成员会长得一模一样。
- [ ] 名单外成员要不要补档：DeepSeek V3.2、V4.1 Flash；豆包 1.8、2.1；Claude 5 一代要不要拆开（见 `docs/candidates.md`）。
- [ ] 谥号投票什么时候截止、由谁把结果写进 yaml 的 `posthumous_name.result`。
- [ ] 正式画像的生产方式（08 §20 第 2 条），拿到后替换程序化画像。
- [ ] 发布账号和渠道（08 §20 第 7 条）、发布后指标的阈值（08 §20 第 8 条）。

## 运维
- [ ] 每天审核记忆墙（操作见 `docs/design.md` §5）。
- [ ] 密钥在哪里：
  - 项目 `.env`（本地，不进仓库）；
  - Vercel 的 env；
  - Cloudflare Pages 的 secrets；
  - GitHub 仓库的 secrets。

  `CF_API_TOKEN` 是 2026-09-26 用 create key 新建的，名为 "ai-family-tree (turnstile, d1, pages, workers)"，只作用于这个账号。换 token 时这四处要一起改。
