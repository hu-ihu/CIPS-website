# CIPS @ NYIST 网站

南阳理工学院-计算机与信息化处理协会（CIPS @ NYIST）官方网站。

旧站是 Jekyll + [minimal-mistakes](https://mmistakes.github.io/minimal-mistakes/) 主题，
本仓库已重建为 **Astro 静态站点**：`npm run build` 直接产出可部署的纯静态文件 `dist/`，
不需要 Ruby，也不需要 Node 常驻服务，且不引入任何 UI 框架（无 React / Vue / Tailwind）。

- 主仓库（唯一主仓库）：<https://git.nyist.edu.cn/cips/cips-website>（git.nyist 的 GitLab）
- 站点地址：<https://cips.nyist.edu.cn>
- 许可：[CC BY-NC-SA 4.0](LICENSE.md)

## 目录结构

```
astro.config.mjs         Astro 配置（site / trailingSlash / legacy 开关）
src/content.config.ts    内容集合（news / planet / wiki）的 schema
src/content/news/        新闻（Markdown，文件名 YYYY-MM-DD-slug.md）
src/content/planet/      Planet 文章（Markdown）
src/content/wiki/        Wiki 文档（Markdown，路径即 URL）
src/data/site.ts         站点级配置：标题、导航、页脚链接、备案号（待补充）
src/data/wiki-redirects.json  旧站 redirect_from 抽取出的跳转规则（58 条）
src/components/          页面组件（Masthead / Footer / Icon / 列表 / 分页 / 侧栏…）
src/layouts/             BaseLayout / PostLayout / WikiLayout
src/pages/               路由：首页、404、news、planet、wiki、feed、categories、tags、sitemap
src/styles/global.css    全站样式（手写 CSS，替代旧主题的 SCSS）
src/utils/               URL 推导、日期排序、摘要、RSS 生成、图标路径数据（icons.ts）
public/static/           图片等静态资源（对应旧站 /static/...）
public/robots.txt        robots.txt
legacy/                  暂时无法转换的旧页面（按原路径复制进 dist/，目前为空）
scripts/postbuild.mjs    构建后处理：复制 legacy/、写 .nojekyll
scripts/check-links.mjs  站内死链自检（零依赖）
scripts/legacy/migrate-jekyll.mjs  一次性迁移脚本（旧站源码见本仓库首个提交）
docs/templates/          如何新增 News / Planet / Wiki 页面
.gitlab-ci.yml           CI：构建并把 dist/ 强推到 pages 分支
```

## 本地开发与构建

需要 **Node.js >= 22.22.0**（Astro 7 的要求；本仓库在 Node 24 上验证通过）。

```bash
npm ci            # 安装依赖（package-lock.json 已提交，CI 使用同一条命令）
npm run check     # 类型检查（astro check，CI 里也会跑）
npm run build     # 构建，产物在 dist/（含 postbuild 处理）
npm run preview   # 预览 dist/ ← 本地看页面用这个（见下方说明）
node scripts/check-links.mjs   # 可选：检查 dist/ 里的站内链接是否有死链
```

> **`npm run dev` 当前不可用**：能启动、但随即报
> `Failed to create the dev server app: require is not defined`（上游 Astro 7.4.x + Vite 8
> 的 CJS 互操作问题，7.4.2 仍未修，详见「已知问题」）。本地预览请用
> `npm run build && npm run preview`，改完内容重新 build 即可——只是没有 HMR 热更新。

`npm run build` 之后，`dist/` 就是**可直接托管**的静态站点，用任意静态服务器
（Nginx / Apache / `python -m http.server`）指向该目录即可，不需要 Node 运行时。

## 分支策略

| 分支 | 内容 | 谁写入 |
| --- | --- | --- |
| `main` | 站点源码（Astro + 内容 + CI 配置） | 人工提交 |
| `pages` | `dist/` 的构建产物（纯静态文件，直接可托管） | CI 强推，**不要手改** |

`pages` 分支由 CI 在每次 `main` 有新提交时强制覆盖，因此不要直接在 `pages` 上提交内容。

## CI 配置（GitLab）

git.nyist.edu.cn 是 **GitLab** 实例（已由维护者确认；旧站的 `wiki/cips/services/gitlab` 一页
也是把该域名描述为 GitLab）。CI 用 [`.gitlab-ci.yml`](.gitlab-ci.yml)，流程是：

1. `build` 阶段：`npm ci` → `npm run check`（类型检查）→ `npm run build`，把 `dist/` 作为 artifact 上传；
2. `deploy:pages` 阶段：进入 `dist/`，`git init -b pages`，提交后强推到远端 `pages` 分支。

### 需要配置的 Secret

仓库 **Settings → CI/CD → Variables** 添加：

| 变量名 | 值 | 说明 |
| --- | --- | --- |
| `PAGES_PUSH_TOKEN` | 一个有写权限的 Token | 勾选 **Masked**；若流水线只在受保护分支跑，可同时勾选 Protected |

Token 可以是 Project Access Token（Role 至少 `Developer`，Scopes 勾 `write_repository`）
或 Personal Access Token（同样需要 `write_repository`）。CI 里用
`https://oauth2:${PAGES_PUSH_TOKEN}@${CI_SERVER_HOST}/${CI_PROJECT_PATH}.git` 推送。

> 注意：`pages` 分支**不要**设为受保护分支（或允许该 Token 推送），否则强推会被拒绝。

### Runner 标签

`.gitlab-ci.yml` 里现在是 `tags: []`，表示「不要求 tag」，会落到任意可用的共享 Runner 上。
项目级的 **Settings → CI/CD → Runners** 页面上，共享 Runner 一栏**空着也不代表没有可用
Runner**——共享 Runner 是实例级配置，只有 Admin Area 能看到全貌。

**最快的判断方式是让流水线自己说。** 首次推送后如果作业一直 pending，卡住的作业页面会直接写明原因：

| 页面提示 | 含义 | 处理 |
| --- | --- | --- |
| `you don't have any runners online assigned to this project` | 实例没开共享 Runner，项目也没挂自己的 Runner | 找管理员注册 Runner（或给项目分配一个） |
| `there are no runners that match all of the job's tags: docker` | 有 Runner，但它要求 tag，提示里**直接列出了 tag 名** | 把 `tags: []` 改成 `tags: [docker]` |

即：第二条提示里冒号后面的词，就是要填进 `tags:` 的值。多个 tag 是「同时满足」的关系，
一般填一个就够。

> 仓库首页侧栏出现「+ 配置 CI/CD」「+ 启用 Auto DevOps」之类的按钮，只说明**远端仓库里
> 还没有 `.gitlab-ci.yml`**（首次推送前必然如此），与 Runner 无关。**不要点「启用 Auto DevOps」**，
> 它会注入一套自己的 CI 逻辑，和本仓库的配置冲突。

## 部署（CD）

本仓库**不负责部署**，只保证 `pages` 分支是可直接托管的静态文件。
请在学校侧（Web 服务器 / 反向代理）配置监听 `pages` 分支的方式，例如：

- 在服务器上定时 `git fetch && git reset --hard origin/pages`（或用 GitLab 的 Webhook 触发），
  站点根目录指向该工作副本；
- 或让 Webhook 把 `pages` 分支的内容同步到发布目录。

站点是纯静态的，因此不需要任何运行环境或构建步骤；`.nojekyll` 也会被写入 `dist/`
（托管在 GitHub Pages 类环境时可跳过 Jekyll 处理，普通服务器无副作用）。

## 新增 / 修改内容

| 想做什么 | 看哪里 |
| --- | --- |
| 发一条新闻 | [`docs/templates/news.md`](docs/templates/news.md) |
| 发一篇 Planet 文章 | [`docs/templates/planet.md`](docs/templates/planet.md) |
| 新增 / 修改 Wiki 页面 | [`docs/templates/wiki.md`](docs/templates/wiki.md) |
| 改站点标题、导航、页脚、备案号 | `src/data/site.ts` |
| 改样式 | `src/styles/global.css` |
| 改图标 / 加图标 | `src/utils/icons.ts` + `src/components/Icon.astro`（见下） |

### 图标

图标是一套自绘的内联 SVG（24×24 画布、线性描边、颜色跟随 `currentColor`），
不依赖任何图标字体或 CDN。用法：

```astro
---
import Icon from '../components/Icon.astro';
---

<Icon name="calendar" size={16} />
```

要加新图标，在 `src/utils/icons.ts` 的 `ICONS` 里加一条（键名即图标名，值是 24×24
坐标系下的 SVG 片段），然后就能用 `<Icon name="新名字" />`；`IconName` 类型会约束
`src/data/site.ts` 里的导航配置。另外 `Icon.astro` 里有构建期断言，图标名不存在会**直接
让构建失败**并列出可用图标（双保险：`IconName` 类型 + 运行时断言，`npm run check` 在 CI 里再卡一道）。

旧站图标与新站图标的对应关系：

| 位置 | 旧站（Font Awesome） | 新站 |
| --- | --- | --- |
| 主导航 | `fa-star-shooting` / `fa-newspaper` / `fa-planet-ringed` / `fa-github` / `fa-server` | `book` / `newspaper` / `planet` / `git-branch`（改为 GitLab）/ `server` |
| Wiki 侧栏 | `fa-home`、`fa-link`、`fa-database`、`fa-sparkles`、`fa-envelope-open-text`、`fa-user-tie`、`fa-phone-alt`、`fa-users-medical`，三个服务页原本都是 `fa-server` | `home`、`link`、`database`、`sparkles`、`envelope`、`user`、`phone`、`users`，三个服务页区分为 `server` / `git-branch` / `deploy` |
| 首页与 404 磁贴 | `fa-linux`、`fa-tv`、`fa-compact-disc`、`fa-chevron-circle-right`、`fa-calendar-alt`、`fa-comments`、`fa-thumbs-up`、`fa-link` | `tile-mirror`、`tile-iptv`、`tile-pxe`、`tile-more`、`tile-calendar`、`tile-contact`、`tile-donate`、`tile-links`（**彩色**，见下） |
| 页脚 | `fa-address-card`、`fa-phone-alt`、`fa-users`、`fa-rss`、`fa-github` | `id-card`、`phone`、`users`、`rss`、`git-branch` |
| 文章元信息 | `fa-calendar-alt`（日期）、`fa-clock`（阅读时长） | `calendar`（日期）、`user`（作者）、`link`（来源）；旧站未启用阅读时长，故未加 |
| 正文 notice | 正文里手写 `<i class="fas fa-fw fa-exclamation-circle">` | 由 CSS 的 `mask` 贴 `info` / `alert` 图标（`global.css` 里的 `--icon-info` / `--icon-alert`），正文保持干净 |

### 彩色磁贴图标与水印

首页与 404 的 8 个服务磁贴用**彩色图标**（`tile-mirror`、`tile-calendar` 等），对应旧站那套 Font Awesome
彩色/双色调图标。它们的填充色直接写在 `src/utils/icons.ts` 的路径上（`fill="#…"`），**不跟随
`currentColor`**，所以磁贴的强调色只作用于底色与标签文字。其余位置的图标仍是单色描边、跟随文字颜色。

页面背景还叠了一层**校徽水印**：`public/static/watermark.png` 平铺在 `body` 的 `background-image` 里，
上面压了一层 96% 不透明的同色渐变，因此实际强度约 4%（见 `global.css` 的 `body` 规则）。想调强弱就改
那层渐变的透明度；想只在首页出现，把这条 `background-image` 挪到 `.lug-nav::before` 之类的局部容器上即可。

水印素材由 `public/static/NYIST_logo.png` 处理而来：裁掉底部中文书法只留圆形校徽 → 白底转透明
（`alpha = 255 - min(r, g, b)`）→ 统一染成品牌红 `#9e1111` → 缩到 240px 宽。换素材后按同样步骤重做。

开源镜像站的 Tux 直接用了**官方矢量图**：`public/static/tux-bw.svg`（[garrett/Tux](https://github.com/garrett/Tux)
的线稿版，CC0）。`ServiceTiles.astro` 会在构建时检查 `public/static/tux.svg` 与 `public/static/tux-bw.svg`，
命中哪个用哪个；两者都不存在就退回 `src/utils/icons.ts` 里自绘的 Tux。

### URL 规则（与旧站保持一致）

- 文章：`/news/<年>/<月>/<标题 slug>/`，Planet 同理（前缀 `/planet/`）。
  年月取自 **front matter 的 `date`**（不是文件名），标题取自文件名去掉日期后的部分并做 slug 化。
- Wiki：`/wiki/<文件路径去掉 .md 与结尾 index>/`；需要不同 URL 时在 front matter 写 `permalink`。
- 列表分页：每页 5 条，第 1 页 `/news/`，第 2 页 `/news/2/`……
- 旧站的两个特例已保留：`2025-10-17-nyist-tech-exchange.md` 的 `date` 是 `2025-09-25`
  （URL 为 `/news/2025/09/`）；`src/content/wiki/server/pxe/pxe.md` 用显式
  `permalink: /wiki/server/pxe/`。

## 内容迁移说明

- 旧站内容全部迁移：14 篇新闻、6 篇 Planet、19 篇 Wiki 文档，以及 58 条 `redirect_from`
  跳转规则（`src/data/wiki-redirects.json`，构建时生成带 `meta refresh` 的跳转页）。
- 另外新增 1 条**占位新闻** `src/content/news/2026-10-15-site-rebuild.md`，
  用于验证列表/详情/RSS 渲染，发布正式内容后可直接删除。
- 图片与附件从旧站的 `static/` 迁到 `public/static/`，正文里的
  `{{ site.static_url }}` 已改写为 `/static`（旧站 `static_url` 本身就是 `/static`）。
- 旧站正文里的 `.md` 相对链接已按 Jekyll 规则改写成对应的绝对 URL。
- 两个旧站源码中就不存在的死链页面（首页与 404 页有链接，但没有对应文件）已补成正式页面：
  `/wiki/cips/events/calendar/` 与 `/wiki/cips/finance/donate/`，文件在 `src/content/wiki/` 下，
  因此带全站导航、侧栏与页脚；正文仍是待补充的占位内容。
- 旧站的 Jekyll 源码（`_config.yml`、`_sass/`、`_includes/`、`_plugins/`、`_data/`、
  `pages/`、`static/` 等）已在本仓库**首个提交**中完整保留，需要对照旧内容时可用
  `git show <首个提交>:<路径>` 查看。`scripts/legacy/migrate-jekyll.mjs` 是当时的一次性迁移脚本，
  重跑它会清空并重建 `src/content/`（手写内容会丢失），一般不需要再执行。

## 与旧站的差异（有意为之的简化）

| 项目 | 说明 |
| --- | --- |
| 样式 | 不再使用 minimal-mistakes 的 SCSS，改为手写 `src/styles/global.css`（视觉风格保持一致）。首页磁贴沿用旧站的三段式排布——左磁贴块 / 简介 / 右磁贴块，磁贴无间隙拼接、简介夹在中间，见 `global.css` 的 home tiles 段 |
| 图标 | 旧站用 Font Awesome Pro（`kit-pro.fontawesome.com` 的 kit + 未入库的 `_extra/fontawesome/`），其中 `fad` 双色与 `fa-star-shooting`、`fa-planet-ringed`、`fa-sparkles`、`fa-users-medical` 等属 Pro 专有内容，授权上不能复制其路径数据；新站改为**自绘的内联 SVG 图标集**（`src/utils/icons.ts` + `src/components/Icon.astro`），零依赖、无外部请求、颜色跟随 `currentColor`。旧站各处图标已按语义对应回来，见下 |
| 站内搜索 | 旧站声明了 Algolia 但从未填入可用凭据，本次未迁移；如需站内搜索请另行确认方案 |
| 评论 | 旧站未启用可用评论系统，未迁移 |
| 代码格式化 | 不再使用 prettier（`.prettierignore` / `.prettierrc.json` 已删除） |
| 仓库链接 | 导航与页脚不再出现 GitHub 链接，改为指向 git.nyist 的 GitLab |
| 备案号 | 页脚按 os.nju.edu.cn 的结构保留「ICP 备案 + 公安备案 + 更新时间 + Powered by Astro」。备案号沿用 **nyist.edu.cn 主站**（`cips.nyist.edu.cn` 是其子域），数值取自学校官网 www.nyist.edu.cn 页脚：`豫ICP备05011695号` / `豫公网安备 41130202000350号` |
| 文章作者 | 旧站用 `_data/authors.yml` 做作者映射，新站直接在 front matter 写 `author` 字符串 |
| 社交分享 / SEO | 旧站没有 Open Graph；新站补了 `og:*`、`twitter:*`、`theme-color`、`canonical`，文章页还会用自身 hero 图作为分享图，另有一张 1200×630 的默认分享图 `public/static/og-default.jpg` |

## 已知问题

Astro 7.4.x + Vite 8.3.4 组合下，内容同步（`astro sync` / `astro build`）会用一个
`ssr: { external: [] }` 的临时 Vite 服务器加载 `src/content.config.ts`；而
`astro/loaders` 的 glob loader 会引入一批 CJS 依赖（`yaml`、`picomatch`、`tinyglobby`、
`p-limit`、`piccolore`…），这些依赖被内联并按 ESM 求值，会直接报 `require is not defined`。

因此 `astro.config.mjs` 中启用了 `legacy.collectionsBackwardsCompat: true`，
由 Astro 自己在 Node 原生上下文中创建 glob loader（`src/content.config.ts` 里只写 schema，
不写 `loader`）。**功能与写法不受影响**，只是内容条目的 `id` 会带 `.md` 后缀，
代码里已在 `src/utils/content.ts` 统一去掉。

同一个根因还会让 **`astro dev` 起不来**：开发服务器创建 SSR handler 时报
`Failed to create the dev server app: require is not defined`（`legacy` 开关只救了内容同步
这一条路径，dev 的 SSR 打包仍会内联 CJS）。已在 7.4.0 和 7.4.2 上复现。
所以本地预览用 `npm run build` + `npm run preview`；等上游修复后 `npm run dev` 会自然恢复。

上游修复后可以改回显式写法：

```ts
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: postSchema,
});
```

并删掉 `astro.config.mjs` 里的 `legacy` 配置。

## 需要补充的信息（待补充）

以下内容需要站点负责人确认后填写，代码里都已标出位置：

1. **Runner 标签**：`.gitlab-ci.yml` 里是 `tags: []`，若作业一直 pending 就要按要求填实际 tag
   （见上文「Runner 标签」）。
2. **`PAGES_PUSH_TOKEN`**：需要在 GitLab 仓库里创建并配置（见上文「需要配置的 Secret」）。
3. **CD 侧监听 `pages` 分支的方式**：需要在学校 Web 服务器上配置。
4. **站点信息**：`src/data/site.ts` 里的 `url`、`email`、`address`、`repository`、`mirrors`
   是否与现状一致。
5. **`/wiki/cips/events/calendar/` 与 `/wiki/cips/finance/donate/` 的正文**：
   两个页面已改写成 `src/content/wiki/` 下的正式页面（带全站框架），但正文仍是占位内容。
6. **占位新闻**：`src/content/news/2026-10-15-site-rebuild.md` 发布正式新闻后请删除。
7. **首页文案与友情链接**：取自旧站，是否需要更新。
8. **站内搜索 / 评论 / 统计**：如确有需要，请确认选用方案。

已确认的项：

- **备案号**：沿用 nyist.edu.cn 主站，`豫ICP备05011695号` / `豫公网安备 41130202000350号`
  （取自学校官网页脚）。旧站页脚里注释掉的 `皖ICP备05002528号` 是 USTC 的，未采用。
- **社交分享图**：默认图 `public/static/og-default.jpg`（1200×630），由深色蒙版 + 校园实景
  + 标题与协会印章合成，需要换图时直接替换该文件即可。
- **CI 平台**：已确认 git.nyist 是 **GitLab**，CI 配置为 `.gitlab-ci.yml`（不再保留 Gitea 版本）。

## 许可与致谢

本仓库及本网站以 [CC BY-NC-SA 4.0](LICENSE.md) 许可协议开源。

首页「开源镜像站」磁贴的 Tux 使用 [garrett/Tux](https://github.com/garrett/Tux) 的矢量版
（`public/static/tux-bw.svg`）：原始插画 Larry Ewing（1996，GIMP），Garrett LeSage 用 Inkscape
重绘，IFo Hancroft 整理润色，以 **CC0 1.0 公共领域**发布；kernel.org 的
`doc/Documentation/images/logo.svg` 与之同源。其余图标为本站自绘。
