#!/usr/bin/env node
/**
 * 站内链接自检（零依赖）：扫描 dist/ 下所有 HTML 的 href/src，
 * 检查站内目标（以 / 开头）是否真实存在。迁移旧站后用它确认没有死链。
 *
 *   npm run build && node scripts/check-links.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

if (!fs.existsSync(dist)) {
  console.error('check-links: 找不到 dist/，请先运行 npm run build');
  process.exit(1);
}

const pages = walk(dist).filter((file) => file.endsWith('.html'));
/** @type {Map<string, Set<string>>} 缺失目标 -> 引用它的页面 */
const missing = new Map();

const exists = (urlPath) => {
  const target = path.join(dist, decodeURIComponent(urlPath));
  if (urlPath.endsWith('/')) return fs.existsSync(path.join(target, 'index.html'));
  if (fs.existsSync(target) && fs.statSync(target).isFile()) return true;
  // 无扩展名的目录式链接（旧站写法）也接受
  return fs.existsSync(path.join(target, 'index.html'));
};

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const page = path.relative(dist, file).replace(/\\/g, '/');
  for (const match of html.matchAll(/(?:href|src)="([^"]*)"/g)) {
    const ref = match[1];
    if (!ref.startsWith('/') || ref.startsWith('//')) continue; // 外链、锚点、mailto 等
    const target = ref.split('#')[0].split('?')[0];
    if (!target || target === '/') continue;
    if (exists(target)) continue;
    if (!missing.has(target)) missing.set(target, new Set());
    missing.get(target).add(page);
  }
}

if (missing.size === 0) {
  console.log(`check-links: 检查了 ${pages.length} 个页面，站内链接全部有效。`);
} else {
  console.error(`check-links: 发现 ${missing.size} 个无效的站内链接：`);
  for (const [target, from] of [...missing].sort()) {
    console.error(`  ${target}`);
    for (const page of [...from].slice(0, 5)) console.error(`      引用自 ${page}`);
  }
  process.exit(1);
}
