#!/usr/bin/env node
/**
 * 一次性迁移脚本：把旧 Jekyll 站点（pages/ 目录）的内容迁移到 Astro 内容集合。
 *
 * 说明
 * ----
 * - 旧站源码保存在本仓库的第一个提交（"chore: import original Jekyll site"）中，
 *   这个脚本保留下来是为了让迁移过程可复查、可重跑，而不是构建流程的一部分。
 * - 迁移是「保内容、改外壳」：Markdown 正文逐字保留，只做以下几类必要改写：
 *     1. Liquid 变量 `{{ site.static_url }}` -> `/static`
 *     2. 旧站内部相对链接 `xxx.md` -> 对应页面的绝对 URL（Jekyll 的
 *        jekyll-relative-links 插件在旧站上做的就是这件事）
 *     3. kramdown 段落属性 `{: .notice--warning }` -> `<div class="notice ...">`
 *     4. Font Awesome 图标标签（本站不再引入图标字体）-> 移除
 *     5. 正文开头的 H1 -> 提升为 front matter 的 title（旧站用
 *        jekyll-titles-from-headings 插件做同样的事）
 * - 用法：node scripts/legacy/migrate-jekyll.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const pagesDir = path.join(root, 'pages');
const contentDir = path.join(root, 'src', 'content');
const dataDir = path.join(root, 'src', 'data');

/* ------------------------------------------------------------------ helpers */

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const rel = (from, to) => path.relative(from, to).split(path.sep).join('/');

const unquote = (value) => {
  const v = value.trim();
  if (v.length >= 2 && v.startsWith('"') && v.endsWith('"')) return v.slice(1, -1);
  if (v.length >= 2 && v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1);
  return v;
};

/** 极简 YAML 解析：只覆盖旧站 front matter 实际用到的形态（标量 / 行内数组 / 块数组）。 */
function parseYamlLite(text) {
  const data = {};
  const lines = text.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      i += 1;
      continue;
    }
    const match = /^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*(.*)$/.exec(line);
    if (!match) {
      i += 1;
      continue;
    }
    const key = match[1];
    const inline = match[2].trim();
    if (inline === '') {
      const items = [];
      let j = i + 1;
      while (j < lines.length && /^\s+-\s+/.test(lines[j])) {
        items.push(unquote(lines[j].replace(/^\s+-\s+/, '')));
        j += 1;
      }
      if (items.length) {
        data[key] = items;
        i = j;
        continue;
      }
      data[key] = null;
      i += 1;
      continue;
    }
    if (inline.startsWith('[') && inline.endsWith(']')) {
      const inner = inline.slice(1, -1).trim();
      data[key] = inner
        ? inner
            .split(',')
            .map((s) => unquote(s))
            .filter(Boolean)
        : [];
      i += 1;
      continue;
    }
    data[key] = unquote(inline);
    i += 1;
  }
  return data;
}

/**
 * 按行解析 front matter。必须用行匹配而不是正则：旧站里大量页面是「空 front matter」
 * （第 1、2 行都是 ---），正则写法会把整篇正文当成 front matter 之外的内容。
 */
function parseFrontMatter(raw) {
  const text = raw.replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') return { data: {}, body: text };
  let end = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') {
      end = i;
      break;
    }
  }
  if (end === -1) return { data: {}, body: text };
  return {
    data: parseYamlLite(lines.slice(1, end).join('\n')),
    body: lines.slice(end + 1).join('\n'),
  };
}

/** Jekyll 的 Utils.slugify 行为：转小写，非 [a-z0-9] 折叠成 '-'。 */
const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const quote = (value) => JSON.stringify(String(value));

