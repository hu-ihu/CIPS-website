# 新增一条新闻（News）

1. 在 `src/content/news/` 下新建 Markdown 文件，文件名用 `YYYY-MM-DD-page-name.md`。
2. 文件开头写 front matter（两行 `---` 之间的 YAML），正文用 Markdown。
3. `npm run dev` 本地预览，`npm run build` 生成 `dist/`。

## 文件名与 URL

文件名里的日期只用来生成默认 URL，**front matter 里的 `date` 优先**：

| 文件 | `date` | 最终 URL |
| --- | --- | --- |
| `2025-12-08-ipv6-innovation-award.md` | `2025-12-08` | `/news/2025/12/ipv6-innovation-award/` |
| `2025-10-17-nyist-tech-exchange.md` | `2025-09-25` | `/news/2025/09/nyist-tech-exchange/` |

URL 规则与旧站一致：`/news/<年>/<月>/<标题 slug>/`。想让 URL 与推导结果不同时，显式写 `permalink`。

## front matter 字段

```yaml
---
title: "文章标题"            # 必填
date: "2025-12-08"           # 必填，必须是 YYYY-MM-DD 字符串（加引号）
author: "古宸豪"              # 可选
source: "南阳理工学院官网"     # 可选，列表页会显示「来源：…」
categories: ["news"]         # 可选，默认 []；用于 /categories/ 归档
tags: []                     # 可选，默认 []；用于 /tags/ 归档
permalink: "/news/2025/12/ipv6-innovation-award/"  # 可选，不写则按上面的规则推导
draft: false                 # 可选，默认 false；true 表示不发布
---

正文从这里开始，支持 Markdown。
```

> `date` 一定要写成带引号的字符串。不写引号时 YAML 会把它当日期解析，
> 在部分时区下可能被解析成前一天，导致 URL 里的年月与预期不符。

## 正文写法

- 图片放在 `public/static/news/` 下，正文里用绝对路径引用：`![说明](/static/news/xxx.jpg)`。
- 需要强调块时使用与旧站一致的 notice 写法（前后各留一个空行）：

  ```html
  <div class="notice notice--warning">

  注意内容

  </div>
  ```

- 站内链接写绝对路径（如 `/wiki/cips/contact/`），不要写 `.md` 相对链接——
  旧站那套相对链接由 Jekyll 插件解析，Astro 不再支持。

## 列表页与分页

新闻列表每页 5 条：第 1 页 `/news/`，第 2 页 `/news/2/`，以此类推；首页展示最新 5 条新闻。
