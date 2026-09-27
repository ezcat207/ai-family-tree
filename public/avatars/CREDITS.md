# 画像来源说明

## 家徽（`family-*.svg`）

各 AI 家族的官方商标，用于在「AI 家谱」中**指称对应的产品/公司**
（nominative use），不表示任何官方授权、赞助或关联。本站为非官方粉丝项目，
详见 `/about`。

| 文件 | 商标 | 来源 | 备注 |
|---|---|---|---|
| `family-chatgpt.svg` | OpenAI blossom symbol | Wikimedia Commons `File:OpenAI_logo_2025_(symbol).svg` | PD-textlogo；商标归 OpenAI |
| `family-claude.svg` | Claude AI symbol | Wikimedia Commons `File:Claude_AI_symbol.svg` | CC0；商标归 Anthropic |
| `family-deepseek.svg` | DeepSeek whale icon | Wikimedia Commons `File:DeepSeek-icon.svg` | MIT（DeepSeek）；商标归 DeepSeek |
| `family-muse.svg` | Meta logo | Wikimedia Commons `File:Meta_Platforms_Inc._logo.svg` | PD-textlogo；商标归 Meta；Muse 为 Meta 产品，此处用公司标志指称 |

**豆包家没有家徽文件**：官方形象是"豆包姐姐"3D 渲染助手角色，不是可指称性使用的商标符号，
直接搬官方渲染图的版权风险比用一个商标符号高得多。改用 `src/lib/portrait.ts` 里按其
特征（短发、黑色上衣、腮红大眼）重绘的矢量小画像，见 `docs/design.md` §4。

## 成员拟人形象（`mascot-*.png`）

各家族成员的拟人化肖像，优先级高于家徽。官方形象会注明官方，社区二创会明确标注
**非官方二创**，不表示权利方授权、赞助或关联。

| 文件 | 形象 | 来源 | 协议/备注 |
|---|---|---|---|
| `mascot-muse.png` | Jolly（Muse 默认头像） | Muse 官方产品内默认 avatar | 官方形象；版权归 Meta |
| `mascot-claude.png` | Clawd 像素小螃蟹（静态帧） | GitHub `quinnjr/claude-crab` 的 `tools/gen_sprites.py` 生成 | MIT；社区项目，非 Anthropic 官方 |
| `mascot-deepseek.png` | 鲸鱼娘（DeepSeek 拟人） | GitHub `ljwei-stak/model-router-galgame` 的 `aipicture/DeepSeek1.png` | MIT；社区二创，非 DeepSeek 官方 |

ChatGPT 家族暂无经确认的拟人形象，成员肖像回退显示家徽。豆包家没有家徽也没有拟人形象，
回退到 `portraitSVG` 按特征重绘的矢量画像（不是"假画像"，是特征重绘，见上）。

如权利方对使用方式有异议，请联系撤下对应文件。
