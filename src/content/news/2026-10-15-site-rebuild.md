---
title: "本站已重建为 Astro 静态站点（占位新闻）"
date: "2026-10-15"
author: "CIPS"
categories: ["news"]
tags: []
permalink: "/news/2026/10/site-rebuild/"
---

**这是一条占位新闻**：它的作用是让新闻列表、分页、RSS 与详情页在刚重建完的站点上有真实数据可渲染。
发布正式内容后可以直接删除本文件（`src/content/news/2026-10-15-site-rebuild.md`）。

本站已从 Jekyll（minimal-mistakes 主题）迁移到 [Astro](https://astro.build/)，
构建产物是纯静态文件，不再需要 Ruby 运行时：

- 页面结构与样式改为手写 CSS，不再依赖主题的 SCSS；
- 文章（news / planet）与 Wiki 都改为 Markdown 内容集合；
- 旧站链接保持原样（`/news/<年>/<月>/<标题>/`、`/wiki/...`），旧地址不会失效。

新增新闻的写法见仓库里的 `docs/templates/news.md`。
