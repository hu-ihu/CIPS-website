import type { PostEntry } from './content';
import { plainExcerpt, postPath } from './content';

export interface FeedItem {
  title: string;
  url: string;
  date: string;
  description: string;
  categories: string[];
}

const escapeXml = (value: string) =>
  value.replace(
    /[<>&'"]/g,
    (char) =>
      ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char] as string,
  );

/** 把内容集合条目转成 feed item。 */
export function feedItems(
  entries: PostEntry[],
  collection: 'news' | 'planet',
  baseUrl: string,
): FeedItem[] {
  return entries.map((entry) => ({
    title: entry.data.title,
    url: new URL(postPath(collection, entry), baseUrl).href,
    date: entry.data.date,
    description: plainExcerpt(entry.body, 200),
    categories: entry.data.categories,
  }));
}

/** 生成 RSS 2.0 feed（不引入额外依赖）。 */
export function rssFeed(options: {
  title: string;
  description: string;
  baseUrl: string;
  selfPath: string;
  items: FeedItem[];
}): string {
  const { title, description, baseUrl, selfPath, items } = options;
  const self = new URL(selfPath, baseUrl).href;
  const lastBuildDate = items[0]
    ? new Date(`${items[0].date}T00:00:00+08:00`).toUTCString()
    : new Date(0).toUTCString();

  const body = items
    .map((item) => {
      const pubDate = new Date(`${item.date}T00:00:00+08:00`).toUTCString();
      const categories = item.categories
        .map((category) => `      <category>${escapeXml(category)}</category>`)
        .join('\n');
      return [
        '    <item>',
        `      <title>${escapeXml(item.title)}</title>`,
        `      <link>${escapeXml(item.url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(item.url)}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <description>${escapeXml(item.description)}</description>`,
        categories,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(baseUrl)}</link>`,
    `    <description>${escapeXml(description)}</description>`,
    '    <language>zh-CN</language>',
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(self)}" rel="self" type="application/rss+xml" />`,
    body,
    '  </channel>',
    '</rss>',
    '',
  ]
    .filter((line) => line !== '')
    .join('\n');
}

export const xmlResponse = (xml: string) =>
  new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
