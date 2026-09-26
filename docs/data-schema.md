# 数据规范（实现用，源自 08 §14）

事实只写在 `data/**/*.yaml`；正文写在 `content/zh/**/*.md`。模板不写死任何事实。

## data/members/<id>.yaml

```yaml
id: gpt-4o                    # 小写连字符；发布后永不修改
family: chatgpt               # chatgpt / claude / deepseek / doubao / muse
name: { zh: GPT-4o, en: GPT-4o }
aka: [4o]                     # 昵称、俗称，可空
tier: flagship                # flagship / regular
gen: 5                        # 在本家族内的世代序号（1 起），画家族树用；同代兄弟 gen 相同
parents: [gpt-4]              # 父辈（前代）id，只写本仓库里存在的 id
children: [gpt-5]             # 子嗣（继任）id
siblings: [gpt-4o-mini]       # 同代兄弟 id
kin:                          # 外亲（跨家族），可空
  - { to: claude-3-5-sonnet, relation: { zh: 同年出生的外亲 } }
lifecycle:                    # 按时间顺序。每条必须有官方 source，没有就不写
  - state: born               # born/head/yielded/notice/died/api-only/rest/preserved/afterlife/revived
    date: 2024-05-13          # YYYY-MM-DD；只能确认到月份时写 YYYY-MM
    source: https://openai.com/index/hello-gpt-4o/
    note: { zh: 可选，一句话 }
avatar:
  signature: { zh: 暖黄色的眼睛 }   # 标志物（08 §8.3）
  variant:                        # 画像生成参数（SVG 程序化生成）
    age: young                    # child（mini/Haiku/Instant）/ young（标准）/ elder（Pro/Opus）
    detail: 3                     # 1–5，越新越精细
    prop: none                    # 见下表
    mood: calm                    # calm / smile / sleepy / curious
    eye: "#E3B23C"                # 可选，只有 chatgpt 家用
epigraph: { zh: 它以温柔被人记住，也因温柔被人收回。 }   # ≤40 字
posthumous_name:              # 只给离世成员
  candidates: [温, 暖, 伴]
  result: null
epitaph: { zh: ... }          # 只给离世成员，可空
obit_fact: { zh: 一条真实数据, source: url }   # 讣告卡上的数据（08 §11.2），可空
evidence:                     # 官方确认 / 社区共识 / 单一二创 / 传闻预测
  lifecycle: 官方确认
  personality: 社区共识
references:                   # 本成员用到的全部链接（页面「参考来源」逐条展示）
  - { title: Hello GPT-4o, url: https://openai.com/index/hello-gpt-4o/, publisher: OpenAI, kind: official }  # official / media / community
todo:                         # 没核实的线索写这里，不进 lifecycle，页面不展示
  - 【待核】App 下架日期：线索 endoflife.date
```

### prop 取值
| 家族 | 可选 |
|---|---|
| chatgpt | none, bowtie, glasses, hat, scarf, book, lantern |
| claude | none, book, quill, glasses, scroll, lantern |
| deepseek | none, rice, book, abacus, lantern |
| doubao | none, keys, apron, lamp, book, phone |
| muse | none, charm |

## content/zh/members/<id>.md

```markdown
---
id: gpt-4o
draft: ai            # 人审过后删掉这一行
---

## 名讳
80–150 字

## 生平
旗舰 200–400 字；普通成员 ≤100 字

## 性情
（仅旗舰）80–200 字，只写社区共识；二创写明「（二创）」

## 事迹
（仅旗舰）3–5 条列表，每条 ≤80 字，每条末尾附 [来源](url)

## 卒与谥
（仅离世旗舰）100–200 字
```
题记放在 yaml 的 `epigraph`，不放在正文里。亲族段由数据自动生成。

### 引用规则（用户要求：所有事实都要能核对，并在网站上引用）
- 正文里每一句含事实的话，句末加 `[来源](url)`。网站会把它渲染成上标编号 [1]，并在文末列出「本文引用」。
- 每个链接都必须实际打开核对过。核对不了的句子删掉，或移到 yaml 的 `todo`。
- `npm run check:data` 会校验 schema，并检查所有链接能否打开。
