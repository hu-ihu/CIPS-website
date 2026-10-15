import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../data/site';
import { groupBy, postPath, published, wikiPath } from '../utils/content';

const PER_PAGE = 5;

/** /sitemap.xml —— 对应旧站的 jekyll-sitemap 插件 */
export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL(SITE.url)).href.replace(/\/$/, '');
  const news = published(await getCollection('news'));
  const planet = published(await getCollection('planet'));
  const wiki = await getCollection('wiki');

  const urls = new Set<string>(['/', '/news/', '/planet/', '/wiki/', '/feed/', '/categories/', '/tags/']);

  for (const [collection, entries] of [
    ['news', news],
    ['planet', planet],
  ] as const) {
    for (const entry of entries) urls.add(postPath(collection, entry));
    const totalPages = Math.ceil(entries.length / PER_PAGE);
    for (let page = 2; page <= totalPages; page += 1) urls.add(`/${collection}/${page}/`);
  }

  for (const entry of wiki) urls.add(wikiPath(entry));

  for (const field of ['categories', 'tags'] as const) {
    for (const group of groupBy([...news, ...planet], field)) {
      urls.add(`/${field}/${encodeURIComponent(group.name)}/`);
    }
  }

  const body = [...urls]
    .sort()
    .map((path) => `  <url><loc>${base}${path}</loc></url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
