# 新增一篇 Planet 文章

Planet 是技术分享聚合栏目，写法与新闻完全一样，只是内容放在 `src/content/planet/`，
URL 前缀是 `/planet/`：

| 文件 | 最终 URL |
| --- | --- |
| `src/content/planet/2024-03-13-SPP-80.md` | `/planet/2024/03/spp-80/` |

front matter 字段与 [news.md](news.md) 相同（`title`、`date` 必填；`author`、`source`、
`categories`、`tags`、`permalink`、`draft` 可选）。

列表页每页 5 条：第 1 页 `/planet/`，第 2 页 `/planet/2/`。

正文里的图片放在 `public/static/` 下（旧站 Planet 的图片在 `public/static/news/`，沿用即可），
用 `/static/...` 绝对路径引用。