function emitFrontMatter(data) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map((v) => quote(v)).join(', ')}]`);
      continue;
    }
    if (typeof value === 'boolean' || typeof value === 'number') {
      lines.push(`${key}: ${value}`);
      continue;
    }
    lines.push(`${key}: ${quote(value)}`);
  }
  lines.push('---');
  return lines.join('\n');
}

/** 文件名里的日期：2024-9-22-foo.md -> { y: 2024, m: 9, d: 22, slug: 'foo' } */
function dateFromFilename(basename) {
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})-(.+)$/.exec(basename);
  if (!match) return null;
  return {
    iso: `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`,
    slug: match[4],
  };
}

const isIsoDate = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.trim());

/* ------------------------------------------------------- body 改写（保内容） */

/** 旧站里写错的绝对路径，迁移时顺手修正。 */
const ABSOLUTE_FIXES = new Map([['/cips/services/mirrors', '/wiki/cips/services/mirrors/']]);

function stripIconTags(body) {
  // 本站不再引入 Font Awesome，图标标签没有意义，去掉以免留下空元素。
  return body.replace(/<i\s+class="(?:fa|fas|far|fab|fal|fad)[^"]*"\s*><\/i>\s*/g, '');
}

function convertKramdownBlockAttributes(body) {
  // 形如：
  //   段落文字
  //   {: .notice--warning }
  const lines = body.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i += 1) {
    const attr = /^\{:\s*\.([A-Za-z0-9_-]+)\s*\}$/.exec(lines[i].trim());
    if (attr && out.length) {
      // 找到上一个非空段落
      let start = out.length - 1;
      while (start > 0 && out[start].trim() !== '') start -= 1;
      const paragraph = out.splice(start).join('\n').trim();
      // 原始 HTML 块前必须留空行，否则 Markdown 会把它并进上一段
      if (out.length && out[out.length - 1].trim() !== '') out.push('');
      out.push(`<div class="notice ${attr[1]}">`, '', paragraph, '', '</div>');
      continue;
    }
    out.push(lines[i]);
  }
  return out.join('\n');
}

function rewriteMarkdownLinks(body, collection, dirInCollection) {
  const base = collection === 'wiki' ? dirInCollection : '';
  return body.replace(/\]\(([^()\s]+)(\s+"[^"]*")?\)/g, (full, href, title = '') => {
    if (ABSOLUTE_FIXES.has(href)) return `](${ABSOLUTE_FIXES.get(href)}${title})`;
    // 外链（https://…、mailto:…）与锚点原样保留：它们也可能以 .md 结尾
    if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//') || href.startsWith('#')) return full;
    if (!href.endsWith('.md')) return full;
    const [linkPath, hash = ''] = href.split('#');
    let target = path.posix.normalize(path.posix.join(base, linkPath));
    // 旧站的 lug/ 前缀是 fork 自 USTC LUG 时留下的，实际页面都在 cips/ 下
    target = target.replace(/^lug\//, 'cips/');
    target = target.replace(/\.md$/, '').replace(/\/index$/, '');
    if (target === 'index') target = '';
    const url = `/${collection}${target ? `/${target}` : ''}/${hash ? `#${hash}` : ''}`;
    return `](${url}${title})`;
  });
}

function liftLeadingHeading(body) {
  const match = /^\s*#\s+(.+?)\s*(?:\r?\n|$)/.exec(body);
  if (!match) return { title: null, body };
  return { title: match[1].trim(), body: body.slice(match[0].length) };
}

function cleanBody(body, { collection, dirInCollection }) {
  let out = body;
  out = out.replace(/\{\{\s*site\.static_url\s*\}\}/g, '/static');
  out = stripIconTags(out);
  out = convertKramdownBlockAttributes(out);
  out = rewriteMarkdownLinks(out, collection, dirInCollection);
  return `${out.replace(/^\s*\n/, '').replace(/\s+$/, '')}\n`;
}

/* ------------------------------------------------------------------- 迁移器 */

const written = [];
const redirects = [];

function write(target, contents) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents, 'utf8');
  written.push(rel(root, target));
}

function migrateNewsLike(collection, sourceDir) {
  for (const file of walk(sourceDir)) {
    const basename = path.basename(file, '.md');
    if (basename.startsWith('_')) continue; // 模板单独处理
    const { data, body } = parseFrontMatter(fs.readFileSync(file, 'utf8'));
    const fromName = dateFromFilename(basename);
    const effectiveDate = isIsoDate(data.date) ? data.date.trim() : fromName?.iso;
    if (!effectiveDate) {
      throw new Error(`${rel(root, file)}: 无法确定日期（front matter 与文件名都没有）`);
    }
    const slug = slugify(fromName ? fromName.slug : basename);
    const front = {
      title: data.title || slug,
      date: effectiveDate,
      author: data.author || undefined,
      source: data.source || undefined,
      categories: data.categories || [],
      tags: data.tags || [],
      // 旧站 permalink: /:collection/:year/:month/:title/，URL 取自生效日期
      permalink: `/${collection}/${effectiveDate.slice(0, 4)}/${effectiveDate.slice(5, 7)}/${slug}/`,
    };
    write(
      path.join(contentDir, collection, `${basename}.md`),
      `${emitFrontMatter(front)}\n\n${cleanBody(body, { collection, dirInCollection: '' })}`,
    );
  }
}

function migrateWiki() {
  const sourceDir = path.join(pagesDir, '_wiki');
  for (const file of walk(sourceDir)) {
    const base = path.basename(file, '.md');
    if (base.startsWith('_')) continue;
    const relPath = rel(sourceDir, file);
    const dirInCollection = path.posix.dirname(relPath);
    const { data, body } = parseFrontMatter(fs.readFileSync(file, 'utf8'));

    let title = data.title || null;
    let workingBody = body;
    if (!title) {
      const lifted = liftLeadingHeading(workingBody);
      title = lifted.title;
      workingBody = lifted.body;
    } else {
      // 旧站插件会剥掉正文开头与 front matter 重复的 H1
      workingBody = liftLeadingHeading(workingBody).body;
    }
    if (!title) title = base;

    if (Array.isArray(data.redirect_from) && data.redirect_from.length) {
      const to = data.permalink || null;
      redirects.push({ from: data.redirect_from, to: to, source: relPath });
    }

    const front = {
      title,
      permalink: data.permalink || undefined,
    };
    write(
      path.join(contentDir, 'wiki', relPath),
      `${emitFrontMatter(front)}\n\n${cleanBody(workingBody, { collection: 'wiki', dirInCollection })}`,
    );
  }
}

function migrateTemplates() {
  // 旧站的三个 _template.md 是 Jekyll 时代的写作说明（目录、插件、prettier 等都变了），
  // 直接迁移会留下过时指引，因此改为手工维护 docs/templates/。
}

function main() {
  // 这是一次性迁移脚本：会清空并重建 src/content/ 与 src/data/wiki-redirects.json。
  // 迁移完成之后手写的内容（例如占位新闻）不会被重新生成，重跑前请先备份。
  console.warn('migrate-jekyll: 将清空并重建 src/content/（手写内容会丢失）');
  fs.rmSync(contentDir, { recursive: true, force: true });
  fs.mkdirSync(dataDir, { recursive: true });

  migrateNewsLike('news', path.join(pagesDir, '_news'));
  migrateNewsLike('planet', path.join(pagesDir, '_planet'));
  migrateWiki();

  // mirrors/help.md 的 redirect_from 列表：旧站用 jekyll-redirect-from 生成跳转页
  const wikiRedirects = [];
  for (const group of redirects) {
    const target = group.to || `/wiki/${group.source.replace(/\.md$/, '').replace(/\/index$/, '')}/`;
    for (const from of group.from) wikiRedirects.push({ from, to: target });
  }
  fs.writeFileSync(
    path.join(dataDir, 'wiki-redirects.json'),
    `${JSON.stringify(wikiRedirects, null, 2)}\n`,
    'utf8',
  );

  console.log(`迁移完成：写入 ${written.length} 个文件，重定向 ${wikiRedirects.length} 条`);
  for (const file of written.sort()) console.log(`  ${file}`);
}

main();
