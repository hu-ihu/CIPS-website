import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../data/site';
import { published, sortByDateDesc } from '../utils/content';
import { feedItems, rssFeed, xmlResponse } from '../utils/feed';

/** /feed.xml —— news + planet 全部内容 */
export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site ?? new URL(SITE.url)).href;
  const news = sortByDateDesc(published(await getCollection('news')));
  const planet = sortByDateDesc(published(await getCollection('planet')));
  const items = [...feedItems(news, 'news', baseUrl), ...feedItems(planet, 'planet', baseUrl)].sort(
    (a, b) => b.date.localeCompare(a.date),
  );

  return xmlResponse(
    rssFeed({
      title: SITE.title,
      description: SITE.description,
      baseUrl,
      selfPath: '/feed.xml',
      items,
    }),
  );
};
