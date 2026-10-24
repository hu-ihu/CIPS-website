# legacy/ —— 暂时无法转换的旧页面

这里的 HTML 会在 `npm run build` 的最后阶段（`scripts/postbuild.mjs`）**按原路径**复制进 `dist/`，
因此旧 URL 依然可以访问，但这些页面不参与 Astro 路由，也不会被模板重构影响。

## 目录约定

`legacy/` 内的相对路径 = 站点根路径：

```
legacy/<路径>/index.html
        -> dist/<路径>/index.html
        -> https://cips.nyist.edu.cn/<路径>/
```

只有 `.html` 文件会被复制（本 README 不会进入 `dist/`）。

## 当前内容

**目前为空。** 之前放在这里的两个占位页已经改写成正式页面：

| 旧路径 | 现在 |
| --- | --- |
| `/wiki/cips/events/calendar/` | `src/content/wiki/cips/events/calendar.md` |
| `/wiki/cips/finance/donate/` | `src/content/wiki/cips/finance/donate.md` |

这两个路径在旧站源码里从来没有对应文件（属于历史遗留的死链），当时先放占位 HTML 避免
404；改成 wiki 页面后它们就能带上全站导航、侧栏与页脚，视觉上不再像"另一个网站"。
两者的正文目前仍是待补充的占位内容。

## 什么时候该用它

只有在遇到**确实无法用 Markdown / Astro 重建**的旧页面（例如带大量内联脚本或旧式表单）
时才往这里放文件。能改写的内容请优先放进 `src/content/`，它们才能享受统一的模板与样式。
