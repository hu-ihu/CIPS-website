import type { CollectionEntry } from 'astro:content';

export type PostCollection = 'news' | 'planet';
export type PostEntry = CollectionEntry<'news'> | CollectionEntry<'planet'>;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * 文章 URL。
 * 迁移后的文章都带 permalink（与旧站 /:collection/:year/:month/:title/ 一致）；
 * 手写新文章时可以不写 permalink，这里按文件名 YYYY-MM-DD-name.md 推导出同样的形状。
 */
export function postPath(collection: PostCollection, entry: PostEntry): string {
  if (entry.data.permalink) return entry.data.permalink;
  const base = entry.id.split('/').pop() ?? entry.id;
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})-(.+)$/.exec(base);
  const date = entry.data.date;
  const slug = match ? slugify(match[4]) : slugify(base);
  return `/${collection}/${date.slice(0, 4)}/${date.slice(5, 7)}/${slug}/`;
}

/** Wiki 页面 URL：优先用旧站 permalink，否则按内容路径推导（去掉扩展名与结尾的 index）。 */
export function wikiPath(entry: CollectionEntry<'wiki'>): string {
  if (entry.data.permalink) return entry.data.permalink;
  const path = entry.id
    .replace(/\.md$/, '')
    .replace(/\/index$/, '')
    .replace(/^index$/, '');
  return path ? `/wiki/${path}/` : '/wiki/';
}

/** 按日期倒序（同日按标题稳定排序）。 */
export function sortByDateDesc<T extends { data: { date: string; title: string } }>(entries: T[]): T[] {
  return [...entries].sort(
    (a, b) => b.data.date.localeCompare(a.data.date) || a.data.title.localeCompare(b.data.title, 'zh-CN'),
  );
}

/** 过滤草稿。 */
export function published<T extends { data: { draft?: boolean } }>(entries: T[]): T[] {
  return entries.filter((entry) => !entry.data.draft);
}

/** 汇总分类/标签及其文章，供归档页使用（按名称排序）。 */
export function groupBy(
  entries: PostEntry[],
  field: 'categories' | 'tags',
): { name: string; entries: PostEntry[] }[] {
  const groups = new Map<string, PostEntry[]>();
  for (const entry of entries) {
    for (const key of entry.data[field] ?? []) {
      const list = groups.get(key) ?? [];
      list.push(entry);
      groups.set(key, list);
    }
  }
  return [...groups.entries()]
    .map(([name, list]) => ({ name, entries: sortByDateDesc(list) }))
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
}

/** 生成 RSS / sitemap 用的绝对地址。 */
export function absoluteUrl(site: URL | undefined, path: string): string {
  const base = site?.href.replace(/\/$/, '') ?? '';
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** 把 Markdown 正文压成一段纯文本摘要，用于列表页。 */
export function plainExcerpt(markdown: string | undefined, maxLength = 120): string {
  if (!markdown) return '';
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ') // 代码块
    .replace(/<[^>]+>/g, ' ') // 内联 HTML
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接保留文字
    .replace(/^\s{0,3}#{1,6}\s+.*$/gm, ' ') // 标题行
    .replace(/^\s{0,3}>\s?/gm, '') // 引用
    .replace(/^\s{0,3}[-*+]\s+/gm, '') // 列表符号
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

