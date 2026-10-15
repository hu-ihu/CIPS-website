# 新增 / 修改 Wiki 页面

Wiki 是站内固定文档。文件放在 `src/content/wiki/` 下，**文件路径就是 URL 路径**：

| 文件 | URL |
| --- | --- |
| `src/content/wiki/cips/contact.md` | `/wiki/cips/contact/` |
| `src/content/wiki/cips/events/index.md` | `/wiki/cips/events/` |
| `src/content/wiki/index.md` | `/wiki/` |

（`index.md` 表示该目录的首页，URL 不带 `index`。旧站因为插件 bug 会出现
`/wiki/some/path/index/`，本站在代码里统一去掉了。）

## front matter

```yaml
---
title: "联系我们"                     # 必填
permalink: "/wiki/cips/contact/"     # 可选，仅当 URL 需要与文件路径不同时写
toc: true                            # 可选，默认 true：右侧显示目录
---

正文用 Markdown。页面标题由 front matter 提供，正文里不要再写一级标题（H1）。
```

## 左侧导航

Wiki 左侧导航不在 Markdown 里，而是在 `src/data/site.ts` 的 `WIKI_NAV` 中维护
（对应旧站的 `_data/navigation.yml`）。新增页面后如果需要出现在导航里，在那里加一条：

```ts
{ title: '页面标题', url: '/wiki/cips/xxx/' },
```

## 旧链接跳转（redirect_from）

旧站用 `jekyll-redirect-from` 插件生成跳转页，例如 `/wiki/mirrors/help/<镜像名>/`
会跳到 `/wiki/mirrors/help/`。迁移时这些规则被抽取到 `src/data/wiki-redirects.json`，
构建时会为每条规则生成一个带 `meta refresh` 的跳转页。新增跳转规则时追加一项：

```json
{ "from": "/wiki/old/path/", "to": "/wiki/new/path/" }
```

## 右侧目录

`toc: true` 时右侧会显示根据正文 H2/H3 生成的目录；不想显示就写 `toc: false`。
