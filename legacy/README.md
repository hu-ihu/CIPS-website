# legacy/ —— 暂时无法转换的旧页面

这里的 HTML 会在 `npm run build` 的最后阶段（`scripts/postbuild.mjs`）**按原路径**复制进 `dist/`，
因此旧 URL 依然可以访问，但这些页面不参与 Astro 路由，也不会被模板重构影响。

## 目录约定

`legacy/` 内的相对路径 = 站点根路径：

```
legacy/wiki/cips/events/calendar/index.html
        -> dist/wiki/cips/events/calendar/index.html
        -> https://cips.nyist.edu.cn/wiki/cips/events/calendar/
```

只有 `.html` 文件会被复制（本 README 不会进入 `dist/`）。

## 当前内容

| 旧路径 | 情况 |
| --- | --- |
| `/wiki/cips/events/calendar/` | 旧站首页与 404 页都链接到这里，但旧站源码里从来没有这个页面；先放占位页，待补真实内容 |
| `/wiki/cips/finance/donate/` | 同上 |

这两个页面在旧站源码中就不存在（属于历史遗留的死链），重建时保留路径并给出占位说明，
避免访客撞上 404。补齐内容后，建议把它们改写成 `src/content/wiki/` 下的 Markdown 页面，
然后删除这里的对应文件。
