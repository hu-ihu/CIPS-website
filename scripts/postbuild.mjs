#!/usr/bin/env node
/**
 * 构建后处理（由 `npm run build` 在 `astro build` 之后调用）：
 *
 * 1. 把 legacy/ 下「暂时无法转换的旧页面」按原路径复制进 dist/。
 *    legacy/ 内的目录结构就是站点根路径，例如
 *      legacy/wiki/cips/events/calendar/index.html -> dist/wiki/cips/events/calendar/index.html
 *    这样旧 URL 依然可访问，同时这些页面被隔离在 legacy/ 里，不参与 Astro 路由。
 * 2. 给正文里的 <img> 补上 loading="lazy" 与 decoding="async"。
 *    Astro 7 的默认 Markdown 处理器（Sätteri）不走 unified，配置 rehypePlugins 需要额外
 *    安装 @astrojs/markdown-remark；这里改在构建后统一处理，省掉一个依赖。
 *    页头 logo 在首屏内，保持立即加载。
 * 3. 写入 dist/.nojekyll（旧站一直有这个文件，纯静态托管下无副作用）。
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const legacy = path.join(root, 'legacy');

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('postbuild: dist/index.html 不存在，看起来 astro build 没有成功完成。');
  process.exit(1);
}

let copied = 0;
if (fs.existsSync(legacy)) {
  for (const file of walk(legacy)) {
    if (!file.endsWith('.html')) continue; // legacy/README.md 之类的说明文件不发布
    const target = path.join(dist, path.relative(legacy, file));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(file, target);
    copied += 1;
    console.log(`postbuild: ${path.relative(root, file)} -> ${path.relative(root, target)}`);
  }
}

// 正文图片懒加载：页头 logo 是首屏内的关键小图，先用占位符摘出来避免被改
const MASTHEAD_IMG = '<img src="/static/lug-penguin.png"';
const PLACEHOLDER = '\u0000MASTHEAD_IMG\u0000';

let lazyPatched = 0;
for (const file of walk(dist)) {
  if (!file.endsWith('.html')) continue;
  const html = fs.readFileSync(file, 'utf8');
  const marked = html.split(MASTHEAD_IMG).join(PLACEHOLDER);
  const patched = marked.replace(/<img (?![^>]*\bloading=)/g, () => {
    lazyPatched += 1;
    return '<img loading="lazy" decoding="async" ';
  });
  if (patched === marked) continue;
  fs.writeFileSync(file, patched.split(PLACEHOLDER).join(MASTHEAD_IMG), 'utf8');
}

fs.writeFileSync(path.join(dist, '.nojekyll'), '');
console.log(`postbuild: 完成（legacy 页面 ${copied} 个，图片懒加载 ${lazyPatched} 处）`);
