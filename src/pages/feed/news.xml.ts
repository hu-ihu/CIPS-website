import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../../data/site';
import { published, sortByDateDesc } from '../../utils/content';
import { feedItems, rssFeed, xmlResponse } from '../../utils/feed';

/** /feed/news.xml —— 仅 CIPS 新闻 */
export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site ?? new URL(SITE.url)).href;
  const entries = sortByDateDesc(published(await getCollection('news')));

  return xmlResponse(
    rssFeed({
      title: `${SITE.title} - CIPS 新闻`,
      description: `${SITE.subtitle} 新闻`,
      baseUrl,
      selfPath: '/feed/news.xml',
      items: feedItems(entries, 'news', baseUrl),
    }),
  );
};
