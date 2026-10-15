import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../../data/site';
import { published, sortByDateDesc } from '../../utils/content';
import { feedItems, rssFeed, xmlResponse } from '../../utils/feed';

/** /feed/planet.xml —— 仅 CIPS Planet */
export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site ?? new URL(SITE.url)).href;
  const entries = sortByDateDesc(published(await getCollection('planet')));

  return xmlResponse(
    rssFeed({
      title: `${SITE.title} - CIPS Planet`,
      description: `${SITE.subtitle} Planet`,
      baseUrl,
      selfPath: '/feed/planet.xml',
      items: feedItems(entries, 'planet', baseUrl),
    }),
  );
};
