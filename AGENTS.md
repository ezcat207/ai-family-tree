# AGENTS.md · AI 家谱（AI Family Tree）

This file is the shared instruction set for every coding agent working in this repo (Claude Code, Codex, and others). `CLAUDE.md` imports it. Keep agent-specific notes in the agent's own file and shared rules here.

## What this project is

**AI 家谱**：给每一个 AI 版本写一部它的一生。Each AI release is a family member with a birth, a lifecycle, a death, and people who remember it. The core value is human emotional value: loss, identity, nostalgia. It is not an AI tool directory, news site, or benchmark.

The current scope is a **one-week Chinese-language demo** with 5 families: ChatGPT, Claude, DeepSeek, 豆包, and Muse (Jolly).

## Source of truth (read in this order)

| File | Status | Use |
|---|---|---|
| `08-产品SPEC-v3.md` | **Current. Implement from this.** | Product definition, lifecycle state machine, 本纪 structure, avatar system, sharing mechanics, data model, demo scope |
| `07-设计SPEC-百年孤独版.md` | Partially superseded | Reuse: visual tokens, portrait frame, card/long-image layout, Playwright export. Ignore: 百年孤独 character mapping |
| `06-规划v2-百年孤独版.md` | Partially superseded | Background research and sources only |
| `02-产品SPEC.md` | Mostly superseded | Content red lines (§7) and "field names = future infobox" principle still apply |
| `03`–`05` | Superseded for demo | Historical context |
| `00-交接说明.md`, `01-思维路程.md` | Context | Roles and decision history |
| `muse.md` | Context | Review notes from Muse (another AI) |

**On conflict**: the newest-dated doc wins. If you can't tell which applies, stop and ask the human rather than guessing.

## Roles

- **七月**: top-level direction and specs. Does not write code.
- **神威**: planning and acceptance. Decides every item marked 【待拍板】.
- **Agents**: implement. When the spec doesn't cover a decision, list the options with a recommendation and escalate. Don't invent product direction.

## Hard rules

1. **Don't expand scope.** Build only what 08 §18 lists for the demo. Put new ideas in `docs/candidates.md` (create it if needed) and don't build them.
2. **Facts need official sources.** Every lifecycle event (born, head, yielded, notice, died, api-only, rest, preserved, afterlife, revived) needs a `source` URL, and that URL must be official. Secondary sites like endoflife.date or Wikipedia are for finding leads only. Never make up a date. If you can't verify one, mark it `【待核】` and leave it out of the published data.
3. **Keep data and presentation separate.** Facts live only in `data/**/*.yaml`. Templates never hardcode a fact.
4. **Bilingual-ready.** Chinese first (`content/zh/`). Every user-facing string goes through i18n or `{ zh, en }` fields so English can be added later without restructuring.
5. **Content red lines** (08 §16, 02 §7):
   - Don't invent official lore. Label fan content as 二创.
   - No R18 content. Nothing involving minors in fan content.
   - No brand-bashing between companies.
   - Write 本纪 in the third person. Never write in the model's own voice, except when quoting published official statements with a citation.
   - Don't encourage emotional dependence on AI. Include the mental-health resource footer on memorial pages and memory walls.
6. **Writing split**: AI may draft 本纪 sections 1, 3, 4 and 7. Sections 5, 6 and 9 (性情, 事迹, 卒与谥) must be written or signed off by a human. Mark AI drafts with `draft: ai` in front matter until a human reviews them.
7. **Never change a URL once published.** Ids are lowercase and hyphenated (`gpt-4o`, `claude-3-sonnet`).

## Conventions

- Docs are written in Chinese first. English versions use the `.en.md` suffix and come later.
- Ignore macOS `._*` resource-fork files. The repo lives on an exFAT drive.
- Stack defaults (08 §15, pending approval): Astro static site, Cloudflare D1 for memories and votes (decided 2026-09-26), html-to-image for share cards, Playwright for batch card export.
- Performance budget: first screen under 200KB excluding avatars; interactive in under 3s on mobile.

## Git

- Commit only when a human asks. Branch before committing if on the default branch.
- Follow any commit-attribution instructions your harness gives you.
